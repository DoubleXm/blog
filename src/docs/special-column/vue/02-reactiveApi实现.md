## reactive, shallowReactive, readonly, shallowReadonly API 实现

> 总所周知 `vue3` 的响应式是通过 `proxy` 来实现的，那具体是如何搞的呢？
>
> 这篇不讲更新，不讲依赖收集，就单纯的看看代理是如何实现的。

**声明，本篇内容尽可能贴近 vue 源码。过程中文件名，方法名尽可能与源码保持一致。**

### 方法的创建

在创建之初，分析方法特点。

- 所有方法均接收一个值，并返回这个值的代理值。
- 方法从使用方面可以分为两组，是 **深层** 还是 **浅层** 代理。
- 方法从设置方面又有了 `readonly` 的概念。

创建文件 `reactivity/reactive.ts`

::: code-group

```ts [reactive.ts]
export function reactive(target) {
  //
}
export function shallowReactive(target) {
  //
}
export function readonly(target) {
  //
}
export function shallowReadonly(target) {
  //
}
```

:::

### 共用的 proxy 方法封装 createReactiveObject

上面的四个 `api` 都需要使用 `proxy` 进行代理，每个都写一遍不太实际。所以可以通过 **柯里化** 的方式进行统一的封装。

::: code-group

```ts [reactive.ts]
import { isObject } from '@vue/shared/src';

// 缓存
const readonlyMap = new WeakMap();
const reactiveMap = new WeakMap();

/**
 * @param target 传递进来的值
 * @param isReadonly 是否只读
 * @param baseHandler proxy 的 handler
 */
function createReactiveObject(target, isReadonly, baseHandler) {
  // 只代理对象
  if (!isObject(target)) {
    return target;
  }

  const proxyMap = isReadonly ? readonlyMap : reactiveMap;

  // 是否已经被代理过，如果被代理过将被代理的值返回
  const exisitProxy = proxyMap.get(target);
  if (exisitProxy) {
    return exisitProxy;
  }

  const proxy = new Proxy(target, baseHandler);
  // 每次代理之后将被代理的值存入缓存中
  proxyMap.set(target, proxy);

  return proxy;
}
```

```ts [reactive.ts]
export function reactive(target) {
  return createReactiveObject(target, false, {});
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, {});
}
export function readonly(target) {
  return createReactiveObject(target, true, {});
}
export function shallowReadonly(target) {
  return createReactiveObject(target, true, {});
}
```

:::

以上代码示例中，使用了 `isObject` 方法，来自于 `shared` 共享模块中的方法。实现如下：

```ts
export const isObject = (val) => typeof val === 'object' && val !== null;
```

### 共用 handler 的封装

上面成功的 4 个 `api` 的 `proxy` 进行抽离成了一个 `createReactiveObject` 方法并进行调用。但是根据 [方法的创建](02-reactiveApi实现#方法的创建) 中分析。`handler` 仍然可以进行分类并抽离。

- `readonly` 不需要 `set`，或者说 `set` 时需要抛出异常。
- **深层** 或 **浅层** 代理浅层的代理需要进行区分。

到此得出结论：仍然使用 **柯里化** 的方式对 `handler` 处理。创建出统一的 `getter` 和 `setter`

创建文件 `reactivity/baseHandler.ts`

::: code-group

```ts [baseHandler.ts]
import { isObject, extend } from '@vue/shared/src';
import { readonly, reactive } from '.';

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);

/** 通用的 getter */
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, reciver) {
    const res = Reflect.get(target, key, reciver);

    if (!isReadonly) {
      // TODO 如果不是只读，就要考虑后面的依赖收集和更新的问题
    }

    // 如果是浅代理，直接返回即可
    if (shallow) {
      return res;
    }

    // 如果是对象，取值的时候再次进行代理 （递归）
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

// readonly 不需要 setter
const readonlySet = {
  set: function (target, key) {
    console.warn(`set on key ${key} falied`);
  }
};

const set = createSetter();
const shallowSet = createSet(true);

/** reactive 要用的 setter */
function createSetter(shallow = false) {
  // 该方法的参数来自于 proxy handler 中的 setter
  return function set(target, key, val, reciver) {
    const res = Reflect.set(target, key, val, reciver);
    return res;
  };
}

// 需要导出的 handler
export const mutableHandler = {
  get,
  set
};
export const shallowReactiveHandler = {
  get: shallowGet,
  set: shallowSet
};
export const readonlyHandler = extend({
  get: readonlyGet,
  readonlySet
});
export const shallowReadonlyHandler = extend({
  get: shallowReadonlyGet,
  readonlySet
});
```

```ts [reactive.ts]
// 完善 api 的 handler 调用
import {
  mutableHandler,
  shallowReactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler
} from './baseHandler.ts';

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandler);
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandler);
}
export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandler);
}
export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandler);
}
```

:::

以上代码示例中，在 `baseHandler.ts` 使用了 `extend` 方法，来自于 `shared` 共享模块中的方法。实现如下：

```ts
export const extend = Object.assign;
```

最后在 `index.ts` 进行统一的导出。

```ts
export {
  reactive,
  shallowReactive,
  readonly,
  shallowReadonly
} from './reactive';
```

## 代码调试

1，将项目进行打包 `pnpm build`，也可使用 `pnpm dev` 只运行 `reactivity` 模块进行调试。

2，与 `packages/` 平行 创建 `examples/reactive.html`，引入打包后的文件。如下：（具体可以查看每个模块下的 `dist` 目录）

```html
<script src="../packages/reactivity/dist/reactivity.global.js"></script>
```

3，下入示例代码，并在浏览器运行即可。

## 总结

![流程梳理](/vue/processon-01.jpg)

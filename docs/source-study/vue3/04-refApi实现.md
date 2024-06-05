`ref` 是 `vue3` 绕不开的一个话题，因为 `reactive` 实现的响应式仅对于复杂数据类型生效，那针对简单数据类型就访问以及依赖收集就是个问题。

`vue` 对其使用的方式就是通过 `class` 中的属性访问器，`getter` 和 `setter` 实现，编译成 `es5` 核心就是 `defineProperty`。[文档](https://cn.vuejs.org/api/)

## ref、shallowRef

新建 `reactivity/ref.ts`

与 `ref` 对应的还有一个 `shallowRef` 区别

- `ref`：如果是复杂数据类型，其内部数据仍然会被 `reactive` 进行代理
- `shallowRef`：只会对 `.value` 能访问的数据进行代理。

使用 `vue` 调试打印 `ref` 对象为

![ref](/vue/ref.jpg)

```ts
import { hasChange, isObject } from '@vue/shared/src';
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operations';
import { reactive } from '.';

export function ref(target) {
  return createRef(target);
}

export function shallowRef(target) {
  return createRef(target, true);
}

function createRef(target, shallow = false) {
  return new RefImpl(target, shallow);
}

// shallow ? 原始值 : reactive 代理值
const convert = (val) => (isObject(val) ? reactive(val) : val);

class RefImpl {
  public _value;
  // ref 的标识
  public readonly __v_isRef = true;

  constructor(public rawValue, public shallow) {
    this._value = shallow ? rawValue : convert(rawValue);
  }

  get value() {
    // 收集依赖
    track(this, TrackOpTypes.GET, 'value');
    return this._value;
  }

  set value(newValue) {
    // 判断是否更新
    if (!hasChange(newValue, this.rawValue)) {
      this.rawValue = newValue;
      this._value = this.shallow ? newValue : convert(newValue);

      // 触发更新
      trigger(this, TriggerOpTypes.SET, 'value', newValue);
    }
  }
}
```

`shared` 模块新增 `hasChange` 方法

```ts
export const hasChange = (newVal, oldVal) => Object.js(newVal, oldVal);
```

## toRef

顾名思义可以将一个非 `ref` 的值变成 `ref` 对象。需要注意的是，被转换之后的 `ref` 打印可不是 `RefImpl` 对象。

使用 `vue` 调试打印 `ref` 对象为

![ref](/vue/toRef.jpg)

```ts
export function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}

class ObjectRefImpl {
  public _value;
  public __v_isRef = true;

  constructor(public target, public key) {}

  get value() {
    return this.target[this.key];
  }

  set value(newValue) {
    this.target[this.key] = newValue;
  }
}
```

看代码实现比较简单，但也能满足功能，为什么没有 `trigger` 和 `track` ？

::: warning
如果传递进来的是一个响应式对象，属性访问器本身就会触发对应的 `trigger` 和 `track`。如果传入普通对象上面的代码即会崩溃。

需要做的事情还有很多，比如传入一个 `ref`、`function`、`object` 或者普通值又该如何处理呢？

![toRef1](/vue/toRef1.jpg)
:::

## toRefs

```ts
export function toRefs(target) {
  // 创建空对象
  const ret = isArray(target) ? new Array(target.length) : {};

  // 循环 toRef
  for (let key in target) {
    ret[key] = toRef(target, key);
  }
  return ret;
}
```

## isRef

```ts
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true);
}
```

## unRef

```ts
export function unref<T>(ref: MaybeRef<T>): T {
  return isRef(ref) ? ref.value : ref;
}
```

## toValue 3.3 新增

值得安利一下，一般情况下在使用 `vue` 时想要 `watch` 一个值，如果是 `ref` 可以直接调用，如果是普通值则需要回调。有了 `toValue` 就可以直接使用了。

```ts
export function toValue(source) {
  return isFunction(source) ? source() : unRef(source);
}

// example
function useFeature(id) {
  watch(toValue(id), (id) => {});
}

useFeature(1);
useFeature(ref(1));
useFeature(() => 1);
```

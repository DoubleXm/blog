## createRenderer 中的 render 渲染方法

目前为止，`vnode` 已经生成，似乎已经完事具备。继续分析 `render` 具体需要做哪些事情：

- 如何让 `render` 变成一个 `effect`，使属性变更后重新执行？
- 用户同时传入 `setup`、`render` 时程序应该如何处理？
- `setup` 中 `props`、`ctx` 与 `render` 中的 `proxy` 是什么？

OK! 带着上面的问题，进一步实现 `createRenderer` 中的 `render` 方法。

::: code-group

```ts [render.ts]
import { ShapeFlags } from '@vue/shared/src';
import { createComponentInstance, setupComponent } from './component';
import { effect } from '@vue/reactivity/src';

export function createRenderer(renderOptions) {

  const setupRenderEffect(instance, container) => {
    // 创建一个 effect 在 effect 中调用 render 方法，保证属性更新后可以重新执行 render 方法。

    // 每个组件都有一个 effect, vue3 组件级更新
    // 数据变化后执行对应组件的 effect
    effect(function componentEffect() {
      // 没有被挂载，说明是初次挂载
      if(!instance.isMounted) {
        let proxyUse = instance.proxy;
        // 在 vue3 中组件的虚拟节点叫做 vnode，render 的返回值称之为 subTree
        let subTree = (instance.subTree = instance.render.call(proxyUse, proxyUse));
        instance.isMounted = true;

        patch(null, subTree, container);
      } else {
        // TODO 更新组件
      }
    });
  }

  /**
   * 组件挂载
   */
  const mountComponent = (initialVNode, container) => {
    // 1. 创建组件的实例；
    const instance = initialVNode.component = createComponentInstance(initialVNode);
    // 2. 根据示例解析数据
    setupComponent(instance);
    // 3. 创建 effect 让 render 执行
    setupRenderEffect(instance, container);
  }

  /**
   * 针对不同情况下的组件处理
   */
  const processCompnoent = (n1, n2, container) => {
    // 组件没有老节点，新增的情况
    if (n1 == null) {
      mountComponent(n2, container);
    } else {
      // TODO 组件更新流程
    }
  }

  /**
   * 对不同类型的组件做分流
   */
  const patch = (n1, n2, container) => {
    const { shapeFlag } = n2;

    // 是元素
    if (shapeFlag & ShapeFlags.ELEMENT) {
      // TODO 元素处理
    } else if (shapFlag & ShapeFlags.STATEFUL_COMPONENT){
      // 是组件
      processCompnoent(n1, n2, container);
    }
  }

  const render = (vnode, container) => {
    // 首次 render 肯定为首次渲染
    patch(null, vnode, container);
  }

  return {
    createApp: createAppAPI(render);
  }
}
```

:::

## setup 和 render 参数处理及调用优先级

::: code-group

```ts [component.ts]
import { ShapeFlags, isFunction, isObject } from '@vue/shared/src';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';

/**
 * 创建组件实例
 */
export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type, // rootComponent
    props: {}, // vnode.props 包含 attrs 和 props
    attrs: {},
    slots: {},
    setupState: {}, // 如果 setup 返回一个对象，这个对象会作为 setupState
    render: null, // 自己合成的 render，会拿着它去判断用户有没有传入 render
    ctx: {},
    isMounted: false // 组件是否挂载过
  };

  instance.ctx = { _: instance }; // 将来会被 proxy 代理
  return instance;
}

/**
 * 解析实例并且挂载（setup 与 render 中的参数就在这里处理）
 */
export function setupComponent(instance) {
  const { props, children } = instance.vnode;

  // 根据 props 解析出 props 和 attrs，放在 instance 上
  instance.props = props; // 对应源码中 initProps 方法
  instance.children = children; // 对应源码中 initSlots 方法

  // 判断当前的组件是不是有状态组件
  const isStateFul =
    instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
  if (isStateFul) {
    setupStateFulComponent(instance);
  }
}

/**
 * 调用 setup or render
 */
function setupStateFulComponent(instance) {
  // 给 instance 增加 proxy 属性，该属性就是 instance.ctx 的代理
  instance.proxy = new Proxy(
    instance.ctx,
    PublicInstanceProxyHandlers as any
  );
  // 获取组件的类型拿到 setup 方法
  const Component = instance.type; // rootComponent
  const { setup } = Component;

  if (setup) {
    // 构建 setup 方法的第二个参数 ctx
    const setupContext = createSetupContext(instance);
    // 拿到 setup 执行后的返回值
    const setupResult = setup(instance.props, setupContext);
    // 对返回结果处理
    handleSetupResult(instance, setupResult);
  } else {
    // setup 不存在就去找 render
    finishComponentSetup(instance);
  }
}

function createSetupContext(instance) {
  return {
    props: instance.props,
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {}
  };
}

function handleSetupResult(instance, setupResult) {
  // 是函数。就被当成 render 函数执行
  if (isFunction(setupResult)) {
    instance.render = setupResult;
  } else if (isObject(setupResult)) {
    // 是对象。就放在 setupState 属性上面
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

/**
 * 完成组件的启动
 */
function finishComponentSetup(instance) {
  const Component = instance.type;

  if (!instance.render) {
    if (!Component.render && Component.template) {
      // TODO 对 template 编译产生 render，将 render 赋值给 Component.render;
    }

    // 如果 instance 上面没有 render 就把用户传递进来的赋值过去
    instance.render = Component.render;
  }
}
```

```ts [componentPublicInstance.ts]
import { hasOwn } from '@vue/shared/src';

// instance.ctx 的代理 handler
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 取值时，要访问 setupState，props，data
    const { setupState, props } = instance;

    // 内部变量
    if (key[0] === '$') return;

    // 逐个查找是否有值, 然后返回
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    } else {
      return undefined;
    }
  },
  set({ _: instance }, key, value) {
    const { setupState, props } = instance;

    // 逐个查找是否有值, 然后赋值
    if (hasOwn(setupState, key)) {
      setupState[key] = value;
    } else if (hasOwn(props, key)) {
      props[key] = value;
    }
  }
};
```

:::

## 总结

**`setup` 中 `props`、`ctx` 与 `render` 中的 `proxy` 是什么？**

> - `props` 是基于 `vnode` 取出来的。
> - `proxy` 在构建实例时，代理的 `{ _: instance }` 对象。
> - `ctx` 通过 `createSetupContext` 创建，从 `instance` 上面取一些必要的属性生成新的上下文对象。

**用户同时传入 `setup`、`render` 时程序应该如何处理？**

> - `vue` 内部会维护一个 `instance`。 
> - 当用户传入 `setup` 时，优先调用并会看一下其返回值；如果是对象就把对象的值实例放到 `setupState` 上面；如果是方法就将该方法放到实例的 `render` 上面；如果没有返回值就去 `vnode` 上面取用户传递进来的 `render`。
> - 如果 `setup` 不存在，就看 `vnode` 上面的 `render` 存不存在。

**如何让 `render` 变成一个 `effect`，使属性变更后重新执行？**

> - 使用 `effect` 对其进行包裹，然后在内部去执行处理好的 `render` 方法。如果内部数据变化后，会重新执行这个 `effect` 达到重新 `render` 的效果。

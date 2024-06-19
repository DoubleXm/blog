---
isTimeLine: true
title: 02 - 核心及其 api 实现
description: 一个拥有组合式 API 的 Vue 状态管理库
date: 2024-06-19
tags:
 - Pinia
categories:
 - Source Code
sticky: 1
---

## Pinia

新一代的 Vue 官方推荐的状态管理; 支持完成的 ts, 去除了 mutations, 只有 state, getters, actions 并且 actions 支持异步; 没有 store 的嵌套, store 之间可以自由使用; 

对比 vuex

- 天生支持 ts, vuex4 为了支持 vue3 迭代而来，适配度差一些;
- vuex 遵循 [flux 思想](https://www.ruanyifeng.com/blog/2016/01/flux.html) `component -> dispatch -> commit`, pinia 直接使用 action 修改状态;
- pinia 支持 setupApi, options 及 mapGetters 等函数为了适配 Vue2 才有的产物;
- vuex 有 modules 概念, 数据结构为树状, 操作数据太长，还存在明明冲突问题; pinia 则是扁平化管理 store;

## createPinia

::: code-group

```js [createPinia.js]
import { piniaSymbol } from 'rootStore';

function createPinia() {
  // 考虑到 $dispose 方法的实现, 需要使用 effectScope 管理所有的 state
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));

  const pinia = {
    install(app) {
      // 将 pinia 共享给所有的 store
      app.provide(piniaSymbol, pinia);
    },
    _s: new Map(), // 用 map 数据结构存储所有的 store; id => store
    _e: scope,
    state
  }

  return pinia;
}

```

```js [rootStore.js]
export const piniaSymbol = Symbol('pinia');
```
:::

## defineStore

确认 defineStore 的定义方式有三种，如下：

```js
// 1. defineStore(id, options)
// 2. defineStore(id, setup)
// 3. defineStore(options)
```

第二点需要确认，只有当用户在组件中使用 `useXxStore()` 时，`store` 中的数据才会被注入，所以 `defineStore` 应该返回一个函数。具体实现如下：

::: code-group

```js [store.js]
import { piniaSymbol } from 'rootStore';

function defineStore(idOrOptions, setup) {
  let id;
  let options;

  // 判定用户的输入, 方便后续分开处理
  if (typeof idOrOptions === 'string') {
    id = idOrOptions;
    options = setup;
  } else {
    id = idOrOptions.id;
    options = idOrOptions;
  }
  const isSetupStore = typeof setup === 'function';

  function useStore() {
    const hasContext = getCurrentInstance();
    // 当在 vue 组件中, 使用 useXxStore() 时, 就可以拿到整个 pinia 实例了
    const pinia = hasContext && inject(piniaSymbol);

    // 判定是否是否第一次 use
    if (!pinia_s.has(id)) {
      // 对两种编写方式分别处理
      if (isSetupStore) {
        createSetupStore(id, options, pinia);
      } else {
        createOptionsStore(id, setup, pinia);
      }
    }
    
    const srore = pinia._s.get(id);
    return store;
  }

  return useStore;
}

function createOptionsStore(id, options, pinia) {}

function createSupStore(id, setup, pinia, isOption) {}
```
:::

### createOptionsStore

对于 `options` 的处理，核心就是将其变更为 `setup` 函数，最终和 `setup` 方式的 `store` 放在一起进行下一步的处理。

::: code-group

```js [store.js]
function createOptionsStore(id, options, pinia) {
  const { state, getters, actions } = options;

  function setup() {
    pinia.state.value[id] = state ? state() : {};
    // 将 state 转换成 ref
    const localState = toRefs(pinia.state.value[id]);
    return Object.assign(
      localState,
      actions,
      // 将 getters 转换成计算属性
      Object.keys(getters).reduce((memo, computedName) => {
        memo[computedName] = computed(() => {
          const store = pinia._s.get(id);
          // 调用 getters 方法方法
          return memo[computedName].call(store);
        })
        return memo;
      }, {})
    )
  }

  return createSetupStore(id, setup, pinia, true)
}
```

:::

### createSetupStore

`setupStore` 核心只做两件事，维护自己的 `store`，维护用户的 `store`，最终合并然后返回。

::: code-group

```js [store.js]
// 官方并没有提供此方法, 自己实现
const isComputed = (v) => isRef(v) && v.effect;

function createSetupStore(id, setup, pinia, isOption) {
  function wrapActions(name, action) {
    return (...args) => {
      let ret;
      try {
        ret = action.apply(store, args);
      } catch(e) {
        // TODO: 错误处理
      }
      // action 是 promise 也需要处理
      if (ret instanceof Promise) {
        ret
          .resolve(value => {
            return value
          })
          .catch(err => {
            // TODO: 错误处理
          });
      }
      return ret;
    }
  }

  let scope;
  // 非用户 store 存储 $ 系列方法
  const store = reactive({});
  // 用户的 store 开辟一个作用域空间，方便后面 dispose
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  // setupApi 的时候 pinia.state.value[id] 是不存在的, 设置一个默认值
  const initialState = pinia.state.value[id];
  if (!initialState && !isOption) {
    pinia.state.value[id] = {};
  }

  // 对用户 store 中的属性处理
  for (let key in setupStore) {
    const prop = setupStore[key];

    if (typeof prop === 'function') {
      // 针对方法的处理
      setupStore[key] = wrapActions(prop, setupStore[key]);
    }

    // 给 pinia.state.value[id] 设置值
    // computed 不属于 state 的范畴，需要过滤掉
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      pinia.state.value[id][key] = prop;
    }
  }


  // 设置映射, 合并对象, 返回
  pinia._s.set(id);
  Object.assign(store, setupStore);
  return store;
}
```
:::

## API 实现

至此一个最简版的 pinia 已经实现，后面开始实现内置的各种 api。

### $patch

`$patch` 批量更新状态, 同一时间更改多个属性；在 timeline 中也不会出现多余的操作（虽然 vue3 现在并没有体现）。

核心原理就是, 如果是对象就与 `pinia.state.value[id]` 合并；如果是方法，将调用此方法把 `pinia.state.value[id]` 当做参数传递进去。

使用方法示例如下：

```js
store.$patch({ count: 1000 });
store.$patch((state) => {
  state.count += 100;
});
```

在 `createSetupStore` 中声明了 `store` (非用户), `setupStore` (用户)。这些内部的 `api` 就统统放在非用户 `store`。改写此方法如下：

::: code-group
```js [store.js]
const isObject = v => typeof v === 'object' && v !== null;

const mergeReactiveObject = (target, patchToApply) => {
  for (let key in target) {
    const oldValue = target[key];
    const newValue = patchToApply[key];

    if (isObject(oldValue) && isObject(newValue)) {
      mergeReactiveObject(oldValue, newValue);
    } else {
      // target[key] 会丢失响应式
      target[key] = toRef(newValue);
    }
  }
}

function createSetupStore(id, setup, pinia, isOption) {
  function $patch(partialStateOrMutatior) {
    if (typeof partialStateOrMutatior === 'function') {
      partialStateOrMutatior(pinia.state.value[id]);
    } else {
      mergeReactiveObject(pinia.state.value[id], partialStateOrMutatior);
    }
  }

  const partialStore = {
    $patch
  }
  const store = reactive(partialStore);
  // ... ...
}
```
:::

### $reset

该方法仅支持 `optionsApi`, 因为在 `setupApi` 中状态是完全可控的, 完全可以靠用户编写 `reset` 方法。

核心原理就是, 利用 `$patch` (回调中的 `state`) 和用户的 `state` 合并。

::: code-group
```js [store.js]
function createOptionsStore(id, options, pinia) {
  // ... ...

  const store = createSetupStore(id, setup, pinia, true);
  store.$reset = function () {
    // newState 原始值
    const newState = state ? state() : {};
    store.$patch(($state) => {
      Object.assign($state, newState);
    });
  }

  return store;
}

```
:::

### $subscribe

订阅 `state` 中的变化，并且触发，与 `watch` 一个 `state` 的区别就是，在 `patch` 后该订阅只会触发一次; 底层实际也是 `watch` 实现。

::: code-group
```js [store.js]
function createSetupStore(id, setup, pinia, isOption) {
  function $subscribe(callback, options = {}) {
    // watch 也用作用域包裹
    scope.run(() => {
      watch(() => () => pinia.state.value[id], (state) => {
        callback({ storeId: id, state });
      }, { deep: true });
    });
  }

  let scope;
  const partialStore = {
    $subscribe
  }
  const store = reactive(partialStore);
  // ... ...
}
```
:::

### $onAction

[文档](https://pinia.vuejs.org/zh/core-concepts/actions.html#subscribing-to-actions) 监听 `action` 和它的调用，接受一个回调，会在 `action` 调用之前被执行，回调中可以 `after`, `onError` 钩子及 `actionName`, `store` (当前的实例), `args` (传递给 action 的参数)。

::: code-group
```js [store.js]
import { triggerSubscription, addSubscription } from './subscriptions';

function createSetupStore(id, setup, pinia, isOption) {
  // 重写 wrapAction 方法
  function wrapAction(name, action) {
    return (...args) => {
      const afterCallbacks = [];
      const errorCallbacks = [];
      const after = (cb) => afterCallbacks.push(cb);
      const onError = (cb) => errorCallbacks.push(cb);

      // 接收的回调函数
      triggerSubscription(subscriptions, { name, store, args, after, onError });

      let ret;
      try {
        ret = action.apply(store, args);
      } catch(e) {
        triggerSubscription(errorCallbacks, e);
      }

      if (ret instanceof Promise) {
        ret
          .resolve(value => {
            triggerSubscriptions(afterCallbacks, res);
            return value;
          })
          .catch(e => {
            triggerSubscription(errorCallbacks, e);
          });
      }
      triggerSubscriptions(afterCallbackList, ret)
      return ret;
    }
  }


  const subscriptions = [];
  const partialState = {
    // 绑定订阅函数
    $onAction: addSubscription.bind(null, subscriptions);
  }
  const store = reactive(partialStore);
  // ... ...
}
```

```js [subscriptions.js]
export function addSubscription(subscriptions, callback) {
  subscriptions.push(callback);
}

export function triggerSubscription(subscriptions, ...args) {
  subscriptions.forEach(callback => callback(args));
}
```
:::

### $dispose

停止当前 `store` 的作用域，核心就用 `scope.stop()` 停止响应式, 从 `_s` 中删除映射并且清空 `$onAction` 的订阅。

::: code-group
```js [store.js]
function createSetupStore(id, setup, pinia, isOption) {

  const partialStore = {
    $dispose() {
      scope.stop();
      pinia._s.delete(id);
      actionSubscriptions = [];
    }
  }
  const store = reactive(partialStore);
  // ... ...
}
```
:::

### $state

挂在 `store` 上面的一个属性，可以直接替换 `store` 上面的 `state` 并且不会丢失其响应式。核心使用 `Object.defineProperty` 代理 `store` 实现

::: code-group
```js [store.js]
function createSetupStore(id, setup, pinia, isOption) {
  // ... ...
  Object.defineProperty(store, '$state', {
    get: () => pinia.state.value[id],
    set: (state) => {
      store.$patch(($state) => {
        Object.assign($state, state);
      })
    }
  })
}
```
:::

### use

插件即是一个函数，它的返回值最终会和 `store` 合并; 调用的次数，取决于项目中存在多少个 `store`; [文档](https://pinia.vuejs.org/zh/core-concepts/plugins.html#introduction) 以实现最简版持久化存储为例如下：

```js
function localPlugin({ store }) {
  const local = window.localStorage.getItem(`${store.$id}-pinia`);
  if (local) {
    store.$state = JSON.parse(local);
  }

  store.$subscribe(() => {
    window.localStorage.setItem(`${store.$id}`, JSON.stringify(store.$state));
  });
}

const pinia = createPinia();
pinia.use(localPlugin);
```

核心就是执行用户传递进来的方法，将 `store` 和 `pinia` 传递给这个方法并且将用户传递进来的方法的返回值合并到 `store`（非用户）

::: code-group
```js [createPinia.js]
function createPinia() {
  const pinia = {
    // ... ...
    _p: [],
    use(plugin) {
      this._p.push(plugin);
      // 链式调用
      return this;
    }
  }
  return pinia;
}
```

```js [store.js]
function createSetupStore(id, setup, pinia, isOption) {
  // ... ...
  pinia._p.forEach((plugin) => {
    const extender = scope.run(() => plugin(store, pinia));
    store.$patch(() => {
      Object.assign(store, extender);
    });
  })
  // ... ...
}
```
:::

## 非 vue 文件中的调用

在 `install` 的时候，组件是通过 `provide` 注入的，但是这种方式是不支持在非 `vue` 文件中使用的; 而这种场景也是一定会存在的，比如你在 `router` 的钩子中去做鉴权等等... 此时可以将 `pinia` 放在全局中，就不用考虑拿不到的问题了；

解决思路就是在全局维护一个 `pinia`，当用户 `install` 或者 `useStore` 的时候，去更新这个 `pinia`

::: code-group
```js [rootStore.js]
// 全局 pinia
export let activePinia = null;
export const setActivePinia = pinia => activePinia = pinia;
```

```js [createPinia.js]
import { setActivePinia } from './rootStore';

function createPinia() {
  const pinia = {
    install(app) {
      setActivePinia(pinia);
      app.provide(piniaSymbol, pinia);
    },
    // ... ...
  }
  return pinia;
}
```

```js [store.js]
import { activePinia, setActivePinia } from './rootStore';

function defineStore() {
  // ... ...
  function useStore() {
    const hasContext = getCurrentInstance();
    let pinia = hasContext && inject(piniaSymbol);
    // 如果注入成功, 就设置一下全局的 pinia
    if (pinia) setActivePinia(pinia);
    // 无论成功该 pinia 都会和全局实例保持一致
    pinia = activePinia;
    // ... ...
  }
  return useStore;
}
```
:::

## storeToRefs

该方法与 `toRefs` 的最大区别就是，会将方法给过滤掉，并不会把 `store` 中所有解构出来的值都变成 `ref`; 

```js
function storeToRefs(store) {
  // store 是个 reactive 不能直接循环, 会触发 getter
  store = toRaw(store);
  const refs = {};
  for (let key in store) {
    const value = stroe[key];
    if (isRef(value) || isReactive(value)) {
      // 将 store 中被结构的值修改为 ref
      refs[key] = toRef(store, key)
    }
  }
  return refs;
}
```
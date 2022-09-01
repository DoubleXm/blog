---
layout: doc
---

## Vue 2.0 options 初始化顺序

常见问题：data 里面可以访问 props 吗？

```javascript
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
```

## Vue2.0 响应式数据的原理

整体思路是数据劫持 + 观察者模式

对象内部通过 `defineReactive` 方法，使用 `Object.defineProperty` 将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组方法来实现。当页面使用对应属性时，每个属性都拥有自己的 dep 属性，存放他所依赖的 `watcher`（依赖收集），当属性变化后会通知自己对应的 `watcher` 去更新 (派发更新)。

```javascript
class Observer {
  constructor(value) {
    this.walk(value);
  }
  walk(data) {
    // 对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }
}

function defineReactive(data, key, value) {
  observe(value);
  const dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");
      dep.depend(); // 收集依赖
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      console.log("设置值");
      value = newValue;
      dep.notify(); // 通知 watcher 派发更新
    }
  });
}
export function observe(value) {
  // 如果传过来的是对象或者数组 进行属性劫持
  if (Object.prototype.toString.call(value) === "[object Object]" || Array.isArray(value)) {
    return new Observer(value);
  }
}
```

## Computed 原理

计算属性可以写成一个函数也可以写成一个对象，对象的形式 `get` 属性就代表的是计算属性依赖的值 set 代表修改计算属性的依赖项的值

传递 `lazy` 表示其是一个 计算 `watcher`

在 `defineComputed` 中根据 `dirty` 判断是不是脏值，并重新计算

```javascript
function initComputed(vm) {
  const computed = vm.$options.computed;
  const watchers = (vm._computedWatchers = {}); //用来存放计算watcher

  for (let k in computed) {
    const userDef = computed[k]; //获取用户定义的计算属性
    const getter = typeof userDef === "function" ? userDef : userDef.get; //创建计算属性watcher使用
    // 创建计算watcher  lazy设置为true
    watchers[k] = new Watcher(vm, getter, () => {}, { lazy: true });
    // 利用 Object.defineProperty 劫持 计算属性
    defineComputed(vm, k, userDef);
  }
}

// 定义普通对象用来劫持计算属性
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: () => {},
  set: () => {}
};

// 重新定义计算属性  对get和set劫持
function defineComputed(target, key, userDef) {
  if (typeof userDef === "function") {
    // 如果是一个函数  需要手动赋值到get上
    sharedPropertyDefinition.get = createComputedGetter(key);
  } else {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set;
  }
  // 利用Object.defineProperty来对计算属性的get和set进行劫持
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 重写计算属性的get方法 来判断是否需要进行重新计算
function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key]; // 获取对应的计算属性watcher
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate(); // 计算属性取值的时候 如果是脏的  需要重新求值
      }
      return watcher.value;
    }
  };
}
```

## Watch 原理

watch 选项在每次响应式属性发生变化时触发一个函数。

侦听属性的写法很多 可以写成 字符串 函数 数组 以及对象 对于对象的写法自己可以增加一些 options 用来增强功能 侦听属性的特点是监听的值发生了变化之后可以执行用户传入的自定义方法

核心仍然是通过 `Watcher` 实现，传入 user 表示是 用户 `watcher`

```javascript
// initWatch 初始化 Watch 对数组进行处理
function initWatch(vm) {
  let watch = vm.$options.watch;
  for (let k in watch) {
    const handler = watch[k]; //用户自定义watch的写法可能是数组 对象 函数 字符串
    if (Array.isArray(handler)) {
      // 如果是数组就遍历进行创建
      handler.forEach(handle => {
        createWatcher(vm, k, handle);
      });
    } else {
      createWatcher(vm, k, handler);
    }
  }
}
// createWatcher 处理 Watch 的兼容性写法 包含字符串 函数 数组 以及对象
function createWatcher(vm, exprOrFn, handler, options = {}) {
  if (typeof handler === "object") {
    options = handler; // 保存用户传入的对象
    handler = handler.handler; // 这个代表真正用户传入的函数
  }
  if (typeof handler === "string") {
    // 代表传入的是定义好的methods方法
    handler = vm[handler];
  }
  // 调用vm.$watch创建用户watcher
  return vm.$watch(exprOrFn, handler, options);
}

Vue.prototype.$watch = function (exprOrFn, cb, options) {
  const vm = this;
  //  user: true 这里表示是一个用户watcher
  let watcher = new Watcher(vm, exprOrFn, cb, { ...options, user: true });
  // 如果有 immediate 属性 代表需要立即执行回调
  if (options.immediate) {
    cb(); //如果立刻执行
  }
};
```

## Vue.observeable 方法原理

核心就是调用 observe 方法将传入的数据变成响应式对象 可用于制造全局变量在组件共享数据

```javascript
Vue.observable = obj => {
  observe(obj);
  return obj;
};
```

## Vue.use 方法原理

Vue.use 主要用于插件的注册 调用插件的 install 方法 并且把自身 Vue 传到插件的 install 方法 这样可以避免第三方插件强依赖 Vue

```javascript
Vue.use = function (plugin: Function | Object) {
  const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
  if (installedPlugins.indexOf(plugin) > -1) {
    // 如果安装过这个插件直接返回
    return this;
  }
  const args = toArray(arguments, 1); // 获取参数
  args.unshift(this); //在参数中增加Vue构造函数

  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args); // 执行install方法
  } else if (typeof plugin === "function") {
    plugin.apply(null, args); // 没有install方法直接把传入的插件执行
  }
  // 记录安装的插件
  installedPlugins.push(plugin);
  return this;
};
```

## Vue.extend 作用和原理

官方解释：Vue.extend 使用基础 Vue 构造器，创建一个 “子类”。参数是一个包含组件选项的对象。

其实就是一个子类构造器 是 Vue 组件的核心 api 实现思路就是使用原型继承的方法返回了 Vue 的子类 并且利用 mergeOptions 把传入组件的 options 和父类的 options 进行了合并

```javascript
export default function initExtend(Vue) {
  let cid = 0; // 组件唯一标识

  // 创建子类继承Vue父类 便于属性扩展
  Vue.extend = function (extendOptions) {
    // 创建子类的构造函数 并且调用初始化方法
    const Sub = function VueComponent(options) {
      this._init(options); // 调用Vue初始化方法
    };
    Sub.cid = cid++;
    Sub.prototype = Object.create(this.prototype); // 子类原型指向父类
    Sub.prototype.constructor = Sub; // constructor 指向自己
    Sub.options = mergeOptions(this.options, extendOptions); // 合并自己的options和父类的options
    return Sub;
  };
}
```

## Vue 如何检测数组变化

数组考虑性能原因没有用 `defineProperty` 对数组的每一项进行拦截，而是选择对 7 种数组（`push,shift,pop,splice,unshift,sort,reverse`）方法进行重写 (AOP 切片思想)

所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 `watcher` 进行更新

```javascript
const arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = ["push", "pop", "shift", "unshift", "splice", "reverse", "sort"];
methodsToPatch.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = arrayProto[method].apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    if (inserted) ob.observeArray(inserted);
    ob.dep.notify(); // 派发更新

    return result;
  };
});
```

## Vue.mixin 的使用场景和原理

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立，可以通过 Vue 的 mixin 功能抽离公共的业务逻辑，原理类似 “对象的继承”，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行 “合并”。

合并规则

- 输入对象会进行递归合并，并在发生冲突时，以组件数据优先
- 同名的钩子函数会合并成为一个数组，依次调用，mixin 的钩子优先执行
- 对象类型选项会合并为同一个对象，如果键名冲突，以组件内为主

```javascript
export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}

export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed"
];

const strats = {};

export function mergeOptions(parent, child) {
  const options = {};

  for (let k in parent) {
    mergeFiled(k);
  }

  for (let k in child) {
    if (!parent.hasOwnProperty(k)) {
      mergeFiled(k);
    }
  }

  function mergeFiled(k) {
    if (strats[k]) {
      options[k] = strats[k](parent[k], child[k]);
    } else {
      options[k] = child[k] ? child[k] : parent[k];
    }
  }
  return options;
}
```

## nextTick 使用场景和原理

nextTick 中的回调是在下次 DOM 更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。主要思路就是采用微任务优先的方式调用异步方法去执行 nextTick 包装的方法

```javascript
let callbacks = [];
let pending = false;
function flushCallbacks() {
  pending = false;
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}
// 降级兼容全部浏览器
let timerFunc;
if (typeof Promise !== "undefined") {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== "undefined") {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== "undefined") {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
```

## 异步更新原理

每次更新数据都立即给你刷新一次页面，如果每次赋值都跑一趟 `render`、`patch`，那整个页面性能肯定不行。所以 Vue 采用异步更新队列来渲染页面，每次的 watcher 都放到异步队列里面，最后通过 `NextTick` 一步更新。

```javascript
export default class Watcher {
  update() {
    // 每次watcher进行更新的时候让他们先缓存起来之后再一起调用
    queueWatcher(this);
  }
  run() {
    // 真正的触发更新
    this.get();
  }
}

let queue = [];
let has = {};
function flushSchedulerQueue() {
  for (let index = 0; index < queue.length; index++) {
    // 调用watcher的run方法 执行真正的更新操作
    queue[index].run();
  }
  // 执行完之后清空队列
  queue = [];
  has = {};
}
// 实现异步队列机制
export function queueWatcher(watcher) {
  const id = watcher.id;
  // watcher去重
  if (has[id] === undefined) {
    //  同步代码执行 把全部的watcher都放到队列里面去
    queue.push(watcher);
    has[id] = true;
    // 进行异步调用
    nextTick(flushSchedulerQueue);
  }
}
```

## Vue.set 方法原理

了解 Vue 响应式原理的同学都知道在两种情况下修改数据 Vue 是不会触发视图更新的

1. 在实例创建之后添加新的属性到实例上（给响应式对象新增属性）

2. 直接更改数组下标来修改数组的值

Vue.set 或者说是 $set 原理如下

因为响应式数据 我们给对象和数组本身都增加了`__ob__`属性，代表的是 Observer 实例。当给对象新增不存在的属性 首先会把新的属性进行响应式跟踪 然后会触发对象`__ob__`的 dep 收集到的 watcher 去更新，当修改数组索引时我们调用数组本身的 splice 方法去更新数组

```javascript
export function set(target: Array | Object, key: any, val: any): any {
  // 数组 调用 splice 方法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = (target: any).__ob__;

  // 对象直接设置
  if (!ob) {
    target[key] = val;
    return val;
  }

  defineReactive(ob.value, key, val);

  ob.dep.notify(); // 派发更新
  return val;
}
```

## Vue.delete 方法原理

如果直接删除 data 上面的数据是不会触发响应式的，所以 Vue 提供了一个 delete 方法。仍然是对数组以及对象的操作，当操作之后手动的调用 notify 方法通知更新。

```javascript
export function del(target: Array<any> | Object, key: any) {
  // 如果是数组依旧调用splice方法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  const ob = (target: any).__ob__;
  // 如果对象本身就没有这个属性 什么都不做
  if (!hasOwn(target, key)) {
    return;
  }
  // 直接使用delete  删除这个属性
  delete target[key];
  // 如果对象本身就不是响应式 直接返回
  if (!ob) {
    return;
  }
  ob.dep.notify(); //通知视图更新
}
```

## Vue 2.0 模板编译原理

- 第一步是将 模板字符串 转换成 element ASTs（解析器）
- 第二步是对 AST 进行静态节点标记，主要用来做虚拟 DOM 的渲染优化（优化器）
- 第三步是 使用 element ASTs 生成 render 函数代码字符串（代码生成器）

```javascript
export function compileToFunctions(template) {
  // 根据模板生成 ast 语法树，主要是通过各种正则匹配标签
  let ast = parse(template);
  // 根据 ast 生成渲染函数 _c(div, null, _s(variable))
  // _c 创建元素 _v 文本 _s 表达式
  let code = generate(ast);
  // 通过 newFunction + with 的方式生成 render 函数
  let renderFn = new Function(`with(this){return ${code}}`);
  return renderFn;
}
```

## Vue 2.0 首次渲染与更新原理

通过 $mount 下的 `mountComponent` 来进行挂载

```javascript
// 把 _render 挂载在Vue的原型  用户手写 render 或者 生成的 render
Vue.prototype._render = function () {
  const vm = this;
  // 获取模板编译生成的render方法
  const { render } = vm.$options;
  // 生成vnode--虚拟dom
  const vnode = render.call(vm);
  return vnode;
};
// 把 _update 挂载在Vue的原型
Vue.prototype._update = function (vnode) {
  const vm = this;
  const prevVnode = vm._vnode; // 保留上一次的vnode
  vm._vnode = vnode;
  if (!prevVnode) {
    // patch是渲染vnode为真实dom核心
    vm.$el = patch(vm.$el, vnode); // 初次渲染 vm._vnode肯定不存在 要通过虚拟节点 渲染出真实的dom 赋值给$el属性
  } else {
    vm.$el = patch(prevVnode, vnode); // 更新时把上次的vnode和这次更新的vnode穿进去 进行diff算法
  }
};

export function patch(oldVnode, vnode) {
  // 判断传入的oldVnode是否是一个真实元素
  // 这里很关键  初次渲染 传入的vm.$el就是咱们传入的el选项  所以是真实dom
  // 如果不是初始渲染而是视图更新的时候  vm.$el就被替换成了更新之前的老的虚拟dom
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 首次渲染
  } else {
    // 更新
  }
}

// 渲染方法
export function mountComponent(vm, el) {
  // 真实的el选项赋值给实例的$el属性 为之后虚拟dom产生的新的dom替换老的dom做铺垫
  vm.$el = el;
  let updateComponent = () => {
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, null, true);
}
```

## Vue 2.0 diff 算法原理

diff 算法只有在更新的时候才会触发，是对节点进行差异化比较。当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较(diff)，记录两棵树差异

diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，是一种相当高效的算法

![ON](/browser/ON.jpeg)

::: details `patch` 方法原理

```javascript
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // oldVnode是真实dom元素 就代表初次渲染
  } else {
    // oldVnode是虚拟dom 就是更新过程 使用diff算法
    if (oldVnode.tag !== vnode.tag) {
      // 如果新旧标签不一致 用新的替换旧的 oldVnode.el代表的是真实dom节点--同级比较
      oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }
    // 如果旧节点是一个文本节点
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        oldVnode.el.textContent = vnode.text;
      }
    }
    // 不符合上面两种 代表标签一致 并且不是文本节点
    // 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性
    const el = (vnode.el = oldVnode.el);
    updateProperties(vnode, oldVnode.data); // 更新属性
    const oldCh = oldVnode.children || []; // 老的儿子
    const newCh = vnode.children || []; // 新的儿子
    if (oldCh.length > 0 && newCh.length > 0) {
      // 新老都存在子节点
      updateChildren(el, oldCh, newCh);
    } else if (oldCh.length) {
      // 老的有儿子新的没有
      el.innerHTML = "";
    } else if (newCh.length) {
      // 新的有儿子
      for (let i = 0; i < newCh.length; i++) {
        const child = newCh[i];
        el.appendChild(createElm(child));
      }
    }
  }
}
```

:::

::: tip

- 新旧标签不一致：新的替换旧的。新增文本节点不一致：新的替换旧的
- 旧的有节点，新的没有，直接清空旧的节点
- 旧的没有节点，新的有，往节点添加数据
- 新的有节点，旧的也有节点 `updateChildren` 进入核心 diff

:::

::: details `updateChildren` 方法原理

```javascript
// 判断两个vnode的标签和key是否相同 如果相同 就可以认为是同一节点就地复用
function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}
// diff算法核心 采用双指针的方式 对比新老vnode的儿子节点
function updateChildren(parent, oldCh, newCh) {
  let oldStartIndex = 0; //老儿子的起始下标
  let oldStartVnode = oldCh[0]; //老儿子的第一个节点
  let oldEndIndex = oldCh.length - 1; //老儿子的结束下标
  let oldEndVnode = oldCh[oldEndIndex]; //老儿子的起结束节点

  let newStartIndex = 0; //同上  新儿子的
  let newStartVnode = newCh[0];
  let newEndIndex = newCh.length - 1;
  let newEndVnode = newCh[newEndIndex];

  // 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
  function makeIndexByKey(children) {
    let map = {};
    children.forEach((item, index) => {
      map[item.key] = index;
    });
    return map;
  }
  // 生成的映射表
  let map = makeIndexByKey(oldCh);

  // 只有当新老儿子的双指标的起始位置不大于结束位置的时候  才能循环 一方停止了就需要结束循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 因为暴力对比过程把移动的vnode置为 undefined 如果不存在vnode节点 直接跳过
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头和头对比 依次向后追加
      patch(oldStartVnode, newStartVnode); //递归比较儿子以及他们的子节点
      oldStartVnode = oldCh[++oldStartIndex];
      newStartVnode = newCh[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      //尾和尾对比 依次向前追加
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIndex];
      newEndVnode = newCh[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 老的头和新的尾相同 把老的头部移动到尾部
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); //insertBefore可以移动或者插入真实dom
      oldStartVnode = oldCh[++oldStartIndex];
      newEndVnode = newCh[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 老的尾和新的头相同 把老的尾部移动到头部
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldCh[--oldEndIndex];
      newStartVnode = newCh[++newStartIndex];
    } else {
      // 上述四种情况都不满足 那么需要暴力对比
      // 根据老的子节点的key和index的映射表 从新的开始子节点进行查找 如果可以找到就进行移动操作 如果找不到则直接进行插入
      let moveIndex = map[newStartVnode.key];
      if (!moveIndex) {
        // 老的节点找不到  直接插入
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        let moveVnode = oldCh[moveIndex]; //找得到就拿到老的节点
        oldCh[moveIndex] = undefined; //这个是占位操作 避免数组塌陷  防止老节点移动走了之后破坏了初始的映射表位置
        parent.insertBefore(moveVnode.el, oldStartVnode.el); //把找到的节点移动到最前面
        patch(moveVnode, newStartVnode);
      }
    }
  }
  // 如果老节点循环完毕了 但是新节点还有  证明  新节点需要被添加到头部或者尾部
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 这是一个优化写法 insertBefore的第一个参数是null等同于appendChild作用
      const ele = newCh[newEndIndex + 1] == null ? null : newCh[newEndIndex + 1].el;
      parent.insertBefore(createElm(newCh[i]), ele);
    }
  }
  // 如果新节点循环完毕 老节点还有  证明老的节点需要直接被删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldCh[i];
      if (child != undefined) {
        parent.removeChild(child.el);
      }
    }
  }
}
```

:::

::: tip

1. 使用双指针移动来进行新老节点的对比

![patch1](/browser/patch1.png)

2. 用 `isSameVnode` 来判断新老子节点的头头 尾尾 头尾 尾头 是否是同一节点，如果满足就进行相应的移动指针(头头 尾尾)或者移动 `dom` 节点(头尾 尾头)操作

3. 如果全都不相等 进行暴力对比 如果找到了利用 `key` 和 `index` 的映射表来移动老的子节点到前面去 如果找不到就直接插入

4. 对老的子节点进行递归 `patch` 处理

5. 最后老的子节点有多的就删掉 新的子节点有多的就添加到相应的位置

:::

## 生命周期钩子是如何实现的

Vue 的生命周期钩子核心实现是利用发布订阅模式先把用户传入的的生命周期钩子订阅好（内部采用数组的方式存储）然后在创建组件实例的过程中会一次执行对应的钩子方法（发布）

```javascript
export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}

Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = mergeOptions(vm.constructor.options, options);
  callHook(vm, "beforeCreate");

  initState(vm);
  callHook(vm, "created");
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

## keep-alive 使用场景和原理

keep-alive 是 Vue 内置的一个组件，可以实现组件缓存，当组件切换时不会对当前组件进行卸载。

- 常用的两个属性 include/exclude，允许组件有条件的进行缓存。
- 两个生命周期 activated/deactivated，用来得知当前组件是否处于活跃状态。
- keep-alive 的中还运用了 LRU(最近最少使用) 算法，选择最近最久未使用的组件予以淘汰。

```javascript
export default {
  name: "keep-alive",
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created() {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    this.$watch("include", val => {
      pruneCache(this, name => matches(val, name));
    });
    this.$watch("exclude", val => {
      pruneCache(this, name => !matches(val, name));
    });
  },

  render() {
    const slot = this.$slots.default;
    const vnode: VNode = getFirstComponentChild(slot);
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      const name: ?string = getComponentName(componentOptions);
      const { include, exclude } = this;

      if ((include && (!name || !matches(include, name))) || (exclude && name && matches(exclude, name))) {
        return vnode;
      }

      const { cache, keys } = this;
      const key: ?string =
        vnode.key == null
          ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : "")
          : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;

        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);

        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }

    return vnode || (slot && slot[0]);
  }
};
```

::: tip
LRU 的核心思想是如果数据最近被访问过，那么将来被访问的几率也更高，所以我们将命中缓存的组件 key 重新插入到 this.keys 的尾部，这样一来，this.keys 中越往头部的数据即将来被访问几率越低，所以当缓存数量达到最大值时，我们就删除将来被访问几率最低的数据，即 this.keys 中第一个缓存的组件。

![LRU](/browser/LRU.png)
:::

## 能说下 vue-router 中常用的路由模式实现原理吗

**hash 模式**

1. location.hash 的值实际就是 URL 中 #后面的东西 它的特点在于：hash 虽然出现 URL 中，但不会被包含在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。
2. 可以为 hash 的改变添加监听事件 window.addEventListener("hashchange", funcRef, false);

每一次改变 hash（window.location.hash），都会在浏览器的访问历史中增加一个记录利用 hash 的以上特点，就可以来实现前端路由 “更新视图但不重新请求页面” 的功能了 **特点：兼容性好但是不美观**

**history 模式**

利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。

这两个方法应用于浏览器的历史记录站，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。这两个方法有个共同的特点：当调用他们修改浏览器历史记录栈后，虽然当前 URL 改变了，但浏览器不会刷新页面，这就为单页应用前端路由 “更新视图但不重新请求页面” 提供了基础。**特点：虽然美观，但是刷新会出现 404 需要后端进行配置**

## MVC 和 MVVM 区别

MVC 全名是 Model View Controller，是模型 (model)－视图(view)－控制器(controller) 的缩写，一种软件设计典范

- Model（模型）：是应用程序中用于处理应用程序数据逻辑的部分。通常模型对象负责在数据库中存取数据
- View（视图）：是应用程序中处理数据显示的部分。通常视图是依据模型数据创建的
- Controller（控制器）：是应用程序中处理用户交互的部分。通常控制器负责从视图读取数据，控制用户输入，并向模型发送数据

![mvc](/browser/mvc.png)

MVC 的思想：一句话描述就是 Controller 负责将 Model 的数据用 View 显示出来，换句话说就是在 Controller 里面把 Model 的数据赋值给 View。

MVVM 新增了 VM 类

ViewModel 层：做了两件事达到了数据的双向绑定 一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。

![mvvm](/browser/mvvm.jpeg)

MVVM 与 MVC 最大的区别就是：它实现了 View 和 Model 的自动同步，也就是当 Model 的属性改变时，我们不用再自己手动操作 Dom 元素，来改变 View 的显示，而是改变属性后该属性对应 View 层显示会自动改变（对应 Vue 数据驱动的思想）

整体看来，MVVM 比 MVC 精简很多，不仅简化了业务与界面的依赖，还解决了数据频繁更新的问题，不用再用选择器操作 DOM 元素。因为在 MVVM 中，View 不知道 Model 的存在，Model 和 ViewModel 也观察不到 View，这种低耦合模式提高代码的可重用性

:::tip
注意：Vue 并没有完全遵循 MVVM 的思想 这一点官网自己也有说明 严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了 $refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。
:::

## 为什么 data 是一个函数

组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，就使得所有组件实例共用了一份 data，就会造成一个变了全都会变的结果

## Vue 组件通讯有哪几种方式

1. props 和 $emit 父组件向子组件传递数据是通过 prop 传递的，子组件传递数据给父组件是通过 $emit 触发事件来做到的
2. $parent,$children 获取当前组件的父组件和当前组件的子组件
3. $attrs 和 $listeners A->B->C。Vue 2.4 开始提供了 $attrs 和 $listeners 来解决这个问题
4. 父组件中通过 provide 来提供变量，然后在子组件中通过 inject 来注入变量。(官方不推荐在实际业务中使用，但是写组件库时很常用)
5. $refs 获取组件实例
6. envetBus 兄弟组件数据传递 这种情况下可以使用事件总线的方式
7. vuex 状态管理

## Vue 的生命周期方法有哪些

- beforeCreate 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问
- created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算， watch/event 事件回调。这里没有 $el, 如果非要想与 Dom 进行交互，可以通过 vm.$nextTick 来访问 Dom
- beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用。
- mounted 在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点
- beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁（patch）之前。可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程
- updated 发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新，该钩子在服务器端渲染期间不被调用。
- beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。我们可以在这时进行善后收尾工作，比如清除计时器。
- destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。
- activated keep-alive 专属，组件被激活时调用
- deactivated keep-alive 专属，组件被销毁时调用

## 异步请求在哪一步发起？

可以在钩子函数 created、beforeMount、mounted 中进行异步请求，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

如果异步请求不需要依赖 Dom 推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面 loading 时间；
- ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；

## v-if 和 v-show 的区别

v-if 在编译过程中会被转化成三元表达式, 条件不满足时不渲染此节点。

v-show 会被编译成指令，条件不满足时控制样式将对应节点隐藏 （display:none）

**使用场景**

v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景

v-show 适用于需要非常频繁切换条件的场景

## 说说 vue 内置指令

![directive](/browser/directive.png)

## 怎样理解 Vue 的单向数据流

数据总是从父组件传到子组件，子组件没有权利修改父组件传过来的数据，只能请求父组件对原始数据进行修改。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

::: danger
注意：在子组件直接用 v-model 绑定父组件传过来的 prop 这样是不规范的写法 开发环境会报警告
:::

如果实在要改变父组件的 prop 值 可以再 data 里面定义一个变量 并用 prop 的值初始化它 之后用 $emit 通知父组件去修改

## computed 和 watch 的区别和运用的场景

computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容，它可以设置 getter 和 setter。

watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

计算属性一般用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑

## v-if 与 v-for 为什么不建议一起使用

v-for 和 v-if 不要在同一个标签中使用, 因为解析时先解析 v-for 再解析 v-if。如果遇到需要同时使用时可以考虑写成计算属性的方式。

## vue3.0 用过吗 了解多少

- 响应式原理的改变 Vue3.x 使用 Proxy 取代 Vue2.x 版本的 Object.defineProperty
- 组件选项声明方式 Vue3.x 使用 Composition API setup 是 Vue3.x 新增的一个选项， 他是组件内使用 Composition API 的入口。
- 模板语法变化 slot 具名插槽语法 自定义指令 v-model 升级
- 其它方面的更改 Suspense 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。 基于 treeshaking 优化，提供了更多的内置功能。

## Vue3.0 和 2.0 的响应式原理区别

Vue3.x 改用 Proxy 替代 Object.defineProperty。因为 Proxy 可以直接监听对象和数组的变化，并且有多达 13 种拦截方法。

## Vue 的父子组件生命周期钩子函数执行顺序

加载渲染过程 父 beforeCreate-> 父 created-> 父 beforeMount-> 子 beforeCreate-> 子 created-> 子 beforeMount-> 子 mounted-> 父 mounted

子组件更新过程 父 beforeUpdate-> 子 beforeUpdate-> 子 updated-> 父 updated

父组件更新过程 父 beforeUpdate-> 父 updated

销毁过程 父 beforeDestroy-> 子 beforeDestroy-> 子 destroyed-> 父 destroyed

## 虚拟 DOM 是什么 有什么优缺点

由于在浏览器中操作 DOM 是很昂贵的。频繁的操作 DOM，会产生一定的性能问题。这就是虚拟 Dom 的产生原因。Vue2 的 Virtual DOM 借鉴了开源库 snabbdom 的实现。Virtual DOM 本质就是用一个原生的 JS 对象去描述一个 DOM 节点，是对真实 DOM 的一层抽象。

优点：

1. 保证性能下限： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
2. 无需手动操作 DOM： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
3. 跨平台： 虚拟 DOM 本质上是 JavaScript 对象, 而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:

1. 无法进行极致优化： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。
2. 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。

## v-model 原理

v-model 只是语法糖而已

v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 value property 和 input 事件；
- checkbox 和 radio 使用 checked property 和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

::: tip
注意: 对于需要使用输入法 (如中文、日文、韩文等) 的语言，你会发现 v-model 不会在输入法组合文字过程中得到更新。
:::

## v-for 为什么要加 key

如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改 / 复用相同类型元素的算法。key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速

更准确：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。

更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快

## Vue 事件绑定原理

原生事件绑定是通过 addEventListener 绑定给真实元素的，组件事件绑定是通过 Vue 自定义的 $on 实现的。如果要在组件上使用原生事件，需要加. native 修饰符，这样就相当于在父组件中把子组件当做普通 html 标签，然后加上原生事件。

$on、$emit 是基于发布订阅模式的，维护一个事件中心，on 的时候将事件按名称存在事件中心里，称之为订阅者，然后 emit 将对应的事件进行发布，去执行事件中心里的对应的监听器

## vue-router 路由钩子函数是什么 执行顺序是什么

路由钩子的执行流程, 钩子函数种类有: 全局守卫、路由守卫、组件守卫

完整的导航解析流程:

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## vue-router 动态路由是什么 有什么问题

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用 “动态路径参数”(dynamic segment) 来达到这个效果：

```javascript
const User = {
  template: "<div>User</div>"
};

const router = new VueRouter({
  routes: [{ path: "/user/:id", component: User }]
});
```

::: tip
问题: vue-router 组件复用导致路由参数失效怎么办？
:::

解决方法：

1. 通过 watch 监听路由参数再发请求

```javascript
watch: {
  "$route": function(){
    this.getData(this.$route.params.xxx);
  }
}
```

2. 用 :key 来阻止 “复用”

```html
<router-view :key="$route.fullPath" />
```

## 谈一下对 vuex 的个人理解

vuex 是专门为 vue 提供的全局状态管理系统，用于多个组件中数据共享、数据缓存等。（无法持久化、内部核心原理是通过创造一个全局实例 new Vue）

主要包括以下几个模块：

- `State`：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- `Getter`：允许组件从 `Store` 中获取数据，`mapGetters` 辅助函数仅仅是将 `store` 中的 `getter` 映射到局部计算属性。
- `Mutation`：是唯一更改 `store` 中状态的方法，且必须是同步函数。
- `Action`：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- `Module`：允许将单一的 `Store` 拆分为多个 `store` 且同时保存在单一的状态树中。

## Vuex 页面刷新数据丢失怎么解决

需要做 vuex 数据持久化 一般使用本地存储的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中

## Vuex 为什么要分模块并且加命名空间

**模块**: 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

**命名空间**：默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

## 使用过 Vue SSR 吗？说说 SSR

SSR 也就是服务端渲染，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

**优点：**

SSR 有着更好的 SEO、并且首屏加载速度更快

**缺点：** 开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。

服务器会有更大的负载需求

## 你都做过哪些 Vue 的性能优化

- 对象层级不要过深，否则性能就会差
- 不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
- v-if 和 v-show 区分使用场景
- computed 和 watch 区分使用场景
- v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
- 大数据列表和表格性能优化 - 虚拟列表 / 虚拟表格
- 防止内部泄漏，组件销毁后把全局变量和事件销毁
- 图片懒加载
- 路由懒加载
- 第三方插件的按需引入
- 适当采用 keep-alive 缓存组件
- 防抖、节流运用
- 服务端渲染 SSR or 预渲染

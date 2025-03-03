---
outline: [2,3,4]
---

# 使用方案及子应用的加载原理

## single-spa 使用方案

[single-spa](https://zh-hans.single-spa.js.org/docs/getting-started-overview) 提供有 `cli` 工具，通过 `cli` 工具可以快速创建一个 `single-spa` 应用。

```bash
npm install create-single-spa -g
```

- 第一步 `Directory for new project` 项目的名称，默认直接在当前目录创建；建议使用统一的命名方式比如 `xxx-manager-f2e`
- 第二步 `single-spa application / parcel` 子应用的创建类型；`single-spa root config` 基座的创建类型
- 第三步 无论是基座还是子应用最终都会出现 `Organization name` 个人建议使用组织、业务、公司名等统一的命名方式

最终生成项目的 `package.json` 中 `name` 是 `Organization name/Directory for new project` 的组合。**基座除外，基座名为 `Organization name/root-config`**

### 基座

一般用来加载子应用（通过 [SystemJS](/_project/module_standard)）、数据通信、承接项目中的 `layout` 功能。脚手架创建出来的项目关注两个文件，分别为 `src/index.ejs`、`src/micro-web-root-config.js`。*`micro-web` 是组织名* 

```html
<!-- src/index.ejs -->
<script type="injector-importmap">
  {
    "imports": {
      "@micro-web/root-config": "//localhost:9000/micro-web-root-config.js",
      "@single-spa/welcome": "https://cdn.jsdelivr.net/npm/single-spa-welcome/dist/single-spa-welcome.min.js"
    }
  }
</script>
<script>
  window.importMapInjector.initPromise.then(() => {
    import('@micro-web/root-config');
  });
</script>
```

```js
// src/micro-web-root-config.js
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    import(
      /* webpackIgnore: true */ // @ts-ignore-next
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: location => location.pathname === "/",
});

// 启动基座
start({
  urlRerouteOnly: true,
});
```

如果需要添加子应用需要在 `index.ejs` 增加子应用的链接，再进行导入。然后在 `root-config.js` 中注册。

> 基座的加载的过程大致是，启动 index.ejs -> 导入 @micro-web/root-config -> 执行 root-config.js

### Vue3 子应用

考虑的子路由的切换，只需要在 `createWebHistory` 中传入 `base`。

成功后可能会出现 `Vue` 中的图片在主应用中不显示。解决方案如下。

```
在主应用中的 <meta http-equiv="Content-Security-Policy"></meta> content中加上 img-src 'self' data:。
```

需要关注 `package.json` 中的两条启动命令，如下：

```
// 集成基座启动
"start": "webpack serve",
// 单独启动
"start:standalone": "webpack serve --env standalone",
```

`start` 启动后打开链接会关注 `How do I develop this microfrontend?` 的第一、第四步。复制链接和名称添加到基座中

```html
<!-- 基座 index.ejs -->
<script type="injector-importmap">
  {
    "imports": {
      "@micro-web/root-config": "//localhost:9000/micro-web-root-config.js",
      "@single-spa/welcome": "https://cdn.jsdelivr.net/npm/single-spa-welcome/dist/single-spa-welcome.min.js",
      "@micro-web/xsq-vue-app": "//localhost:3000/js/app.js"
    }
  }
</script>
<script>
  window.importMapInjector.initPromise.then(() => {
    import('@micro-web/root-config');
    import('@micro-web/xsq-vue-app');
  });
</script>
```

```js
// src/micro-web-root-config.js
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    import(
      /* webpackIgnore: true */ // @ts-ignore-next
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: location => location.pathname === "/",
});
registerApplication({
  name: "@micro-web/xsq-vue-app",
  app: () => import("@micro-web/xsq-vue-app"),
  // createWebHistory base 路由
  activeWhen: location => location.pathname.startsWith("/vue"),
});
```

### React 子应用

同样的需要在 `BrowserRouter` 中传入 `basename` 。使用 `start` 启动项目时，需要关注 `How do I develop this microfrontend?` 复制第一步的链接及第四步的名称添加到基座中。

```html
<!-- 基座 index.ejs -->
<script type="injector-importmap">
  {
    "imports": {
      "@micro-web/root-config": "//localhost:9000/micro-web-root-config.js",
      "@single-spa/welcome": "https://cdn.jsdelivr.net/npm/single-spa-welcome/dist/single-spa-welcome.min.js",
      "@micro-web/xsq-react-app": "//localhost:4000/js/app.js"
    }
  }
</script>
<script>
  window.importMapInjector.initPromise.then(() => {
    import('@micro-web/root-config');
    import('@micro-web/xsq-react-app');
  });
</script>
```

```js
// src/micro-web-root-config.js
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    import(
      /* webpackIgnore: true */ // @ts-ignore-next
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: location => location.pathname === "/",
});
registerApplication({
  name: "@micro-web/xsq-react-app",
  app: () => import("@micro-web/xsq-react-app"),
  // BrowserRouter base 路由
  activeWhen: location => location.pathname.startsWith("/react"),
});
```

## single-spa 原理

首先看 `demo` 中的 `registerApplication` 一共就三个参数，实际上还有第四个参数 `props` 可以用来主子应用之间的数据传递。然后每个应用中都会包含自己的生命周期函数。可以简化成如下代码：

```js
const app_a = {
  bootstrap: async () => console.log('app_a bootstrap ~~~'),
  // 生命周期可以允许有多个
  mount: [
    async () => console.log('app_a mount 1 ~~~'),
    async () => console.log('app_a mount 2 ~~~'),
  ],
  unmount: async () => console.log('app_a unmount ~~~')
}

// 创建两个子应用，方便测试 启动 -> 挂载 -> 卸载 的流程
const app_b = {
  bootstrap: async () => console.log('app_b bootstrap ~~~'),
  mount: [
    async () => console.log('app_b mount 1 ~~~'),
    async () => console.log('app_b mount 2 ~~~'),
  ],
  unmount: async () => console.log('app_b unmount ~~~')
}

/**
 * 注册应用，看路径是否匹配，如果匹配就加载对应的文件
 * @param {*} appName
 * @param {*} App
 * @param {*} activeWhen
 * @param {*} customProps
 */
registerApplication('a', async () => app_a, location => location.pathname === '#/a', { a: 1 });
registerApplication('b', async () => app_b, location => location.pathname === '#/b', { b: 2 });

// 开启路径监控，路径切换的时候，可以调用对应的 mount unmount
start();
```

在内部将应用的生命周期分为如下部分：在最开始的时候给 `app` 增加 `status` 属性全是 `NOT_LOADED`，随着后续的执行，一步步的更新状态。

![single-spa](/micro-web/single-spa-status.png)

源码组织方式

```
.
├── application  注册，状态维护，及对于 app 状态的分类
│   ├── app-helper.js
│   └── app.js
├── lifecycles  生命周期
│   ├── load.js
│   ├── bootstrap.js
│   ├── mount.js
│   └── unmount.js
├── navigation  导航路由相关
│   ├── navigate-event.js
│   └── reroute.js
├── single-spa.js  入口文件
└── start.js  启动子应用的入口文件
```

::: code-group 
```js [single-spa.js]
// 根据路径加载应用
export { registerApplication } from './application/app.js';
// 开启应用，挂载组件
export { start } from './start.js'
```

```js [application/app.js]
import { NOT_LOADED } from './app-helper.js';
import { reroute } from '../navigate/reroute.js';

export const apps = []; // 维护一个全局的 app 数组
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  const registeration = {
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED
  };
  apps.push(registeration);

  // 先去加载需要被加载的应用，如果是挂载过的应用，需要现将挂载过的卸载掉，然后再去挂载新的应用
  reroute(); // 重写路由
}
```
:::

定义应用的状态，根据状态进行分类然后抛出，方便后续的启动，加载，卸载，挂载等操作。

::: code-group

```js [application/app-helper.js]
// 加载流程
export const NOT_LOADED = 'NOT_LOADED'; // 没有被加载
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 路径匹配后加载应用
export const LOAD_ERROR = 'LOAD_ERROR';

// 启动流程
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 资源加载完毕，需要启动
export const BOOTSTRAPING = 'BOOTSTRAPING'; // 启动中
export const NOT_MOUNT = 'NOT_MOUNT';

// 挂载流程
export const MOUNTING = 'MOUNTING';
export const MOUNTED = 'MOUNTED';

// 卸载流程
export const UNMOUNTING = 'UNMOUNTING';

// --- 增加一些工具方法
// 子应用是否被激活
export const shouldBeActive = (app) => app.activeWhen(window.location);

// 根据 app 的状态进行分类
export function getAppChanges() {
  const appsToLoad = [];
  const appsToMount = [];
  const appsToUnmount = [];

  apps.forEach(app => {
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (shouldBeActive(app)) {
          appsToLoad.push(app);
        }
        break;
      case NOT_BOOTSTRAPED:
      case BOOTSTRAPING:
      case NOT_MOUNT:
        if (shouldBeActive(app)) {
          appsToMount.push(app);
        }
        break;
      case MOUNTED:
        // 是 mount 但是路径变了，要准备卸载了。
        if (!shouldBeActive(app)) {
          appsToUnmount.push(app);
        }
        break;
    }
  });

  return { appsToLoad, appsToMount, appsToUnmount };
}
```
:::

分析加载流程：

内部实际也是看用户传递的 `activeWhen` 看匹配到了哪个子应用，然后走加载逻辑，从 `shouldBeActive` 可以体现出来。

调用 `start` 方法，进入流程，内部会维护一个 `started` 变量确定是否加载完成，然后调用 `reroute` 方法。

::: code-group 
```js [start.js]
import { reroute } from '../navigate/reroute.js';

export let started = false;
export function start() {
  started = true;
  reroute();
}
```

```js [navigate/reroute.js]
import { getAppChanges, shouldBeActive } from '../application/app-helper.js';
import { toLoadPromise } from '../lifecycles/load.js';
import { started } from '../start.js';

export function reroute() {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  if (started) {
    // 待实现
    return performAppChange();
  }

  function loadApps() {
    return Promise.all(appsToLoad.map(app => toLoadPromise(app)));
  }
  return loadApps();
}
```
:::

`reroute` 在 `registerApplication` 和 `start` 中分别调用了一次。注册的时候直接走 `loadApps` 加载逻辑；`start` 的时候走挂载流程。

::: code-group

```js [lifecycles/load.js]
import { NOT_LOADED, LOADING_SOURCE_CODE, NOT_BOOTSTRAPED } from '../application/app-helper.js';

const flattenArrayToPromise = (fns) => {
  fns = typeof fns === 'function' ? [fns] : fns;
  
  return (props) => {
    // 执行用户传递进来的生命周期
    return fns.reduce((rPromise, fn) => rPromise.then(() => fn(props)), Promise.resolve());
  }
}

export function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    // 不是 NOT_LOADED 表示加载完毕。
    if (app.status !== NOT_LOADED) {
      return app;
    };
    app.status = LOADING_SOURCE_CODE; // 正在加载

    return app.loadApp().then(v => {
      const { bootstrap, mount, unmount } = v;
      app.status = NOT_BOOTSTRAPED
      // 注意：只是整合，还没有执行...
      app.bootstrap = flattenArrayToPromise(bootstrap);
      app.mount = flattenArrayToPromise(mount);
      app.unmount = flattenArrayToPromise(unmount);

      return app;
    });
  });
}
```
:::

`start` 方法开始调用，将 `started` 设置为 `true`，继续调用 `reroute` 方法走 `performAppChange` 分支。

::: code-group

```js [navigate/reroute.js]
import { getAppChanges, shouldBeActive } from "../application/app-helper.js";
import { toMountPromise } from '../lifecycles/mount.js';
import { toUnmountPromise } from '../lifecycles/unmount.js';
import { toBootstrapPromise } from '../lifecycles/bootstrap.js';
import { started } from "../start.js";

export function reroute() {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  if (started) {
    return performAppChange();
  }

  function performAppChange() {
    // 将不需要的应用进行卸载
    const unmountAllPromises = Promise.all(allToUnmount.map(app => toUnmountPromise(app)));

    // 挂载对应的应用, 有一种可能要被挂载的应用已经加载过了，也可能没有被加载过
    // case: 从一个未知路由来到 a 应用路由
    // case: a 路由走完 registerApplication 然后再走 start
    const mountAllPromises = Promise.all(
      appToLoad.map(app => toLoadPromise(app).then((app) => {
        // 当应用加载完毕后，需要启动和挂载，但是保证挂载前先卸载应用。
        return tryBootstrapAndMount(app, unmountAllPromises);
      }))
    );

    function tryBootstrapAndMount(app, unmountAllPromises) {
      // 确保当前路径匹配完成后，再进行启动
      if (shouldBeActive(app)) {
        return toBootstrapPromise(app)
          .then((app) => {
            // 确保全部卸载后，再进行挂载
            return unmountAllPromises.then(() => toMountPromise(app));
          });
      }
    }
  }
  // ... ...
}
```
:::

`bootstrap`, `mount`, `unmount` 需要控制一下内部的状态流转，将 props 进行传递，并且调用。

::: code-group

```js [lifecycles/bootstrap.js]
export function toBootstrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_BOOTSTRAPED) {
      return app;
    }
    app.status = BOOTSTRAPING;
    // 执行用户的接入协议
    return app.bootstrap(app.customProps).then(() => {
      app.status = NOT_MOUNT;
      return app;
    });
  });
}
```

```js [lifecycles/mount.js]
export function toMountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_MOUNT) {
      return app;
    }
    app.status = MOUNTING;
    // 执行用户的接入协议
    return app.mount(app.customProps).then(() => {
      app.status = MOUNTED;
      return app;
    });
  });
}
```

```js [lifecycles/unmount.js]
export function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== MOUNTED) {
      return app;
    }
    app.status = UNMOUNTING;
    // 执行用户的接入协议
    return app.unmount(app.customProps).then(() => {
      app.status = NOT_MOUNT;
      return app;
    });
  });
}
```
:::

> [!NOTE]
> 总结：
>
> 1. 调用 `registerApplication` 给每个应用增加初始状态 `NOT_LOADED` **未加载**，并且第一次调用 `reroute`；
>
> 2. 每次调用 `reroute` 都会根据应用的状态进行分类 `getAppChanges`。 
>
> 3. 第一次通过 `loadApps` 去加载应用，状态为**正在加载** `LOADING_SOURCE_CODE`，调用用户的 `loadApp` 后状态为**没有启动** `NOT_BOOTSTRAPED`；在这个过程中会处理用户的传入的声明周期方法（数组和单个函数）；
>
> 4. 执行 `start` 方法将 `started` 置为 `true`，再次调用 `reroute`；
>
> 5. 第二次根据分类好的数据先将所有已经 `MOUNTED` 的应用进行卸载（如果状态是**挂载成功** `MOUNTED`，就修改为**卸载中** `UNMOUNTING` 和**未加载** `NOT_LOADED`）。然后进入启动挂载流程；
>
> 6. 考虑到用户有可能之前并没有走启动流程（因为是路由匹配，可能是未知路由到 a 子应用）所以还是要加载 `toLoadPromise`；
>
> 7. `tryBootstrapAndMount` 走启动和挂载流程。`toBootstrapPromise` 启动时会将应用的状态修改为**启动中**`BOOTSTRAPING` 和**没有挂载** `NOT_MOUNT`；
>
> 8. `toMountPromise` 挂载之前会先确保已经全部卸载（unmount then 以后）将状态修改为**挂载中**`MOUNTING` 和**挂载成功** `MOUNTED`；

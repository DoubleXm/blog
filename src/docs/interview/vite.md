---
layout: doc
---

## vite 为什么这么快，快在了哪里

- 项目启动快

Vite 在打包的时候，将模块分成两个区域 **依赖** 和 **源码** ：

**依赖** ：一般是那种在开发中不会改变的 `JavaScript`，比如组件库，或者一些较大的依赖（可能有上百个模块的库），这一部分使用 `esbuild` 来进行 预构建依赖 , `esbuild` 使用的是 `Go` 进行编写，比 `JavaScript` 编写的打包器预构建依赖快 10-100 倍

**源码** ：一般是哪种好修改几率比较大的文件，例如 `JSX、CSS、vue` 这些需要转换且时常会被修改编辑的文件。同时，这些文件并不是一股脑全部加载，而是可以按需加载（例如路由懒加载）。 `Vite` 会将文件转换后，以 `es module` 的方式直接交给浏览器，因为现在的浏览器大多数都直接支持 `es module` ，这使性能提高了很多

Vite 是直接把转换后的 es module 的 JavaScript 代码，扔给 支持 es module 的浏览器 ，让浏览器自己去加载依赖，也就是把压力丢给了 浏览器 ，从而达到了项目启动速度快的效果。

![vite1](/interview/browser/vite1.png)

- 项目更新快

项目启动时，将模块分成 **依赖** 和 **源码** ，当你更新代码时， **依赖** 就不需要重新加载，只需要精准地找到是哪个 **源码** 的文件更新了，更新相对应的文件就行了。这样做使得更新速度非常快。

`Vite` 同时利用 `HTTP` 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：

::: tip

源码模块的请求会根据 `304 Not Modified` 进行协商缓存。

而依赖模块请求则会通过 `Cache-Control: max-age=31536000`, `immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

:::

- 生产环境快

为了在生产环境中获得最佳的加载性能，使用了 `rollup` 将代码进行 `tree-shaking`、懒加载和 `chunk` 分割、CSS 处理，这些优化操作，目前 `esbuild` 还不怎么完善

## vite 与 webpack 对比

由于 `Vite` 主打的是开发环境的极致体验，生产环境集成 `Rollup`，这里的对比主要是 `Webpack-dev-server` 与 `Vite-dev-server` 的对比：

- `Webpack` 配置丰富使用极为灵活但上手成本高，`Vite` 开箱即用配置高度集成
- `Webpack` 启动服务需打包构建，速度慢，`Vite` 免编译可秒开
- `Webpack` 热更新需打包构建，速度慢，`Vite` 毫秒响应
- `Webpack` 成熟稳定、资源丰富、大量实践案例，`Vite` 实践较少
- `Vite` 使用 `esbuild` 编译，构建速度比 `webpack` 快几个数量级

## 双引擎架构实现

![vite2](/interview/browser/vite2.png)

- 开发阶段：`ESBuild` 依赖预构建 主要是 ESM 格式的兼容性问题和海量请求的问题

- 单文件编译——作为 `TS` 和 `JSX` 编译工具 `ESBuild` 代替 `bable` 的工作，对代码进行 `transformer`

- 生产环境 `ESBuild` 代码压缩

- 生产环境 `Bundle` 基于 `Rollup`

  1. `CSS` 代码分割。如果某个异步模块中引入了一些 `CSS` 代码，`Vite` 就会自动将这些 CSS 抽取出来生成单独的文件，提高线上产物的缓存复用率。
  2. 自动预加载。`Vite` 会自动为入口 chunk 的依赖自动生成预加载标签 `<link rel="moduelpreload">` 会让浏览器提前下载好资源，优化页面性能，如:

  ```html
  <head>
    <!-- 省略其它内容 -->
    <!-- 入口 chunk -->
    <script type="module" crossorigin src="/assets/index.250e0340.js"></script>
    <!--  自动预加载入口 chunk 所依赖的 chunk-->
    <link rel="modulepreload" href="/assets/vendor.293dca09.js" />
  </head>
  ```

  3. 异步 `Chunk` 加载优化 如现有两个异步引入的 `Chunk`: A 和 B，而且两者有一个公共依赖 C

  一般情况下，`Rollup` 打包之后，会先请求 A，然后浏览器在加载 A 的过程中才决定请求和加载 C

  但 `Vite` 进行优化之后，请求 A 的同时会自动预加载 C，通过优化 Rollup 产物依赖加载方式节省了不必要的网络开销。

## vite 预构建主要做了些什么

Vite 中的依赖预构建技术主要解决了 2 个问题，即模块格式兼容问题和海量模块请求的问题。

## webpack 中 Loader 和 Plugin 有什么不同

Loader 直译为"加载器"。Webpack 将⼀切⽂件视为模块，但是 webpack 原⽣是只能解析 js ⽂件，如果想将其他⽂件也打包的话，就会⽤到 loader 。 所以 Loader 的作⽤是让 webpack 拥有了加载和解析⾮ JavaScript ⽂件的能⼒。

::: details 常用的 loader

- babel-loader 把 JS/TS 变成 JS
- ts-loader 把 TS 变成 JS，并提示类型错误
- markdown-loader 把 markdown 变成 html
- html-loader 把 html 变成 JS 字符串
- sass-loader 把 SASS/SCSS 变成 CSS
- css-loader 把 CSS 变成 JS 字符串
- style-loader 把 JS 字符串变成 style 标签
- postcss-loader 把 CSS 变成更优化的 CSS
- vue-loader 把单文件组件（SFC）变成 JS 模块
- thread-loader 用于多进程打包
- file-loader 解决图片引入问题，将图片 copy 到指定目录(默认 dist)
- url-loader 将小于 limit 选项配置大小的图片转换为 base64 编码，大于 limit 选项配置大小的图片还是采用 file-loader

:::

Plugin 直译为"插件"。Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。在 Webpack 运⾏的⽣命周期中会⼴播出许多事 件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

::: details 常用的 plugin

- html-webpack-plugin 用于创建 HTML 页面并自动引入 JS 和 CSS
- clean-webpack-plugin 用于清理之前打包的残余文件
- mini-css-extract-plugin 用于将 JS 中的 CSS 抽离成单独的 CSS 文件
- SplitChunksPlugin 用于代码分包（Code Split）
- DllPlugin + DllReferencePlugin 用于避免大依赖被频繁重新打包，大幅降低打包时间
- eslint-webpack-plugin 用于检查代码中的错误
- DefinePlugin 用于在 webpack config 里添加全局变量
- copy-webpack-plugin 用于拷贝静态文件到 dist

:::

## webpack 中 bundle，chunk，module 是什么

- bundle：是由 webpack 打包出来的⽂件；
- chunk：代码块，⼀个 chunk 由多个模块组合⽽成，⽤于代码的合并 和分割；
- module：是开发中的单个模块，在 webpack 的世界，⼀切皆模块，⼀ 个模块对应⼀个⽂件，webpack 会从配置的 entry 中递归开始找出所 有依赖的模块。

## webpack 的构建流程

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
- 确定入口：根据配置中的 entry 找出所有的入口文件；
- 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## Webpack 层面如何性能优化？

**优化构建速度**

- 构建费时分析 `speed-measure-webpack-plugin`
- 构建进度查看：`progress-bar-webpack-plugin`
- `resolve` 配置优化
  - `alias` 别名，用来简化模块的引用
  - `extensions` 当用户引入的文件不带后缀名，手动配置会覆盖默认配置。['.ts', '...']，...表示采用默认配置
  - `modules` 告诉 `webpack` 优先查找 src 目录中的文件，modules: [resolve('src'), 'node_modules']
- `externals` 剥离不需要改动的一些依赖(从输出的 bundle 中排除依赖)
- `loader` 中使用 include 解析符合条件的模块、exclude 排除(不解析)符合条件的模块，优先级高于 include
- `noParse` 不解析依赖的第三方类库等
- `IgnorePlugin` 防止在 import 或 require 调用时，生成 contextRegExp 指定资源不符合 requestRegExp 正则匹配的资源
- `thread-loader` 开启多进程打包，happypack webpack5 已经弃用了
- `babel-loader` 启用缓存，缓存结果，大幅提升重新构建 js 文件的速度
- `cache-loader` 缓存其他 loader 的构建结果
- `hard-source-webpack-plugin` 为模块提供中间缓存，重复构建时间大约可以减少 80%，但是在 webpack5 中已经内置了模块缓存，不需要再使用此插件
- `cache` 通过配置 cache 来缓存生成的 webpack 模块和 chunk，来改善构建速度

**优化构建结果**

- webpack-bundle-analyzer 对构建结果分析
- optimize-css-assets-webpack-plugin 压缩 css 文件
- terser-webpack-plugin 压缩 js 文件，在生成环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置
- purgecss-webpack-plugin 单独提取 css 文件并清除用不到的 css
- Tree-shaking 剔除没有使用的代码，webpack 默认支持，需要在 .bablerc 里面设置 model：false，即可在生产环境下默认开启
- Scope Hoisting Scope Hoisting 即作用域提升，原理是将多个模块放在同一个作用域下，并重命名防止命名冲突，通过这种方式可以减少函数声明和内存开销，只支持 es6 语法，生产环境默认开启

**优化运行时体验**

- 入口点分割：配置多个打包入口，多页打包
- splitChunks 分包配置，webpack 将根据以下条件自动拆分 chunks：
  - 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
  - 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
  - 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
  - 当加载初始化页面时，并发请求的最大数量小于或等于 30
- 代码懒加载：当有需要用户交互后才加载的资源时，可以当用户操作后，引入资源
  - webpackprefetch (预获取)：浏览器空闲的时候进行资源的拉取
  - webpackpreload (预加载)：提前加载后面会用到的关键资源


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

## Vite 双引擎架构实现

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
---
isTimeLine: true
title: Webpack
description: 整理 Webpack 相关面试题，不定时更新...
date: 2020-10-27
tags:
 - 大前端
 - 面试
categories:
 - 大前端
---

# Webpack

## Loader 和 Plugin 有什么不同

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

## bundle，chunk，module 是什么

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

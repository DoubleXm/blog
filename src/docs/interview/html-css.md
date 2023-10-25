---
layout: doc
---

## HTML5 特性有哪些？

1. 多媒体，用于媒介回放的 `video` 和 `audio` 元素。

2. 图像效果，用于绘画的 `canvas` 元素，`svg` 元素等。

3. 离线&存储，对本地离线存储能够更好地支持，比如 `localstorage,Cookies` 等。

4. 性能与集成特性，`HTML5` 会通过 `XML HttpRequest2`等技术，帮助您的 `Web` 应用和网站在多样化的环境中更快速地工作

## Meta 标签，都有一些什么特性，有什么作用 ？

**什么是 `meta` 标签**：`<meta>` 标签提供关于 HTML 文档的元数据，它不会显示在页面上，但是对于机器是可读 的，可用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他 web 服务。

**meta 的作用**：`meta` 里的数据是供机器解读的，告诉机器该如何解析这个页面，还有一个用途是可以添加服 务器发送到浏览器的 `HTTP` 头部内容。

**常用 `meta` 标签总结**：

- `Charset`：它是声明文档使用的字符编码，以防乱码，而且一定要写在第一行
- `Viewport`： 主要是影响移动端页面布局的。

## 前端需要注意哪些 SEO

1. 合理的 `title`、 `description`、 `keywords`：搜索对着三项的权重逐个减小，`title` 值强调重点即可，重要关键词出现不要超过 2 次，而且要靠前，不同⻚⾯`title` 要有所不同；`description` 把⻚⾯内容高度概括，⻓度合适，不可过分堆砌关键词，不同⻚⾯ `description` 有所不同；`keywords` 列举出重要关键词即可。
2. 语义化的 `HTML` 代码，符合 `W3C` 规范：语义化代码让搜索引擎容易理解网⻚
3. 重要内容 `HTML` 代码放在最前：搜索引擎抓取 `HTML` 顺序是从上到下， 有的搜索引擎对抓 取⻓度有限制，保证重要内容⼀定会被抓取
4. 重要内容不要用 `js` 输出：爬虫不会执⾏ `js` 获取内容
5. 少用 `iframe`，搜索引擎不会抓取 `iframe` 中的内容
6. ⾮装饰性图片必须加 `alt`
7. 提高网站速度：网站速度是搜索引擎排序的⼀个重要指标

## 什么是渐进式渲染 ？

指打开页面先加载首屏显示的内容，之后再随着时间或者滚动页面才进行后面的加载 。

## 对 HTML 语义化的理解

语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）。通俗来讲就是用正确的标签做正确的事情。

对机器友好，更适合搜索引擎的爬虫爬取有效信息，有利于 SEO。除此之外，语义类还支持读屏软件。

对开发者友好，使用语义类标签增强了可读性，结构更加清晰，便于团队的开发与维护。

::: tip 常见的语义化标签

```html
<!-- 头部 -->
<header></header>
<!-- 导航栏 -->
<nav></nav>
<!-- 区块 有语义的 div -->
<section></section>
<!-- 主要区域 -->
<main></main>
<!-- 主要内容 -->
<article></article>
<!-- 侧边栏 -->
<aside></aside>
<!-- 底部 -->
<footer></footer>
```

:::

## DOCTYPE(⽂档类型) 的作⽤

`DOCTYPE` 是 `HTML5` 中一种标准通用标记语言的文档类型声明，它的目 的是告诉浏览器（解析器）应该以什么样（`html` 或 `xhtml`）的文档类 型定义来解析文档

## script 标签中 defer 和 async 的区别

如果没有 `defer` 或 `async` 属性，浏览器会立即加载并执行相应的脚本。 它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样 就阻塞了后续文档的加载。

![scriptDefer](/interview/browser/scriptDefer.jpeg)

其中蓝色代表 `js` 脚本网络加载时间，红色代表 `js` 脚本执行时间，绿色代表 `html` 解析。

`defer` 和 `async` 属性都是去异步加载外部的 `JS` 脚本文件，它们都不 会阻塞页面的解析，其区别如下：

- 执行顺序：多个带 `async` 属性的标签，不能保证加载的顺序；
- 多个带 `defer` 属性的标签，按照加载顺序执行；

## 行内元素有哪些？块级元素有哪些？ 空(void)元素有哪那些？

行内元素有：`a` `b` `span` `img` `input` `select` `strong`；

块级元素有：`div` `ul` `ol` `li` `dl` `dt` `dd` `h1` `h2` `h3` `h4` `h5` `h6` `p`；

空元素，即没有内容的 HTML 元素。常见的有：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`；

## link 和 @import 的区别

- `link` 引用 `CSS` 时，在页面载入时同时加载；`@import` 需要页面网页完 全载入以后加载。
- `link` 是 `XHTML` 标签，无兼容问题；`@import` 是在 `CSS2.1` 提出的，低 版本的浏览器不支持。

`link` 支持使用 `Javascript` 控制 `DOM` 去改变样式；而`@import` 不支持。

## src 和 href 的区别

`src` 用于替换当前元素， `href` 用于在当前⽂档和引用资源之间确立联系。

- `src` 是 `source` 的缩写，指向外部资源的位置，指向的内容将会嵌⼊到⽂档中当前标签所 在位置；在请求 `src` 资源时会将其指向的资源下载并应用到⽂档内，例如 `js` 脚本， `img` 图片和 `frame` 等元素。
- `href` 是 `Hypertext Reference` 的缩写，指向⽹络资源所在位置， 建立和当前元素 (锚点) 或当前⽂档 (链接) 之间的链接， 如果我们在⽂档中添加 `<link href="common.css" rel="stylesheet"/>` 那么浏览器会识别该⽂档为 `css` ⽂件，就会并⾏下载资源并且不会停止对当前⽂档的处理 。这也是为什么建议使用 `link` ⽅ 式来加载 `css`， 而不是使用` @import` ⽅式。

## base64 的缺点和优点

有点是可以加密，减少网站的 `http` 请求，缺点就是消耗 `CPU` 的性能进行解码和编码。

## CSS3 中有哪些新特性

- `border-radius` 圆角属性 `border-radius: 10px;`
- `text-shadow` 文字阴影 `text-shadow: 1px 1px 2px black;`
- `gradient` 线性渐变 `background: linear-gradient(blue, pink);`
- `transform` 位移，旋转，缩放 `transform: translate(50px 50px);`
- `transition` 过渡 `transtion: all .3s ease;`
- `animation` 动画 `animation: 3s ease-in 1s infinite reverse both running slidein;`

## CSS 选择器及优先级

选择器

- `id` 选择器(`#myid`)
- 类选择器(`.myclass`)
- 属性选择器(`a[rel="external"]`)
- 伪类选择器(`a:hover, li:nth-child`)
- 标签选择器(`div, h1,p`)
- 相邻选择器（`h1 + p`）
- 子选择器(`ul > li`)
- 后代选择器(`li a`)
- 通配符选择器(`\*`)

优先级

- `!important`
- 内联样式（1000）
- ID 选择器（0100）
- 类选择器/属性选择器/伪类选择器（0010）
- 元素选择器/伪元素选择器（0001）
- 关系选择器/通配符选择器（0000）

## 对 CSSSprites 的理解

将一个页面涉及到的所有图片都包含到一张 大图中去，然后利用 `CSS` 的 `background-image`，`background-repeat`， `background-position` 属性的组合进行背景定位。

优点：利用 `CSS Sprites` 能很好地减少网页的 `http` 请求，提高页面的性能。

缺点：开发比较麻烦。

## display 的 block、inline 和 inline-block 的区别

- `block`：会独占一行，可以设置 `width`、 `height`、`margin` 和 `padding` 属性；
- `inline`：元素不会独占一行，`width`、`height`属性无效。水平 `margin` `padding` 有效，垂直无效。
- `inline-block`：元素不会独占一行，可以设置 `width`、 `height`、`margin` 和 `padding` 属性；

## 盒子模型类型

- IE 盒模型：盒子大小计算方式，指的是 `width + height + padding + border` 。
- W3C 标准盒模型：盒子大小计算 `width + height`，不包含 `border` 和 `padding` 。

## CSS 优化和提高性能的方法有哪些？

1. css 压缩减小文件体积。
2. css 单一样式，比如 `margin: 10px 0;` 可以写成 `margin-top: 10px; margin-bottom: 10px;` 执行效率会更高
3. 减少使用`@import` 因为他会等待页面加载完成之后才会加载。建议使用 `link`
4. 避免使用通配符选择器 `* {}`，标签选择器，而是使用 `class`

## 常见的 CSS 布局单位

- `px`: 像素单位
- `rpx`: 小程序布局单位
- `%`: 相对于父元素的百分比单位
- `em`: 相对单位 `1em` 等同于父元素的文字大小
- `rem`: 相对单位 `1rem` 等同于 `html` 根元素的文字大小
- `vh`: 相对单位 `1vh` 等同于屏幕高度的 `1%`
- `vw`: 相对单位 `1vw` 等同于屏幕快读的 `1%`
- `vmin`: 选取 `vh` 和 `vw` 的最小值为基准
- `vmax`: 选取 `vh` 和 `vw` 的最大值为基准

## 水平垂直居中的实现

::: details 利用绝对定位，设置 `left: 50%` 和 `top: 50%` 现将子元素左上角移到父元素中心位置，然后再通过 `translate` 来调整子元素的中心点到父元素的中心。该方法可以不定宽高。

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

:::

::: details 利用绝对定位，设置 `left: 50%` 和 `top: 50%` 现将子元素左上角移到父元素中心位置，然后再通过 `margin-left` 和 `margin-top` 以子元素自己的一半宽高进行负值赋值

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -100px;
}
```

:::

::: details 利用绝对定位，子元素所有方向都为 `0` ，将 margin 设置为 `auto` ，由于宽高固定，对应方向实现平分

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
  margin: auto;
  height: 100px;
  width: 100px;
}
```

:::

::: details 利用 flex

```css
.father {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

:::

## 对 BFC 的理解，如何创建 BFC

块格式化上下文（`Block Formatting Context`）是 Web 页面的 可视化 `CSS` 渲染的一部分，是布局过程中生成块级盒子的区域，也是 浮动元素与其他元素的交互限定区域。

通俗来讲：`BFC` 是一个独立的布局环境，可以理解为一个容器，在这 个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物 品。如果一个元素符合触发 `BFC` 的条件，则 `BFC` 中的元素布局不受外 部影响。

创建 BFC 的条件：

- 根元素：`body`；
- 元素设置浮动：`float` 除 `none` 以外的值；
- 元素设置绝对定位：`position (absolute、fixed)`；
- `display` 值为：`inline-block`、`table-cell`、`table-caption`、`flex` 等；
- `overflow` 值为：`hidden`、`auto`、`scroll`；

`BFC` 的特点：

- 垂直方向上，自上而下排列，和文档流的排列方式一致。
- 在 `BFC` 中上下相邻的两个容器的 `margin` 会重叠，计算 `BFC` 的高度时，需要计算浮动元素的高度
- `BFC` 区域不会与浮动的容器发生重叠
- `BFC` 是独立的容器，容器内部元素不会影响外部元素，每个元素的左 `margin` 值和容器的左 `border` 相接触

`BFC` 的作用：

- 解决 `margin` 的重叠问题：由于 BFC 是一个独立的区域，内部的元素 和外部的元素互不影响，将两个元素变为两个 `BFC`，就解决了 `margin` 重叠的问题。
- 解决高度塌陷的问题：在对子元素设置浮动后，父元素会发生高度塌陷。解决这个问题，只需要把父元素变成一个 `BFC`。常用的办法是给父元素设置 `overflow:hidden`。

## display: none, opacity: 0, visibility: hidden 有什么区别？

::: tip
`display: none` 隐藏后不占位置，子元素不会显示，事件不会触发，`transtion` 无效；
:::

::: tip
`visibility: hidden` 隐藏后占位置，会被子元素继承，可以让子元素设置 `visibility: visable` 显示，不会触发事件，`transtion` 无效；
:::

::: tip
`opacity: 0` 隐藏后占位置，会被子元素继承, 但是无法设置子元素显示。事件可以触发，`transtion` 有效；
:::

## 使用 CSS 实现隐藏元素的方式有几种 ？

1. `Opacity`: 设置一个元素的透明度 `.hide{opacity:0;}`

2. `Visibility` `.hide{visibility:hidden}`

3. `Display`: 确保元素不可见并且连盒模型也不生成 `.hide{display:none}`

4. `Position` `.hide{position:absolute; top:-9999px; left:-9999px;}`

## iframe 有那些缺点？

1. `iframe` 会阻塞主⻚⾯的 `Onload` 事件
2. 搜索引擎的检索程序无法解读这种⻚⾯，不利于 `SEO`
3. `iframe` 和主⻚⾯共享连接池， 而浏览器对相同域的连接有限制，所以会影响⻚⾯的并⾏加载
4. 使用 `iframe` 之前需要考虑这两个缺点 。如果需要使用 `iframe`，最好是通过 `javascript` 动态给 `iframe` 添加 `src` 属性值，这样可以绕开以上两个问题。

## 讲一讲 HTML 语义化

用正确的标签做正确的事情

- **利于开发**：结构清晰，可读性高，方便维护
- **利于SEO**：方便爬虫根据 语义标签 确定 页面结构 和 关键字 的权重
    - tdk（title、description、keyword）

发展历程：最开始后端写 HTML 用 table，后来美工用 div + css（无语义），前端用语义元素（ h1，p，article ）

## 常用语义标签

```html
header / main / aside / section / article / footer / canvas / video / audio

canvas（ beginPath, strokeStyle, stroke 闭合 ）

video（ loop controls poster, src, autoplay ）
```

## 语义化实践

尽可能少的使用无语义的标签 `div` 和 `span`

不要使用纯样式标签，如：`b、font、u` 等，改用 `css` 设置

需要强调的文本，可以包含在 `strong` 或 `em` 标签中，`strong` 默认样式是加粗（不要用 `b`），`em` 是斜体（不要用 `i` 标签）

使用表格时，标题要用 `caption`，表头用 `thead`，主体部分用 `tbody` 包围，尾部用 `tfoot` 包围。表头和一般单元格要区分开，表头用 `th`，单元格用 `td`

每个 `input` 标签对应的说明文本都需要使用 `label` 标签，并且通过为 `input` 设置 `id` 属性，在 `lable` 标签中设置 `for=someld` 来让说明文本和相对应的 `input` 关联起来

不仅写 `HTML` 结构时，要用语义化标签，给元素写 `CSS` 类名时，`JS` 类名、方法名、变量命名等也要遵循语义化原则。不随意取名，不利于后期的代码重构和维护。同时，也最好不要用汉语拼音命名。

# meta viewport 是做什么的

`meta viewport` 是一个 `HTML` 元素，用于控制网页在移动设备上的显示和缩放行为。它通过设置 `viewport` 元素的属性，告诉浏览器如何调整页面的尺寸和缩放，以适应不同屏幕大小和分辨率的设备。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
```

- name 为 viewport 表示供移动设备使用
- content 定义了 viewport 的属性
    - width 表示显示宽度为设备宽度（兼容苹果）
    - initial-scale 表示设备与视口的缩放比率（兼容IE）

```html
<!-- 定义网页文档的字符集 -->
<meta charset="utf-8" />

<!-- 网页作者 -->
<meta name="author" content="开源技术团队"/>
<!-- 网页地址 -->
<meta name="website" content="https://www.baidu.com"/>
<!-- 网页版权信息 -->
 <meta name="copyright" content="2020-2021 demo.com"/>
<!-- 网页关键字, 用于SEO -->
<meta name="keywords" content="meta,html"/>
<!-- 网页描述 -->
<meta name="description" content="网页描述"/>
<!-- 搜索引擎索引方式，一般为all，不用深究 -->
<meta name="robots" content="all" />
<!-- 移动端常用视口设置 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
<!-- 
  viewport参数详解：
  width：宽度（数值 / device-width）（默认为980 像素）
  height：高度（数值 / device-height）
  initial-scale：初始的缩放比例 （范围从>0 到10）
  minimum-scale：允许用户缩放到的最小比例
  maximum-scale：允许用户缩放到的最大比例
  user-scalable：用户是否可以手动缩 (no,yes)
 -->
```

## script 标签中 defer 和 async 的区别

如果没有 defer 或 async 属性，浏览器会立即加载并执行相应的脚本。 它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样 就阻塞了后续文档的加载。

![scriptDefer](/interview/scriptDefer.png)

其中蓝色代表 js 脚本网络加载时间，红色代表 js 脚本执行时间，绿色代表 html 解析。

defer 和 async 属性都是去异步加载外部的 JS 脚本文件，它们都不 会阻塞页面的解析，其区别如下：

执行顺序：多个带 async 属性的标签，不能保证加载的顺序；
多个带 defer 属性的标签，按照加载顺序执行；

## 说一下 Web Quality(无障碍)

能够被残障人士使用的网站才能称得上一个易用的(易访问的)网站。

残障人士指的是那些带有残疾或者身体不健康的用户。

e.g. 使用 alt 属性:

`<img src="person.jpg" alt="this is a person"/> 有时候浏览器会无法显示图像。`

具体的原因有:

- 用户关闭了图像显示
- 浏览器是不支持图形显示的迷你浏览器
- 浏览器是语音浏览器(供盲人和弱视人群使用)

如果使用了 alt 属性，那么浏览器至少可以显示或读出有关图像的描述。

## 说一下 Web Worker

在 HTML 页面中，如果在执行脚本时，页面的状态是不可响应的，直到脚本执行完成后，页面才变成可响应。web worker 是运行在后台的 JS，独立于其他脚本，不会影响页面你的性能。并且通过 postMessage 将结果回传到主线程。这样在进行复杂操作的时候，就不会阻塞主线程了。

如何创建 web worker: [参考](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)

1. 检测浏览器对于 web worker 的支持性
2. 创建 web worker 文件(js，回传函数等)
3. 创建 web worker 对象

## 什么是 Data URL

`Data URL` 是将图片转换为 `base64` 直接嵌入到了网页中，使用 `<img src="data:[MIME type];base64"/>` 这种方式引用图片，不需要再发请求获取图片。

### Data URL 有缺点嘛？

- base64 编码后的图片会比原来的体积大三分之一左右
- Data URL 形式的图片不会缓存下来，每次访问页面都要被下载一次。
    - 可以将 Data URL 写入到 CSS 文件中随着 CSS 被缓存下来。

## Canvas 和 SVG 有什么区别

| Canvas        |      SVG      |
| ------------- | :-----------: |
| 它是通过 JavaScript 来绘制的      | 使用 XML 的 2d 语言 |
| 取决于分辨率（依赖）      |   独立于分辨率（不依赖）    |
| 不支持事件处理程序 |   支持事件处理程序    |
| 适用于小规模渲染应用程序 |   在大规模渲染应用程序中表现更好    |
| 最适合图像密集型的游戏，其中的许多对象会被频繁重绘 |   不适合游戏应用，复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）    |

适用范围：
- Canvas 是逐像素进行渲染的，一旦图形绘制完成，就不会继续被浏览器关注。而 SVG 是通过 DOM 操作来显示的。
- 所以 Canvas 的文本渲染能力弱，而 SVG 最适合带有大型渲染区域的应用程序。
- Canvas 最适合有许多对象要被频繁重绘的图形密集型游戏。
- SVG 由于 DOM 操作 在复杂度高的游戏应用中 会减慢渲染速度。所以不适合在游戏应用。

## iframe 有那些缺点？

1. iframe 会阻塞主⻚⾯的 Onload 事件
2. 搜索引擎的检索程序无法解读这种⻚⾯，不利于 SEO
3. iframe 和主⻚⾯共享连接池， 而浏览器对相同域的连接有限制，所以会影响⻚⾯的并⾏加载
4. 使用 iframe 之前需要考虑这两个缺点 。如果需要使用 iframe，最好是通过 javascript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题。
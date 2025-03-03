## CSS3 中有哪些新特性

- `border-radius` 圆角属性 `border-radius: 10px;`
- `text-shadow` 文字阴影 `text-shadow: 1px 1px 2px black;`
- `gradient` 线性渐变 `background: linear-gradient(blue, pink);`
- `transform` 位移，旋转，缩放 `transform: translate(50px 50px);`
- `transition` 过渡 `transtion: all .3s ease`;
- `animation` 动画 `animation: 3s ease-in 1s infinite reverse both running slidein;`

## CSS 选择器及优先级

选择器

- id 选择器(#myid)
- 类选择器(.myclass)
- 属性选择器(a[rel="external"])
- 伪类选择器(a:hover, li:nth-child)
- 标签选择器(div, h1,p)
- 相邻选择器（h1 + p）
- 子选择器(ul > li)
- 后代选择器(li a)
- 通配符选择器(\*)

优先级

- !important
- 内联样式（1000）
- ID 选择器（0100）
- 类选择器/属性选择器/伪类选择器（0010）
- 元素选择器/伪元素选择器（0001）
- 关系选择器/通配符选择器（0000）

## 对 CSSSprites 的理解

将一个页面涉及到的所有图片都包含到一张 大图中去，然后利用 CSS 的 background-image，background-repeat， background-position 属性的组合进行背景定位。

优点：利用 CSS Sprites 能很好地减少网页的 http 请求，提高页面的性能。

缺点：开发比较麻烦。

## 盒子模型类型

- IE 盒模型：盒子大小计算方式，指的是 width + height + padding + border 。
- W3C 标准盒模型：盒子大小计算 width + height，不包含 border 和 padding 。

## CSS 优化和提高性能的方法有哪些？

1. css 压缩减小文件体积。
2. css 单一样式，比如 margin: 10px 0; 可以写成 margin-top: 10px; margin-bottom: 10px; 执行效率会更高
3. 减少使用@import 因为他会等待页面加载完成之后才会加载。建议使用 link
4. 避免使用通配符选择器 * {}，标签选择器，而是使用 class

## 常见的 CSS 布局单位

- px: 像素单位
- rpx: 小程序布局单位
- %: 相对于父元素的百分比单位
- em: 相对单位 1em 等同于父元素的文字大小
- rem: 相对单位 1rem 等同于 html 根元素的文字大小
- vh: 相对单位 1vh 等同于屏幕高度的 1%
- vw: 相对单位 1vw 等同于屏幕快读的 1%
- vmin: 选取 vh 和 vw 的最小值为基准
- vmax: 选取 vh 和 vw 的最大值为基准

## 水平垂直居中的实现

利用绝对定位，设置 left: 50% 和 top: 50% 现将子元素左上角移到父元素中心位置，然后再通过 translate 来调整子元素的中心点到父元素的中心。该方法可以不定宽高。

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

利用绝对定位，设置 left: 50% 和 top: 50% 现将子元素左上角移到父元素中心位置，然后再通过 margin-left 和 margin-top 以子元素自己的一半宽高进行负值赋值

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
利用绝对定位，子元素所有方向都为 0 ，将 margin 设置为 auto ，由于宽高固定，对应方向实现平分

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

利用 flex

```css
.father {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## 为什么要初始化 CSS 样式?

- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

- 最简单的初始化方法： `* { padding: 0; margin: 0; }` （强烈不建议）
- 使用 `normalize.css`

## CSS 优先级算法如何计算？

- 优先级就近原则，同权重情况下样式定义最近者为准;
- 载入样式以最后载入的定位为准;

优先级为:

- 同权重: 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）。
- !important > id > class > tag
- !important 比 内联优先级高

## min-width、max-width、width 的包含（优先级）关系

**属性的含义：**

- `min-width` 限制元素的最小宽度
- `max-width` 限制元素的最大宽度
- `width` 元素的宽度

**三者之间的优先级：**

`min-width` 和 `max-width` 的优先级都高于 `width`。即使 `width` 后面加上 `!important`。

- 当浏览器缩小导致元素宽度小于 `min-width` 时，元素的 `width` 就会被 `min-width` 的值取代，浏览器出现滚动条来容纳元素。
- 当浏览器放大导致元素的宽度大于 `max-width` 时，元素的 `width` 就会被 `max-width` 值取代。
- 当 `min-width` 值大于 `max-width` 时，则以 `min-width` 值为准。

**所以三者优先级排序： min-width > max-width > width**

当 `min-width > width` 时，以 `min-width` 为主

```html
<style>
  .box {
    min-width: 600px;
    max-width: 1000px;
    /*当width值设为<600px时，盒子始终以宽600px呈现*/
    /*当width值设为>1000px时，盒子始终以宽1000px呈现*/
    width: 200px;
    height: 100px;
    background-color: red;
  }
</style>
<body>
  <div class="box"></div>
  <div class="item"></div>
</body>
```

当 `max-width < width` 时，以 `max-width` 为主

```html
<style>
  .box {
    min-width: 600px;
    max-width: 1000px;
    /*当浏览器缩放过程中，计算得到width值<min-width时，则宽度为600px*/
    /*当浏览器放大程中，计算得到width值>max-width时，则宽度为1000px*/
    width: 100%;
    height: 100px;
    background-color: red;
  }
</style>
<body>
  <div class="box"></div>
  <div class="item"></div>
</body>
```

## 元素竖向的百分比设定是相对于父容器的高度吗？

- 对于 `height` 属性来说是的。
- 对于 **margin-top/bottom(padding-top/bottom) 来讲不是**，而是**相对于容器的宽度**计算的

## 对 BFC 的理解，如何创建 BFC

块格式化上下文（Block Formatting Context）是 Web 页面的 可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是 浮动元素与其他元素的交互限定区域。

通俗来讲：BFC 是一个独立的布局环境，可以理解为一个容器，在这 个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物 品。如果一个元素符合触发 BFC 的条件，则 BFC 中的元素布局不受外 部影响。

创建 BFC 的条件：

- 根元素：body；
- 元素设置浮动：float 除 none 以外的值；
- 元素设置绝对定位：position (absolute、fixed)；
- display 值为：inline-block、table-cell、table-caption、flex 等；
- overflow 值为：hidden、auto、scroll；

BFC 的特点：

- 垂直方向上，自上而下排列，和文档流的排列方式一致。
- 在 BFC 中上下相邻的两个容器的 margin 会重叠，计算 BFC 的高度时，需要计算浮动元素的高度
- BFC 区域不会与浮动的容器发生重叠
- BFC 是独立的容器，容器内部元素不会影响外部元素，每个元素的左 margin 值和容器的左 border 相接触

BFC 的作用：

- 解决 margin 的重叠问题：由于 BFC 是一个独立的区域，内部的元素 和外部的元素互不影响，将两个元素变为两个 BFC，就解决了 margin 重叠的问题。
- 解决高度塌陷的问题：在对子元素设置浮动后，父元素会发生高度塌陷。解决这个问题，只需要把父元素变成一个 BFC。常用的办法是给父元素设置 overflow:hidden。

## 清除浮动

由于浮动元素不再占用原文档流的位置，所以它会对后面的元素排版产生影响（div忽视它的存在，但文字环绕），为了解决这些问题，此时就需要在该元素中清除浮动。准确地说，并不是清除浮动，而是清除浮动后造成的影响。

清除浮动主要为了解决父级元素因为子级浮动引起内部高度为 0 的问题。

### 1.额外标签法

在浮动元素末尾添加一个空的标签例如

```html
<div style="clear:both;"></div>
```

或则其他标签br等亦可。

- 优点：通俗易懂，书写方便
- 缺点：添加许多无意义的标签，结构化较差。

### 2.父级添加 overflow 属性方法

可以通过触发 BFC 的方式，可以实现清除浮动效果。

```css
可以给父级添加： overflow 为 hidden|auto|scroll  都可以实现。
```

- 优点：代码简洁
- 缺点：内容增多时候容易造成不会自动换行导致内容被隐藏掉，无法显示需要溢出的元素。
（不能自动换行可以设置浮动元素的 `word-wrap` 属性值为 `break-word`）

### 3. 使用 after 伪元素清除浮动

**:after 方式为空元素的升级版，好处是不用单独加标签了**

给浮动元素的父元素添加 class 类 clearfix

```css
.clearfix::after {  
   content: "";
   display: block; 
   height: 0; 
   clear: both; 
   visibility: hidden; 
 }   

.clearfix {
  *zoom: 1;
}   /* IE6、7 专有 */
```

- 优点：符合闭合浮动思想，结构语义化正确
- 缺点：由于IE6-7不支持:after，可以使用 zoom:1 触发 hasLayout。~~
- 注意：`content:"."` 里面尽量跟一个小点，或者其他，尽量不要为空，
否则再 firefox 7.0 前的版本会有生成空格。

### 4.使用 before 和 after 双伪元素清除浮动

```css
.clearfix:before,
.clearfix:after { 
  content: "";
  display: table;  /* 这句话可以触发BFC BFC可以清除浮动,BFC我们后面讲 */
}
.clearfix:after {
 	clear: both;
}
.clearfix {
  *zoom: 1;
}
```

- 优点：代码更简洁
- 缺点：由于IE6-7不支持 :after，使用 zoom:1 触发 hasLayout。


## ::before 和 :before 有什么区别？

`E:after`、`E:before` 在旧版本里是伪元素，CSS3的规范里 `:` 用来表示伪类，`::` 用来表示伪元素，但是在高版本浏览器下 `E:after`、`E:before` 会被自动识别为`E::after`、`E::before`，这样做的目的是用来做兼容处理。

### 相同点：

- 伪类对象，用来设置对象前的内容
- `:before` 和 :`:before` 写法是等效的

### 不同点：

1. `:before` 是 CSS2 的写法，`::before` 是 CSS3 的写法。
2. `:before` 兼容性比 `::before` 要好。

### ⭐️ 注意点：

1. **伪类元素必须要配合 content 属性一起使用，否则无效**
2. 伪类元素是 css 渲染层加入的，**不能通过 js 来操作**
3. 伪类对象特效通常通过：hover 伪类样式来激活 `.test:hover::before {}`

## line-height 是如何理解的？

行高是指一行文字的高度，具体说是**两行文字间基线的距离**。CSS中起高度作用的是 height 和 line-height，没有定义 height 属性，最终其表现作用一定是 line-height 。

## display: none、visibility: hidden 和 opacity: 0 的区别？

- `display: none` （不占空间，不能点击）（回流+重绘）
- `visibility: hidden` （**占据空间**，不可点击）（重绘）
- `opacity: 0`（**占据空间**，可以点击）（重建图层，性能较高）

## 浏览器如何解析 CSS 选择器的，换句话说 CSS 的匹配规则是什么？

从右向左，提高查找效率

- 浏览器根据选择器过滤掉 DOM 中的元素，并向上遍历其父元素以确定匹配项。
- 选择器链的长度越短，浏览器可以越快地确定该元素是否与选择器匹配。

（div p em）

- 如果从左到右，有无数多个 div 都得向下查找，效率低
- 反之，只有当当前元素是 em 时，才会向上查找，效率高

**例如**：

- 使用这个选择器 `p span`，浏览器首先找到所有`<span>`元素，然后一直向上遍历其父元素直到根以找到`<p>`元素。
- 对于特定的`<span>`，一旦找到`<p>` ，它就知道 `<span>` 匹配并可以停止匹配。

## 文字超长的省略号写法

单行文本省略

```css
.single-line-ellipsis {
  width: 200px; /* 设置一个固定宽度，根据实际需求调整 */
  white-space: nowrap; /* 强制文本在一行内显示 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 用省略号表示超出的文本 */
}
```
​
多行文本省略

```css
.multi-line-ellipsis {
  width: 200px; /* 设置一个固定宽度，根据实际需求调整 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 这行对于多行省略号只是辅助，主要靠下面的属性 */
  display: -webkit-box; /* 开启弹性伸缩盒子模型 */
  -webkit-line-clamp: 3; /* 显示的行数，超出部分用省略号表示，这里设置为 3 行，可根据需求修改 */
  -webkit-box-orient: vertical; /* 子元素垂直排列 */
}
```

## 多个 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

- **场景：**
    - 有时，在写页面的时候，会需要将这个块状元素横排显示，此时就需要将 display 属性设置为 inline-block，此时问题出现了，在两个元素之间会出现大约8px左右的空白间隙。
- **原因：**
    - 浏览器的默认行为是把 inline 元素间的空白字符（空格换行tab）渲染成一个空格，也就是我们上面的代码 `<li>` 换行后会产生换行字符，而它会变成一个空格，当然空格就占用一个字符的宽度。
- **解决：**
    - 给 ul 标签设置 `font-size: 0;` 并为 li 元素重新设置 `font-size: XXpx;`

## 图片为什么有左右上下间隙,怎么去除？

原因：

- 左右：因为 img 是 `inline-block` 行内块元素，行内元素之间有『换行（回车），空格，tab』时会产生左右间隙
- 上下：**行内元素默认与父容器基线对齐**，而基线与父容器底部有一定间隙，所以上下图片间有间隙。

解决办法：

- 移除上下间隙：
    - img 本身设置 `display: block;`
    - 父元素设置 `font-size: 0;` （基线与字体大小有关，字体为零，基线间就没距离了）
    - img 本身设置 `vertical-align: bottom;`（让inline-block的img与每行的底部对齐）
- 移除左右间距：
    - 行内元素间不要有换行，连成一行写消除间隙
    - 第一行结尾写上 `<!-- ，第二行开头跟上 -->` 。即利用注释消除间距
    - 父元素 font-size 设置 0

## Chrome 中文字体小于 12px 文字

- 老版：`webkit-text-size-adjust: none`
- 新版：`webkit-transform: scale(.8, .8)`

## 自定义动画时间间隔最小多久

多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms

## 为什么会发生样式抖动

因为没有指定元素具体高度和宽度，比如数据还没有加载进来时元素高度是 100px(假设这里是 100px)，数据加载进来后，因为有了数据，然后元素被撑大，所有出现了抖动

## CSS 动画与 JS 动画哪个性能更好

事实上，大多数场景下，基于 CSS 的动画几乎是跟 JavaScript 动画表现一致——至少在 FireFox 上是如此。一些基于 Javascript 的动画库，像 [GSAP](https://greensock.com/gsap/) 和 [Velocity.JS](http://velocityjs.org/)，甚至声称他们在性能上可以做得比[原生 CSS transition/animation](https://css-tricks.com/myth-busting-css-animations-vs-javascript/) 更好。这是可能的，因为在重绘事件发生之前，CSS transition 和 animation 在主的 UI 线程仅仅是重新采集元素的样式，这跟通过 `requestAnimationFrame()` 回调获取重新采集元素样式是一样的，也是在下一次重绘之前触发。假如二者都是在主 UI 线程创建的动画，那它们在性能方面没有差异。

但我们仍然认为 CSS 动画是更好的选择。为什么？关键是只要动画涉及的属性不引起 reflow（重新布局）（参考 [CSS trigger](https://csstriggers.com/) 获得更多信息），我们可以把采样操作移出主线程。最常见的属性是 CSS transform。如果一个元素被提升为一个 [layer](https://wiki.mozilla.org/Gecko:Overview#Graphics)，transform 属性动画就可以在 GPU 中进行。这意味着更好地性能，特别是在移动设备上。在 [OffMainThreadCompositing](https://wiki.mozilla.org/Platform/GFX/OffMainThreadCompositing) 上寻找更多细节。

[性能对比](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)

- CSS3 的动画：
    1. 在性能上会稍微好一些，浏览器会对 CSS3 的动画做一些优化（比如专门新建一个图层用来跑动画） 
    2. 代码相对简单
    3. 在动画控制上不够灵活
    4. 兼容性不好
    5. 部分动画功能无法实现（如滚动动画，视差滚动等）
- JavaScript 的动画：
    1. 正好弥补了 css 缺点，控制能力很强，可以单帧的控制、变换，同时写得好完全可以兼容 IE6
    2. 功能强大
    3. 如果动画比较复杂，在使用 **`requestAnimationFrame`** 时，回调函数中执行了大量的计算或操作，导致了每帧的执行时间过长。这样就会使得浏览器无法在每一帧中及时完成绘制，从而出现卡顿的情况。
- 总结：
    - 对于一些复杂控制的动画，使用 javascript 会比较好。而在实现一些小的交互动效的时候，可以多考虑 CSS

## 为什么 style 标签要在 body 前

`style` 标签放在 `body` 后，会导致当加载到此样式时，页面将停止之前的渲染。此样式表被解析后，将重新渲染页面，也就出现了短暂的花屏现象。

## 为什么 js 标签要在 html 后

1. `JS` 放在底部可以保证让浏览器优先渲染完现有的 `HTML` 内容，让用户先看到内容，体验好
2. `JS` 执行如果涉及 `DOM` 操作，得等待 `DOM` 解析完成才行，`JS` 放在底部执行时，`HTML` 肯定都解析成了 `DOM` 结构。`JS` 如果放在 HTML 顶部，`JS` 执行的时候 `HTML` 还没来得及转换为 `DOM` 结构，可能会报错。
3. 渲染过程中，如果遇到 `<script>` 就停止渲染，执行 `JS` 代码。因为浏览器渲染和 `JS` 执行共用一个线程，而且这里必须是单线程操作，多线程会产生渲染 `DOM` 冲突。待 `<script>` 内容执行完之后，浏览器继续渲染。

## 移动端适配

### rem 适配方案

rem 是个相对单位，相对的是 **html** 根元素的 `font-size` 大小。这样一来我们就可以通过 html 上的字体大小来控制页面上所有以 rem 为单位的元素尺寸。

思路：把页面宽度分成 10 份

1. 把页面宽度分成 10 分，算出每份 px 值（`window.innerWidth / 10`）
2. 写个 scss mixin 函数，参数为设计稿px值，返回对应rem值（也就是份数）
    - 公式：`rem份数 = 设计稿px / 每份有多少px值`

### vw/vh 方案

与 rem 方案类似，都是将页面分成一份一份的，只不过 vw/vh 是将页面分为 100 份，1vw = device-width/100

### 百分比布局

在 css 中，我们可以使用百分比来实现布局，但是需要特定宽度时，这个百分比的计算对开发者来说并不友好，且元素百分比参考的对象为父元素，元素嵌套较深时会有问题。

### 响应式布局

通过媒体查询，可以针对不同的屏幕进行单独设置，但是针对所有的屏幕尺寸做适配显然是不合理的，但是可以用来处理极端情况（例如 IPad 大屏设备）或做简单的适配（隐藏元素或改变元素位置）

## 如何解决 1px 问题

::: details 伪元素先放大后缩小

```css
.container {
  position: relative;
}
.container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(0.5);
  transform-origin: left top;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
```

:::

## Meta viewport 的原理是什么 ？

手机浏览器是把页面放在一个虚拟的“窗口”（`viewport`）中，通常这个虚拟的“窗口”（`viewport`）比屏幕宽， 这样就不用把每个网页挤到很小的窗口中（这样会破坏没有针对手机浏览器优化的网页的布局），用户可以通过平移和缩放来看网页的不同部分。移动设备默认的 `viewport` 是 `layout viewport`，也就是那个比屏幕要宽的 `viewport`，但在进行移动设备网站的开发时，我们需要的是 `ideal viewport`。


## `click` 在 `ios` 上有 `300ms` 延迟，原因如何及如何解决。

**原因**：当用户一次点击屏幕之后，浏览器并不能立刻判断用户是要进行双击缩放，还是想要进行单击操作。因此，`iOS Safari` 就等待 `300` 毫秒，以判断用户是否再次点击了屏幕。

- [`faskclick`](https://github.com/ftlabs/fastclick)：在检测到 `touchend` 事件的时候，会通过 DOM 自定义事件立即出发模拟一个`click`事件，并把浏览器在 `300ms` 之后真正的 `click` 事件阻止掉。**缺点是脚本相对较大, 不建议使用**

- 禁止浏览器缩放，表明这个页面是不可缩放的，那双击缩放的功能就没有意义了，**缺点就是完全禁用了缩放比如方法图片，文字等**类似于一刀切了。

  ```html
  <meta name="viewport" content="user-scalable=no" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
  ```

- 更改默认的视口宽带，如果设置了上述 `meta` 标签，那浏览器就可以认为该网站已经对移动端做过了适配和优化，就无需双击缩放操作了

  ```html
  <meta name="viewport" content="width=device-width" />
  ```

- 通过 `touchstart` 和 `touchend` 模拟实现；把页面内所有 `click` 全部换成 `touch` 事件 `touchstart 、touchend、tap`， 需要特别注意 `a` 标签，`a` 标签的 `href` 也是 `click`，需要去掉换成 `js` 控制的跳转，或者直接改成 `span + tap` 控制跳转。

## 什么是点击穿透？怎么解决？

移动端的开发经常需要监听用户的 `touch` 行为，在移动端主要有以下几个 `touch` 事件：

1. `touchstart` 手指触摸屏幕时触发，即使已经有手指在屏幕上也会触发
2. `touchmove` 手指在屏幕滑动时触发
3. `touchend` 手指从屏幕时移开时触发
4. `touchcancel` 当触控点被特定的实现方式打乱时触发（例如，弹框），一般不用

移动端的事件的发生顺序一般是：`touchstart---touchmove---touchend`，然后大约过 `300ms` 会模拟鼠标触发 `click` 事件

::: tip

点击穿透就是在发生触摸动作约 `300ms` 之后，移动端会模拟产生 `click` 动作，它底下的具有点击特性的元素也会被触发，这种现象称为点击穿透。

发生的条件：

- 上层元素监听了触摸事件，触摸之后该层元素消失
- 下层元素具有点击特性（监听了 `click` 事件或默认的特性（`a` 标签、`input、button` 标签））

解决方案：

1. 阻止上层元素的默认动作 `event.preventDefault();`
2. 全局阻止默认行为，在 `document` 元素内阻止，给 `addEventListener` 设置第三参数

```js
{
  passive: false,        //阻止默认行为
  capture: false/true,   //事件是否在捕获阶段触发
  once: false/true,      //事件是否只触发一次
}
```

3. 不使用具有点击特性的元素，比如 `a` 标签默认跳转替换为 `js` 跳转
4. 利用 `css` 属性 `pointer-events`

- `auto` 效果和没有定义 `pointer-events` 属性相同，鼠标不会穿透当前层。在 `SVG` 中，该值和 `visiblePainted` 的效果相同。
- `none` 元素不再是鼠标事件的目标，鼠标不再监听当前层而去监听下面的层中的元素。但是如果它的子元素设置了 `pointer-events` 为其它值，比如 `auto`，鼠标还是会监听这个子元素的。

5. 让上层元素不立即消失，等到模拟 `click` 动作约 `300ms` 之后再消失

```js
(function () {
  //获取弹框
  var modalBg = document.querySelector("#modalBg");
  var closeBtn = document.querySelector("#closeBtn");
  var aNodes = document.querySelectorAll(".links a");
  //按钮触摸事件 touchend
  closeBtn.addEventListener("touchend", function (event) {
    //等一会再消失
    setTimeout(function () {
      modalBg.remove();
    }, 350);
  });
})();
```

:::
---
layout: doc
---

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

## 移动端的适配，rem+媒体查询/meta 头设置。

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

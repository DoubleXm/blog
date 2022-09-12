---
layout: doc
---

::: tip

问多的最多的是项目中的问题，以及一些现实中碰到的需求如何解决。**一定要熟悉自己做的项目，任何一个细节。** :unamused: 尴尬的是自己忘记录音了，就象征性的记录几个还记得住的吧。

:::

## 公司前端开发的流程是什么样的？

## 公司前端代码规范如何做的？

## 服务器端有做代码规范校验吗？

::: tip

主要是我回答了使用 `commitlint` `commitizen` 在 `pre-commit` 的时候做代码格式化然后提交代码。他说这种方式是可以前端行为绕过的。然后问我有没有做

:::

## 如何管理你们的分支？

## 元素渲染层级？ 除了 `z-index`还有哪些情况可以影响元素层级？

这个问题应该就是考察 [元素层叠水平 (`stacking level`)](https://github.com/chokcoco/iCSS/issues/48) 。

**层叠水平**：根据层叠规则来绝对元素所处位置的一个环境。

**层叠上下文**：是 `HTML` 元素的三维概念，这些 `HTML` 元素在一条假想的相对于面向（电脑屏幕的）视窗或者网页的用户的 `z` 轴上延伸，`HTML` 元素依据其自身属性按照优先级顺序占用层叠上下文的空间。

![stacking](/browser/stacking.jpeg)

::: tip
1、形成堆叠上下文环境的元素的背景与边框

2、拥有负 `z-index` 的子堆叠上下文元素 （负的越高越堆叠层级越低）

3、正常流式布局，非 `inline-block`，无 `position` 定位（`static` 除外）的子元素

4、无 `position` 定位（`static` 除外）的 float 浮动元素

5、正常流式布局， `inline-block` 元素，无 `position` 定位（`static` 除外）的子元素（包括 `display:table` 和 `display:inline` ）

6、拥有 `z-index:0` 的子堆叠上下文元素

7、拥有正 `z-index`: 的子堆叠上下文元素（正的越低越堆叠层级越低）
:::

如何触发一个元素形成 堆叠上下文 ？方法如下，摘自 MDN：

::: tip

- 根元素 (HTML),

- `z-index` 值不为 `auto` 的 绝对/相对定位，

- 一个 `z-index` 值不为 `auto` 的 `flex` 项目 (`flex item`)，即：父元素 `display: flex|inline-flex`

- `opacity` 属性值小于 1 的元素（参考 the specification for opacity），

- `transform` 属性值不为 `none` 的元素，

- `mix-blend-mode` 属性值不为 `normal` 的元素，

- `filter` 值不为 `none` 的元素，

- `perspective` 值不为 `none` 的元素，

- `isolation` 属性被设置为 `isolate` 的元素，

- `position: fixed`

- 在 `will-change` 中指定了任意 `CSS` 属性，即便你没有直接指定这些属性的值

- `-webkit-overflow-scrolling` 属性被设置 `touch` 的元素

:::

## 前端下载链接形式的文件方法？`a` 标签下载文件存在哪些问题？

`winodw.open`：`window.open('downloadFile.zip')`

- 会出现 `URL` 长度限制问题
- 需要注意 `url` 编码问题
- 浏览器可直接浏览的文件类型是不提供下载的，如 `txt、png、jpg、gif` 等

  可以通过设置 `Content-Disposition` 响应头信息，让客户端直接下载而不是打开新页面 [文档地址](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition)

- 不能添加 `header`，也就不能进行鉴权
- 无法知道下载的进度

`a` 标签的 `download`： `<a href="example.jpg" download="test">点击下载</a>`

- 不能下载跨域下的浏览器可浏览的文件
- 有兼容性问题，特别是 `IE`

  `Edge 13` 在尝试下载 `data url` 链接时会崩溃。

  `Chrome 65` 及以上版本只支持同源下载链接。

  `Firefox` 只支持同源下载链接。

- 不能进行鉴权

## `git rebase` `git merage` 的区别

**`git rebase`**

将当前分支移植到指定分支或指定 `commit` 之上；

会将整个分支移动到另一个分支上，有效地整合了所有分支上的提交。好处是历史记录更加清晰，是在原有提交的基础上将差异内容反映进去，消除了 `git merge` 所需的不必要的合并提交

**`git merage`**

将当前分支合并到指定分支；

通过 `merge` 合并分支会新增一个 `merge commit`，然后将两个分支的历史联系起来；是一种非破坏性的操作，对现有分支不会以任何方式被更改，但是会导致历史记录相对复杂

## `H5` 分享页面如何实现

## 基于 `vue` 实现的常用强依赖第三方库都用过哪些？

就只用过 `VueDragable`， 更多请[参考](https://juejin.cn/post/7025085812517634062)

## 说说 `Jenkins` 如何实现前端的 `CI,CD`

## 现有项目中使用的 `ESlint` 的什么规范？都有什么区别？

目前前端项目相信大部分都是使用的 `Recomended` 规范，起码 `Vue` 大多数应该如此。

- `Recommended`： 最为宽泛的规范，比如像 变量未定义初始值，函数形参没有在函数内部使用，变量声明后没有使用等。

- `Standard`： 基于 `Recommend` 衍生出来的更严格的规范，这个规范和 `recommended` 大概有 88 处不同，主要是 `recommended` 很多都是 `off`, `standard` 是 `error`, 比如 单行代码块两边加空格、禁止使用分号结尾。

- `Airbnb`： 规范是最严格的 ESlint 规范，列出下面几点比较明显的区别：
  1. 默认必须要分号，而 `eslint` 默认不添加分号
  2. 不能使用 `for` 循环，推荐使用数组自带的 `API` 完成遍历工作。
  3. 当你必须使用函数表达式（或传递一个匿名函数）时，使用箭头函数符号。

## 谈谈你们项目的业务与优势。

::: tip

1. 如果你真的能吹，建议从公司战略角度吹牛逼。
2. 如果不能就从项目架构方向吹。
3. 如果还不能可以简单描述架构，然后主要针对如何解决用户或者公司的痛点吹。

最好提前整理好，然后心里有数。不要临场总结。

:::

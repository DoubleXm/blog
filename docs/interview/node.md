---
isTimeLine: true
title: NodeJS
description: 整理 NodeJS 相关面试题，不定时更新...
date: 2020-10-27
tags:
 - 大前端
 - 面试
categories:
 - 大前端
---

# NodeJS

## `Nodejs` 适合做什么业务

`Nodejs` 是单线程，非阻塞 `I/O`，事件驱动，它的特点决定了它适合做一些大量 `I/O` 的东西，比如，聊天室，表单提交等不需要大量计算的功能。做一些微信后端开发，或者做消息系统等。可以整个项目用，也可以根据它的特点在某个模块使用，比如 `socketio`，打造一个消息系统等

## `Nodejs` 中的 `Stream` 和 `Buffer` 有什么区别

`Buffer`：为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据。

`Stream`：是对 `buffer` 对象的高级封装，其操作的底层还是 `buffer` 对象，`stream` 可以设置为可读、可写，或者即可读也可写，在 `nodejs` 中继承了 `EventEmitter` 接口，可以监听读入、写入的过程。具体实现有文件流， `http response` 等。

## `Express` 和 `koa` 有什么关系，有什么区别

**相同点**：两个框架都对 `http` 进行了封装。相关的 `api` 都差不多，同一批人所写。

**不同点**：

`express` 内置了许多中间件可供使用，而 `koa` 没有。

`express` 包含路由，视图渲染等特性，而 `koa` 只有 `http` 模块。

`express` 的中间件模型为线型，而 `koa` 的中间件模型为 `U` 型，也可称为洋葱模型构造中间件。

`express` 通过回调实现异步函数，在多个回调、多个中间件中写起来容易逻辑混乱。

```js
app.get("/test", function (req, res) {
  fs.readFile("/file1", function (err, data) {
    if (err) {
      res.status(500).send("read file1 error");
    }
    fs.readFile("/file2", function (err, data) {
      if (err) {
        res.status(500).send("read file2 error");
      }
      res.type("text/plain");
      res.send(data);
    });
  });
});
```

`koa` 通过 `generator` 和 `async/await`使用同步的写法来处理异步，明显好于 `callback` 和 `promise`。

```js
app.use(async (ctx, next) => {
  await next();
  var data = await doReadFile();
  ctx.response.type = "text/plain";
  ctx.response.body = data;
});
```

## 谈谈 `koa` 中洋葱模型的理解

::: tip

`Koa` 的洋葱模型是以 `next()` 函数为分割点，先由外到内执行 `Request` 的逻辑，然后再由内到外执行 `Response` 的逻辑，这里的 `request` 的逻辑，我们可以理解为是 `next` 之前的内容，`response` 的逻辑是 `next` 函数之后的内容，也可以说每一个中间件都有两次处理时机。洋葱模型的核心原理主要是借助 `compose` 方法。为了大家更好的理解什么是洋葱模型。

:::

![koa](/interview/koa.jpeg)

```js
const Koa = require("koa");
//Applications
const app = new Koa();
// 中间件1
app.use((ctx, next) => {
  console.log(1);
  next();
  console.log(2);
});
// 中间件 2
app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
});
app.listen(7000, "0.0.0.0", () => {
  console.log(`Server is starting`);
});
// 中间件的打印顺序是1 -> 3 -> 4 -> 2
```

::: details 洋葱圈核心 `compose` 方法

`compose` 方法是洋葱模型的核心，`compose` 方法中有一个 `dispatch` 方法，第一次调用的时候，执行的是第一个中间件函数，中间件函数执行的时候就是再次调用 `dispatch` 函数，也就说形成了一个递归，这就是 `next` 函数执行的时候会执行下一个中间件的原因，因此形成了一个洋葱模型。

```js
function compose(middleware) {
  return function (context, next) {
    // last called middleware #
    let index = -1;
    // 一开始的时候传入为 0，后续会递增
    return dispatch(0);
    function dispatch(i) {
      // 假如没有递增，则说明执行了多次
      if (i <= index) return Promise.reject(new Error("next() called multiple times"));
      index = i;
      // 拿到当前的中间件
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      // 当 fn 为空的时候，就会开始执行 next() 后面部分的代码
      if (!fn) return Promise.resolve();
      try {
        // 执行中间件，留意这两个参数，都是中间件的传参，第一个是上下文，第二个是 next 函数
        // 也就是说执行 next 的时候也就是调用 dispatch 函数的时候
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

:::

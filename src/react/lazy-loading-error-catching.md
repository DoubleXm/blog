
# 深入理解 Suspense 和 ErrorBoundary 

## 懒加载 lazy 与 Suspense

`Suspense` 允许在子组件完成加载前展示后备方案

在 v19 之前，一般情况下都用来处理组件的懒加载了。比如 tabs，当 tabs 切换到某个 tab 时，才会加载对应的组件。

```tsx :no-line-numbers
import { lazy, Suspense} from 'react';
import { Tabs } from 'antd';
const Calendar = lazy(() => import('./components/Calendar'));
const DatePickerPanel = lazy(() => import('./components/DatePickerPanel'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultActiveKey="1" items={[
        {
          label: `Calendar`,
          key: '1',
          children: <Calendar />,
        },
        {
          label: `DatePickerPanel`,
          key: '2',
          children: <DatePickerPanel />,
        },
      ]} />
    </Suspense>
  )
}
```

当然，比如 `jotai` 就默认支持了 `Suspense`， 当 `jotai` 中的 atom 依赖的组件懒加载时，会自动触发 `Suspense`。

不用在和 `lazy` 一起配合使用了。

![alt text](lazy/01.png)

v19 之后，`use` 也支持 `Suspense`。**在官网中规范到了 `api` 中，它可以在 `if` 或者 `for` 中调用。但是调用方仍然需要是一个组件或是 hook**

![alt text](lazy/02.png)

> 实际上官网以及说明，当使用 `Promise` 调用 `use` 时，监控三个状态
>
> - `pending`: 会触发 `Suspense` 的 fallback。
> - `fulfilled`: 会返回 resolve 的值，触发 `Suspense` 正常渲染。
> - `rejected`:  会抛出错误，触发最近的 `ErrorBoundary` 渲染。
>
> 实际上底层都是通过 `throw promise | error` 来实现的

![alt text](lazy/03.png)

从 jotai 中可以看出，是将被包裹的 promise 分状态 throw 出来。可以看出 jotai 还是优先使用 `React.use` 其次才是自己的逻辑。

![alt text](lazy/06.png)

实际上 `use` 和 `jotai` 做的动作如出一辙。

在 `ReactFiberHooks.js` 中的 `use` 内部又调用了 `useThenable` 而 `useThenable` 中又调用了 `trackUsedThenable`。

这是 `use` 的核心实现，位置在 `ReactFiberThenable.js`。

## 错误捕获 ErrorBoundary

![alt text](lazy/04.png)

[react-error-boundary 文档](https://github.com/bvaughn/react-error-boundary) 实际上这个库内部也是使用 `class` 组件实现的。

通过 `componentDidCatch` 和 `static getDerivedStateFromError` 来实现错误捕获。

接下来通过改造 fetch 方案，将其抛出错误，然后在 `ErrorBoundary` 中捕获。

![alt text](lazy/05.png)

## 总结

jotai 可以使用 `Suspense` 在上面得到了验证，至于为何可以使用还停留在猜想层面

lazy 包裹之后，也会 throw 一个 promise 来触发 Suspense。

当 promise 改变状态后，再返回拿到的值。

![alt text](lazy/07.png)

从 `ReactFiberThrow.js` 中可以看出是如何处理的错误和 promise 的。

![alt text](lazy/08.png)

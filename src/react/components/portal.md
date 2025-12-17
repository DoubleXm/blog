## Portal

> [!CAUTION]
>
> 在 react 中提供了一个 `createPortal` 方法，用于将子节点渲染到 DOM 树中的指定位置。[参考文档](https://zh-hans.react.dev/reference/react-dom/createPortal)
>
> ```ts :no-line-numbers
> createPortal(children, domNode, key?)
> ```
> 该组件是针对此方法的二次封装。
>
> **该组件接收 attach 以及 children 用于挂载和渲染子节点，同时对外暴漏挂载加点的 ref，用于获取挂载点的 DOM**
> 

```ts :no-line-numbers
import { createPortal } from 'react-dom';

export type PortalProps = React.PropsWithChildren<{
  attach?: HTMLElement | string;
  ref?: React.Ref<HTMLElement>;
}>

const getAttach = (attach?: HTMLElement | string) => {
  if (typeof attach === 'string') {
    return document.querySelector(attach);
  }
  if (typeof attach === 'object' && attach instanceof HTMLElement) {
    return attach;
  }
  return document.body;
}

export const Portal: React.FC<PortalProps> = (props) => {
  const {
    attach,
    ref,
    children,
    ...rest
  } = props;

  // 使用 memo 将 container 缓存起来，以免外部导致的二次渲染
  const container = useMemo(() => {
    const el = document.createElement('div');
    el.className = 'portal-container';
    return el;
  }, [])

  useEffect(() => {
    const attachEl = getAttach(attach);
    attachEl.appendChild(container);
    return () => {
      attachEl.removeChild(container);
    }
    // container 没有必要作为依赖项
    // 就算 attach 变化实际上 container 也只是运行了一次
  }, [attach])

  useImperativeHandle(ref, () => container);
  return createPortal(children, attach);
}
```
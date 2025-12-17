
## MutateObserver

> [!CAUTION]
> 这是一个浏览器原生 API，用于监听 DOM 树中的节点变化。[mutation observer](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
>
> 调用时接收一个 callback，用于监听 DOM 树中的节点变化。包含实例方法 `observe` 用于开始监听，`disconnect` 用于停止监听。`takeRecords` 尝试从监听队列中取出变化记录。
>
> ```ts :no-line-numbers
> const observer = new MutationObserver((mutations) => {
>   mutations.forEach((mutation) => {
>     console.log(mutation);
>   });
> });
> // 开始监听 document.body 下的所有子节点变化
> observer.observe(document.body, {
>   childList: true,
>   subtree: true,
> });
> 
> // 停止监听
> observer.disconnect();
> observer.takeRecords();
> ```
>
> observe 的第二个参数是一个配置对象，内容如下
> ![alt text](/react/components/mutateobserver/01.png)

显然这不是一个纯粹的 UI 组件，更像是一个工具类组件。比如遇到水印组件时，防止用户手动删除水印，就需要监控样式的变化，随时重建水印。

## hooks 封装

```ts :no-line-numbers
const defaultOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributeFilter: ['style', 'class'],
}
export const useMutationObserver = (
  target: HTMLElement | HTMLElement[],
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions,
) => {
  useEffect(() => {
    if (!target) return;
    const nodeList = Array.isArray(target) ? target : [target];

    const instance: MutationObserver;
    if ('MutationObserver' in window) {
      instance = new MutationObserver(callback);
      nodeList.forEach((node) => instance?.observe(node, options));
    }
    return () => {
      instance?.takeRecords();
      instance?.disconnect();
    }
  }, [target, options]);
}
```

当用户未点击的时候，observer 进来 target 没有，监听的逻辑还没有开始。

当用户点击后，组件进行了更新，那么 `useMutationObserver` 就会重新执行，此时 ref 已经拿到了对应的值，那么就可以开始监听了。

![alt text](/react/components/mutateobserver/02.png)

## 组件封装

组件要做的操作是，如何将 ref 挂载到 children 上面，不然就打不到使用简洁的目标了。

react 中提供了一个 `cloneElement` 方法，用于克隆一个元素，同时可以添加新的 props。[参考文档](https://zh-hans.react.dev/reference/react/cloneElement#overriding-props-of-an-element)

不过 antd 中同样也使用了这个 api，没什么慌的。

![alt text](/react/components/mutateobserver/03.png)

```ts :no-line-numbers
export interface MutateObserverProps {
  callback: MutationCallback;
  options: MutationObserverInit;
  // cloneElement 需要的是 ReactElement，而不是 ReactNode
  children?: React.ReactElement;
}

export const MutateObserver: React.FC<MutateObserverProps> = (props) => {
  const { callback, options, children } = props;

  const elRef = useRef<HTMLElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  // 保证在绘制完成后监听
  useLayoutEffect(() => {
    setTarget(elRef.current);
  }, []);

  useMutationObserver(target!, callback, options);

  if (!children) return null;
  // 19 已经没有了 ref 的类型，不得已使用 any
  return React.cloneElement<any>(children, { ref: elRef });
}
```

在调用时，就省去了手动传递 ref 的步骤。

![alt text](/react/components/mutateobserver/04.png)


## 懒加载

> [!CAUTION]
> 懒加载的实现原理是通过 `IntersectionObserver` 来监听元素是否进入视口，如果进入视口则加载元素。
>
> 配合 react 中的 `lazy` 方法也可以实现组件的懒加载
>
> 试想大多数场景的图片懒加载都是先给图片设置 `data-src` 属性，然后与视口相交时，再将 `data-src` 属性赋值给 `src` 属性。
>
> 这种场景实际上元素已经被挂载到 DOM 中了。可以考虑另一种方案，判定是否相交再渲染是否渲染。
>
> ```tsx :no-line-numbers
> isVisible ? <img src={dataSrc} /> : loading...;
> ```

```tsx :no-line-numbers
export type LazyLoadProps = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
  // 容器的宽高
  width?: string | number;
  height?: string | number;
  // 触发加载的偏移量
  offset?: number;
  placeholder?: React.ReactNode;
  onContentVisible?: () => void;
}>;

export const LazyLoad: React.FC<LazyLoadProps> = (props) => {
  const {
    className = '',
    style,
    width,
    height,
    offset = 0,
    placeholder,
    children,
    onContentVisible,
  } = props;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            onContentVisible?.();
            // 加载完成后，断开观察
            observer.current?.disconnect();
          }
        });
      },
      {
        rootMargin: typeof offset === 'number' ? `${offset}px` : '0px',
      }
    );
    observer.current?.observe(containerRef.current!);
    return () => observer.current?.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{width, height, ...style}}>
      { visible ? children : placeholder }
    </div>
  )
}
```
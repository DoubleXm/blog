--- 
title: 水印组件
---

## 水印组件

> [!CAUTION]
> 给页面添加水印，常用于防止内容被复制。
>
> 核心内容
> - 拿到用户传入的字体或者图片通过 canvas 绘制成图片 repeat 模式
> - 通过 position 固定在页面上
> - 通过 mutation observer 监听 dom 变化，重新绘制水印，防止用户篡改
> - 通过一些其他属性控制 水印内容的 字体，颜色，旋转角度等
>
> 参考 antd 进行实现

### Props

```ts :no-line-numbers
interface Font {
  color: string;
  fontSize: number;
  fontWeight: 'normal' | 'lighter' | 'bold' | 'bolder' | number;
  fontFamily: string;
}

export interface WaterMarkProps extends React.PropsWithChildren {
  /** 水印宽度 */
  width?: number;
  /** 水印高度 */
  height?: number;
  /** 水印旋转角度 */
  rotate?: number;
  /** 水印间距 */
  gap?: [number, number];
  /** 水印偏移量 */
  offset?: [number, number];
  /** 水印 z-index */
  zIndex?: number;
  /** 水印图片 */
  image?: string;
  /** 水印内容 */
  content?: string | string[];
  /** 水印字体 */
  font?: Partial<Font>;
  /** 获取水印容器 */
  getContainer?: () => HTMLElement
}
```

### 挂载 container 处理

```ts :no-line-numbers
export const WaterMark: React.FC<WaterMarkProps> = (props) => {
  const {
    children,
    ...rest
  } = props;

  const containerRef = useRef<HTMLElement>(null);
  // 如果用户有挂载点，就用用户的挂载点，否则用 ref 指向的元素
  const getContainer = useCallback(
    () => props.getContainer?.() || containerRef.current,
    [props.getContainer, containerRef.current]
  );

  return children ? (
    <div ref={containerRef}>
      {children}
    </div>
  ) : null;
}

```

随后创建 `useWaterMark` 将 `...rest` 以及 `getContainer` 一股脑传入来绘制水印。

### useWaterMark

总体流程如下：有点糙

![alt text](/react/components/watermark/01.png)

![alt text](/react/components/watermark/02.png)

可以看出整体流程比较清晰，除了 `children` 的所有属性都接收过来，同时通过自身维护一个 `options` 来监听变化并且绘制水印。

![alt text](/react/components/watermark/03.png)

对于外部而言则是先将配置传入，作为首次的渲染，后续每次变化都会触发合并 `options` 来更新渲染。

#### 合并处理

![alt text](/react/components/watermark/04.png)

#### 水印绘制

在 `container` 下面再创建一个 `div` 作为水印的载体，给他设置一堆水印相关样式并使用定位固定在页面上。

![alt text](/react/components/watermark/05.png)


#### getCanvasData 

这就是水印的核心，**接收最终合并的 `mergedOptions` 通过 `canvas` 绘制水印，将绘制好的图片转换为 base64 格式。无论是文字还是图片最后全部转成 base64 格式**。

```ts :no-line-numbers
type CanvasFn = (mergedOptions: Required<WaterMarkParams>) => Promise<{ base64: string, width: number, height: number }>

const getCanvasData: CanvasFn = (mergedOptions) => {
  const { rotate, content, font, image } = mergedOptions;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const ratio = window.devicePixelRatio || 1;

  const canvasConfig = (size: { width: number, height: number }) => {
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;
    // 设置画布发小
    canvas.setAttribute('width', `${canvasWidth * ratio}px`);
    canvas.setAttribute('height', `${canvasHeight * ratio}px`);
    canvas.width = `${canvasWidth}px`;
    canvas.height = `${canvasHeight}px`;
    // 设置缩放比例
    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx.scale(ratio, ratio);
    // 设置旋转角度
    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle);
  }
  
  const drawText = () => {}

  const drawImage = () => {}

  return image ? drawImage() : drawText();
}
```

对于 image 的绘制先创建出一个图片然后计算出对应的宽高，然后设置到 canvas 上，最终将参数返回即可。

![alt text](/react/components/watermark/06.png)

如果是文字，用户又没有传入宽高，计算的方式则比较复杂。通过 `measureTextSize` 方法来计算文字的宽高，然后设置到 canvas 上。

同样的也要考虑行高，让文字在行高的一半位置（计算出坐标）开始绘制。

![alt text](/react/components/watermark/07.png)

获取到关键信息后，就可以针对这些信息开始文字的绘制了。

![alt text](/react/components/watermark/08.png)

### 效果

![alt text](/react/components/watermark/09.png)

![alt text](/react/components/watermark/10.png)

### 增加 mutation observer 防止删除

通过 `MutationObserver` 来监听 `container` 下面的子元素是否有删除，如果有删除则需要重新绘制水印。

在子元素挂载到 `container` 后，就可以开始监听了。

先通过 ref 创建一个 `observer` 实例，避免引起不必要的更新。

![alt text](/react/components/watermark/11.png)

![alt text](/react/components/watermark/12.png)


## CopyToClipboard

> [!CAUTION]
>
> 该组件用于将文本复制到剪贴板。
>
> 内部复制使用 `copy-to-clipboard` 库实现 [参考文档](https://www.npmjs.com/package/copy-to-clipboard)

```ts :no-line-numbers
import { cloneElement, Children } from 'react';
import copy from 'copy-to-clipboard';

export interface CopyToClipboardProps {
  text: string;
  onCopy?: (text: string, isCopied: boolean) => void;
  // copy-to-clipboard 中的选项
  options?: {
    debug?: boolean;
    message?: string;
    format?: string; // MIME type
  },
  children?: React.ReactElement;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = (props) => {
  const {
    text,
    onCopy,
    options,
    children
  } = props;

  // only 检测是否为一个合规的 children 否则抛出异常
  // 返回最新的 children
  const element = Children.only(children);

  const onClick = (event: React.MouseEvent) => {
    const isCopied = copy(text, options);
    onCopy?.(text, isCopied);

    // 执行用户的 click
    (element?.props as React.MouseEventHandler)?.onClick(event);
  }
  return cloneElement(element!, { onClick })
}
```

![alt text](/react/components/mutateobserver/05.png)

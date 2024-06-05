## Vue 源码中的类型

在初始化中，还有几点疑问尚未搞明白，其中就有 `VNode`，在这之前需要先明白 `Vue` 中的类型都有哪些。

在源码的 `core/packages/shared/shapeFlag.ts`；代码如下（加了点注释）。

```ts
export const enum ShapeFlags {
  /** 元素 */
  ELEMENT = 1,
  /** 函数组件 */
  FUNCTIONAL_COMPONENT = 1 << 1, // 2
  /** 有状态组件 */
  STATEFUL_COMPONENT = 1 << 2, // 4
  /** 文本 */
  TEXT_CHILDREN = 1 << 3, // 16
  /** 数组 */
  ARRAY_CHILDREN = 1 << 4, // 32
  /** 插槽 */
  SLOTS_CHILDREN = 1 << 5,
  /** teleport */
  TELEPORT = 1 << 6,
  /** suspense  */
  SUSPENSE = 1 << 7,
  /** 缓存组件 */
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  /** 组件 */
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT |
    ShapeFlags.FUNCTIONAL_COMPONENT
}
```

[位运算科普](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_operators#%E4%BD%8D%E8%BF%90%E7%AE%97%E7%AC%A6)，文档无非是最权威的最正确的。

根据上面的内容及后续可能会遇到的逻辑，这里举几个例子防止后续思路卡顿（可能描述不准确）。但是 MDN 稍微有点晦涩 [W3CSchool](https://www.w3school.com.cn/js/js_bitwise.asp) 个人觉得不错。

**在 `js` 中数字的存储格式为 64 位浮点数，位运算是讲该数字转换成 32 位二进制数进行执行，执行完成之后再转换回来。**

- 按位与 `&`：进制对比，都为 1 才是 1；
- 按位或 `|`：进制对比，一个为 1 就是 1；
- 左移 `<<`：将左边的数转换成进制，右边的数是往左移 `n` 位；
- 右移 `>>`：将左边的数转换成进制，右边的数是往右移 `n` 位；
- 按位异或 `^`：进制对比，不相同为 1，相同为 0；
- 按位非 `~`：进制取反 （比如转换后是 1 取反为 -2，是 2 为 -3，是 3 为 -4 依次类推）
- 无符号右移 `>>>`：将左边的数转换成进制往右移 `n` 位，右侧全部置为 0，只要 32 或 64 位才有意义。

与上面对应的运算符与之对应也有一些简写的赋值运算符。

```ts
x &= y; // x = x & y
x |= y; // x = x | y
x <<= y; // x = x << y
x >>= y; // x = x >> y
x ^= y; // x = x ^ y
x >>>= y; // x = x >>> y
```

示例：

| 表达式    |            转换            |     结果     |  转换 |
| --------- | :------------------------: | :----------: | ----: |
| `4 & 5`   | `0b00000100 & 0b00000101`  | `0b00000100` |   `4` |
| `4 或 5`  | `0b00000100 或 0b00000101` | `0b00000101` |   `5` |
| `4 ^ 5`   | `0b00000100 ^ 0b00000101`  | `0b00000001` |   `1` |
| `4 << 5`  |     `0b00000100 << 5`      | `0b10000000` | `128` |
| `4 << 5`  |     `0b00000100 << 5`      | `0b00000000` |   `0` |
| `9 >>> 1` |     `0b00001001 >>> 1`     | `0b00000100` |   `4` |

## VNode 实现

新建文件 `runtime-core/src/vnode.ts`

```ts
import { ShapeFlags, isArray, isObject, isString } from '@vue/shared/src';

/**
 * @param type 区分是组件还是元素
 * @param props 属性
 * @param children 子集
 */
export const createVNode = (type, props, children = null) => {
  // 给虚拟节点增加类型
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;

  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    componet: null, // 存放组件的实例
    key: props && props.key, // diff 算法的 key
    el: null, // 虚拟节点对应的真实节点
    shapeFlag // 判断出自己的类型和 children 的类型
  };

  normalizenChildren(vnode, children);
  return vnode;
};

function normalizenChildren(vnode, children) {
  let type = 0;
  if (children == null) {
    // 不处理
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }
  vnode.shapeFlag |= type;
}
```

在 `createAppAPI` 的 `mount` 方法中调用这个方法。

```ts
import { createVNode } from './vnode';

export function createAppAPI(render) {
  return function (rootComponent, rootProps) {
    const app {
      // ...
      mount(container) {
        // 根据组件创建虚拟节点
        const vnode = createVNode(rootComponent, rootProps);
        // 调用 render 将虚拟节点渲染后放到 container 上面
        render(vnode, container);
        app._container = container;
      }
    };
    return app;
  };
}
```

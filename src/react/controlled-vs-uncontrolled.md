# 受控组件 vs 非受控组件

> [!CAUTION]
> 受控组件和非受控组件是 React 中处理表单输入的两种不同方式。
>
<!-- > **非受控组件** 不受 React 状态管理，而是由 DOM 本身管理。能改变 value 属性的只有用户，通过 ref 获取其值。**此模式下，值的变化不会触发组件的重新渲染**
>
> ``` ts :no-line-numbers
> const Input = () => {
>   const inputRef = useRef<HTMLInputElement>(null);
>
>   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
>     console.log(e.target.value, 'input change');
>   }
>
>   const onButtonClick = () => {
>     console.log(inputRef.current?.value, 'click get value');
>   }
>   return <>
>     <input ref={inputRef} onChange={onInputChange} />
>     <button onClick={onButtonClick}>获取值</button>
>   </>
> }
> ```
> -->

## 非受控组件

**非受控组件** 不受 React 状态管理，而是由 DOM 本身管理。能改变 value 属性的只有用户，通过 ref 获取其值。**此模式下，值的变化不会触发组件的重新渲染**

**如果你仅仅想传入初始值，就可以使用 `defaultValue`**

``` ts :no-line-numbers
const Input = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, 'input change');
  }

  const onButtonClick = () => {
    console.log(inputRef.current?.value, 'click get value');
  }
  return <>
    <input defaultValue={'111'} ref={inputRef} onChange={onInputChange} />
    <button onClick={onButtonClick}>获取值</button>
  </>
}
```

## 受控组件

**受控组件** 受 React 的状态管理，通过 `value` 属性和 `onChange` 事件来同步输入值。**此模式下，值的变化会触发组件的重新渲染**

> [!CAUTION]
> 实际上这时候已经没有必要通过 `defaultValue` 传递初始值了，因为 `value` 已经是一个状态了，通过 `setValue` 就可以设置初始值了。

值一旦产生变化，程序就能感知到，能够更好的基于状态的变更来构建更好的表单交互和用户体验。

``` ts :no-line-numbers
const Input = () => {
  const [value, setValue] = useState('');
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  return <input value={value} onChange={onInputChange} />
}
```

两种模式下，性能一目了然，实际使用的过程中，还是要结合实际。比如你想要 form 掌控整个表单的状态，像 `Antd`  一样。受控组件无疑是最好的选择。

![alt text](/react/controlled/01.png)

同样的，如果你只是使用一个输入框、一个复选框... 如果业务上没有特殊需求，完全没必要使用受控组件。

## 支持受控、非受控通用组件开发

**当有想法将输入框、复选框提供给他人使用时，出于通用性的考虑，就要提供两种可选方案了。** 组件库他们也是这么做的。

![alt text](/react/controlled/02.png)

社区也提供一些现成的方案，比如 [ahooks](https://ahooks.js.org/zh-CN/hooks/use-controllable-value) 中的 `useControllableValue` 就是一个很好的例子。

[react use](https://reactuse.com/zh-Hans/state/useControlled/) 中的 `useControlled` 等等。 `Antd` 内部则是自己实现的。

为了更好的理解，我们可以自己实现一个简单的 `useControllableValue` hooks。

```ts :no-line-numbers
import { useState, useEffect } from 'react'

type UseControllableProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}
type UseControllableValue<T> = (defaultStateValue: T, props: UseControllableProps<T>) => [T, React.Dispatch<React.SetStateAction<T>>];

const isFn = (fn: unknown): fn is Function => typeof fn === 'function';

export const useControllableValue: UseControllableValue<T> = (defaultStateValue, props) => {
  const { defaultValue, value: propsValue, onChange } = props;
  const isFirstRender = useRef(true);

  // 取值，使用 useState 维护
  const [stateValue, setStateValue] = useState(() => {
    switch (true) {
      case typeof propsValue !== undefined:
        return propsValue;
      case typeof defaultValue !== undefined:
        return defaultValue;
      default:
        return defaultStateValue;
    }
  });

  useEffect(() => {
    // propsValue 没值 且 非首次渲染
    if (propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false;
  }, [propsValue])

  const setState = (value: React.SetStateAction<T>) => {
    const res = isFn(value) ? value(stateValue) : value;
    // propsValue 没值时，更新 stateValue
    // 实际上 set 的是 defaultValue, 使用该 hook 的组件仍然会触发更新
    if (propsValue === undefined) {
      setStateValue(res);
    }
    onChange?.(res);
  }

  // propsValue 没值时，使用 stateValue
  const finalValue = propsValue === undefined ? stateValue : propsValue;
  return [finalValue, setState];
}
```

解析一下。

假设 `props.value` 传递的有值，那么直接使用用户传递进来的 `onChange` 方法。在标签中的属性就必须是 `value={value}` 而不是 `defaultValue={value}`，实现了组件的受控模式。

假设 `props.defaultValue` 有值，每次改变的时候都会调用组件内部的 `setStateValue` 更新状态，达到了只更新子组件而父组件不必更新的效果，实现了非受控模式。

```ts :no-line-numbers
interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}
const Input: React.FC<InputProps> = (props) => {
  const { value, defaultValue, onChange } = props;
  const [value, setValue] = useControllableValue('', {
    value,
    defaultValue,
    onChange,
  })
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

受控模式的测试

```ts :no-line-numbers
const App = () => {
  const [value, setValue] = useState('');
  // 因为 value 不为空，每次 setState 都会触发更新
  // props 的变化会触发 rerender
  const onChange = (val: string) => {
    setValue(val);
  }
  console.log('app render...')
  return <Input value={value} onChange={onChange} />
}
```

非受控模式测试

```ts :no-line-numbers
const App = () => {
  // 因为传递了 defaultValue, 每次调用的都是用户传递的 change 所以 app 不会更新。
  // useControllableValue 中都进行了判定，hook 中 setState 的同时， 会调用用户传递的 onChange 方法。
  const onChange = (val: string) => {
    console.log('onChange', val);
  }
  console.log('app render...')
  return <Input defaultValue={''} onChange={onChange} />
}
```

**实际上无论是 `value` 还是 `defaultValue`, 只是父组件是否更新，子组件每次都会更新。**
# use React Hooks

> [!CAUTION]
> 摒弃你的 Vue 思维，不要用 Vue 的方式去理解 React Hooks。

## useState

允许向其中传递一个**状态数据**，并返回一个数组，数组的第一个元素是当前状态，第二个元素是更新状态的函数。

```js :no-line-numbers
import { useState } from 'react';

const [count, setCount] = useState(0);
```

修改的方式有两种，直接调用更新函数，或者通过回调函数的方式。在多数情况下这两种方式是等价的，但是在某些情况下，通过回调函数的方式可以避免一些问题。

```js :no-line-numbers
setCount(count + 1);
```

```js :no-line-numbers
setCount((prevCount) => prevCount + 1);
```

比如在循环中使用状态，就需要通过回调函数的方式来更新状态，否则会导致状态更新不及时。

```js :no-line-numbers
const App = () => {
  const [items, setItems] = useState([]);
  const newList = Array.from({ length: 5 }, (_, index) => `item${index}`);
  
  const onClikc = () => {
    // 错误的方式 每次都输出 item4
    newList.forEach((item) => {
      setItems([...items, item]);
    });
    // 正确的方式 每次都输出 item0, item1, item2, item3, item4
    newList.forEach((item) => {
      setItems((prevItems) => [...prevItems, item]);
    });
  }
  return <>
    <button onClick={onClikc}>点击添加</button>
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </>
}
```

## useEffect 

被称为副作用（Side Effect）的操作，比如请求数据、订阅事件、手动修改 DOM 等。

effect 的第一个参数就是一个副作用函数，第二个参数是一个依赖数组，当依赖数组中的值发生变化时，副作用函数会被调用。

```js :no-line-numbers
import { useState, useEffect } from 'react';

const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: '这是从服务器获取的数据' });
    }, 1000);
  });
}

const App = () => {
  const [data, setData] = useState('');
  useEffect(() => {
    fetchData().then((res) => {
      setData(res.data);
    });
  }, []);
}
```

至此 effect 的第二个参数出现了三种形态，分别是：

- 不传： 每次组件挂载时和更新时都会调用。
- 传空数组：只在组件挂载时调用一次。
- 传依赖数组：当依赖数组中的值发生变化时，副作用函数会被调用。

![alt text](/react/hooks/effect-sort.png)

**依赖数组并不是随便写的，`props` `state` 或者基于这些值计算出来的结果，以及一些函数内部不稳定的值**

**比如 `new Date().getTime()` `Math.random()`。** 

如下，`now` 每次渲染都是不同的值，所以会导致 effect 每次都被调用。反而 `isOpen` 只有挂载时调用一次。

```js :no-line-numbers
import { useEffect, useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  const [isOpen,] = useState(false);
  useEffect(() => {
    console.log(isOpen, 'isOpen 变化了');
  }, [isOpen]);

  const now = new Date().getTime();
  useEffect(() => {
    console.log(now, 'now 变化了');
  }, [now]);
  return <>
    <button onClick={() => setCount(count + 1)}>点击增加</button>
    <p>当前计数: {count}</p>
  </>
}
```

对于一些**定时器、事件监听、服务器连接**等操作，effect 同样具备清除副作用的能力。在副作用函数中返回一个清除函数，当下一次 effect 被调用时，清除函数会被调用。

**这里不应该称之为卸载，试想如果依赖了 count，那么每次 count 变化时，定时器就会被清除，导致定时器不会触发。**

```js :no-line-numbers
import { useEffect } from 'react';

useEffect(() => {
  const timer = setInterval(() => {
    console.log('定时器触发');
  }, 1000);
  return () => {
    clearInterval(timer);
  }
}, []);
```

## useLayoutEffect

使用方式与 useEffect 一致，在浏览器绘制屏幕之前触发，内部的代码会阻塞浏览器重新绘制屏幕，过多使用会导致性能问题。

最好的例子当属移动元素。如果在 layoutEffect 中移动了元素，那么浏览器会立即绘制新的位置，用户不会感受到任何延迟。

```js :no-line-numbers
import { useLayoutEffect } from 'react';

const App = () => {
  // 如果换成 useEffect 每次刷新则会导致元素位置闪烁
  useLayoutEffect(() => {
    const p = document.querySelector('p');
    const innerHeight = window.innerHeight;
    p.style.transform = `translateX(${innerHeight / 2}px)`;
  }, [])

  return <p>当前计数: {0}</p>
}
```

**不要试图在 useLayoutEffect 中去更改其他 useEffect 中的状态。**

如果在 layoutEffect 启动了状态更新导致 react 必须启动新的渲染，不再等待浏览器绘制，而是同步的启动新渲染的过程中，将原本异步延迟的 useEffect 也同步执行。

``` :no-line-numbers
useLayoutEffect -> 浏览器进行绘制，用户看到更新后的 UI -> useEffect
```

## useReducer

用于状态的更新，与 useState 类似，但是更加强大。

```js :no-line-numbers
import { useReducer } from "react";

const reducer = (state: { count: number }, action: 'add' | 'sub') => {
  switch (action){
    case 'add':
      return { count: state.count + 1 };
    case 'sub':
      return { count: state.count - 1 };
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  
  return <>
    <button onClick={() => dispatch('add')}>点击增加</button>
        <button onClick={() => dispatch('sub')}>点击减少</button>
    <p>当前计数: {state.count}</p>
  </>
}
```

### immer

使用 useReducer 有一个比较麻烦的地方，就是每次状态更新都需要返回一个新的状态对象。不然会导致状态更新不生效。**实际上 useState 也是如此**

```js :no-line-numbers
// 错误实例
const reducer = (state: any, action: 'add' | 'sub') => {
  switch (action){
    case 'add':
      state.a.b.c.d.e += 1;
      return state;
    case 'sub':
      state.a.b.c.d.e -= 1;
      return state;
  }
}
```

当数据结构比较复杂时，则可以考虑使用 `immer` 来简化更新的代码，这是一个三方库。

```bash :no-line-numbers
npm install immer
```

```js :no-line-numbers
import { produce } from 'immer';

const initialState = { a: { b: { c: { d: { e:0 } } } } }
const reducer = (state: typeof initialState, action: 'add' | 'sub') => {
  switch (action){
    case 'add':
      return produce(state, draft => {
        draft.a.b.c.d.e += 1;
      });
    case 'sub':
      return produce(state, draft => {
        draft.a.b.c.d.e -= 1;
      });
  }
}
```

## useRef

一般情况下用于获取 DOM 元素的引用。内容都会存在 `current` 属性中。

```js :no-line-numbers
import { useRef, useEffect } from 'react';

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return <>
    <input ref={inputRef} type="text" />
  </>
}
```

还有一种情况用来存储一些**不会导致组件重新渲染的值**，例如定时器 id、事件监听函数等。

```js :no-line-numbers
const App = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);

  useEffect(() => {
    console.log(countRef.current)
  }, [count]);
  
  return <>
    <h1> {count}</h1>
    {/* 只有点击此按钮后，countRef.current 才会更新 */}
    <button onClick={() => countRef.current = count}>set count ref</button>
    <button onClick={() => setCount(count + 1)}>click me</button>
  </>
}
```


### forwardRef 获取子组件 ref

用于获取子组件的 ref

```js :no-line-numbers
import { useRef, forwardRef, useEffect } from 'react';

const Input: React.ForwardRefRenderFunction<HTMLInputElement> = (props, ref) => {
  return <input ref={ref} type="text" />
};
const WrapedInput = forwardRef(Input);

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <WrapedInput ref={inputRef} />
}
```

### forwardRef + useImperativeHandle 获取子组件方法

如果你想获取子组件暴露出来的方法，就需要使用 useImperativeHandle 作为配合。

```js :no-line-numbers
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface InputRef {
  privateAttr: string;
  focus: () => void;
}

const Input: React.ForwardRefRenderFunction<InputRef> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    privateAttr: '内部属性',
    focus: () => {
      inputRef.current?.focus();
    }
  }), [inputRef])

  return <input ref={inputRef} type="text" />
};
const WrapedInput = forwardRef(Input);

const App = () => {
  const wrapedInputRef = useRef<InputRef>(null);

  useEffect(() => {
    console.log(wrapedInputRef.current?.privateAttr);
    wrapedInputRef.current?.focus();
  }, [])
  return <WrapedInput ref={InputRef} />
}
```

## useContext

向组件库的深层传递数据，跨层级传递数据。需要配合 `createContext` 来创建上下文。

```js :no-line-numbers
import { useState, useContext } from 'react';

const GrandSon = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return <>
    <h1 style={{ color: theme === 'light' ? 'black' : 'white' }}>GrandSon</h1>
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>change theme</button>
  </>
}

const Son = () => <GrandSon />

const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme: 'light' | 'dark') => {},
})
const App = () => {
  const [theme, setTheme] = useState('light');
  {/* v19 之后可以省略 .Provider */}
  return <ThemeContext.Provider value={{ theme, setTheme }}>
    <Son />
  </ThemeContext.Provider>
}
```

## memo、useMemo、useCallback

**memo 用于优化组件的渲染性能，当组件的 `props` `state` `context` 没有变化时，不会重新渲染组件。**

**需要注意的是，memo 是浅比较，如果是对象或者复杂的内容还是要配合 `useMemo`、`useCallback` 来优化。**

同样以切换主题为例，如果你在 Son 组件中加入了打印，发现每次点击都会打印，说明组件重新渲染了。实际上完全没有必要。

```js :no-line-numbers
const Son = memo(() => <GrandSon />)
```

**useCallback 用于优化函数的性能，当函数的依赖项没有变化时，不会重新创建函数。因为每次从新渲染后函数都会被从新创建**

```js :no-line-numbers
const Child1 = (props) => {
  const { count, setCount } = props;
  return <>
    <h1>Child1 {count}</h1>
    <button onClick={() => setCount(count + 1)}>click me</button>
  </>
}
const Child2 = (props) => {
  const { count, setCount } = props;
  return <>
    <h1>Child2 {count}</h1>
    <button onClick={() => count === 0 ? setCount(count + 2) : setDoubleCount(count * 2)}>double count</button>
  </>
}

const App = () => {
  const [count, setCount] = useState(0);
  const [doubleCount, setDoubleCount] = useState(0);

  return <>
    <Child1 count={count} setCount={setCount} />
    <Child2 count={doubleCount} setCount={setDoubleCount} />
  </>
}
```

理想情况下，除了首次渲染，之后只会渲染每次点击的组件。但实际上都会被渲染。此时可以使用 memo 来进行优化，避免不必要的更新。

```js :no-line-numbers
MemoChild1 = memo(Child1);
```

试想如果你需要额外再传递一个方法呢？因为每次更新后函数都会从新创建，基于有了 memo 优化，Child1 仍然每次都会执行。

```js :no-line-numbers
const App = () => {
  // ...
  function doSomething() {
    console.log('do something');
  }
  return <>
    <MemoChild1 count={count} setCount={setCount} doSomething={doSomething} />
    <Child2 count={doubleCount} setCount={setDoubleCount} />
  </>
}
```

此时可以使用 `useCallback` 来优化函数的性能，当函数的依赖项没有变化时，不会重新创建函数。

```js :no-line-numbers
const doSomething = useCallback(() => {
  console.log('do something');
}, [])
```

既然函数可以被缓存，那么值也是可以被缓存的，使用 `useMemo` 来优化值的性能。

正常来说每次 render 时，函数都会被整体执行一遍

```js :no-line-numbers
const App = () => {
  const [count, setCount] = useState(0);
  const doubleCount = count * 2;

  return <>
    <h1>count: {count}</h1>
    <h1>doubleCount: {doubleCount}</h1>
    <button onClick={() => setCount(count + 1)}>click me</button>
  </>
}
```
所以单独看上诉代码没有任何问题，但是如果此时再次需要一个开关。符合直觉的想法是，每次开关的点击 doubleCount 也会被重新计算。

好在是这个运算很简洁，如果比较复杂，也可以使用 `useMemo` 来优化。这样就能避免不必要的优化。

```js :no-line-numbers
const App = () => {
  const [count, setCount] = useState(0);
  const doubleCount = useMemo(() => count * 2, [count]);

  const [isOpen, setIsOpen] = useState(false);
  return <>
    <h1>count: {count}</h1>
    <h1>doubleCount: {doubleCount}</h1>
    <button onClick={() => setCount(count + 1)}>click me</button>
    <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
  </>
}
```

## 闭包陷阱

[搞定 React Hooks 闭包问题，让你的代码不再"失忆"](https://github.com/wangkaiwd/fe-blog/issues/5) 这是在 github 中看到别人的总结。

文中表述了一些常见的场景下，effect 中获取不到最新的 state

``` :no-line-numbers
延迟执行（ setTimeout、 Promise 等）
DOM 事件监听
防抖函数
```

```js :no-line-numbers
const App = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // promise interval 等异步操作中，获取到的 state 是旧值
    setTimeout(() => {
      console.log('count: ', count);
    }, 2000);
  }, [count])

  return <>
    <h1>count: {count}</h1>
    <button onClick={() => setCount(count + 1)}>click me</button>
  </>
}
```

### 方案一 ref

使用 ref 获取最新的 state，ref 的变更不会引起组件重新渲染。

```js :no-line-numbers
const [count, setCount] = useState(0);
const countRef = useRef(count);
useEffect(() => {
  // promise interval 等异步操作中，获取到的 state 是旧值
  setTimeout(() => {
    console.log('count: ', countRef.current);
  }, 2000);
}, [count])

<button onClick={() => {
  countRef.current = count + 1;
  setCount(count + 1);
}}>click me</button>
```

### 方案二 useEffectEvent v19

```js :no-line-numbers
const [count, setCount] = useState(0);

const event = useEffectEvent(() => {
  setTimeout(() => {
    console.log('count: ', count);
  }, 2000);
});

useEffect(() => {
  event();
}, [count])

<button onClick={() => setCount(count + 1)}>click me</button>
```

## 更进一步

[React Hooks 使用误区，驳官方文档](https://github.com/brickspert/blog/issues/45)

[React 18 总览](https://github.com/brickspert/blog/issues/48)

[React 19 总览](https://github.com/brickspert/blog/issues/66)

[助你完全理解React高阶组件（Higher-Order Components）](https://github.com/brickspert/blog/issues/2)

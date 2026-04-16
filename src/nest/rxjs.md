
## `Rxjs` 入门

一个通过使用 `observable` 可观察对象 编写异步和处理事件的库。

通过 `Observable` 给订阅者传递数据，再通过实例上的 `subscribe` 来订阅数据；

```ts :no-line-numbers
import { Observable } from 'rxjs';

const observable = new Observable((subscriber) => {
  // 给订阅者发送数据
  subscriber.next(1);
  subscriber.next(2);
  // 完成订阅
  subscriber.complete();
});

// subscribe 也可以只传递一个回调函数，及表示为 next 函数。
observable.subscribe({
  // 获取订阅的值
  next: (value) => console.log(value),
  // 错误的回调
  error: (error) => console.log(error),
  // 完成的回调
  complete: () => console.log('complete')
});

// 最终打印为：
// 1
// 2
// complete
```

在 `Observable` 回调中 `return` 的函数为终止订阅函数，类似于 `React` 中 `useEffect` 的 `return`。

`subscribe` 的返回对象中存在 `unsubscribe` 用于终止订阅；

```ts :no-line-numbers
import { Obserable } from 'rxjs';

const observable = new Observable((subscriber) => {
  let count = 0;
  let timer = setInterval(() => {
    subscriber.next(count++);
  }, 1000);

  // 清理函数
  return () => {
    clearInterval(timer);
    console.log('unsubscribed for Observable');
  }
});

const subscribe = observable.subscribe((value) => console.log(value));
setTimeout(() => {
  // 取消订阅
  subscribe.unsubscribe();
  console.log('unsubscribed for subscribe');
}, 3000);

// 最终打印为：
// 0
// 1
// unsubscribed for observable
// unsubscribed for subscribe
```

### 创建操作符

#### of

创建一个发出特定值的 `observable`;

```ts :no-line-numbers
import { of } from 'rxjs';

const observable = of(1, 2, 3);
observable.subscribe((value) => console.log(value));
// 1 2 3
```

#### from

将数组、`Promise`、迭代器变成 `observable`;

```ts :no-line-numbers
const obserable = from([1, 2, 3]);
obserable.subscribe((value) => console.log(value));

const obserable1 = from(Promise.resolve('ok'));
obserable1.subscribe((value) => console.log(value));
```

### throwError

创建一个 `error` 的 `observable`;

```ts :no-line-numbers
const obserable = throwError(() => new Error('an error message'));

obserable.subscribe({
  error: (error: Error) => console.log(error.message),
});
```

### 管道操作符

用于将多个操作符组合在一起，形成一个管道，可以对 `observable` 发出的数据进行转换和操作；

`pipe` 是 `observable` 上的一个方法，接受多个操作作为参数，并返回一个新的 `observable`。

#### tap

对 `observable` 发出的值进行副作用操作，不会改变数据流中的值；

```ts :no-line-numbers
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

of(1, 2)
  // pipe() 组合管道的方法
  .pipe(tap((value) => console.log(`tap ${value}`)))
  .subscribe((v) => console.log('subscribe' + v));
// 可以看出 tap 不会对值做任何调整
// tap 1
// subscribe1
// tap 2
// subscribe2
```

#### map

对 `observable` 发出的值进行转换映射

```ts :no-line-numbers
import { tap } from 'rxjs/operators';

of(1, 2)
  .pipe(map((value) => value * 2))
  .subscribe((v) => console.log(v));
// 2 4
```

#### catchError 捕获错误

用于捕获 `observable` 中的错误，返回一个新的 `observable`

```ts :no-line-numbers
throwError(() => new Error('an error message'))
  .pipe(catchError((error: Error) => of(error.message)))
  .subscribe((v) => console.log(v));
```

#### timeout、delay

对 `observable` 增加一个超时显示，如果到了指定的时间没有发出值，则抛出错误

`delay` 表示暂停一段时间再发出值

```ts :no-line-numbers
of(100)
  .pipe(
    // 延迟两秒发送值
    delay(2000),
    // 超过 1s 就抛出错误
    timeout(1000),
    // 捕获这个错误
    catchError((error: Error) => of(error.message)),
  )
  .subscribe((v) => console.log(v));
```

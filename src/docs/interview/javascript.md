---
layout: doc
---

## JS 中的 8 种数据类型及区别

包括值类型(基本对象类型)和引用类型(复杂对象类型)

::: tip
**基本类型(值类型)**： Number(数字),String(字符串),Boolean(布尔),Symbol(符号),null(空),undefined(未定义)在内存中占据固定大小，保存在栈内存中
:::

::: tip
**引用类型(复杂数据类型)**： Object(对象)、Function(函数)。其他还有 Array(数组)、Date(日期)、RegExp(正则表达式)、特殊的基本包装类型(String、Number、Boolean) 以及单体内置对象(Global、Math)等 引用类型的值是对象 保存在堆内存中，栈内存存储的是对象的变量标识符以及对象在堆内存中的存储地址。
:::

## JS 中的数据类型检测方案

### typeof

```javascript
console.log(typeof 1); // number
console.log(typeof true); // boolean
console.log(typeof 'mc'); // string
console.log(typeof Symbol); // function
console.log(typeof function () {}); // function
console.log(typeof console.log()); // undefined
console.log(typeof []); // object
console.log(typeof {}); // object
console.log(typeof null); // object
console.log(typeof undefined); // undefined
```

优点：能够快速区分基本数据类型

缺点：不能将 Object、Array 和 Null 区分，都返回 object

### instanceof

```javascript
console.log(1 instanceof Number); // false
console.log(true instanceof Boolean); // false
console.log('str' instanceof String); // false
console.log([] instanceof Array); // true
console.log(function () {} instanceof Function); // true
console.log({} instanceof Object); // true
```

优点：能够区分 Array、Object 和 Function，适合用于判断自定义的类实例对象

缺点：Number，Boolean，String 基本数据类型不能判断

### Object.prototype.toString.call()

```javascript
var toString = Object.prototype.toString;
console.log(toString.call(1)); //[object Number]
console.log(toString.call(true)); //[object Boolean]
console.log(toString.call('mc')); //[object String]
console.log(toString.call([])); //[object Array]
console.log(toString.call({})); //[object Object]
console.log(toString.call(function () {})); //[object Function]
console.log(toString.call(undefined)); //[object Undefined]
console.log(toString.call(null)); //[object Null]
```

优点：精准判断数据类型

缺点：写法繁琐不容易记，推荐进行封装后使用

## 不能使用 Object.toString() 吗

这是因为 `toString` 是 `Object` 的原型方法，而 `Array、function` 等类 型作为 `Object` 的实例，都重写了 `toString` 方法。不同的对象类型调 用 `toString` 方法时，根据原型链的知识，调用的是对应的重写之后的 `toString` 方法（`function` 类型返回内容为函数体的字符串，`Array` 类型返回元素组成的字符串…），而不会去调用 `Object` 上原型 `toString` 方法（返回对象的具体类型），所以采用 `obj.toString()` 不能得到其对象类型，只能将 obj 转换为字符串类型；因此，在想要 得到对象的具体类型时，应该调用 `Object` 原型上的 `toString` 方法。

## null 和 undefined 区别

首先 Undefined 和 Null 都是基本数据类型，这两个基本数据类型 分别都只有一个值，就是 undefined 和 null。

undefined 代表的含义是未定义，null 代表的含义是空对象。一般 变量声明了但还没有定义的时候会返回 undefined，null 主要用于 赋值给一些可能会返回对象的变量，作为初始化。

undefined 在 JavaScript 中不是一个保留字，这意味着可以使用 undefined 来作为一个变量名，但是这样的做法是非常危险的，它会 影响对 undefined 值的判断。我们可以通过一些方法获得安全的 undefined 值，比如说 void 0。

当对这两种类型使用 typeof 进行判断时，Null 类型化会返回 “object”，这是一个历史遗留的问题。当使用双等号对两种类型的 值进行比较时会返回 true，使用三个等号时会返回 false。

## intanceof 操作符的实现原理及实现

instanceof 运算符用于判断构造函数的 prototype 属性是否出现 在对象的原型链中的任何位置。

```javascript
function myInstance(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的 prototype
  let prototype = right.prototype;

  // 判断构造函数的 prototype 是否在对象的原型上面
  while (true) {
    if (!proto) return;
    if (proto === prototype) return true;
    // 如果没有找到继续在原型上面查找
    proto = Object.getPrototypeOf(proto);
  }
}
```

## Object.is() 与比较操作符 “===”、“==” 的区别？

使用双等号（==）进行相等判断时，如果两边的类型不一致，则会进 行强制类型转化后再进行比较。

使用三等号（===）进行相等判断时，如果两边的类型不一致时，不 会做强制类型准换，直接返回 false。

使用 `Object.is` 来进行相等判断时，一般情况下和三等号的判断相 同，它处理了一些特殊的情况，比如 -0 和 +0 不再相等，两个 NaN 是相等的。

## 如何判断一个对象是空对象

使用 JSON 自带的.stringify 方法来判断：

```javascript
if (JSON.stringify(target) === '{}') {
}
```

使用 ES6 新增的方法 Object.keys()来判断：

```javascript
if (!Object.keys(target).length) {
}
```

## 如何判断一个对象是否属于某个类？

- 第一种方式，使用 instanceof 运算符来判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。
- 第二种方式，通过对象的 constructor 属性来判断，对象的 constructor 属性指向该对象的构造函数，但是这种方式不是很安全，因为 constructor 属性可以被改写。
- 第三种方式，如果需要判断的是某个内置的引用类型的话，可以使用 Object.prototype.toString() 方法来打印对象的[[Class]] 属性来进行判断。

## new 运算符的实现机制

1. 创建一个对象
2. 将构造函数的作用域赋给新对象（也就是将对象的**proto**属性 指向构造函数的 prototype 属性）
3. 指向构造函数中的代码，构造函数中的 this 指向该对象（也就是 为这个对象添加属性和方法）
4. 返回新的对象

## 如果 new 一个箭头函数的会怎么样

箭头函数是 ES6 中的提出来的，它没有 prototype，也没有自己的 this 指向，更不可以使用 arguments 参数，所以不能 New 一个箭头函数。

在 new 的 2,3 步骤上箭头函数都是没有办法执行的。

## 什么是 `use strict`,好处和坏处是什么？

`ECMAscript 5` 添加了第二种运行模式："严格模式"（`strict mode`）。顾名思义，这种模式使得 `Javascript` 在更严格的条件下运行。

设立 "严格模式" 的目的：

- 消除 `Javascript` 语法的一些不合理、不严谨之处，减少一些怪异行为;

- 消除代码运行的一些不安全之处，保证代码运行的安全；

- 提高编译器效率，增加运行速度；

**缺点**： 现在网站的 `JS` 都会进行压缩，一些文件用了严格模式，而另一些没有。这时这些本来是严格模式的文件，被 `merge` 后，这个串就到了文件的中间，不仅没有指示严格模式，反而在压缩后浪费了字节。

## ES6 模块与 CommonJS 模块有什么异同？

CommonJS 规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了 AMD CMD 解决方案。**CommonJS 是对模块的浅拷⻉**

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。 **ES6 Module 是对模块的引⽤，即 ES6 Module 只存只读，不能改变其值，也就是指针指向不能变，类似 const；**

AMD 规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD 规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。

CMD 规范与 AMD 规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在 Node.js 中运行。不过，依赖 SPM 打包，模块的加载逻辑偏重

## for...in 和 for...of 的区别

`for…of` 是 ES6 新增的遍历方式，允许遍历一个含有 iterator 接口 的数据结构（数组、对象等）并且返回各项的值，和 ES3 中的 `for… in` 的区别如下：

- `for…of` 遍历获取的是对象的键值，`for…in`获取的是对象的键名；
- `for… in` 会遍历对象的整个原型链，性能非常差不推荐使用，而 `for … of` 只遍历当前对象不会遍历原型链
- 对于数组的遍历，`for…in` 会返回数组中所有可枚举的属性(包括原 型链上可枚举的属性)，`for…of` 只返回数组的下标对应的属性值；

总结：`for...in` 循环主要是为了遍历对象而生，不适用于遍历数组； `for...of` 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以 及 Generator 对象。

## ajax、axios、fetch 的区别

- Ajax 是 Asynchronous JavaScript and XML 的简称. 现在，我们将“Ajax”用作客户端从服务器获取数据并动态更新 DOM,而无需刷新整个页面的通用术语。Ajax 是大多数 Web 应用程序和单页应用程序（SPA）的核心技术。也可以理解是 XMLHttpRequests

- Axios 是一种基于 Promise 封装的 HTTP 客户端，内部基于 XMLHttpRequests 实现

- fetch 基于标准 Promise 实现，支持 async/await 更加底层，提供的 API 丰富（request, response） 脱离了 XHR，是 ES 规范里新的实现方式

  ::: tip
  fetch 只对网络请求报错，对 400，500 都当做成功的请求，服务器 返回 400，500 错误码时并不会 reject，只有网络错误这些导致请 求不能完成时，fetch 才会被 reject。

  fetch 默认不会带 cookie ， 需要添加配置项 ： `fetch(url, {credentials: 'include'})`

  fetch 不支持 abort ， 不支持超时控制 ， 使用 setTimeout 及 Promise.reject 的实现的超时控制并不能阻止请求过程继续在后台 运行，造成了流量的浪费

  fetch 没有办法原生监测请求的进度，而 XHR 可以
  :::

## 作用域和作用域链

创建函数的时候，已经声明了当前函数的作用域==>当前创建函数所处的上下文。如果是在全局下创建的函数就是[[scope]]:EC(G)，函数执行的时候，形成一个全新的私有上下文 EC(FN)，供字符串代码执行(进栈执行)

定义：简单来说作用域就是变量与函数的可访问范围，由当前环境与上层环境的一系列变量对象组成 1.全局作用域：代码在程序的任何地方都能被访问，window 对象的内置属性都拥有全局作用域。 2.函数作用域：在固定的代码片段才能被访问

作用：作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。

一般情况下，变量到创建该变量的函数的作用域中取值。但是如果在当前作用域中没有查到，就会向上级作用域去查，直到查到全局作用域，这么一个查找过程形成的链条就叫做作用域链。

## 闭包的两大作用：保存/保护

在 js 中变量的作用域属于函数作用域, 在函数执行完后,作用域就会被清理,内存也会随之被回收,但是由于闭包函数是建立在函数内部的子函数, 由于其可访问上级作用域,即使上级函数执行完, 作用域也不会随之销毁, 这时的子函数(也就是闭包),便拥有了访问上级作用域中变量的权限,即使上级函数执行完后作用域内的值也不会被销毁。

1. 内部函数可以访问定义他们外部函数的参数和变量。(作用域链的向上查找，把外围的作用域中的变量值存储在内存中而不是在函数调用完毕后销毁)设计私有的方法和变量，避免全局变量的污染。
2. 函数嵌套函数
3. 本质是将函数内部和外部连接起来。优点是可以读取函数内部的变量，让这些变量的值始终保存在内存中，不会在函数被调用之后自动清除

形成条件：

1. 函数的嵌套
2. 内部函数引用外部函数的局部变量，延长外部函数的变量生命周期

闭包的用途：

1. 模仿块级作用域
2. 保护外部函数的变量 能够访问函数定义时所在的词法作用域(阻止其被回收)
3. 封装私有化变量
4. 创建模块

闭包的优点：延长局部变量的生命周期

闭包的缺点：会导致函数的变量一直保存在内存中，过多的闭包可能会导致内存泄漏

## JS 中 this 的五种情况

1. 作为普通函数执行时，this 指向 window。
2. 当函数作为对象的方法被调用时，this 就会指向该对象。
3. 构造器调用，this 指向返回的这个对象。
4. 箭头函数 箭头函数的 this 绑定看的是 this 所在函数定义在哪个对象下，就绑定哪个对象。如果有嵌套的情况，则 this 绑定到最近的一层对象上。
5. 基于 Function.prototype 上的 apply 、 call 和 bind 调用模式，这三个方法都可以显示的指定调用函数的 this 指向。apply 接收参数的是数组，call 接受参数列表，``bind方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。这个函数的 this指向除了使用new`时会被改变，其他情况下都不会改变。若为空默认是指向全局对象 window。

## 原型 && 原型链

原型关系：

- 每个 class 都有显示原型 prototype
- 每个实例都有隐式原型 `__proto__`
- 实例的`__proto__`指向对应 class 的 prototype

**‌ 原型**:   在 JS 中，每当定义一个对象（函数也是对象）时，对象中都会包含一些预定义的属性。其中每个函数对象都有一个 `prototype ` 属性，这个属性指向函数的原型对象。

原型链：函数的原型链对象 constructor 默认指向函数本身，原型对象除了有原型属性外，为了实现继承，还有一个原型链指针`__proto__`,该指针是指向上一层的原型对象，而上一层的原型对象的结构依然类似。因此可以利用`__proto__`一直指向`Object`的原型对象上，而`Object`原型对象用`Object.prototype.__ proto__ = null`表示原型链顶端。如此形成了 js 的原型链继承。同时所有的 js 对象都有`Object`的基本防范

**特点**: JavaScript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变。

## 原型链的终点是什么？如何打印出原型链的终点？

由于 Object 是构造函数，原型链终点 `Object.prototype.__proto__`， 而 `Object.prototype.__proto__=== null // true`，所以，原型链 的终点是 null。原型链上的所有原型都是对象，所有的对象最终都 是由 `Object` 构造的，而 `Object.prototype`的下一级是 `Object.prototype.__proto__`。

## setTimeout、Promise、Async/Await 的区别

1. settimeout 的回调函数放到宏任务队列里，等到执行栈清空以后执行。
2. Promise 本身是同步的立即执行函数， 当在 executor 中执行 resolve 或者 reject 的时候, 此时是异步操作， 会先执行 then/catch 等，当主栈完成后，才会去调用 resolve/reject 中存放的方法执行。

```javascript
console.log('script start');
let promise1 = new Promise(function (resolve) {
  console.log('promise1');
  resolve();
  console.log('promise1 end');
}).then(function () {
  console.log('promise2');
});
setTimeout(function () {
  console.log('settimeout');
});
console.log('script end');
// 输出顺序: script start->promise1->promise1 end->script end->promise2->settimeout
```

3. async/await async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}

console.log('script start');
async1();
console.log('script end');
// 输出顺序：script start->async1 start->async2->script end->async1 end
```

## Async/Await 如何通过同步的方式实现异步

`Async/Await` 就是一个自执行的 `generate` 函数。利用 `generate` 函数的特性把异步的代码写成“同步”的形式，第一个请求的返回值作为后面一个请求的参数，其中每一个参数都是一个 `promise` 对象。

缺点在于滥用 `await` 可能会导致性能问题，因为 `await` 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。

## Generate 原理

`Generator` 是 `ES6` 中新增的语法，和 `Promise` ⼀样，都可以用来异步编程。在声明函数时 `function* test() {}` 即表示声明一个 `generator` 函数。内部通过 `yield` 暂停代码的执行。调用时通过 `next()` 执行代码。

```js
function* test() {
  yield 2;
  yield 3;
}

const y = test();
console.log(y.next()); // { value: 2, done: false }
console.log(y.next()); // { value: 3, done: false }
console.log(y.next()); // { value: undefined, done: true }
```

::: details 手写 `generator` 函数

```js
function generator(cb) {
  // 返回自执行函数
  return (function () {
    var obj = {
      next: 0,
      stop: function () {}
    };

    // y.next()
    return {
      next: function () {
        var ret = cb(obj);
        if (ret === undefined) {
          return {
            value: undefined,
            done: true
          };
        }
        return {
          value: ret,
          done: false
        };
      }
    };
  })();
}
```

:::

## let、const、var 的区别

1. 块级作用域： 块作用域由 { }包括，let 和 const 具有块级作用域，var 不存在块级作用域。块级作用域解决了 ES5 中的两个问题：
   - 内层变量可能覆盖外层变量
   - 用来计数的循环变量泄露为全局变量
2. 变量提升： var 存在变量提升，let 和 const 不存在变量提升，即在变量只能在声明之后使用，否在会报错。
3. 给全局添加属性： 浏览器的全局对象是 window，Node 的全局对象是 global。var 声明的变量为全局变量，并且会将该变量添加为全局对象的属性，但是 let 和 const 不会。
4. 重复声明： var 声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const 和 let 不允许重复声明变量。
5. 暂时性死区： 在使用 let、const 命令声明变量之前，该变量都是不可用的。这在语法上，称为暂时性死区。使用 var 声明的变量不存在暂时性死区。
6. 初始值设置： 在变量声明时，var 和 let 可以不用设置初始值。而 const 声明变量必须设置初始值。
7. 指针指向： let 和 const 都是 ES6 新增的用于创建变量的语法。 let 创建的变量是可以更改指针指向（可以重新赋值）。但 const 声明的变量是不允许改变指针的指向。

## JS 垃圾回收机制

1. 项目中，如果存在大量不被释放的内存（堆/栈/上下文），页面性能会变得很慢。当某些代码操作不能被合理释放，就会造成内存泄漏。我们尽可能减少使用闭包，因为它会消耗内存。
2. 浏览器垃圾回收机制/内存回收机制:
   :::tip
   浏览器的 Javascript 具有自动垃圾回收机制(GC:Garbage Collecation)，垃圾收集器会定期（周期性）找出那些不在继续使用的变量，然后释放其内存。
   :::
   - 标记清除:在 js 中，最常用的垃圾回收机制是标记清除：当变量进入执行环境时，被标记为“进入环境”，当变量离开执行环境时，会被标记为“离开环境”。垃圾回收器会销毁那些带标记的值并回收它们所占用的内存空间。
   - 谷歌浏览器：“查找引用”，浏览器不定时去查找当前内存的引用，如果没有被占用了，浏览器会回收它；如果被占用，就不能回收。
   - IE 浏览器：“引用计数法”，当前内存被占用一次，计数累加 1 次，移除占用就减 1，减到 0 时，浏览器就回收它。
3. 优化手段：内存优化 ; 手动释放：取消内存的占用即可。
   - 堆内存：fn = null 【null：空指针对象】
   - 栈内存：把上下文中，被外部占用的堆的占用取消即可。

内存泄漏 在 JS 中，常见的内存泄露主要有 4 种,全局变量、闭包、DOM 元素的引用、定时器

## Set、Map、WeakSet 和 WeakMap 的区别

- `Set`
  - 成员唯一、无序且不重复
  - [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
  - 可以遍历，方法有：add、delete、has
- `WeakSet`
  - 成员都是对象
  - 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存 DOM 节点，不容易造成内存泄漏
  - 不能遍历，方法有 add、delete、has
- `Map`
  - 本质上是键值对的集合，类似集合
  - 可以遍历，方法很多可以跟各种数据格式转换
- `WeakMap`
  - 只接受对象作为键名（null 除外），不接受其他类型的值作为键名
  - 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
  - 不能遍历，方法有 get、set、has、delete

## bind，call，apply 的区别

- call，apply，bind 都是改变函数 this 指向的
- call 和 apply 用法基本上一致，唯一不同点是 apply 传参是以数组的方式传入，而 call 是一个个传入
- bind 用法和 call 基本上一致，唯一不同的是 call 和 apply 是立即执行的，而 bind 不是立即执行

```javascript
Function.prototype.myApply = function (context) {
  context.fn = this; //1.将函数挂载到传入的对象
  var arg = [...arguments].splice(1)[0]; //2.取参数
  if (!Array.isArray(arg)) {
    throw new Error('apply的第二个参数必须是数组'); //3.限制参数类型为数组
  }
  context.fn(arg); //4.执行对象的方法
  delete context.fn; //5.移除对象的方法
};

Function.prototype.myCall = function (context) {
  context.fn = this; //1.将函数挂载到传入的对象
  var arg = [...arguments].splice(1); //2.取参数
  context.fn(...arg); //3.执行对象的方法
  delete context.fn; //4.移除对象的方法
};

Function.prototype.myBind = function (oThis) {
  if (typeof this !== 'function') {
    throw new TypeError('被绑定的对象需要是函数');
  }
  var self = this;
  var args = [].slice.call(arguments, 1);
  fBound = function () {
    //this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
    return self.apply(
      this instanceof fBound ? this : oThis,
      args.concat([].slice.call(arguments))
    );
  };
  var func = function () {};
  //维护原型关系
  if (this.prototype) {
    func.prototype = this.prototype;
  }
  //使fBound.prototype是func的实例，返回的fBound若作为new的构造函数，新对象的__proto__就是func的实例
  fBound.prototype = new func();
  return fBound;
};
```

## 介绍 js 中执⾏上下⽂和执⾏栈

![context](/interview/context.jpg)

简单的来说，执⾏上下⽂是⼀种对 `Javascript` 代码执⾏环境的抽象概念，也就是说只要有 `Javascript` 代码运⾏，那么它就⼀定是运⾏在执⾏上下⽂中。

执⾏上下⽂的类型分为三种：

- 全局执⾏上下⽂：只有⼀个，浏览器中的全局对象就是 `window` 对象，`this` 指向这个全局对象
- 函数执⾏上下⽂：存在⽆数个，只有在函数被调⽤的时候才会被创建，每次调⽤函数都会创建⼀个新的执⾏上下⽂
- `Eval` 函数执⾏上下⽂： 指的是运⾏在 `eval` 函数中的代码，很少⽤⽽且不建议使⽤

![context](/interview/context1.jpg)

紫⾊框住的部分为全局上下⽂，蓝⾊和橘⾊框起来的是不同的函数上下⽂。只有全局上下⽂（的变量） 能被其他任何上下⽂访问

可以有任意多个函数上下⽂，每次调⽤函数创建⼀个新的上下⽂，会创建⼀个私有作⽤域，函数内部声明的任何变量都不能在当前函数作⽤域外部直接访问

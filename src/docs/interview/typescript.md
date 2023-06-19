---
layout: doc
---

## 什么是 TypeScript 有什么优势

`Typescript` 是一个强类型的 `JavaScript` 超集，支持 `ES6` 语法，支持面向对象编程的概念，如类、接口、继承、泛型等。`Typescript` 并不直接在浏览器上运行，需要编译器编译成纯 `Javascript` 来运行。

- 静态类型检测，在开发阶段可以检查错误，使代码更加健壮。

- 类型在一定程度上充当文档。

- 良好的 `IDE` 支持、联想功能。

## TypeScript 缺点

- `TypeScript` 需要很长时间来编译代码。
- `TypeScript` 不支持抽象类。
- 如果在浏览器中运行 `TypeScript` 应用程序，则需要一个编译步骤将 `TypeScript` 转换为 `JavaScript`。
- 几十年来，`Web` 开发人员一直在使用 `JavaScript`，而 `TypeScript` 并没有带来任何新东西。
- 要使用任何第三方库，定义文件是必须的。并不是所有的第三方库都有可用的定义文件。
- 类型定义文件的质量是一个问题，如何确定定义是正确的？

## const 和 readonly 的区别

`readonly` 只对变量的属性，可以防止被修改；`const` 是声明变量的一种方式，不能改变指针。

## 接口和类型别名的区别

1. 两者都可以继承

2. 同名接口会合并，类型别名不会。

3. 接口可以用 `implements` 实现，类型别名不会；

4. 接口只能声明对象类型，类型别名可以声明一些简单的类型以及联合类型交叉类型等

## any、never、unknown、null & undefined 和 void 有什么区别

- `any`: 动态的变量类型（失去了类型检查的作用）。

- `never`: 永不存在的值的类型。例如：`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

- `unknown`: 任何类型的值都可以赋给 `unknown` 类型，但是 `unknown` 类型的值只能赋给 `unknown` 本身和 `any` 类型。

- `null & undefined`: 默认情况下 `null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给 `number` 类型的变量。当你指定了`--strictNullChecks` 标记，`null` 和 `undefined` 只能赋值给 `void` 和它们各自。

- `void`: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为 void。

## 简单介绍一下 TypeScript 模块的加载机制？

假设有一个导入语句  `import { a } from "moduleA"`;

1.  首先，编译器会尝试定位需要导入的模块文件，通过绝对或者相对的路径查找方式；
2.  如果上面的解析失败了，没有查找到对应的模块，编译器会尝试定位一个外部模块声明（`.d.ts`）；
3.  最后，如果编译器还是不能解析这个模块，则会抛出一个错误 `error TS2307: Cannot find module 'moduleA'`.

## TypeScript 中同名的 interface 或者同名的 interface 和 class 可以合并吗

同名的 `interface` 会自动合并，同名的 `interface` 和 `class` 会自动聚合。

## 如何使 TypeScript 项目引入并识别编译为 JavaScript 的 npm 库包？

1. 选择安装 `ts` 版本，`npm install @types/包名 --save`；
2. 对于没有类型的 `js` 库，需要编写同名的 `.d.ts` 文件

## keyof 和 typeof 关键字的作用？

`keyof` 索引类型查询操作符 获取索引类型的属性名，构成联合类型。

`typeof` 获取一个变量或对象的类型。

## declare，declare global 是什么？

`declare` 是用来定义全局变量、全局函数、全局命名空间、`js modules`、`class` 等

`declare global` 为全局对象 `window` 增加新的属性

```ts
declare global {
  interface Window {
    csrf: string;
  }
}
```

## 对 TypeScript 类中成员的 public、private、protected、readonly 修饰符的理解？

- `public`: 成员都默认为 `public`，被此限定符修饰的成员是可以被外部访问；

- `private`: 被此限定符修饰的成员是只可以被类的内部访问；

- `protected`: 被此限定符修饰的成员是只可以被类的内部以及类的子类访问;

- `readonly`: 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

## TypeScript 中如何设置模块导入的路径别名

通过 `tsconfig.json` 中的 `paths` 项来配置:

```json
{
  "compilerOptions":
    {
      "baseUrl": ".",
      "paths": {
         "@helper/*": ["src/helper/*"],
         "@utils/*": ["src/utils/*"],
         ...
      }
   }
}
```

## TypeScript 的 tsconfig.json 中有哪些配置项信息？

::: tip

```json
{
  "files": [],
  "include": [],
  "exclude": [],
  "compileOnSave": false,
  "extends": "",
  "compilerOptions": { ... }
}
```

- `files ` 是一个数组列表，里面包含指定文件的相对或绝对路径，用来指定待编译文件，编译器在编译的时候只会编译包含在 `files` 中列出的文件。
- `include & exclude` 指定编译某些文件，或者指定排除某些文件。
- `compileOnSave`：`true` 让 `IDE` 在保存文件的时候根据 `tsconfig.json` 重新生成文件。
- `extends` 可以通过指定一个其他的 `tsconfig.json` 文件路径，来继承这个配置文件里的配置。
- `compilerOptions` 编译配置项，如何对具体的 `ts` 文件进行编译

:::

## 常用工具类型

- `Partial<T>` 返回一个新的全部属性可选的类型。
- `Required<T>;` 返回一个新的全部属性必选的类型。
- `Readonly<T>` 返回一个新的全部属性只读的类型。
- `Pick<User, 'name'>` 从一个对象中取出一些属性构造一个新的对象。
- `Record<keyof User, User>` 构造一个 `key` 为 `string | number | symbol` 类型，`value` 为任意类型的对象。
- `Exclude<unioUser, 'name'>` 排除一个联合类型中的某一些类型。
- `Extract<unioUser, 'name' | 'age'>` 从一个联合类型中提取某一些类型，刚好合 `Exclude` 相反。
- `Omit<Iuser, 'name'>;` 从一个对象中排除一些不需要的属性。刚好于 `Pick` 相反。

## 简单聊聊你对 TypeScript 类型兼容性的理解？

::: tip

1. `ts` 类型兼容：当一个类型 `Y` 可以赋值给另一个类型 `X` 时， 我们就可以说类型 `X` 兼容类型 `Y`。也就是说两者在结构上是一致的，而不一定非得通过 `extends` 的方式继承而来

2. 接口的兼容性：`X = Y` 只要目标类型 `X` 中声明的属性变量在源类型 `Y` 中都存在就是兼容的（ `Y` 中的类型可以比 `X` 中的多，但是不能少）

3. 函数的兼容性：`X = Y` `Y` 的每个参数必须能在 `X` 里找到对应类型的参数，参数的名字相同与否无所谓，只看它们的类型（参数可以少但是不能多。与接口的兼容性有区别，原因参考 **协变、逆变、双变和抗变的理解**）

:::

## 协变、逆变、双变和抗变的理解？

::: tip

**协变**：`X = Y` `Y` 类型可以赋值给 `X` 类型的情况就叫做协变，也可以说是 `X` 类型兼容 `Y` 类型

```ts
interface X {
  name: string;
  age: number;
}
interface Y {
  name: string;
  age: number;
  hobbies: string[];
}
let x: X = { name: "xiaoming", age: 16 };
let y: Y = { name: "xiaohong", age: 18, hobbies: ["eat"] };
x = y;
```

**逆变**：`printY = printX` 函数 `X` 类型可以赋值给函数 `Y` 类型，因为函数 `Y` 在调用的时候参数是按照 `Y` 类型进行约束的，但是用到的是函数 `X` 的 `X` 的属性和方法，`ts` 检查结果是类型安全的。这种特性就叫做逆变，函数的参数有逆变的性质。

```ts
let printY: (y: Y) => void;
printY = y => {
  console.log(y.hobbies);
};
let printX: (x: X) => void;
printX = x => {
  console.log(x.name);
};
printY = printX;
```

**双变（双向协变）**：`X = Y`；`Y = X` 父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”（ts2.x 之前支持这种赋值，之后 `ts` 加了一个编译选项 `strictFunctionTypes`，设置为 `true` 就只支持函数参数的逆变，设置为 `false` 则支持双向协变）
抗变（不变）：非父子类型之间不会发生型变，只要类型不一样就会报错

:::

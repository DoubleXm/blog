---
outline: [2,3,4]
---

# Vitest

> [!CAUTION]
> [文档](https://vitest.dev/)
> 
> `Vitest` 是一个基于 `Vite` 的测试框架，对于使用 `Vite` 构建的项目，是一个很不错的选择。
>
> 支持 `Vue` `React` 等主流测试库的测试。使用 `jsdom` 或者 `happy-dom` 操作 DOM。
>
> 支持覆盖率检测、UI 模式、测试报告输出、测试筛选等操作。

## 起步

```bash :no-line-numbers
pnpm add -D vitest @vitest/browser-playwright playwright vitest-browser-react
```

`@vitest/browser-playwright playwright` 主要用于配置文件。

`vitest vitest-browser-react` 主要用于编写测试代码。

如果是基于 `vite` 构建的项目，直接在 `vite.config.ts` 中增加 `test` 选项即可。

```ts :no-line-numbers
import { defineConfig } from 'vite';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true, // 开启浏览器测试
      headless: true, // 开启无头模式
      provider: playwright(), // 注入 playwright 实例
      instances: [
        { browser: 'chromium' } // 使用 chromium 浏览器
      ]
    }
  },
});
```

**非 `vite` 构建项目使用 `vitest.config.ts` 但是要同步安装 `react` 的插件**

**`@vitejs/plugin-react`**

以 `Calendar` 组件为例创建测试文件。

``` :no-line-numbers
.
├── __test__
│   └── Calendar.spec.tsx
├── index.scss
├── index.tsx
```

```ts :no-line-numbers
import { test, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import Calendar from './index';
import dayjs from 'dayjs';

test('Calendar 渲染', async () => {
  const screen = await render(<Calendar defaultValue={dayjs()} />);

  expect(screen.container).toBeVisible();
  expect(screen.container.querySelector('.calendar')?.className).toBe('calendar');
})
```

`render` 函数返回一个 `screen` 对象，其中 `container` 是一个 DOM 元素，包含了渲染的组件。

`test expect` 一个用于声明测试用例、一个用于断言的函数。

## 测试用例、套件

`test` 只是最基本的声明用例的方案，也是最常用的。其中包含了很多子方法 `skip` `skipif` `todo` `runif` `only` 等等。[文档](https://cn.vitest.dev/api/#test)

当需要为测试用例进行分组时（无论分组的目的、逻辑为何），可以使用 `describe` 方法进行组织。[文档](https://cn.vitest.dev/api/#describe)

![alt text](/react/components/test/01.png)


## 断言

断言的方式分为两种 `expect` `assert`。

[expect 文档](https://cn.vitest.dev/api/expect.html#not)

[assert 文档](https://cn.vitest.dev/api/assert.html#assert-1)

## 命令行

| 命令 | 描述 |
| --- | --- |
| `vitest` | dev 环境监听模式 |
| `vitest run` | 运行所有测试 |
| `vitest --watch \| -w` `vitest watch` | 监听文件变化，运行相关测试 |
| `vitest --coverage` | 生成测试覆盖率报告 |
| `vitest --ui` | 打开测试 UI 模式 |

[命令行文档](https://cn.vitest.dev/guide/cli.html)

`--ui` 参数指定后，如果没有安装对应依赖，会先进行安装。

![alt text](/react/components/test/03.png)

`--coverage` 参数指定后，如果没有安装对应依赖，会先进行安装。也可以在配置文件中指定哪种覆盖率方案。

```ts :no-line-numbers
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8' // or 'istanbul'
    },
  },
})
```
![alt text](/react/components/test/02.png)

## React 测试

> [!IMPORTANT]
> 以上内容都是一些通用概念，具体到框架层面的测试，则需要另外的支持，比如前面示例中出现的 `vitest-browser-react` 插件。 [文档](https://github.com/vitest-community/>vitest-browser-react)
>
> 官网也提供了一些其他框架的 `Demo` [文档](https://cn.vitest.dev/guide/#examples)
>
> 比如 `Vue` 则使用的是 `vitest-browser-vue`。 [文档](https://github.com/vitest-community/vitest-browser-vue)

插件中抛出三个方法 `render` `renderHook` `cleanup`，实际上每次开始测试前都会调用 `cleanup` 方法，业务代码中基本不会调用。


### render

`render` 方法用于渲染 `react` 组件，返回一个 `screen` 对象。

**包含常用 `container` 及获取元素的方案。**

**`container` 是一个 DOM 元素，可以直接使用 `querySelector` 等方法获取元素。**

![alt text](/react/components/test/04.png)

### renderHook

如果组件的渲染需要用到 `hook`， 或者需要测试自定义的 `hook`，则需要使用 `renderHook` 方法。

`renderHook` 方法返回内容如下

![alt text](/react/components/test/05.png)

`rerender unmount` 重新渲染组件，以及卸载组件。

`result` 用户存储 hook 的返回值。

`act` 是个测试辅助工具，用于在断言前应用待处理的 React 更新。官方也是有这个 api 的，这里应该是做了一层包裹。 [act 文档](https://zh-hans.react.dev/reference/react/act)

![alt text](/react/components/test/06.png)

再或者直接测试自定义 hook 也可以。

![alt text](/react/components/test/07.png)

---
title: UMD, CMD, AMD, ESM, COMMONJS 的区别及 SystemJS 原理
outline: [2, 3, 4]
---

由于早期 `javascript` 没有标准的模块化规划，导致发展出来了总多版本。说起来都是一些历史债务。

## CommonJS

`CommonJS` 是 `Node.js` 采用的模块化规范，主要用于服务器端。设计目标是让 JavaScript 能够在服务器端运行，并支持模块化开发。

使用 `require` 加载模块，使用 `module.exports` 或者 `exports` 导出模块。

```javascript
module.exports = {
  add: (a, b) => a + b
}
exports.add = (a, b) => a + b;

const m = require('./m.js');
m.add(1, 2);
```

## AMD（Asynchronous Module Definition）

`AMD` 是为了解决浏览器端模块化问题而设计的。异步模块加载方案，使用 `define` 定义模块，使用 `require` 加载模块。**RequireJS** 是 `AMD` 规范的主要实现。

```javascript
// 定义模块
define(['dependency'], function(dependency) {
  return {
    add: function(a, b) {
      return dependency.process(a) + dependency.process(b);
    }
  };
});

// 加载模块
require(['module'], function(module) {
  console.log(module.add(1, 2)); // 3
});
```

## CMD（Common Module Definition）

`CMD` 是 **`Sea.js`** 提出的模块化规范，类似于 `AMD`，但更接近 `CommonJS` 的写法。目标是简化模块定义和加载。它与 `AMD` 很类似，不同点在于：**AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行**。

```js
// 定义模块
define(function(require, exports, module) {
  const dependency = require('dependency');
  exports.add = function(a, b) {
    return dependency.process(a) + dependency.process(b);
  };
});

// 加载模块
seajs.use(['module'], function(module) {
  console.log(module.add(1, 2)); // 3
});
```

## UMD (Universal Module Definition)

`UMD` 是一种通用的模块定义格式，旨在兼容多种模块系统（如：`CommonJS`, `AMD`）目标是让模块可以在任何环境中运行。根据环境自动选择模块加载方式。`UMD` 是一种模式，没有特定的实现库。

```js
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD 环境
    define(['dependency'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS 环境
    module.exports = factory(require('dependency'));
  } else {
    // 全局变量
    root.MyModule = factory(root.Dependency);
  }
}(this, function(dependency) {
  return {
    add: function(a, b) {
      return a + b;
    }
  };
}));
```

## ESM (ECMAScript Module)

`ES Module` 是 `JavaScript` 官方标准（`ECMAScript 6+` 引入）。目标是统一模块化规范，支持浏览器和服务器端。**支持静态分析和优化**

`Node.js` 从 `12` 版本开始支持 `ES Module`（通过 `.mjs` 文件或 `package.json` 中的 `type: "module"`）。

```js
// 导出模块
export function add(a, b) {
  return a + b;
}

// 加载模块
import { add } from './module.js';
console.log(add(1, 2)); // 3
```

## CommonJS 和 ESM 的区别

**CommonJS**

- **导出值是拷贝**：模块导出的值是导出对象的一个拷贝。修改导出的对象不会影响其他模块中看到的值。
- 通过 require 动态加载，适合在运行时处理模块。
- 因为模块是动态加载的，无法在编译时确定哪些代码未被使用，不支持 Tree Shaking。

```js
let count = 0;

module.exports = {
  add: function (a, b) {
    return a + b;
  },
  getCount: function () {
    return count;
  },
};

// app.js
const math = require("./math");
console.log(math.getCount()); // 输出: 0
math.count = 10; // 不会改变 math.getCount() 返回值
console.log(math.getCount()); // 仍然输出: 0

// 动态导入
if (condition) {
  const module = require('./module');
  module.doSomething();
}
```

**ESM**
- **导出值是引用**：模块导出的值是对原始对象的引用。对导出对象的修改会在其他模块中反映出来。
- 的 import 是静态加载，但可以通过 import() 实现动态加载。
- 支持 Tree Shaking，打包工具（如 Webpack、Rollup）可以移除未使用的代码，减少打包体积

```js
export let count = 0;

export function add(a, b) {
  return a + b;
}

// app.js
import { count, add } from "./math.js";
console.log(count); // 输出: 0
count = 10; // 会改变 math.js 中的 count
import { count as newCount } from "./math.js";
console.log(newCount); // 仍然输出: 10

// 动态导入
if (condition) {
  import('./module.js').then(module => {
    module.doSomething();
  });
}
```

## SystemJS

诞生于 2015 年，当时没有 `ESM` 的标准，**为了应对多种模块规范形成的通用的模块加载器**。后来随着 `ESM` 的普及，`SystemJS` 是对不支持 `importmap` 浏览器 `ESM` 的替代品，`ESM` 被编译成 `System.register` 格式之后跑在旧的浏览器中。[兼容性参考](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script/type/importmap)

如果浏览器支持 `importmap` 则可以使用在 `html` 中写出如下代码，前提是第三方的模块也要是 `ESM` 规范

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://airpack.alibaba-inc.com/react",
      "react-dom": "https://airpack.alibaba-inc.com/react-dom"
    }
  }
</script>

<div id="root"></div>
<script type="module">
  import React from 'react';
  import ReactDOM from 'react-dom';

  ReactDOM.render('Hello World', document.getElementById('root'))
</script>
```

### 使用 SystemJS 加载模块

使用 `webpack` 指定 `libraryTarget` 为 `system` 可以打包出 `System.register` 格式的模块。大致如下

```js
// 如果存在 externals 配置, register 中的第一个参数就是 externals 的包
System.register(["react-dom","react"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE_react_dom__ = {};
	var __WEBPACK_EXTERNAL_MODULE_react__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_react_dom__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_react__, "__esModule", { value: true });
	return {
		setters: [
      // 挂载包中的属性，比如 render, createElement 等等
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_react_dom__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_react__[key] = module[key];
				});
			}
		],
		execute: function() { /** 业务代码执行 */}
  }
})
```

在入口 `html` 中则需要使用 `systemjs-importmap + system cdn` 来加载模块。值得一提的是，`single-spa` 就是将一个个的子应用封装成一个整体，然后通过 `systemjs` 来加载。

```html
<!-- 配置第三方模块的 CDN -->
<script type="systemjs-importmap">
  {
    "imports": {
      "react": "https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.development.js",
      "react-dom": "https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js"
    }
  }
</script>
<script src="https://cdn.bootcdn.net/ajax/libs/systemjs/6.10.1/system.js"></script>
<div id="root"></div>
<script>
  // 加载构建出来的产物，并执行 register 
  System.import('./build.js').then(() => {
    console.log('模块加载完毕')
  });
</script>
```

### SystemJS 模块加载原理

通过使用的过程，发现加载模块和业务模块核心就是 `import`、 `register` 方法。

`register` 方法接收两个参数

- 第一个参数是模块的依赖
- 第二个参数是一个回调函数，该回调函数会返回一个对象，该对象中包含 `setters` 和 `execute` 方法
  - `setters` 负责绑定依赖模块的属性及方法
  - `execute` 负责执行业务模块的代码

```js
const newMapUrl = {};
function processImportMapScript() {
  document.querySelectorAll('script').forEach(script => {
    if (script.type === 'systemjs-importmap') {
      const imports = JSON.parse(script.innerHTML).imports;
      Object.entries(imports).forEach(([key, value]) => newMapUrl[key] = value);
    }
  })
}

function loadModule(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // 兼容 cdn 和 相对地址
    script.src = newMapUrl[url] || url;
    script.async = true;
    document.head.appendChild(script);
    script.addEventListener('load', () => {
      // 考虑到 register 是引用类型，防止引用被修改
      const _lastRegister = lastRegister;
      lastRegister = null;
      resolve(lastRegister);
    });
  });
}

let keySet = new Set();
function saveGlobalProperties() {
  for (let key in window) {
    keySet.add(key);
  }
}
// 先保存一遍全局变量
saveGlobalProperties();

function getLastGlobalProperties() {
  for (let key in window) {
    if (keySet.has(key)) continue;
    // 如果多个模块需要加载时，不保存的话，会一直命中第一个模块中的属性。
    keySet.add(key);
    return window[key];
  }
}

let lastRegister;
class SystemJS {
  // address 可以是业务模块的相对路径，也可以是 CDN 地址, 目前仅支持相对路径
  import(address) {
    // 解析 systemjs-importmap
    return Promise.resolve(processImportMapScript())
      .then(() => {
        const lastSlashIndex = location.href.lastIndexOf('/');
        const baseUrl = location.href.slice(0, lastSlashIndex + 1);
        if (address.startsWith('./')) {
          // 拼接地址
          return baseUrl + address.slice(2);
        }
      })
      .then(url => {
        let execute;
        // 加载内部模块
        return loadModule(url)
                  .then(registerModule => {
                    // 调用 register 的回调，拿到 setters 和 execute
                    const { setters, execute: exe } = registerModule[1](() => {});
                    execute = exe;
                    return [registerModule[0], setters];
                  })
                  .then(([deps, setters]) => {
                    return Promise.all(deps.map((dep, index) => {
                      // 加载第三方依赖, loadModule 会根据 key 名称进行加载 react react-dom
                      return loadModule(dep)
                                .then(() => {
                                  // 获取到 window 上最后新增的属性，进行挂载
                                  const property = getLastGlobalProperties();
                                  setters[index](property);
                                });
                    }));
                  })
                  .then(() => {
                    // 执行业务逻辑
                    execute();
                  });
      })
  }

  register(deps, callback) {
    lastRegister = [deps, callback];
  }
}

const System = new SystemJS();
System.import('./build.js').then(() => console.log('模块加载完毕...'));
```

总结：

- 获取 `systemjs-importmap` 中的依赖模块整合 `newMapUrl`；
- 拼接业务模块地址 从 `xx/xx/index.html` -> `xx/xx/build.js`；
- 加载业务模块（拿到依赖模块名、`setters`、`execute`），加载完成后拿到最后的 `register` 代码；
- 根据依赖模块名加载第三方模块并且把属性挂载到 `setters`（通过快照的方式获取浏览器的新增的属性）；
- 执行业务模块的代码 `execute`；
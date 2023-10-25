import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.45bffcbf.js";const e=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"doc"},"headers":[],"relativePath":"docs/interview/typescript.md","lastUpdated":1687189963000}'),o={name:"docs/interview/typescript.md"},p=[l('<h2 id="什么是-typescript-有什么优势" tabindex="-1">什么是 TypeScript 有什么优势 <a class="header-anchor" href="#什么是-typescript-有什么优势" aria-label="Permalink to &quot;什么是 TypeScript 有什么优势&quot;">​</a></h2><p><code>Typescript</code> 是一个强类型的 <code>JavaScript</code> 超集，支持 <code>ES6</code> 语法，支持面向对象编程的概念，如类、接口、继承、泛型等。<code>Typescript</code> 并不直接在浏览器上运行，需要编译器编译成纯 <code>Javascript</code> 来运行。</p><ul><li><p>静态类型检测，在开发阶段可以检查错误，使代码更加健壮。</p></li><li><p>类型在一定程度上充当文档。</p></li><li><p>良好的 <code>IDE</code> 支持、联想功能。</p></li></ul><h2 id="typescript-缺点" tabindex="-1">TypeScript 缺点 <a class="header-anchor" href="#typescript-缺点" aria-label="Permalink to &quot;TypeScript 缺点&quot;">​</a></h2><ul><li><code>TypeScript</code> 需要很长时间来编译代码。</li><li><code>TypeScript</code> 不支持抽象类。</li><li>如果在浏览器中运行 <code>TypeScript</code> 应用程序，则需要一个编译步骤将 <code>TypeScript</code> 转换为 <code>JavaScript</code>。</li><li>几十年来，<code>Web</code> 开发人员一直在使用 <code>JavaScript</code>，而 <code>TypeScript</code> 并没有带来任何新东西。</li><li>要使用任何第三方库，定义文件是必须的。并不是所有的第三方库都有可用的定义文件。</li><li>类型定义文件的质量是一个问题，如何确定定义是正确的？</li></ul><h2 id="const-和-readonly-的区别" tabindex="-1">const 和 readonly 的区别 <a class="header-anchor" href="#const-和-readonly-的区别" aria-label="Permalink to &quot;const 和 readonly 的区别&quot;">​</a></h2><p><code>readonly</code> 只对变量的属性，可以防止被修改；<code>const</code> 是声明变量的一种方式，不能改变指针。</p><h2 id="接口和类型别名的区别" tabindex="-1">接口和类型别名的区别 <a class="header-anchor" href="#接口和类型别名的区别" aria-label="Permalink to &quot;接口和类型别名的区别&quot;">​</a></h2><ol><li><p>两者都可以继承</p></li><li><p>同名接口会合并，类型别名不会。</p></li><li><p>接口可以用 <code>implements</code> 实现，类型别名不会；</p></li><li><p>接口只能声明对象类型，类型别名可以声明一些简单的类型以及联合类型交叉类型等</p></li></ol><h2 id="any、never、unknown、null-undefined-和-void-有什么区别" tabindex="-1">any、never、unknown、null &amp; undefined 和 void 有什么区别 <a class="header-anchor" href="#any、never、unknown、null-undefined-和-void-有什么区别" aria-label="Permalink to &quot;any、never、unknown、null &amp; undefined 和 void 有什么区别&quot;">​</a></h2><ul><li><p><code>any</code>: 动态的变量类型（失去了类型检查的作用）。</p></li><li><p><code>never</code>: 永不存在的值的类型。例如：<code>never</code> 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。</p></li><li><p><code>unknown</code>: 任何类型的值都可以赋给 <code>unknown</code> 类型，但是 <code>unknown</code> 类型的值只能赋给 <code>unknown</code> 本身和 <code>any</code> 类型。</p></li><li><p><code>null &amp; undefined</code>: 默认情况下 <code>null</code> 和 <code>undefined</code> 是所有类型的子类型。 就是说你可以把 <code>null</code> 和 <code>undefined</code> 赋值给 <code>number</code> 类型的变量。当你指定了<code>--strictNullChecks</code> 标记，<code>null</code> 和 <code>undefined</code> 只能赋值给 <code>void</code> 和它们各自。</p></li><li><p><code>void</code>: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为 void。</p></li></ul><h2 id="简单介绍一下-typescript-模块的加载机制" tabindex="-1">简单介绍一下 TypeScript 模块的加载机制？ <a class="header-anchor" href="#简单介绍一下-typescript-模块的加载机制" aria-label="Permalink to &quot;简单介绍一下 TypeScript 模块的加载机制？&quot;">​</a></h2><p>假设有一个导入语句  <code>import { a } from &quot;moduleA&quot;</code>;</p><ol><li>首先，编译器会尝试定位需要导入的模块文件，通过绝对或者相对的路径查找方式；</li><li>如果上面的解析失败了，没有查找到对应的模块，编译器会尝试定位一个外部模块声明（<code>.d.ts</code>）；</li><li>最后，如果编译器还是不能解析这个模块，则会抛出一个错误 <code>error TS2307: Cannot find module &#39;moduleA&#39;</code>.</li></ol><h2 id="typescript-中同名的-interface-或者同名的-interface-和-class-可以合并吗" tabindex="-1">TypeScript 中同名的 interface 或者同名的 interface 和 class 可以合并吗 <a class="header-anchor" href="#typescript-中同名的-interface-或者同名的-interface-和-class-可以合并吗" aria-label="Permalink to &quot;TypeScript 中同名的 interface 或者同名的 interface 和 class 可以合并吗&quot;">​</a></h2><p>同名的 <code>interface</code> 会自动合并，同名的 <code>interface</code> 和 <code>class</code> 会自动聚合。</p><h2 id="如何使-typescript-项目引入并识别编译为-javascript-的-npm-库包" tabindex="-1">如何使 TypeScript 项目引入并识别编译为 JavaScript 的 npm 库包？ <a class="header-anchor" href="#如何使-typescript-项目引入并识别编译为-javascript-的-npm-库包" aria-label="Permalink to &quot;如何使 TypeScript 项目引入并识别编译为 JavaScript 的 npm 库包？&quot;">​</a></h2><ol><li>选择安装 <code>ts</code> 版本，<code>npm install @types/包名 --save</code>；</li><li>对于没有类型的 <code>js</code> 库，需要编写同名的 <code>.d.ts</code> 文件</li></ol><h2 id="keyof-和-typeof-关键字的作用" tabindex="-1">keyof 和 typeof 关键字的作用？ <a class="header-anchor" href="#keyof-和-typeof-关键字的作用" aria-label="Permalink to &quot;keyof 和 typeof 关键字的作用？&quot;">​</a></h2><p><code>keyof</code> 索引类型查询操作符 获取索引类型的属性名，构成联合类型。</p><p><code>typeof</code> 获取一个变量或对象的类型。</p><h2 id="declare-declare-global-是什么" tabindex="-1">declare，declare global 是什么？ <a class="header-anchor" href="#declare-declare-global-是什么" aria-label="Permalink to &quot;declare，declare global 是什么？&quot;">​</a></h2><p><code>declare</code> 是用来定义全局变量、全局函数、全局命名空间、<code>js modules</code>、<code>class</code> 等</p><p><code>declare global</code> 为全局对象 <code>window</code> 增加新的属性</p><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">declare</span><span style="color:#A6ACCD;"> global </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">interface</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Window</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">    csrf</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="对-typescript-类中成员的-public、private、protected、readonly-修饰符的理解" tabindex="-1">对 TypeScript 类中成员的 public、private、protected、readonly 修饰符的理解？ <a class="header-anchor" href="#对-typescript-类中成员的-public、private、protected、readonly-修饰符的理解" aria-label="Permalink to &quot;对 TypeScript 类中成员的 public、private、protected、readonly 修饰符的理解？&quot;">​</a></h2><ul><li><p><code>public</code>: 成员都默认为 <code>public</code>，被此限定符修饰的成员是可以被外部访问；</p></li><li><p><code>private</code>: 被此限定符修饰的成员是只可以被类的内部访问；</p></li><li><p><code>protected</code>: 被此限定符修饰的成员是只可以被类的内部以及类的子类访问;</p></li><li><p><code>readonly</code>: 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。</p></li></ul><h2 id="typescript-中如何设置模块导入的路径别名" tabindex="-1">TypeScript 中如何设置模块导入的路径别名 <a class="header-anchor" href="#typescript-中如何设置模块导入的路径别名" aria-label="Permalink to &quot;TypeScript 中如何设置模块导入的路径别名&quot;">​</a></h2><p>通过 <code>tsconfig.json</code> 中的 <code>paths</code> 项来配置:</p><div class="language-json line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">compilerOptions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span></span>\n<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">baseUrl</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">.</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>\n<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">paths</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#A6ACCD;">         </span><span style="color:#89DDFF;">&quot;</span><span style="color:#F78C6C;">@helper/*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">src/helper/*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>\n<span class="line"><span style="color:#A6ACCD;">         </span><span style="color:#89DDFF;">&quot;</span><span style="color:#F78C6C;">@utils/*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">src/utils/*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>\n<span class="line"><span style="color:#A6ACCD;">         ...</span></span>\n<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#A6ACCD;">   </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="typescript-的-tsconfig-json-中有哪些配置项信息" tabindex="-1">TypeScript 的 tsconfig.json 中有哪些配置项信息？ <a class="header-anchor" href="#typescript-的-tsconfig-json-中有哪些配置项信息" aria-label="Permalink to &quot;TypeScript 的 tsconfig.json 中有哪些配置项信息？&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><div class="language-json line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">files</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[],</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">include</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[],</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">exclude</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[],</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">compileOnSave</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">false,</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">extends</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">,</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">compilerOptions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> ... </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><ul><li><code>files </code> 是一个数组列表，里面包含指定文件的相对或绝对路径，用来指定待编译文件，编译器在编译的时候只会编译包含在 <code>files</code> 中列出的文件。</li><li><code>include &amp; exclude</code> 指定编译某些文件，或者指定排除某些文件。</li><li><code>compileOnSave</code>：<code>true</code> 让 <code>IDE</code> 在保存文件的时候根据 <code>tsconfig.json</code> 重新生成文件。</li><li><code>extends</code> 可以通过指定一个其他的 <code>tsconfig.json</code> 文件路径，来继承这个配置文件里的配置。</li><li><code>compilerOptions</code> 编译配置项，如何对具体的 <code>ts</code> 文件进行编译</li></ul></div><h2 id="常用工具类型" tabindex="-1">常用工具类型 <a class="header-anchor" href="#常用工具类型" aria-label="Permalink to &quot;常用工具类型&quot;">​</a></h2><ul><li><code>Partial&lt;T&gt;</code> 返回一个新的全部属性可选的类型。</li><li><code>Required&lt;T&gt;;</code> 返回一个新的全部属性必选的类型。</li><li><code>Readonly&lt;T&gt;</code> 返回一个新的全部属性只读的类型。</li><li><code>Pick&lt;User, &#39;name&#39;&gt;</code> 从一个对象中取出一些属性构造一个新的对象。</li><li><code>Record&lt;keyof User, User&gt;</code> 构造一个 <code>key</code> 为 <code>string | number | symbol</code> 类型，<code>value</code> 为任意类型的对象。</li><li><code>Exclude&lt;unioUser, &#39;name&#39;&gt;</code> 排除一个联合类型中的某一些类型。</li><li><code>Extract&lt;unioUser, &#39;name&#39; | &#39;age&#39;&gt;</code> 从一个联合类型中提取某一些类型，刚好合 <code>Exclude</code> 相反。</li><li><code>Omit&lt;Iuser, &#39;name&#39;&gt;;</code> 从一个对象中排除一些不需要的属性。刚好于 <code>Pick</code> 相反。</li></ul><h2 id="简单聊聊你对-typescript-类型兼容性的理解" tabindex="-1">简单聊聊你对 TypeScript 类型兼容性的理解？ <a class="header-anchor" href="#简单聊聊你对-typescript-类型兼容性的理解" aria-label="Permalink to &quot;简单聊聊你对 TypeScript 类型兼容性的理解？&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><ol><li><p><code>ts</code> 类型兼容：当一个类型 <code>Y</code> 可以赋值给另一个类型 <code>X</code> 时， 我们就可以说类型 <code>X</code> 兼容类型 <code>Y</code>。也就是说两者在结构上是一致的，而不一定非得通过 <code>extends</code> 的方式继承而来</p></li><li><p>接口的兼容性：<code>X = Y</code> 只要目标类型 <code>X</code> 中声明的属性变量在源类型 <code>Y</code> 中都存在就是兼容的（ <code>Y</code> 中的类型可以比 <code>X</code> 中的多，但是不能少）</p></li><li><p>函数的兼容性：<code>X = Y</code> <code>Y</code> 的每个参数必须能在 <code>X</code> 里找到对应类型的参数，参数的名字相同与否无所谓，只看它们的类型（参数可以少但是不能多。与接口的兼容性有区别，原因参考 <strong>协变、逆变、双变和抗变的理解</strong>）</p></li></ol></div><h2 id="协变、逆变、双变和抗变的理解" tabindex="-1">协变、逆变、双变和抗变的理解？ <a class="header-anchor" href="#协变、逆变、双变和抗变的理解" aria-label="Permalink to &quot;协变、逆变、双变和抗变的理解？&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><strong>协变</strong>：<code>X = Y</code> <code>Y</code> 类型可以赋值给 <code>X</code> 类型的情况就叫做协变，也可以说是 <code>X</code> 类型兼容 <code>Y</code> 类型</p><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">X</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Y</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">hobbies</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#A6ACCD;">[]</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> x</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">X</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">xiaoming</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">16</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">};</span></span>\n<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> y</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Y</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">xiaohong</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">18</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">hobbies</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">eat</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">] </span><span style="color:#89DDFF;">};</span></span>\n<span class="line"><span style="color:#A6ACCD;">x </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> y</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p><strong>逆变</strong>：<code>printY = printX</code> 函数 <code>X</code> 类型可以赋值给函数 <code>Y</code> 类型，因为函数 <code>Y</code> 在调用的时候参数是按照 <code>Y</code> 类型进行约束的，但是用到的是函数 <code>X</code> 的 <code>X</code> 的属性和方法，<code>ts</code> 检查结果是类型安全的。这种特性就叫做逆变，函数的参数有逆变的性质。</p><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> printY</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">y</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Y</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#82AAFF;">printY</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">y</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">y</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">hobbies</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">};</span></span>\n<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> printX</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">X</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#82AAFF;">printX</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">x</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">x</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">};</span></span>\n<span class="line"><span style="color:#A6ACCD;">printY </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> printX</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p><strong>双变（双向协变）</strong>：<code>X = Y</code>；<code>Y = X</code> 父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”（ts2.x 之前支持这种赋值，之后 <code>ts</code> 加了一个编译选项 <code>strictFunctionTypes</code>，设置为 <code>true</code> 就只支持函数参数的逆变，设置为 <code>false</code> 则支持双向协变） 抗变（不变）：非父子类型之间不会发生型变，只要类型不一样就会报错</p></div>',38)];const c=s(o,[["render",function(s,l,e,o,c,t){return n(),a("div",null,p)}]]);export{e as __pageData,c as default};

import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.45bffcbf.js";const p=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"doc"},"headers":[],"relativePath":"docs/interview/node.md","lastUpdated":1687189963000}'),o={name:"docs/interview/node.md"},e=[l('<h2 id="nodejs-适合做什么业务" tabindex="-1"><code>Nodejs</code> 适合做什么业务 <a class="header-anchor" href="#nodejs-适合做什么业务" aria-label="Permalink to &quot;`Nodejs` 适合做什么业务&quot;">​</a></h2><p><code>Nodejs</code> 是单线程，非阻塞 <code>I/O</code>，事件驱动，它的特点决定了它适合做一些大量 <code>I/O</code> 的东西，比如，聊天室，表单提交等不需要大量计算的功能。做一些微信后端开发，或者做消息系统等。可以整个项目用，也可以根据它的特点在某个模块使用，比如 <code>socketio</code>，打造一个消息系统等</p><h2 id="nodejs-中的-stream-和-buffer-有什么区别" tabindex="-1"><code>Nodejs</code> 中的 <code>Stream</code> 和 <code>Buffer</code> 有什么区别 <a class="header-anchor" href="#nodejs-中的-stream-和-buffer-有什么区别" aria-label="Permalink to &quot;`Nodejs` 中的 `Stream` 和 `Buffer` 有什么区别&quot;">​</a></h2><p><code>Buffer</code>：为数据缓冲对象，是一个类似数组结构的对象，可以通过指定开始写入的位置及写入的数据长度，往其中写入二进制数据。</p><p><code>Stream</code>：是对 <code>buffer</code> 对象的高级封装，其操作的底层还是 <code>buffer</code> 对象，<code>stream</code> 可以设置为可读、可写，或者即可读也可写，在 <code>nodejs</code> 中继承了 <code>EventEmitter</code> 接口，可以监听读入、写入的过程。具体实现有文件流， <code>http response</code> 等。</p><h2 id="express-和-koa-有什么关系-有什么区别" tabindex="-1"><code>Express</code> 和 <code>koa</code> 有什么关系，有什么区别 <a class="header-anchor" href="#express-和-koa-有什么关系-有什么区别" aria-label="Permalink to &quot;`Express` 和 `koa` 有什么关系，有什么区别&quot;">​</a></h2><p><strong>相同点</strong>：两个框架都对 <code>http</code> 进行了封装。相关的 <code>api</code> 都差不多，同一批人所写。</p><p><strong>不同点</strong>：</p><p><code>express</code> 内置了许多中间件可供使用，而 <code>koa</code> 没有。</p><p><code>express</code> 包含路由，视图渲染等特性，而 <code>koa</code> 只有 <code>http</code> 模块。</p><p><code>express</code> 的中间件模型为线型，而 <code>koa</code> 的中间件模型为 <code>U</code> 型，也可称为洋葱模型构造中间件。</p><p><code>express</code> 通过回调实现异步函数，在多个回调、多个中间件中写起来容易逻辑混乱。</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">/test</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">req</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">res</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">fs</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">readFile</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">/file1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">err</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">data</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">err</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">res</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">status</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">500</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">send</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">read file1 error</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">fs</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">readFile</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">/file2</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">err</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">data</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">err</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">res</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">status</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">500</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">send</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">read file2 error</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">res</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">type</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">text/plain</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">res</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">send</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">data</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p><code>koa</code> 通过 <code>generator</code> 和 <code>async/await</code>使用同步的写法来处理异步，明显好于 <code>callback</code> 和 <code>promise</code>。</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">use</span><span style="color:#A6ACCD;">(</span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">ctx</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">next</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">next</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">doReadFile</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">response</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">type</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">text/plain</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">response</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">body</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="谈谈-koa-中洋葱模型的理解" tabindex="-1">谈谈 <code>koa</code> 中洋葱模型的理解 <a class="header-anchor" href="#谈谈-koa-中洋葱模型的理解" aria-label="Permalink to &quot;谈谈 `koa` 中洋葱模型的理解&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><code>Koa</code> 的洋葱模型是以 <code>next()</code> 函数为分割点，先由外到内执行 <code>Request</code> 的逻辑，然后再由内到外执行 <code>Response</code> 的逻辑，这里的 <code>request</code> 的逻辑，我们可以理解为是 <code>next</code> 之前的内容，<code>response</code> 的逻辑是 <code>next</code> 函数之后的内容，也可以说每一个中间件都有两次处理时机。洋葱模型的核心原理主要是借助 <code>compose</code> 方法。为了大家更好的理解什么是洋葱模型。</p></div><p><img src="/blog/interview/koa.jpeg" alt="koa"></p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> Koa </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">koa</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#676E95;font-style:italic;">//Applications</span></span>\n<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> app </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Koa</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#676E95;font-style:italic;">// 中间件1</span></span>\n<span class="line"><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">use</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">ctx</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">next</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">next</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">2</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#676E95;font-style:italic;">// 中间件 2</span></span>\n<span class="line"><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">use</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">ctx</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">next</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">3</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">next</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">4</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#A6ACCD;">app</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">listen</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">7000</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">0.0.0.0</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">`</span><span style="color:#C3E88D;">Server is starting</span><span style="color:#89DDFF;">`</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#676E95;font-style:italic;">// 中间件的打印顺序是1 -&gt; 3 -&gt; 4 -&gt; 2</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><details class="details custom-block"><summary>洋葱圈核心 <code>compose</code> 方法</summary><p><code>compose</code> 方法是洋葱模型的核心，<code>compose</code> 方法中有一个 <code>dispatch</code> 方法，第一次调用的时候，执行的是第一个中间件函数，中间件函数执行的时候就是再次调用 <code>dispatch</code> 函数，也就说形成了一个递归，这就是 <code>next</code> 函数执行的时候会执行下一个中间件的原因，因此形成了一个洋葱模型。</p><div class="language-js line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">compose</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">middleware</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">context</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">next</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// last called middleware #</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">index</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 一开始的时候传入为 0，后续会递增</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">dispatch</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">dispatch</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">i</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 假如没有递增，则说明执行了多次</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">index</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">reject</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Error</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">next() called multiple times</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">))</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">index</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">i</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 拿到当前的中间件</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">middleware</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">middleware</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length</span><span style="color:#F07178;">) </span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">next</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 当 fn 为空的时候，就会开始执行 next() 后面部分的代码</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 执行中间件，留意这两个参数，都是中间件的传参，第一个是上下文，第二个是 next 函数</span></span>\n<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">// 也就是说执行 next 的时候也就是调用 dispatch 函数的时候</span></span>\n<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#F07178;">(</span><span style="color:#82AAFF;">fn</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">context</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">dispatch</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">bind</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">null,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)))</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">err</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>\n<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">reject</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">err</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">};</span></span>\n<span class="line"><span style="color:#89DDFF;">}</span></span>\n<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div></details>',20)];const c=s(o,[["render",function(s,l,p,o,c,t){return n(),a("div",null,e)}]]);export{p as __pageData,c as default};

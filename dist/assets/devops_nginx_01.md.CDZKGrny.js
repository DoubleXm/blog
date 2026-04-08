import{_ as i,n as a,v as n,ac as l}from"./chunks/framework.DFVDdn94.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"devops/nginx/01.md","filePath":"devops/nginx/01.md","lastUpdated":1773326767000}'),p={name:"devops/nginx/01.md"};function h(k,s,t,e,F,r){return n(),a("div",null,s[0]||(s[0]=[l(`<div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>高性能、高稳定性、轻量级开源网页服务器，广泛用作反向代理、负载均衡器和HTTP缓存。</p><p><code>yum install nginx</code></p><p><code>nginx -v</code> 验证</p></div><h2 id="配置文件路径" tabindex="-1">配置文件路径 <a class="header-anchor" href="#配置文件路径" aria-label="Permalink to &quot;配置文件路径&quot;">​</a></h2><table tabindex="0"><thead><tr><th>路径</th><th>用途</th></tr></thead><tbody><tr><td><code>/etc/logrotate.d/nginx</code></td><td>Nginx日志轮转配置</td></tr><tr><td><code>/etc/nginx/</code></td><td>Nginx配置文件目录</td></tr><tr><td><code>/etc/nginx/nginx.conf</code></td><td>Nginx主配置文件，实际使用的文件</td></tr><tr><td><code>/etc/nginx/nginx.conf.default</code></td><td>Nginx默认主配置文件，用于备份被覆盖</td></tr><tr><td><code>/etc/nginx/conf.d/</code></td><td>Nginx虚拟主机配置目录</td></tr><tr><td><code>/etc/nginx/conf.d/default.conf</code></td><td>Nginx默认虚拟主机配置文件</td></tr><tr><td><code>/etc/nginx/mime.types</code></td><td>Nginx MIME类型配置文件</td></tr><tr><td><code>/var/log/nginx/</code></td><td>Nginx日志目录</td></tr><tr><td><code>/var/cache/nginx/</code></td><td>Nginx缓存目录</td></tr><tr><td><code>/usr/share/nginx/</code></td><td>Nginx默认的HTML文件和模块目录</td></tr></tbody></table><h2 id="常用指令" tabindex="-1">常用指令 <a class="header-anchor" href="#常用指令" aria-label="Permalink to &quot;常用指令&quot;">​</a></h2><table tabindex="0"><thead><tr><th>指令</th><th>用途</th></tr></thead><tbody><tr><td><code>nginx</code></td><td>启动Nginx服务</td></tr><tr><td><code>nginx -s reload</code></td><td>重新加载Nginx配置</td></tr><tr><td><code>nginx -s stop</code></td><td>停止Nginx服务</td></tr><tr><td><code>nginx -t</code></td><td>测试Nginx配置文件是否正确</td></tr><tr><td><code>nginx -v</code></td><td>显示Nginx版本信息</td></tr><tr><td><code>nginx -V</code></td><td>显示Nginx版本和编译参数信息</td></tr><tr><td><code>nginx -c [配置文件路径]</code></td><td>使用指定的配置文件启动Nginx服务</td></tr></tbody></table><h2 id="配置文件" tabindex="-1">配置文件 <a class="header-anchor" href="#配置文件" aria-label="Permalink to &quot;配置文件&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-dark-default github-light vp-code" tabindex="0"><code><span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 全局块（main） - 影响 Nginx 服务器整体的运行</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 指定运行 Nginx 的工作进程数。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># auto 表示自动检测 CPU 核心数，通常设置为等于 CPU 核心数（例如 4 核设置为 4）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 作用：充分利用 CPU 多核处理能力，提高并发性能。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">worker_processes</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> auto</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 绑定工作进程到特定的 CPU 上，避免进程在 CPU 间切换带来的性能损耗。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 作用：优化 CPU 缓存命中率，提升性能（高级调优，通常保持注释）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># worker_cpu_affinity auto;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 指定 Nginx 主进程的 PID（进程 ID）存放路径。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 作用：系统通过这个文件找到 Nginx 进程并进行管理（如重启、停止）。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">pid</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /run/nginx.pid</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 指定错误日志的级别和存放路径。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 日志级别可选：debug | info | notice | warn | error | crit | alert | emerg。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 作用：记录服务器运行中的问题，级别越低（如 debug）记录越详细，生产环境建议 warn 或 error。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">error_log</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /var/log/nginx/error.log</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> warn</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 加载额外的配置文件，通常用于引入模块或包含其他站点的配置。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 作用：实现模块化配置，便于管理多个网站或应用。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">include</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /etc/nginx/modules-enabled/</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">*</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;">.conf</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 事件块（events） - 主要影响网络连接的处理</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">events</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 设置单个工作进程可以同时打开的最大连接数。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：决定了 Nginx 的总体最大并发数（max_clients = worker_processes * worker_connections）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 注意：受限于系统文件描述符的限制（可通过 ulimit -n 查看）。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    worker_connections</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 1024</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 告诉 Nginx 一次性地接受所有新连接，而不是一个一个地接受。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：在高并发场景下减少系统中断次数，提高连接建立的效率。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    multi_accept</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 指定使用哪种事件驱动模型。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 通常 Linux 系统推荐使用 epoll（高效），Nginx 会自动选择最优方式，一般无需显式设置。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # use epoll;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># HTTP 块（http） - 核心配置，处理 Web 服务的通用规则</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">http</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # ========== 基础设置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 引入 MIME 类型文件。MIME 类型告诉浏览器如何处理不同类型的文件（如 text/html, image/jpeg）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：确保浏览器能正确解析和渲染文件，而不是直接下载。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    include</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /etc/nginx/mime.types</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 定义默认的 MIME 类型，当文件后缀无法匹配时使用。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：防止未知文件类型被当作文本直接输出，提高安全性。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    default_type</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> application/octet-stream</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 定义日志格式（log_format），用于 access_log。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # main 是这种格式的名称，可以在后续的 access_log 指令中引用。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：记录客户端的访问信息，便于分析流量、排查问题。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    log_format</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> main</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> &#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">                    &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">                    &#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 指定访问日志的存放路径，并使用上面定义的 main 格式进行记录。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：记录所有客户端对 Nginx 的访问情况。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    access_log</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /var/log/nginx/access.log</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> main</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 启用高效文件传输模式。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：让内核直接在文件系统和网络 socket 之间传输数据，避免数据在内核空间和用户空间之间拷贝，提高大文件传输性能。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    sendfile</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 在 sendfile 开启的情况下，优化数据包的发送。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：尽量在一个数据包中发送完整的响应头和数据，减少网络传输次数（通常用于大文件下载）。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    tcp_nopush</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 禁用 Nagle 算法（一种减少小数据包数量的算法）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：对于需要实时响应的应用（如 API、小图片），立即发送数据包，减少延迟。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    tcp_nodelay</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # ========== 连接与超时设置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 保持连接的超时时间（秒）。客户端在这个时间内可以复用同一个 TCP 连接发送多个请求。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：减少建立 TCP 连接的三次握手开销，提高性能。数值不宜过大，避免占用过多连接资源。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    keepalive_timeout</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 65</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 客户端请求头的超时时间。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：如果客户端在这个时间内没有发送完整的请求头，Nginx 将返回 408 错误。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    client_header_timeout</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 60</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 客户端请求体的超时时间。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：如果两次读取操作间隔超过这个时间，Nginx 将中断连接。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    client_body_timeout</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 60</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # ========== 文件缓存设置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 设置存储有关打开文件信息的缓存（如文件名、文件大小、修改时间等）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # max: 缓存最大元素数量; inactive: 如果文件在 60 秒内未被访问，则从缓存中删除。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：减少系统调用（open, stat），提高访问静态文件的性能。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    open_file_cache</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> max=</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">1000</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> inactive=60s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 在 open_file_cache 中，检查缓存元素有效性的时间间隔。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    open_file_cache_valid</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 60s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 在 inactive 指定的时间内，文件被访问的最少次数，少于这个次数则从缓存中移除。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    open_file_cache_min_uses</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 2</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 是否在查找文件出错时（如找不到文件）也缓存错误信息。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    open_file_cache_errors</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # ========== Gzip 压缩设置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 启用 Gzip 压缩。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：对响应内容进行压缩，减少传输体积，加快页面加载速度，节省带宽。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    gzip</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 设置进行压缩的最小文件大小（小于此值的不压缩，因为压缩效果不明显且浪费 CPU）。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    gzip_min_length</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 1k</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 设置压缩级别（1-9），1 速度最快压缩比最低，9 速度最慢压缩比最高。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 建议 4-6 之间平衡 CPU 和带宽。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    gzip_comp_level</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 6</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 指定对哪些 MIME 类型的响应进行压缩。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    gzip_types</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> text/plain</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> text/css</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> text/xml</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> application/javascript</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> application/json</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> application/xml+rss</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> application/atom+xtext</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> image/svg+xml</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 是否在响应头中添加 &quot;Vary: Accept-Encoding&quot;，告诉缓存服务器根据编码类型缓存不同版本。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    gzip_vary</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 禁用对某些老旧的浏览器（如 IE6）进行压缩，避免兼容性问题。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    gzip_disable</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> &quot;msie6&quot;</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # ========== 负载均衡配置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 定义一个上游服务器组（后端服务器集群），用于负载均衡。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 作用：将请求分发到多台后端服务器，提高系统可用性和处理能力。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    upstream</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> backend_servers</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 负载均衡策略：默认是轮询（round-robin）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 其他策略：ip_hash（根据 IP 保持会话）、least_conn（最少连接数）。</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 定义后端服务器地址。可以带权重（weight），weight 越大分配的请求越多。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        server</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 192.168.1.10:8080</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> weight=</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">3</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> max_fails=</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">3</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> fail_timeout=30s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        server</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 192.168.1.11:8080</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> weight=</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">2</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> max_fails=</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">3</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> fail_timeout=30s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        server</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 192.168.1.12:8080</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> backup</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;  </span><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 标记为备份服务器，当主服务器全部不可用时启用</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # ========== 虚拟主机（Server 块）配置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 一个 http 块中可以包含多个 server 块，每个 server 块代表一个虚拟主机（站点）。</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">    </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 第一个 Server 块：重定向 HTTP 到 HTTPS（强制加密）</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    server</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 监听 80 端口（默认 HTTP 端口）。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        listen</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 80</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 监听 IPv6 的 80 端口。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        listen</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> [::]:80;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 定义该虚拟主机的域名。可以写多个，用空格分隔。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        server_name</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> example.com</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> www.example.com</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 将所有 HTTP 请求重定向到 HTTPS 版本。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 作用：强制全站加密，提高安全性。</span></span>
<span class="line"><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">        return</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 301</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> https://</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">$server_name$request_uri;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 第二个 Server 块：处理 HTTPS 请求（主要站点）</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">    server</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 监听 443 端口（默认 HTTPS 端口），并启用 SSL。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        listen</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 443</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> ssl</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> http2</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        listen</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> [::]:443 ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 定义站点域名。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        server_name</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> example.com</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> www.example.com</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== SSL/TLS 证书配置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 指定 SSL 证书文件的路径（公钥）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 作用：用于向客户端证明服务器的身份，并建立加密通道。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        ssl_certificate</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /etc/nginx/ssl/example.com.crt</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 指定 SSL 证书密钥文件的路径（私钥）。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 作用：服务器端解密数据使用，需妥善保管。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        ssl_certificate_key</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /etc/nginx/ssl/example.com.key</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # SSL 会话缓存，用于复用 SSL 会话，减少握手开销。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        ssl_session_cache</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> shared:SSL:10m</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        ssl_session_timeout</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 10m</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== 网站根目录与默认文件 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 定义网站文件的根目录。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 作用：告诉 Nginx 到哪里寻找请求的文件。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        root</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /var/www/example.com/html</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 定义默认首页文件（目录索引文件），按顺序查找。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 作用：当访问域名（如 example.com/）时，自动返回 index.html 或 index.htm。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        index</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> index.html</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> index.htm</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== 请求处理规则（location 块） ==========</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 根路径匹配（/）</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 尝试按照顺序查找文件：</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # $uri 直接查找文件；</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # $uri/ 将请求作为目录处理，尝试查找目录下的索引文件（由 index 指令定义）；</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 如果都找不到，则返回 404。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 作用：优雅地处理静态文件请求。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            try_files</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> $uri $uri</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;">/</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> =</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">404</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 处理 PHP 动态请求（将请求代理到 PHP-FPM）</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> ~</span><span style="--shiki-dark:#FF7B72;--shiki-light:#005CC5;"> \\.</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;">php</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">$ </span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;">{</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 包含 FastCGI 的常用参数配置。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            include</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> fastcgi_params</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 设置 FastCGI 请求的脚本路径。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            fastcgi_param</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> SCRIPT_FILENAME</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> $document_root$fastcgi_script_name;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 将 PHP 请求转发到 PHP-FPM 监听的地址（unix socket 或 tcp 端口）。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            fastcgi_pass</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> unix:/var/run/php/php7.4-fpm.sock</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # fastcgi_pass 127.0.0.1:9000;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 设置 FastCGI 超时时间。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            fastcgi_read_timeout</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 300</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 处理图片等静态文件，设置浏览器缓存过期时间</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> ~</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;">*</span><span style="--shiki-dark:#FF7B72;--shiki-light:#005CC5;"> \\.</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">(</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">jpg</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">jpeg</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">png</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">gif</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">ico</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">css</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">js</span><span style="--shiki-dark:#FF7B72;--shiki-light:#D73A49;">|</span><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">svg</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">)$ </span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;">{</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 作用：对于不常变化的静态资源，设置较长的缓存时间，减少请求量，加快重复访问速度。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            expires</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 30d</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 关闭访问日志，因为静态文件请求量大，记录日志会浪费磁盘 IO。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            access_log</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> off</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 增加响应头，标记文件类型，提高安全性。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            add_header</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> Cache-Control</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> &quot;public, immutable&quot;</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 禁止访问隐藏文件（以 . 开头的文件，如 .htaccess, .git）</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> ~</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /</span><span style="--shiki-dark:#FF7B72;--shiki-light:#005CC5;">\\.</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 作用：防止敏感配置文件被外部直接访问，增强安全性。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            deny</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> all</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            access_log</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> off</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            log_not_found</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> off</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== 错误页面配置 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 自定义错误页面。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 作用：当发生指定 HTTP 错误时，显示自定义的友好页面，而不是 Nginx 的默认错误页。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        error_page</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 404</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /404.html</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> =</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /404.html</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 内部重定向到 404 页面时，使用站点根目录下的 404.html。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            root</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /var/www/example.com/html</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            internal</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;  </span><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 表示这个 location 只能被内部重定向访问，外部不能直接访问这个 URL</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        error_page</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 500</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 502</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 503</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 504</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /50x.html</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> =</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /50x.html</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            root</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /var/www/example.com/html</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            internal</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== 代理配置示例 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 将以 /api/ 开头的请求反向代理到后端服务器</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /api/</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 将请求转发到上面定义的 upstream 组（backend_servers）进行负载均衡。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_pass</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> http://backend_servers</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 设置代理请求头，将客户端的原始信息传递给后端服务器。</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_set_header</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> Host</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> $host;                      </span><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 传递原始 Host 头</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_set_header</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> X-Real-IP</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> $remote_addr;          </span><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 传递客户端真实 IP</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_set_header</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> X-Forwarded-For</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> $proxy_add_x_forwarded_for; </span><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 传递完整的 IP 链</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_set_header</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> X-Forwarded-Proto</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;"> $scheme;       </span><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># 传递原始协议（http 或 https）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 代理超时设置</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_connect_timeout</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 60s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_send_timeout</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 60s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_read_timeout</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 60s</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 启用缓冲，提高性能</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_buffering</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> on</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_buffer_size</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 4k</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_buffers</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 8</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 4k</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_busy_buffers_size</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 8k</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 禁用重定向（如果需要后端返回重定向时进行修改，可以开启）</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # proxy_redirect off;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== 访问控制示例 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 限制对 admin 目录的访问，仅允许特定 IP</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /admin/</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 允许的 IP 地址</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            allow</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> 192.168.1.0/24</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            allow</span><span style="--shiki-dark:#79C0FF;--shiki-light:#005CC5;"> 10.0.0.1</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 拒绝所有其他 IP</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            deny</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> all</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 如果通过访问控制，则代理到后端应用</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            proxy_pass</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> http://backend_servers/admin/</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # ========== 速率限制示例 ==========</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 在 http 块中通常会定义限制区域（这里仅为示例，实际应放在 http 块内）</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # limit_req_zone $binary_remote_addr zone=login_limit:10m rate=1r/s;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">        # 对登录接口应用速率限制</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">        location</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /login.html</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 引用名为 login_limit 的限制区域，每秒允许 1 个请求，突发不超过 5 个。</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # limit_req zone=login_limit burst=5 nodelay;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">            </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">            # 处理登录的逻辑...</span></span>
<span class="line"><span style="--shiki-dark:#FFA657;--shiki-light:#6F42C1;">            root</span><span style="--shiki-dark:#A5D6FF;--shiki-light:#032F62;"> /var/www/example.com/html</span><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">;</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">        }</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # 可以在这里继续添加其他 server 块，用于不同的域名或端口</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # server {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    #     listen 80;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    #     server_name another-domain.com;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    #     root /var/www/another-domain;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    #     ...</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">    # }</span></span>
<span class="line"><span style="--shiki-dark:#E6EDF3;--shiki-light:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># Mail 块（可选）- 用于配置邮件代理（如 IMAP、POP3 代理）</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># ============================================</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#mail {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    # See sample authentication script at:</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    # auth_http localhost/auth.php;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    # pop3_capabilities &quot;TOP&quot; &quot;USER&quot;;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    # imap_capabilities &quot;IMAP4rev1&quot; &quot;UIDPLUS&quot;;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    server {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#        listen     localhost:110;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#        protocol   pop3;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#        proxy      on;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    }</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;"># </span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    server {</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#        listen     localhost:143;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#        protocol   imap;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#        proxy      on;</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#    }</span></span>
<span class="line"><span style="--shiki-dark:#8B949E;--shiki-light:#6A737D;">#}</span></span></code></pre></div>`,7)]))}const y=i(p,[["render",h]]);export{g as __pageData,y as default};

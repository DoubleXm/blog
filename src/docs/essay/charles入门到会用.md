## 介绍、安装及破解

`Charles` 是 `http` 代理工具。可以监控机器与互联网通信的过程，拿到其通信数据。在移动端的开发及测试领域尝尝能看到它的身影。[安装地址](https://www.charlesproxy.com/download/)

**注：后续所有内容均以 mac 系统为例**

需要注意的是 `Charles` 是付费软件，下载后可免费使用 30 天。[付费地址](https://www.charlesproxy.com/buy/)

如果你囊中羞涩，可以考虑使用破解版。[破解地址](https://www.zzzmode.com/mytools/charles/)

破解方式为：导航栏中 `Help -> Registered to charles` 输入对应的内容即出现如下提示，告诉你注册成功，关闭重新启动一下。

![charles1](/essay/charles1.png)

## SSL 配置与证书安装

默认情况下 `Charles` 之后拦截 `http` 的请求，对于加密请求无法进行拦截。这时就需要**修改 `Charles`的配置以及添加证书**让其对加密请求进行支持。

### SSL 配置

配置 `Proxy` 分为三步

- 导航栏中 `Proxy -> SSL Proxy Settings` 增加如下配置；配置 `SSL` 相关的内容。

![charles2](/essay/charles2.jpg)

- 导航栏中 `Proxy -> Proxy Settings` 增加如下配置；配置关于协议的内容。

![charles3](/essay/charles3.jpg)

- 导航栏中 `Proxy -> Recording Settings` 增加如下配置；只有匹配下面的内容才会被记录在 `Charles` 中。

![charles4](/essay/charles4.jpg)

### 证书安装

导航栏中 `Help -> SSL Proxying -> Install Charles Root Certificate` 点击后会弹出钥匙串，在钥匙串中搜索 `Charles Proxy CA` 点击证书选择使用信任。

## Chrome 抓包

`Chrome` 需要安装 `SwitchyOmega` 插件。[插件地址](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif/related?hl=zh-CN)

`SwitchyOmega` 可以帮助用户管理和切换代理。具体使用方法不在本文中赘述，只演示如何配置及关键性操作。

新增名为 `Charles` 的情景模式，并配置如下内容：

![charles5](/essay/charles5.jpg)

在 `auto switch` 中添加条件，并且将情景模式选择为 `Charles`，然后点击应用选项。具体效果如下：

![charles6](/essay/charles6.jpg)

最后开启插件启用规则 `Charles` 或 `auto switch` 再开启抓包工具即可完成浏览器的抓包。具体效果如下：

![charles7](/essay/charles7.jpg)

## Mobile 抓包

移动端的抓包整体需要两步配置：

- 移动端需要安装证书
- 保证 `PC` 与 `Mobile` 处于同一网段下（连接同一个 `WIFI`）

### Android

`Android 7.0` 之后 `Google` 推出了更加严格的安全机制，默认不信任用户的安装的证书，这也导致了对于 `https` 加密的请求，不再可以抓取了。

解决方案主流的大致分为两种：

- 既然不支持用户的 `CA` 证书，可以安装系统级别 `CA` 证书，但前提设备必须为 `root` 模式。
- 如果是自己公司研发的产品可以在 `AndroidManifest` 中配置 `networkSecurityConfig` 具体不再这里演示。

以小米手机为例进行抓包配置，示例如下：

![charles8](/essay/charles8.jpg)

打开手机浏览器输入 `chls.pro/ssl` 即会下载 `CA` 证书，下载完成后进行安装即可。

如果手机浏览器失败可以尝试使用 `PC` 重复次操作即会得到 `charles-proxy-ssl-proxying-certificate.pem` 证书，将此证书传入手机进行安装即可。

### iPhone

`iPhone` 的抓包与 `android` 基本类似，打开 `Charles` 保存在同一局域网下，先设置手机的代理，具体配置如下：

![charles9](/essay/charles9.jpg)

`Safari` 中输入内容 `chls.pro/ssl` 下载安装证书，最后在关于本机中信任此证书即可。

## 模拟网络延迟（弱网测试）

导航栏中 `Throttle Settings` 点击后出现窗口，开启后使用预设配置或者自定义配置，点击 `ok` 即开启网络模拟。具体效果如下：

![charles10](/essay/charles10.jpg)

## 篡改请求信息

修改请求的方式分为三种，`Compose`、`Rewrite`、`BreakPoint`

### Compose

该方法只能只能修改 `url`、`method`、`params`。作用域仅限于 `Charles` 中，修改后即会重新发送一个请求，用来验证结果。

选中指定的请求，右键 `-> Compose`，具体使用及效果如下：

![charles11](/essay/charles11.jpg)

### Rewrite

该方法除了 `Request Body` 不能修改，其余都支持修改。该配置开启后，后续被代理宿主机的任何请求只要符合该条件都会被修改。

导航栏 `Tools -> Rewrite Settings`，配置窗口如下：

![charles12](/essay/charles12.jpg)
![charles13](/essay/charles13.jpg)
![charles14](/essay/charles14.jpg)

### BreakPoint

该方法值比较主流的修改请求方案，效果为拦截请求的响应，当你修改后再去给请求放行，不过页面有可能因为请求一直得不到回复导致崩溃。

选中指定请求，右键 `-> Breakpoints` 即开启断点，每次经过这个请求就会进行拦截。关闭断点的方式则需要点击 **工具栏中的六边形** 效果如下：

![charles15](/essay/charles15.jpg)

一个 `http` 请求共需要放行四次，分别为 `Request Header`、`Request Body`、`Response Header`、`Response Body`；内容可以直接进行修改。

**注意：** 直接右键是严格匹配的断点，如果请求每次参数都会变化，很可能会导致无法命中断点。在导航栏 `Proxy -> Breakpoints Settings` 中可以针对断点进行配置。

![charles16](/essay/charles16.jpg)



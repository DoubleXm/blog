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

### Android

### Iphone

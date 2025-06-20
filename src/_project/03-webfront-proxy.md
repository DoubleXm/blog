# 基于 whistle + SwitchyOmega 的前端代理方案

> [!NOTE]
> &emsp; 在目前的前端开发过程中，虽然有 `vite` `webpack` 等工具可以启动服务便于本地调试。或者更改 `api` 地址达到直接用测试或生产数据进行调试。
> 
> &emsp; 但是，由于各种各样的依赖问题导致，更改环境也不能保证项目在本地的正常运行（比如基于 `cookie` 鉴权）。又或者在微前端的子应用调整的时候不想频繁的启动主应用。
>
> &emsp; 该代理的方案就是让用户在本地调试的时候，浏览器上虽然是测试环境的域名，但是本地修改代码的效果可以直接展示到浏览器上。方便 `bug` 的复现与修改。

## 安装 & 配置 whistle

[地址](https://github.com/avwo/whistle) 安装方式两种，`npm` 和 `brew`。我选择了后者

```bash:no-line-numbers
brew install whistle
```

成功之后入 `w2 start` 启动 `whistle`。默认占用端口为 `8899`

![alt text](/_project/01.png)

打开链接进入控制台注意以下两处

- 点击侧边栏 `rules` 添加规则，以图为例，本地为 `vite` 项目前面为测试环境域名。
- 点击顶栏 `https` 下载证书，然后将证书安装到钥匙串中，然后信任证书（仅针对 MacOS 系统）。

![alt text](/_project/02.png)

## 安装 & 配置 SwitchyOmega

`SwitchyOmega` 是一款浏览器插件，最近好像是由于安全问题不能直接在 chrome 插件商店下载了。[地址](https://github.com/FelisCatus/SwitchyOmega/releases) 选择 `.crx` 文件安装。

`.crx` 大概率不能直接安装，不过也有其他方案。手动修改后缀为 `.zip` 然后再进行解压（有意思的是手动解压的时候还给我报错了，然后通过 `unzip` 又可以解压成功了）。

```bash:no-line-numbers
unzip SwitchyOmega_Chromium.zip -d SwitchyOmega
```

安装完成之后，点击插件的选项 - 新建**代理服务器**的情景模式 - 将代理服务器设置为 `127.0.0.1` 端口为 `8899` 即可。不经过代理的域名可以设置为空，或者按照自己的需求设置。

![alt text](/project/03.png)

当不适用时就使用系统代理或者直接连接，使用时选择对应的情景模式即可。

## 项目调整

这一步大概率之前就弄过，顺道提一下吧。以 `vite` 项目为例，增加 `env.test` 文件，配置测试环境 api 地址。

```bash :no-line-numbers
VITE_GATEWAY_ORIGIN=//gateway.test.api
```

在 `package.json` 中增加 `test` 命令，内容为 `"test": "vite build --mode test"`。

## 结束语

至此就可以在本地启动项目，进入验证阶段了。唯一不足的就是每次修改代码后都要刷新浏览器也可以看到最新的效果。

`whistle` 的功能也不仅如此，可以用来抓包，修改请求，修改响应等。
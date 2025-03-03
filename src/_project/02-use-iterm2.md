---
isTimeLine: true
title: iTerm2 + Oh-my-zh + p10k 终端美化
description: iTerm2是终端的替代品，iTerm2将终端带入了现代时代，拥有你从未想过的一直想要的功能。
date: 2024-06-04
sticky: 1
tags:
 - 工具
---

# iTerm2 + Oh-my-zh + p10k 终端美化

![08](/essay/iterm2/iterm08.png)

## iterm2 下载

[打开链接](https://iterm2.com/) 下载后解压即可。

### iterm2 设置

3.5.0 版本之后点击当前命令执行块会高亮边缘地区，这一点是很恶心的； Settings -> General -> Selection ...

![01](/essay/iterm2/iterm01.png)

透明色，模糊，背景图，默认宽高设置 Settings -> Profiles -> Windows

![02](/essay/iterm2/iterm02.png)

命令行背景色设置 Settings -> Profiles -> Colors

![03](/essay/iterm2/iterm03.png)

状态栏设置 Settings -> Profiles -> Session

![04](/essay/iterm2/iterm04.png)

## oh-my-zsh 下载

在[仓库](https://github.com/ohmyzsh/ohmyzsh) 中找到下载脚本，或者执行以下内容。

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### zsh-syntax-highlighting 语法高亮插件

[仓库](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md) 中找到下载脚本，或者执行以下内容。

```
brew install zsh-syntax-highlighting
echo "source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc

# 更新 ~/.zshrc 中插件的配置 
plugins=(git zsh-syntax-highlighting)
```

### zsh-autosuggestions 自动补全命令插件

[仓库](https://github.com/zsh-users/zsh-autosuggestions) 中找到下载脚本，或者执行以下内容。

```
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 更新 ~/.zshrc 中插件的配置
plugins=( 
    # other plugins...
    zsh-autosuggestions
)
```

`source ~/.zshrc` 可能会出现如下错误： `no such file or directory： xxx`；参考 [这个](https://github.com/zsh-users/zsh-autosuggestions/issues/557)可能解决你的问题。

## powerlevel10k

大家都喜欢直接叫 `p10k`，是一个 `zsh` 的主题，用来美化 terminal 窗口；[仓库](https://github.com/romkatv/powerlevel10k?tab=readme-ov-file#meslo-nerd-font-patched-for-powerlevel10k) 中找到下载脚本，或者执行以下内容。

```
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

或者也可以通过 `home brew` 进行下载；

```
brew install powerlevel10k
echo "source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme" >>~/.zshrc
```

`brew`下载可能会报错，按照提示执行 `xcode-select --install` 即可

```
Error: No developer tools installed.
Install the Command Line Tools:
  xcode-select --install
```

### p10k 配置

在 `~/.zshrc` 中设置 `ZSH_THEME="powerlevel10k/powerlevel10k"`，默认的 theme 是怎么忘记了；然后执行 `source ~/.zshrc` 生效修改的配置；随后即会出现配置命令行的提示；

一、提示下载字体，选择 `y`，可能会有点慢，下载完成后 `command + q` 关闭 terminal 重新启动；可以直接去 github 下载字体安装；[地址](https://github.com/ryanoasis/nerd-fonts/releases) 找到最新的 Hack.zip 下载后解压双击即可；这里就不用选择 `y` 了；

![05](/essay/iterm2/iterm05.png)

下载完字体，使用 vscode 的同学需要把 vscode 的终端字体与 iterm2 保持一致。

![06](/essay/iterm2/iterm06.png)

二、后面几步基本就是问你是否能看到图标、样式要什么样子的等等... 看着选就好了

## 结语

经过以上操作，terminal 的外观已经焕然一新了，当然大家如果喜欢折腾，相信还会有更好的方案；最终附上效果图

![07](/essay/iterm2/iterm07.png)
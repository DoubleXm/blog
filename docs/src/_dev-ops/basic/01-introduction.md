---
isTimeLine: true
title: Linux 基础学习
description: Linux 基础学习
date: 2024-06-17
tags:
 - Linux
sticky: 1
---

## Shell 简介

单词本意为 **壳子**, 可以理解为包裹机器的一层壳, 其主要就是提供人机交互之间的桥梁, 本质上是一个命令解释器; 不得不提的还有 **shell script**, 是一种为 `shell` 编写的程序; 你需要知道 `shell` `shell script` 是两个完全不同的东西;

大多数 `Linux` 系统中都会默认包含多个 `shell`。

像 `RHEL` 系统默认提供的就是 `GUN Bourne-Aggin Shell (bash)`, 俗称 `bash shell`; `Ubuntu` 默认也是 `bash shell`。

```shell
# 查看当前使用哪种 shell
echo $BASH 
echo $SHELL

# 查看系统中安装了哪些 shell
cat /etc/shells
```

常见的 `shell` 包括

- **`csh`**: 是由柏克莱大学的 `Bill Joy` 设计的, 这个 `shell` 的语法有点类似 C语言，所以才得名为 `C shell`, 简称为 `csh`;

- **`bash`**: `GNU` 组织开发, 是各种 `Linux` 发行版默认配置的 `shell`。

- **`zsh`**: 大多数人的 `mac` 用的都是 `zsh`, 很大一方面原因就是都安装了 `oh-my-zsh`; 

总结: `zsh` 基本兼容 `bash`, 本质上 `zsh` 和 `bash` 都是解释器, 服务的目标是 `shell`; 因此命令语法上基本相同。

### shell 指令结构

```shell
# 指令 [选项] [参数]
# 选项: - 开头, 起到修饰作用, 多个选项可以合并; 比如 ls -l -a 等价于 ls -la
# 参数: 目标, 比如 ls -la /opt, 表示显示 /opt 下面的目录和文件

# 指令 | 指令
# |: 管道符, 表示后面一个命令的操作目标是前面命令的返回结果, 如 ifconfig | grep 127
```

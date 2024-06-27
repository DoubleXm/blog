---
isTimeLine: true
title: 基础篇：目录及文件指令
description: Linux 基础学习
date: 2024-06-25
tags:
 - Linux
sticky: 1
---

# 基础篇：目录及文件指令

## 目录操作指令

### pwd 查看当前目录路径

```shell
pwd [options]
```
- `-L`：`--logical` 打印环境变量 `$PWD` 的值，可能为软连接，如果是软连接目录，则输出真实目录
- `-P`：`--physical` 默认值，打印当前工作目录的物理位置，如果是软连接目录，则输出软连接路径
- `--help`：显示帮助信息并退出
- `--version`：显示版本信息并退出

### cd 切换目录

```shell
cd [-L|-P] [dir]
```
- `-L`：默认值，如果要切换的目标目录是一个软连接，就切换到软连接的目录
- `-P`：如果要切换的目标目录是一个软连接目录，就切换到对应的物理目录

### ls 显示目录内容

- `-l`：长格式显示
- `-a`：显示所有文件，包括隐藏文件
- `-h`：将文件的大小加上单位

```shell
root@localhost:/# ls -la
# 权限       引用计数 所有者 所属组      大小   文件修改时间  文件名
# drwxr-xr-x   3    root  root       4096 Dec 13  2023 boot
```
引用计数：如果是文件表示该文件的硬链接个数，如果是目录该目录的一级子目录个数

### mkdir 创建目录

```shell
mkdir [-p] 要创建的目录
```

`-p`：直接将所需要的目录（包含上一级目录递归创建）

```shell
# 示例
mkdir test
mkdir -p test/child-test
```

### rmdir 删除目录

只能删除空目录，一般删除文件或者目录都会使用 `rm` 指令

```shell
rmdir test
```
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

## 文件操作指令

### touch 创建文件

> touch 用于修改文件或目录的时间属性，如果文件不存在则创建新的文件

```shell
touch [OPTION] ... FILE ...
```

```shell
# 创建文件
touch demo.log

# 修改文件或者目录的末次访问时间（touch 已经存在的目录或者文件）
# 并不会修改目录内，或者文件的内容
touch test
touch test.log

# 创建多个文件
touch test.log test1.log test2.log
```

### cp 复制指令

> 拷贝文件或者目录

```shell
cp [OPTIONS] 文件1 备份文件名称
cp [OPTIONS] 文件1 文件2 ... 目录
```

`-r`：recursive 递归备份目标目录的内容

```shell
# 复制 test 内容到 test1
cp test.text test1.text

# 复制 多个文件到 /tmp 目录
cp test.text test1.test /tmp

# 递归复制整个文件夹
cp -r abc /tmp
```

### mv 移动剪切

> 移动或者剪切文件及目录，也可以给文件或目录重命名

```shell
mv 旧文件名 新文件名
mv 被移动目录 目标目录
```

```shell
# 将 a 文件修改为 c 文件
mv a.log c.log
# 将 a 文件剪切至 /tmp 下
mv a.log /tmp/a.log

# 将 /tmp 下的 a 目录剪切至 /test 下的 a 目录
mv /tmp/a /test/a
```

### rm 移除文件或目录

```shell
rm [OPTIONS] 文件或目录
```

`-r`：force 忽略不存在的文件，不会出现警告信息；

`-f`：递归删除，最常用在目录的删除了！这是非常危险的选项！！！

`-i`：互动模式，在删除前会询问使用者是否动作

```shell
rm -rf test
```

## 查看文件指令

### cat 查看文件所有内容

```shell
cat [OPTIONS] FILE
```

`-n`：显示行号

`-b`：number-noblank 显示行号，空白行不显示行号

### more 显示一页文件内容

```shell
more [OPTIONS] FILE [...]
```

`-NUM`：指定每屏显示的行数

`+/STRING`：从匹配搜索字符串 STRING 所在行的前两行显示内容

`+NUM`：从文件第 NUM 行开始显示内容

> 交互指令
>
> 回车键：向下滚动一行
>
> 空格键：显示下一页
>
> b：back 回退到上一页
>
> q：退出

### less 显示一页文件内容

不会加载整个文件，性能比较好。

```shell
less [OPTIONS] FILE
```

`-N`：显示行号

`-m`：显示百分比

| 搜索        |      用法      | 
| ------------- | :-----------: |
| `/string`      | 搜索内容（有高亮） |
| `n`      | 向下搜索内容，跳到下一个被检索的内容 |
| `shift + n`      | 向上搜索，跳到上一个被检索的内容  |

> 交互指令与 more 相同

### head 查看文件开头内容

默认情况下显示前 10 行内容；

```shell
head [OPTIONS] FILE
```

`-c [number]`：bytes 显示文件的前 number 字节内容；
`-n [number]`：lines 显示文件的前 number 行内容；

```shell
# 查看前 10 行内容
head a.log
# 查看前 20 字节内容
head -c 20 a.log
# 查看前 20 行内容
head -n 20 a.log
```

### tail 查看文件尾部内容

默认情况下显示末尾 10 行内容；

```shell
tail [OPTIONS] FILE
```

`-f`：按照指定时间间隔输出文件追加的内容
`-n`：输出最后 N 行，不是默认的 10 行

```shell
# 查看文件末尾 10 行
tail a.log
# 查看文件最后 20 行
tail -n 20 a.log
# 查看文件从 10 行以后的内容
tail -n +10 a.log
# 动态追踪文件
tail -f a.log

# 追踪文件 10 行以后的内容（包含10行）
tail -fn +10 a.log
```
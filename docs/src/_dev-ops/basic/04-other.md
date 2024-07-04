---
isTimeLine: true
title: 基础篇：其他指令
description: Linux 基础学习
date: 2024-06-25
tags:
 - Linux
sticky: 1
---

# 基础篇：其他指令

### date 日期时间

| 指令        |      作用      | 
| ------------- | :-----------: |
| `date`      | 查看当前时间（Unix） |
| `date +%Y`      | 当前年 |
| `date +%m`      | 当前月（本年第几月不到十位补零）  |
| `date +%d`      | 当前天（本月第几天不到十位补零）  |
| `date +%H`      | 当前小时  |
| `date +%M`      | 当前分钟  |
| `date +%S`      | 当前秒  |
| `date '+%Y-%m-%d %H:%M:%S'`      | 格式化输出时间 `2024-07-02 18:29:40` |

设置系统时间

```shell
date -s "2022-05-01 18:12:55"
```

### cal 日历

默认显示当前月的日历

```shell
cal [OPTIONS]
```

```shell
# 当月日历
cal 
# 上，当，下月日历
cal -3
# 年份日历
cal 2024
```

### find 文件/目录搜索

在指定目录下查找文件

```shell
# 不写搜索路径则默认当前目录
find [搜索路径] [选项]
```

| 选项        |      作用      | 
| ------------- | :-----------: |
| `-name`      | 按照文件名称搜索，支持通配符模糊查询 |
| `-iname`      | 与 -name 功能一致，忽略大小写 |
| `-path`      | 查找路径包含范本样式的文件或目录  |
| `-regex`      | 正则搜索  |
| `-iregex`      |  与 -regex 功能一致，忽略大小写 |
| `-size`      |  + 搜索比当前指定大小大的文件 <br> - 搜索比当前指定大小小的文件 <br> c 字节、w 2字节、b 512字节、k千字节、M、G|
| `-uid`      | 查找指定用户 id 的文件 |
| `-user`      | 查看指定用户名的文件  |
| `-gid`      | 查找指定 组id 的文件  |
| `-group`      | 查看指定组名的文件  |
| `-nouser`      | 查找没有所有者的文件  |
| `-empty`      | 查看文件大小 0 的文件  |

```shell
# 查找当前目录下 .text 结尾的文件
find . -iname *.text

# 查看当前目录下包含 nalc 的文件或者目录
find . -path *nalc*

# 查看 size 大于 10M 的文件并且 .bin 结尾
find . -size +10M -iname *.bin
```

### grep 文本搜索

```shell
grep [OPTIONS] [搜索内容] [FILE]
```

| 选项        |      作用      | 
| ------------- | :-----------: |
| `-c`      | 只输出匹配行的计数 |
| `-i`      | 忽略大小写 |
| `-n`      | 输出行号  |
| `-w`      | 显示整个单词  |
| `-r`      | 递归查找目录下的所有文件内容 |

```shell
# 查找文件中包含 proxy 的内容
grep proxy a.log

# 超找文件包含 PROXY 内容输出行号，忽略大小写
grep -in PROXY a.log

# 查找文件包含 proxy 有几行
grep -c proxy a.log

# 查找/usr 下包含 proxy 的内容
grep -r proxy /usr
```

### 重定向输出 > 和 >>

`>`：将输出重定向到文件，并覆盖现有内容，文件不存在则新建

```shell
# 将 var 的目录输出到 var.text 中
ls -la /var > var.text
```

`>>`：将输出附加到文件的末尾

```shell
ls -la /opt >> var.text
```

### 管道 |

连接两个或者多个指令，可以将上一个指令的结果通过行一个指令做进一步的处理

```shell
# 查看 test 下的 .log 文件
ls -la /test | more | grep -i .log
# 过滤进程
ps -ef | grep bash
```

### 逻辑控制 &&

前一个指令执行成功后再执行下一个指令 

```shell
pnpm test && pnpm build && pnpm publish
```

### history 查看历史

列出曾经使用过的指令，默认所有，可以指定数量

```shell
history [n]
```


---
isTimeLine: true
title: 基础篇：打包（归档）、压缩
description: Linux 基础学习
date: 2024-06-25
tags:
 - Linux
sticky: 1
---

# 基础篇：打包（归档）、压缩

### tar 打包、解包

可以将多个目录或者文件，合成一个自定义名称 `.tar`、`.tar.gz`、`.tar.bz2` 结尾的包。


```shell
# 注意 参数不要乱，按照顺序写
tar -[zxcvf] test.tar [FILE | DIR]... -[C] TARGET_DIR/
```

| 指令        |      作用      | 
| ------------- | :-----------: |
| `-j`      | bzip 使用 bzip 压缩和解压缩 |
| `-z`      | gzip 使用 gzip 压缩和解压缩 |
| `-x`      | extract 提取文件，解包 |
| `-c`      | create 生成档案文件，创建打包文件 |
| `-v`      | verbosely 显示打包或解压包的过程 |
| `-f`      | file 指定打包的文件名或压缩包的文件名 .tar 结尾  |
| `-C`      | directory 默认保存在当前目录，-C 指定目录（必须存在的目录）  |

```shell
# 打包目录及文件到 aa.tar
tar -cvf aa.tar a.text aa.text aaa.text aa/
# 解包到 /etc 目录
tar -xvf aa.tar -C /etc/

# 打包目录及文件到 aa.tar.gz
tar -zcvf aa.tar.gz a.text aa.text aaa.text aa/
# 解包到 /opt 目录
tar -zxvf aa.tar.gz -C /opt

# 打包目录及文件到 aa.tar.bz2
tar -jcvf aa.tar.bz2 a.text aa.text aaa.text aa/
# 解包到 /opt 目录
tart -jxvf aa.tar.bz2 -C /opt
```
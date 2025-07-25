
## 目录结构

```:no-line-numbers
/  根
├── bin (*)  	 binary 的缩写，主要存放一些常用的命令。
│                比如 ls,cp,mv 等。软链 /usr/bin
├── sbin	     s 是 super user 的简称，存放系统管理员用到的系统管理程序
│                reboot shutdown等。	软链 /usr/sbin
├── boot  		 主要存放一些 linux 启动时需要用到的核心文件。
├── dev (*)		 device 的缩写，主要存在 linux 的设备文件。
├── etc (*)		 主要存在系统用户所需要的配置文件和子目录。
├── home (*)	 普通用户的家目录。
├── lib (*)		 libary 的缩写，主要存放一些动态库，供应用程序调用。软链 /usr/lib
├── lost+found	一般是空的，当服务器非法关机后，相关文件会存放在此目录。
├── media (*)	 自动挂在一些 linux 系统自动识别的设备。比如 u盘、光驱等。
├── mnt (*)		 临时挂载别的文件系统，比如别的磁盘。
├── opt				 提供给主机额外安装软件目录。	
├── proc    虚拟目录，不占用磁盘空间。系统内存的映射，可以通过访问这个目录获取系统信息。	
├── root (*)	 超级用户的主目录	
├── srv				 存放系统服务启动之后用到的数据。	
├── run				 存放运行时需要用到的文件。	
├── usr (*)		 system resource 存放用户应用程序及文件；
│   ├── bin		 存放系统用户使用的应用程序。
│   ├── sbin	 存放超级用户使用的高级程序及系统守护程序。
│   └── src		 内核源代码默认的放置目录。
├── tmp				 存放临时文件。	
└── var				 存放经常被修改的文件，比如日志、邮件。	
```

## 看一遍就会的指令

### ls 查看目录信息

`ls [ 选项 ] [ 文件或者目录 ]`

- `-a` 显示所有文件，包括隐藏文件
- `-l`  显示详细信息
- `-d`  查看目录本身的属性，并不是查看文件。示例 `ls -d /etc/`
- `-h`  人性化的方式显示文件大小
- `-i`  显示文件的 `inode` 号

示例

```shell :no-line-numbers
ls -lai /etc/
```

### mkdir 创建目录

`mkdir [ 选项 ] 目录名`，默认不能创建多级目录，需要递归创建。

- `-p`  递归创建目录

示例

```shell :no-line-numbers
mkdir -p /tmp/test/a/b/c
```

### rmdir 删除目录

`rmdir [ 选项 ] 目录名`，只能删除空目录

示例

```shell :no-line-numbers
rmdir /test
```

### rm 删除文件、目录

`rm [ 选项 ] 文件或者目录`

- `-r`  递归删除目录
- `-f`  强制删除

示例

```shell :no-line-numbers
rm -rf /tmp/test
```

### touch 创建文件

`touch [ 选项 ] 文件名`

示例

```shell :no-line-numbers
touch a.txt
```

### wc 统计文件内容

`wc [ 选项 ] 文件名`

- `-l`  统计行数
- `-w`  统计单词数
- `-c`  统计字节数
- `-m`  统计字符数

### clear 清屏

或者 `Contrl + l` 可以实现同等效果

### ping 测试网络连通性

```sh :no-line-numbers
ping www.runoob.com
```

### pwd 显示当前目录

### date 显示系统时间

### ifconfig 查看网络信息（ip 地址）

### sudo 以管理员身份执行命令

`sudo [ 选项 ] 命令` 不带参数默认就是 `root` 权限

- `-u`  指定用户

```shell :no-line-numbers
sudo -u root touch /etc/test.txt
```

### ssh 远程连接

```shell :no-line-numbers
# 用户名@主机地址
ssh root@192.168.1.100
```


## 用户管理

### useradd/adduser用户添加

`useradd [ 选项 ] 用户名`

- `-g` 指定用户组
- `-d` 指定用户主目录
- `-r` 创建系统用户

```sh :no-line-numbers
# 添加用户并指定用户组
useradd -g devops test
# 添加用户,指定工作目录
useradd -d /home/test test
# 添加系统用户
useradd -r test
# 添加普通用户
useradd test
```

### userdel 用户删除

`userdel [ 选项 ] 用户名` 默认只删除用户账号，不删除相关文件

- `-r`  删除用户的同时删除用户主目录

### userconf 用户配置

`userconf [ 选项 ]`

- `--addgroup [ 组名 ]`  新增群组
- `--adduser [ 用户 ID ] [ 群组 ] [ 用户名 ]  [ shell ]`  新增用户账号
- `--deluser [ 用户 ID ]` 删除用户账号
- `--delgroup [ 群组 ]` 删除群组

```sh :no-line-numbers
# 添加用户
userconf --adduser 1000 devops username /bin/bash
```

## 用户组管理

### groupadd 组添加

`groupadd [ 选项 ] 组名`

- `-g`  指定组 ID
- `-r`  创建系统组，系统组 Id 小于 500

```shell :no-line-numbers
# 添加运维组并指定组 id
groupadd -g 30 devops
```

### groupdel 组删除

`groupdel 组名`

## 用户登录信息

### whoami 查看当前登录用户

```shell :no-line-numbers
whoami
```

### w 查看登录用户信息

![alt text](/devops/03.png)

- :sewing_needle: `23:24:26 up 40 min` 开机时间
- :sewing_needle: `3 users` 登录用户数
- :sewing_needle: `load average` 平均负载 `0.00, 0.00, 0.00` 1分钟、5分钟、15分钟平均负载
- `USER`  登录用户名
- `TTY`  登录终端 `pts/n` 远程登录
- `FROM`  登录 IP
- `LOGIN@` 登录时间
- `IDLE`  用户空闲时间
- `JCPU`  该终端所有进程占用的时间
- `PCPU`  当前进程占用的时间
- `WHAT`  正在执行的命令

### who 查看登录用户信息

显示登录的用户名、登录的终端以及登录的时间。

![alt text](/devops/04.png)

### last 查看当前和过去登录用户信息

显示登录的用户名、登录的终端、登录的 IP、登录的时间、退出的时间以及在线时间。

![alt text](/devops/05.png)

### lastlog 显示所有用户最近一次登录信息

![alt text](/devops/06.png)

## 指令通配符

| 通配符        |      作用      |
| ------------- | :-----------: |
| `*`      | 匹配 [] 中任意一个字符 |
| `?`      |   匹配任意字符    |
| `[xyz]` |   匹配一个字符   |
| `[a-z]` |   匹配 a-z 中任意一个字符    |
| `[!xyz]` |   不匹配 [] 中任意一个字符    |

<!-- ## 文件权限

![01](/devops/01.png)
![02](/devops/02.png)

``` bash
drwxr-xr-x.  2 root root   4096 4月  11 2018 etc
```

- `.`  ACL 权限
- `2` 硬链接引用计数
- `root` 所有者
- `root` 所有组
- `4096` 文件大小 -->
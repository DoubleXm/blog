<!-- ### man 查看命令帮助信息

**示例** `man ls` -->

## 目录、文件操作

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

### cp 复制文件、目录

`cp [ 选项 ] 源文件 目标文件`，默认覆盖复制文件

- `-r`  递归复制目录
- `-p`  保留源文件的属性
- `-d`  复制目录时保留源目录的属性
- `-a`  相当于 `-pdr`

示例

```shell :no-line-numbers
# 将 /etc 目录复制到 /tmp 目录下
cp -r /etc/ /tmp/
```

### mv 移动修改文件、目录

`mv [ 选项 ] 源文件 目标文件`，同级目录下改名称，不同级目录下移动文件

示例

```shell :no-line-numbers
# 将 /tmp/a.txt 移动到 /tmp/test 目录下
mv /tmp/a.txt /tmp/test/
```

### ln 创建软连接、硬链接

`ln [ 选项 ] 源文件 目标文件`

- `-s`  创建软连接

#### *硬链接*

拥有相同的 `inode` 号，占用相同的磁盘空间，删除源文件，硬链接文件依然存在。不能跨分区，只能操作文件。

示例

```shell :no-line-numbers
ln /etc/passwd /tmp/passwd
```

#### 软连接

类似于 Windows 的快捷方式，拥有独立的 `inode` 号，数据只保存在源文件中，删除源文件，软连接文件失效。

文件权限都是 `777`，修改任意一个文件，另一个文件也会改变。

示例

```shell :no-line-numbers
# 类似与将 /etc/passwd 文件在 /tmp 目录下创建一个快捷方式
ln -s /etc/passwd /tmp/passwd
```

## 目录、文件搜索

### locate 搜索文件

`locate [ 选项 ] 文件名`，该指令可能不存在，需要安装 `mlocate` 软件包 `yum install mlocate`

只能搜索文件名，从本地数据库中检索，每天更新一次，速度快，不能搜索实时文件。数据存放在 `/var/lib/mlocate` 目录下，可以使用 `updatedb` 命令更新数据库。

也可以根据配置被搜索的内容 `/etc/updatedb.conf`

``` bash :no-line-numbers
PRUNE_BIND_MOUNTS = "yes"  # 全部生效，开启搜索限制
PRUNEFS # 忽略的文件系统
PRUNENAMES # 忽略的文件类型
PRUNEPATHS # 忽略的文件的路径
```

示例

```shell :no-line-numbers
locate passwd
```

### find 搜索文件

`find 搜索路径 [ 选项 ] 搜索内容`

- `-name`  根据文件名搜索
- `-iname`  根据文件名搜索，忽略大小写
- `-user`  按所有者进行搜索
- `-ctime`  改变文件属性时间搜索
- `-mtime`  改变文件内容时间搜索
- `-atime`  访问文件时间搜索
    > :game_die: `-5`  5 天以内
    >
    > :game_die: `-5`  5 天以前
    >
    > :game_die: `5`   5 天
- `-size`  根据文件大小搜索
    > :jigsaw: `+100M`  大于 100M
    > 
    > :jigsaw: `-100M`  小于 100M
    >
    > :jigsaw: `100M`  等于 100M
    > 
    > `-o`  或 `find . -size +100M -o -size -100M`
    >
    > `-a`  与 `find . -size +100M -a -size -100M`

示例

```shell :no-line-numbers
find /tmp -name passwd

# -name 接受使用通配符进行文件查找
find /tmp -name '*.txt'
```

### grep 搜索文件内容

`grep [ 选项 ] 搜索内容 文件名`

- `-i`  忽略大小写
- `-v`  排除指定内容
- `-n`  显示行号

示例

```shell :no-line-numbers
grep -n 'root' /etc/passwd

# 可以通过 | 管道符将上一个命令的输出作为下一个命令的输入
# 查找 /tmp 目录下 a.txt 文件中包含 test 字符串的行
find /tmp -name a.txt | grep -in test
```

<!-- ### whereis 搜索指令信息位置

`whereis [ 选项 ] 命令`

- `-b`  只查找可执行文件
- `-m`  只查找帮助文件

示例

```shell :no-line-numbers
whereis ls
```

### which 环境变量中搜索指令位置

`which [ 选项 ] 指令`，查看环境变量可以使用 `echo $PATH`

示例

```shell :no-line-numbers
which ls
``` -->

## 压缩、解压缩

### zip

`zip [ 选项 ] target.zip 文件1 文件2...` 可以是多个文件或者目录。

- `-r`  递归压缩目录

示例

```shell :no-line-numbers
zip -r test.zip /tmp/test
```

`unzip [ 选项 ] target.zip`

- `-d`  指定解压目录

示例

```shell :no-line-numbers
unzip test.zip -d /tmp/
```

### gzip

`gzip [ 选项 ] 文件` 只能压缩文件。比 `zip` 压缩比高。

- `-d`  解压缩文件，不保留压缩包
- `-r`  递归压缩目录下的所有文件
- `-c`  将压缩后的文件输出到标准输出 `gzip -c a.txt > b.txt.gz` 有点重命名的意思

示例

```shell :no-line-numbers
gzip a.txt
```

`gunzip [ 选项 ] 文件`

- `-c`  将解压缩后的文件输出到标准输出 `gunzip -c a.txt.gz` 解压缩并保留压缩包

### bzip2

`bzip2 [ 选项 ] 文件` 只能压缩文件。`gzip` 的升级版。可能需要下载 `yum install bzip2`

- `-d`  解压缩文件，不保留压缩包
- `-k`  压缩为 `.bz2` 文件，保留源文件

示例

```shell :no-line-numbers
bzip2 -k a.txt
```

`bunzip2 [ 选项 ] 文件`

- `-k`  解压缩文件，保留压缩包。 `bunzip2 -k a.txt.bz2`

### tar 打包、解包

`tar` 本身是打包工具，不能压缩。但是可以和 `gzip` 和 `bzip2` 结合使用，创建压缩文件后缀为 `tar.gz、tar.bz2` 的压缩包。

`tar [ 选项 ] 打包后的文件名 文件或者目录`

- `-c`  打包
- `-x`  解包
- `-v`  显示打包过程
- `-f`  指定打包后的文件名
- `-z`  `gz` 打包时使用 `gzip` 压缩，解包时使用 `gunzip` 解压
- `-j`  `bz2` 打包时使用 `bzip2` 压缩，解包时使用 `bunzip2` 解压

示例

```shell :no-line-numbers
# 使用 gzip 打包 /tmp 目录下的所有文件
tar -zcvf test.tar.gz /tmp

# 使用 bzip2 解包 /tmp 目录下的所有文件
tar -jxvf test.tar.bz2
```

## 查看文件

### cat 查看文件

`cat [ 选项 ] 文件名`

- `-n`  显示行号
- `-b`  显示行号，空行不显示
- `-s`  压缩连续的空行

示例
```shell :no-line-numbers
cat -n /etc/passwd

# 将 cat 的输出结果保存到文件的末尾
cat /etc/passwd >> a.txt

# 将 cat 的输出结果覆盖到文件
cat /etc/passwd > a.txt

# 将 cat 的输出当做下一个命令的输入
# 查找 /etc/passwd 文件中包含 root 字符串的行
cat /etc/passwd | grep root
```

### more 分页查看文件

`more [ 选项 ] 文件名`

- `-[num]` 指定每页显示的行数
- `+[num]` 从指定行开始显示

常用翻页快捷键

- `enter`  向下翻一行
- `Ctrl + f` 或者 `space`  向下翻一屏
- `Ctrl + b`  向上翻一屏
- `q`  退出
- `:f`  显示文件名和当前行号

### less 分页查看文件
`less [ 选项 ] 文件名` 与 `more` 类似，支持行号、搜索关键词高亮等操作。

- `-f` 强制打开特殊文件，例如二进制和目录
- `/字符串` 向下搜索字符串
- `?字符串` 向上搜索字符串

**翻页与退出快捷键**与 `more` 相同

示例
```shell :no-line-numbers
# 查看进程并用 less 分页查看
ps -ef | less
```


### head 查看文件开头内容

`head [ 选项 ] 文件名`

- `-n` 显示的行数

示例
```shell :no-line-numbers
# 显示 /etc/passwd 文件的前 10 行
head -n 10 /etc/passwd
```

### tail 查看文件结尾内容

`tail [ 选项 ] 文件名`

- `-n` 显示文件的尾部 n 行内容
- `-f` 动态显示文件末尾内容

## vi/vim 编辑器

![alt text](/devops/vi.png)

`vim 文件名`

## 用户登录信息

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

## 磁盘管理

### df 查看磁盘使用情况

`df [ 选项 ] [ 文件 ]`

- `-l` 进现实本地磁盘 (默认)
- `-a` 显示所有文件系统信息
- `-T` 显示磁盘分区类型
- `-t` 显示指定类型文件系统的磁盘分区
- `-H` 以 `1000` 进制显示
- `-h` 以 `1024` 进制显示
- `-x` 不显示指定文件类型的磁盘分区

示例
```shell :no-line-numbers
# 以 1024 进制显示 /dev/shm 分区信息
df -ht tmpfs
```

### du 统计磁盘上文件大小

`du [ 选项 ] [ 文件 ]`

- `-b` 以 byte 显示统计文件
- `-k` 以 kb 显示统计文件
- `-m` 以 mb 显示统计文件
- `-h` 以 `1024` 进制显示
- `-H` 以 `1000` 进制显示
- `-s` 只显示总和

示例

```shell :no-line-numbers
# 以 1024 进制显示 /tmp 目录下所有文件大小
du -h /tmp

# 以 1024 进制显示 /tmp 目录下所有文件大小，只显示总和
du -s /tmp
```

### fdisk 管理磁盘分区

`fdisk [ 选项 ] 设备`

- `-l`  列出所有分区
- `-u`  与 `-l` 搭配，显示分区数目

示例

```shell :no-line-numbers
fdisk -lu
```

`fdisk /dev/sdb` 进入分区管理界面，输入 `m` 查看帮助信息。

![alt text](/devops/07.png)
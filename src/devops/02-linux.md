### man 查看命令帮助信息

**示例** `man ls`

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

### whereis 搜索指令信息位置

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
```

## 压缩、解压缩

### 
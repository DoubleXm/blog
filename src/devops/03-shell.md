# Shell 脚本

## 基础

> [!NOTE]
> &emsp; `shell` 是脚本语言，充当着用户和 `linux` 内核交互的桥梁。默认为 `.sh` （这也不是强制） 结尾。
> 
> &emsp; `shell` 脚本主要分为两个大类 `Bourne Shell` 和 `C Shell`。以及他们的变体和衍生版本。
>| 名称        |      描述      |
>| ------------- | :-----------: |
>| `Bourne Shell (sh)`     | 是 `UNIX` 的最初 `Shell`，也是很多其他 `Shell` 的基础。它以稳定性和脚本编写能力著称，但在交互性方面不如其他 `Shell`。 |
>| `Bourne Again Shell (bash)` | :star2: 是 `Linux` 系统最常用的 `Shell`，它是 `sh` 的扩展，兼容 `sh`，并增加了许多新功能，如命令补全、历史记录和命令编辑等。 **常用**    |
>| `Z Shell (zsh)` | :star2: 是另一个功能强大的 `Shell`，它借鉴了 `bash`、`ksh` 和 `tcsh` 的一些特性，并进行了大量改进，在交互性和脚本编写方面都表现出色。**比如 MacOS 中的 Oh My Zsh**    |
>| `C Shell (csh)` |   它的语法与 `C` 语言类似，并提供了作业控制、命令历史和命令行编辑等功能，比 `Bourne Shell` 更适合交互式使用。    |

新建一个 `.sh` 文件，并添加以下内容

```shell :no-line-numbers
#!/bin/bash

# echo 打印内容
echo "Hello, World!"
```

`#!` 是一个约定的标记，告诉这个系统这个脚本需要什么解释器执行，就是使用哪一种 `shell`。

执行时可以使用 `sh ./code.sh` 执行文件，也可以使用 `./code.sh`。但默认使用第二种方式不太行，需要增加权限 `chmod +x code.sh` 。

### 别名 alias

可以使用 `alias` 命令来创建别名，如果是在命令行每次重启都会失效。如果想要永久生效就需要在 `~/.bashrc` 文件中添加。并且调用 `source ~/.bashrc` 使配置生效。

```shell :no-line-numbers
# 使用 print 代替 echo 打印内容
alias print='echo'
```

### 命令生效优先级

- 绝对路径或者相对路径
- 别名
- `bash` 内置命令
- 按照 `$PATH` 环境变量定义的目录顺序查找。

### 输出、输入重定向

- `>` 将输出内容重定向到文件中**覆盖** `command > file`
- `>>` 将输出内容追加到文件中 `command >> file`
- `<` 将文件内容作为输入 `command < file`
- `<<` 将开始标记 tag 和结束标记 tag 之间的内容作为输入。

```shell :no-line-numbers
ll > file.txt
ll >> file.txt # 追加
wc -l < file.txt # 统计文件行数

# EOF 只是一个标识符，可以是任意标识符
wc -l << EOF
> hello linux
> hello shell
> hello world
> EOF
```

### 管道符

| 多命令执行场景        |      格式      |  作用 |
| ------------- | :-----------: | ----: |
| `;`| `command1 ; command2` | 执行多条命令，命令之间没有任何逻辑关系 |
| `&&`| `command1 && command2` | 执行多条命令，当命令1正确执行，命令2才会执行 |
| `\|\|` | `coomand1 \|\| command2` | 执行多条命令，1 失败，执行 2；1 成功，2 不执行 |
| `\|` | `command1 \| command2` | 将前一个命令的输出，作为后一个命令的输入 |

示例

```shell :no-line-numbers
# 执行多条命令，命令之间没有任何逻辑关系
ls -l ; pwd
# 执行多条命令，当命令1正确执行，命令2才会执行
ls -l && pwd
# 执行多条命令，1 失败，执行 2；1 成功，2 不执行
ls -l || pwd
# 将前一个命令的输出，作为后一个命令的输入
ls -l | grep "shell"
```

### 符号
| 符号        |      描述      |
| ------------- | :-----------: |
| `$()` | 内容会被命令行执行，并且将输出结果返回 |
| ` `` ` | 同上 |
| `$` | 获取变量值 |

## 变量

在 `shell` 中声明的变量默认都是字符串的，比如以下情况。如果需要想要引用变量和普通字符串拼接则可以使用 `${}` 包裹变量。

如果是数字运算，可以使用 `$((1 + 2))` 进行运算。

```shell
x = 1
y = 2
echo $x + $y # 1 + 2

msg = "hello"
echo "${msg} world" # hello world
```

### 查看、删除变量

`set` 命令可以查看所有变量（包括环境变量和自定义变量）
`unset` 该命令可以删除 Shell 变量以及**环境变量**，无法删除只读变量

```shell :no-line-numbers
# 查看所有变量
set
# 删除变量
unset variable_name
```

### 环境变量

> [!NOTE]
> &emsp; 设置全局变量 `export variable_name=value`，可以使用 `printenv` 查看所有或者 `printenv variable_name` 查看单个。该方案创建的变量只会在当前窗口生效。
> 
> &emsp; 如果需要永久生效则可以考虑将变量写入文件。
>
> `~/.bashrc` 每个用户特定的 Shell 配置文件。例如， 如果你使用的是 Bash，就可以在其中声明变量。
>
> `/etc/profile` 每当 bash 登录 Shell 时，都会加载此文件中设置的变量。
>
> `/etc/environment` 使用此文件来设置系统范围内可用的环境变量。

## 参数传递

在执行 `sh` 文件时允许用户传递一些参数，比如 `./sh 0 1 2`，获取参数的方式也有多种，如下。

| 符号        |      描述      |
| ------------- | :-----------: |
| `$n` | 获取第 n 个参数，从 1 开始，0 是文件名 |
| `$#` | 参数的个数 |
| `$*` | 所有参数，以 `"参数1 参数2 参数3"` 的形式输出所有参数 |
| `$@` | 所有参数，以 `"参数1" "参数2" "参数3"` 的形式输出所有参数 |

## 运算符
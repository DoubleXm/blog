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

在 `shell` 中无论带不带 `' "` 实际上都是字符串，比如以下情况。如果需要想要引用变量和普通字符串拼接则可以使用 `${}` 包裹变量。

如果是数字运算，可以使用 `$((1 + 2))` 进行运算。

> [!IMPORTANT]
> 变量声明时，建议去除 `=` 两边的空格；此外你还需要注意，只有在使用变量时才会要 `$` 符号。
>
> 单引号的特点：任何字符串都会被原样输出。变量在里面也是无效的，即使使用 `${}` 也是无济于事。
>
> 双引号的特点：可以有变量，可以有转义字符。
>
> 不带引号的的变量在赋值的时候会被当成命令或者文件名，容易出现问题。

```shell
x=1
y=2
echo $x + $y # 1 + 2

msg="hello"
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

## 字符串、数字、浮点数

除了在 **变量小节** 中提到的声明和拼接之外，字符串也有一些其他的操作。

- :dizzy: 获取字符串长度 `${#str}`

```shell :no-line-numbers
str="hello world"
echo ${#str} # 11
```

- :dizzy: 字符串提取 `str:start:end`，**头包含尾不包含**

```shell :no-line-numbers
str="hello world"
echo ${str:0:5} # hello
echo ${str:6} # world
```

- :dizzy: 字符串替换 `str/old/new`， `str` 后一个斜杠表示替换第一个，两个斜杠表示替换所有 `str//old/new`，还可以将 new 的位置设置为空，达到删除指定内容的目的。

```shell :no-line-numbers
str="hello world"
echo ${str/hello/hi} # hi world
echo ${str//o/O} # hellO wOrld

# 删除字符串中的空格
str="hello world"
echo ${str// /} # helloworld

# 获取文件名
file_name="file.txt"
echo "${file_name/.*/}" # file
```

- :dizzy: 大小写的转换 `${variable^^}` 转换为大写，`${variable,,}` 转换为小写

```shell :no-line-numbers
str="Hello World"
echo ${str^^} # HELLO WORLD
echo ${str,,} # hello world
```

### 变量声明 `declare` `typeset`

`declare` 和 `typeset` 都可以用来声明变量，推荐使用 `declare`。`typeset` 是为了兼容 `ksh` 而保留的。运算的时候

- `-i` 将变量声明为整数型
- `-x` 将变量声明为环境变量，和 `export` 功能相同
- `-r` 将变量声明为只读变量，和 `readonly` 功能相同

```shell :no-line-numbers
declare -i num=1
declare -x var="hello"
declare -r var="hello"

# 只有重新赋值的时候才会计算，直接打印的话仍然还是字符串
num1="1 + 2" # 3
num1="${num1} + 3" # 6
echo $num1 + $num1 = # 6 + 6
```

### 浮点运算

`bc` 是 Linux 下的一个计算器工具，支持浮点运算。但是默认的结果没有小数位，需要 `scale` 参数来设置小数位。

```shell :no-line-numbers
echo "1 + 2" | bc # 3
echo "1 - 2" | bc # -1
echo "1 * 2" | bc # 2
echo "1 / 2" | bc # 0
echo "scale=2; 1 / 2" | bc # 0.50
```

`awk` 也可以进行浮点运算，与 `bc` 不同的是，`awk` 会根据结果自动设置小数位数。也可以通过 `printf` 来设置小数位数。

区别是 `awk` 保留小数时会四舍五入，`bc` 是直接截取

- `printf \"%.2f\n\" $num` 保留两位小数

```shell :no-line-numbers
echo $(awk "BEGIN { print 1 / 2 }") # 0.5
echo $(awk "BEGIN { print 1 * 2 }") # 0.2
echo $(awk "BEGIN { printf \"%.f\n\"; 1 / 2 }") # 0.50
```

## 数组

### 普通数组

`*` 和 `@` 都可以获取到数组的全部元素，区别是 * 返回的是一个整体，而 @ 返回的是多个元素。

```shell :no-line-numbers
# 声明数组
site=("value0" "value1" "value2")
# 获取数组长度
length="${#site[@]}"
# 获取单个元素
echo "${site[0]}"
# 获取所有索引
echo "${!site[@]}"  # 0 1 2
echo "${!site[*]}" # 0 1 2

for i in ${site[@]}; do
    echo $i
done
# "value0"
# "value1"
# "value2"

for i in ${site[*]}; do
    echo $i
done
# "value0 value1 value2"
```

### 关联数组

关联数组需要使用 `declare -A` 来声明。与普通数组不同的是，当使用 `${!site[@]}` 或者 `${!site[*]}` 时获取的是键名。

```shell :no-line-numbers
declare -A site=(["value1"]="this is value1" ["value2"]="this is value2")

# 获取 key
echo "${!site[@]}"
echo "${!site[*]}"
```

## 流程控制

在逻辑判定中，分支语句必须要存在内容，如果没有 `elif` 和 `else`，就不要写了。

```shell :no-line-numbers
if [ condition ]; then
    # 执行语句
elif [ condition ]; then
    # 执行语句
else 
    # 执行语句
fi

# 示例
if [ $(grep -c ":no-line-numbers" study.txt) -gt 1 ]
then
    echo ":no-line-numbers 的内容大于1"
fi
```

如果 `condition` 放在 `[]` 中，则需要使用 `-eq` 等条件运算符，如果放在 `(())` 中，则需要使用 `==` 等条件运算符。

`case` 的判定，结尾需要 `esac`

```shell :no-line-numbers
case 值 in
    模式1)
      命令序列
      ;;
    模式2)
      命令序列
      ;;
esac

# 示例
case $1 in
    "start")
      echo "你的第一个参数是" $1
      $(ps -ef | grep "ssh")
      ;;
    "stop")
      echo "你的第一个参数是" $1
      ;;
esac
```

## 循环

### for 循环

```shell :no-line-numbers
for 变量 in 值1 值2 值3...
do
    程序
    ...
done

# 示例
site=("-a" "-b" "-c")

for i in "${site[@]}"
do
    echo $i
done
```

### while 循环

```shell :no-line-numbers
while condition
do
    程序
done

# 示例
int=1

while(($int <= 10))
do
    if(($int == 5))
    then
        echo "int 的值为 5，跳过这次循环"
        continue
    fi

    echo $int
    # int=$((int + 1)) 或者以下写法
    let "int++"
done
```

## 函数

函数的定义可以加 `function` 关键字，也可以不加。如果不声明 `return` 则默认返回最后一条命令的执行结果。

```shell :no-line-numbers
function func_name(){
    # 执行语句
}

func_name(){
    # 执行语句
}
```

函数不用接收参数，在内部调用参数的方式可以参考 [参数传递](#参数传递)。调用时直接在函数名后加参数即可。

```shell :no-line-numbers
func_name(){
    echo $1
    echo $2
    echo "函数参数的个数为 ${#}"

    for i in "$@"
    do
        echo $i
    done
}
func_name "hello" "world"
```

## 重点

:zany_face: 各种符号搞的我好乱啊~~~，到底啥时候用 `$` 什么时候不用呢？

### `[]` `[[]]` `(())` `$(())` `$()` `${}` 中 $ 的生存法则

> [!TIP]
> &emsp; `[]` 比较传统的条件判断方案，比较大小时需要实用 `-eq` 等运算符。且或关系使用 `-a` 和 `-o` 。**内部变量时需要加上 `$`**
>
> &emsp; 注意内部两侧加上空格。
> ```shell :no-line-numbers
> a=1
> if [ $a -eq 1 ]; then
>     echo "a 等于 1"
> fi
> ```
> &emsp; `[[]]` 是 `Bash` 特有，`[]` 的升级版，支持 `&&` 和 `||` ，**内部变量加不加 `$` 都可以**
>
> &emsp; 注意内部两侧加上空格。
> ```shell :no-line-numbers
> a=1
> b=2
> if [[ $a -eq 1 && b -eq 2 ]]; then
>     echo "a 等于 1"
> fi
> ```
> &emsp; `(())` 用户算数运算和判断支持各种运算符，也可以赋值，整数运算和比较时使用，**内部变量不需要 `$`**
> ```shell :no-line-numbers
> a=1
> while ((a < 10)); do
>     echo "Loop count is $a"
>     # ((i += 1))
>     ((i++))
> done
> ```
> &emsp; `$()` 一般用于执行命令
> ```shell :no-line-numbers
> echo $(ls -l | grep "^-" | wc -l)
> ```
> &emsp; `$(())` 一般用于算数运算，会计算内部的算数表达式并返回结果，**内部变量不需要 `$`**
> ```shell :no-line-numbers
> num1=1
> num2=2
> result=$((num1 + num2))
> echo $result
> 
> for ((i = 0; i < 10; i++)); do
>     result=$((result + i))
>     echo "result 的值当前是 ${result}"
> done
> ```
> &emsp; `${}` 一般用于获取变量值，在字符串中使用，虽然也可以获取变量值，但是不推荐。
> ```shell :no-line-numbers
> str="hello"
> echo "${str} world"
> ```
> 剩下的场景基本上就是直接使用了。酌情使用。
> ```shell :no-line-numbers
> name="alice"
> echo $name "$name"
> ```

### `$n` `$*` `$@` `$#` 以及数组的 `${#array[@]}` 获取

:zany_face: `$` 真是令人头疼的存在

> [!IMPORTANT]
> &emsp; 首先是字符串的环节，直接使用没有任何问题。
> ```shell :no-line-numbers
> site=("a" "b" "c")
> echo $1 $@ $# $* ${#site[@]}  #  1 1 2 2 1 2 3
> echo "$1 $@ $# $* ${#site[@]}" # 1 1 2 2 1 2 3
> # ./code.sh 1 2
> ```
> &emsp; 在 `[]` 中 `$*` 和 `$@` 没有太大的用处，因为一个是合并字符串一个是数组。在表达式中，用不用和字符串的使用方法保持一致
> ```shell :no-line-numbers
> site=("a" "b" "c")
> if [ $1 -eq 1 -a ${#site[@]} -eq 3 ]; then
>     echo "第一个参数是 ${1}，数组长度是 ${#site[@]}"
> fi
> ```
> &emsp; 在 `[[]]` 与 `[]` 的使用方案保持一致
> ```shell :no-line-numbers
> site=("a" "b" "c")
> if [[ $1 == 2 && "$2" != 3 && ${#site[@]} -eq 3 ]]; then
>     echo "第一个参数是 ${1}，第二个参数是 ${2}，数组长度是 ${#site[@]}"
> fi
> ```
> &emsp; 在 `(())` 和 `$(())` 中主要是运算，需要事先考虑好这些内容的返回值是什么。
> ```shell :no-line-numbers
> site=("a" "b" "c")
> for ((i = $1; i <= ${#site[@]}; i++)); do
>     echo $i
> done
> 
> sum = $(($1 + "$1" + ${#site[@]} + "${#site[@]}"))
> echo $sum
> ```

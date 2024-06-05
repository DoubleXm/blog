---
isTimeLine: true
title: 安装、保留字、注释、赋值、运算符
date: 2020-10-27
tags:
 - Python
---

::: tip
`Python` 是著名的“龟叔”Guido van Rossum 在 1989 年圣诞节期间，为了打发无聊的圣诞节而编写的一个编程语言。

`Python` 在 [`tiobe`](https://www.tiobe.com/tiobe-index/) 榜一。

`Python` 解释型、弱类型语言，特点运行很慢。

`Python` 使用场景：就目前的来看，自动化测试，自动化运维，自动化办公都离不开它（用它写脚本应该很吃香），但是 `web` 后台用的却不多。
:::

OK! 目的明确开始卷~

## 安装

`Mac` 为例，[官网下载](https://www.python.org/downloads/macos/) 最新版本点击，找到 `macOS 64-bit universal2 installer` 点击下载，双击下载的 pkg 一直下一步即可。

配置环境变量，打开命令行在 `vim ~/.zshrc` 文件内添加以下内容，退出后执行 `source ~/.zshrc`。然后命令行再次输入 `python` 进行测试是否成功。

```bash
# 无脑下一步的默认安装地址
export PATH="/Library/Frameworks/Python.framework/Versions/3.11/bin:${PATH}"
alias python="/Library/Frameworks/Python.framework/Versions/3.11/bin/python3.11"
```

`VSCode` 安装 [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)、[Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)。修改 `settings.json`，增加如下配置

```json
{
  "code-runner.executorMap": {
    "python": "python3 -u"
  }
}
```

新建 `py/test.py` 输入 `print('hello world')` 执行。肯定没意外，有意外请百度。

## 基础语法

### PY 中的保留字

```python
'False', 'None', 'True', 'and', 'as', 'assert',
'break', 'class', 'continue', 'def', 'del', 'elif',
'else', 'except', 'finally', 'for', 'from', 'global',
'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
'not', 'or', 'pass', 'raise', 'return', 'try',
'while', 'with', 'yield'
```

### 注释

[Google Python 注释风格规范](https://zh-google-styleguide.readthedocs.io/en/latest/google-python-styleguide/python_style_rules/#docstring)

```python
# 单行注释以井号开头并搁一个空格

"""
多行注释
可以是三个双引号为一组
"""

'''
多行注释
也可以是三个单引号为一组
'''
```

### 变量声明

```python
name = "zhangsan"
age = 25
```

### 输入输出语句

```python
# 输出（打印）
print("hello world")
# 输出: 劫持用户输入的内容并用返回值接受，会阻塞代码的运行
user_input_content = input("please input content")
```

## 数据类型

共有 6 中数据类型

| 类型                |                            说明                             |                    示例 |
| ------------------- | :---------------------------------------------------------: | ----------------------: |
| `Numbers` 数字      | 包含整型 `int`，浮点型 `float`，负数 `complex`，布尔 `bool` |            `1,1.1,4+3j` |
| `String` 字符串     |               可用单引号、双引号及三引号声明                | `'str',"str","""str"""` |
| `List` 列表         |       被方括号包裹的数据, 可以是被允许的任意数据类型        |              `[1, '2']` |
| `Tuple` 元祖        |                     被小括号包裹的数据                      |             `(1, 2, 3)` |
| `Sets` 集合         |                     被大括号包裹的数据                      |            `{ 1, "2" }` |
| `Dictionaries` 字典 |          被大括号包裹的键值对，键是任意不可变类型           |       `{ "name": "zs"}` |

### Numbers 数字

`py` 中数字包含以下子类型 `int`, `float`, `complex`, `bool`

```python
user_age = 24
user_english_score = 60.1
user_is_man = True
user_complex = 3.12j
```

**为什么 `bool` 会被归纳到数字类型中?**

```python
print(1 + True) # 2
print(int(True)) # 1
print(int(False)) # 0
```

#### 类型判断

```python
print(type(user_age)) # <class 'int'>
print(type(user_english_score)) # <class 'float'>
print(type(user_is_man)) # <class 'bool'>
print(type(user_complex)) # <class 'complex'>
```

#### 类型转换

`int`, `complex`, `float` 只能对转换数字形式的内容；`bool` 非空为 `True` 否则 `Flase`。

```python
num = '1'

print(int(num)) # 1
print(bool(num)) # True
print(complex(num)) # (1+0j)
print(float(num)) # 1.0
```

### String 字符串

```python
user_name = "zhangsan"
user_name1 = "lisi"
# 三引号即打印时会被换行输出
user_info = """
  hello 我的名字叫张三
  年龄 25岁
"""
```

#### 类型判断

```python
print(type(user_name)) # <class 'str'>
```

#### 字符串拼接

```python
user_name = 'zhangsan'
user_age = 25

# 不同的类型不能直接进行拼接
desc = user_name + user_age
print(desc) # TypeError: can only concatenate str (not "int") to str

# 不同类型的内容拼接应先转换再拼接
desc = user_name + str(user_age)
print(desc)
```

### List 列表

```python
array = [1, 2, True, False, 'str', [1, 2, 3]]

# 取值 下标从 0 开始, 负数则是从最后取值, 例如 -1 则是最后一个
print(array[0]) # 1
print(array[-1]) # [1, 2, 3]

# 嵌套取值: 去最后一个元素的第 2 个元素
print(array[-1][1]) # 2
```

#### 类型判断

```python
print(type(array)) # <class 'list'>
```

### Dict 字典

字典的特点就是本身这个数据结构是无序的。

```python
obj = {
    "name": "zs",
    "age": 25,
    "info": {
        "name": "zs",
        "age": 25,
        "info": {
            "name": "zs",
            "age": 25,
            "info": {}
        }
    }
}

# 根据 key 取值
print(obj["name"]) # "zs"

# 嵌套取值
print(obj["info"]["info"]["info"]) # {}
```

#### 类型判断

```python
print(type(obj)) # <class 'dict'>
```

### Tuple 元组

元组的特点是内容不可修改。但仅限于其内部元素是普通元素的情况下。

```python
t1 = (1, 2, 3, 4, 5)

# 取值与列表一致
print(t1[1]) # 2
print(t1[-1]) # 5
```

#### 类型判断

```python
print(type(t)) # <class 'tuple'>
```

### Set 集合

集合的特点就是本身这个数据结构是无序并且是不可重复的。

```python
# 定义空集合
s = set()

s1 = {1, 2, 3, 4, 5}
```

#### 类型判断

```python
print(type(s1)) # <class 'set'>
```

## 运算符

### 数学运算符

计算多个值运算之后的结果 `+` 比较特殊，有字符串拼接的效果

| 运算符 | 描述 |     示例 |
| ------ | :--: | -------: |
| `+`    |  加  |  `2 + 2` |
| `-`    |  减  |  `2 - 2` |
| `*`    |  乘  |  `2 * 2` |
| `/`    |  除  |  `2 / 2` |
| `%`    | 求余 |  `2 % 2` |
| `**`   | 次方 | `2 ** 2` |

### 比较运算符

比较两个值，最终返回 `True` 或者 `Fasle`

| 运算符 |     描述     |              示例 |
| ------ | :----------: | ----------------: |
| `>`    |     大于     |  `2 > 2 // False` |
| `<`    |     小于     |  `2 < 2 // False` |
| `>=`   | 大于或者等于 |  `2 >= 2 // True` |
| `<=`   | 小于或者等于 |  `2 <= 2 // True` |
| `!=`   |     不等     | `2 != 2 // False` |
| `==`   |     相等     |  `2 == 2 // True` |

### 赋值运算符

| 运算符 |           描述           |                   示例 |
| ------ | :----------------------: | ---------------------: |
| `=`    |           赋值           |                `a = 1` |
| `+=`   | 运算 `+` 将结果进行赋值  |  `a += 1 // a = a + 1` |
| `-=`   | 运算 `-` 将结果进行赋值  |  `a -= 1 // a = a - 1` |
| `/=`   | 运算 `/` 将结果进行赋值  |  `a /- 1 // a = a / 1` |
| `*=`   | 运算 `*` 将结果进行赋值  |  `a *= 1 // a = a * 1` |
| `%=`   | 运算 `%` 将结果进行赋值  |  `a %= 1 // a = a % 1` |
| `**=`  | 运算 `**` 将结果进行赋值 | `a **= 1 // a = a * 1` |

### 逻辑运算符

| 运算符 |                                                描述                                                 |                示例 |
| ------ | :-------------------------------------------------------------------------------------------------: | ------------------: |
| `and`  | 与: 两侧为表达式, 如果第一个为 False, 直接返回第一个表达式。如果第一个为 True, 直接返回第二个表达式 |      `1 and 2 // 2` |
| `or`   |             或: 两侧为表达式, 返回为 True 的那一个表达式，如果都为 False 直接返回第一个             | `0 or True // True` |
| `not`  |                    非: 右侧为表达式, 为 True 则返回 False; 为 False 则返回 True                     |    `not 0 // False` |

### 成员运算符

| 运算符   |                  描述                  |                          示例 |
| -------- | :------------------------------------: | ----------------------------: |
| `in`     |  在序列中存在返回 `True` 否则 `False`  |       `1 in [1, 2, 3] # True` |
| `not in` | 在序列中不存在返回 `True` 否则 `False` | `1 not int [1, 2, 3] # False` |

### 身份运算符

| 运算符   |          描述          | 示例 |
| -------- | :--------------------: | ---: |
| `is`     |  是否为同一块内存空间  |      |
| `is not` | 是否不是同一块内存空间 |      |

```python
# 示例
dic = { "name": "zs", "age": 25 }
dic1 = { "name": "zs", "age": 25 }

print(dic is dic1) # False
print(dic is not dic1) # True
```

## 赋值骚操作

### 连续赋值

```python
a = 1
b = 1
c = 1
print(a, b, c) # 1 1 1

a = b = c = 1
print(a, b, c) # 1 1 1
```

### 翻转赋值

比如变量 `a = 1 b = 2` 实现需求将 `a = 2 b = 1`

```python
a = 1
b = 2

# 方式一: 通过第三个变量作为临时变量接收
temp = a
a = b
b = temp
print(a, b)

# 翻转赋值
a, b = b, a
print(a, b)
```

### 解压赋值

```python
obj = { "name": "zs", "age": 25 }
arr = [1, 2, 3, 4, 5]

# 逐个取出赋值给对应的变量，位置一一对应
a, b, c, d, e = arr
print(a, b, c, d, e) # 1 2 3 4 5

# 将后面所有的数据赋值给 _
a, b, *_ = arr
print(a, b, _) # 1 2 [3, 4, 5]

# 将内容赋值给 _ 只取最后两个
*_, a, b = arr
print(_, a, b) # [1, 2, 3] 4 5


# 对于字典只能将 key 取出来
a, b = obj
print(a, b) # name age
```

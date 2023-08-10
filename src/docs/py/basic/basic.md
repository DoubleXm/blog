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

#### 类型转换

```python
user_age = 25

print('25' == str(user_age)) # True
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

#### 字符串格式化

字符串格式化时无论传入什么样的数据类型，最终都会变成字符串返回。

```python
print("%s %s" % ('hello', 'world'))
```

解析：

- `%s`：字符串占位，常用的还有 `%d` `$f` 对应浮点数与整型数字，理论上如果不需要特殊处理 `%s` 通吃一切。
- `%`：固定语法
- `()`：`%s` 有几个就对应几个内容

示例：

```python
# %d 原文输出
print("%d" % 251)
# %6d 从末尾开始算空格补齐，输出为 251 前面包含3个空格
print("%6d" % 251)
# %.6d 从末尾开始算0补齐，输出为 000251
print("%.6d" % 251)

# %f 默认保留 5 位小数，不到 5 位补 0，超过 5 位第六位四舍五入保留五位
print("%f" % 123)
print("%f" % 123.123456) # 123.123457
# %.2f 指定保留 n 为小数，n + 1 位四舍五入保留 n 位
print("%.2f" % 123.2355)
```

#### format 方法

[菜鸟教程](https://www.runoob.com/python/att-string-format.html)

```python
# 字符串的 format

print("{} {}".format("hello", "world")) # hello world
# 指定内容填充的位置 下标从 0 开始
print("{1} {1}".format("hello", "world")) # world world
# 带参数的指定填充
print("{name}, {age}".format(name="zhangsan", age=25))
# 通过字典 key 进行填充
print("{name}, {age}".format(**{ "name": "zhangsan", "age": 25 }))

# 数字的 format

# 保留三位小数, 四舍五入, .n 表示保留 n 位。0 即为不保留
print("--{:.3f}--".format(3.1415926))

# 带有符号的保留小数
print("--{:+.3f}--".format(3.1415926)) # +3.142
print("--{:-.3f}--".format(3.1415926)) # -3.142

# 逗号分割数字, 千位分割
print("--{:,}--".format(1000000))
# 百分比格式, 默认保留 6 位小数，没有四舍五入
print("--{:.2%}--".format(0.1415)) # 14.15%

"""
  填充或留白规则:
    n - 要被 format 字符的length, 剩余部分即是要被填充或留白的内容
"""

# 右侧补零, 可以是 0 外的任意字母
print("--{:0<4d}--".format(11)) # 1100
# 左侧补零, 可以是 0 外的任意字母
print("--{:0>4d}--".format(11)) # 0011

# 右侧留白
print("--{:<4d}--".format(11)) # --11  --
# 左侧留白
print("--{:>4d}--".format(11)) # --  11--
# 居中
print("--{:^4d}--".format(11)) # -- 11 --
```

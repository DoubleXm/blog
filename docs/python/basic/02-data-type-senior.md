---
isTimeLine: true
title: 字符串格式化、数据类型
date: 2020-10-27
tags:
 - Python
---

## 字符串格式化

### % 格式化

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

### format 方法

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

### f 格式化

```python
# 对于字符串内部则可以是任意表达式
hello = '1'
world = '2'
print(f"{hello}, {world}")

# 保留三位小数, 四舍五入, .n 表示保留 n 位。0 即为不保留
print(f"--{3.1415926:.3f}--")

# 带有符号的保留小数
print(f"--{3.1415926:+.3f}--") # +3.142
print(f"--{3.1415926:-.3f}--") # -3.142

# 逗号分割数字, 千位分割
print(f"--{1000000:,}--")
# 百分比格式, 默认保留 6 位小数，没有四舍五入
print(f"--{0.1415:.2%}--") # 14.15%


# 右侧补零, 可以是 0 外的任意字母
print(f"--{11:0<4d}--") # 1100
# 左侧补零, 可以是 0 外的任意字母
print(f"--{11:0>4d}--") # 0011

# 右侧留白
print(f"--{11:<4d}--") # --11  --
# 左侧留白
print(f"--{11:>4d}--") # --  11--
# 居中
print(f"--{11:^4d}--") # -- 11 --
```

## 数据类型 (高级)

::: tip
经过上篇内容总结, `Py` 中分别有数据类型 `Numbers` `String` `Dict` `Tuple` `List` `Set`, 其中 `Numbers` 中又分为 `int` `float` `complex` 以及 `bool`。

为什么 `bool` 也被归类至 `Numbers` 猜测大概率是可以直接被转换为数字吧。`True == 1` `Flase == 0`。
:::

### 可迭代对象与序列

为了铺垫后续内容，先了解这两个概念。首先确认一点 **在 Python 中所有的序列都是可迭代对象，但是可迭代对象不一定都是序列**。从数据类型来看：

- 序列包含 `list`、`str`、`tuple`
- 可迭代对象包含 `list`、`str`、`tuple`、`dict`、`set`、`range(10)`；包括后面会遇到的 `file` 文件对象、 对象、生成器,迭代器及带有 `__iter__()` 方法的类

**可迭代对象与序列即是可以直接被 `for` 循环的数据**。

#### 序列通用方法

- `index`: 找到这个值在目标中的索引。

```python
string = 'hello world'
t = (1, 2, 3, 4, 5)
arr = [1, 2, 3, 4, 5]

print(string.index('o')) # 4
print(t.index(2)) # 1
print(arr.index(3)) # 2
```

- `count`: 统计这个值在目标中出现的次数。

```python
print(string.count('o')) # 2
print(t.count(2)) # 1
print(arr.count(3)) # 1
```

#### 序列切片

提取序列中的值，并返回一个新的序列。

```python
t = (1, 2, 3, 4, 5, 6)
l = [0, 1, 2, 3, 4, 5]
s = 'hello world'

# 默认切片从头开始到尾结束不用写参数
print(t[:]) # (1, 2, 3, 4, 5, 6)
print(l[:]) # [0, 1, 2, 3, 4, 5]
print(s[:]) # 'hello world'

# 传递参数表示从 n 开始到 m 结束, 不包含 m
print(t[2:5]) # (2, 3, 4)
print(l[1:4]) # [1, 2, 3]
print(s[0:10]) # hello worl

# 第三个参数表示步长, 默认为 1
print(t[2:5:1]) # (2, 3, 4)
print(l[1:4:2]) # [1, 3]
print(s[0:10:3]) # hlwl
```

#### 序列与可迭代对象通用方法

| 方法名   |                    描述                    |
| -------- | :----------------------------------------: |
| `max`    |               返回序列最大值               |
| `min`    |               返回序列最小值               |
| `sum`    | 返回序列所有值的和（仅限于序列为全部数字） |
| `any`    |   如果序列有任一元素为 True 则返回 True    |
| `all`    |  如果序列的所有元素都为 True 则返回 True   |
| `len`    |                求序列的长度                |
| `sorted` |          返回一个排序后的序列副本          |

示例:

::: warning
字符串类型做对比时是通过 [ascii 码](https://tool.oschina.net/commons?type=4) 做的对比。

对比逻辑为，将字符串一个一个拿出进行比较，只要有一个大剩余的就不再进行对比。
:::

::: code-group

```py [define]
s = 'hello world'
t = (1, 2, 3, 4, 5)
arr = [0, 2, 3, 4, 5]
ss = {0, 2, 3, 4, 5}
d = { "name": "zs", "age": 26 }
```

```py [max]
# max
print(max(s)) # w
print(max(t)) # 5
print(max(arr)) # 5
print(max(ss)) # 5
print(max(d)) # name
```

```py [min]
# min
print(min(s)) # 空格
print(min(t)) # 1
print(min(arr)) # 1
print(min(ss)) # 1
print(min(d)) # age
```

```py [len]
# len
print(len(s)) # 11
print(len(t)) # 5
print(len(arr)) # 5
print(len(ss)) # 5
print(len(d)) # 2
```

```py [any]
# any
print(any(s)) # True
print(any(t)) # True
print(any(arr)) # True
print(any(ss)) # True
print(any(d)) # True
```

```py [all]
# all
print(all(s)) # True
print(all(t)) # True
print(all(arr)) # False
print(all(ss)) # False
print(all(d)) # True
```

```py [sum]
# sum
print(sum(t)) # 15
print(sum(arr)) # 14
print(sum(ss)) # 14
```

```py [sorted]
"""
  sorted，第二个参数默认为 False 可选;
  默认排序方式为从小到大
  字符串会被切割，最终返回排序号的列表
  对象会按照 key 进行排序并返回
"""

print(sorted(s)) # [' ', 'd', 'e', 'h', 'l', 'l', 'l', 'o', 'o', 'r', 'w']
print(sorted(s, reverse=True)) # ['w', 'r', 'o', 'o', 'l', 'l', 'l', 'h', 'e', 'd', ' ']
print(sorted(t)) # [1, 2, 3, 4, 5]
print(sorted(arr)) # [0, 2, 3, 4, 5]
print(sorted(ss)) # [0, 2, 3, 4, 5]
print(sorted(d)) # ['age', 'name']
```

```py [类型转换]
# !!! 个人建议，对于会更改返回数据结构与原始数据结构变化很大的数据，建议还是不要强转，除非你能把握的住

# 列表
print(list(s)) # ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
print(list(t)) # [1, 2, 3, 4, 5]
print(list(arr)) # [0, 2, 3, 4, 5, {'dic': 13}]
print(list(ss)) # [0, 2, 3, 4, 5]
print(list(d)) # ['name', 'age']

# 元组
print(tuple(s)) # ('h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd')
print(tuple(t)) # (1, 2, 3, 4, 5)
print(tuple(arr)) # (0, 2, 3, 4, 5, {'dic': 13})
print(tuple(ss)) # (0, 2, 3, 4, 5)
print(tuple(d)) # ('name', 'age')

# 集合
print(set(s)) # {'e', 'o', ' ', 'r', 'h', 'l', 'd', 'w'}
print(set(t)) # {1, 2, 3, 4, 5}
# print(set(arr)) # 仅限于内部为普通类型的互转, TypeError: unhashable type: 'dict'
print(set(ss)) # {0, 2, 3, 4, 5}
print(set(d)) # {'name', 'age'}

# 字符串
print(str(s)) # "hello world"
print(str(t)) # "(1, 2, 3, 4, 5)"
print(str(arr)) # "[0, 2, 3, 4, 5, {'dic': 13}]"
print(str(ss)) # "{0, 2, 3, 4, 5}"
print(set(d)) # "{'name', 'age'}"

# 字典
# !!! 虽然有 dict() 这个方法，但对象类型的数据结构不要这么玩
```

:::

### 字符串常用方法

| 方法名       |                      描述                      |                   示例 |
| ------------ | :--------------------------------------------: | ---------------------: |
| `starswith`  |          检查字符串是否以某个前缀开头          | `s.startswith(prefix)` |
| `endswith`   |          检查字符串是否以某个后缀结尾          |   `s.endswith(suffix)` |
| `find`       | 搜索子字符串,返回第一个匹配的索引,未找到返回-1 |          `s.find(sub)` |
| `replace`    |                   替换字符串                   |  `s.replace(old, new)` |
| `strip`      |                  移除两端空格                  |            `s.strip()` |
| `split`      |          分割字符串,返回子字符串列表           |            `s.split()` |
| `capitalize` |                   首字母大写                   |       `s.capitalize()` |
| `title`      |               每个单词首字母大写               |            `s.title()` |
| `lower`      |                    小写转换                    |            `s.lower()` |
| `upper`      |                    大写转换                    |            `s.upper()` |
| `join`       |             合并可迭代对象为字符串             |     `', '.join(items)` |

```py
# 示例
s = 'hello world'

print(s.startswith('hello')) # True
print(s.endswith('x')) # False
print(s.find('world')) # 6
print(s.replace('hello', 'hi')) # hi world
print(s.strip()) # hello wrold
# 默认空格分割
print(s.split('l')) # ['he', '', 'o wor', 'd']
print(s.capitalize()) # Hello world
print(s.title()) # Hello World
print(s.lower()) # hello world
print(s.upper()) # HELLO WORLD

items = ['foo', 'bar', 'baz']
s = ', '.join(items)
print(s) # 'foo, bar, baz'
```

### 列表常用方法

| 方法名    |                      描述                      |                     示例 |
| --------- | :--------------------------------------------: | -----------------------: |
| `append`  |             在列表末尾添加一个元素             |         `list.append(x)` |
| `insert`  |             在指定位置插入一个元素             |      `list.insert(i, x)` |
| `remove`  |            删除列表中第一个匹配的值            |         `list.remove(x)` |
| `pop`     | 删除列表指定位置的元素,默认最后一个元素(index) |          `list.pop([i])` |
| `sort`    |       对列表中的元素进行排序(默认小到大)       |            `list.sort()` |
| `reverse` |                    反转列表                    |         `list.reverse()` |
| `copy`    |                   浅拷贝列表                   |       `list.extend(seq)` |
| `extend`  |                    列表拼接                    | `list.extend([1, 2, 3])` |
| `clear`   |                    清空列表                    |           `list.clear()` |

```py
l = [7, 2, 3, 4, 5]

l.append(6)
print(l) # [7, 2, 3, 4, 5, 6]
l.insert(0, 10)
print(l) # [10, 7, 2, 3, 4, 5, 6]
l.remove(6)
print(l) # [10, 7, 2, 3, 4, 5]

# 默认从末尾删除, 可以指定索引，返回被删除的值
l.pop()
print(l) # [10, 7, 2, 3, 4]
l.pop(1)
print(l) # [10, 2, 3, 4]

# 默认从小到大排序，可以增加参数改变顺序
l.sort()
print(l) # [2, 3, 4, 10]
l.sort(reverse=True)
print(l) # [10, 4, 3, 2]

l.reverse()
print(l) # [2, 3, 4, 10]

newL = l.copy()
print(newL) # [2, 3, 4, 10]

l.extend([1, 2, 3])
print(l) # [2, 3, 4, 10, 1, 2, 3]
l.clear()
print(l) # []
```

### 集合常用方法

| 方法名         |                             描述                             |                   示例 |
| -------------- | :----------------------------------------------------------: | ---------------------: |
| `add`          |                       添加元素到集合中                       |         `s1.add(elem)` |
| `update`       |              从可迭代对象中添加多个元素到集合中              | `s1.update([2, 1, 0])` |
| `remove`       |             从集合中删除元素,如果元素不在则报错              |      `s1.remove(elem)` |
| `discard`      |            从集合中删除元素,如果元素不在则不报错             |     `s1.discard(elem)` |
| `pop`          |                随机删除并返回一个集合中的元素                |             `s1.pop()` |
| `difference`   |    返回一个包含在第一个集合但不在第二个集合的元素的新集合    |    `s1.difference(s2)` |
| `union`        |                      返回两个集合的并集                      |         `s1.union(s2)` |
| `intersection` |                      返回两个集合的交集                      |  `s1.intersection(s2)` |
| `issubset`     | 判断 s1 集合是否是 s2 的子集(s1 在 s2 的里面) `True` `False` |      `s1.issubset(s2)` |
| `issuperset`   | 判断 s1 集合是否是 s2 的超集(s1 不在 s2 里面) `True` `False` |    `s1.issuperset(s2)` |
| `isdisjoint`   |       判断两个集合是否不包含相同的元素 `True` `False`        |    `s1.isdisjoint(s2)` |
| `clear`        |                     清空集合中的所有元素                     |           `s1.clear()` |
| `copy`         |                          浅拷贝集合                          |            `s1.copy()` |

```py
# 示例

s1 = {1, 2, 3, 4, 5, 6, 7}

s1.add(10)
print(s1) # {1, 2, 3, 4, 5, 6, 7, 10}

s1.update('hello')
print(s1)

s1.remove(10) # {1, 2, 3, 4, 5, 6, 7}
print(s1) # 删除元素，不存在会报错

s1.discard(0) # {1, 2, 3, 4, 5, 6, 7}
print(s1) # 删除元素，不存在不会报错

s1.pop()
print(s1) # 随机删除一个元素

s2 = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1}
print(s2.difference(s1)) # {8, 9, 10}
print(s2.union(s1)) # {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
print(s2.intersection(s1)) # {2, 3, 4, 5, 6, 7}

print(s1.issubset(s2)) # True  s 所有元素是否都在 s1 中
print(s1.issuperset(s2)) # False s 所有元素是否都不在 s1 中
print(s1.isdisjoint(s2)) # False s 和 s1 是否没有共同的元素

print(s1.clear()) # None
```

### 字典常用方法

| 方法名    |                            描述                            |                      示例 |
| --------- | :--------------------------------------------------------: | ------------------------: |
| `keys`    |      以列表返回字典所有的 key, 不可下标只能 for 循环       |              `dic.keys()` |
| `values`  |     以列表返回字典所有的 value, 不可下标只能 for 循环      |            `dic.values()` |
| `items`   | 以列表返回可遍历的(键, 值) 元组数组, 不可下标只能 for 循环 |             `dic.items()` |
| `get`     |              返回指定键的值, 找不到返回 None               |         `dic.get("name")` |
| `pop`     |          删除键 key 和对应的值,返回值为被删除的值          |         `dic.pop("name")` |
| `popitem` |                   随机删除一对 key value                   |           `dic.popitem()` |
| `update`  |            把字典 other 的键/值对更新到 dict 里            | `dic.update({"age": 25})` |
| `copy`    |                           浅拷贝                           |              `dic.copy()` |
| `clear`   |                     删除字典内所有元素                     |             `dic.clear()` |

```py
# 示例

dic = {
    "name": "zs",
    "age": 25,
    "info": {
        "gender": True,
        "hobbies": ["唱", "跳", "篮球", "rap"]
    }
}

# 不能通过下标获取，只能循环获取
print(dic.keys()) # dict_keys(['name', 'age', 'info'])
print(dic.values()) # dict_values(['zs', 25, {'gender': True, 'hobbies': ['唱', '跳', '篮球', 'rap']}])
print(dic.items()) # dict_items([('name', 'zs'), ('age', 25), ('info', {'gender': True, 'hobbies': ['唱', '跳', '篮球', 'rap']})])

print(dic.get("info")) # {'gender': True, 'hobbies': ['唱', '跳', '篮球', 'rap']}

dic.pop("name")
print(dic) # {'age': 25, 'info': {'gender': True, 'hobbies': ['唱', '跳', '篮球', 'rap']}}

dic.popitem()
print(dic) # 随机删除一组 key value

dic.update({
    "info": {
        "gender": True,
        "hobbies": ["唱", "跳", "篮球", "rap"]
    },
    "alias": "ikun"
})
print(dic) # {'age': 25, 'info': {'gender': True, 'hobbies': ['唱', '跳', '篮球', 'rap']}, 'alias': 'ikun'}

ret = dic.copy()
print(ret) # {'age': 25, 'info': {'gender': True, 'hobbies': ['唱', '跳', '篮球', 'rap']}, 'alias': 'ikun'}

dic.clear()
print(dic) # {}
```

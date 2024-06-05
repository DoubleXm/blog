---
isTimeLine: true
title: 迭代器、生成器、表达式、生成式
date: 2020-10-27
tags:
 - Python
---

## 迭代器

迭代器实现了 `__iter__` 和 `__next__` 方法,可以遍历迭代器获取其中的元素。迭代器一次遍历一个元素。

```py
s = iter({1, 2, 3, 4, 5})

while True:
    try:
        # 每次调用 next 都会取下一个值，直到取不到抛出 StopIteration 异常
        print(next(s))
    except StopIteration:
        break
```

## 生成器

生成器是可以迭代的, 但它不像迭代器那样实现了 `__iter__` 和 `__next__` 方法。生成器是通过 yield 关键字产生的,它每次遇到 `yield` 时会 `suspend` 执行,返回一个迭代值

```py
def func():
   yield None # 默认返回值为 None, 可以是任意值
   print("1")
   yield None
   print("2")
   yield None
   print("3")

f = func()
# 以 yield 为分界线，超过同样异常
next(f)
next(f) # 1
next(f) # 2
next(f) # 3 StopIteration
```

## 表达式

简而言之就是一行代码能够搞定的就称为表达式。

### 三元表达式

```py
x = 10
y = 20
print(y if x > y else x)

# 拆解
# y : if 成立的返回值，在最左边
# if x > y : 判断条件
# else x : 条件不成立时的返回值
```

### 列表生成式

```py
l = [1, 2, 3, 4, 5, 6]

new_l = [i for i in l if i % 2 == 0]
print(new_l)

# 拆解
# i : 最右侧 if 成立的返回值
# for i in l if i % 2 == 0 : 循环和判断的条件
```

### 集合生成式

```py
# 中括号变成大括号即可
l = {1, 2, 3, 4, 5, 6}

new_l = {i for i in l if i % 2 == 0}
print(new_l)
```

### 字典生成式

```py
d = { "name": "zs", "age": 25 }

new_d = {k: d["name"] for k in d if k == "name"}
print(new_d)
```

### 生成器生成式

```py
# 注意：不要以为加了小括号就是元组生成式，切记元组是不可变的，所以就成了生成器
l = (1, 2, 3, 4, 5, 6)

new_l = (i for i in l if i % 2 == 0)
print(new_l) # <generator object <genexpr> at 0x100e28110>
```

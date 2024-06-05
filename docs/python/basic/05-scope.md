---
isTimeLine: true
title: 作用域、闭包
date: 2020-10-27
tags:
 - Python
---

## 名称空间、作用域

名称空间是管理变量、函数、类等名称 在 python 中名称空间分为四种。简单概括为:

- L: `local` 存储在函数调用时创建的局部符号表中。它具有优先级最高的作用域。
- E: `Enclosing` 闭包函数外的命名空间
- G: `global` 环境下的名称空间
- B: `Build-in` 内置环境下的名称空间, 其实就是内置方法比如 `input`, `print`...

在查询变量的时候会根据这个 LEGB 的规则查询，形成了变量访问的作用域范围。访问的优先级也为 `L -> E -> G -> B`, 反之可以访问的范围则是从大到小。

```py
x = 10 # ----- global
def outer():
    x = 20 # ----- enclosing
    def inner():
        x = 30 # ----- local
        print('local', x)

    print('enclosing', x)
    return inner

print('global', x)
outer()()
```

## 闭包

借用学习前端的思想来描述闭包，就是在内部函数中引用了外部函数的变量，延长了这个变量的生命周期（因为一直会被内层函数引用，所以并不会销毁）

只要内部函数有用到外部的变量就可以被称之为是闭包

```py
def outer():
    x = 10

    def inner():
        nonlocal x
        x += 10
        print(x)

    return inner

ret = outer()
# 可以看出 outer 中的 x 一直没有被释放，如果不使用闭包，每次调用后就在内存中将变量释放，不会出现这种累加的情况
ret() # 20
ret() # 30
ret() # 40
ret() # 50
```

## nonlcal global 关键字

一般场景下如果在函数的内部是不能直接修改 `global` 作用域下的变量的, 除非你做了 `global` 声明。

```py
x = 10
def outer():
    # x = 20 如果直接修改, 最后打印仍然是 10

    global x # 声明一下 x 是来自于全局的 x
    x = 20

outer()
print(x) # 20
```

`nonlocal` 则是想要在内部函数修改外部函数中变量使需要做的声明

```py
def outer():
x = 10
def inner(): # x = 20 直接修改, 最后打印仍然是 10

        nonlocal x # 声明一下 x 是来自 enclosing 中的 x
        x = 20

    inner()
    print(x) # 20

outer()
```

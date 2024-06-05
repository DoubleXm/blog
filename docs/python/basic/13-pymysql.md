---
isTimeLine: true
title: 三方模块 pymysql
date: 2020-10-27
tags:
 - Python
---

## Python 操作 mysql

`pymysql` 是在 `Python3.x` 版本中用于连接 `MySQL` 服务器的一个库

```bash
pip3 install pymysql
```

### 数据库连接

```py
from pymysql import connect

db = connect(
    host="127.0.0.1",
    port=3306,
    user="root",
    password="Admin123..",
    autocommit=True, # 自动保存如果没有此配置，修改数据后需要手动调用 conn.commit()
)

# 获取 mysql 版本，可以用来测试是否连接成功
print(db.get_server_info())
```

### 数据查询

```py
cursor = db.cursor() # 创建游标
cursor.execute("USE study;") # 指定当前所在的位置

try:
    # execute 用来执行 sql 语句
    cursor.execute("SELECT * FROM Student;")
    ret = cursor.fetchall() # 获取全部数据，数据结构为二维元祖
    for row in ret:
        print(row)
except:
    print("Error: unable to fetch data")

db.close() # 关闭数据库连接
```

### 数据更新

```py
cursor = db.cursor() # 创建游标
cursor.execute("USE study;") # 指定当前所在的位置

try:
    cursor.execute("UPDATE Student SET sex = '女' WHERE name = '赵雷';")
    cursor.execute("SELECT * FROM Student WHERE name = '赵雷';")
    ret = cursor.fetchone() # 查询一行数据，数据结构为一维数组
    if ret[1] == "赵雷" and ret[-1] == "女":
        print("修改信息成功")
    else:
        print("修改信息错误，请检查 SQL 语句是否正确")
except:
    db.rollback() # 如果更新失败就执行回滚操作

db.close()
```

### 数据插入

```py
user_info = [
    ["13", "张三", "1990-01-01", "男"],
    ["14", "李四", "1991-02-02", "男"],
    ["15", "王二", "1992-03-03", "女"],
    ["16", "麻子", "1993-04-04", "女"]
]

cursor = db.cursor() # 创建游标
cursor.execute("USE study;") # 指定当前所在的位置

try:
    sql = "INSERT INTO Student(id, name, age, sex) VALUES "
    for user in user_info:
        sql += f"('{user[0]}', '{user[1]}', '{user[2]}', '{user[3]}'),"

    cursor.execute(f"{sql[:-1]};")
    # cursor.rowcount 获取到执行 sql 后影响的行数
    if (cursor.rowcount == len(user_info[0])):
        print("数据插入成功")
    else:
        print("数据插入失败，请检查 SQL 语句是否正确")
except:
    db.rollback()

db.close()
```

### 删除数据

```py
cursor = db.cursor() # 创建游标
cursor.execute("USE study;") # 指定当前所在的位置

try:
    cursor.execute("DELETE FROM Student WHERE id >= '13';")
    cursor.execute("SELECT * FROM Student WHERE id >= '13'")

    if not cursor.rowcount:
        print("删除成功")
    else:
        print("数据删除失败，请检查 SQL 语句是否正确")
except:
    db.rollback()

db.close()
```

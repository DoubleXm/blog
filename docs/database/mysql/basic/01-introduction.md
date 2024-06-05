---
isTimeLine: true
title: MySQL 介绍及初次体验
date: 2020-10-27
tags:
 - 数据库
 - MySQL
categories:
 - 数据库
---

MySQL 是最流行的关系型数据库管理系统，在 WEB 应用方面 MySQL 是最好的 RDBMS(Relational Database Management System：关系数据库管理系统)应用软件之一。

数据库（`Database`）是按照数据结构来组织、存储和管理数据的仓库。

数据以表格的形式出现, 每行为各种记录名称, 每列为记录名称所对应的数据域, 许多的行和列组成一张表单, 若干的表单组成 `database`。

- 数据库: 数据库是一些关联表的集合。
- 数据表: 表是数据的矩阵。在一个数据库中的表看起来像一个简单的电子表格。
- 列: 一列(数据元素) 包含了相同类型的数据, 例如邮政编码的数据。
- 行：一行（元组，或记录）是一组相关的数据，例如一条用户订阅的数据。
- 主键：主键是唯一的。一个数据表中只能包含一个主键。你可以使用主键来查询数据。
- 外键：外键用于关联两个表。
- 复合键：复合键（组合键）将多个列作为一个索引键，一般用于复合索引。
- 索引：使用索引可快速访问数据库表中的特定信息。索引是对数据库表中一列或多列的值进行排序的一种结构。类似于书籍的目录。
- 表头(header): 每一列的名称。
- 值(value): 行的具体信息, 每个值必须与该列的数据类型相同。

## 初体验

需要注意的是，`sql` 语句的结尾以分号结尾；比如

```sql {1,3,5,7}
-- 查看所有数据库
show databases;

-- 如果在命令行输入错误的指令后，\c 可以保证前面的指令不会被执行
\c

-- 查看数据的字符集编码信息
\s

-- 退出命令行连接
exit
quit

/**
  mysql> show databases;
  +--------------------+
  | Database           |
  +--------------------+
  | information_schema |  虚拟库, 存在内存中, 都是数据库启动后的信息比如数据类型、访问权限等.
  | mysql              |  主要有个授权表可以对用户信息修改.
  | performance_schema |  性能监控和诊断功能、可以用来分析数据库性能.
  | sys                |  mysql 引擎的拓展库.
  +--------------------+
  4 rows in set (0.00 sec)
 */
```

### 配置快捷连接

每次链接 `mysql` 时都需要使用命令 `mysql -uroot -p` 很不方便，此时可以通过修改 `mysql` 的配置文件来实现快速登录，方便后续的学习。

`mysql` 每次连接的时候都会调用 `/etc/my.cnf` 文件，修改该文件 `vim /etc/my.cnf` 在 `[mysql]` 下增加如下内容。

```bash
[mysql]
# ....
user=root
password=Admin123..
```

然后重启 `mysql` 服务，后续只需要在命令输入 `mysql` 即会去配置文件中找对应的配置，无需输入账号密码了。

```bash
service mysqld restart # 重启
service mysqld stop # 关闭
service mysql start # 开启
```

## 库操作

创建数据库其实就是对应创建了一个文件夹，默认情况下可以去 `/usr/local/mysql` 中去查找，如果找不到可以看下 `/etc/my.cnf` 文件中 `datadir` 对应的路径。

```sql {1,5,8,11}
/** 增 */
create database db1;
create database if not exists db1 charset=utf8; -- 指定字符编码，如果不存在就创建，可选参数。防止程序崩溃

/** 删 */
drop database if exists db2; -- 如果存在就删除，可选参数。防止程序崩溃。

/** 改 */
alter database db2 charset=utf8; -- 对于库来说只能修改字符集编码

/** 查 */
show databases; -- 查所有的库

show create database db1; -- 查单个库的详细信息
/**
  +----------+--------------------------------------------------------------+
  | Database | Create Database                                              |
  +----------+--------------------------------------------------------------+
  | db1      | CREATE DATABASE `db1` /*!40100 DEFAULT CHARACTER SET utf8 */ |
  +----------+--------------------------------------------------------------+
 */
```

## 表操作

在操作表之前，首先要知道在使用哪个库。

```sql
select database(); -- 查看自己正在使用哪个库, 如果没有执行显示 NULL
/**
  +------------+
  | database() |
  +------------+
  | NULL       |
  +------------+
  1 row in set (0.00 sec)
 */

use db1; -- 使用 db1 这个库
```

表对应的其实就是文件的操作，创建表就相当于创建了一个文件。创建表的时候需要指定对应的表头字段和字段的类型。

在执行创建语句之前，可以先去 `mysql` 的 `db1` 中去查看有哪些文件。有一个 `db.opt` 文件。主要用来**存储当前库的默认字符集和字符校验规则**.

执行过后会增加两个文件分别为：`movies.frm` 和 `movies.idb`。

- `frm` 是表的定义文件，存储表的结构信息，比如表名、列名、列数据类型、列长度等。
- `idb` 是存储数据的文件，表存着表的数据和索引信息。

```sql {1,5,8,12}
/** 增 */
-- 创建表时可以不指定字符编码，默认的字符编码就是库的字符编码
create table movies(id int, name char) charset=utf8;

/** 删 */
drop table movies;

/** 改 */
alter table movies modify name char(4); --修改表字段类型
alter table movies change name Name char(5); -- 修改表的字段名并修改类型

/** 查 */
show tables; -- 查询当前库下所有的表
show create table movies; -- 查看创建表的 sql 语句
/**
  +--------+-------------------------------------------------------------------------------------------------------------------------+
  | Table  | Create Table                                                                                                            |
  +--------+-------------------------------------------------------------------------------------------------------------------------+
  | movies | CREATE TABLE `movies` (
    `id` int(11) DEFAULT NULL,
    `name` char(1) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 |
  +--------+-------------------------------------------------------------------------------------------------------------------------+
  1 row in set (0.01 sec)
 */

describe movies; -- 查看表的结构, 简写 desc movies;
/**
  +-------+---------+------+-----+---------+-------+
  | Field | Type    | Null | Key | Default | Extra |
  +-------+---------+------+-----+---------+-------+
  | id    | int(11) | YES  |     | NULL    |       |
  | name  | char(1) | YES  |     | NULL    |       |
  +-------+---------+------+-----+---------+-------+
  2 rows in set (0.00 sec)
 */


-- 所有对表的操作都可以使用绝对路径的方式，这样即便不切换数据库，也可以操作对应数据库的表
create table db2.movies(id int, name char) charset=utf8;
```

## 记录操作

记录对应的就是文件的具体内容。

```sql {1,5,8,11}
/** 增 */
insert into movies values (1, '流浪地球'); -- 插入一条记录
insert into movies values (2, '三体'), (3, '消失的她'); -- 插入多条记录

/** 删除 */
delete from movies where name='消失的她'; -- 删除 name 等于消失的她的数据, 如果不指定 where 就会清空整张表

/** 改 */
update movies set name='满江红' where id=2; -- 修改 id 为 2 的数据的 name 为满江红, 如果不指定 where 就会修改整张表

/** 查 */
select * from movies; -- 查询表中的所有数据，* 表示所有，如果查询指定字段将 * 替换
select id, name from movies; -- 查询 id, name 字段
/**
  +------+--------------+
  | id   | name         |
  +------+--------------+
  |    1 | 流浪地球     |
  |    2 | 三体         |
  |    3 | 消失的她     |
  +------+--------------+
  3 rows in set (0.01 sec)
 */
```

## SQL 语句分类

| 类型                              |                      描述                      |                               关键字 |
| --------------------------------- | :--------------------------------------------: | -----------------------------------: |
| `DDL: Data Definition Language`   | 数据库定义语言, 用来定义、管理数据库或者数据表 |              `creatr` `alter` `drop` |
| `DML: Data Manipulation Language` |          数据库操纵语言, 用来操作数据          |           `insert` `update` `delete` |
| `DQL: Data Query Language`        |          数据库查询语言, 用来查询数据          |                             `select` |
| `DCL: Data Control Language`      |            数据库控制语言, 权限控制            | `grant` `revoke` `commit` `rollback` |

---
isTimeLine: true
title: MySQL 表操作
date: 2020-10-27
tags:
 - 数据库
 - MySQL
categories:
 - 数据库
---

## 存储引擎

表的类型就是存储引擎。最常用的就是 `InnoDB` （目前的主流）支持事务，行锁，外键。此外还有

- `myisam`: `mysql 5.6` 之前使用的存储引擎，支持全文检索
- `memory`: 缓存存储引擎，插入的数据不会被真正的存储到硬盘中，会在内存中存储，重启后数据消失
- `blackhole`: 黑洞存储引擎，任何写入的数据都不会被存储，主要用于测试或者丢弃不需要的写入数据。

```sql
show engines; -- 查看表支持的存储引擎

/**
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.00 sec)
 */
```

```sql
-- 新建 db2 数据库基于不同存储引擎创建表
create database db2 charset=utf8;
use db2;

create table t1 (id int, name char(4)) charset=utf8 engine=blackhole;
create table t2 (id int, name char(4)) charset=utf8 engine=innodb;
create table t3 (id int, name char(4)) charset=utf8 engine=memory;
create table t4 (id int, name char(4)) charset=utf8 engine=myisam;

-- 针对四张表每个都插入一条数据
insert into t1 (1, 'a');
insert into t2 (1, 'a');
insert into t3 (1, 'a');
insert into t4 (1, 'a');

-- 执行 select 语句查询数据；
-- 结果 t2, t3, t4 都有数据
-- 重启 mysql 服务后 t3 数据也会消失
```

针对不同的存储引擎，查看 `mysql` 都创建了什么文件？

```bash
-rw-r----- 1 mysql mysql    61 Sep 26 10:54 db.opt
-rw-r----- 1 mysql mysql  8586 Sep 26 10:58 t1.frm # 只有结构文件，因为它根本就不存储数据
-rw-r----- 1 mysql mysql  8586 Sep 26 10:58 t2.frm # innodb 分别存储结构文件和数据文件
-rw-r----- 1 mysql mysql 98304 Sep 26 11:03 t2.ibd
-rw-r----- 1 mysql mysql  8586 Sep 26 10:59 t3.frm # 只有结构文件，因为不会有数据存储到磁盘
-rw-r----- 1 mysql mysql  8586 Sep 26 10:59 t4.frm # myisam 的结构文件
-rw-r----- 1 mysql mysql    17 Sep 26 11:03 t4.MYD # myisam 数据文件
-rw-r----- 1 mysql mysql  1024 Sep 26 11:06 t4.MYI # myisam 索引文件，表的索引、行数等关键数据
```

## 表的操作

### 创建表语法

```sql
create table <表名> (
  <字段1> <字段类型>[(宽度)] [约束条件],
  <字段2> <字段类型>[(宽度)] [约束条件],
  <字段3> <字段类型>[(宽度)] [约束条件1 约束条件2]
);

-- 宽度指字符的个数，也就是字符串的长度
```

**约束条件**

- `unsigned` 无符号
- `not null` 非空, 字符类型空字符串填充，数字类型 0 填充。优先级较低，卸载条件的最后。
- `zerofill` 0 填充，当指定数字宽度的时候位数不足的会以 0 进行填充

### 修改表语法

```sql
-- 修改存储引擎
alter table <表名> engine=<新的存储引擎>;

-- 修改表名
alter table <表名> rename <新表名>;

-- 增加字段 first 插入到最前面，after 字段名 某个字段的后面
alter table <表名> add <字段名> <字段类型>[(宽度)] [约束条件] [first|after <字段名>];

-- 删除字段
alter table <表名> drop <字段名>;

-- 修改字段类型
alter table <表名> modify <字段名> <字段类型>[(宽度)] [约束条件];

-- 修改表字段
alter table <表名> change <旧字段名> <新字段名><字段类型>[(宽度)] [约束条件];
```

约束条件就是，当在操作数据的时候，增加一些条件，比如创建一个表, 再去查询表的字段信息, 可以看出第三列是允许为 `null` 值的可以往里面插入空的内容, 内容如下：

```sql
create table t6 (id int, name char(4)) charset=utf8;
describe t6;

/**
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| id    | int(11) | YES  |     | NULL    |       |
| name  | char(4) | YES  |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
2 rows in set (0.00 sec)
 */

insert into t6 values (null, null);
select *  from t6;

/**
+------+------+
| id   | name |
+------+------+
| NULL | NULL |
+------+------+
1 row in set (0.00 sec)
 */
```

此时就可以通过约束条件，在建表或者表内没有不允许的数据时去增加约束条件，比如表内已经存在 `null` 值你在去修改这个字段不能为 `null` 是无法修改成功的。

```sql
-- 创建 table
create table t7 (id int, name char) charset=utf8;

-- 设置 id 不能为null
alter table t7 modify id int not null;
-- 修改 name 的字段名并且设置不能为 null
alter table t7 change name Name char not null;

describe t7;
/**
+-------+---------+------+-----+---------+-------+
| Field | Type    | Null | Key | Default | Extra |
+-------+---------+------+-----+---------+-------+
| id    | int(11) | NO   |     | NULL    |       |
| Name  | char(1) | NO   |     | NULL    |       |
+-------+---------+------+-----+---------+-------+
2 rows in set (0.00 sec)
 */
```

### 删除和复制表语法

```sql
-- 删除表
drop table <表名>;

-- 复制表内容以及表结构
-- * 可以指定对应的字段，那么就是只复制这几个字段的内容
-- 条件成立就是符合条件的查询内容和表结构，如果条件不成立就是复制表结构
create table <新表名> select * from <旧表名> [条件];

-- 复制表结构
create table <新表名> like <旧表名>
```

具体测试**复制表内容以及表结构**如下：

::: code-group

```sql [target]
/**
movies 表内容及结构如下
+------+--------------+------+
| id   | name         | dir  |
+------+--------------+------+
|    1 | 流浪地球     | NULL |
|    2 | 满江红       | NULL |
+------+--------------+------+

+-------+----------+------+-----+---------+-------+
| Field | Type     | Null | Key | Default | Extra |
+-------+----------+------+-----+---------+-------+
| id    | int(11)  | YES  |     | NULL    |       |
| name  | char(4)  | YES  |     | NULL    |       |
| dir   | char(16) | YES  |     | NULL    |       |
+-------+----------+------+-----+---------+-------+
 */
```

```sql [source]
-- 复制 movies 表内容及结构到 t1 表。
create table t1 select * from movies;
-- 可执行的验证脚本如下：
show tables;
describe t1;
select * from t1;

-- 复制 id 为 1 内容到 t2 表
create table t2 select *  from movies where id=1;

-- 只复制 id 到 t3 表, 并只复制表结构
create table t3 select id from movies where 1=2; -- where 后的表达式永远不成立，则只会

-- 复制表结构
create table t4 like movies;
```

:::

## 数据类型

### 数值类型

#### int

**科普：1 字节等价于 8 比特，8 个二进制数存储数字最大就是 255**

| 类型        |   大小    |                                范围(有符号) |              范围(无符号) |       描述 |
| ----------- | :-------: | ------------------------------------------: | ------------------------: | ---------: |
| `tinyint`   | `1 Bytes` |                                 `-128, 127` |                  `0, 255` | 很小的整数 |
| `smallint`  | `2 Bytes` |                             `-32768, 32767` |                `0, 65535` | 较小的整数 |
| `mediumint` | `3 Bytes` |                         `-8388608, 8388607` |             `0, 16777215` | 一般的整数 |
| `int`       | `4 Bytes` |                   `-2147483648, 2147483647` |           `0, 4294967295` | 标准的整数 |
| `bigint`    | `5 Bytes` | `-9223372036854775808, 9223372036854775807` | `0, 18446744073709551615` | 一般的整数 |

以 `tinyint` 为例，数据库字段最大被插入的范围就应该是 `-128, 127` 之间的数字，如果大于这个数字就不能被插入到数据库。示例代码如下：

```sql
create table t1 (n tinyint);
-- 插入符合规范的最大数
insert into t1 values (-128), (127);
select * from t1;
/**
+------+
| n    |
+------+
| -128 |
|  127 |
+------+
2 rows in set (0.00 sec)
 */

-- 插入不符合规范的数
insert into t1 values (-129), (128);
-- ERROR 1264 (22003): Out of range value for column 'n' at row 1
```

**默认情况下创建出来的字段都是有符号的，如果需要创建无符号的字段就需要另一个约束条件 `unsigned`**

```sql
-- 给 t1 增加一个约束条件的字段
alter table t1 add m tinyint unsigned;
insert into t1 values (0, 255);

/**
可以看出插入的数据没有默认值，就会显示为 NULL, 思考如果在加上 not null 约束条件后呢？
+------+------+
| n    | m    |
+------+------+
| -128 | NULL |
|  127 | NULL |
|    1 |  255 |
+------+------+
 */

-- 创建字段 y 为无符号约束，并且不能为 null, 结果是应该为 NULL 地方全部变成 0
alter table t1 add y tinyint unsigned not null;

-- 如果不能为空的字符类型就对应的是空字符串
alter table t1 add x char not null;
```

整型的宽度实际上是显示字符的宽度，与字符串没有关系。意义实际上并不大。如果想要验证显示字符的宽度，需要用到约束条件 `zerofill` 0 填充。

```sql
create table t3 (n int(3) zerofill) charset=utf8;
insert into t3 values (1), (12), (123), (1234567);

/** 不足三位的 0 补齐, 大于三位的 0 处理。
+---------+
| n       |
+---------+
|     001 |
|     012 |
|     123 |
| 1234567 |
+---------+
 */

-- 如果不指定宽度的话，无符号的宽度会比有符号的宽度少 1， 因为有符号多存了一个负号
create table t4 (x int not null, y int zerofill unsigned not null) charset=utf8 engine=innodb;
/**
+-------+---------------------------+------+-----+---------+-------+
| Field | Type                      | Null | Key | Default | Extra |
+-------+---------------------------+------+-----+---------+-------+
| x     | int(11)                   | NO   |     | NULL    |       |
| y     | int(10) unsigned zerofill | NO   |     | NULL    |       |
+-------+---------------------------+------+-----+---------+-------+
 */
```

#### float

**注意：第一个参数表示字符长度，第二个参数表示小数长度， 比如 float(255, 30) 那么这个字段就是 255-30 整数字符数，小数字符数为 30**

**float 和 double 还会有精度问题，但是一般情况下也足够了，decimal 精度较高常用于一些金融、数据分析类数据**

| 类型      |                       大小                       |                                      范围(有符号) |                 范围(无符号) |           描述 |
| --------- | :----------------------------------------------: | ------------------------------------------------: | ---------------------------: | -------------: |
| `float`   |   `4 Bytes`指定范围 m 最大值 255, d 最大值 30    |     `-3.4E+38 ~ -1.17E-38、0和1.17E-38 ~ 3.4E+38` |   `0 和 1.17E-38 到 3.4E+38` | 单精度浮点数值 |
| `double`  |   `8 Bytes` 指定范围 m 最大值 255, d 最大值 30   | `-1.7E+308 ~ -2.23E-308、0和2.23E-308 ~ 1.7E+308` | `0 和 2.23E-308 到 1.7E+308` | 双精度浮点数值 |
| `decimal` | `decimal(m,d)` 指定范围 m 最大值 65, d 最大值 30 |                                依赖于 m 和 d 的值 |           依赖于 m 和 d 的值 |         小数值 |

```sql
-- 创建指定字段的表
create table t1 (n float(255, 30)) charset=utf8 engine=innodb;
create table t2 (n double(255, 30)) charset=utf8 engine=innodb;
create table t3 (n decimal(65,  30)) charset=utf8 engine=innodb;

-- 插入 30 位小数的值
insert into t1 values (0.111111111111111111111111111111);
/**
+----------------------------------+
| n                                |
+----------------------------------+
| 0.111111111938953400000000000000 |
+----------------------------------+ */
insert into t2 values (0.111111111111111111111111111111);
/**
+----------------------------------+
| n                                |
+----------------------------------+
| 0.111111111111111100000000000000 |
+----------------------------------+ */
insert into t3 values (0.111111111111111111111111111111);
/**
+----------------------------------+
| n                                |
+----------------------------------+
| 0.111111111111111111111111111111 |
+----------------------------------+ */
```

### 字符类型

字符类型主要分为两种 `char` 和 `varchar` 都是可以指定字符的长度。**它们之间的区别是 `char` 会在如果不足的时候会在末尾补齐空格，在取的时候删除空格。`varchar` 则不会。**

- `char` 每次存取都是固定的字符对于已经固定的内容比如 hash 值，使用 `char` 性能会比较好, 但是比较浪费资源。最大 255 字符。
- `varchar` 存多少取多少，不会浪费资源，但是性能对比 `char` 略低。 最大 65535 个字节，但要考虑到需要一个字节为 `NULL` 标识，`varchar` 的每一个数据都要有个头用来记录长度的标识， 当数据长度小于 255 的时候，头占一个字节，当数据长度大于 255 小于 65535 的时候，头占两个字节。但是你还要考虑因为是字节转换成字符的时候也有差异，比如 `gpk` 一个字符是两个字节，`utf8` 一个字符是三个字节。

**总结：大多数情况下还是用的还是 `varchar` 宽度尽可能不要超过 255 因为超过 255 后还要多加一个字节存储字符的长度**

```sql
create table t4 (x char(10), y varchar(10)) charset=utf8 engine=innodb;
insert into t4 values ('  x  ', '  y  ');

-- char_length 用来获取字符的长度
select char_length(x), char_length(y) from t4;
/** 从结果可以看出 char 把结尾的空格给去掉了。varchar 则是原文输出
+----------------+----------------+
| char_length(x) | char_length(y) |
+----------------+----------------+
|              3 |              5 |
+----------------+----------------+ */

-- 测试 utf8 下 varchar 的最大范围 65535 / 3 - 1 = 21844
create table t6 (s varchar(21845)) charset=utf8 engine=innodb;
-- ERROR 1118 (42000): Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs

create table t6 (s varchar(21844)) charset=utf8 engine=innodb;

-- 并且创建 varchar 类型的时候，需要注意一行的数据最大也是 65535，如果这一行有多个字段，varchar 会更小
create table t7 (id int, name varchar(21842)) charset=utf8 engine=innodb;
```

### 时间日期类型

- `year` 年份,格式为 YYYY,例如 2023
- `date` 日期,格式为'YYYY-MM-DD',例如 '2023-02-28'
- `time` 时间,格式为'HH:MM:SS',例如 '15:30:20'
- `datetime` 日期+时间,格式为'YYYY-MM-DD HH:MM:SS',例如 '2023-02-28 15:30:20', 是'1000-01-01 00:00:00' 到 '9999-12-31 23:59:59'。8 个字节
- `timestamp` 时间戳,格式同 DATETIME,但存储的是从 UTC 时间 1970-01-01 00:00:00 到现在的秒数，是 1970 年至 2038 年之间的日期时间。4 个字节

```sql
create table t8 (
  id int,
  name varchar(16),
  born year,
  birth date,
  active time,
  reg_time datetime
) charset=utf8 engine=innodb;

-- 使用 now 函数获取当前的日期, 当数据存储的时候 mysql 会自行处理。
insert into t8 values (1, 'xx', now(), now(), now(), now());
-- 如果想要插入自定义的时间和日期，传入符合格式的字符串即可。
insert into t8 values (2, 'yy', '2000', '2000-02-22', '18:00:00', '2000-02-22 18:00:00');

/**
+------+------+------+------------+----------+---------------------+
| id   | name | born | birth      | active   | reg_time            |
+------+------+------+------------+----------+---------------------+
|    1 | xx   | 2023 | 2023-09-26 | 17:36:08 | 2023-09-26 17:36:08 |
|    2 | yy   | 2000 | 2000-02-22 | 18:00:00 | 2000-02-22 18:00:00 |
+------+------+------+------------+----------+---------------------+ */
```

### 枚举和集合

`enum` 枚举和 `set` 都是用来限定用户可以用来创建什么样的值，`enum` 为单选、`set` 为多选。

```sql
create table t9 (
  id int,
  name varchar(16),
  gender enum('male', 'female', 'other'),
  hobbies set('sing', 'jump', 'rap')
);

insert into t9 values
  (1, 'xx', 'male', 'sing'),
  (2, 'cc', 'other', 'sing,jump,rap');
/**
+------+------+--------+---------------+
| id   | name | gender | hobbies       |
+------+------+--------+---------------+
|    1 | xx   | male   | sing          |
|    2 | cc   | other  | sing,jump,rap |
+------+------+--------+---------------+ */
```

## 条件约束

上篇其实已经有关于约束条件使用的案例了,

```sql
-- 优先级排序如下：
-- unsigned = zerofill > not null = default = unique = primary key

[unsigned] [zerofill] [not null] [default]
-- unsigned       无符号, 也就是说只能是正数不能存在符号, 只能针对 int 类型使用。
-- zerofill       对于没有值的字段，使用 0 进行填充，如果是字符类型则填充空字符。

-- not null       不能为空。
-- default        设置默认值。
-- unique         设置该列是否唯一，或者也可以设置多个列组合的值是否唯一。这两种情况为：
--                单列唯一，复合唯一。
-- primary key    主键不为空且唯一，对于 innodb 的存储类型来说每张表必须有一个主键，
--                如果没有指定 mysql 会查询表中哪个字符合条件就将它设置为组件，否则会
--                自己创建一个隐藏的主键。
--                主键同样可以设置： 单列主键，复合组件。
-- auto_increment 自动递增，递增是从最后一条数据的字段为依据进行递增，并且设置自动递增的
--                字段必须要是 key, unique 或者 primary key 都行，一般为 primary key。
-- foreign key    设置外键，关联表时使用，方式为 foreign key (键名) references 被关联表名(被关联键名)
```

目前来看你可能会疑问为什么 `not null` 一定要在 `unsigned`、`zerofill` 的后面。

```sql
create table t10 (id int zerofill unsigned not null);
describe t10;
/** 可以看出 zerofill unsigned 是针对 type 的约束，not null 是针对值的约束
+-------+---------------------------+------+-----+---------+-------+
| Field | Type                      | Null | Key | Default | Extra |
+-------+---------------------------+------+-----+---------+-------+
| id    | int(10) unsigned zerofill | NO   |     | NULL    |       |
+-------+---------------------------+------+-----+---------+-------+ */
```

### `default` 默认值的应用

```sql
create table t11 (id int, name varchar(16), gender enum('male', 'female') not null default 'male');

-- 插入数据时可以指定插入字段的内容，如果没有插入的值设置了默认值，则使用这个默认值
insert into t11 (id, name) values (1, 'xx');
insert into t11 values (2, 'ff', 'female');
/**
+------+------+--------+
| id   | name | gender |
+------+------+--------+
|    1 | xx   | male   |
|    2 | cc   | female |
+------+------+--------+ */
```

### `unique` 不允许该字段存在重复内容

```sql
create table user (id int unique, name varchar(16) unique);
-- 第二种写法
create table user (id int, name varchar(16), unique(id), unique(name));

describe user;
/** 增加内容后查看表的结构可以看出 Key 显示未 UNI 表示该字段不能重复。
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  | UNI | NULL    |       |
| name  | varchar(16) | YES  | UNI | NULL    |       |
+-------+-------------+------+-----+---------+-------+ */
```

当使用第二种方法时可以指定多个字段不能唯一，比如 a,b 两个字段，a 和 b 都可以重复，但是 a + b 无法重复。

```sql
create table addr (id int, addr varchar(15), port int, unique(id), unique(addr, port));
-- 如果再次插入相同的 ip 和 port 则会报错
insert into addr values (1, '192.168.1.1', 3306);

describe addr;
/** 联合唯一后，可以看出 Key 显示未 MUL
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  | UNI | NULL    |       |
| addr  | varchar(15) | YES  | MUL | NULL    |       |
| port  | int(11)     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+ */
```

### `primary key` 主键的应用

```sql
create table user (id int primary key, name varchar(16));
/** Key 为 PRI 即为主键
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | NO   | PRI | NULL    |       |
| name  | varchar(16) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+ */

-- 验证不指定主键 mysql 自己生成的主键
create table user (id int not null unique, name varchar(16));

/** 指定了不为空且唯一时，Key 仍然是 PRI
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | NO   | PRI | NULL    |       |
| name  | varchar(16) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+ */

-- 复合主键的设置和复合唯一基本相同
create table addr (id int, addr varchar(15), port int, primary key(addr, port));
/**
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  |     | NULL    |       |
| host  | varchar(15) | NO   | PRI | NULL    |       |
| port  | int(11)     | NO   | PRI | NULL    |       |
+-------+-------------+------+-----+---------+-------+ */
```

### `auto_increment` 自动递增

```sql
create table t1 (id int primary key auto_increment, name varchar(16));

-- 再次插入数据时就不需要指定 id
insert into t1(name) values ('zhangsan');
/**
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int(11)     | NO   | PRI | NULL    | auto_increment |
| name  | varchar(16) | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+ */


-- 清空表
-- delete from t1;  清空表中的数据，但是子增值不会被清除。
-- truncate t1;     清空表中的数据，并且清空自增值。

-- 给 t1 插入若干数据后查看递增值, 可以看出 auto_increment 是 9.
show create table t1;
/**
+-------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table | Create Table                                                                                                                                                              |
+-------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| t1    | CREATE TABLE `t1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 |
+-------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------+ */


-- 此时执行 delete from t1; 继续查看，你会发现表中的数据已经被清空，但是 auto_increment 仍然是 9，
-- 再次插入数据时仍然从 9 开始计数自增值。
-- 如果使用 truncate t1; 则将自增值和数据一并删除，再次新增数据时仍然从 1 开始。
```

### `foreign key ... references` 外键（强关联）

假设你现在有一张表 `emp` 员工信息表, 其中包含 `id`、`name`、`gender`、`dep_name`、 `dep_desc`, 分别为名称、性别、部门、部门职责。当数据量增大后，你会发现其中 `dep_name`、`dep_desc` 会有很多重复的字段，并且如果这两个字段的内容有所修改将会变的很麻烦，解决的方式就是创建一个关联表，将部门相关的内容全部抽离出去。

`emp` 只需要存 `dep` 中的对应的部门 `id`，这样就算将来有改变也只需要修改 `dep` 表中对应的信息即可。

```sql
-- 需要注意的是，desc 是关键字所以需要用反引号做转移。
create table dep (
  id int primary key auto_increment,
  name varchar(16),
  `desc` varchar(16)
);

create table emp (
  id int primary key auto_increment,
  name varchar(16),
  gender enum('male', 'femle'),
  dep_id int,
  -- 创建外键，但前提是 dep 这张表已经存在
  foreign key(dep_id) references dep(id)
);


-- 插入测试数据
insert into dep (name `desc`) values ('研发部', '产品研发'), ('产品部', '产品设计');
-- 需要注意，设置了外键之后，如果插入不不存在的外键 id 则会报错。
insert into emp (name gender, dep_id) values ('张三', 'male', 1), ('李四', 'male', 2);
```

#### 同步

假设先在老板嫌弃研发部投入太大，需要裁撤这个部门。表面来看，直接把 `dep` 表中的数据直接删除即可。实际上你这么操作是错误的，因为 `dep` 中关联了 `emp` 的 id, 如果真的要删，需要先把 `dep` 下面的研发部门删掉，然后再去删 `emp` 中研发部的人。除了删除之外修改也不可以。

```sql
delete from emp where dep_id=1;
delete from dep where id=1;

update emp dep_id=999 where id=2;
update dep id=999 where id=2;
```

如果想要解决上面的问题，在创建表的时候需要执行删除和更新同步 `on delete cascade` `on update cascade`; 随后操作 `dep` 表中的数据后，对应的 `emp` 表只要有关联 id 的数据都会被同步删除或者修改

```sql
create table emp (
  id int primary key auto_increment,
  name varchar(16),
  gender enum('male', 'female'),
  dep_id int,
  foreign key(dep_id) references dep(id) on delete cascade on update cascade
);
```

#### 关系

- 多对一：两张表不管站在哪张表的角度看，要么多对一，要么是一对多，这就是多对一关系。比如上面示例中的员工表和部门表，站在员工表的角度多个员工可以属于一个部门；站在部门表的角度来看一个部门可以对应多个员工。**对于多对一的关系，外键字段要建在多的一方**，比如多个员工可以在一个部门，外键就在员工这里。

- 多对多：站在两张表的角度都能找到多条关联。假设现在有个歌曲表 `song` 和歌手表 `singer`, 首先从 `song` 来看，多个歌曲可能会属于同一个歌手，再从 `singer` 来看多个歌手也可能合唱一首歌。那这就是多对多的关系，对于多对多的关系需要把外键抽离出来建立第三张表。

```sql
-- 创建 song
create table song (id int primary key auto_increment, name varchar(16));
-- 创建 singer
create table singer (id int primary key auto_increment, name varchar(16));
-- 创建关联表
create table song2singer (
  id int primary key auto_increment,
  song_id int,
  singer_id int,
  foreign key(song_id) references song(id) on delete cascade on update cascade,
  foreign key(singer_id) references singer(id) on delete cascade on update cascade
);

-- 数据插入
insert into song(name) values('青花瓷'), ('稻香'), ('串烧');
insert into singer(name) values ('周杰伦'), ('歌手b'), ('歌手b'), ('歌手c');
insert into song2singer(song_id, singer_id), values (1, 1), (2, 1), (3, 2), (3, 3), (3, 4);
```

- 一对一：无论站在两个表的哪一个角度都只能找到单独的关系，假设现在有两张表 客户表`customer` 业主表`owner`, 客户能发展成业主，业主和客户也是一一对应的，此时外键应该建在哪里就要根据实际情况来确定，想想一下如果将外键放在 `customer` 中，是不是意味着一定要有对应的业主， 这显然是不合理的，所以外键只能放在 `owner` 表中，因为业主是由客户发展而成的。

```sql
-- 创建客户表
create table customer (id int primary key, name varchar(16), gender enum('male', 'female'), mobile int(11));
-- 创建业主表
create table onwer (
  id int primary key,
  room_num int,
  is_loan enum(true, false),
  customer_id int unique,
  foreign key(customer_id) references customer(id) on delete cascade on update cascade
);

-- 插入数据
insert into customer values (1, '张三', 'male', 124), (2, '李四', 'male', 125);
insert into onwer values (1, 8002, false, 1), (2, 9002, true, 2);
```

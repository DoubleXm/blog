---
isTimeLine: true
title: MySQL 单表查询语句
date: 2020-10-27
tags:
 - 数据库
 - MySQL
categories:
 - 数据库
---

## 单表查询语句

```sql
select distinct <字段......> from <库名>.<表名>
  where <过滤条件>
  group by <分组条件>
  having <过滤条件>
  order by <排序字段> <ASC | DESC> -- 默认升序 ASC
  limit n;

/**
  执行顺序如下:
    1. from 找到表
    2. where 过滤
    3. 把过滤之后的数据通过 group by 分组
    4. 与 where 作用一致，是 group by 的结果（聚合数据和分组结果）进行过滤
    5. 对查询后的数据进行排序，默认为 ASC
    6. limit 限制排序或查询后的数据数量
    7. 然后 select 查询出数据
  书写时尽可能按照执行顺序书写，方便思维及规范的养成！！！
 */
```

::: details 测试数据创建

```sql
create database db5;
use db5;
create table emp(
 id int primary key auto_increment,
 name varchar(16) not null,
 gender enum('male', 'female') not null,
 age int not null,
 salary float(10, 2),
 dep varchar(32),
 notes varchar(64)
);
insert into emp(name, gender, age, salary, dep) values
('关⽻', 'male', 20, 8000, '技术部'),
('张⻜', 'male', 25, 12000, '技术部'),
('赵云', 'male', 19, 6800, '技术部'),
('⻢超', 'male', 26, 11000, '技术部'),
('⻩忠', 'female', 48, 15000, '技术部'),
('夏侯惇', 'male', 36, 34000, '技术部'),
('典⻙', 'male', 19, 6500, '技术部'),
('吕布', 'female', 20, 9000, '技术部'),
('周瑜', 'female',32, 36000, '技术部'),
('⽂丑', 'male', 27, 24000, '技术部'),
('刘备', 'male', 32, 4000, '市场部'),
('诸葛亮', 'male', 27, 2700, '市场部'),
('庞统', 'male', 37, 4200, '市场部'),
('徐庶', 'male', 36, 4000, '市场部'),
('荀彧', 'male', 25, 2400, '市场部'),
('荀攸', 'male', 25, 2400, '市场部'),
('鲁肃', 'male', 43, 4300, '市场部'),
('司⻢懿', 'female', 44, 5000, '市场部'),
('杨修', 'male', 19, 800, '市场部'),
('丁仪', 'male', 49, 3500, '市场部'),
('宋江', 'male', 30, 4000, '⼈事部'),
('吴⽤', 'male', 38, 3000, '⼈事部'),
('扈三娘', 'female', 42, 2500, '⼈事部'),
('顾⼤嫂', 'female', 38, 3300, '⼈事部'),
('孙⼆娘', 'female', 32, 2400, '⼈事部'),
('丁得孙', 'male', 32, 2800, '⼈事部'),
('柴进', 'male', 30, 4200, '财务部'),
('卢俊义', 'male', 44, 4000, '财务部');
```

:::

### `distinct` 使用

需要注意的是 `distinct` 是针对结果的去重，如果查询多列会根据多列进行去重。

```sql
select distinct dep from emp;
/**
+-----------+
| dep       |
+-----------+
| 技术部    |
| 市场部    |
| ⼈事部    |
| 财务部    |
+-----------+ */

-- 该结果，就会出现很多重复的 dep
select distinct dep, salary from emp;
```

### 四则运算

`mysql` 支持对于字段的基本运算。

```sql
-- 求每个人的年薪
select name, salary * 12 from emp;
/**
+-----------+-------------+
| name      | salary * 12 |
+-----------+-------------+ */

-- 更改表头可以用 as 起别名
select name, salary * 12 as yearly_salary from emp;
/**
+-----------+---------------+
| name      | yearly_salary |
+-----------+---------------+ */
```

### `concat` 内容拼接

类似于 `py` 中的字符串拼接，能够将内容格式化成想要的样子。

```sql
select concat('姓名：', name, '年龄：', age), concat('性别：', gender) from emp;
/** 一个 concat 表示一列，也可以为表头起别名 使用 as
    select concat('姓名：', name, '年龄：', age) as info from emp;
+---------------------------------------------+-----------------------------+
| concat('姓名：', name, '年龄：', age)       | concat('性别：', gender)    |
+---------------------------------------------+-----------------------------+
| 姓名：关⽻年龄：20                          | 性别：male                  | */


-- 另一种 format 方式，则可以指定分隔符，直接进行拼接
select concat_ws(' - ', name, age, gender) from emp;
/** 同样可以使用别名对表头格式化
  select concat_ws(' - ', name, age, gender) as user_info from emp;
+-------------------------------------+
| concat_ws(' - ', name, age, gender) |
+-------------------------------------+
| 关⽻ - 20 - male                    | */
```

### `where` 查询条件

对检索出来的内容进行条件过滤。`where` 后跟表达式。

```sql
select name, age from emp where age > 35;

-- and 并且
select name, age from emp where dep='技术部' and age > 35;

-- 查询 年龄大于等于 30 小于等于 40
select name, age from emp where age >= 30 and age <= 40;
-- 同样的查询可以使用 between 如下语句, 闭区间，包含 30 和 40
select name, age from emp where age between 30 and 40;

-- or 或者
-- 查询小于 30 或者 大于 40
select name, age from emp where age < 30 or age > 40;

-- not 非
-- 对于小于 30 取非 >= 30 或者 大于 40的内容
select name, age from emp where not age < 30 or age > 40;

-- in 算是 or 的变相简写
select name, salary from emp where salary=3000 or salary=4000 or salary=5000;
select name, salary from emp where salary in (3000, 4000, 5000);

-- is null 是否为 null, 需要注意的是空字符串不是 null
select * from emp where notes is null;
select * from emp where notes is not null; -- is null 的取反

-- like 模糊匹配, _ 表示任意一个字符（可以被多次使用）, % 表示任意多个字符
select * from emp where name like '荀_';
select * from emp where name like '丁__'; -- 匹配 丁xx
select * from emp where name like '丁%';

-- 正则匹配
select * from emp where name regexp '^(丁|荀).';
```

### `group by` 分组条件

对查询的结果进行分组，需要注意的是分组后只能查询被分组的字段，不能随意查询数据。如果只能查询分组的字段，那显然意义不大。分组后要查询的是分组的信息，这是需要配合聚合函数，从每一组中拿到想要的数据。

```sql
-- 根据部门进行分组
select dep from emp group by dep;

-- 聚合函数  count sum max min avg, 针对是组的操作，
-- 如果不使用 group by 默认就是一组。so 聚合函数可以在非 group by 语句中使用。
select dep, count(name) from emp group by dep; -- 每组的人头数
select dep, sum(salary) as sum_salary from emp group by dep; -- 每组的工资总和
select dep, max(salary) from emp group by dep; -- 每组的最高工资
select dep, min(salary) from emp group by dep; -- 每组的最低工资
select dep, avg(aslary) from emp group by dep; -- 每组的平均工资

-- group_concat 拼接分组的内容, 比如查询每个部门下的所有名字
select dep, group_concat(name) from emp group by dep;
/**
+-----------+-----------------------------------------------------------------------------+
| dep       | group_concat(name)                                                          |
+-----------+-----------------------------------------------------------------------------+
| ⼈事部    | 丁得孙,孙⼆娘,顾⼤嫂,扈三娘,吴⽤,宋江                                       |
| 市场部    | 鲁肃,荀攸,荀彧,徐庶,庞统,诸葛亮,刘备,司⻢懿,杨修,丁仪                       |
| 技术部    | 张⻜,⽂丑,周瑜,吕布,典⻙,夏侯惇,⻩忠,⻢超,赵云,关⽻                         |
| 财务部    | 柴进,卢俊义                                                                 |
+-----------+-----------------------------------------------------------------------------+ */

-- 习题一：统计每个部门员工大于45 的数量
select dep, count(id) from emp where age > 45 group by dep;
-- 习题二：统计男员工和女员工的数量
select gender, count(id) from emp group by gender;
```

### `having` 过滤条件

对分组后的数据进行过滤，可以理解成 `where` 为前置过滤条件， `having` 则是后置的过滤条件，只能对 `group by` 后的聚合数据和结果进行条件过滤。

```sql
-- 查询所有部门内，员工数量小于5的部门以及部门内的员工名和员工数量
select dep, group_concat(name) as name, count(id) from emp group by dep having count(id) < 5;

-- 查询各部门年龄大于35的员工超过三个人的部门名，以及大于35的人数
select dep from emp where age > 35 group by dep having count(name) > 3;
```

### `order by` 排序

对查询到的内容进行排序，默认情况下按照 `id` 升序，默认值为 `ASC`。

```sql
-- 按照工资升序
select * from emp order by salary;
-- 按照工资降序
select * from emp order by salary desc;

-- 如果工资相同的话，可以按照第二个字段进行排序
select * from emp order by salary desc, id desc;
```

### `limit` 限制展示的条数

```sql
-- 展示 5 条数据
select * from emp limit 5;
-- 找出公司工资最高的 5 个人
select * from emp order by salary desc limit 5;

-- 分页 n（不包含n） 开始查询 n 个
select * from emp limit 0, 10; -- 前 10 条数据
select * from emp limit 20, 10; -- 11 到 20
select * from emp limit 30, 10; -- 21 到 30
```

## 函数

### 字符串函数

```sql
select concat('a', 'b', 'c');  -- 字符串拼接
select lower('HELLO');   -- 转⼩写
select upper('hello');    -- 转⼤写
select lpad('hello', 10, '-');  -- 左填充，⽤字符串 - 在"hello"的左边填充⾄10个字符，原字符串⻓度超过10，则会截取⾄10个字符
select rpad('hello', 10, '-');  -- 右填充，⽤字符串 - 在"hello"的右边填充⾄10个字符，原字符串⻓度超过10，则会截取⾄10个字符
select trim('  hello ');   -- 去掉字符串两端的空格
select substring('hello',2,3); -- 字符串切⽚，从第2个字符开始，切3个字符
```

### 数字函数

```sql
select ceil(1.3);   -- 向上取整
select floor(1.6);   -- 向下取整
select mod(10,3);   -- 获取10/2的模
select rand();    -- 获取0～1的随机⼩数
select round(3.1415926,4); -- 对3.1415926四舍五⼊，保留4位⼩数
```

### 日期处理函数

```sql
-- 获取当前⽇期select '当前时间', curtime();
-- 获取当前时间select '当前⽇期时间', now();
select '当前⽇期', curdate();   -- 获取当前⽇期和时间
select '年', year('2023-10-08 18:36:59');  -- 获取date_time的年份
select '⽉', month('2023-10-08 18:36:59');  -- 获取date_time的⽉份
select '⽇', day('2023-10-08 18:36:59');  -- 获取date_time的⽇期
select '时', hour('2023-10-08 18:36:59');  -- 获取date_time的⼩时
select '分', minute('2023-10-08 18:36:59');  -- 获取date_time的分钟
select '秒', second('2023-10-08 18:36:59');  -- 获取date_time的秒

-- 时间差计算，interval单位:year,month,day,hour,minute,second,microsecond
select date_add(now(), interval 1 year);  -- 获取从now()开始,1天后的时间
select date_add('2023-10-08 18:36:59', interval 1 month);  -- 获取指定时间1⽉后的时间
select datediff('2025-10-08 18:36:59', now()); -- 获取两个时间之间的天数，第⼀个值减去第⼆个值
select timediff('2023-10-08 18:36:59', '2023-10-08 12:00:00'); -- 获取两个时间之间的时间差值
```

### 流程控制函数

```sql
-- 单分⽀
-- 如果性别等于male返回⼩哥哥，否则返回⼩姐姐
select name, if(gender='male', '⼩哥哥', '⼩姐姐')as '性别' from emp;
-- 如果第⼀个值不为空，则返回第⼀个值，否则返回第⼆个值
select ifnull(gender, '未知') from emp;
select ifnull(notes, '没有任何内容哦') from emp;

-- 多分⽀
-- ⼯资⼤于10000：核⼼员⼯
-- ⼯资5000-10000：普通员⼯
-- ⼯资5000以下：新员⼯
select
  name,
  case when salary>10000 then '核⼼员⼯' when salary > 5000 then'普通员⼯' else '新员⼯' end as '员⼯级别'
  from emp;

-- 技术部：⾼级技术顾问
-- ⼈事部：HR
-- 其它：销售经理
select
  name,
  case dep when '技术部' then '⾼级技术顾问' when '⼈事部' then 'HR' else '销售经理' end as '职位'
  from emp;
```

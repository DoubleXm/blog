# Shell 脚本实践

## 批量创建用户

### 输入/输出重定向细节

| 命令 | 含义 |
| --- | --- |
| `n >& m` | 将输出文件 m 和 n 合并 |
| `n <& m` | 将输入文件 m 和 n 合并 |

> [!NOTE]
> &emsp; 文件描述符 0 通常是标准输入（STDIN），1 是标准输出（STDOUT），2 是标准错误输出（STDERR）。
>
> &emsp; 如果希望 stdout 和 stderr 合并保存到一个文件可以使用 `command > file 2>&1`。
>
> &emsp; 如果希望执行某个指令但是不想看到输出结果，可以使用 `command > /dev/null`。`/dev/null` 是一个特殊的文件，写入到它的内容都会被丢弃；读取不到任何信息。将命令输出重定向到它，会有**禁止输出的效果**。

```sh :no-line-numbers
#!/bin/bash
USER_FILE=user.txt
for USER in user_name{1..5}; do
    if ! id $USER &>/dev/null; then
        useradd $USER
        PASSWORD=$(echo $RANDOM|md5sum|cut -c 1-8)
        echo $PASS | password --stdin $USER &>/dev/null
        echo "$USER $PASS" >> $USER_FILE
        echo "$USER  被成功创建！"
    else
        echo "$USER 创建失败"
    fi
done
```

## 检查主机存活状态

```sh :no-line-numbers
#!/bin/bash
for IP in $@; do
    if ping -c 1 $IP &>/dev/null; then
      echo "$IP is alive"
    else
      echo "$IP is down"
    fi
done
```

## 监控 cpu 使用率

```sh :no-line-numbers
#!/bin/bash
cpu() {
  local user system idle await 
  user=$(vmstat | awk 'NR==3{print $13}')
  system=$(vmstat | awk 'NR==3{print $14}')
  idle=$(vmstat | awk 'NR==3{print $15}')
  await=$(vmstat | awk 'NR==3{print $16}')
  steal=$(vmstat | awk 'NR==3{print $17}')
  echo "user=$user, system=$system, idle=$idle, await=$await, steal=$steal"
}
cpu
```

## 监控内存使用量

```sh :no-line-numbers
#!/bin/bash
mem() {
  local total used free
  total=$(free -m | awk 'NR==2{print $2}')
  used=$(free -m | awk 'NR==2{print $3}')
  free=$(free -m | awk 'NR==2{print $4}')
  echo "total=$total, used=$used, free=$free"
}
mem
```

## 检测 ngxin 服务

```sh :no-line-numbers
#!/bin/bash

function nginx_check() {
  nginx_number=$(ps -ef | grep nginx | grep -v grep | wc -l)
  if [ $nginx_number -gt 2 ]; then
      echo "nginx is running"
  else
      echo "nginx is down"
      systemctl start nginx
  fi
}
```
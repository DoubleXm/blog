---
isTimeLine: true
title: 网络编程 socket
date: 2020-10-27
tags:
 - Python
---

## socket

`Socket` 又称"套接字"，应用程序通常通过"套接字"向网络发出请求或者应答网络请求，**使主机间或者一台计算机上的进程间可以通讯**

## 创建 socket

```py
import socket

s = socket.socket(family, type, proto)
```

- `family`: 套接字家族可以是 `AF_UNIX`(适用于本机多进程通信) 或者 `AF_INET`(IPv4 协议)
- `type`: 套接字类型可以根据是面向连接的还是非连接分为 `SOCK_STREAM`(用于面向连接的 TCP 协议, 可靠字节流) 或 `SOCK_DGRAM`(用于无连接的 UDP 协议, 不可靠字节流)
- `proto`: 一般不填默认为 0.

## 内置方法

| 方法名      |                               描述                                |                                 示例 |
| ----------- | :---------------------------------------------------------------: | -----------------------------------: |
| 服务端方法  |
| `bind()`    |     绑定地址到套接字， 在 `AF_INET` 下,以元组的形式表示地址。     |                 `bind((host, port))` |
| `listen()`  |   开始 TCP 监听。该值至少为 1，大部分应用程序设为 5 就可以了。    |                          `listen(1)` |
| `accept()`  |          被动接受 TCP 客户端连接,(阻塞式)等待连接的到来           |              `conn, addr = accpet()` |
| 客户端方法  |
| `connect()` | 主动初始化 TCP 服务器连接。如果连接出错，返回 socket.error 错误。 |              `connect((host, port))` |
| 通用方法    |            **注意：服务端调用时需要使用 `conn` 对象**             |
| `recv()`    |           接收 TCP 数据，数据以字符串形式返回, 注意解码           | `msg = s.recv(1024).decode("utf-8")` |
| `send()`    |   发送 TCP 数据，将 string 中的数据发送到连接的套接字。注意编码   |        `s.send(msg.encode("utf-8"))` |

## 聊天室案例

::: code-group

```py [server.py]
import socket

# 创建 server 对象
socket_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 绑定 ip 端口
socket_server.bind(("0.0.0.0", 3000))
# 设置连接数
socket_server.listen(1)
# 建议 socket 连接
conn, addr = socket_server.accept()

while True:
    # 对客户端发送信息
    msg = input("输入对客户端发送的消息：").encode("utf-8")
    conn.send(msg)

    # 接收客户端的信息
    client_msg = conn.recv(1024).decode("utf-8")
    print(f"接收客户端消息：{client_msg}")

    # 如果客户端发来 exit, 则关闭 socket
    if client_msg == "exit":
        break

# 关闭 socket 连接
socket_server.close()
```

```py [client.py]
import socket

# 创建 client 对象
socket_client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 与服务端建立连接
socket_client.connect(("0.0.0.0", 3000))

while True:
    # 接收 server 端数据
    server_msg = socket_client.recv(1024).decode("utf-8")
    print(f"接收服务端消息：{server_msg}")

    # 如果 server 发来 exit, 同样像服务端也发送此消息。并关闭客户端连接
    if server_msg == "exit":
      socket_client.send("exit".encode("utf-8"))
      break

    # 像服务端发送数据
    msg = input("输入对服务端发送的消息：").encode("utf-8")
    socket_client.send(msg)


# 关闭 socket 连接
socket_client.close()
```

:::

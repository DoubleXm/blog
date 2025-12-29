> [!NOTE]
> 容器共享主机内核，轻量、隔离并且高效，不像虚拟机需要完整的操作系统。
> - **容器 Container** 轻量化运行的实例，包含应用代码、运行时环境和依赖库。基于**镜像**创建，与其他容器隔离，共享主机操作系统内核（比虚拟机更高效）
> - **镜像 Image** 只读模板，定义了容器的运行环境（如操作系统、软件配置）。通过分层存储（`Layer`），优化空间和构建速度。
> - **Dockerfile** 文本文件、描述如何自动构建镜像，例如基础镜像、安装软件、复制文件等。
> - **仓库 Registry** 存储和分发镜像的平台，比如 `Docker Hub`

![alt text](/devops/02-docker.webp)


[安装指南](https://docs.docker.com/engine/install/centos/)

```sh :no-line-numbers
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

直接使用官方镜像拉取，大概率是下载不成功的，可以考虑使用国内的镜像源 [具体参考](https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/)

```sh :no-line-numbers
# 执行该指令切换为清华大学镜像源
sed -i 's+https://download.docker.com+https://mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```

安装完成后启动，并设置开机启动

```sh :no-line-numbers
systemctl start docker.service
systemctl enable docker.service
```

安装完成后仍然需要配置镜像源，不然镜像拉取也是费劲 [参考](https://github.com/dongyubin/DockerHub)

## 容器与镜像的关系

> [!NOTE]
> - **镜像** 容器的静态模板，包含了应用程序运行所需要的一来和文件，镜像是不可变的。
>
> - **容器** 镜像的一个运行实例，具有自己的文件系统、进程、网络等且是动态的。容器从镜像启动，并在运行时保持可变。

## 镜像基本操作

| 命令 | 作用 |
| --- | --- |
| `docker image ls \| docker images` | 列出所有镜像 |
| `docker pull [镜像名]` | 拉取镜像 |
| `docker push [镜像名]` | 推送镜像 |
| `docker build` | 根据 `Dockerfile` 构建镜像 |
| `docker rmi [镜像名]` | 删除镜像 |
| `docker image prune` | 删除所有未使用的镜像，没有标记或者没有任何容器引用 |
| `docker search [镜像名]` | 查找镜像 |
| `docker history [镜像名]` | 查看镜像历史 |
| `docker inspect [镜像名 \| 容器名]` | 显示镜像或者容器详细信息 |
| `docker tag [镜像名] [标签/镜像名]` | 为镜像打标签，只是别名，不会占用额外存储空间 |
| `docker save -o 文件.tar 镜像名` | 将镜像打包为 tar 文件 |
| `docker load -i [镜像名].tar` | 从 tar 文件中加载镜像 |

## 容器基本操作

如果你实在是忘记了后面的参数，可以使用 `docker [command] --help` 查看具体的用法。

| 命令 | 作用 | 
| --- | --- |
| `docker run [容器ID/容器名]` <br> `docker container run [容器ID/容器名]` | 启动容器 |
| `docker build` | 构建镜像 |
| `docker logs` | 查看容器的日志 | 
| `docker ps` | 列出当前正在运行的容器	| 
| `docker stop [容器ID/容器名]`<br> `docker start [容器ID/容器名]` <br> `docker restart [容器ID/容器名]`| 容器启停 | 
| `docker stats [容器ID/容器名]` | 显示容器资源统计，不指定默认查看所有 |
| `docker rm [容器ID/容器名]` | 删除停止的容器 | 
| `docker rename [容器ID/容器名] [新容器名]` | 容器重命名 |
| `docker container prune` | 删除所有停止的容器 |
| `docker exec [容器ID/容器名]` | 在运行的容器中执行指令 |
| `docker attach [容器ID/容器名]` | 运行中的容器中附加终端 |
| `docker login` | 登录DockerHub |
| `docker logout` | 登出DockerHub |
| `docker export [容器ID/容器名]` | 导出容器的文件系统为 `tar` 文件，主要用于备份迁移容器的文件系统 |
| `docker import` | 导入 `tar` 文件为镜像，其实是属于镜像操作了 |
| `docker commit [容器ID/容器名] [镜像名:标签]` | 创建镜像 |


### `docker run`

- `-d` 后台运行
- `-it` 交互式
- `-p` 端口映射
- `-P` 随机映射端口
- `--name` 给容器指定一个名字
- `--env | -e` 设置环境变量

```bash :no-line-numbers
# 启动 ubuntu 容器后台运行
docker run -d ubuntu

# 交互式启动 ubuntu 容器，并且指定终端的 shell 是 bin/bash
docker run -it ubuntu /bin/bash

# 将容器的 80 端口映射到主机的 3000 端口，后台启动 ngxin 容器
docker run -d -p 3000:80 nginx

# 随机映射一个端口
docker run -d -P nginx

# 设置环境变量
docker run -e MY_ENV_VAR=my_value ubuntu

# 设置容器名称
docker run -d --name web_service nginx
```

### `docker build`

`docker build [OPTIONS] PATH | URL | -`

- `PATH`： 包含 `Dockerfile` 的路径或者 `.` 当前目录
- `URL`： 包含 `Dockerfile` 的远程仓库地址
- `-`： 从标准输入中读取 `Dockerfile`

常用选项

- `-t | --tag`：为构建的镜像指定名称和标签
- `-f | --file`： 指定 `Dockerfile` 的路径（默认是 `PATH` 下的 `Dockerfile`）
- `--build-arg`： 设置构建参数
- `--no-cache`： 构建镜像过程中不使用缓存

以简单的 `express` 服务器为例，构建镜像。`Dockerfile` 内容如下

```bash :no-line-numbers
# Dockerfile
FROM node:20.5.0-alpine

WORKDIR /app
COPY . .
RUN npm install
CMD [ "npm", "run", "dev" ]

# 构建镜像
docker build --no-cache -t express-server .
# 构建之后使用 docker images 就会出现名称为 express-server 的镜像
# 运行镜像就可以访问 3000 端口查看 express 服务了。
docker run -d -p 3000:3000 express-server 

# 传递传输时，在 Dockerfile 中可以使用以下方式进行访问。
# RUN echo "Build argument MY_ARG is: ${MY_ARG}"
docker build --build-arg MY_ARG=my-value -t express-server .
```

### `docker logs`

- `-f` 类似于 `tail -f`
- `-t` 显示日志时间戳
- `--tail` 仅显示日志的最后部分，比如 `--tail 10`

```bash :no-line-numbers
docker logs -f -t --tail 10 web_service
```

### `docker ps`

默认查看所有运行中的容器

- `-l`：显示最近创建的容器，包含所有状态
- `-a`：显示所有容器，包含所有状态
- `-n`：显示最近创建的 n 个容器，包含所有状态
- `-s`：显示容器的大小

容器的状态有 7 中
| 状态 | 说明 |
| --- | --- |
| created | 创建完成，但还没有启动 |
| running | 正在运行 |
| paused | 暂停 |
| exited | 退出 |
| dead | 挂起 |
| restarting | 重启中 |
| removed | 删除 |

```bash :no-line-numbers
# 显示最近创建的 5 个容器
docker ps -n 5
```

### `docker rm`

- `-f` 强制删除正在运行的容器，使用 `SIGKILL` 9 信号

```bash :no-line-numbers
docker rm -f web_service
```

### `docker commit`

`-a` 添加作者
`-m` 添加描述
`-p` 提交镜像前暂停容器，默认 true

```bash :no-line-numbers
docker commit -a "author" -m "description" web_service web_service:v1

docker run -d web_service:v1
```

### `docker export` & `docker import`

`-o` 将输出保存到指定文件

```bash :no-line-numbers  
# 打包出来内容是 容器的文件系统。包含 /app 目录
docker export -o node-service.tar node_service

# 将导出的 tar 再导入到 docker image 中
# !!! 但是 导入的镜像不一定就可以运行，因为导出的只是文件系统，可能会缺少一些元数据
# 可以使用 commit 将容器提交为镜像，在配合 save 和 load 去做个事情。
docker import node-service.tar node-service
```

### `docker exec` & `docker attach`

- `-it` 交互式，输出 `exit` 退出， `attach` 没有这些参数。

`exec` 和 `attach` 最大的区别就是 `exec` 不会停止容器，`attach` 会将容器停止。

```bash :no-line-numbers
# 进入容器内部，容器内部就是一个完整的 linux 环境 并指定终端的 shell
docker exec -it web_service /bin/bash

docker exec -it web_service ls /app # 列出 app 目录下的文件
docker exec -it web_service touch /app/test.txt # 创建一个 test.txt 文件
```


## 卷操作 volume

用于持久化数据数据的文件系统，可以在容器之间的数据共享和复用。当容器停止或者被删除时，数据仍然会被保留。

| 指令 | 说明 |
| --- | --- |
| `docker volume create [ 卷名 ]` | 创建一个卷 |
| `docker volume ls` | 列出所有卷 |
| `docker volume inspect [ 卷名 ]` | 查看卷信息 |
| `docker volume rm [ 卷名 ]` | 删除一个卷或多个卷 |
| `docker volume prune` | 删除所有未使用的卷 |

```bash :no-line-numbers
docker volume create node-logger
# 查看卷的详细信息
docker volume inspect node-logger
# [
#     {
#         "CreatedAt": "2025-07-31T19:04:31+08:00",
#         "Driver": "local",
#         "Labels": null,
#         "Mountpoint": "/var/lib/docker/volumes/node-logger/_data",
#         "Name": "node-logger",
#         "Options": null,
#         "Scope": "local"
#     }
# ]

docker volume ls
# DRIVER    VOLUME NAME
# local     node-logger

# 删除卷 
docker volume rm node-logger node-logger-1 node-logger-2 ...
```

在执行 `docker run` 的时候可以指定 `volume` 的挂载方式，有三种如下：

- **Bind Mount**： 绑定到主机文件系统，只有手动清理数据才会消失。
- **Named Volume**： `Docker` 存储目录，`docker volume rm` 后会自动删除。
- **Tmpfs Mount**：数据在内存中，当 `docker stop` 数据丢失。

默认情况下如果什么参数也没有，则是 `Docker` 自动创建可写的容器层，只有执行 `docker rm` 的时候，数据才会被删除。

### Bind Mount

绑定到主机的文件系统，每个容器运行起来其实就是一个完整的 `linux` 系统。此操作就是将容器内的某个文件夹和外部的做出绑定，有点类似于软连接

```bash :no-line-numbers
# 启动 service:v1 容器，指定容器名，并且将系统的 tmp 和 容器的 tmp 绑定。
# -v 前面是主机路径，后面是容器内路径
docker run --name bind-mount -v /tmp:/tmp -d service:v1

# 此时 /tmp 的任何变动都会被同步，达到持久化的目的。只能手动清理
# 可以通过以下指令进入容器内部，测试效果
docker exec -it bind-mount /bin/bash
```

### Named Volume

使用 `docker volume` 创建数据卷进行绑定。只要数据卷不被删除，数据就会被保留。同时存在两份，一份在容器内，一份在宿主机。

```bash :no-line-numbers
docker volume create named_volume
# 需要查看 inspect 中的 Mountpoint 地址
docker volume inspect named_volume

# -v 前面是数据卷名称，后面是数据卷地址
docker run --name named-volume -v named_volume:/var/lib/docker/volumes/named_volume/_data -d service:v1
```

### Tmpfs Volume

```bash :no-line-numbers
docker run --tmpfs /tmp:rw,size=100m -d alpine

# 也可以不指定，这样可能会把内存占满
docker run --tmpfs /tmp -d alpine
```

## 网络 network


| 指令 | 说明 |
| --- | --- |
| `docker network ls` | 列出所有网络 |
| `docker network create [ 网络名 ]` | 创建一个网络 |
| `docker network inspect [ 网络名 ]` | 查看网络信息 |
| `docker network rm [ 网络名 ]` | 删除一个网络或多个网络 |
| `docker network prune` | 删除所有未使用的网络 |
| `docker network connect [ 网络名 ] [ 容器名 ]` | 将容器连接到网络 |
| `docker network disconnect [ 网络名 ] [ 容器名 ]` | 将容器从网络断开 |

```
docker network ls

NETWORK ID     NAME      DRIVER    SCOPE
bad191c1899f   bridge    bridge    local
6afb82bee62d   host      host      local
a8a61a6bca9d   none      null      local

运行容器时可以使用 --network 指定容器使用的网络， 默认 bridge

- null 没有网络
- host 直接使用主机的网络，容器和主机共享网络栈。容器的 IP 和 主机的 IP 一致
- bridge 桥接网络，容器之间可以通过 IP 通信。会为每个容器分配 IP 地址
```

### bridge 桥接

当使用 `docker network inspect bridge` 查看 bridge 网络的详细信息时，会发现有一个 `Containers` 字段，里面包含了所有连接到 bridge 网络的启动中的容器。

其中的 `IPv4Address` 就是容器的 IP 地址。容器之间是可以被访问的。

```bash :no-line-numbers
# 创建两个 nginx 容器
docker run --name nginx1 -d nginx
docker run --name nginx2 -d nginx

# 进入到其中一个容器去 ping 另一个容器的 ip
docker exec -it nginx1 /bin/bash
# ping 可能不存在需要被下载
ping 172.17.0.2 # nginx2 的 IPv4Address

# 只是 ping IP 还不够，因为每个容器的 ip 存在不固定性
# 可以通过 --link 执行容器名
docker run --name nginx2 --link nginx1 -d nginx

# 进入 nginx2 容器，查看 /etc/hosts 文件
docker exec -it nginx2 /bin/bash
# 实际上就是在 hosts 文件中添加了一个 nginx1 的记录
cat /etc/hosts
# 172.17.0.2 nginx1 nginx1.bridge
```

### --net 指定网络模式

``` bash :no-line-numbers
docker run --name nginx1 --net none -d nginx
docker run --name nginx2 --net host -d nginx
```

### 端口映射

通过 `docker inspect [ 容器名 ]` 可以查看容器的详细信息，其中的 `ExposedPorts` 字段就是容器暴露的端口。


``` bash :no-line-numbers
docker inspect mysql_5.7

# "ExposedPorts": {
#     "3306/tcp": {},
#     "33060/tcp": {}
# },
```

```bash :no-line-numbers
# 通过 -p 将容器的 80 端口映射到主机的 8080 端口
docker run --name port_nginx -d -p 8080:80 nginx
```

可以通过 `docker port [ 容器名 ]` 查看端口映射关系

```bash :no-line-numbers
docker port port_nginx
# 或者使用 
docker container port port_nginx
# 8080/tcp -> 0.0.0.0:8080
# 8080/tcp -> :::8080
```
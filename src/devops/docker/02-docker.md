## docker compose 

> [!IMPORTANT]
>
> compose 是用于运行多个 docker 容器的工具，通过 yaml 文件配置容器的运行参数，通过指令根据配置文件中的参数创建并启动容器。
>
> 基本流程
>
> - 使用 `Dockerfile` 定义应用程序的环境 **可选**
> - 使用 `docker-compose.yml` 定义构成应用程序的服务
> - 最后通过 `docker compose up | down` 等指令根据配置文件创建并启动容器
>
> ``` yaml :no-line-numbers
> # 指定版本
> version: '1.0.0'
> # 定义服务
> services:
>   # 指定服务名
>   nginx1:
>     # 指定镜像
>     image: nginx 
>     # 指定端口映射 -p
>     ports:
>       - "8081:80"
>   nginx2:
>     image: nginx
>     ports:
>       - "8082:80"
> ```

### 指令操作

| 操作 | 指令 | 说明 |
| --- | --- | --- |
| 创建并启动 | `docker compose up` | 根据配置文件创建并启动容器( build + start)<br />`-d` 后台运行 <br /> `--build` 强制重新构建镜像 |
| 停止 | `docker compose down` | 停止并删除容器，**镜像会被保留，网络会被删除** |
| 查看 | `docker compose ps` | 查看当前运行的容器（通过 compose 创建的容器） |
| 查看日志 | `docker compose logs` | 查看容器的日志，`-f` 实时查看 |
| 构建 | `docker compose build` | 构建 compose 中的服务 |
| 重启 | `docker compose restart` | 重启容器（build 后的） |
| 启动 | `docker compose start` | 启动 compose 中的服务（build 后的） |
| 停止 | `docker compose stop` | 停止 compose 中的服务（build 后的） |
| 删除 | `docker compose rm` | 删除容器 |

![alt text](/docker/01.png)


> [!IMPORTANT]
>
> 默认情况下，都会查找当前目录下的 `docker-compose.yml` 文件，工作目录切换后，这些指令就会根据新的目录查找配置文件
>
> 比如 `/a` 下面启动，然后切换到 `/b`。a 下面的容器通过 `docker compose`就访问不到了。
>
> 只能通过 `docker` 访问全局的容器
>
> **-f** 指定 compose 文件路径
>
> ```bash :no-line-numbers
> docker compose -f /a/docker-compose.yml ps
> ```

### 配置文件

> [!CAUTION]
>
> compose 配置文件中，服务名必须是唯一的，不能重复。
>
> 声明：下面为示例，具体为了演示各配置项的作用，不是实际的配置。

```yaml :no-line-numbers
version: '1.0.0'
# 定义服务
services:
  # 服务名 （自定义的）
  webfront:
    # 指定镜像
    image: nginx
    # 指定端口映射 -p 对外暴露端口:容器端口
    ports:
      - "8081:80"
    # 指定构建上下文路径 (Dockerfile 所在目录)
    build: .
    # 重启策略
    # always 表示总是重启，无论容器是否退出
    # "no" 默认，在任何情况下都不会重启容器。
    # on-failure 在容器非正常退出时（退出状态非0），才会重启容器。
    # unless-stopped 在容器退出时总是重启容器，但是不考虑在Docker守护进程启动时就已经停止了的容器
    restart: always
    # 指定依赖服务（服务名），只有 db 启动完成后，才会启动 webfront
    depends_on:
      - db
```

#### volumes

> [!IMPORTANT]
>
> **命名卷 Named Volumes（常用）**。通过增加 `volumes` 的根配置，将宿主机的目录挂载到容器中。
>
> **以当前目录名拼接 _data 作为卷名，放在系统的 ·var/lib/docker/volumes/ {当前工作目录_data}/_data` 中**
>
> ```yaml :no-line-numbers
> services:
>   web:
>     volumes:
>       # 将容器中的 nginx 中的目录挂载到宿主机的 _data 目录中。
>       - data:/usr/share/nginx/html
> volumes:
>   data:
>     driver: local
> ```

> [!CAUTION]
>
> **绑定卷 Bind Mounts** 可以不指定根的 `volumes` 直接进行绑定。
> 
> 经过测试，如果容器的目录不是空的，通过绑定卷挂载，会将容器中的目录内容覆盖掉。
> 
> **也就是说如果宿主机的这个目录没有或者为空，那么容器的目录也是空的**。
>
> ```yaml :no-line-numbers
> services:
>   web:
>     volumes:
>       # 将当前目录下的 html 目录挂载到容器的 /usr/share/nginx/html 目录
>       - ./html:/usr/share/nginx/html
> ```

可以在目录的末尾增加 `:ro` 表示只读挂载。或者 `:rw` 表示读写挂载。默认是读写挂载。

类似这样 `./html:/usr/share/nginx/html:ro`

### networks

> [!IMPORTANT]
>
> **网络 Networks**。通过增加 `networks` 的根配置，将容器加入到指定的网络中。
>
> 默认情况下，每个容器都会加入到一个名为 `default` 的网络中。
>
> ```yaml :no-line-numbers
> services:
>   web:
>     networks:
>       - webnet
> networks:
>   # 自定义网络名
>   webnet:
>     driver: bridge
> ```

### environment

> [!IMPORTANT]
>
> **环境变量 Environment Variables**。通过增加 `environment` 的根配置，将环境变量传递给容器。
> 
> 比如 mysql 以及后端服务需要的一些特定变量，比如数据库连接信息，后端服务的端口号等。
>
> ```yaml :no-line-numbers
> services:
>   backend:
>     environment:
>       - NODE_ENV=production
>       - APP_PORT=3000
>       - LOG_LEVEL=info
>     build: .
>     ports:
>       - "3000:3000"
>   mysql:
>     image: mysql:5.7
>     ports: 
>       - "3306:3306"
>     environment:
>       - MYSQL_ROOT_PASSWORD=123456
>       - MYSQL_DATABASE=mydb
>       - MYSQL_USER=myuser
>       - MYSQL_PASSWORD=123456
> ```

## docker file

> [!IMPORTANT]
>
> **Dockerfile**。包含构建容器的所有指令，通过一系列的命令和参数，来定义容器的构建过程。

### FROM

指定基础镜像，比如 `FROM node:14-alpine` 一般用于后端服务构建时。

`-alpine` 是一个基于 Alpine Linux 的镜像，体积更小，安全性更高。

`node:20.14.0-alpine` 则是 node 20.14.0 版本的 alpine 镜像。

### RUN 

运行命令，比如 `RUN npm install` 安装依赖。**在 build 阶段时执行。**

### CMD

指定容器运行时默认执行的命令，比如 `CMD ["npm", "start"]` 运行 `npm start` 命令。 **在容器 run 时执行。**

### COPY

将本地文件复制到容器中，比如 `COPY . /app` 复制当前目录下的所有文件到容器的 `/app` 目录中。

app 如果没有会被创建

### WORKDIR

设置工作目录，比如 `WORKDIR /app` 切换到 `/app` 目录。 并且会创建出一个 `/app` 目录。

有了此命令之后再次 `COPY` 就可以直接使用 `COPY . .`  即复制当前目录下的所有文件到容器的 `/app` 目录中。

### EXPOSE

声明容器运行时监听的端口，比如 `EXPOSE 3000` 声明容器运行时监听 3000 端口。

### ENV

设置环境变量，比如 `ENV NODE_ENV=production` 设置 `NODE_ENV` 环境变量为 `production`。

在业务代码中可以通过 `process.env.NODE_ENV` 来获取 `NODE_ENV` 环境变量的值。

会被 compose 配置文件中的 `environment` 覆盖同名环境变量。

## 实践

### 基础后端服务 mysql + express

:::code-group
``` Dockerfile :no-line-numbers
# express nodejs 服务

# 指定 node 镜像
FROM node:20-alpine 
# 创建工作目录
WORKDIR /app
# 复制当前项目到工作目录
COPY . .
# 安装依赖
RUN npm install
# 暴露端口
EXPOSE 3000
# 启动服务
CMD ["npm", "start"]
```

```yml :no-line-numbers [docker-compose.yml]
version: '3.8'
services:
  express-api:
    build: .
    restart: always
    ports:
      - 3000:3000
    # 依赖于 mysql 服务，只有 mysql 启动后才会启动 express-api 服务
    depends_on:
      - mysql
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
      # 重点在容器内访问 mysql 需要通过服务名进行访问
      - DB_HOST=mysql
      # 端口应当使用容器内的端口
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=admin123
      - DB_DATABASE=mydb
  mysql:
    image: mysql:8.0
    ports:
      # 3307 是宿主机的端口，比如 navicat 访问，3306 是内部端口
      - 3307:3306
    environment:
      - MYSQL_ROOT_PASSWORD=admin123
      - MYSQL_DATABASE=mydb
:::

有些后端的服务可能还会增加 build 的过程。

```dockerfile :no-line-numbers
FROM node:20-alpine as builder
WORKDIR /app
# 复制 package.json 和 package-lock.json 到工作目录
COPY .package*.json ./
RUN npm install 
# 复制所有项目所有文件 （.dockerignore 中的文件会被忽略, 比如 node_modules 目录）
COPY . .
RUN npm run build

FROM node:20-alpine as runner
WORKDIR /app
# 复制 builder 阶段的 dist 目录到 runner 阶段
COPY --from=builder /app/dist ./dist
# 安装依赖
RUN npm install --production
# 暴露端口
EXPOSE 3000
# 启动服务
CMD ["npm", "start"]
```

### 基础前端服务 react + nginx

> [!CAUTION]
> 两种方案其一，使用卷同步数据，同步到 ngxin 中。
>
> ::: code-group
> ``` Dockerfile :no-line-numbers
> FROM node:22-alpine AS builder
> RUN npm install -g pnpm
> WORKDIR /app
> COPY package*.json pnpm-lock.yaml ./
> RUN pnpm install
> COPY . .
> RUN pnpm build
> ```
> 
> ```yml :no-line-numbers [docker-compose.yml]
> version: '3.8'
> services:
>   app:
>     build:
>       context: .
>       dockerfile: Dockerfile
>     volumes:
>       - html_content:/app/dist
>   
>   ngxin:
>     image: nginx:1.19-alpine
>     ports:
>       - 8081:80
>     volumes:
>       - html_content:/usr/share/nginx/html
>       # 将宿主机中的配置和容器中的配置进行同步
>       - ./nginx.conf:/etc/nginx/nginx.conf
>     depends_on:
>       - app
> 
> volumes:
>   # 默认相当于 driver: local
>   # 提供一份通用的空间，在容器之间复用
>   html_content:
> ```
> 
> ```bash :no-line-numbers [nginx.conf]
> # 项目根目录
> events {}
> http {
>     # 确保浏览器能识别 CSS/JS 等文件类型
>     include  /etc/nginx/mime.types;
>     server {
>         listen       80;
>         server_name  localhost;
>         location / {
>             # 这里的路径必须和 docker-compose 中挂载到 nginx 的路径一致
>             root   /usr/share/nginx/html;
>             index  index.html;
>             
>             # 支持前端路由刷新不 404
>             try_files $uri $uri/ /index.html;
>         }
>     }
> }
> ```
> :::


> [!IMPORTANT]
> 两种方案其二，直接在 `Dockerfile` 中将 ngxin 作为基础镜像，通过 `from=xx` 的方式将构建好的静态文件复制到 nginx 中。
> 
> ::: code-group
> ``` Dockerfile :no-line-numbers
> FROM node:22-alpine AS builder
> RUN npm install -g pnpm
> WORKDIR /app
> COPY package*.json pnpm-lock.yaml ./
> RUN pnpm install
> # 这里实际上将根目录的 nginx.conf 也复制到了 app 目录下
> COPY . .
> CMD ["pnpm", "run", "build"]
> 
> FROM nginx:1.19-alpine
> # 从 builder 中复制构建好的静态文件到 nginx 中
> COPY --from=builder /app/dist /usr/share/nginx/html
> # 从 builder 中复制 nginx.conf 到 nginx 中
> COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
> # 暴露端口
> EXPOSE 80
> # 启动 nginx 服务
> CMD ["nginx", "-g", "daemon off;"]
> 
> ```
> ``` yml :no-line-numbers [docker-compose.yml]
> version: '3.8'
> services:
>   web:
>     build: .
>     ports:
>       - 8081:80
>     restart: always
> ```
> :::
> 
> `nginx.conf` 仍然沿用第一种方案中的配置。
> 
> 这种模式下，其实不使用 `docker-compose.yml` 也可以，直接 `docker build -t web .` 即可。
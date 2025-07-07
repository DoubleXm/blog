## 基础概念

> [!NOTE]
> 容器共享主机内核，轻量、隔离并且高效，不像虚拟机需要完整的操作系统。
> - **容器 Container** 轻量化运行的实例，包含应用代码、运行时环境和依赖库。基于**镜像**创建，与其他容器隔离，共享主机操作系统内核（比虚拟机更高效）
> - **镜像 Image** 只读模板，定义了容器的运行环境（如操作系统、软件配置）。通过分层存储（`Layer`），优化空间和构建速度。
> - **Dockerfile** 文本文件、描述如何自动构建镜像，例如基础镜像、安装软件、复制文件等。
> - **仓库 Registry** 存储和分发镜像的平台，比如 `Docker Hub`

![alt text](/devops/02-docker.webp)

## 安装 CentOS

[CentOS 安装指南](https://docs.docker.com/engine/install/centos/)

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

## 镜像操作

## 容器操作

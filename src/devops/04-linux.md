## systemctl 服务管理

用来管理服务的命令

- `systemctl start [ serviceName ]` 启动服务
- `systemctl stop [ serviceName ]` 停止服务
- `systemctl restart [ serviceName ]` 重启服务
- `systemctl reload [ serviceName ]` 重载服务，重新加载配置，不重启服务
- `systemctl status [ serviceName ]` 查看服务状态
- `systemctl enable [ serviceName ]` 设置开机自启
- `systemctl disable [ serviceName ]` 取消开机自启
- `systemctl is-enabled [ serviceName ]` 查看是否开机自启
- `systemctl list-units --type=service --status=running` 列出所有运行中的服务
- `systemctl --failed` 列出失败的服务

## yum 包管理

常在 `CentOS` 中使用的包管理工具。

- `yum check-update` 检查可更新的包
- `yum update` 更新所有包
- `yum install [ packageName ]` 安装包
- `yum update [ packageName ]` 更新包
- `yum remove [ packageName ]` 删除包
- `yum list [ keyword ]` 列出所有可以被安装的包
- `yum search [ keyword ]` 搜索包
- `yum clean all` 清除缓存

## apt 包管理

常在 `Ubuntu` 中使用的包管理工具。

- `apt update` 列出可更新的包清单
- `apt upgrade` 升级软件包
- `apt list --upgradable` 列出可升级的包
- `apt list --installed` 列出已安装的包
- `apt full-upgrade` 升级软件
- `apt install [ packageName ]` 安装包
- `apt update [ packageName ]` 更新包
- `apt remove [ packageName ]` 删除包
- `apt search [ keyword ]` 搜索包



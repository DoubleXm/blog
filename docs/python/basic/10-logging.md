---
isTimeLine: true
title: 内置模块 logging
date: 2020-10-27
tags:
 - Python
---

## logging 模块

```py
import logging

# 默认只会打印 warning 及以后的日志内容
logging.debug("this is debug message")  # 调试信息
logging.info("this is info message")  # 基本信息
logging.warning("this is warning message")  # 警告信息
logging.error("this is error message")  # 错误信息
logging.critical("this is critical message")  # 严重错误信息
```

### basicConfig

```py
import logging

logging.basicConfig(
    # 日志等级 debug 10 info 20 warning 30 error 40 critical 50
    level=10,
    # 日志输出格式
    format="%(asctime)s %(name)s [%(pathname)s line:%(lineno)d] %(levelname)s %(message)s",
    # asctime 的时间格式
    datefmt="%Y-%m-%d %H:%M:%S",
    # 日志输出位置，如果不指定，则输出到控制台
    filename="user.log"
)

logging.debug("this is debug message")
logging.info("this is info message")
logging.warning("this is warning message")
logging.error("this is error message")
logging.critical("this is critical message")
```

`format` 支持的内容如下：

```py
"""
%(name)s Logger的名字(getlogger时指定的名字)
%(levelno)s 数字形式的日志级别
%(levelname)s 文本形式的日志级别
%(pathname)s 调用日志输出日志的完整路径名
%(filename)s 调用日志输出日志的文件名
%(module)s 调用日志输出日志的模块名
%(funcName)s 调用日志输出日志的函数名
%(lineno)d 调用日志输出函数的语句所在的代码行
%(created)f 当前时间，用UNIX标准的表示时间的浮 点数表示
%(relativeCreated)d 输出日志信息时的，自Logger创建以 来的毫秒数
%(asctime)s 字符串形式的当前时间,默认格式是 “2022-07-30 22:15:53,394”
%(thread)d 线程ID,可能没有
%(threadName)s 线程名,可能没有
%(process)d 进程ID,可能没有
%(message)s 用户输出的消息
"""
```

### 字典配置

基于 `basicConfig` 配置的日志，在 `windows` 下默认会引起乱码的问题，因为 `windows` 默认的是 `jbk` 编码，在 `linux` 和 `mac` 则不会出现该问题。`basicConfig` 只是基础的配置，本身也是不支持修改编码的。

在 `logging` 模块中有三个比较重要的功能组件

- `loggers`: 配置文件可以自定义输出日志的 `app name`
- `handler`: 配置日志的分割大小，输出位置，日志文件创建等
- `formatters`: 配置日志的输出格式

字典配置内容如下：

```py
LOGIN_DICT = {
    'version': 1.0,
    # 是否禁用已经存在的其他 logger
    'disable_existing_loggers': False,
    # 日志格式
    'formatters': {
        # key 名可以自定义，尽可能语义化
        'standard': {
            'format': '%(asctime)s %(threadName)s:%(thread)d [%(name)s] %(levelname)s [%(pathname)s:%(lineno)d] %('
                      'message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'simple': {
            'format': '%(asctime)s [%(name)s] %(levelname)s %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'test': {
            'format': '%(asctime)s %(message)s',
        },
    },
    # 日志过滤器，通常配合 handler 进行使用
    'filters': {},
    # 日志处理器
    'handlers': {
        # key 名可以自定义，尽可能语义化
        'console_debug_handler': {
            # 日志处理的级别限制
            'level': 'DEBUG',
            # 输出到终端
            'class': 'logging.StreamHandler',
            # 日志格式
            'formatter': 'simple'
        },
        'file_info_handler': {
            'level': 'INFO',
            # 保存到文件,日志轮转 'filename': 'user.log'
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'user.log',
            # 日志大小 10M
            'maxBytes': 1024 * 1024 * 10,
            # 日志文件保存数量限制
            'backupCount': 10,
            'encoding': 'utf-8',
            'formatter': 'standard',
        },
        'file_debug_handler': {
            'level': 'DEBUG',
            # 保存到文件
            'class': 'logging.FileHandler',
            # 日志存放的路径
            'filename': 'user.log',
            # 日志文件的编码
            'encoding': 'utf-8',
            'formatter': 'test',
        },
    },
    # 日志记录器
    'loggers': {
        # logging.getLogger 时使用的 appname
        'logger1': {
            # 日志分配到哪个 handler 中
            'handlers': ['console_debug_handler'],
            # 日志记录的级别限制, 与 handler 中的 level 并不冲突，双重过滤的关系
            'level': 'DEBUG',
            # 默认为True，向上（更高级别的logger）传递，设置为 False 即可，否则会一份日志向上层层传递
            'propagate': False,
        },
        'logger2': {
            'handlers': ['console_debug_handler', 'file_debug_handler'],
            'level': 'INFO',
            'propagate': False,
        },
        '': {
            'handlers': ['console_debug_handler', 'file_info_handler'],
            'level': 'INFO',
            'propagate': False,
        },
    }
}
```

使用方式如下：

```py
import logging
from logging import config

config.dictConfig(LOGIN_DICT)

logger1 = logging.getLogger('logger1')
logger1.debug('debug message')

logger2 = logging.getLogger('logger2')
logger2.info('info message')

# 如果指定的内容在 loggers 中没有匹配到就会匹配空字符串，并且将内容作为 name 输出
logger = logging.getLogger('app name')
logger.error('error message')
```

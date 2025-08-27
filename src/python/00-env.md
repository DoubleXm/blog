---
outline: [2,3,4]
---

## 基于 pyenv 的多版本管理

> [!NOTE]
> [pyenv](https://github.com/pyenv/pyenv) 根据文档下载
>
> A. Getting Pyenv 根据系统下载
>
> B. Set up your shell environment for Pyenv 设置环境变量
>
> C. Restart your shell 重启命令行环境
>
> D. Install Python build dependencies 下载 `Py` 解释器

```bash :no-line-numbers
# 常用指令

# 列表所有的 py 版本
pyenv install -l

# 安装指定版本的 py
pyenv install 3.10.0

# 查看当前安装过的解释器
pyenv verions

# 设置全局生效的解释器
pyenv global 3.10.0

# 设置此项目生效的解释器 此操作会在当前路径下增加 .python-version 文件
pyenv local 3.11.1
```

## venv 环境

默认情况下安装的包都会到了全局，在实际开发的过程中 `venv` 就是为了隔离每个项目所需要使用的第三方包。无论你使用任何方式，最终都不会影响创建出来的虚拟环境。

```bash no-line-numbers
# 创建虚拟环境
# -m 将库模块作为脚本执行
# venv 是 python 的标准库，标准库查询 https://docs.python.org/zh-cn/3.13/library/index.html
# .venv 使用 venv 模块创建一个 .venv 的文件夹作为该项目的虚拟环境
python -m venv .venv

# 激活虚拟环境 macOS
source venv/bin/activate
```

## 包管理器 pip

[文档](https://pip.pypa.io/en/stable/user_guide/)，如果你激活了 `venv` 将会下载到该目录中，实现多个项目的环境隔离。

为了保证你的项目不出现 “我的本地好好的” 这种问题。`requirements.txt` 记录了项目中所需要使用的所有软件包及版本。我想初衷大概率是想让你去手动维护该文件，但是身为前端，虽然 `package.json` 不敢苟同是高级的存在，但是 `requirements.txt` 终归是有点落伍了。

```bash
# 安装包
pip install pandas
# 1. 不同版本  "pandas<=2.0.0" 或者 "pandas==2.0.0"
pip install "pandas<=2.0.0"
# 2. 安装 requirements.txt 中的依赖 -r 或者 --requirement
pip install -r requirements.txt
# 3. 升级包 --upgrade 或者 -U
pip install --upgrade pip
```

```bash
# 删除包
pip uninstall pandas
# 删除所有的安装包，-y 不要求你手动同意，-r 指定依赖文件
pip uninstall -y -r requirements.txt
```

```bash
# 列出已经安装的包
pip list 
# 列出当前安装包没有依赖关系的包
pip list --not-required
```

```bash
# 搜索包 搜索地址为 https://pypi.org/
pip search pandas
```

```bash
# 检测当前项目中依赖是否都兼容，项目跑不起来的时候或许可以尝试
pip check

# 生成 requirements.txt 依赖文件，会把嵌套的依赖一并声明出来
# 假设我只使用了 requests 但是 requests 依赖了 aaa 此时 aaa 也会存在
pip freeze > requirements.txt

# 生成 lock 文件 用于锁定版本，但是没什么用 默认文件名为 pylock.toml
# 比如你是 mac 系统，那 lock 文件中的某些包也是仅 mac 可用，这与跨平台没有一毛钱的关系
# 如果 lock 指令不存在，可以尝试更新 pip install --upgrade pip
pip lock -r requirements
```

实际上如果你还是不想手动维护 `requirements.txt` 时，可以尝试使用 `pip-chill` 去生成这个文件。

但实际上也是存在问题的，假设你项目使用了 `requests` 依赖了 `aaa`；正常情况下不会列出 `aaa`。但是当你不想使用 `requests` 将他卸载了；此时 `aaa` 就会出现，非常扎心。

```bash :no-line-numbers
pip install pip-chill

# --no-chill 列出没有依赖的库，排除 pip-chill
pip-chill --no-chill > requirements.txt
```

## 项目实践

```bash :no-line-numbers
# 1. 切换项目适用的指定版本
pyenv local 3.10.10

# 2. 创建并激活虚拟环境
python venv .venv
source .venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 如果在开发的过程中增加了三方库的使用，及时补充 requirements.txt 
# 不管是手动还是指令生成
```

## 发展历程

期间也出现过更先进的方式，`setup.py` 以及 `pyproject.toml` 用来管理依赖的版本。

理解之后觉得 `setup.py` 就是版本弃子了。当然不排除一些老的项目需要使用，你仍然要知道怎么去接手这类的项目。

[ setup 是否已经弃用 ](https://packaging.python.org/en/latest/discussions/setup-py-deprecated/)

### setup.py

实际上再项目的根目录出现了一个名为 `setup.py` 的文件，该文件的内容大致如下

```python
from setuptools import setup

setup(
    name="my-project",
    version="0.1.0",
    install_requires=[
        "requests",
        "flask",  # 这是主依赖，总是会被安装
    ],
    extras_require={
        "dev": [  # 可选依赖组叫 "dev"
            "pytest", 
            "black",
            "flake8"
        ],
        "test": [  # 可以定义多个组
            "pytest",
            "coverage"
        ]
    },
)
```

当执行 `pip install .` 的时候，主的依赖总是会被安装，如果想要安装其他的依赖，可以使用

```bash no-line-numbers
# ".[dev,test]" 安装多个
pip install ".[dev]"
```

### pyporoject.toml

我认为更为现代的依赖管理，特别是配合 `uv` 更加提升了权威性，相信后面的 `py` 项目都会使用，如果使用 `pip` 进行安装，那么与 `setup.py` 的方式是一致的。

[编写你的 pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)

```toml
[project]
name = "my-project"
version = "0.1.0"
dependencies = [
    "requests",
    "flask",
]

[project.optional-dependencies]
dev = [
    "pytest",
    "black", 
    "flake8"
]
test = [
    "pytest",
    "coverage"
]
docs = [
    "sphinx",
    "readthedocs-theme"
]
```

## uv 基于 Py 的包和项目管理工具

我觉得可以把他看成升级后的 `pyenv + pip`


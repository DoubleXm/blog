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

我觉得可以把他看成升级后的 `pyenv + pip` [文档](https://hellowac.github.io/uv-zh-cn/)

[指令参考](https://hellowac.github.io/uv-zh-cn/reference/cli/)

### 安装仅适用于 macOS

```bash :no-line-numbers
brew install uv
# 如果版本过低，可以自行更新
brew upgrade uv
# 验证 uv 0.8.13 (Homebrew 2025-08-21)
uv --version
```

### Py 版本管理

摒弃 `pyenv` 的使用习惯，比如你下载后设置了 `global` 就想要验证 `python` 的版本号，在 `uv` 中是不可取的。

`uv` 以项目优先，没有全局的版本的概念。如果你想要验证的话可以使用 `uv run python --version`，返回当前下载的最高版本。

```bash :no-line-numbers
# 安装版本 可以是多个 3.10 3.11
uv python install 3.10

# 查看当前安装的版本
# 默认显示当前安装的版本和每个大版本的最新
# --all-platforms 列出所有的平台版本
# --only-installed 列出已安装版本
# --all-versions 列出当前平台所有版本
uv python list 

# 卸载版本
uv python uninstall 3.10

# 在当前目录下使用指定的 python 版本
uv python pin 3.10
```

### uv pip 指令

兼容了原生的 `pip` 指令，更加容易被记忆。

```bash :no-line-numbers
uv pip install requests
uv pip uninstall requests
uv pip list
# 列出已安装包及其版本
uv pip freeze
# 检查当前环境中的包是否兼容
uv pip check
# 查看环境的依赖树
uv pip tree

# 将需求文件编译为锁文件
uv pip compile
# 根据锁文件同步环境
uv pip sync
```

### uv 缓存管理

```bash :no-line-numbers
# 清空缓存
uv cache clean
# 清空过期的缓存
uv cache prune
# 查看缓存的目录
uv cache dir
# 查看 py 的安装目录
uv python dir
```

### Py 脚本运行

```bash :no-line-numbers
# uv run 运行一个脚本或者一个命令
uv run python --version
uv run example.py

# 如果在包含 pyproject.toml 的目录中（项目内）执行，需要增加参数 --no-project
uv run --no-project example.py

# 也可以增加参数，在文件内部通过 sys.argv 获取
uv run example.py hello wrold

# --with 可以增加依赖的包
echo "import requests; res = requests.get('https://jsonplaceholder.typicode.com/posts').json(); print(res)" |  uv run --with requests -
```

### Py 项目管理

使用 `uv venv` 默认会在当前目录创建一个 `.venv` 的虚拟目录，如果该目录已经存在则会删除老的创建一个新的。

`uv init` 提供基于 `python` 的最小项目模板[文档](https://hellowac.github.io/uv-zh-cn/concepts/projects/init/)，有两种模式 `--app` 及 `--lib`，默认是前者。

```bash :no-line-numbers
# 会在项目中创建 .python-version 和 pyproject.toml 文件
# --lib 则创建出一个符合上传 PyPi 规范的项目结构
uv init py-project
```

在 `pyproject.toml` 中有几个选项至关重要

```bash
project.dependencies # 生产依赖
project.optional-dependencies # 可选依赖，比如代码格式化
dependency-groups # 本地开发依赖，我的理解如果项目不会被打包，这里面基本不会存在任何内容
tool.uv.source # 开发期间依赖项的替代，可以是 git 上的某个库的地址，并且支持指定 tag
```

`uv` 可以通过 `add` 和 `remove` 指令来管理项目中的依赖，可以通过 `--dev` `--group` 或者 `--optional` 添加到对应的依赖中。默认都是放在 `dependencies` 中。

[文档](https://hellowac.github.io/uv-zh-cn/concepts/projects/dependencies/#_9)

```bash :no-line-numbers
uv add pandas

# 安装到 dependency-groups 中的 dev 下
uv add --dev django 

# 安装 group 时需要指定名称，删除同理
uv add --group dev-group numpy

# 安装 optional 同样需要指定名称，删除同理。安装到 optional-dependencies 下 name 下
uv add --optional optional flask
```

如果通过 `uv run main.py` 执行项目内的文件时，会自动生成 `uv.lock` 文件，当项目内没有 `.lock` 文件时则可以使用如下任意命令生成。

```bash :no-line-numbers
uv sync # 创建最新的 lock 文件
uv lock # 同步项目依赖创建 lock 文件
```

[文档](https://hellowac.github.io/uv-zh-cn/concepts/projects/sync/) **将疑问交给时间沉淀吧！！！**

### 项目实践

实际开发中，存在也存在几种场景，接手老项目或者新开项目

```bash :no-line-numbers
# 指定项目中的 python 版本
uv python pin 3.10.18

# 创建 venv 环境
uv venv

# 安装依赖，有可能是 requirements 有可能是 pyproject.toml 文件
# 默认只能安装 dependencies 中的配置。
# --all-extras 安装所有依赖，包括 group、dev、optional
uv install -r pyproject.toml
```

当然如果碰到了 `requirements.txt` 这样的依赖文件，也可以尝试使用 `uv` 实践出真知，最好能够回退。

```bash :no-line-numbers
# 放弃 add 和 remove 的实践，统一使用 uv pip install 等操作

uv pip install -r requirements
uv pip uninstall django

uv pip freeze > requirments.txt

# 使用 uv run 创建出来的 .lock 看情况要不要放在 .gitignore 中
# 当然你的项目也不一定是由 uv run 来启动，比如 fastapi
# uvicorn main:app --reload 参考 https://fastapi.tiangolo.com/zh/#_6
uv run xx.py
```

### 总结

作为一名前端，和同事的沟通以及社区的观察，目前看来 `uv` 是流行趋势，但是并没有完全普及，毕竟不是官方出的工具。

当然你完全可以尝试使用 `uv` 做任何 `Python` 项目。

除了 `uv` 之外还有其他的管理工具，比如 `peotry` [文档](https://python-poetry.org/)；万变不离其宗吧。碰到再说。

你可能会看到一些开源项目的 `pyproject.toml` 为什么写的这么复杂，而我实践下来这么简单，我只能说，做了足够多的项目，踩了足够多的坑，你也可以。**实践出真知**
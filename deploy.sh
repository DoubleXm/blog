#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf docs/.vitepress/dist/

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vitepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:ShuQingX/interview-questions-record.git master:gh-pages

cd -
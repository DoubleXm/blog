#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd ./docs/.vitepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git add -A
git commit -m 'feat(all): deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO> 这里做出对应的替换
git push -f git@github.com:ShuQingX/interview-questions-record.git master:gh-pages

cd -

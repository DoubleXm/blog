不定期收集前端面试题以及个人技术总结性文档。让你在换坑位时不用在到处收集资料。一个站点全部搞定你的面试需要。

文档的完善也离不开大家的努力，欢迎大家一起来共建。[如何去提交一个 pr ？](https://juejin.cn/post/6844903821521469448)

- 项目使用 commitizen 作为 git 工具，提交时请运行 `npm run commit` 避免提交失败。

- 在 `husky` 的 `pre-commit` 钩子中会对代码 `formatter` 并构建项目发布 github pages

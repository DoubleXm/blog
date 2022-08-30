import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/docs/",
  title: "Web 前端开发",
  description: "总结 web 前端相关面试题，以及个人技术的文章总结。",
  themeConfig: {
    // 导航栏
    nav: [
      // {
      //   text: "面试",
      //   items: [
      //     { text: "公司真题", link: "/interview-questions/" },
      //     { text: "八股文", link: "/eight-part-essay/" },
      //     { text: "手撕代码", link: "/tore-code/" }
      //   ]
      // },
      { text: "公司真题", link: "/interview-questions/" },
      { text: "八股文", link: "/eight-part-essay/" },
      { text: "手撕代码", link: "/tore-code/" }
    ],
    // 侧边栏
    sidebar: {
      "/interview-questions/": [
        {
          text: "2022年08-10月面试",
          collapsible: true,
          items: [{ text: "08-31 xxx 科技公司", link: "/interview-questions/questions-1" }]
        }
      ],
      "/eight-part-essay/": [
        {
          text: "八股文",
          collapsible: true,
          items: [
            { text: "计算机网络", link: "/eight-part-essay/internet-questions" },
            { text: "浏览器部分", link: "/eight-part-essay/browser-questions" }
          ]
        }
      ],
      "/tore-code/": [
        {
          text: "JavaScript 手写",
          collapsible: true,
          items: [{ text: "手写 Promise", link: "/tore-code/promise" }]
        }
      ]
    },
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/ShuQingX/interview-questions-record/tree/main/docs" }]
  }
});

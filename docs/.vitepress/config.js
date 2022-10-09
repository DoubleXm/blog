import { defineConfig } from "vitepress";

function getChineseThemeConfig() {
  return {
    localeLinks: {
      items: [
        { text: "简体中文", link: "/" },
        { text: "English", link: "/en/" }
      ]
    },
    nav: [
      { text: "八股文", link: "/eight-part-essay/internet-questions", activeMatch: "/eight-part-essay/" },
      { text: "手撕代码", link: "/tore-code/", activeMatch: "/tore-code/" }
    ],
    sidebar: {
      "/eight-part-essay/": [
        {
          text: "八股文",
          collapsible: true,
          items: [
            { text: "计算机网络", link: "/eight-part-essay/internet-questions" },
            { text: "浏览器", link: "/eight-part-essay/browser-questions" },
            { text: "HTML、CSS", link: "/eight-part-essay/html-css" },
            { text: "Javascript", link: "/eight-part-essay/javascript" },
            { text: "TypeScript", link: "/eight-part-essay/typescript" },
            { text: "移动端", link: "/eight-part-essay/mobile" },
            { text: "Vue2", link: "/eight-part-essay/vue2" },
            { text: "React", link: "/eight-part-essay/react" },
            { text: "Webpack", link: "/eight-part-essay/webpack" },
            { text: "Vite", link: "/eight-part-essay/vite" },
            { text: "Node", link: "/eight-part-essay/node" }
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
    socialLinks: [{ icon: "github", link: "https://github.com/ShuQingX/interview-questions-record" }],
    lastUpdatedText: "最近更新时间",
    footer: {
      message: "在 MIT 许可下发布。",
      copyright: "版权所有 © 2022-至今 shuqingx"
    },
    editLink: {
      pattern: "https://github.com/ShuQingX/interview-questions-record/blob/main/docs/:path",
      text: "在 GitHub 上编辑此页面"
    }
  };
}

function getEnglishThemeConfig() {
  return {
    localeLinks: {
      items: [
        { text: "简体中文", link: "/" },
        { text: "English", link: "/en" }
      ]
    },
    nav: [
      {
        text: "Eight-legged essay",
        link: "/en/eight-part-essay/internet-questions",
        activeMatch: "/en/eight-part-essay/"
      },
      { text: "Tear the code by hand", link: "/en/tore-code/", activeMatch: "/en/tore-code/" }
    ],
    sidebar: {
      "/en/eight-part-essay/": [
        {
          text: "Eight-legged essay",
          collapsible: true,
          items: [
            { text: "computer network", link: "/en/eight-part-essay/internet-questions" },
            { text: "browser", link: "/en/eight-part-essay/browser-questions" },
            { text: "HTML、CSS", link: "/en/eight-part-essay/html-css" },
            { text: "Javascript", link: "/en/eight-part-essay/javascript" },
            { text: "TypeScript", link: "/en/eight-part-essay/typescript" },
            { text: "mobile", link: "/en/eight-part-essay/mobile" },
            { text: "Vue2", link: "/en/eight-part-essay/vue2" },
            { text: "React", link: "/en/eight-part-essay/react" },
            { text: "Webpack", link: "/en/eight-part-essay/webpack" },
            { text: "Vite", link: "/en/eight-part-essay/vite" },
            { text: "Node", link: "/en/eight-part-essay/node" }
          ]
        }
      ],
      "/en/tore-code/": [
        {
          text: "JavaScript handwriting",
          collapsible: true,
          items: [{ text: "handwriting Promise", link: "/en/tore-code/promise" }]
        }
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/ShuQingX/interview-questions-record" }],
    lastUpdatedText: "Last update time",
    footer: {
      message: "Released under the MIT license.",
      copyright: "Copyright © 2022-present shuqingx"
    },
    editLink: {
      pattern: "https://github.com/ShuQingX/en/interview-questions-record/blob/main/docs/:path",
      text: "Edit this page on GitHub"
    }
  };
}

export default defineConfig({
  base: "/interview-questions-record/",
  // title: "Web 前端开发",
  // description: "总结 web 前端相关面试题，以及个人技术的文章总结。",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Web 前端开发",
      description: "总结 web 前端相关面试题，以及个人技术的文章总结。"
    },
    "/en/": {
      lang: "en-US",
      title: "Web front-end development",
      description:
        "Summarize web front-end related interview questions, as well as personal technical article summaries."
    }
  },
  themeConfig: {
    locales: {
      "/": getChineseThemeConfig(),
      "/en/": getEnglishThemeConfig()
    },
    algolia: {
      apiKey: "aea12a0a4281c855b5d23789e868f378",
      indexName: "interview-questions-record",
      // 如果 Algolia 没有为你提供 `appId` ，使用 `BH4D9OD16A` 或者移除该配置项
      appId: "XQYLP2L9WC"
    }
  }
});

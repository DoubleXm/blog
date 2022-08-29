import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Web 前端开发",
  description: "总结 web 前端相关面试题，以及个人技术的文章总结。",
  themeConfig: {
    // 导航栏
    nav: [
      { text: "面试", link: "/interview-questions/" },
      { text: "Vue3", link: "#" },
      { text: "React", link: "#" }
      // {
      //   text: '工程化',
      //   items: [
      //     { text: 'Vite', link: '/vite' },
      //     { text: 'Webpack', link: '/webpack' }
      //   ]
      // },
      // {
      //   text: 'Node',
      //   items: [
      //     { text: 'Koa', link: '/koa' },
      //     { text: 'Nest', link: '/nest' }
      //   ]
      // }
    ],
    // 侧边栏
    sidebar: [
      {
        text: "2022年08-10月面试",
        collapsible: true,
        items: [{ text: "08-31 xxx 科技公司", link: "/interview-questions/questions-1" }]
      },
      {
        text: "TestSidebar",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "sidebar-one", link: "#" },
          { text: "sidebar-two", link: "#" }
        ]
      }
    ],
    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }]
  }
});

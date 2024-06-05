import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  // base,
  lang: 'zh-cn',
  title: 'DoubleX',
  description: '粥里有勺糖的博客主题，基于 vitepress 实现',
  lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.jpeg',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/theme'
      }
    ],
    nav: [
      // { text: '面试', link: 'https://sugarat.top/aboutme.html' }
      {
        text: '技术笔记',
        items: [
          {
            text: '工具教程',
            link: '/essay/utils/use-charles',
            activeMatch: '^/essay/utils/'
          }
        ]
      },
      {
        text: "大前端",
        items: [
          {
            text: 'vue3 手写',
            link: '/vue3/01-define-reactive',
          }
        ]
      },
      {
        text: 'Python',
        items: [
          {
            text: '基础',
            link: '/python/basic/01-data-type-operator',
            activeMatch: '/python/basic'
          }
        ]
      },
      {
        text: '数据库',
        items: [
          {
            text: 'MySQL',
            link: '/database/mysql/basic/01-introduction',
            activeMatch: '/database/mysql'
          }
        ]
      },
      {
        text: '面试',
        items: [
          {
            text: 'JavaScript',
            link: '/interview/javascript',
          },
          {
            text: 'TypeScript',
            link: '/interview/typescript',
          },
          {
            text: 'React',
            link: '/interview/react',
          },
          {
            text: 'Vite',
            link: '/interview/vite',
          },
          {
            text: 'Webpack',
            link: '/interview/webpack',
          },
          {
            text: 'NodeJS',
            link: '/interview/node',
          },
          {
            text: '浏览器',
            link: '/interview/browser',
          },
          {
            text: '计算机网络',
            link: '/interview/network',
          },
          {
            text: '移动端',
            link: '/interview/mobile',
          },
          {
            text: 'HTML、CSS',
            link: '/interview/html-css',
          },
          {
            text: 'Vue2',
            link: '/interview/vue2',
          },
        ]
      }
    ]
  }
})

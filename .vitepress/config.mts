import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "65岁退休 Coder",
  description: "",
  lastUpdated: true,
  base: '/blog/',
  outDir: './dist',
  srcDir: './src',
  markdown: {
    theme: 'slack-dark',
    lineNumbers: true
  },
  vite: {
    server: {
      host: '0.0.0.0',
      port: 3000
    },
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/DoubleXm/blog/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },
        
    nav: [
      { text: '🤔...😲🚚💰', link: '/' },
      { 
        text: '大前端',
        items: [
          { text: '🔞 Vue', link: '/vue/pinia/01' },
          { text: '♻️ React', link: '/react' },
          { text: '🐜 微前端', link: '/micro-web/single-spa' },
          { text: '🐢 Node.js', link: '/node' },
          { text: '🦈 数据库', link: '/database' },
          { text: '🧌 DevOps', link: '/devops' },
          { text: '🐛 Python', link: '/python/01' },
        ]
      },
      { text: '八股文', link: '/' },
    ],

    sidebar: {
      "/_project/": [
        {
          text: '工程化',
          items: [
            { text: '模块化的发展及 SystemJS 原理', link: '/_project/module_standard' },
          ]
        }
      ],
      "/vue/": [
        {
          text: 'Vue3',
          items: [
            { text: '占位', link: '/vue/pinia/01' },
          ]
        },
        {
          text: 'Pinia',
          items: [
            { text: '知识铺垫及简单 Demo', link: '/vue/pinia/01' },
            { text: '核心 API 实现原理', link: '/vue/pinia/02' },
          ]
        },
        {
          text: 'VueRouter',
          items: [
            { text: '核心 API 实现原理', link: '/vue/router/01' },
          ]
        },
      ],
      "/react/": [],
      "/micro-web/": [
        {
          text: 'SingleSpa',
          items: [
            { text: '使用方案及子应用的加载原理', link: '/micro-web/single-spa' },
          ]
        }
      ],
      "/node/": [],
      "/database/": [
        {
          text: '工程化',
          items: [
            { text: '模块化的发展及 SystemJS 原理', link: '/_project/module_standard' },
          ]
        }
      ],
      "/devops/": [],
      "/python/": [
        {
          text: 'Python 基础教程',
          items: [
            { text: '01. 数字、字符串、列表及相关操作方法', link: '/python/01' },
            { text: '02. 流程控制、函数', link: '/python/02' },
            { text: '03. 元祖、列表、集合、字典', link: '/python/03' },
            { text: '04. 模块、包', link: '/python/04' },
            { text: '05. 字符串格式化、文件、异常处理', link: '/python/05' },
            { text: '06. 面向对象', link: '/python/06' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DoubleXm/blog' }
    ]
  }
})

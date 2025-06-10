import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "65岁退休 Coder",
  description: "",
  lastUpdated: true,
  base: '/blog/',
  outDir: './dist',
  srcDir: './src',
  markdown: {
    // 'andromeeda' | 'aurora-x' | 'ayu-dark' | 'catppuccin-frappe' | 'catppuccin-latte' | 'catppuccin-macchiato' | 'catppuccin-mocha' | 'dark-plus' | 'dracula' | 'dracula-soft' | 'everforest-dark' | 'everforest-light' | 'github-dark' | 'github-dark-default' | 'github-dark-dimmed' | 'github-dark-high-contrast' | 'github-light' | 'github-light-default' | 'github-light-high-contrast' | 'houston' | 'kanagawa-dragon' | 'kanagawa-lotus' | 'kanagawa-wave' | 'laserwave' | 'light-plus' | 'material-theme' | 'material-theme-darker' | 'material-theme-lighter' | 'material-theme-ocean' | 'material-theme-palenight' | 'min-dark' | 'min-light' | 'monokai' | 'night-owl' | 'nord' | 'one-dark-pro' | 'one-light' | 'plastic' | 'poimandres' | 'red' | 'rose-pine' | 'rose-pine-dawn' | 'rose-pine-moon' | 'slack-dark' | 'slack-ochin' | 'snazzy-light' | 'solarized-dark' | 'solarized-light' | 'synthwave-84' | 'tokyo-night' | 'vesper' | 'vitesse-black' | 'vitesse-dark' | 'vitesse-light'
    theme: 'dark-plus',
    lineNumbers: true,
  },
  vite: {
    server: {
      host: '0.0.0.0',
      port: 3000
    },
  },
  themeConfig: {
    outline: [2, 3],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/DoubleXm/blog/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },
        
    nav: [
      { text: '🤔...😲🚚💰', link: '/_project/module_standard' },
      { 
        text: '大前端',
        items: [
          { text: '🌚 JavaScript', link: '/python/01' },
          { text: '🔞 Vue', link: '/vue/pinia/01' },
          { text: '♻️ React', link: '/react' },
          { text: '🐜 微前端', link: '/micro-web/single-spa' },
          { text: '🐢 Node.js', link: '/node' },
          { text: '🦈 数据库', link: '/database' },
          { text: '🧌 DevOps', link: '/devops/01-dir' },
          { text: '🐛 Python', link: '/python/01' },
        ]
      },
      { text: '面试', link: '/interview/ba-gu/js' },
    ],

    sidebar: {
      "/_project/": [
        {
          text: '工程化',
          collapsed: true,
          items: [
            { text: '模块化的发展及 SystemJS 原理', link: '/_project/module_standard' },
          ]
        },
        {
          text: '提效工具',
          collapsed: true,
          items: [
            { text: 'Charles 使用指南', link: '/_project/01-use-charles' },
            { text: 'iTerm2 + Oh-my-zh + p10k 终端美化', link: '/_project/02-use-iterm2' },
          ]
        }
      ],
      "/vue/": [
        {
          text: 'Vue3',
          collapsed: true,
          items: [
            { text: '占位', link: '/vue/pinia/01' },
          ]
        },
        {
          text: 'Pinia',
          collapsed: true,
          items: [
            { text: '知识铺垫及简单 Demo', link: '/vue/pinia/01' },
            { text: '核心 API 实现原理', link: '/vue/pinia/02' },
          ]
        },
        {
          text: 'VueRouter',
          collapsed: true,
          items: [
            { text: '核心 API 实现原理', link: '/vue/router/01' },
          ]
        },
      ],
      "/react/": [],
      "/micro-web/": [
        {
          text: 'SingleSpa',
          collapsed: true,
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
      "/devops/": [
        {
          text: 'Linux',
          collapsed: true,
          items: [
            { text: '目录结构 & 快捷操作', link: '/devops/01-dir' },
            { text: '常用命令', link: '/devops/02-linux' },
          ]
        },
        {
          text: 'Nginx',
          collapsed: true,
          items: []
        },
        {
          text: 'Docker',
          collapsed: true,
          items: []
        },
        {
          text: 'K8s',
          collapsed: true,
          items: []
        },
        {
          text: 'Git',
          collapsed: true,
          items: []
        },
        {
          text: 'Jenkins',
          collapsed: true,
          items: []
        }
      ],
      "/python/": [
        {
          text: 'Python 基础教程',
          collapsed: true,
          items: [
            { text: '01. 数字、字符串、列表及相关操作方法', link: '/python/01' },
            { text: '02. 流程控制、函数', link: '/python/02' },
            { text: '03. 元祖、列表、集合、字典', link: '/python/03' },
            { text: '04. 模块、包', link: '/python/04' },
            { text: '05. 字符串格式化、文件、异常处理', link: '/python/05' },
            { text: '06. 面向对象', link: '/python/06' },
          ]
        }
      ],
      "/interview/": [
        { 
          text: 'AI',
          collapsed: true,
          items: [
            { text: 'AI 专业名词的解释', link: '/interview/ai/01' },
          ]
        },
        {
          text: '八股文',
          collapsed: true,
          items: [
            { text: '浏览器', link: '/interview/ba-gu/browser' },
            { text: '计算机网络', link: '/interview/ba-gu/network' },
            { text: 'HTML', link: '/interview/ba-gu/html' },
            { text: 'CSS', link: '/interview/ba-gu/css' },
            { text: 'JavaScript', link: '/interview/ba-gu/js' },
            { text: 'TypeScript', link: '/interview/ba-gu/ts' },
            { text: 'Vue2', link: '/interview/ba-gu/vue2' },
            { text: 'Vue3', link: '/interview/ba-gu/vue3' },
            { text: 'React', link: '/interview/ba-gu/react' },
            { text: '构建工具', link: '/interview/ba-gu/webpack' },
            { text: 'NodeJS', link: '/interview/ba-gu/node' },
          ]
        },
        {
          text: '面试记录',
          collapsed: true,
          items: [
            { text: '2025-x-x 占位', link: '' },
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DoubleXm/blog' }
    ]
  }
})

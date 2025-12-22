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
    outline: 'deep',
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/DoubleXm/blog/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },
        
    nav: [
      { text: '🤔...😲🚚💰', link: '/_project/module_standard' },
      { text: 'AI', link: '/ai' },
      { 
        text: '大前端',
        items: [
          { text: '🔞 Vue', link: '/vue/pinia/01' },
          { text: '♻️ React', link: '/react/view' },
          { text: '🐜 微前端', link: '/micro-web/single-spa' },
          { text: '🐢 Node.js', link: '/node' },
          { text: '🦈 数据库', link: '/database' },
          { text: '🧌 DevOps', link: '/devops/01-dir' },
          { text: '🐛 Python', link: '/python/01' },
        ]
      },
      { text: '🌸 资源导航', link: '/navigator-site' },
      { text: '面试', link: '/interview/ba-gu/js' },
    ],

    sidebar: {
      "/_project/": [
        {
          text: '工程化',
          items: [
            { text: '模块化的发展及 SystemJS 原理', link: '/_project/module_standard' },
          ]
        },
        {
          text: 'Browser',
          items: [
            { text: '浏览器中常见的观察者 Observer', link: '/_project/observer'}
          ]
        },
        {
          text: '提效工具',
          items: [
            { text: 'Charles 使用指南', link: '/_project/01-use-charles' },
            { text: 'iTerm2 + Oh-my-zh + p10k 终端美化', link: '/_project/02-use-iterm2' },
            { text: '基于 whistle + SwitchyOmega 的前端代理方案', link: '/_project/03-webfront-proxy' },
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
      "/react/": [
        { text: '工具速查', link: '/react/view' },
        {
          text: 'React',
          collapsed: true,
          items: [
            { text: 'use hooks', link: '/react/hooks' },
            { text: 'React for TypeScript', link: '/react/react-for-ts' },
            { text: '受控组件 vs 非受控组件', link: '/react/controlled-vs-uncontrolled' },
            { text: '深入理解 Suspense 和 ErrorBoundary', link: '/react/lazy-loading-error-catching' },
            { text: '自定义 Hooks', link: '/react/custom-hooks' },
          ]
        },
        {
          text: 'Router',
          collapsed: true,
          items: [
          ]
        },
        {
          text: '状态管理',
          collapsed: true,
          items: [
          ]
        },
        {
          text: 'Next.js',
          collapsed: true,
          items: [
          ]
        },
        {
          text: 'Remix',
          collapsed: true,
          items: [
          ]
        },
        {
          text: '周边生态',
          collapsed: true,
          items: [
          ]
        },
        {
          text: '一生之敌，源码',
          collapsed: true,
          items: [
          ]
        },
        {
          text: '样式处理方案',
          collapsed: true,
          items: [
            { text: 'tailwind', link: '/react/tailwind' },
            { text: 'css-in-js(styled component)', link: '/react/css-in-js' },
            { text: 'css module', link: '/react/styled-components' },
          ]
        },
        {
          text: '组件库开发',
          collapsed: true,
          items: [
            { text: 'StoryBook 组件库文档', link: '/react/components/storybook' },
            { text: '组件库打包', link: '/react/components/packaging' },
            { text: 'DatePickerPanel 日期选择面板', link: '/react/components/datepickerpanel' },
            { text: 'Calendar 日历', link: '/react/components/calendar' },
            { text: 'Icon 图标', link: '/react/components/icon' },
            { text: 'Space 间距', link: '/react/components/space' },
            { text: 'WaterMark 水印', link: '/react/components/watermark' },
            { text: 'message 全局提示', link: '/react/components/message' },
            { text: 'Popover 气泡卡片', link: '/react/components/popover' },
            { text: 'ColorPicker 颜色选择器', link: '/react/components/colorpicker' },
            { text: 'Tour 漫游式引导', link: '/react/components/tour' },
            { text: 'Form 表单', link: '/react/components/form' },
            { text: 'Upload 上传', link: '/react/components/upload' },
            { text: 'MutateObserver DOM变更', link: '/react/components/metateovserve' },
            { text: 'Portal 渲染到指定 DOM', link: '/react/components/portal' },
            { text: 'CopyToClipboard 复制到剪贴板', link: '/react/components/copyToClipboard' },
            { text: 'LazyLoad 懒加载', link: '/react/components/lazyload' },
            { text: '单元测试', link: '/react/components/test' },
          ]
        },
        {
          text: 'React Spring',
          collapsed: true,
          items: [
            { text: '弹簧动画', link: '/react/spring/01' },
            { text: '+ use-gesture 手势操作', link: '/react/spring/02' },
            { text: '划入划出转场动画', link: '/react/spring/03' },
            { text: '+ react-transition-group 过渡动画', link: '/react/spring/04' },
          ]
        },
        {
          text: 'React Playground',
          collapsed: true,
          items: [
          ]
        },
        {
          text: 'React Native',
          collapsed: true,
          items: [
          ]
        },
        {
          text: '低代码简易实现',
          collapsed: true,
          items: [
          ]
        },
      ],
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
            { text: '目录结构 & 基础命令', link: '/devops/01-dir' },
            { text: '常用命令 1', link: '/devops/02-linux' },
            { text: '常用命令 2', link: '/devops/03-linux' },
            { text: '服务操作 & 包管理器', link: '/devops/04-linux' },
            { text: 'Shell 基础', link: '/devops/03-shell' },
            { text: 'Shell 实践', link: '/devops/04-shell' },
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
          items: [
            { text: '安装&基本指令', link: '/devops/docker/01-docker' },
            { text: 'Dockerfile & docker compose', link: '/devops/docker/02-dockerfile'},
            { text: '实践', link: '/devops/docker/03-dockerfile' }
          ]
        },
        {
          text: 'K8s',
          collapsed: true,
          items: []
        },
        {
          text: 'Git',
          link: '/devops/git/01'
        },
        {
          text: 'Jenkins',
          collapsed: true,
          items: []
        }
      ],
      "/python/": [
        {
          text: '多版本&虚拟环境&依赖管理',
          link: '/python/00-env'
        },
        {
          text: 'Python 基础教程',
          collapsed: false,
          items: [
            { text: '01. 数字、字符串、列表及相关操作方法', link: '/python/01' },
            { text: '02. 流程控制、函数', link: '/python/02' },
            { text: '03. 元祖、列表、集合、字典', link: '/python/03' },
            { text: '04. 模块、包', link: '/python/04' },
            { text: '05. 字符串格式化、文件、异常处理', link: '/python/05' },
            { text: '06. 面向对象', link: '/python/06' },
            { text: '07. 函数式编程', link: '/python/07' },
          ]
        },
        {
          text: 'Python 进阶教程',
          collapsed: false,
          items: [
            { text: '01. 装饰器', link: '/python/advanced/02' },
            { text: '02. 迭代器与生成器', link: '/python/advanced/03' },
            { text: '03. 类中的魔法方法', link: '/python/advanced/04' },
            { text: '04. 元类', link: '/python/advanced/05' },
            { text: '05. Python 内存管理', link: '/python/advanced/06' },
            { text: '06. Python GIL', link: '/python/advanced/07' },
            { text: '07. 多线程', link: '/python/advanced/08' },
            { text: '08. 多进程', link: '/python/advanced/09' },
            { text: '09. asyncio 异步编程(协程)', link: '/python/advanced/10' },
          ]
        },
        {
          text: 'Python 自动化',
          collapsed: false,
          items: [
            { text: 'requests 接口请求', link: '/python/auto/01' },
            { text: 'playwright WebUI 自动化', link: '/python/auto/02' },
            { text: 'unittest 原生测试框架', link: '/python/auto/03' },
            { text: 'pytest 测试框架入门', link: '/python/auto/04' },
            { text: 'pytest 测试框架进阶', link: '/python/auto/05' },
            { text: 'beautifulsoup4 网页解析', link: '/python/auto/06' },
            { text: 'openpyxl Excel 操作', link: '/python/auto/07' },
            { text: 'pyyaml 读写 YAML 文件', link: '/python/auto/08' },
            { text: 'pandas 数据处理', link: '/python/auto/09' },
          ]
        },
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
      ],
      "/ai/": [
        {}
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DoubleXm/blog' }
    ]
  }
})

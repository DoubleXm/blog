import { defineConfig } from 'vitepress';
import { github, createSocialLinks, createAlgolia } from './setting.js';

export default defineConfig({
  base: '/blog/',
  srcDir: 'src',
  cacheDir: 'src/cache',
  outDir: 'dist',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }
    ]
  ],
  lastUpdated: true,
  useWebFonts: false,
  cleanUrls: true,
  title: 'DoubleX Blog',
  description: '一名前端二五仔的知识存储栈',
  lang: 'zh-CN',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    outline: 'deep',
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最近更新时间',
    editLink: {
      pattern: `${github}/blob/main/docs/:path`,
      text: '在 GitHub 上编辑此页面'
    },
    footer: {
      message: `DoubleX 的前端博客，欢迎 <a target="_blank" style="color: var(--vp-c-brand)" href="${github}">star ⭐</a> 让更多人发现`,
      copyright: `<a target="_blank" href="${github}/blob/main/LICENSE">MIT License DoubleXm </a> | 版权所有 © 2023-${new Date().getFullYear()}`
    },
    socialLinks: createSocialLinks(),
    algolia: createAlgolia(),

    nav: createNav(),
    sidebar: {
      // 专栏
      '/docs/special-column/vue/': createSpecialColumnSidebar(),
      // 面试
      '/docs/interview/': createInterviewSidebar(),
      // 随笔
      '/docs/essay': createEssaySidebar()
    }
  },
  vite: {
    server: {
      port: 8000
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
});

/**
 * @description 导航 navbar
 */
function createNav() {
  return [
    {
      text: '📝 随笔',
      link: '/docs/essay/index',
      activeMatch: '/docs/essay/'
    },
    {
      text: '🔥 专栏',
      items: [
        {
          text: '😤 手撕源码',
          link: '/docs/special-column/vue/00-导读',
          activeMatch: '/docs/special-column/vue/'
        },
        {
          text: '🤔 前端算法',
          link: '/docs/special-column/vue/00-导读',
          activeMatch: '/docs/special-column/vue/'
        },
        {
          text: '🤖 前端运维',
          link: '/docs/special-column/vue/00-导读',
          activeMatch: '/docs/special-column/vue/'
        }
      ]
    },
    {
      text: '🎉 面试',
      link: '/docs/interview/internet-questions',
      activeMatch: '/docs/interview/'
    },
    {
      text: '🎒 编程资源',
      items: [
        {
          text: '🔧 编程工具',
          link: '/docs/special-column/vue/00-导读',
          activeMatch: '/docs/special-column/vue/'
        },
        {
          text: '🔗 资源导航',
          link: '/docs/special-column/vue/00-导读',
          activeMatch: '/docs/special-column/vue/'
        }
      ]
    },
  ];
}

/**
 * @description 面试 sidebar
 */
function createInterviewSidebar() {
  return [
    {
      text: '',
      collapsed: false,
      items: [
        {
          text: '计算机网络',
          link: '/docs/interview/internet-questions'
        },
        { text: '浏览器', link: '/docs/interview/browser-questions' },
        { text: 'HTML、CSS', link: '/docs/interview/html-css' },
        { text: 'Javascript', link: '/docs/interview/javascript' },
        { text: 'TypeScript', link: '/docs/interview/typescript' },
        { text: '移动端', link: '/docs/interview/mobile' },
        { text: 'Vue2', link: '/docs/interview/vue2' },
        { text: 'React', link: '/docs/interview/react' },
        { text: 'Webpack', link: '/docs/interview/webpack' },
        { text: 'Vite', link: '/docs/interview/vite' },
        { text: 'Node', link: '/docs/interview/node' }
      ]
    }
  ];
}

/**
 * @description 专栏 sidebar
 */
function createSpecialColumnSidebar() {
  return [
    {
      items: [
        {
          text: 'VueJS',
          collapsed: false,
          items: [
            { text: '📚 导读', link: '/docs/special-column/vue/00-导读' },
            {
              text: '源码环境搭建',
              link: '/docs/special-column/vue/01-源码环境搭建'
            },
            {
              text: 'reactiveApi 实现',
              link: '/docs/special-column/vue/02-reactiveApi实现'
            },
            {
              text: '依赖收集与更新 effect 的实现',
              link: '/docs/special-column/vue/03-依赖收集与更新'
            }
          ]
        }
      ]
    }
  ];
}

/**
 * @description 随笔 sidebar
 */
function createEssaySidebar() {
  return [
    {
      text: 'NuxtJS',
      collapsed: false,
      items: [
        { text: 'Test 占位 0', link: '' },
        { text: 'Test 占位 1', link: '' }
      ]
    }
  ];
}

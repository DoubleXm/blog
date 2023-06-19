import { defineConfig } from 'vitepress';

const github = 'https://github.com/DoubleXm/blog';

export default defineConfig({
  base: '/blog/',
  srcDir: 'src',
  cacheDir: 'src/cache',
  outDir: 'dist',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
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
  title: 'Blog',
  description: '一名前端切图仔的知识存储栈',
  lang: 'zh-CN',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    outline: 'deep',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    // outlineTitle: '导航栏',
    socialLinks: [
      { icon: 'github', link: github },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="20" height="20"  viewBox="0 0 512 512" >
        <path fill="currentColor" d="M488.6 104.1c16.7 18.1 24.4 39.7 23.3 65.7v202.4c-.4 26.4-9.2 48.1-26.5 65.1c-17.2 17-39.1 25.9-65.5 26.7H92.02c-26.45-.8-48.21-9.8-65.28-27.2C9.682 419.4.767 396.5 0 368.2V169.8c.767-26 9.682-47.6 26.74-65.7C43.81 87.75 65.57 78.77 92.02 78h29.38L96.05 52.19c-5.75-5.73-8.63-13-8.63-21.79c0-8.8 2.88-16.06 8.63-21.797C101.8 2.868 109.1 0 117.9 0s16.1 2.868 21.9 8.603L213.1 78h88l74.5-69.397C381.7 2.868 389.2 0 398 0c8.8 0 16.1 2.868 21.9 8.603c5.7 5.737 8.6 12.997 8.6 21.797c0 8.79-2.9 16.06-8.6 21.79L394.6 78h29.3c26.4.77 48 9.75 64.7 26.1zm-38.8 69.7c-.4-9.6-3.7-17.4-10.7-23.5c-5.2-6.1-14-9.4-22.7-9.8H96.05c-9.59.4-17.45 3.7-23.58 9.8c-6.14 6.1-9.4 13.9-9.78 23.5v194.4c0 9.2 3.26 17 9.78 23.5s14.38 9.8 23.58 9.8H416.4c9.2 0 17-3.3 23.3-9.8c6.3-6.5 9.7-14.3 10.1-23.5V173.8zm-264.3 42.7c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2c-6.2 6.3-14 9.5-23.6 9.5c-9.6 0-17.5-3.2-23.6-9.5c-6.1-6.3-9.4-14-9.8-23.2v-33.3c.4-9.1 3.8-16.9 10.1-23.2c6.3-6.3 13.2-9.6 23.3-10c9.2.4 17 3.7 23.3 10zm191.5 0c6.3 6.3 9.7 14.1 10.1 23.2V273c-.4 9.2-3.7 16.9-9.8 23.2c-6.1 6.3-14 9.5-23.6 9.5c-9.6 0-17.4-3.2-23.6-9.5c-7-6.3-9.4-14-9.7-23.2v-33.3c.3-9.1 3.7-16.9 10-23.2c6.3-6.3 14.1-9.6 23.3-10c9.2.4 17 3.7 23.3 10z"></path>
      </svg>`
        },
        link: 'https://juejin.cn/user/1169536104532829'
      }
    ],
    lastUpdatedText: '最近更新时间',
    editLink: {
      pattern: `${github}/blob/main/docs/:path`,
      text: '在 GitHub 上编辑此页面'
    },
    footer: {
      message: `用心去做高质量的专业前端内容网站，欢迎 <a target="_blank" style="color: var(--vp-c-brand)" href="${github}">star ⭐</a> 让更多人发现`,
      copyright: `<a target="_blank" href="${github}/blob/main/LICENSE">MIT License</a> | 版权所有 © 2023-${new Date().getFullYear()}`
    },

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
        }
      ]
    },
    {
      text: '🎉 面试',
      link: '/docs/interview/internet-questions',
      activeMatch: '/docs/interview/'
    }
  ];
}

/**
 * @description 面试题 sidebar
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
          text: 'Vue',
          collapsed: false,
          items: [
            { text: '📚 导读', link: '/docs/special-column/vue/00-导读' },
            {
              text: '源码环境搭建',
              link: '/docs/special-column/vue/01-源码环境搭建'
            }
          ]
        }
      ]
    },
    {
      items: [
        {
          text: 'Vite',
          collapsed: false,
          items: [
            { text: '📚 导读', link: '/docs/special-column/vue/00-导读' },
            {
              text: '源码环境搭建',
              link: '/docs/special-column/vue/01-源码环境搭建'
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
      text: 'Nuxt3',
      collapsed: false,
      items: [
        { text: '接口请求封装 useFetch', link: '' },
        { text: '环境变量配置', link: '' }
      ]
    },
    {
      text: 'Node',
      collapsed: false,
      items: [
        { text: '接口请求封装 useFetch', link: '' },
        { text: '环境变量配置', link: '' }
      ]
    }
  ];
}

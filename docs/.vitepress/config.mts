import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'
// 导入 nav
import { nav } from './nav-config';

// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: blogTheme,
  sitemap: {
    hostname: 'https://doublexm.github.io',
  },
  base: '/blog/',
  srcDir: 'src',
  outDir: '../dist',
  cacheDir: '../cache',
  lang: 'zh-cn',
  title: 'DoubleX',
  description: 'DoubleX 的技术博客, 记录学习和总结...',
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ['link', { rel: 'icon', href: '/blog/favicon.ico', type: 'image/png' }]
  ],
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    // theme: 'material-theme',
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
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
    logo: '/logo.png',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/DoubleXm/blog/tree/main/docs/src'
      }
    ],
    nav
  },
})

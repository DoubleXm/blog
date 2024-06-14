// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'

// 开启RSS支持（RSS配置）
import type { Theme } from '@sugarat/theme'

const baseUrl = 'https://doublexm.github.io'
const RSS: Theme.RSSOptions = {
  title: 'DoubleX',
  baseUrl,
  copyright: 'Copyright (c) 2018-present, DoubleX',
  description: '你的指尖,拥有改变世界的力量（大前端相关技术分享）',
  language: 'zh-cn',
  image: 'https://doublexm.github.io/blog/logo.png',
  favicon: 'https://doublexm.github.io/blog/favicon.ico',
}

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  darkTransition: false,

  srcDir: './docs/src',
  // 开启RSS支持
  RSS,

  // 搜索
  // 默认开启 pagefind 离线的全文搜索支持（如使用其它的可以设置为false）
  // 如果npx pagefind 时间过长，可以手动将其安装为项目依赖 pnpm add pagefind
  search: false,

  // 页脚
  footer: {
    // message 字段支持配置为HTML内容，配置多条可以配置为数组
    // message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的）',
    copyright: 'MIT License | DoubleX',
    // icpRecord: {
    //   name: '蜀ICP备19011724号',
    //   link: 'https://beian.miit.gov.cn/'
    // },
    // securityRecord: {
    //   name: '公网安备xxxxx',
    //   link: 'https://www.beian.gov.cn/portal/index.do'
    // },
  },

  comment: {
    type: 'giscus',
    options: {
      repo: 'DoubleXm/blog',
      repoId: 'R_kgDOH5r6XQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOH5r6Xc4Cf5sV',
      inputPosition: 'top'
    },
    mobileMinify: true
  },

  recommend: {
    showSelf: true,
    nextText: '下一页',
    style: 'sidebar'
  },

  hotArticle: {
    pageSize: 12
  },

  // 主题色修改
  themeColor: 'el-blue',

  // 文章默认作者
  author: 'DoubleX',

  oml2d: {
    mobileDisplay: true,
    models: [
      {
        path: 'https://sugarat.s3.bitiful.net/npm/oml2d-model/models/Senko_Normals/senko.model3.json',
      }
    ],
    libraryUrls: {
      complete: 'https://sugarat.s3.bitiful.net/npm/oh-my-live2d/latest/lib/complete.js',
      cubism2: 'https://sugarat.s3.bitiful.net/npm/oh-my-live2d/latest/lib/cubism2.js',
      cubism5: 'https://sugarat.s3.bitiful.net/npm/oh-my-live2d/latest/lib/cubism5.js'
    }
  },

  // 友链
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top',
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://vitepress.dev/vitepress-logo-large.webp',
      url: 'https://vitepress.dev/',
    },
  ],

  buttonAfterArticle: {
    openTitle: '投"币"支持',
    closeTitle: '下次一定',
    content: `<img src="${baseUrl}/blog/money.jpeg">`,
    icon: 'wechatPay',
  },

  // 公告
  // popover: {
  //   title: '公告',
  //   body: [
  //     { type: 'text', content: '👇公众号👇---👇 微信 👇' },
  //     {
  //       type: 'image',
  //       src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
  //     },
  //     {
  //       type: 'text',
  //       content: '欢迎大家加群&私信交流'
  //     },
  //     {
  //       type: 'text',
  //       content: '文章首/文尾有群二维码',
  //       style: 'padding-top:0'
  //     },
  //     {
  //       type: 'button',
  //       content: '作者博客',
  //       link: 'https://sugarat.top'
  //     },
  //     {
  //       type: 'button',
  //       content: '加群交流',
  //       props: {
  //         type: 'success'
  //       },
  //       link: 'https://theme.sugarat.top/group.html',
  //     }
  //   ],
  //   duration: 0
  // },
})

export { blogTheme }

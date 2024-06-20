export const nav = [
  // { text: '面试', link: 'https://sugarat.top/aboutme.html' }
  {
    text: '技术笔记',
    items: [
      {
        text: '工具教程',
        link: '/_essay/utils/01-use-charles',
        activeMatch: '^/essay/utils/'
      }
    ]
  },
  {
    text: "源码学习",
    items: [
      {
        text: 'vue3 手写',
        link: '/_source-study/vue3/01-introduction',
      },
      {
        text: 'pinia 手写',
        link: '/_source-study/pinia/01-introduction',
      }
    ]
  },
  {
    text: 'Python',
    items: [
      {
        text: '基础',
        link: '/_python/basic/01-introduction',
        activeMatch: '^/python/basic'
      },
      {
        text: '进阶',
        link: '/_python/advanced/01-introduction',
      }
    ]
  },
  {
    text: '数据库',
    items: [
      {
        text: 'MySQL',
        link: '/_database/mysql/01-introduction',
        activeMatch: '^/_database/mysql'
      },
      {
        text: 'Redis',
        link: '/_database/redis/01-introduction',
        activeMatch: '^/_database/redis'
      }
    ]
  },
  {
    text: '前端运维',
    items: [
      {
        text: '基础',
        link: '/_dev-ops/basic/01-introduction',
        activeMatch: '^/python/basic'
      },
      {
        text: '进阶',
        link: '/_dev-ops/advanced/01-introduction',
      }
    ]
  },
  {
    text: '面试',
    items: [
      {
        text: 'JavaScript',
        link: '/_interview/javascript',
      },
      {
        text: 'TypeScript',
        link: '/_interview/typescript',
      },
      {
        text: 'React',
        link: '/_interview/react',
      },
      {
        text: 'Vite',
        link: '/_interview/vite',
      },
      {
        text: 'Webpack',
        link: '/_interview/webpack',
      },
      {
        text: 'NodeJS',
        link: '/_interview/node',
      },
      {
        text: '浏览器',
        link: '/_interview/browser',
      },
      {
        text: '计算机网络',
        link: '/_interview/network',
      },
      {
        text: '移动端',
        link: '/_interview/mobile',
      },
      {
        text: 'HTML、CSS',
        link: '/_interview/html-css',
      },
      {
        text: 'Vue2',
        link: '/_interview/vue2',
      },
    ]
  }
]
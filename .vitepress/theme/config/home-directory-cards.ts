export interface HomeDirectoryCardMeta {
  accentRgb: string;
  aliases?: string[];
  description: string;
  key: string;
  label: string;
  route?: string;
  stateLabel: string;
}

export const HOME_DIRECTORY_CARDS = [
  {
    accentRgb: '135, 220, 255',
    description:
      '聚焦模型术语、训练流程、能力边界与日常应用理解，适合作为 AI 基础概念的快速索引。',
    key: 'ai',
    label: 'AI',
    route: '/interview/ai/01',
    stateLabel: 'Research',
  },
  {
    accentRgb: '138, 219, 184',
    description:
      '围绕 Pinia 与 Vue Router，梳理响应式机制、插件体系、导航守卫与工程实践。',
    key: 'vue',
    label: 'Vue',
    route: '/vue/pinia/01',
    stateLabel: 'Active',
  },
  {
    accentRgb: '128, 201, 255',
    description:
      '从 Hooks 原理、组件模式到组件库设计与错误边界，覆盖 React 生态中的高频问题与实现思路。',
    key: 'react',
    label: 'React',
    route: '/react/view',
    stateLabel: 'Active',
  },
  {
    accentRgb: '255, 198, 136',
    description:
      '围绕 single-spa 的接入方案、子应用加载机制与运行时调度，整理微前端拆分与协作要点。',
    key: 'micro-web',
    label: '微前端',
    route: '/micro-web/single-spa',
    stateLabel: 'Active',
  },
  {
    accentRgb: '255, 166, 156',
    aliases: ['Node', 'Node.js'],
    description:
      '聚焦模块组织、依赖注入、控制器与 Provider 协作，面向服务端工程化的 NestJS 学习路径。',
    key: 'nodejs',
    label: 'NestJS',
    route: '/interview/ba-gu/node',
    stateLabel: 'Active',
  },
  {
    accentRgb: '238, 214, 154',
    description:
      '计划覆盖关系型数据库基础、索引设计、事务隔离、查询优化与数据建模等必备主题。',
    key: 'database',
    label: '数据库',
    stateLabel: 'Curating',
  },
  {
    accentRgb: '132, 214, 200',
    description:
      '覆盖 Linux 命令体系、Shell 脚本、Nginx、Docker 与部署交付链路的实践经验。',
    key: 'devops',
    label: 'DevOps',
    route: '/devops/01-dir',
    stateLabel: 'Active',
  },
  {
    accentRgb: '196, 176, 255',
    description:
      '包含环境管理、基础语法、进阶特性以及自动化测试与数据处理等 Python 常用能力。',
    key: 'python',
    label: 'Python',
    route: '/python/00-env',
    stateLabel: 'Active',
  },
] as const satisfies readonly HomeDirectoryCardMeta[];

export const HOME_DIRECTORY_CARD_BY_LABEL = new Map(
  HOME_DIRECTORY_CARDS.flatMap((item) =>
    [item.label, ...(item.aliases ?? [])].map((label) => [label, item] as const),
  ),
);

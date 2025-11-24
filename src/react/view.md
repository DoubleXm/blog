---
title: React 生态版图
layout: page
---

<script setup>
import views from '../components/react-view.json'
import ReactView from '../components/WatherFall.vue';

// // 模拟生成随机文本
// const getRandomText = (min, max) => {
//   const text = "这是一段测试描述文本，用于模拟不同高度的卡片内容。Vue3真棒，组合式API让逻辑复用变得非常简单。瀑布流布局的核心在于计算最短列并将下一个元素放入其中。";
//   const length = Math.floor(Math.random() * (max - min + 1)) + min;
//   return text.repeat(3).substring(0, length);
// };

// // 模拟生成数据
// const generateItems = (count) => {
//   return Array.from({ length: count }).map((_, i) => ({
//     id: Date.now() + i, // 确保 key 唯一
//     name: `创意卡片 ${Math.floor(Math.random() * 1000)}`,
//     description: getRandomText(20, 150), // 随机长度描述
//     tags: Math.random() > 0.5 ? ['Vue', 'Design', 'UI'] : [], // 随机标签
//     link: 'https://cn.vuejs.org/'
//   }));
// };

// const items = ref(generateItems(10));
</script>

<ReactView :list="views" />

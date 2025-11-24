<template>
  <div class="waterfall-wrapper" :style="styleVars">
    <div class="waterfall-container" ref="containerRef">
      <TransitionGroup name="list">
        <div
          v-for="card in layoutCards"
          :key="card.id"
          class="waterfall-item"
          :style="{
            width: `${cardWidth}px`,
            transform: `translate(${card.x}px, ${card.y}px)`,
            opacity: card.isRendered ? 1 : 0
          }"
          @click="handleCardClick(card.link)"
        >
          <div class="card-content">
            <div class="card-highlight"></div>

            <div v-if="card.image" class="card-img-wrapper">
               <img :src="card.image" loading="lazy" class="card-img" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <h3 class="card-title">{{ card.name }}</h3>
                <div class="icon-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </div>

              <p class="card-desc">{{ card.description }}</p>
              
              <div class="card-footer">
                <div class="mock-tags" v-if="card.tags && card.tags.length">
                  <span v-for="tag in card.tags" :key="tag" class="tag" :class="tag.toLowerCase()">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
      
      <div :style="{ height: `${containerHeight}px` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { useData } from 'vitepress';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
    required: true
  },
  // 卡片固定宽度（为了居中布局，我们需要固定宽度）
  cardWidth: {
    type: Number,
    default: 260
  },
  gap: {
    type: Number,
    default: 24
  }
});

// --- 1. 暗黑模式适配 (基于 VitePress) ---
const { isDark } = useData();

const styleVars = computed(() => {
  return isDark.value
    ? {
        // Dark Mode (深色模式) 配色
        '--wf-bg': '#1b1b1f',              // 页面大背景
        '--wf-card-bg': '#26262a',         // 卡片背景 (Elevated Surface)
        '--wf-text-main': '#dfdfd6',       // 标题色
        '--wf-text-sub': '#a0a0a0',        // 描述色
        '--wf-border': '1px solid rgba(255, 255, 255, 0.08)',
        '--wf-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        '--wf-shadow-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        '--wf-highlight': '#60a5fa',       // 强调色 (浅蓝)
        '--wf-tag-bg': 'rgba(255, 255, 255, 0.1)',
        '--wf-tag-text': '#cfcfcf',
        '--wf-line': 'rgba(255, 255, 255, 0.1)' // 分割线
      }
    : {
        // Light Mode (浅色模式) 配色
        '--wf-bg': '#fff',
        '--wf-card-bg': '#ffffff',
        '--wf-text-main': '#2c3e50',
        '--wf-text-sub': '#596b7e',        // 蓝灰调
        '--wf-border': '1px solid rgba(0, 0, 0, 0.04)',
        '--wf-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        '--wf-shadow-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
        '--wf-highlight': '#3b82f6',       // 强调色 (蓝)
        '--wf-tag-bg': '#eff6ff',
        '--wf-tag-text': '#3b82f6',
        '--wf-line': 'rgba(0, 0, 0, 0.06)'
      };
});

// --- 2. 核心布局状态 ---
const containerRef = ref(null);
const containerWidth = ref(0);
const layoutCards = ref([]);
const containerHeight = ref(0);
let resizeObserver = null;

// --- 3. 计算逻辑 ---

// 计算列数
const columns = computed(() => {
  if (containerWidth.value <= 0) return 1;
  const cols = Math.floor((containerWidth.value + props.gap) / (props.cardWidth + props.gap));
  return cols > 0 ? cols : 1;
});

// 计算居中偏移量 (关键：(容器宽 - 内容总宽) / 2)
const leftOffset = computed(() => {
  if (containerWidth.value <= 0) return 0;
  const contentWidth = columns.value * props.cardWidth + (columns.value - 1) * props.gap;
  const offset = (containerWidth.value - contentWidth) / 2;
  return offset > 0 ? offset : 0;
});

// 瀑布流核心算法
const calculateLayout = async () => {
  if (!containerRef.value || props.list.length === 0) return;

  // 初始化每列高度
  const columnHeights = new Array(columns.value).fill(0);
  
  // 临时数据，初始位置设为0，先渲染 DOM 以测量高度
  const tempCards = props.list.map(item => ({ 
    ...item, 
    x: 0, 
    y: 0, 
    isRendered: false 
  }));

  layoutCards.value = tempCards;
  
  // 等待 DOM 更新，文字换行等会影响高度
  await nextTick();

  const items = containerRef.value.querySelectorAll('.waterfall-item');
  if (items.length !== tempCards.length) return;

  tempCards.forEach((card, index) => {
    const el = items[index];
    const cardHeight = el.offsetHeight;

    // 寻找最矮的一列
    let minHeight = Math.min(...columnHeights);
    let minIndex = columnHeights.indexOf(minHeight);

    // 设置坐标：需加上居中的 leftOffset
    card.x = leftOffset.value + minIndex * (props.cardWidth + props.gap);
    card.y = minHeight;
    
    // 更新该列高度
    columnHeights[minIndex] += cardHeight + props.gap;
    
    // 标记为已渲染，显示出来
    card.isRendered = true;
  });

  // 设置容器总高度
  containerHeight.value = Math.max(...columnHeights);
  layoutCards.value = [...tempCards];
};

// --- 4. 事件与监听 ---

const handleCardClick = (link) => {
  if (link) window.open(link, '_blank');
};

const initResizeObserver = () => {
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width;
    }
  });
  if (containerRef.value) resizeObserver.observe(containerRef.value);
};

// 数据源或卡片宽度变化时重排
watch([() => props.list, () => props.cardWidth], () => {
  calculateLayout();
}, { deep: true });

// 容器宽度变化时重排
watch(containerWidth, () => {
  calculateLayout();
});

onMounted(() => {
  initResizeObserver();
  // 延时一下确保父级布局已稳定
  setTimeout(() => calculateLayout(), 100);
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
/* 全局变量作用域 */
.waterfall-wrapper {
  width: 100%;
  min-height: 100%; /* 确保在内容少时也撑满 */
  background-color: var(--wf-bg);
  transition: background-color 0.3s ease;
  padding: 40px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.waterfall-container {
  position: relative;
  width: 100%;
  max-width: 1400px; /* 限制最大宽，防止大屏过散 */
  margin: 0 auto;
}

.waterfall-item {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  /* 优化动画曲线 */
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease;
  will-change: transform, opacity;
  padding-bottom: 10px; /* 预留阴影空间 */
}

/* 卡片容器 */
.card-content {
  background: var(--wf-card-bg);
  border-radius: 16px;
  border: var(--wf-border);
  box-shadow: var(--wf-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

/* 顶部装饰条 */
.card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--wf-highlight), #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Hover 交互效果 */
.waterfall-item:hover .card-content {
  transform: translateY(-6px) scale(1.01);
  box-shadow: var(--wf-shadow-hover);
  border-color: rgba(59, 130, 246, 0.2);
}
.waterfall-item:hover .card-highlight {
  opacity: 1;
}
.waterfall-item:hover .icon-link {
  opacity: 1;
  transform: translate(2px, -2px);
  color: var(--wf-highlight);
}

/* 图片 */
.card-img-wrapper {
  width: 100%;
}
.card-img {
  width: 100%;
  display: block;
  object-fit: cover;
  border-bottom: var(--wf-border);
}

/* 内容主体 */
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--wf-text-main);
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
}
.icon-link {
  color: var(--wf-text-sub);
  opacity: 0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

/* 描述 */
.card-desc {
  margin: 0;
  font-size: 14px;
  color: var(--wf-text-sub);
  line-height: 1.65;
  font-weight: 400;
  transition: color 0.3s ease;
}

/* 底部标签区 */
.card-footer {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px dashed var(--wf-line);
  display: flex;
  align-items: center;
}

.mock-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--wf-tag-bg);
  color: var(--wf-tag-text);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease;
}

/* 列表进入/离开动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
<template>
  <div class="waterfall-wrapper" :style="styleVars">

    <div class="controls-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="搜索名称、描述或标签..."
          @keydown.enter="calculateLayout"
        />
        <button v-if="searchTerm" @click="searchTerm = ''" class="clear-btn">
          &times;
        </button>
        <svg v-else class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
    </div>

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

            <div class="card-body">
              <div class="card-header">
                <span class="card-icon">{{ getIcon(card.tags[0]) }}</span>
                <h3 class="card-title">{{ card.name }}</h3>
                <div class="icon-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
              </div>

              <p class="card-desc">{{ card.description }}</p>
            </div>
            
            <div class="card-footer">
              <div class="mock-tags" v-if="card.tags && card.tags.length">
                <span v-for="tag in card.tags" :key="tag" class="tag" :class="tag.toLowerCase()">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
      
      <div :style="{ height: `${containerHeight}px` }"></div>
      
      <div v-if="filteredList.length === 0 && !loading" class="empty-state">
        抱歉，没有找到匹配 " {{ searchTerm }} " 或当前标签组合的结果。
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { useData } from 'vitepress';


// =================================================================
// 布局与筛选逻辑
// =================================================================

const props = defineProps({
  // 保持 prop 定义
  // list: [{
  //   "id": 32,
  //   "name": "storybook",
  //   "description": "一个用于开发和测试 React 组件的工具。它允许你在一个独立的环境中创建和展示组件，方便调试和文档编写。",
  //   "tags": ["UI", "Storybook"],
  //   "link": "https://storybook.js.org/"
  // }]
  list: {
    type: Array,
    default: () => [],
    required: false
  },
  cardWidth: {
    type: Number,
    default: 260
  },
  gap: {
    type: Number,
    default: 24
  }
});

// --- 筛选与搜索状态 ---
const searchTerm = ref('');
const activeTags = ref([]);
const loading = ref(false); // 模拟加载状态

// 提取所有不重复的标签，用于筛选按钮
const allTags = computed(() => {
  const tags = new Set();
  props.list.forEach(item => {
    item.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// 获取卡片图标（增强 UI 辨识度）
const getIcon = (tag) => {
  const tagLower = tag ? tag.toLowerCase() : '';
  if (tagLower.includes('state')) return '⚛️';
  if (tagLower.includes('ui') || tagLower.includes('design')) return '✨';
  if (tagLower.includes('framework')) return '📦';
  if (tagLower.includes('routing')) return '🧭';
  if (tagLower.includes('css')) return '🎨';
  if (tagLower.includes('animation')) return '💫';
  if (tagLower.includes('data')) return '📊';
  if (tagLower.includes('testing')) return '🧪';
  return '🔗';
};

// 核心过滤计算属性
const filteredList = computed(() => {
  let list = props.list;
  const searchLower = searchTerm.value.toLowerCase().trim();

  // 1. 标签过滤 (AND 逻辑：必须包含所有选中的标签)
  if (activeTags.value.length > 0) {
    list = list.filter(item => {
      // 检查 item 的 tags 是否包含所有 activeTags
      return activeTags.value.every(activeTag => item.tags.includes(activeTag));
    });
  }

  // 2. 搜索框过滤 (Name, Description, Tags 模糊匹配)
  if (searchLower) {
    list = list.filter(item => {
      const tagsString = item.tags.join(' ').toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        tagsString.includes(searchLower)
      );
    });
  }
  
  return list;
});


// --- 瀑布流布局逻辑 (与之前保持一致，但数据源改为 filteredList) ---

const { isDark } = useData();
// (styleVars 定义保持不变，直接使用上面的代码)
const styleVars = computed(() => {
  return isDark.value
    ? {
        '--wf-bg': '#1b1b1f', '--wf-card-bg': '#26262a', '--wf-text-main': '#dfdfd6', '--wf-text-sub': '#a0a0a0', '--wf-border': '1px solid rgba(255, 255, 255, 0.08)', '--wf-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.3)', '--wf-shadow-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.5)', '--wf-highlight': '#60a5fa', '--wf-tag-bg': 'rgba(255, 255, 255, 0.1)', '--wf-tag-text': '#cfcfcf', '--wf-line': 'rgba(255, 255, 255, 0.1)', '--wf-control-bg': '#2c2c31', '--wf-input-border': 'rgba(255, 255, 255, 0.1)', '--wf-tag-filter-bg': 'rgba(255, 255, 255, 0.05)', '--wf-tag-filter-active-bg': '#60a5fa', '--wf-tag-filter-active-text': '#fff'
      }
    : {
        '--wf-bg': '#fff', '--wf-card-bg': '#ffffff', '--wf-text-main': '#2c3e50', '--wf-text-sub': '#596b7e', '--wf-border': '1px solid rgba(0, 0, 0, 0.04)', '--wf-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', '--wf-shadow-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)', '--wf-highlight': '#3b82f6', '--wf-tag-bg': '#eff6ff', '--wf-tag-text': '#3b82f6', '--wf-line': 'rgba(0, 0, 0, 0.06)', '--wf-control-bg': '#ffffff', '--wf-input-border': 'rgba(0, 0, 0, 0.1)', '--wf-tag-filter-bg': '#e5e7eb', '--wf-tag-filter-active-bg': '#3b82f6', '--wf-tag-filter-active-text': '#ffffff'
      };
});

const containerRef = ref(null);
const containerWidth = ref(0);
const layoutCards = ref([]);
const containerHeight = ref(0);
let resizeObserver = null;

const columns = computed(() => {
  if (containerWidth.value <= 0) return 1;
  const cols = Math.floor((containerWidth.value + props.gap) / (props.cardWidth + props.gap));
  return cols > 0 ? cols : 1;
});

const leftOffset = computed(() => {
  if (containerWidth.value <= 0) return 0;
  const contentWidth = columns.value * props.cardWidth + (columns.value - 1) * props.gap;
  const offset = (containerWidth.value - contentWidth) / 2;
  return offset > 0 ? offset : 0;
});

const calculateLayout = async () => {
  if (!containerRef.value || filteredList.value.length === 0) {
    layoutCards.value = [];
    containerHeight.value = 0;
    return;
  }

  const columnHeights = new Array(columns.value).fill(0);
  
  const tempCards = filteredList.value.map(item => ({ 
    ...item, 
    x: 0, 
    y: 0, 
    isRendered: false 
  }));

  // 关键：先渲染占位元素以测量高度
  layoutCards.value = tempCards;
  await nextTick();

  const items = containerRef.value.querySelectorAll('.waterfall-item');
  if (items.length !== tempCards.length) return;

  tempCards.forEach((card, index) => {
    const el = items[index];
    const cardHeight = el.offsetHeight;

    let minHeight = Math.min(...columnHeights);
    let minIndex = columnHeights.indexOf(minHeight);

    card.x = leftOffset.value + minIndex * (props.cardWidth + props.gap);
    card.y = minHeight;
    
    columnHeights[minIndex] += cardHeight + props.gap;
    card.isRendered = true;
  });

  containerHeight.value = Math.max(...columnHeights);
  layoutCards.value = [...tempCards];
};

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

// 监听筛选列表变化，触发重排
watch(filteredList, () => {
  calculateLayout();
});

// 容器宽度变化时重排
watch(containerWidth, () => {
  calculateLayout();
});

onMounted(() => {
  initResizeObserver();
  setTimeout(() => calculateLayout(), 100);
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
/* =================================================================
   UI/UE 重新设计后的样式 (Minimalist & Functional)
   ================================================================= */

/* --- 基础与颜色变量 --- */
.waterfall-wrapper {
  background-color: var(--wf-bg);
  transition: background-color 0.3s ease;
  padding: 40px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
}

.waterfall-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* --- 过滤器/搜索栏样式 (新 UI) --- */
.controls-bar {
  max-width: 1400px;
  margin: 0 auto 30px;
  padding: 0 24px; 
}
.search-box {
  position: relative;
  margin-bottom: 20px;
  background: var(--wf-control-bg);
  border-radius: 12px;
  box-shadow: var(--wf-shadow);
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid var(--wf-input-border);
}
.search-box input {
  flex-grow: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--wf-text-main);
  outline: none;
}
.search-box input::placeholder {
  color: var(--wf-text-sub);
  opacity: 0.6;
}
.search-icon {
  color: var(--wf-text-sub);
  margin-right: 8px;
  opacity: 0.7;
}
.clear-btn {
  background: transparent;
  border: none;
  color: var(--wf-text-sub);
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
}

.tag-filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-tag, .clear-all-btn {
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.filter-tag {
  background: var(--wf-tag-filter-bg);
  color: var(--wf-text-sub);
}
.filter-tag:hover {
  background: var(--wf-tag-filter-bg);
  filter: brightness(1.1);
}
.filter-tag.is-active {
  background: var(--wf-tag-filter-active-bg);
  color: var(--wf-tag-filter-active-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.clear-all-btn {
  background: none;
  color: var(--wf-text-sub);
}
.clear-all-btn:hover {
  color: var(--wf-highlight);
}

/* --- 瀑布流卡片样式 --- */
.waterfall-item {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease;
  padding-bottom: 10px;
  padding-left: 10px; /* 增加左侧内边距，配合居中布局 */
}

.card-content {
  background: var(--wf-card-bg);
  border-radius: 12px; /* 稍微减小圆角，更锐利 */
  border: var(--wf-border);
  box-shadow: var(--wf-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-content:active {
  transform: scale(0.99); /* 增加点击反馈 */
}

/* Hover 交互效果 (更克制) */
.waterfall-item:hover .card-content {
  transform: translateY(-4px); /* 上浮距离减小 */
  box-shadow: var(--wf-shadow-hover);
}
.waterfall-item:hover .card-highlight {
  opacity: 1;
}
.waterfall-item:hover .icon-link {
  opacity: 1;
  transform: translate(2px, -2px);
  color: var(--wf-highlight);
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

.card-body {
  padding: 16px; 
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1; /* 确保 body 撑开空间 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 居中对齐，更整齐 */
  gap: 10px;
}
.card-icon {
  font-size: 20px;
  margin-right: 8px;
  flex-shrink: 0;
}
.card-title {
  margin: 0;
  font-size: 16px; /* 字体略小，更精致 */
  font-weight: 700;
  color: var(--wf-text-main);
  line-height: 1.4;
  flex-grow: 1;
}
.icon-link {
  color: var(--wf-text-sub);
  opacity: 0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.card-desc {
  margin: 0;
  font-size: 13px; /* 描述文字略小，突出标题 */
  color: var(--wf-text-sub);
  line-height: 1.6;
  /* overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制三行，保持卡片高度差异不会过大 */
  -webkit-box-orient: vertical;
}

/* 底部标签区 (不再使用虚线分割，改为背景色分割) */
.card-footer {
  /* 背景色稍微不同，增加底部视觉权重 */
  background: rgba(0, 0, 0, 0.01); 
  border-top: 1px solid var(--wf-line); /* 保持细微分割线 */
  padding: 12px 16px;
}
:global(.dark) .card-footer {
  background: rgba(255, 255, 255, 0.02);
}

.mock-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* 标签间距略小 */
}
.tag {
  font-size: 10px; /* 标签字体极小，作为元数据 */
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  background: var(--wf-tag-bg);
  color: var(--wf-tag-text);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* 结果为空提示 */
.empty-state {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--wf-text-sub);
  font-size: 16px;
  padding: 20px;
  text-align: center;
  max-width: 80%;
}

/* 列表进入/离开动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(20px);
}
</style>
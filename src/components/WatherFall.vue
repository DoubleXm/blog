<template>
  <section class="blog-terminal-surface relative isolate overflow-hidden text-terminal-text">
    <div class="blog-grid-pattern pointer-events-none absolute inset-0 opacity-40" />

    <div class="relative mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10">
      <header class="mb-12">
        <div
          v-motion
          class="mb-8 inline-flex items-center gap-2 rounded-full border border-terminal-outline/25 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-terminal text-terminal-primary"
          :initial="heroMotionInitial"
          :visible-once="heroMotionVisible"
        >
          <span class="h-2 w-2 rounded-full bg-terminal-accent shadow-terminal" />
          React ecosystem indexed
        </div>

        <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
          <div
            v-motion
            :initial="heroMotionInitial"
            :visible-once="heroMotionVisibleWithDelay(80)"
          >
            <p class="font-mono text-xs uppercase tracking-[0.38em] text-terminal-secondary">
              react resource map
            </p>
            <h1 class="mt-4 font-display text-5xl font-bold tracking-tight text-terminal-text md:text-7xl">
              REACT <span class="text-terminal-primary">STACK</span>
            </h1>
            <p class="mt-6 max-w-3xl text-base leading-8 text-terminal-secondary md:text-lg">
              保留搜索和标签过滤，用统一终端卡片呈现 React 常用框架、状态管理、组件库和测试工具，去掉旧版瀑布流里的装饰 icon。
            </p>
          </div>

          <div
            v-motion
            class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1"
            :initial="heroMotionInitial"
            :visible-once="heroMotionVisibleWithDelay(140)"
          >
            <div class="resource-stat-card">
              <span>VISIBLE_CARDS</span>
              <strong>{{ filteredList.length }}</strong>
            </div>
            <div class="resource-stat-card">
              <span>ACTIVE_FILTERS</span>
              <strong>{{ activeTags.length || 0 }}</strong>
            </div>
          </div>
        </div>

        <div
          v-motion
          class="mt-8 resource-filter-panel"
          :initial="heroMotionInitial"
          :visible-once="heroMotionVisibleWithDelay(200)"
        >
          <label class="resource-search-box">
            <span class="resource-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>
            <input
              v-model="searchTerm"
              class="resource-search-input"
              type="text"
              placeholder="搜索名称、描述或标签..."
            />
          </label>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              v-for="tag in allTags"
              :key="tag"
              type="button"
              class="resource-filter-tag"
              :class="{ 'is-active': activeTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>

            <button
              v-if="activeTags.length || searchTerm.trim()"
              type="button"
              class="resource-clear-button"
              @click="clearFilters"
            >
              clear filters
            </button>
          </div>
        </div>
      </header>

      <transition name="resource-boot">
        <div v-if="booting" class="resource-boot-panel">
          <p class="font-mono text-[11px] font-bold uppercase tracking-terminal text-terminal-primary">
            syncing react landscape...
          </p>
          <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="index in 6"
              :key="index"
              class="h-32 animate-pulse rounded-xl border border-terminal-outline/25 bg-terminal-panel"
            />
          </div>
        </div>
      </transition>

      <div
        v-if="filteredList.length"
        class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      >
        <SourceCard
          v-for="(card, index) in normalizedCards"
          :key="card.link"
          :data="card"
          :delay="220 + index * 45"
          :eyebrow="card.tags?.[0]"
          cta-label="官方文档"
        />
      </div>

      <div
        v-else
        class="flex min-h-[320px] items-center justify-center rounded-2xl border border-terminal-outline/25 bg-terminal-panel px-6 text-center text-terminal-secondary"
      >
        <div>
          <p class="font-display text-2xl font-bold text-terminal-text">
            当前过滤条件没有结果
          </p>
          <p class="mt-3 text-sm leading-7">
            可以减少标签条件，或改用更短的关键词重新检索。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import SourceCard from './SourceCard.vue';

interface ResourceNode {
  description: string;
  id: number;
  link: string;
  name: string;
  tags: string[];
}

const props = withDefaults(
  defineProps<{
    list?: ResourceNode[];
  }>(),
  {
    list: () => [],
  },
);

const searchTerm = ref('');
const activeTags = ref<string[]>([]);
const booting = ref(true);

let bootTimer: number | undefined;

const heroMotionInitial = {
  filter: 'blur(8px)',
  opacity: 0,
  y: 18,
};

const heroMotionVisible = {
  filter: 'blur(0px)',
  opacity: 1,
  transition: {
    duration: 560,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  y: 0,
};

function heroMotionVisibleWithDelay(delay: number) {
  return {
    ...heroMotionVisible,
    transition: {
      ...heroMotionVisible.transition,
      delay,
    },
  };
}

const allTags = computed(() => {
  const tags = new Set<string>();
  props.list.forEach((item) => {
    item.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort((left, right) => left.localeCompare(right));
});

const filteredList = computed(() => {
  const searchValue = searchTerm.value.trim().toLowerCase();

  return props.list.filter((item) => {
    const matchTags =
      activeTags.value.length === 0 ||
      activeTags.value.every((tag) => item.tags.includes(tag));

    if (!matchTags) {
      return false;
    }

    if (!searchValue) {
      return true;
    }

    const haystack = `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
    return haystack.includes(searchValue);
  });
});

const normalizedCards = computed(() =>
  filteredList.value.map((item) => ({
    description: item.description,
    link: item.link,
    tags: item.tags,
    title: item.name,
  })),
);

function toggleTag(tag: string) {
  activeTags.value = activeTags.value.includes(tag)
    ? activeTags.value.filter((item) => item !== tag)
    : [...activeTags.value, tag];
}

function clearFilters() {
  activeTags.value = [];
  searchTerm.value = '';
}

onMounted(() => {
  bootTimer = window.setTimeout(() => {
    booting.value = false;
  }, 260);
});

onBeforeUnmount(() => {
  if (bootTimer) {
    window.clearTimeout(bootTimer);
  }
});
</script>

<style scoped>
.resource-stat-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--blog-ghost-border);
  border-radius: 16px;
  padding: 18px 20px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.044) 0%, rgb(255 255 255 / 0.012) 34%, transparent 100%),
    linear-gradient(135deg, rgb(var(--blog-color-primary-rgb) / 0.03) 0%, transparent 30%),
    rgb(var(--blog-color-surface-base-rgb) / 0.98);
}

.resource-stat-card span,
.resource-stat-card strong {
  font-family: var(--blog-font-mono);
  text-transform: uppercase;
}

.resource-stat-card span {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--blog-color-text-secondary);
}

.resource-stat-card strong {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--blog-color-text);
}

.resource-filter-panel,
.resource-boot-panel {
  border: 1px solid var(--blog-ghost-border);
  border-radius: 18px;
  padding: 20px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.044) 0%, rgb(255 255 255 / 0.012) 34%, transparent 100%),
    linear-gradient(135deg, rgb(var(--blog-color-primary-rgb) / 0.03) 0%, transparent 30%),
    rgb(var(--blog-color-surface-base-rgb) / 0.98);
  box-shadow: var(--blog-shadow-panel);
}

.resource-search-box {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--blog-ghost-border-strong);
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.038) 0%, transparent 100%),
    rgb(var(--blog-color-surface-low-rgb) / 0.98);
}

.resource-search-box::after {
  position: absolute;
  right: 16px;
  bottom: 0;
  left: 16px;
  height: 2px;
  background: linear-gradient(90deg, rgb(var(--blog-color-primary-rgb) / 0.58), transparent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.24s ease;
  content: '';
}

.resource-search-box:focus-within::after {
  transform: scaleX(1);
}

.resource-search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  color: var(--blog-color-text-secondary);
}

.resource-search-icon svg {
  width: 18px;
  height: 18px;
}

.resource-search-input {
  flex: 1;
  border: 0;
  padding: 16px 18px 16px 0;
  font-family: var(--blog-font-mono);
  font-size: 0.84rem;
  color: var(--blog-color-text);
  background: transparent;
  outline: none;
}

.resource-search-input::placeholder {
  color: var(--blog-color-text-muted);
}

.resource-filter-tag,
.resource-clear-button {
  border: 1px solid var(--blog-ghost-border-strong);
  border-radius: 999px;
  padding: 8px 14px;
  font-family: var(--blog-font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.resource-filter-tag {
  color: var(--blog-color-text-secondary);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.03) 0%, transparent 100%),
    rgb(var(--blog-color-surface-high-rgb) / 0.68);
}

.resource-filter-tag:hover,
.resource-filter-tag.is-active {
  transform: translateY(-1px);
  border-color: rgb(var(--blog-color-primary-rgb) / 0.28);
  color: var(--blog-color-primary);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.024) 0%, transparent 100%),
    rgb(var(--blog-color-primary-rgb) / 0.13);
}

.resource-clear-button {
  color: var(--blog-color-primary-container);
  background: transparent;
}

.resource-clear-button:hover {
  border-color: var(--blog-accent-border-strong);
  background: var(--blog-accent-fill);
}

.resource-boot-enter-active,
.resource-boot-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.resource-boot-enter-from,
.resource-boot-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

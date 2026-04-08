<template>
  <section class="blog-terminal-surface relative isolate overflow-hidden text-terminal-text">
    <div class="blog-grid-pattern pointer-events-none absolute inset-0 opacity-40" />

    <div class="relative mx-auto w-full max-w-[1536px] px-6 pb-20 pt-24 md:px-8 xl:px-10">
      <header class="mb-16">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div
              v-motion
              :initial="heroMotionInitial"
              :visible-once="heroMotionVisible"
            >
              <h1 class="font-display text-5xl font-bold tracking-tight text-terminal-text md:text-7xl xl:text-8xl">
                RESOURCE <span class="text-terminal-primary">NAVIGATOR</span>
              </h1>
              <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-terminal-muted md:text-xs">
                curated links for builders // search index
              </p>
            </div>

            <div
              v-motion
              class="w-full md:w-[450px]"
              :initial="heroMotionInitial"
              :visible-once="heroMotionVisibleWithDelay(120)"
            >
              <label class="resource-search-box">
                <span class="resource-search-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                </span>
                <input
                  v-model="keyword"
                  class="resource-search-input"
                  type="text"
                  placeholder="搜索工具..."
                />
              </label>
            </div>
          </div>

          <div
            v-motion
            class="h-px w-full bg-gradient-to-r from-terminal-primary/30 via-terminal-outline/30 to-transparent"
            :initial="heroMotionInitial"
            :visible-once="heroMotionVisibleWithDelay(180)"
          />

          <div
            v-motion
            class="mt-1 flex flex-wrap gap-x-3 gap-y-3 px-1"
            :initial="heroMotionInitial"
            :visible-once="heroMotionVisibleWithDelay(240)"
          >
            <button
              type="button"
              class="resource-filter-tag"
              :class="{ 'is-active': activeCategory === '' }"
              @click="activeCategory = ''"
            >
              ALL
            </button>
            <button
              v-for="section in sectionTags"
              :key="section"
              type="button"
              class="resource-filter-tag"
              :class="{ 'is-active': activeCategory === section }"
              @click="activeCategory = section"
            >
              {{ section }}
            </button>
          </div>
        </div>
      </header>

      <transition name="resource-boot">
        <div v-if="booting" class="resource-boot-panel">
          <p class="font-mono text-[11px] font-bold uppercase tracking-terminal text-terminal-primary">
            hydrating resource registry...
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

      <div v-if="filteredSections.length" class="space-y-16">
          <section
            v-for="(section, sectionIndex) in filteredSections"
            :id="`resource-section-${sectionIndex}`"
            :key="section.title"
            class="scroll-mt-28"
          >
            <div
              v-motion
              class="mb-8 flex flex-wrap items-center gap-4"
              :initial="heroMotionInitial"
              :visible-once="heroMotionVisibleWithDelay(120 + sectionIndex * 40)"
            >
              <h2 class="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.38em] text-terminal-accent">
                <span class="h-px w-10 bg-terminal-accent opacity-50" />
                {{ section.title }}
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SourceCard
                v-for="(item, cardIndex) in section.list"
                :key="item.title"
                :data="item"
                cta-label="打开站点"
                :delay="80 + cardIndex * 18"
              />
            </div>
          </section>
      </div>

      <div
        v-else
        class="flex min-h-[320px] items-center justify-center rounded-2xl border border-terminal-outline/25 bg-terminal-panel px-6 text-center text-terminal-secondary"
      >
        <div>
          <p class="font-display text-2xl font-bold text-terminal-text">
            没有匹配结果
          </p>
          <p class="mt-3 text-sm leading-7">
            当前搜索词为 “{{ keyword.trim() }}”，可以尝试更短的关键词或切换分类名。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import SourceCard from './SourceCard.vue';
import siteConfig from './navigator-site.json';

interface ResourceItem {
  cover?: string;
  description: string;
  link: string;
  tags?: string[];
  title: string;
}

interface ResourceSection {
  list: ResourceItem[];
  title: string;
}

const keyword = ref('');
const activeCategory = ref('');
const booting = ref(true);

let bootTimer: number | undefined;

const heroMotionInitial = {
  filter: 'blur(4px)',
  opacity: 0,
  y: 10,
};

const heroMotionVisible = {
  filter: 'blur(0px)',
  opacity: 1,
  transition: {
    duration: 240,
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

const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());
const normalizedCategory = computed(() => activeCategory.value.trim().toLowerCase());

const sectionTags = computed(() =>
  (siteConfig.list as ResourceSection[]).map((section) => section.title),
);

const filteredSections = computed<ResourceSection[]>(() =>
  (siteConfig.list as ResourceSection[])
    .filter((section) => {
      if (!normalizedCategory.value) {
        return true;
      }

      return section.title.toLowerCase() === normalizedCategory.value;
    })
    .map((section) => ({
      title: section.title,
      list: section.list.filter((item) => {
        if (!normalizedKeyword.value) {
          return true;
        }

        const text = `${item.title} ${item.description}`.toLowerCase();
        return text.includes(normalizedKeyword.value);
      }),
    }))
    .filter((section) => section.list.length > 0),
);

onMounted(() => {
  bootTimer = window.setTimeout(() => {
    booting.value = false;
  }, 120);
});

onBeforeUnmount(() => {
  if (bootTimer) {
    window.clearTimeout(bootTimer);
  }
});
</script>

<style scoped>
.resource-boot-panel {
  border: 1px solid var(--blog-ghost-border);
  border-radius: 18px;
  padding: 20px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.044) 0%, rgb(255 255 255 / 0.012) 34%, transparent 100%),
    linear-gradient(135deg, rgb(var(--blog-color-primary-rgb) / 0.028) 0%, transparent 30%),
    rgb(var(--blog-color-surface-base-rgb) / 0.98);
  box-shadow: var(--blog-shadow-panel);
}

.resource-search-box {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 56px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.038) 0%, transparent 100%),
    rgb(var(--blog-color-surface-low-rgb) / 0.98);
}

.resource-search-box::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, rgb(var(--blog-color-primary-container-rgb) / 0.56), rgb(var(--blog-color-primary-rgb) / 0));
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
  width: 52px;
  color: var(--blog-color-text-secondary);
}

.resource-search-icon svg {
  width: 18px;
  height: 18px;
}

.resource-search-input {
  flex: 1;
  border: 0;
  padding: 16px 12px 16px 0;
  font-family: var(--blog-font-mono);
  font-size: 0.84rem;
  color: var(--blog-color-text);
  background: transparent;
  outline: none;
}

.resource-search-input::placeholder {
  color: rgb(var(--blog-color-text-faint-rgb) / 0.64);
}

.resource-filter-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 14px;
  border: 1px solid var(--blog-ghost-border-strong);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.03) 0%, transparent 100%),
    rgb(var(--blog-color-surface-high-rgb) / 0.7);
  font-family: var(--blog-font-mono);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blog-color-text-secondary);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.resource-filter-tag:hover {
  transform: translateY(-1px);
  border-color: var(--blog-charged-border);
  color: var(--blog-color-text);
}

.resource-filter-tag.is-active {
  border-color: rgb(var(--blog-color-primary-rgb) / 0.3);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.024) 0%, transparent 100%),
    rgb(var(--blog-color-primary-rgb) / 0.14);
  color: var(--blog-color-primary);
}

.resource-boot-enter-active,
.resource-boot-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.resource-boot-enter-from,
.resource-boot-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

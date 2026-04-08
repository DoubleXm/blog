<template>
  <a
    v-motion
    class="resource-card group relative flex h-full flex-col overflow-hidden rounded-xl px-6 py-6 transition duration-300"
    :href="data.link"
    target="_blank"
    rel="noreferrer"
    :initial="motionInitial"
    :visible-once="motionVisibleOnce"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terminal-primary to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
    />

    <p
      v-if="eyebrow || data.tags?.length"
      class="mb-4 font-mono text-[10px] font-bold uppercase tracking-terminal text-terminal-accent"
    >
      {{ eyebrow || data.tags?.[0] }}
    </p>

    <h3 class="font-display text-xl font-bold tracking-tight text-terminal-text">
      {{ data.title }}
    </h3>

    <div
      class="mt-4 flex-1 text-sm leading-7 text-terminal-secondary"
      v-html="data.description"
    />

    <div class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div v-if="data.tags?.length" class="flex flex-wrap gap-2">
        <span
          v-for="tag in data.tags"
          :key="tag"
          class="rounded-full border border-terminal-outline/25 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-terminal text-terminal-secondary"
        >
          {{ tag }}
        </span>
      </div>

      <span
        class="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-terminal text-terminal-primary transition duration-300 group-hover:translate-x-1"
      >
        {{ ctaLabel }}
        <span aria-hidden="true">↗</span>
      </span>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Data {
  title: string;
  link: string;
  description: string;
  cover?: string;
  tags?: string[];
}

const props = withDefaults(
  defineProps<{
    ctaLabel?: string;
    data: Data;
    delay?: number;
    eyebrow?: string;
  }>(),
  {
    ctaLabel: '打开资源',
    delay: 0,
    eyebrow: '',
  },
);

const motionInitial = {
  filter: 'blur(4px)',
  opacity: 0,
  y: 12,
};

const motionVisibleOnce = computed(() => ({
  filter: 'blur(0px)',
  opacity: 1,
  transition: {
    delay: props.delay,
    duration: 220,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  y: 0,
}));
</script>

<style scoped>
.resource-card {
  border: 1px solid var(--blog-ghost-border);
  background:
    radial-gradient(circle at top left, rgb(var(--blog-color-primary-rgb) / 0.1), transparent 42%),
    linear-gradient(180deg, rgb(255 255 255 / 0.028) 0%, rgb(255 255 255 / 0) 100%),
    var(--blog-color-surface-container);
  box-shadow: var(--blog-shadow-panel);
  color: inherit;
  text-decoration: none;
}

.resource-card:hover {
  transform: translateY(-4px);
  border-color: var(--blog-charged-border-strong);
  background:
    radial-gradient(circle at top left, rgb(var(--blog-color-primary-rgb) / 0.16), transparent 44%),
    linear-gradient(180deg, rgb(255 255 255 / 0.036) 0%, rgb(255 255 255 / 0) 100%),
    var(--blog-color-surface-high);
  box-shadow: var(--blog-shadow-panel-hover);
}
</style>

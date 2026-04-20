<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';

const { page } = useData();

const currentPath = computed(() => {
  const filePath = page.value.filePath || page.value.relativePath || '';
  return `/${filePath}`.replace(/\/+/g, '/');
});
</script>

<template>
  <div class="doc-sidebar-header">
    <div class="doc-sidebar-header__row">
      <span class="doc-sidebar-header__label">ROOT_DIR</span>
      <span class="doc-sidebar-header__status">LIVE</span>
    </div>
    <div class="doc-sidebar-header__path">{{ currentPath }}</div>
  </div>
</template>

<style scoped>
.doc-sidebar-header {
  /* margin-bottom: 20px; */
  padding: 0 4px;
}

.doc-sidebar-header__row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.doc-sidebar-header__label {
  color: var(--blog-terminal-primary);
  font-family: var(--blog-font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.doc-sidebar-header__status {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border: 1px solid rgb(var(--blog-color-primary-rgb) / 0.22);
  border-radius: 999px;
  color: var(--blog-terminal-primary);
  background: rgb(var(--blog-color-primary-rgb) / 0.06);
  font-family: var(--blog-font-mono);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.doc-sidebar-header__path {
  color: rgb(var(--blog-color-text-secondary-rgb) / 0.5);
  font-family: var(--blog-font-mono);
  font-size: 0.66rem;
  line-height: 1.5;
  word-break: break-all;
}
</style>

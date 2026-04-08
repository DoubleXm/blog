<script setup lang="ts">
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import DocContentEnhancer from './components/DocContentEnhancer.vue';
import DocSidebarHeader from './components/DocSidebarHeader.vue';
import HomePage from './components/HomePage.vue';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';

const { frontmatter, page } = useData();
const DefaultLayout = DefaultTheme.Layout;
</script>

<template>
  <HomePage v-if="frontmatter.layout === 'home' && !page.isNotFound" />
  <DefaultLayout v-else class="blog-theme-layout">
    <template #doc-top>
      <DocContentEnhancer />
    </template>
    <template #layout-top>
      <SiteHeader />
    </template>
    <template #sidebar-nav-before>
      <DocSidebarHeader />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </DefaultLayout>
</template>

<style>
.blog-theme-layout .VPNav,
.blog-theme-layout .VPFooter {
  display: none;
}
</style>

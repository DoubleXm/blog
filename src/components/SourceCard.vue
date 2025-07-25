<template>
  <div 
    class="source-card" 
    :style="{
      backgroundColor: isDark ? '#141414' : '#fafbfc',
      borderColor: isDark ? '#303030' : '#f0f0f0'
    }"
    @click="onOpenHref(data.link)"
  >
    <div class="title">
      <img 
        :src="data.cover"
        onerror="javascript:this.src='/blog/site-logo/error.png'"
        @click.prevent.stop="onOpenHref(data.link)"
      >
      <a
        :style="{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.88)' }"
        href="#"
      >{{ data.title }}</a>
    </div>

    <span
      :style="{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'}"
    >
      <div v-html="data.description"></div>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress';

interface Data {
  title: string;
  link: string;
  cover: string;
  description: string;
}

defineProps<{
  data: Data
}>();

const { isDark } = useData();

const onOpenHref = (link: string) => {
  window.open(link, '_blank');
}
</script>

<style lang="scss">
.source-card {
  padding: 20px;
  min-height: 180px;
  /* border: 1px solid #f0f0f0; */
  border-width: 1px;
  border-style: solid;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
  font-family: AlibabaSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji';
  line-height: 1.5;
  transition: all .3s;
  /* background-color: #fafbfc; */
  &:hover {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    border-color: transparent;
    transform: translateY(-6px);
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
    img {
      width: 30px;
      height: 30px;
    }
    a {
      display: block;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      line-height: var(--ant-line-height-heading-5);
      margin-left: 10px;
    }
  }
  
  span {
    font-size: 14px;
  }
}
</style>
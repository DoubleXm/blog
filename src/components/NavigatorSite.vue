<template>
  <div class="navigator-site-page">
    <div class="navigator-site-layout">
      <div class="navigator-site-anchor">
        <ElAffix :offset="80">
          <ElAnchor 
            :offset="145" 
            select-scroll-top
            :style="{ 
              color: isDark ? '#A3A6AD' : '#909399',
              backgroundColor: isDark ? '#1b1b1f' : '#fff'
            }"
          >
            <ElAnchorLink 
              v-for="category in siteConfig.list" 
              :key="category.title"
              :href="`#${category.title}`"
            >
              {{ category.title }}
            </ElAnchorLink>
          </ElAnchor>
        </ElAffix>
      </div>

      <div class="navigator-site-content">
        <div 
          class="navigator-site-search"
          :style="{
            backgroundColor: isDark ? '#1b1b1f' : '#fff'
          }"
        >
          <ElInput 
            v-model="keyword" 
            :prefix-icon="Search" 
            size="large"
            :class="isDark ? 'dark' : ''"
            @input="onKeywordInput"
          />
        </div>

        <div class="navigator-site-list">
          <div class="wrapper-site-list" 
            v-for="category in results.list" 
            :key="category.title"
          >
            <h2 :id="category.title">
              {{  category.title }}
            </h2>

            <div class="inner-site-list">
              <SourceCard 
                v-for="(item, index) in category.list" 
                :key="index"
                :data="item"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ElBacktop 
      :right="60" 
      :bottom="80"
    >
      <ElIcon 
        :style="{
          backgroundColor: isDark ? '#1D1E1F' : '#fff',
          color: isDark ? '#E5EAF3' : 'rgba(0, 0, 0, 0.45)'
        }"
      >
        <Upload />
      </ElIcon>
      <ElTooltip 
        placement="left" 
        content="重置锚点"
        :effect="isDark ? 'light' : 'dark'"
      >
        <ElIcon 
          :style="{
            backgroundColor: isDark ? '#1D1E1F' : '#fff',
            color: isDark ? '#E5EAF3' : 'rgba(0, 0, 0, 0.45)'
          }" 
          @click.prevent.stop="onResetAnchor"
        >
          <MagicStick />
        </ElIcon>
      </ElTooltip>
    </ElBacktop>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElInput, ElAnchor, ElAnchorLink, ElAffix, ElBacktop, ElIcon, ElTooltip } from 'element-plus';
import { Search, Upload, MagicStick } from '@element-plus/icons-vue';
import SourceCard from './SourceCard.vue';
import siteConfig from './navigator-site.json';
import { useData } from 'vitepress';
import { styleText } from 'util';

const keyword = ref('');
const results = ref(JSON.parse(JSON.stringify(siteConfig)));

const { isDark } = useData();
// onMounted(() => {
//   window.addEventListener('scroll', scrollEvent)
// });

// function scrollEvent () {
//   const searchBar = document.querySelector('.navigator-site-search') as HTMLDivElement;
//   if (window.pageYOffset) {
//     searchBar.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,.05)';
//   } else {
//     searchBar.style.borderBottom = 'none';
//   }
// }

const theme = ref({
  backgroundColor: isDark.value ? '#161618' : '#fff',
  color: isDark.value ? '#98989f' : '#606266'
})

const onResetAnchor = () => {
  window.location.replace(window.location.href.replace(/#.+/, ''));
}

const onKeywordInput = (val: string) => {
  const searchText = val.trim().toLowerCase();
  results.value = JSON.parse(JSON.stringify(siteConfig));
  
  results.value.list = results.value.list
    .map(item => ({
      title: item.title,
      list: item.list.filter(i => i.title.toLowerCase().includes(searchText))
    }))
    .filter(i => i.list.length);
};
</script>

<style>
.el-input {
  --el-input-bg-color: #fff;
  --el-input-fill-color: #fff;
  --el-input-text-color: #606266;
  --el-text-color: #606266; 
  --el-input-hover-border: #C0C4CC;
  --el-border-color: #dcdfe6;
}
.el-input.dark {
  --el-input-bg-color: #161618;
  --el-input-fill-color: #161618;
  --el-input-text-color: #CFD3DC;
  --el-text-color: #CFD3DC;
  --el-input-hover-border: #6C6E72;
  --el-border-color: #4C4D4F;
}

.el-backtop {
  --el-backtop-bg-color: #fff;
}
.dark .el-backtop {
  --el-backtop-bg-color: #1D1E1F;
}
</style>

<style lang="scss">
.navigator-site-page {
  max-width: 1440px;
  margin: 0 auto;
  line-height: normal;
  .navigator-site-layout {
    display: flex;
    
    .navigator-site-anchor {
      width: 180px;
      padding: 20px;
      margin: 60px 20px 0 0;
    }

    .navigator-site-content {
      flex: 1;
      position: relative;
      .navigator-site-search {
        position: sticky;
        top: 64px;
        z-index: 1;
        height: 80px;
        .el-input {
          margin-top: 20px;
        }
      }

      .navigator-site-list {
        .wrapper-site-list {

          h2 {
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
          }
          .inner-site-list {
            display: grid;
            gap: 20px;
            grid-template-columns: 1fr 1fr 1fr;
            margin: 22px 0;

            .source-card {
              flex: 1;
              min-width: calc(33.33% - 13px);
            }
          }
        }
      }
    }
  }

  .el-backtop {
    display: flex;
    flex-direction: column;
    height: 80px;
    border-radius: 6px;
    &:hover {
      background-color: transparent;
    }
    .el-icon {
      flex: 1;
      width: 100%;
      color: rgba(0, 0, 0, 0.45);
      border-radius: 6px;
      &:hover {
        background-color: var(--el-backtop-hover-bg-color)
      }
    }
  }
}
</style>
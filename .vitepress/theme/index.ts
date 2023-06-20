import { h, nextTick, onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import DefaultTheme from 'vitepress/theme';
import './assets/styles/index.css';

import Logo from './components/Logo.vue';

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h(Logo)
    });
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      (mediumZoom as unknown as Function)('.main img', {
        background: 'var(--vp-c-bg)',
      });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  }
};

import type { Theme } from 'vitepress';
import { MotionPlugin } from '@vueuse/motion';
import DefaultTheme from 'vitepress/theme';

import Layout from './Layout.vue';
import 'element-plus/dist/index.css';
import './assets/code.css';
import './assets/style.css';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(MotionPlugin);

    setTimeout(() => {
      if (app._instance?.isMounted) {
        window.addEventListener('click', function (event) {
          if (event.target instanceof HTMLImageElement) {
            if (event.target.parentElement?.className === 'image-overlay') return;

            const src = event.target.src;
            const overlay = document.createElement('div');
            const img = document.createElement('img');
            img.src = src;

            overlay.classList.add('image-overlay');
            img.classList.add('image-overlay-img');

            overlay.appendChild(img);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', function () {
              overlay.remove();
            });
          }
        });
      }
    }, 1000);
  },
} satisfies Theme;

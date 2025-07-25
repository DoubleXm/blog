import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme'
// code block styles
import './assets/code.css'
import 'element-plus/dist/index.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
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
        })
      }
    }, 1000)
  }
} satisfies Theme
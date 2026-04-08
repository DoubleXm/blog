<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';

const GITHUB_REPOSITORY_URL = 'https://github.com/DoubleXm/blog';

const { site, theme } = useData();

const footerData = computed(
  () =>
    (theme.value.footer ?? {}) as {
      copyright?: string;
      message?: string;
    },
);
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div>
        <span class="site-footer__brand">&gt;_ {{ site.title }}</span>
        <p class="site-footer__meta">
          {{ footerData.message || '技术从未退休，学习永不止步。' }}
        </p>
      </div>

      <div class="site-footer__side">
        <a
          class="site-footer__link"
          :href="GITHUB_REPOSITORY_URL"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <p
          class="site-footer__copyright"
          v-html="footerData.copyright || `Copyright © ${new Date().getFullYear()} ${site.title}`"
        />
      </div>
    </div>
  </footer>
</template>

<style>
.site-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--blog-ghost-border-soft);
  background: var(--blog-color-canvas);
}

.site-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0 auto;
  padding: 28px 24px;
  max-width: 1536px;
}

.site-footer__brand {
  display: block;
  margin-bottom: 10px;
  font-family: var(--blog-font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--blog-terminal-primary);
}

.site-footer__meta,
.site-footer__link,
.site-footer__copyright {
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.site-footer__meta,
.site-footer__copyright,
.site-footer__link {
  color: var(--blog-color-text-muted);
}

.site-footer__meta,
.site-footer__copyright {
  margin: 0;
}

.site-footer__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.site-footer__link {
  text-decoration: none;
}

.site-footer__link:hover {
  color: var(--blog-terminal-primary);
}

@media (max-width: 767px) {
  .site-footer__inner {
    align-items: flex-start;
    flex-direction: column;
    padding-right: 12px;
    padding-left: 12px;
  }

  .site-footer__side {
    align-items: flex-start;
  }
}
</style>

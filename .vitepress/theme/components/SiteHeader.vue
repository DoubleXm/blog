<script setup lang="ts">
import { inBrowser, useData, useRoute, withBase } from 'vitepress';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

import VPNavBarAppearance from 'vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue';
import VPNavBarHamburger from 'vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue';
import VPNavBarMenu from 'vitepress/dist/client/theme-default/components/VPNavBarMenu.vue';
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue';
import VPNavBarSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue';
import VPNavScreenAppearance from 'vitepress/dist/client/theme-default/components/VPNavScreenAppearance.vue';
import VPNavScreenMenu from 'vitepress/dist/client/theme-default/components/VPNavScreenMenu.vue';
import VPNavScreenSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavScreenSocialLinks.vue';

const { site } = useData();
const route = useRoute();
const screenOpen = ref(false);

let previousBodyOverflow = '';

function normalizePath(path: string) {
  if (!path) return '/';

  return (
    path
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/'
  );
}

function syncScreenMenuActiveState() {
  if (!inBrowser) {
    return;
  }

  const panel = document.querySelector('.site-header__screen-panel');

  if (!panel) {
    return;
  }

  const currentPaths = new Set([
    normalizePath(route.path),
    normalizePath(withBase(route.path)),
  ]);

  const groups = Array.from(
    panel.querySelectorAll<HTMLElement>('.VPNavScreenMenuGroup'),
  );

  for (const group of groups) {
    group.classList.remove('has-current');
  }

  const links = Array.from(
    panel.querySelectorAll<HTMLAnchorElement>('.VPNavScreenMenuLink, .VPNavScreenMenuGroupLink'),
  );

  for (const link of links) {
    const href = link.getAttribute('href') || '';

    if (!href || href.startsWith('#')) {
      link.classList.remove('is-current');
      continue;
    }

    const pathname = normalizePath(new URL(href, window.location.origin).pathname);
    const isCurrent = currentPaths.has(pathname);

    link.classList.toggle('is-current', isCurrent);

    if (isCurrent) {
      link.closest<HTMLElement>('.VPNavScreenMenuGroup')?.classList.add('has-current');
    }
  }
}

watch(screenOpen, (value) => {
  if (!inBrowser) {
    return;
  }

  if (value) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
});

watch(
  () => route.path,
  () => {
    screenOpen.value = false;
  },
);

watch(
  [screenOpen, () => route.path],
  async ([open]) => {
    if (!open) {
      return;
    }

    await nextTick();
    syncScreenMenuActiveState();
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  if (inBrowser) {
    document.body.style.overflow = previousBodyOverflow;
  }
});
</script>

<template>
  <div class="site-header">
    <header class="site-header__bar">
      <div class="site-header__inner">
        <a class="site-header__brand" :href="withBase('/')">
          <span class="site-header__brand-prefix">&gt;_</span>
          <span class="site-header__brand-title">{{ site.title }}</span>
        </a>

        <div class="site-header__main">
          <VPNavBarMenu class="site-header__menu" />
        </div>

        <div class="site-header__tools">
          <VPNavBarSearch class="site-header__search" />
          <VPNavBarAppearance class="site-header__appearance" />
          <VPNavBarSocialLinks class="site-header__social" />
          <VPNavBarHamburger
            class="site-header__hamburger"
            :active="screenOpen"
            @click="screenOpen = !screenOpen"
          />
        </div>
      </div>
    </header>

    <transition name="site-header-screen">
      <div
        v-if="screenOpen"
        class="site-header__screen"
        @click.self="screenOpen = false"
      >
        <div class="site-header__screen-panel">
          <VPNavScreenMenu class="site-header__screen-menu" />
          <VPNavScreenAppearance class="site-header__screen-appearance" />
          <VPNavScreenSocialLinks class="site-header__screen-social" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.site-header__bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 60;
  background: var(--blog-backdrop-color);
  backdrop-filter: blur(12px);
  box-shadow: var(--blog-shadow-glow);
}

.site-header__inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  margin: 0 auto;
  padding: 0 18px;
  max-width: 1536px;
  min-height: 62px;
}

.site-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-family: var(--blog-font-display);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  text-decoration: none;
  text-transform: uppercase;
  color: var(--blog-terminal-heading);
}

.site-header__brand-prefix {
  color: var(--blog-terminal-heading);
}

.site-header__brand-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-header__main {
  min-width: 0;
}

.site-header__tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.site-header__screen {
  position: fixed;
  inset: 0;
  z-index: 55;
  padding: 88px 20px 20px;
  background:
    radial-gradient(circle at top center, rgb(var(--blog-color-primary-rgb) / 0.06), transparent 28%),
    radial-gradient(circle at 18% 0%, rgb(var(--blog-color-primary-container-rgb) / 0.05), transparent 24%),
    rgb(var(--blog-color-canvas-rgb) / 0.76);
  backdrop-filter: blur(12px);
}

.site-header__screen-panel {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid var(--blog-ghost-border);
  border-radius: 16px;
  padding: 18px;
  max-width: 420px;
  background: var(--blog-panel-command-bg);
  background-size:
    24px 24px,
    32px 32px,
    auto;
  box-shadow:
    0 32px 96px rgb(0 0 0 / 0.52),
    0 0 0 1px rgb(var(--blog-color-primary-rgb) / 0.04);
}

.site-header__screen-panel::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: var(--blog-panel-command-rail);
  opacity: 0.92;
}

.site-header__screen-menu {
  position: relative;
  z-index: 1;
}

.site-header-screen-enter-active,
.site-header-screen-leave-active {
  transition: opacity 0.2s ease;
}

.site-header-screen-enter-active .site-header__screen-panel,
.site-header-screen-leave-active .site-header__screen-panel {
  transition: transform 0.2s ease;
}

.site-header-screen-enter-from,
.site-header-screen-leave-to {
  opacity: 0;
}

.site-header-screen-enter-from .site-header__screen-panel,
.site-header-screen-leave-to .site-header__screen-panel {
  transform: translateY(-8px);
}

.site-header .VPNavBarMenu {
  display: flex;
}

.site-header .VPNavBarMenuLink,
.site-header .VPFlyout .button,
.site-header .VPFlyout .text {
  position: relative;
  height: auto;
  padding: 0 12px;
  font-family: var(--blog-font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--blog-color-text-muted);
}

.site-header .VPNavBarMenuLink.active,
.site-header .VPNavBarMenuLink:hover,
.site-header .VPFlyout.active .text,
.site-header .VPFlyout:hover .text {
  color: var(--blog-terminal-primary);
}

.site-header .VPNavBarMenuLink.active::after {
  margin-left: 6px;
  font-size: 0.5rem;
  color: var(--blog-terminal-primary);
  content: '●';
}

.site-header .VPFlyout .menu {
  top: calc(100% + 22px);
}

.site-header .VPMenu {
  border-color: var(--blog-ghost-border);
  background: var(--blog-color-surface-high);
  box-shadow: var(--blog-shadow-float);
}

.site-header .VPMenu .link {
  color: var(--blog-terminal-text);
}

.site-header .VPMenu .link:hover,
.site-header .VPMenu .link.active {
  color: var(--blog-terminal-primary);
  background: var(--blog-color-surface-bright);
}

.site-header .VPMenu .label {
  color: var(--blog-terminal-text-secondary);
}

.site-header .VPNavBarSearch {
  width: 188px;
}

.site-header .DocSearch-Button {
  justify-content: flex-start;
  border: 1px solid var(--blog-ghost-border-soft);
  border-radius: 6px;
  padding: 0 12px;
  width: 100%;
  height: 38px;
  background: var(--blog-color-surface-high);
}

.site-header .DocSearch-Button:hover {
  border-color: var(--blog-charged-border);
  background: var(--blog-color-surface-bright);
}

.site-header .DocSearch-Button .DocSearch-Search-Icon {
  color: var(--blog-terminal-text-secondary);
}

.site-header .DocSearch-Button .DocSearch-Button-Placeholder,
.site-header .DocSearch-Button .DocSearch-Button-Key {
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.site-header .DocSearch-Button .DocSearch-Button-Placeholder,
.site-header .DocSearch-Button .DocSearch-Button-Key {
  color: var(--blog-color-text-muted);
}

.site-header .DocSearch-Button .DocSearch-Button-Key {
  border-color: var(--blog-ghost-border);
}

.site-header .VPNavBarAppearance,
.site-header .VPNavBarSocialLinks {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
}

.site-header .VPSocialLink {
  width: 30px;
  height: 30px;
  color: var(--blog-color-text-muted);
}

.site-header .VPSocialLink:hover {
  color: var(--blog-terminal-primary);
}

.site-header .VPSwitch {
  border: 0;
  border-radius: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.site-header .VPSwitch:hover,
.site-header .dark .VPSwitch .check,
.dark .site-header .VPSwitch .check {
  background: transparent;
}

.site-header .VPSwitch .check {
  position: static;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  box-shadow: none;
  transform: none !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.site-header .VPSwitch .icon {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.site-header .VPSwitch .icon :is(.vpi-sun, .vpi-moon) {
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  color: var(--blog-terminal-text-secondary);
  transform: translate(-50%, -50%);
}

.site-header .dark .VPSwitch .icon :is(.vpi-sun, .vpi-moon),
.dark .site-header .VPSwitch .icon :is(.vpi-sun, .vpi-moon) {
  color: var(--blog-terminal-primary);
}

.site-header .VPNavBarHamburger {
  border: 1px solid var(--blog-ghost-border);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  background: var(--blog-color-surface-high);
}

.site-header .VPNavBarHamburger:hover {
  border-color: var(--blog-charged-border);
}

.site-header .VPNavBarHamburger .top,
.site-header .VPNavBarHamburger .middle,
.site-header .VPNavBarHamburger .bottom {
  background: var(--blog-terminal-text);
}

.site-header .VPNavScreenMenuLink,
.site-header .VPNavScreenMenuGroup .button {
  color: var(--blog-terminal-text);
}

.site-header .VPNavScreenMenuLink,
.site-header .VPNavScreenMenuGroup .button,
.site-header .VPNavScreenAppearance .text {
  font-family: var(--blog-font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.site-header .VPNavScreenMenuLink,
.site-header .VPNavScreenMenuGroup {
  border-bottom-color: var(--blog-ghost-border-soft);
}

.site-header .VPNavScreenAppearance {
  margin-top: 18px;
  border-radius: 8px;
  background: var(--blog-color-surface-bright);
}

.site-header .VPNavScreenSocialLinks {
  margin-top: 16px;
  justify-content: flex-start;
}

@media (max-width: 959px) {
  .site-header__inner {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px;
  }

  .site-header__main {
    display: none;
  }

  .site-header__tools {
    justify-self: end;
  }
}

@media (max-width: 767px) {
  .site-header__bar {
    background: rgb(var(--blog-color-canvas-rgb) / 0.82);
  }

  .site-header__inner {
    grid-template-columns: minmax(0, 1fr) auto;
    padding-right: 12px;
    padding-left: 12px;
    min-height: 58px;
  }

  .site-header__tools {
    gap: 6px;
    margin-left: auto;
    justify-self: end;
  }

  .site-header__search,
  .site-header .VPNavBarSearch {
    display: none;
  }

  .site-header .VPNavBarAppearance,
  .site-header .VPNavBarSocialLinks,
  .site-header .VPNavBarHamburger {
    flex: 0 0 auto;
  }

  .site-header .VPNavBarAppearance {
    width: 34px;
    height: 34px;
    min-width: 34px;
    min-height: 34px;
  }

  .site-header .VPSocialLink,
  .site-header .VPNavBarHamburger,
  .site-header .VPSwitch {
    width: 34px;
    height: 34px;
  }

  .site-header .VPSwitch .check,
  .site-header .VPSwitch .icon {
    width: 34px;
    height: 34px;
  }

  .site-header .VPSwitch .icon :is(.vpi-sun, .vpi-moon) {
    width: 18px;
    height: 18px;
  }

  .site-header .VPNavBarHamburger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-color: var(--blog-ghost-border);
    background: rgb(var(--blog-color-surface-container-rgb) / 0.92);
  }

  .site-header__screen {
    padding: 70px 12px 12px;
  }

  .site-header__screen-panel {
    width: 100%;
    max-width: none;
    border-radius: 12px;
    padding: 14px;
  }

  .site-header .VPNavScreenMenu {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .site-header .VPNavScreenMenuLink,
  .site-header .VPNavScreenMenuGroup {
    border-bottom: 0;
  }

  .site-header .VPNavScreenMenuLink {
    min-height: 44px;
    padding: 10px 14px;
    border: 1px solid var(--blog-ghost-border);
    border-radius: 8px;
    line-height: 1.4;
    background: rgb(var(--blog-color-surface-base-rgb) / 0.88);
    -webkit-tap-highlight-color: var(--blog-charged-border);
  }

  .site-header .VPNavScreenMenuLink.active,
  .site-header .VPNavScreenMenuLink.is-current,
  .site-header .VPNavScreenMenuLink:hover {
    border-color: rgb(var(--blog-color-primary-rgb) / 0.16);
    color: var(--blog-terminal-primary);
    background: rgb(var(--blog-color-surface-container-rgb) / 0.92);
  }

  .site-header .VPNavScreenMenuLink:active {
    border-color: rgb(var(--blog-color-primary-rgb) / 0.22);
    color: var(--blog-terminal-primary);
    background:
      linear-gradient(90deg, rgb(var(--blog-color-primary-rgb) / 0.08) 0%, rgb(var(--blog-color-primary-rgb) / 0) 42%),
      rgb(var(--blog-color-surface-container-rgb) / 0.92);
  }

  .site-header .VPNavScreenMenuGroup {
    min-height: 44px;
    height: 44px;
    overflow: hidden;
  }

  .site-header .VPNavScreenMenuGroup .button {
    min-height: 44px;
    padding: 10px 14px;
    border: 1px solid var(--blog-ghost-border);
    border-radius: 8px;
    line-height: 1.4;
    background: rgb(var(--blog-color-surface-base-rgb) / 0.88);
    -webkit-tap-highlight-color: var(--blog-charged-border);
  }

  .site-header .VPNavScreenMenuGroup.open .button {
    padding-bottom: 10px;
    border-color: rgb(var(--blog-color-primary-rgb) / 0.22);
    background:
      linear-gradient(90deg, rgb(var(--blog-color-primary-rgb) / 0.08) 0%, rgb(var(--blog-color-primary-rgb) / 0) 42%),
      rgb(var(--blog-color-surface-container-rgb) / 0.92);
  }

  .site-header .VPNavScreenMenuGroup.has-current > .button {
    border-color: var(--blog-charged-border);
    color: var(--blog-terminal-primary);
    background:
      linear-gradient(90deg, rgb(var(--blog-color-primary-rgb) / 0.06) 0%, rgb(var(--blog-color-primary-rgb) / 0) 42%),
      rgb(var(--blog-color-surface-container-rgb) / 0.92);
  }

  .site-header .VPNavScreenMenuGroup .button:active {
    border-color: rgb(var(--blog-color-primary-rgb) / 0.22);
    color: var(--blog-terminal-primary);
    background:
      linear-gradient(90deg, rgb(var(--blog-color-primary-rgb) / 0.08) 0%, rgb(var(--blog-color-primary-rgb) / 0) 42%),
      rgb(var(--blog-color-surface-container-rgb) / 0.92);
  }

  .site-header .VPNavScreenMenuGroup:not(.open) .items {
    display: none;
  }

  .site-header .VPNavScreenMenuGroup.open {
    height: auto;
    overflow: visible;
    padding-bottom: 0;
  }

  .site-header .VPNavScreenMenuGroup .items {
    margin-top: 8px;
    padding-left: 12px;
    border-left: 1px solid var(--blog-ghost-border);
  }

  .site-header .VPNavScreenMenuGroup .group + .group,
  .site-header .VPNavScreenMenuGroup .group + .item {
    padding-top: 6px;
  }

  .site-header .VPNavScreenMenuGroupLink {
    margin-left: 0;
    padding: 8px 10px;
    border-radius: 6px;
    line-height: 1.45;
    color: var(--blog-terminal-text-secondary);
    -webkit-tap-highlight-color: var(--blog-charged-border);
  }

  .site-header .VPNavScreenMenuGroupLink.active,
  .site-header .VPNavScreenMenuGroupLink.is-current,
  .site-header .VPNavScreenMenuGroupLink:hover {
    color: var(--blog-terminal-primary);
    background: rgb(var(--blog-color-primary-rgb) / 0.05);
  }

  .site-header .VPNavScreenMenuGroupLink:active {
    color: var(--blog-terminal-primary);
    background: rgb(var(--blog-color-primary-rgb) / 0.08);
  }

  .site-header .VPNavScreenAppearance {
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid var(--blog-ghost-border);
    background: rgb(var(--blog-color-surface-base-rgb) / 0.88);
  }

  .site-header .VPNavScreenSocialLinks {
    margin-top: 12px;
    gap: 10px;
  }

  .site-header .VPNavScreenSocialLinks .VPSocialLink {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--blog-ghost-border);
    border-radius: 8px;
    background: rgb(var(--blog-color-surface-base-rgb) / 0.88);
  }
}

html:not(.dark) .site-header__screen,
html.light .site-header__screen,
html[data-theme='light'] .site-header__screen {
  background: rgb(var(--blog-color-canvas-rgb) / 0.78);
}

html:not(.dark) .site-header__screen-panel,
html.light .site-header__screen-panel,
html[data-theme='light'] .site-header__screen-panel,
html:not(.dark) .site-header .VPMenu,
html.light .site-header .VPMenu,
html[data-theme='light'] .site-header .VPMenu,
html:not(.dark) .site-header .DocSearch-Button,
html.light .site-header .DocSearch-Button,
html[data-theme='light'] .site-header .DocSearch-Button,
html:not(.dark) .site-header .VPNavBarHamburger,
html.light .site-header .VPNavBarHamburger,
html[data-theme='light'] .site-header .VPNavBarHamburger,
html:not(.dark) .site-header .VPNavScreenAppearance,
html.light .site-header .VPNavScreenAppearance,
html[data-theme='light'] .site-header .VPNavScreenAppearance,
html:not(.dark) .site-header .VPNavScreenMenuLink,
html.light .site-header .VPNavScreenMenuLink,
html[data-theme='light'] .site-header .VPNavScreenMenuLink,
html:not(.dark) .site-header .VPNavScreenMenuGroup .button,
html.light .site-header .VPNavScreenMenuGroup .button,
html[data-theme='light'] .site-header .VPNavScreenMenuGroup .button,
html:not(.dark) .site-header .VPNavScreenMenuGroupLink,
html.light .site-header .VPNavScreenMenuGroupLink,
html[data-theme='light'] .site-header .VPNavScreenMenuGroupLink,
html:not(.dark) .site-header .VPNavScreenSocialLinks .VPSocialLink,
html.light .site-header .VPNavScreenSocialLinks .VPSocialLink,
html[data-theme='light'] .site-header .VPNavScreenSocialLinks .VPSocialLink {
  border-radius: 0;
}

html:not(.dark) .site-header__screen-panel,
html.light .site-header__screen-panel,
html[data-theme='light'] .site-header__screen-panel {
  box-shadow:
    var(--blog-shadow-command),
    0 0 0 1px rgb(var(--blog-color-primary-rgb) / 0.03);
  border-radius: 14px;
  background: rgb(var(--blog-color-surface-lowest-rgb) / 1);
}

html:not(.dark) .site-header .VPNavBarMenuLink,
html.light .site-header .VPNavBarMenuLink,
html[data-theme='light'] .site-header .VPNavBarMenuLink,
html:not(.dark) .site-header .VPFlyout .button,
html.light .site-header .VPFlyout .button,
html[data-theme='light'] .site-header .VPFlyout .button,
html:not(.dark) .site-header .VPFlyout .text,
html.light .site-header .VPFlyout .text,
html[data-theme='light'] .site-header .VPFlyout .text {
  color: rgb(var(--blog-color-primary-rgb) / 0.78);
}

html:not(.dark) .site-header .VPMenu,
html.light .site-header .VPMenu,
html[data-theme='light'] .site-header .VPMenu,
html:not(.dark) .site-header .DocSearch-Button,
html.light .site-header .DocSearch-Button,
html[data-theme='light'] .site-header .DocSearch-Button,
html:not(.dark) .site-header .VPNavBarHamburger,
html.light .site-header .VPNavBarHamburger,
html[data-theme='light'] .site-header .VPNavBarHamburger {
  background: rgb(var(--blog-color-surface-lowest-rgb) / 1);
}

html:not(.dark) .site-header .VPMenu,
html.light .site-header .VPMenu,
html[data-theme='light'] .site-header .VPMenu {
  border-color: rgb(var(--blog-color-primary-rgb) / 0.18);
  border-radius: 12px;
}

html:not(.dark) .site-header .DocSearch-Button,
html.light .site-header .DocSearch-Button,
html[data-theme='light'] .site-header .DocSearch-Button,
html:not(.dark) .site-header .VPNavBarHamburger,
html.light .site-header .VPNavBarHamburger,
html[data-theme='light'] .site-header .VPNavBarHamburger {
  border-radius: 10px;
}

html:not(.dark) .site-header .VPNavScreenAppearance,
html.light .site-header .VPNavScreenAppearance,
html[data-theme='light'] .site-header .VPNavScreenAppearance,
html:not(.dark) .site-header .VPNavScreenMenuLink,
html.light .site-header .VPNavScreenMenuLink,
html[data-theme='light'] .site-header .VPNavScreenMenuLink,
html:not(.dark) .site-header .VPNavScreenMenuGroup .button,
html.light .site-header .VPNavScreenMenuGroup .button,
html[data-theme='light'] .site-header .VPNavScreenMenuGroup .button,
html:not(.dark) .site-header .VPNavScreenMenuGroupLink,
html.light .site-header .VPNavScreenMenuGroupLink,
html[data-theme='light'] .site-header .VPNavScreenMenuGroupLink,
html:not(.dark) .site-header .VPNavScreenSocialLinks .VPSocialLink,
html.light .site-header .VPNavScreenSocialLinks .VPSocialLink,
html[data-theme='light'] .site-header .VPNavScreenSocialLinks .VPSocialLink {
  border-radius: 10px;
}
</style>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { onContentUpdated, useData } from 'vitepress';

type PageMetadata = {
  lastUpdated?: string;
  lastUpdatedMs?: number;
  readMinutes?: number;
};

const { page, theme } = useData();
let removeOutlineSmoothScroll: (() => void) | null = null;
let removeOutlineTracking: (() => void) | null = null;
let removeFooterAvoidanceTracking: (() => void) | null = null;

function formatLastUpdated(value?: number | null) {
  if (!value) return '';

  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

function estimateReadMinutes(text: string) {
  const cjkChars = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = text
    .replace(/[\u3400-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const totalMinutes = cjkChars / 320 + latinWords / 220;
  return Math.max(1, Math.ceil(totalMinutes));
}

function resolvePageMetadata() {
  const blogData = (theme.value as typeof theme.value & {
    blogData?: {
      pageMetadataByRelativePath?: Record<string, PageMetadata>;
    };
  }).blogData;

  return blogData?.pageMetadataByRelativePath?.[page.value.relativePath];
}

function buildMetaItem(
  type: 'updated' | 'reading',
  label: string,
  value: string,
  accent = false,
) {
  const item = document.createElement('div');
  item.className = `doc-title-meta__item is-${type}${accent ? ' is-accent' : ''}`;

  const iconEl = document.createElement('span');
  iconEl.className = 'doc-title-meta__icon';

  const labelEl = document.createElement('span');
  labelEl.className = 'doc-title-meta__label';
  labelEl.textContent = label;

  const valueEl = document.createElement('span');
  valueEl.className = 'doc-title-meta__value';
  valueEl.textContent = value;

  item.append(iconEl, labelEl, valueEl);
  return item;
}

function syncDocTitleMeta() {
  const article = document.querySelector('.blog-theme-layout .vp-doc');
  const title = article?.querySelector('h1');

  if (!article || !title) return;

  article.querySelectorAll('.doc-title-meta').forEach((node) => node.remove());

  const meta = document.createElement('div');
  meta.className = 'doc-title-meta';

  const pageMetadata = resolvePageMetadata();
  const rawText = article.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const readMinutes = pageMetadata?.readMinutes ?? estimateReadMinutes(rawText);
  const lastUpdated =
    formatLastUpdated(page.value.lastUpdated) ||
    pageMetadata?.lastUpdated ||
    (pageMetadata?.lastUpdatedMs ? formatLastUpdated(pageMetadata.lastUpdatedMs) : '') ||
    '未知';

  meta.append(
    buildMetaItem('updated', '更新时间', lastUpdated),
    buildMetaItem('reading', '建议阅读', `${readMinutes} 分钟`, true),
  );

  title.insertAdjacentElement('afterend', meta);
}

function bindOutlineSmoothScroll() {
  removeOutlineSmoothScroll?.();
  removeOutlineSmoothScroll = null;

  const outline = document.querySelector('.blog-theme-layout .VPDocAsideOutline');

  if (!outline) {
    return;
  }

  const handleClick = (event: Event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const link = target.closest<HTMLAnchorElement>('.outline-link');
    const hash = link?.hash || link?.getAttribute('href') || '';

    if (!link || !hash.startsWith('#')) {
      return;
    }

    const heading = document.getElementById(decodeURIComponent(hash.slice(1)));

    if (!heading) {
      return;
    }

    event.preventDefault();
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
    history.replaceState(null, '', hash);
  };

  outline.addEventListener('click', handleClick);
  removeOutlineSmoothScroll = () => {
    outline.removeEventListener('click', handleClick);
  };
}

function bindOutlineTracking() {
  removeOutlineTracking?.();
  removeOutlineTracking = null;

  const outline = document.querySelector<HTMLElement>('.blog-theme-layout .VPDocAsideOutline');

  if (!outline) {
    return;
  }

  let frameId = 0;

  const syncActiveState = () => {
    const links = Array.from(
      outline.querySelectorAll<HTMLAnchorElement>('.outline-link[href^="#"]'),
    );
    const entries = links
      .map((link) => {
        const hash = link.getAttribute('href') || '';
        const id = decodeURIComponent(hash.slice(1));
        const heading = id ? document.getElementById(id) : null;

        if (!heading) {
          return null;
        }

        return {
          heading,
          link,
          top: heading.getBoundingClientRect().top + window.scrollY,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .sort((a, b) => a.top - b.top);

    if (!entries.length) {
      for (const link of links) {
        link.classList.remove('active');
      }
      return;
    }

    const offset = window.scrollY + 108;
    const isBottom =
      Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) <
      4;

    let activeEntry = entries[0];

    if (isBottom) {
      activeEntry = entries[entries.length - 1];
    } else {
      for (const entry of entries) {
        if (entry.top <= offset) {
          activeEntry = entry;
          continue;
        }

        break;
      }
    }

    for (const link of links) {
      link.classList.toggle('active', link === activeEntry.link);
    }
  };

  const requestSync = () => {
    if (frameId) {
      return;
    }

    frameId = requestAnimationFrame(() => {
      frameId = 0;
      syncActiveState();
    });
  };

  requestSync();
  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync);

  removeOutlineTracking = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    window.removeEventListener('scroll', requestSync);
    window.removeEventListener('resize', requestSync);
  };
}

function bindFooterAvoidanceTracking() {
  removeFooterAvoidanceTracking?.();
  removeFooterAvoidanceTracking = null;

  const root = document.documentElement;
  const footer = document.querySelector<HTMLElement>('.site-footer');

  if (!footer) {
    root.style.setProperty('--blog-footer-height', '0px');
    return;
  }

  let frameId = 0;
  let footerResizeObserver: ResizeObserver | null = null;

  const syncFooterAvoidance = () => {
    const rect = footer.getBoundingClientRect();
    const overlap =
      rect.top < window.innerHeight && rect.bottom > 0
        ? Math.min(rect.height, window.innerHeight - Math.max(rect.top, 0))
        : 0;

    root.style.setProperty('--blog-footer-height', `${Math.max(0, Math.ceil(overlap))}px`);
  };

  const requestSync = () => {
    if (frameId) {
      return;
    }

    frameId = requestAnimationFrame(() => {
      frameId = 0;
      syncFooterAvoidance();
    });
  };

  requestSync();
  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync);

  if ('ResizeObserver' in window) {
    footerResizeObserver = new ResizeObserver(() => {
      requestSync();
    });
    footerResizeObserver.observe(footer);
  }

  removeFooterAvoidanceTracking = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    footerResizeObserver?.disconnect();
    window.removeEventListener('scroll', requestSync);
    window.removeEventListener('resize', requestSync);
    root.style.setProperty('--blog-footer-height', '0px');
  };
}

async function refresh() {
  await nextTick();
  requestAnimationFrame(() => {
    syncDocTitleMeta();
    bindOutlineSmoothScroll();
    bindOutlineTracking();
    bindFooterAvoidanceTracking();
  });
}

onMounted(refresh);
onContentUpdated(refresh);
onBeforeUnmount(() => {
  removeOutlineSmoothScroll?.();
  removeOutlineTracking?.();
  removeFooterAvoidanceTracking?.();
});
</script>

<template></template>

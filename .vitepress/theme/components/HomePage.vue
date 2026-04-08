<script setup lang="ts">
import { useReducedMotion } from '@vueuse/motion';
import { inBrowser, useData, withBase } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Content } from 'vitepress/dist/client/app/components/Content.js';

import type { BlogData, GitHubContributionDay } from '../../blog-data';
import {
  HOME_DIRECTORY_CARD_BY_LABEL,
  HOME_DIRECTORY_CARDS,
} from '../config/home-directory-cards';
import SiteFooter from './SiteFooter.vue';
import SiteHeader from './SiteHeader.vue';

interface ThemeNavItem {
  items?: ThemeNavItem[];
  link?: string;
  text?: string;
}

type TerminalRow =
  | {
      kind: 'command';
      location: string;
      prompt: string;
      text: string;
    }
  | {
      kind: 'log';
      level: string;
      text: string;
      timestamp: string;
      tone: 'accent' | 'info' | 'success' | 'warn';
    }
  | {
      kind: 'output';
      text: string;
    };

const GITHUB_PROFILE_URL = 'https://github.com/DoubleXm';
const GITHUB_REPOSITORY_URL = 'https://github.com/DoubleXm/blog';

const { frontmatter, site, theme } = useData();

const typedLengths = ref<number[]>([]);
const activeTerminalRowIndex = ref(0);
const hoveredContributionDay = ref<GitHubContributionDay | null>(null);
const pinnedContributionDay = ref<GitHubContributionDay | null>(null);
const terminalTimestampSeed = ref<number | null>(null);
const playEntranceMotion = ref(
  !inBrowser ? true : !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
);
const prefersReducedMotion = useReducedMotion();

let typeTimer: number | undefined;
let currentRowIndex = 0;

const fallbackHomeData: BlogData = {
  contentMetrics: {
    areaCount: 0,
    countsByKey: {},
    totalArticles: 0,
  },
  githubContributions: {
    activeDays: 0,
    currentStreak: 0,
    daysTracked: 365,
    longestStreak: 0,
    note: '贡献数据暂不可用。',
    profileUrl: GITHUB_PROFILE_URL,
    source: 'fallback',
    totalContributions: 0,
    updatedAt: '',
    username: GITHUB_PROFILE_URL.split('/').pop() || 'DoubleXm',
    weeks: [],
  },
  pageMetadataByRelativePath: {},
};

const themeData = computed(() => theme.value as typeof theme.value & { blogData?: BlogData });
const homeData = computed(() => themeData.value.blogData ?? fallbackHomeData);

const hero = computed(
  () =>
    (frontmatter.value.hero ?? {}) as {
      name?: string;
      tagline?: string;
      text?: string;
    },
);

const navItems = computed(() => (theme.value.nav ?? []) as ThemeNavItem[]);

const heroTitle = computed(() => {
  const rawName = hero.value.name?.trim() || site.value.title || '65岁退休 Coder';
  const matchedName = rawName.match(/^(.*?)(?:\s+)([^ ]+)$/);

  if (!matchedName) {
    return {
      accent: '',
      leading: rawName,
    };
  }

  return {
    accent: `${matchedName[2].replace(/\.$/, '').toUpperCase()}.`,
    leading: matchedName[1].trim(),
  };
});

const contributionSummary = computed(() => ({
  ...homeData.value.githubContributions,
  averagePerDay:
    homeData.value.githubContributions.daysTracked > 0
      ? (
          homeData.value.githubContributions.totalContributions /
          homeData.value.githubContributions.daysTracked
        ).toFixed(1)
      : '0.0',
}));

const contributionDays = computed(() =>
  contributionSummary.value.weeks.flatMap((week) => week.contributionDays),
);

const defaultContributionDay = computed(() => {
  for (let index = contributionDays.value.length - 1; index >= 0; index -= 1) {
    const currentDay = contributionDays.value[index];

    if (currentDay.contributionCount > 0) {
      return currentDay;
    }
  }

  return contributionDays.value[contributionDays.value.length - 1] ?? null;
});

const inspectedContributionDay = computed(
  () =>
    hoveredContributionDay.value ??
    pinnedContributionDay.value ??
    defaultContributionDay.value,
);

const inspectedContributionMeta = computed(() => {
  const currentDay = inspectedContributionDay.value;

  if (!currentDay) {
    return null;
  }

  return {
    activityLabel:
      currentDay.contributionCount > 0
        ? `${currentDay.contributionCount} contributions`
        : 'No contributions',
    dateLabel: currentDay.date,
    hint:
      pinnedContributionDay.value?.date === currentDay.date
        ? 'Pinned node'
        : 'Hover / click square',
    levelLabel: getContributionLevelLabel(currentDay.level),
  };
});

const totalArticles = computed(() => homeData.value.contentMetrics.totalArticles);

function isExternalLink(link?: string) {
  return !!link && /^(?:[a-z]+:)?\/\//i.test(link);
}

function resolveLink(link?: string) {
  if (!link) {
    return '#';
  }

  return isExternalLink(link) ? link : withBase(link);
}

function collectDirectoryCardLabels(items: ThemeNavItem[]) {
  const labels: string[] = [];
  const aiNav = items.find((item) => item.text === 'AI');
  const frontendNav = items.find((item) => item.text === '大前端');

  if (aiNav?.text) {
    labels.push(aiNav.text);
  }

  for (const item of frontendNav?.items ?? []) {
    if (item.text) {
      labels.push(item.text);
    }
  }

  if (!labels.some((label) => HOME_DIRECTORY_CARD_BY_LABEL.get(label)?.key === 'nodejs')) {
    labels.push('NestJS');
  }

  return labels.length
    ? labels
    : HOME_DIRECTORY_CARDS.map((item) => item.label);
}

const directoryCards = computed(() =>
  collectDirectoryCardLabels(navItems.value)
    .map((label) => {
      const meta = HOME_DIRECTORY_CARD_BY_LABEL.get(label);

      if (!meta) {
        return null;
      }

      const count = homeData.value.contentMetrics.countsByKey[meta.key] ?? 0;
      const available = Boolean(meta.route) && count > 0;

      return {
        accentRgb: meta.accentRgb,
        available,
        count,
        details: meta.description,
        href: available ? meta.route : undefined,
        key: meta.key,
        label: meta.label,
        routePreview: meta.route ?? 'TBD',
        stateLabel:
          count > 0
            ? meta.stateLabel
            : meta.label === '数据库'
              ? 'Curating'
              : 'Standby',
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null),
);

const terminalRows = computed<TerminalRow[]>(() => {
  const logLevels = [
    { label: 'INFO', tone: 'info' as const },
    { label: 'SUCCESS', tone: 'success' as const },
    { label: 'LOG', tone: 'accent' as const },
    { label: 'WARN', tone: 'warn' as const },
  ];
  const featureLogCount = directoryCards.value.length;
  const articleSummary = directoryCards.value
    .map((item) => `${item.label}:${item.count}`)
    .join('  ');

  return [
    {
      kind: 'command',
      location: '~',
      prompt: '➜',
      text: 'whoami',
    },
    {
      kind: 'output',
      text: 'retired_coder_v65.0.0',
    },
    {
      kind: 'command',
      location: '~',
      prompt: '➜',
      text: 'pwd',
    },
    {
      kind: 'output',
      text: '/workspace/blog',
    },
    {
      kind: 'command',
      location: '~',
      prompt: '➜',
      text: 'tail -f ./logs/homepage.log',
    },
    ...directoryCards.value.map((item, index) => ({
      kind: 'log' as const,
      level: logLevels[index % logLevels.length].label,
      text:
        index === 0
          ? `hero_tagline synced :: ${hero.value.tagline || '技术从未退休，学习永不止步'}`
          : `${item.label} node ready :: ${item.count} articles indexed`,
      timestamp: formatTerminalTimestamp((index - featureLogCount) * 2),
      tone: logLevels[index % logLevels.length].tone,
    })),
    {
      kind: 'log',
      level: 'INFO',
      text: `article_map ready :: ${articleSummary || `${totalArticles.value} docs tracked`}`,
      timestamp: formatTerminalTimestamp(0),
      tone: 'info',
    },
  ];
});

const renderedTerminalRows = computed(() =>
  terminalRows.value.map((row, index) => ({
    ...row,
    renderedText: row.text.slice(0, typedLengths.value[index] ?? 0),
  })),
);

const visibleTerminalRows = computed(() =>
  renderedTerminalRows.value.filter(
    (_, index) =>
      index < activeTerminalRowIndex.value ||
      (index === activeTerminalRowIndex.value && terminalRows.value.length > 0),
  ),
);

const contributionStatus = computed(() =>
  contributionSummary.value.source === 'github'
    ? 'BUILD_SOURCE: GITHUB_GRAPHQL'
    : 'PLACEHOLDER: TOKEN_REQUIRED',
);

const CARD_MOTION_COLUMNS = 4;
const CARD_COLUMN_STAGGERS = [0, 40, 78, 112] as const;

function getContributionLevelLabel(level: number) {
  switch (level) {
    case 4:
      return 'Peak activity';
    case 3:
      return 'High activity';
    case 2:
      return 'Steady activity';
    case 1:
      return 'Low activity';
    default:
      return 'No activity';
  }
}

function hoverContributionDay(day: GitHubContributionDay) {
  hoveredContributionDay.value = day;
}

function clearHoveredContributionDay() {
  hoveredContributionDay.value = null;
}

function togglePinnedContributionDay(day: GitHubContributionDay) {
  pinnedContributionDay.value =
    pinnedContributionDay.value?.date === day.date ? null : day;
}

function refreshTerminalTimestampSeed() {
  if (!inBrowser) {
    return;
  }

  terminalTimestampSeed.value = Date.now();
}

function formatTerminalTimestamp(offsetSeconds: number) {
  if (terminalTimestampSeed.value === null) {
    return '[--:--:--]';
  }

  const date = new Date(terminalTimestampSeed.value + offsetSeconds * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `[${hours}:${minutes}:${seconds}]`;
}

function getMotionInitial(offset = 18, scale = 0.985) {
  if (!playEntranceMotion.value || prefersReducedMotion.value) {
    return {
      opacity: 1,
      scale: 1,
      y: 0,
    };
  }

  return {
    filter: 'blur(2px)',
    opacity: 0,
    scale,
    y: offset,
  };
}

function getMotionVisibleOnce(delay = 0) {
  return {
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 440,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    y: 0,
  };
}

function getCardMotionInitial(offset = 18, scale = 0.99) {
  if (!playEntranceMotion.value || prefersReducedMotion.value) {
    return {
      opacity: 1,
      scale: 1,
      y: 0,
    };
  }

  return {
    filter: 'blur(1px)',
    opacity: 0,
    scale,
    y: offset,
  };
}

function getCardMotionDelay(index: number) {
  const row = Math.floor(index / CARD_MOTION_COLUMNS);
  const column = index % CARD_MOTION_COLUMNS;
  const rowLead = row * 70;
  const emphasisLead = row === 0 ? (index === 0 ? -12 : column === 1 ? -6 : 0) : 0;

  return Math.max(12, 20 + rowLead + CARD_COLUMN_STAGGERS[column] + emphasisLead);
}

function getCardMotionVisibleOnce(index: number) {
  return {
    filter: 'blur(0px)',
    opacity: 1,
    scale: 1,
    transition: {
      delay: getCardMotionDelay(index),
      duration: 500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    y: 0,
  };
}

function clearTypewriter() {
  if (typeTimer) {
    window.clearTimeout(typeTimer);
    typeTimer = undefined;
  }
}

function scheduleTyping(delay: number) {
  if (!inBrowser) {
    return;
  }

  typeTimer = window.setTimeout(typeNextCharacter, delay);
}

function resetTypewriter() {
  refreshTerminalTimestampSeed();
  clearTypewriter();
  typedLengths.value = terminalRows.value.map(() => 0);
  currentRowIndex = 0;
  activeTerminalRowIndex.value = 0;

  if (!terminalRows.value.length) {
    return;
  }

  if (prefersReducedMotion.value) {
    typedLengths.value = terminalRows.value.map((row) => row.text.length);
    activeTerminalRowIndex.value = Math.max(terminalRows.value.length - 1, 0);
    currentRowIndex = terminalRows.value.length;
    return;
  }

  scheduleTyping(220);
}

function getTypingStep(row: TerminalRow, currentLength: number) {
  if (row.kind === 'output') {
    return currentLength >= 8 ? 3 : 2;
  }

  if (row.kind === 'log') {
    return currentLength >= 18 ? 2 : 1;
  }

  return currentLength >= 12 ? 2 : 1;
}

function getTypingDelay(row: TerminalRow, nextLength: number) {
  if (row.kind === 'output') {
    return nextLength >= 10 ? 10 : 14;
  }

  if (row.kind === 'log') {
    return nextLength >= 18 ? 12 : 16;
  }

  return nextLength >= 12 ? 14 : 18;
}

function getTypingRowPause(row: TerminalRow) {
  return row.kind === 'command' ? 96 : 62;
}

function typeNextCharacter() {
  const currentRow = terminalRows.value[currentRowIndex];

  if (!currentRow) {
    activeTerminalRowIndex.value = Math.max(terminalRows.value.length - 1, 0);
    return;
  }

  activeTerminalRowIndex.value = currentRowIndex;

  const currentLength = typedLengths.value[currentRowIndex] ?? 0;
  const nextLength = Math.min(
    currentLength + getTypingStep(currentRow, currentLength),
    currentRow.text.length,
  );
  typedLengths.value[currentRowIndex] = nextLength;

  if (nextLength < currentRow.text.length) {
    scheduleTyping(getTypingDelay(currentRow, nextLength));
    return;
  }

  currentRowIndex += 1;
  scheduleTyping(getTypingRowPause(currentRow));
}

watch(
  terminalRows,
  () => {
    typedLengths.value = terminalRows.value.map(() => 0);
  },
  { immediate: true },
);

watch(contributionDays, (days) => {
  if (
    hoveredContributionDay.value &&
    !days.some((day) => day.date === hoveredContributionDay.value?.date)
  ) {
    hoveredContributionDay.value = null;
  }

  if (
    pinnedContributionDay.value &&
    !days.some((day) => day.date === pinnedContributionDay.value?.date)
  ) {
    pinnedContributionDay.value = null;
  }
});

onMounted(() => {
  resetTypewriter();
});

watch(prefersReducedMotion, (value) => {
  playEntranceMotion.value = !value;
});

onBeforeUnmount(() => {
  clearTypewriter();
});
</script>

<template>
  <div class="terminal-home">
    <SiteHeader />

    <main class="terminal-home__main">
      <section class="terminal-home__hero">
        <div
          v-motion
          class="terminal-home__status"
          :initial="getMotionInitial(14, 0.98)"
          :visible-once="getMotionVisibleOnce(0)"
        >
          <span class="terminal-home__status-dot" />
          <span>SYSTEM STATUS: OPERATIONAL</span>
        </div>

        <h1
          v-motion
          class="terminal-home__title"
          :initial="getMotionInitial(16, 0.99)"
          :visible-once="getMotionVisibleOnce(44)"
        >
          {{ heroTitle.leading }}<br />
          <span>{{ heroTitle.accent }}</span>
        </h1>

        <p
          v-motion
          class="terminal-home__tagline"
          :initial="getMotionInitial(14, 0.994)"
          :visible-once="getMotionVisibleOnce(82)"
        >
          {{ hero.tagline }}
        </p>

      </section>

      <section class="terminal-home__terminal">
        <div
          v-motion
          class="terminal-home__terminal-frame"
          :initial="getMotionInitial(16, 0.994)"
          :visible-once="getMotionVisibleOnce(120)"
        >
          <div class="terminal-home__terminal-bar">
            <div class="terminal-home__terminal-lights">
              <span />
              <span />
              <span />
            </div>
            <div class="terminal-home__terminal-caption">bash -- 80x24</div>
          </div>

          <div class="terminal-home__terminal-body">
            <div class="terminal-home__terminal-sizer" aria-hidden="true">
              <div
                v-for="(row, index) in terminalRows"
                :key="`terminal-sizer-${index}`"
                class="terminal-home__terminal-row"
                :class="`is-${row.kind}`"
              >
                <template v-if="row.kind === 'command'">
                  <span class="terminal-home__prompt">{{ row.prompt }}</span>
                  <span class="terminal-home__location">{{ row.location }}</span>
                  <span class="terminal-home__text">{{ row.text }}</span>
                </template>
                <template v-else-if="row.kind === 'log'">
                  <span class="terminal-home__timestamp">{{ row.timestamp }}</span>
                  <span class="terminal-home__level" :class="`is-${row.tone}`">
                    {{ row.level }}
                  </span>
                  <span class="terminal-home__text">{{ row.text }}</span>
                </template>
                <template v-else>
                  <span class="terminal-home__output">{{ row.text }}</span>
                </template>
              </div>
            </div>

            <div class="terminal-home__terminal-animated">
              <div
                v-for="(row, index) in visibleTerminalRows"
                :key="`terminal-row-${index}`"
                class="terminal-home__terminal-row"
                :class="`is-${row.kind}`"
              >
                <template v-if="row.kind === 'command'">
                  <span class="terminal-home__prompt">{{ row.prompt }}</span>
                  <span class="terminal-home__location">{{ row.location }}</span>
                  <span class="terminal-home__text">
                    {{ row.renderedText }}
                    <span
                      v-if="activeTerminalRowIndex === index"
                      class="terminal-home__cursor"
                    />
                  </span>
                </template>
                <template v-else-if="row.kind === 'log'">
                  <span class="terminal-home__timestamp">{{ row.timestamp }}</span>
                  <span class="terminal-home__level" :class="`is-${row.tone}`">
                    {{ row.level }}
                  </span>
                  <span class="terminal-home__text">
                    {{ row.renderedText }}
                    <span
                      v-if="activeTerminalRowIndex === index"
                      class="terminal-home__cursor"
                    />
                  </span>
                </template>
                <template v-else>
                  <span class="terminal-home__output">
                    {{ row.renderedText }}
                    <span
                      v-if="activeTerminalRowIndex === index"
                      class="terminal-home__cursor"
                    />
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="terminal-home__section">
        <div
          v-motion
          class="terminal-home__section-head"
          :initial="getMotionInitial(14, 0.994)"
          :visible-once="getMotionVisibleOnce(36)"
        >
          <div>
            <p class="terminal-home__section-label">// NAVIGATION_MATRIX</p>
            <h2 class="terminal-home__section-title">AI & Frontend Atlas</h2>
          </div>
        </div>

        <div class="terminal-home__cards">
          <div
            v-for="(card, index) in directoryCards"
            :key="card.key"
            v-motion
            class="terminal-home__card-shell"
            :initial="getCardMotionInitial(14, 0.994)"
            :visible-once="getCardMotionVisibleOnce(index)"
          >
            <a
              class="terminal-home__card"
              :class="{ 'is-disabled': !card.available }"
              :href="card.href ? resolveLink(card.href) : undefined"
              :aria-disabled="!card.available"
              :style="{ '--card-accent-rgb': card.accentRgb }"
              @click="!card.available && $event.preventDefault()"
            >
              <div class="terminal-home__card-body">
                <div class="terminal-home__card-heading">
                  <h3 class="terminal-home__card-title">{{ card.label }}</h3>
                </div>
                <p class="terminal-home__card-details">{{ card.details }}</p>
              </div>

              <div class="terminal-home__card-bottom">
                <div class="terminal-home__card-metrics">
                  <span class="terminal-home__card-count">{{ card.count }} ARTICLES</span>
                  <span class="terminal-home__card-route">{{ card.routePreview }}</span>
                </div>
                <span class="terminal-home__card-arrow">{{ card.available ? '↗' : '···' }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!--
      <section class="terminal-home__section terminal-home__section--github">
        GitHub contributions panel hidden by request.
      </section>
      -->

      <section class="terminal-home__markdown">
        <Content />
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<style>
.terminal-home {
  --terminal-bg: var(--blog-color-surface-lowest);
  --terminal-bg-deep: var(--blog-color-canvas);
  --terminal-panel-low: var(--blog-color-surface-base);
  --terminal-panel: var(--blog-color-surface-container);
  --terminal-panel-high: var(--blog-color-surface-high);
  --terminal-panel-highest: var(--blog-color-surface-bright);
  --terminal-outline: var(--blog-ghost-border-strong);
  --terminal-text: var(--blog-color-text);
  --terminal-text-secondary: var(--blog-color-text-secondary);
  --terminal-text-muted: var(--blog-color-text-muted);
  --terminal-primary: var(--blog-color-primary);
  --terminal-secondary: var(--blog-color-primary-container);
  --terminal-tertiary: var(--blog-color-tertiary);
  --terminal-shadow: var(--blog-shadow-panel);
  position: relative;
  min-height: 100vh;
  color: var(--terminal-text);
  background: var(--blog-color-canvas);
}

.terminal-home::before {
  z-index: 0;
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgb(var(--blog-color-outline-soft-rgb) / 0.72) 0.92px, transparent 1.04px),
    radial-gradient(circle at 12px 12px, rgb(var(--blog-color-primary-rgb) / 0.22) 0.76px, transparent 0.86px);
  background-position:
    0 0,
    2px 2px;
  background-size:
    20px 20px,
    28px 28px;
  opacity: 0.34;
  content: '';
  pointer-events: none;
}

.terminal-home::after {
  z-index: 0;
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 24% 16%, rgb(var(--blog-color-primary-rgb) / 0.03), transparent 16%),
    radial-gradient(circle at 78% 30%, rgb(var(--blog-color-primary-container-rgb) / 0.024), transparent 18%);
  opacity: 0.1;
  content: '';
  pointer-events: none;
}

.terminal-home__nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 50;
  background: var(--blog-backdrop-color);
  backdrop-filter: blur(12px);
  box-shadow: var(--terminal-shadow);
}

.terminal-home__nav-inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  margin: 0 auto;
  padding: 0 18px;
  max-width: 1536px;
  min-height: 62px;
}

.terminal-home__brand {
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

.terminal-home__brand-prefix {
  color: var(--blog-terminal-heading);
}

.terminal-home__brand-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.terminal-home__nav-main {
  min-width: 0;
}

.terminal-home__nav-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.terminal-home__main {
  position: relative;
  z-index: 1;
  isolation: isolate;
  margin: 0 auto;
  padding: 80px 24px 64px;
  max-width: 1536px;
  min-height: 100vh;
}

.terminal-home__hero {
  margin-bottom: 48px;
}

.terminal-home__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  border: 1px solid var(--blog-ghost-border);
  border-radius: 999px;
  padding: 0px 10px;
  font-family: var(--blog-font-mono);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--terminal-primary);
  background: var(--terminal-panel-highest);
}

.terminal-home__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--terminal-secondary);
  box-shadow: 0 0 0 1px rgb(var(--blog-color-primary-container-rgb) / 0.22);
  animation: terminal-pulse 1.6s ease-in-out infinite;
}

.terminal-home__title {
  margin: 0;
  color: var(--blog-terminal-heading);
  font-family: var(--blog-font-display);
  font-size: clamp(2.85rem, 8.2vw, 5.8rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.terminal-home__title span {
  color: var(--terminal-primary);
  text-shadow: none;
}

.terminal-home__tagline {
  margin: 18px 0 0;
  max-width: 680px;
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--terminal-text-secondary);
}

.terminal-home__terminal {
  margin-bottom: 48px;
}

.terminal-home__terminal-frame {
  overflow: hidden;
  border: 1px solid var(--blog-ghost-border);
  border-radius: 12px;
  background: rgb(var(--blog-color-surface-lowest-rgb) / 0.98);
  box-shadow: 0 16px 32px rgb(0 0 0 / 0.16);
}

.terminal-home__terminal-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--blog-ghost-border-soft);
  background: var(--terminal-panel-highest);
}

.terminal-home__terminal-lights {
  display: flex;
  gap: 6px;
}

.terminal-home__terminal-lights span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.terminal-home__terminal-lights span:nth-child(1) {
  background: rgb(var(--blog-color-outline-soft-rgb) / 0.55);
}

.terminal-home__terminal-lights span:nth-child(2) {
  background: rgb(var(--blog-color-tertiary-rgb) / 0.55);
}

.terminal-home__terminal-lights span:nth-child(3) {
  background: rgb(var(--blog-color-primary-container-rgb) / 0.55);
}

.terminal-home__terminal-caption {
  flex: 1;
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-align: center;
  text-transform: uppercase;
  color: var(--blog-color-text-faint);
}

.terminal-home__terminal-body {
  position: relative;
  padding: 24px;
  font-family: var(--blog-font-mono);
  font-size: 0.84rem;
  line-height: 1.8;
  color: var(--blog-color-text);
  background: rgb(var(--blog-color-surface-lowest-rgb) / 1);
}

.terminal-home__terminal-sizer {
  visibility: hidden;
  pointer-events: none;
}

.terminal-home__terminal-animated {
  position: absolute;
  inset: 24px;
}

.terminal-home__terminal-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.terminal-home__terminal-row + .terminal-home__terminal-row {
  margin-top: 6px;
}

.terminal-home__terminal-row.is-log {
  font-size: 0.71rem;
  line-height: 1.65;
}

.terminal-home__prompt {
  color: var(--terminal-secondary);
}

.terminal-home__location {
  color: var(--terminal-primary);
}

.terminal-home__text,
.terminal-home__output {
  min-width: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-home__output {
  color: var(--terminal-text-secondary);
  padding-left: 44px;
}

.terminal-home__timestamp {
  font-size: 0.68rem;
  color: var(--blog-color-text-muted);
}

.terminal-home__level {
  min-width: 70px;
  font-size: 0.68rem;
}

.terminal-home__level.is-info {
  color: var(--terminal-primary);
}

.terminal-home__level.is-success {
  color: var(--blog-color-success);
}

.terminal-home__level.is-accent {
  color: var(--terminal-primary);
}

.terminal-home__level.is-warn {
  color: var(--terminal-tertiary);
}

.terminal-home__cursor {
  display: inline-block;
  margin-left: 1px;
  width: 0.58em;
  height: 1.14em;
  vertical-align: middle;
  background: currentColor;
  animation: terminal-blink 0.9s steps(1) infinite;
}

.terminal-home__section {
  position: relative;
  margin-bottom: 48px;
}

.terminal-home__section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 28px;
}

.terminal-home__section-label {
  margin: 0 0 10px;
  font-family: var(--blog-font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--terminal-primary);
}

.terminal-home__section-title {
  margin: 0;
  font-family: var(--blog-font-display);
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--terminal-text);
}

.terminal-home__cards {
  position: relative;
  isolation: isolate;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.terminal-home__cards::before {
  content: '';
  position: absolute;
  inset: -8px;
  z-index: -1;
  background: var(--blog-color-canvas);
  pointer-events: none;
}

.terminal-home__card-shell {
  min-width: 0;
}

.terminal-home__card {
  --card-accent-rgb: 135, 220, 255;
  position: relative;
  z-index: 0;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  min-height: 252px;
  border: 1px solid rgb(var(--blog-color-outline-rgb) / 0.14);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  background-color: rgb(var(--blog-color-surface-base-rgb));
  background:
    linear-gradient(180deg, rgb(var(--blog-color-surface-high-rgb)) 0%, rgb(var(--blog-color-surface-base-rgb)) 100%);
  box-shadow: var(--blog-shadow-panel);
  transition:
    transform 0.38s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.38s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background-position 0.38s ease,
    background 0.38s ease;
  transform-origin: center bottom;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform, border-color, box-shadow, background-position;
}

.terminal-home__card::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      135deg,
      rgba(var(--card-accent-rgb), 0.24) 0%,
      rgba(var(--card-accent-rgb), 0.1) 24%,
      rgba(var(--card-accent-rgb), 0.04) 42%,
      transparent 66%
    ),
    linear-gradient(
      180deg,
      rgba(var(--card-accent-rgb), 0.06) 0%,
      transparent 48%
    );
  opacity: 1;
  transform: none;
  transition:
    background 0.44s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.34s ease,
    transform 0.44s cubic-bezier(0.22, 1, 0.36, 1);
  content: '';
  pointer-events: none;
}

.terminal-home__card::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.04) 0%, rgb(255 255 255 / 0.012) 28%, transparent 100%),
    linear-gradient(225deg, rgb(255 255 255 / 0.03) 0%, transparent 34%);
  opacity: 1;
  transition:
    background 0.44s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.34s ease;
  content: '';
  pointer-events: none;
}

.terminal-home__card:hover {
  transform: translate3d(0, -5px, 0);
  background:
    linear-gradient(180deg, rgb(var(--blog-color-surface-bright-rgb)) 0%, rgb(var(--blog-color-surface-container-rgb)) 100%);
  box-shadow:
    0 20px 32px rgb(0 0 0 / 0.16),
    0 8px 16px rgb(0 0 0 / 0.06);
}

.terminal-home__card:hover::before,
.terminal-home__card:focus-visible::before {
  background:
    linear-gradient(
      135deg,
      rgba(var(--card-accent-rgb), 0.32) 0%,
      rgba(var(--card-accent-rgb), 0.14) 24%,
      rgba(var(--card-accent-rgb), 0.06) 44%,
      transparent 70%
    ),
    linear-gradient(
      180deg,
      rgba(var(--card-accent-rgb), 0.08) 0%,
      transparent 50%
    );
  opacity: 1;
  transform: translate3d(0px, -2px, 0);
}

.terminal-home__card:hover::after,
.terminal-home__card:focus-visible::after {
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.046) 0%, rgb(255 255 255 / 0.014) 28%, transparent 100%),
    linear-gradient(225deg, rgb(255 255 255 / 0.034) 0%, transparent 32%);
  opacity: 1;
}

.terminal-home__card:focus-visible {
  outline: none;
  transform: translate3d(0, -5px, 0);
  box-shadow:
    0 20px 32px rgb(0 0 0 / 0.16),
    0 8px 16px rgb(0 0 0 / 0.06);
}

.terminal-home__card.is-disabled {
  cursor: default;
  border-color: var(--blog-ghost-border-soft);
  box-shadow: none;
}

.terminal-home__card.is-disabled::before {
  opacity: 0.16;
}

.terminal-home__card.is-disabled::after {
  opacity: 0.18;
}

.terminal-home__card.is-disabled:hover {
  transform: none;
  background:
    linear-gradient(180deg, rgb(var(--blog-color-surface-high-rgb)) 0%, rgb(var(--blog-color-surface-base-rgb)) 100%);
  box-shadow: none;
}

.terminal-home__card > * {
  position: relative;
  z-index: 1;
}

.terminal-home__card-bottom,
.terminal-home__card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.terminal-home__card-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.terminal-home__card-metrics {
  align-items: flex-start;
}

.terminal-home__card-count,
.terminal-home__card-status,
.terminal-home__card-route {
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.terminal-home__card-body {
  display: grid;
  gap: 14px;
  margin: 0;
}

.terminal-home__card-heading {
  gap: 14px;
}

.terminal-home__card-title {
  margin: 0;
  font-family: var(--blog-font-display);
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}

.terminal-home__card-details {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--terminal-text-secondary);
}

.terminal-home__card-bottom {
  align-items: flex-end;
  margin-top: 18px;
}

.terminal-home__card-count {
  color: rgba(var(--card-accent-rgb), 0.58);
}

.terminal-home__card-route {
  color: var(--blog-color-text-muted);
}

.terminal-home__card-arrow {
  color: rgba(var(--card-accent-rgb), 0.54);
  opacity: 0.42;
  transform: translate3d(-2px, 2px, 0);
  transition:
    opacity 0.28s ease,
    transform 0.44s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.26s ease;
}

.terminal-home__card:hover .terminal-home__card-arrow {
  color: rgba(var(--card-accent-rgb), 0.72);
  opacity: 0.76;
  transform: translate3d(5px, -2px, 0) scale(1.03);
}

.terminal-home__card.is-disabled .terminal-home__card-arrow {
  opacity: 0.34;
  color: var(--blog-color-text-faint);
  transform: none;
}

.terminal-home__card.is-disabled .terminal-home__card-status,
.terminal-home__card.is-disabled .terminal-home__card-count {
  color: var(--blog-color-text-faint);
}

.terminal-home__card.is-disabled .terminal-home__card-status {
  border-color: var(--blog-ghost-border);
  background: rgb(255 255 255 / 0.02);
}

.terminal-home__card.is-disabled .terminal-home__card-route {
  color: var(--blog-color-text-muted);
}

.terminal-home__github {
  overflow: visible;
  border: 1px solid var(--blog-ghost-border-soft);
  border-radius: 18px;
  padding: 24px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.026) 0%, transparent 100%),
    rgb(var(--blog-color-surface-low-rgb) / 0.98);
  box-shadow:
    0 18px 36px rgb(0 0 0 / 0.12);
}

.terminal-home__github-head,
.terminal-home__github-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.terminal-home__github-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.terminal-home__github-icon {
  color: var(--terminal-secondary);
}

.terminal-home__github-title {
  margin: 0;
  font-family: var(--blog-font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.terminal-home__github-legend,
.terminal-home__github-badge,
.terminal-home__github-stat span,
.terminal-home__footer-link,
.terminal-home__footer-copyright,
.terminal-home__footer-meta {
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.terminal-home__github-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--terminal-text-secondary);
}

.terminal-home__github-scale {
  display: flex;
  gap: 6px;
}

.terminal-home__github-scale span,
.terminal-home__github-day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: rgb(var(--blog-color-surface-bright-rgb) / 0.78);
}

.terminal-home__github-scale .level-1,
.terminal-home__github-day.level-1 {
  background: rgb(var(--blog-color-primary-rgb) / 0.2);
}

.terminal-home__github-scale .level-2,
.terminal-home__github-day.level-2 {
  background: rgb(var(--blog-color-primary-rgb) / 0.4);
}

.terminal-home__github-scale .level-3,
.terminal-home__github-day.level-3 {
  background: rgb(var(--blog-color-primary-rgb) / 0.7);
}

.terminal-home__github-scale .level-4,
.terminal-home__github-day.level-4 {
  background: var(--terminal-primary);
}

.terminal-home__github-grid-wrap {
  overflow-x: auto;
  padding: 24px 8px 18px;
}

.terminal-home__github-grid {
  --github-grid-gap: clamp(5px, 0.48vw, 7px);
  display: grid;
  grid-template-columns: repeat(var(--week-count), minmax(0, 1fr));
  gap: var(--github-grid-gap);
  width: 100%;
  min-width: 888px;
}

.terminal-home__github-week {
  display: grid;
  grid-template-rows: repeat(7, minmax(0, 1fr));
  gap: var(--github-grid-gap);
  min-width: 0;
}

.terminal-home__github-inspector {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin-top: 18px;
  border: 1px solid var(--blog-ghost-border-soft);
  border-radius: 10px;
  padding: 10px 12px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.03) 0%, rgb(255 255 255 / 0.008) 100%),
    rgb(var(--blog-color-surface-lowest-rgb) / 0.98);
}

.terminal-home__github-inspector-date,
.terminal-home__github-inspector-level,
.terminal-home__github-inspector-hint {
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.terminal-home__github-inspector-date {
  color: var(--terminal-text-secondary);
}

.terminal-home__github-inspector-count {
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--terminal-text);
}

.terminal-home__github-inspector-level {
  color: var(--terminal-primary);
}

.terminal-home__github-inspector-hint {
  color: var(--blog-color-text-muted);
}

.terminal-home__github-day {
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  border: 1px solid var(--blog-ghost-border-strong);
  padding: 0;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

.terminal-home__github-day:hover,
.terminal-home__github-day:focus-visible,
.terminal-home__github-day.is-active {
  transform: translateY(-1px) scale(1.03);
  border-color: var(--blog-charged-border-strong);
  box-shadow:
    0 0 0 1px rgb(var(--blog-color-primary-rgb) / 0.12),
    0 0 14px rgb(var(--blog-color-primary-rgb) / 0.16);
  filter: brightness(1.08);
  z-index: 1;
}

.terminal-home__github-day.is-pinned {
  border-color: rgb(var(--blog-color-primary-container-rgb) / 0.36);
  box-shadow:
    0 0 0 1px rgb(var(--blog-color-primary-container-rgb) / 0.14),
    0 0 14px rgb(var(--blog-color-primary-container-rgb) / 0.18);
}

.terminal-home__github-day:focus-visible {
  outline: none;
}

.terminal-home__github-footer {
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--blog-ghost-border-soft);
}

.terminal-home__github-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}

.terminal-home__github-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.terminal-home__github-stat span {
  color: var(--blog-color-text-muted);
}

.terminal-home__github-stat strong {
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.terminal-home__github-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--blog-charged-border);
  border-radius: 20px;
  padding: 0 16px;
  color: var(--terminal-primary);
  text-decoration: none;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.022) 0%, transparent 100%),
    rgb(var(--blog-color-primary-rgb) / 0.08);
  align-self: flex-end;
}

.terminal-home__github-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--terminal-secondary);
  box-shadow: 0 0 8px rgb(var(--blog-color-primary-container-rgb) / 0.55);
}

.terminal-home__github-note {
  margin: 18px 0 0;
  font-size: 0.84rem;
  line-height: 1.7;
  color: var(--terminal-text-secondary);
}

.terminal-home__markdown:empty {
  display: none;
}

.terminal-home__footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--blog-ghost-border-soft);
  background: var(--terminal-bg-deep);
}

.terminal-home__footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0 auto;
  padding: 28px 24px;
  max-width: 1536px;
}

.terminal-home__footer-brand {
  display: block;
  margin-bottom: 10px;
  font-family: var(--blog-font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--terminal-primary);
}

.terminal-home__footer-meta {
  margin: 0;
  color: var(--blog-color-text-muted);
}

.terminal-home__footer-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.terminal-home__footer-link {
  color: var(--blog-color-text-muted);
  text-decoration: none;
}

.terminal-home__footer-link:hover {
  color: var(--terminal-primary);
}

.terminal-home__footer-copyright {
  margin: 0;
  color: var(--blog-color-text-muted);
}

.terminal-home__screen {
  position: fixed;
  inset: 0;
  z-index: 45;
  padding: 88px 20px 20px;
  background: rgb(var(--blog-color-canvas-rgb) / 0.62);
  backdrop-filter: blur(10px);
}

.terminal-home__screen-panel {
  margin: 0 auto;
  border: 1px solid var(--blog-ghost-border);
  border-radius: 16px;
  padding: 18px;
  max-width: 360px;
  background: var(--terminal-panel-high);
}

.terminal-home-screen-enter-active,
.terminal-home-screen-leave-active {
  transition: opacity 0.2s ease;
}

.terminal-home-screen-enter-active .terminal-home__screen-panel,
.terminal-home-screen-leave-active .terminal-home__screen-panel {
  transition: transform 0.2s ease;
}

.terminal-home-screen-enter-from,
.terminal-home-screen-leave-to {
  opacity: 0;
}

.terminal-home-screen-enter-from .terminal-home__screen-panel,
.terminal-home-screen-leave-to .terminal-home__screen-panel {
  transform: translateY(-8px);
}

.terminal-home .VPNavBarMenu {
  display: flex;
}

.terminal-home .VPNavBarMenuLink,
.terminal-home .VPFlyout .button,
.terminal-home .VPFlyout .text {
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

.terminal-home .VPNavBarMenuLink.active,
.terminal-home .VPNavBarMenuLink:hover,
.terminal-home .VPFlyout.active .text,
.terminal-home .VPFlyout:hover .text {
  color: var(--terminal-primary);
}

.terminal-home .VPNavBarMenuLink.active::after {
  margin-left: 6px;
  font-size: 0.5rem;
  color: var(--terminal-primary);
  content: '●';
}

.terminal-home .VPFlyout .menu {
  top: calc(100% + 22px);
}

.terminal-home .VPMenu {
  border-color: var(--blog-ghost-border);
  background: var(--terminal-panel-high);
  box-shadow: var(--blog-shadow-float);
}

.terminal-home .VPMenu .link {
  color: var(--terminal-text);
}

.terminal-home .VPMenu .link:hover,
.terminal-home .VPMenu .link.active {
  color: var(--terminal-primary);
  background: var(--terminal-panel-highest);
}

.terminal-home .VPMenu .label {
  color: var(--terminal-text-secondary);
}

.terminal-home .VPNavBarSearch {
  width: 188px;
}

.terminal-home .DocSearch-Button {
  justify-content: flex-start;
  border: 1px solid var(--blog-ghost-border-soft);
  border-radius: 6px;
  padding: 0 12px;
  width: 100%;
  height: 38px;
  background: var(--terminal-panel-high);
}

.terminal-home .DocSearch-Button:hover {
  border-color: var(--blog-charged-border);
  background: var(--terminal-panel-highest);
}

.terminal-home .DocSearch-Button .DocSearch-Search-Icon {
  color: var(--terminal-text-secondary);
}

.terminal-home .DocSearch-Button .DocSearch-Button-Placeholder,
.terminal-home .DocSearch-Button .DocSearch-Button-Key {
  font-family: var(--blog-font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.terminal-home .DocSearch-Button .DocSearch-Button-Placeholder {
  color: var(--blog-color-text-muted);
}

.terminal-home .DocSearch-Button .DocSearch-Button-Key {
  border-color: var(--blog-ghost-border);
  color: var(--blog-color-text-muted);
}

.terminal-home .VPNavBarAppearance,
.terminal-home .VPNavBarSocialLinks {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
}

.terminal-home .VPSocialLink {
  width: 30px;
  height: 30px;
  color: var(--blog-color-text-muted);
}

.terminal-home .VPSocialLink:hover {
  color: var(--terminal-primary);
}

.terminal-home .VPSwitch {
  border: 0;
  border-radius: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.terminal-home .VPSwitch:hover {
  background: transparent;
}

.terminal-home .VPSwitch .check {
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

.terminal-home .dark .VPSwitch .check,
.dark .terminal-home .VPSwitch .check {
  background: transparent;
}

.terminal-home .VPSwitch .icon {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.terminal-home .VPSwitch .icon :is(.vpi-sun, .vpi-moon) {
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  color: var(--terminal-text-secondary);
  transform: translate(-50%, -50%);
}

.terminal-home .dark .VPSwitch .icon :is(.vpi-sun, .vpi-moon),
.dark .terminal-home .VPSwitch .icon :is(.vpi-sun, .vpi-moon) {
  color: var(--terminal-primary);
}

.terminal-home .VPNavBarHamburger {
  border: 1px solid var(--blog-ghost-border);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  background: var(--terminal-panel-high);
}

.terminal-home .VPNavBarHamburger:hover {
  border-color: var(--blog-charged-border);
}

.terminal-home .VPNavBarHamburger .top,
.terminal-home .VPNavBarHamburger .middle,
.terminal-home .VPNavBarHamburger .bottom {
  background: var(--terminal-text);
}

.terminal-home .VPNavScreenMenuLink,
.terminal-home .VPNavScreenMenuGroup .button {
  color: var(--terminal-text);
}

.terminal-home .VPNavScreenMenuLink,
.terminal-home .VPNavScreenMenuGroup .button,
.terminal-home .VPNavScreenAppearance .text {
  font-family: var(--blog-font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.terminal-home .VPNavScreenMenuLink,
.terminal-home .VPNavScreenMenuGroup {
  border-bottom-color: var(--blog-ghost-border-soft);
}

.terminal-home .VPNavScreenAppearance {
  margin-top: 18px;
  border-radius: 8px;
  background: var(--terminal-panel-highest);
}

.terminal-home .VPNavScreenSocialLinks {
  margin-top: 16px;
  justify-content: flex-start;
}

@media (max-width: 1279px) {
  .terminal-home__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .terminal-home__github-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 959px) {
  .terminal-home__nav-inner {
    grid-template-columns: auto 1fr auto;
    gap: 16px;
  }

  .terminal-home__nav-main {
    display: none;
  }

  .terminal-home__github-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .terminal-home__github-grid {
    min-width: 724px;
  }
}

@media (max-width: 767px) {
  .terminal-home__nav-inner,
  .terminal-home__main,
  .terminal-home__footer-inner {
    padding-right: 12px;
    padding-left: 12px;
  }

  .terminal-home__nav-tools {
    gap: 6px;
  }

  .terminal-home .VPNavBarSearch {
    width: auto;
  }

  .terminal-home .DocSearch-Button {
    width: 36px;
    min-width: 36px;
    padding: 0;
  }

  .terminal-home .DocSearch-Button .DocSearch-Button-Placeholder,
  .terminal-home .DocSearch-Button .DocSearch-Button-Keys {
    display: none;
  }

  .terminal-home__tagline {
    font-size: 0.96rem;
  }

  .terminal-home__terminal-body,
  .terminal-home__card,
  .terminal-home__github {
    padding: 18px;
  }

  .terminal-home__terminal-animated {
    inset: 18px;
  }

  .terminal-home__terminal-row {
    flex-wrap: wrap;
    gap: 4px 10px;
  }

  .terminal-home__output {
    padding-left: 0;
  }

  .terminal-home__cards {
    grid-template-columns: 1fr;
  }

  .terminal-home__github-head,
  .terminal-home__footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .terminal-home__github-legend {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .terminal-home__github-inspector {
    align-items: flex-start;
  }

  .terminal-home__github-stats {
    grid-template-columns: 1fr;
  }

  .terminal-home__github-grid {
    min-width: 592px;
  }

  .terminal-home__footer-side {
    align-items: flex-start;
  }
}

html:not(.dark) .terminal-home,
html.light .terminal-home,
html[data-theme='light'] .terminal-home {
  --terminal-panel-low: var(--blog-color-surface-base);
  --terminal-panel: var(--blog-color-surface-lowest);
  --terminal-panel-high: var(--blog-color-surface-low);
  --terminal-panel-highest: var(--blog-color-surface-container);
  --terminal-shadow: var(--blog-shadow-panel);
}

html:not(.dark) .terminal-home::before,
html.light .terminal-home::before,
html[data-theme='light'] .terminal-home::before {
  opacity: 0.26;
}

html:not(.dark) .terminal-home::after,
html.light .terminal-home::after,
html[data-theme='light'] .terminal-home::after {
  background-image:
    radial-gradient(circle at 24% 16%, rgb(var(--blog-color-primary-rgb) / 0.05), transparent 18%),
    radial-gradient(circle at 78% 30%, rgb(var(--blog-color-primary-container-rgb) / 0.16), transparent 20%),
    repeating-linear-gradient(
      180deg,
      rgb(var(--blog-color-outline-rgb) / 0.035) 0,
      rgb(var(--blog-color-outline-rgb) / 0.035) 1px,
      transparent 1px,
      transparent 120px
    );
  opacity: 0.14;
}

html:not(.dark) .terminal-home__screen,
html.light .terminal-home__screen,
html[data-theme='light'] .terminal-home__screen {
  background: rgb(var(--blog-color-canvas-rgb) / 0.78);
}

html:not(.dark) .terminal-home__title span,
html.light .terminal-home__title span,
html[data-theme='light'] .terminal-home__title span {
  text-shadow: none;
}

html:not(.dark) .terminal-home__status-dot,
html.light .terminal-home__status-dot,
html[data-theme='light'] .terminal-home__status-dot,
html:not(.dark) .terminal-home__github-badge-dot,
html.light .terminal-home__github-badge-dot,
html[data-theme='light'] .terminal-home__github-badge-dot {
  box-shadow: 0 0 0 2px rgb(var(--blog-color-primary-rgb) / 0.12);
}

html:not(.dark) .terminal-home__terminal-frame,
html.light .terminal-home__terminal-frame,
html[data-theme='light'] .terminal-home__terminal-frame,
html:not(.dark) .terminal-home__github,
html.light .terminal-home__github,
html[data-theme='light'] .terminal-home__github,
html:not(.dark) .terminal-home__github-inspector,
html.light .terminal-home__github-inspector,
html[data-theme='light'] .terminal-home__github-inspector,
html:not(.dark) .terminal-home__card,
html.light .terminal-home__card,
html[data-theme='light'] .terminal-home__card,
html:not(.dark) .terminal-home__screen-panel,
html.light .terminal-home__screen-panel,
html[data-theme='light'] .terminal-home__screen-panel,
html:not(.dark) .terminal-home .VPMenu,
html.light .terminal-home .VPMenu,
html[data-theme='light'] .terminal-home .VPMenu,
html:not(.dark) .terminal-home .DocSearch-Button,
html.light .terminal-home .DocSearch-Button,
html[data-theme='light'] .terminal-home .DocSearch-Button,
html:not(.dark) .terminal-home .VPNavBarHamburger,
html.light .terminal-home .VPNavBarHamburger,
html[data-theme='light'] .terminal-home .VPNavBarHamburger,
html:not(.dark) .terminal-home .VPNavScreenAppearance,
html.light .terminal-home .VPNavScreenAppearance,
html[data-theme='light'] .terminal-home .VPNavScreenAppearance,
html:not(.dark) .terminal-home__status,
html.light .terminal-home__status,
html[data-theme='light'] .terminal-home__status,
html:not(.dark) .terminal-home__card-status,
html.light .terminal-home__card-status,
html[data-theme='light'] .terminal-home__card-status,
html:not(.dark) .terminal-home__github-badge,
html.light .terminal-home__github-badge,
html[data-theme='light'] .terminal-home__github-badge {
  border-radius: 0;
}

html:not(.dark) .terminal-home__screen-panel,
html.light .terminal-home__screen-panel,
html[data-theme='light'] .terminal-home__screen-panel {
  box-shadow: var(--blog-shadow-command);
  border-radius: 14px;
  background: rgb(var(--blog-color-surface-lowest-rgb) / 1);
}

html:not(.dark) .terminal-home__terminal-frame,
html.light .terminal-home__terminal-frame,
html[data-theme='light'] .terminal-home__terminal-frame {
  border-radius: 14px;
  box-shadow: var(--blog-shadow-panel);
}

html:not(.dark) .terminal-home__card,
html.light .terminal-home__card,
html[data-theme='light'] .terminal-home__card {
  border-radius: 16px;
  border-color: rgb(var(--blog-color-outline-rgb) / 0.14);
  background:
    radial-gradient(circle at 16% 14%, rgba(var(--card-accent-rgb), 0.08), transparent 36%),
    radial-gradient(circle at 100% 100%, rgba(var(--card-accent-rgb), 0.028), transparent 30%),
    linear-gradient(
      180deg,
      rgb(var(--blog-color-surface-lowest-rgb) / 0.96) 0%,
      rgb(var(--blog-color-surface-base-rgb) / 0.98) 100%
    );
  box-shadow: var(--blog-shadow-panel);
}

html:not(.dark) .terminal-home__card::before,
html.light .terminal-home__card::before,
html[data-theme='light'] .terminal-home__card::before {
  background:
    radial-gradient(circle at 18% 16%, rgba(var(--card-accent-rgb), 0.04), transparent 34%),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.42) 0%,
      rgba(255, 255, 255, 0.14) 24%,
      transparent 68%
    );
  opacity: 0.28;
}

html:not(.dark) .terminal-home__card::after,
html.light .terminal-home__card::after,
html[data-theme='light'] .terminal-home__card::after {
  opacity: 0.4;
}

html:not(.dark) .terminal-home__card:hover,
html.light .terminal-home__card:hover,
html[data-theme='light'] .terminal-home__card:hover {
  transform: translate3d(0, -3px, 0);
  border-color: rgba(var(--card-accent-rgb), 0.12);
  background:
    radial-gradient(circle at 16% 14%, rgba(var(--card-accent-rgb), 0.06), transparent 36%),
    radial-gradient(circle at 100% 100%, rgba(var(--card-accent-rgb), 0.024), transparent 30%),
    linear-gradient(
      180deg,
      rgb(var(--blog-color-surface-lowest-rgb) / 1) 0%,
      rgb(var(--blog-color-surface-low-rgb) / 0.98) 100%
    );
  box-shadow: var(--blog-shadow-panel-hover);
}

html:not(.dark) .terminal-home__card:focus-visible,
html.light .terminal-home__card:focus-visible,
html[data-theme='light'] .terminal-home__card:focus-visible {
  box-shadow: var(--blog-shadow-panel-hover);
}

html:not(.dark) .terminal-home__card:hover .terminal-home__card-arrow,
html.light .terminal-home__card:hover .terminal-home__card-arrow,
html[data-theme='light'] .terminal-home__card:hover .terminal-home__card-arrow {
  opacity: 0.58;
  transform: translate3d(2px, -1px, 0);
}

html:not(.dark) .terminal-home__github,
html.light .terminal-home__github,
html[data-theme='light'] .terminal-home__github {
  border-radius: 18px;
}

html:not(.dark) .terminal-home__github-inspector,
html.light .terminal-home__github-inspector,
html[data-theme='light'] .terminal-home__github-inspector,
html:not(.dark) .terminal-home .VPMenu,
html.light .terminal-home .VPMenu,
html[data-theme='light'] .terminal-home .VPMenu {
  border-radius: 12px;
}

html:not(.dark) .terminal-home .VPMenu,
html.light .terminal-home .VPMenu,
html[data-theme='light'] .terminal-home .VPMenu {
  background: rgb(var(--blog-color-surface-lowest-rgb) / 1);
}

html:not(.dark) .terminal-home .DocSearch-Button,
html.light .terminal-home .DocSearch-Button,
html[data-theme='light'] .terminal-home .DocSearch-Button,
html:not(.dark) .terminal-home .VPNavBarHamburger,
html.light .terminal-home .VPNavBarHamburger,
html[data-theme='light'] .terminal-home .VPNavBarHamburger,
html:not(.dark) .terminal-home .VPNavScreenAppearance,
html.light .terminal-home .VPNavScreenAppearance,
html[data-theme='light'] .terminal-home .VPNavScreenAppearance {
  border-radius: 10px;
}

html:not(.dark) .terminal-home__status,
html.light .terminal-home__status,
html[data-theme='light'] .terminal-home__status,
html:not(.dark) .terminal-home__card-status,
html.light .terminal-home__card-status,
html[data-theme='light'] .terminal-home__card-status,
html:not(.dark) .terminal-home__github-badge,
html.light .terminal-home__github-badge,
html[data-theme='light'] .terminal-home__github-badge {
  border-radius: 999px;
}

html:not(.dark) .terminal-home__card.is-disabled,
html.light .terminal-home__card.is-disabled,
html[data-theme='light'] .terminal-home__card.is-disabled,
html:not(.dark) .terminal-home__card.is-disabled:hover,
html.light .terminal-home__card.is-disabled:hover,
html[data-theme='light'] .terminal-home__card.is-disabled:hover {
  background:
    radial-gradient(circle at 16% 14%, rgba(var(--card-accent-rgb), 0.024), transparent 36%),
    radial-gradient(circle at 100% 100%, rgba(var(--card-accent-rgb), 0.01), transparent 30%),
    linear-gradient(
      180deg,
      rgb(var(--blog-color-surface-lowest-rgb) / 0.94) 0%,
      rgb(var(--blog-color-surface-base-rgb) / 0.96) 100%
    );
  box-shadow: none;
}

html:not(.dark) .terminal-home__github-day:hover,
html.light .terminal-home__github-day:hover,
html[data-theme='light'] .terminal-home__github-day:hover,
html:not(.dark) .terminal-home__github-day:focus-visible,
html.light .terminal-home__github-day:focus-visible,
html[data-theme='light'] .terminal-home__github-day:focus-visible,
html:not(.dark) .terminal-home__github-day.is-active,
html.light .terminal-home__github-day.is-active,
html[data-theme='light'] .terminal-home__github-day.is-active {
  box-shadow:
    0 0 0 1px rgb(var(--blog-color-primary-rgb) / 0.08),
    0 8px 16px rgb(25 28 29 / 0.08);
  filter: none;
}

html:not(.dark) .terminal-home__github-day.is-pinned,
html.light .terminal-home__github-day.is-pinned,
html[data-theme='light'] .terminal-home__github-day.is-pinned {
  box-shadow:
    0 0 0 1px rgb(var(--blog-color-primary-container-rgb) / 0.22),
    0 8px 16px rgb(25 28 29 / 0.06);
}

@keyframes terminal-fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes terminal-card-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes terminal-pulse {
  0%,
  100% {
    opacity: 0.68;
  }

  50% {
    opacity: 1;
  }
}

@keyframes terminal-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}
</style>

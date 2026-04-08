import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

interface GitHubContributionResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              contributionLevel:
                | 'NONE'
                | 'FIRST_QUARTILE'
                | 'SECOND_QUARTILE'
                | 'THIRD_QUARTILE'
                | 'FOURTH_QUARTILE';
              date: string;
              weekday: number;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message?: string }>;
}

export interface ContentMetricsData {
  areaCount: number;
  countsByKey: Record<string, number>;
  totalArticles: number;
}

export interface PageMetadata {
  lastUpdated: string;
  lastUpdatedMs: number;
  readMinutes: number;
}

export interface GitHubContributionDay {
  contributionCount: number;
  date: string;
  level: number;
  weekday: number;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export interface GitHubContributionsData {
  activeDays: number;
  currentStreak: number;
  daysTracked: number;
  longestStreak: number;
  note: string | null;
  profileUrl: string;
  source: 'fallback' | 'github';
  totalContributions: number;
  updatedAt: string;
  username: string;
  weeks: GitHubContributionWeek[];
}

export interface BlogData {
  contentMetrics: ContentMetricsData;
  githubContributions: GitHubContributionsData;
  pageMetadataByRelativePath: Record<string, PageMetadata>;
}

export const HOME_TOPIC_META = [
  {
    key: 'ai',
    label: 'AI',
    matchPrefixes: ['/ai/', '/interview/ai/'],
    route: '/interview/ai/01',
  },
  {
    key: 'react',
    label: 'React',
    matchPrefixes: ['/react/'],
    route: '/react/view',
  },
  {
    key: 'vue',
    label: 'Vue',
    matchPrefixes: ['/vue/'],
    route: '/vue/pinia/01',
  },
  {
    key: 'micro-web',
    label: '微前端',
    matchPrefixes: ['/micro-web/'],
    route: '/micro-web/single-spa',
  },
  {
    key: 'nodejs',
    label: 'Node.js',
    matchPrefixes: ['/interview/ba-gu/node'],
    route: '/interview/ba-gu/node',
  },
  {
    key: 'database',
    label: '数据库',
    matchPrefixes: ['/database', '/database/'],
    route: '/database',
  },
  {
    key: 'devops',
    label: 'DevOps',
    matchPrefixes: ['/devops/'],
    route: '/devops/01-dir',
  },
  {
    key: 'python',
    label: 'Python',
    matchPrefixes: ['/python/'],
    route: '/python/00-env',
  },
] as const;

export const GITHUB_USERNAME = 'DoubleXm';
export const GITHUB_PROFILE_URL = 'https://github.com/DoubleXm';
export const GITHUB_REPOSITORY_URL = 'https://github.com/DoubleXm/blog';
export const GITHUB_TOKEN_ENV = 'GITHUB_TOKEN';

const DAY_MS = 24 * 60 * 60 * 1000;
const LEVEL_MAP = {
  FIRST_QUARTILE: 1,
  FOURTH_QUARTILE: 4,
  NONE: 0,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
} as const;

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url));

function walkMarkdownFiles(directory: string) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const resolvedPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(resolvedPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(resolvedPath);
    }
  }

  return results;
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

function stripMarkdown(raw: string) {
  return raw
    .replace(/^---[\s\S]*?---\s*/u, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDateToDotNotation(value: number) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

function toPageUrl(filePath: string) {
  const relativePath = path.relative(sourceRoot, filePath).replace(/\\/g, '/');
  return `/${relativePath.replace(/\.md$/, '')}`;
}

export function getContentMetrics(): ContentMetricsData {
  const files = walkMarkdownFiles(sourceRoot);
  const articleUrls = files
    .map(toPageUrl)
    .filter((pageUrl) => pageUrl !== '/index');
  const countsByKey = Object.fromEntries(
    HOME_TOPIC_META.map((topic) => [topic.key, 0]),
  ) as Record<string, number>;

  articleLoop: for (const pageUrl of articleUrls) {
    for (const topic of HOME_TOPIC_META) {
      if (
        topic.matchPrefixes.some((prefix) => pageUrl === prefix || pageUrl.startsWith(prefix))
      ) {
        countsByKey[topic.key] += 1;
        continue articleLoop;
      }
    }
  }

  return {
    areaCount: Object.values(countsByKey).filter((count) => count > 0).length,
    countsByKey,
    totalArticles: articleUrls.length,
  };
}

export function getPageMetadataByRelativePath(): Record<string, PageMetadata> {
  const files = walkMarkdownFiles(sourceRoot);

  return Object.fromEntries(
    files.map((filePath) => {
      const relativePath = path.relative(sourceRoot, filePath).replace(/\\/g, '/');
      const source = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      const lastUpdatedMs = stats.mtimeMs;

      return [
        relativePath,
        {
          lastUpdated: formatDateToDotNotation(lastUpdatedMs),
          lastUpdatedMs,
          readMinutes: estimateReadMinutes(stripMarkdown(source)),
        },
      ];
    }),
  );
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function createTrackedDates() {
  const to = new Date();
  to.setUTCHours(0, 0, 0, 0);

  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 364);

  return { from, to };
}

function buildEmptyWeeks() {
  const { from } = createTrackedDates();
  const days: GitHubContributionDay[] = [];

  for (let offset = 0; offset < 365; offset += 1) {
    const currentDate = new Date(from.getTime() + offset * DAY_MS);
    days.push({
      contributionCount: 0,
      date: toIsoDate(currentDate),
      level: 0,
      weekday: currentDate.getUTCDay(),
    });
  }

  const weeks: GitHubContributionWeek[] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push({ contributionDays: days.slice(index, index + 7) });
  }

  return weeks;
}

function calculateStreaks(days: GitHubContributionDay[]) {
  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of days) {
    runningStreak = day.contributionCount > 0 ? runningStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, runningStreak);
  }

  let currentStreak = 0;
  let startIndex = days.length - 1;

  if (days[startIndex]?.contributionCount === 0) {
    startIndex -= 1;
  }

  for (let index = startIndex; index >= 0; index -= 1) {
    if (days[index].contributionCount === 0) {
      break;
    }

    currentStreak += 1;
  }

  return { currentStreak, longestStreak };
}

function buildFallbackGitHubContributions(note: string): GitHubContributionsData {
  return {
    activeDays: 0,
    currentStreak: 0,
    daysTracked: 365,
    longestStreak: 0,
    note,
    profileUrl: GITHUB_PROFILE_URL,
    source: 'fallback',
    totalContributions: 0,
    updatedAt: new Date().toISOString(),
    username: GITHUB_USERNAME,
    weeks: buildEmptyWeeks(),
  };
}

export async function getGitHubContributions(): Promise<GitHubContributionsData> {
  const token = process.env[GITHUB_TOKEN_ENV];

  if (!token) {
    return buildFallbackGitHubContributions(
      `未检测到 ${GITHUB_TOKEN_ENV}，当前展示为占位贡献图。`,
    );
  }

  try {
    const { from, to } = createTrackedDates();
    const response = await fetch('https://api.github.com/graphql', {
      body: JSON.stringify({
        query: `
          query($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      contributionLevel
                      date
                      weekday
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          from: from.toISOString(),
          login: GITHUB_USERNAME,
          to: to.toISOString(),
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'vitepress-blog-homepage',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as GitHubContributionResponse;

    if (payload.errors?.length) {
      throw new Error(
        payload.errors.map((error) => error.message).filter(Boolean).join('; '),
      );
    }

    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      throw new Error('GitHub contribution calendar is unavailable.');
    }

    const weeks = calendar.weeks.map((week) => ({
      contributionDays: week.contributionDays.map((day) => ({
        contributionCount: day.contributionCount,
        date: day.date,
        level: LEVEL_MAP[day.contributionLevel],
        weekday: day.weekday,
      })),
    }));

    const allDays = weeks.flatMap((week) => week.contributionDays);
    const { currentStreak, longestStreak } = calculateStreaks(allDays);

    return {
      activeDays: allDays.filter((day) => day.contributionCount > 0).length,
      currentStreak,
      daysTracked: allDays.length,
      longestStreak,
      note: null,
      profileUrl: GITHUB_PROFILE_URL,
      source: 'github',
      totalContributions: calendar.totalContributions,
      updatedAt: new Date().toISOString(),
      username: GITHUB_USERNAME,
      weeks,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown GitHub fetch error';
    console.warn(`[github-contributions] ${message}`);
    return buildFallbackGitHubContributions(`GitHub 数据读取失败：${message}`);
  }
}

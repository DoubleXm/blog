const cssColor = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge: [
    './src/**/*.{js,ts,vue,md}',
    './.vitepress/**/*.{js,ts,mts,vue,md}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          canvas: cssColor('--blog-color-canvas-rgb'),
          surface: cssColor('--blog-color-surface-base-rgb'),
          surfaceLow: cssColor('--blog-color-surface-low-rgb'),
          container: cssColor('--blog-color-surface-container-rgb'),
          high: cssColor('--blog-color-surface-high-rgb'),
          bright: cssColor('--blog-color-surface-bright-rgb'),
          text: cssColor('--blog-color-text-rgb'),
          secondary: cssColor('--blog-color-text-secondary-rgb'),
          muted: cssColor('--blog-color-text-muted-rgb'),
          primary: cssColor('--blog-color-primary-rgb'),
          primaryContainer: cssColor('--blog-color-primary-container-rgb'),
          tertiary: cssColor('--blog-color-tertiary-rgb'),
          outline: cssColor('--blog-color-outline-rgb'),
        },
        terminal: {
          bg: cssColor('--blog-color-surface-lowest-rgb'),
          panelLow: cssColor('--blog-color-surface-base-rgb'),
          panel: cssColor('--blog-color-surface-container-rgb'),
          panelHigh: cssColor('--blog-color-surface-high-rgb'),
          panelBright: cssColor('--blog-color-surface-bright-rgb'),
          text: cssColor('--blog-color-text-rgb'),
          secondary: cssColor('--blog-color-text-secondary-rgb'),
          muted: cssColor('--blog-color-text-muted-rgb'),
          primary: cssColor('--blog-color-primary-rgb'),
          accent: cssColor('--blog-color-primary-container-rgb'),
          tertiary: cssColor('--blog-color-tertiary-rgb'),
          outline: cssColor('--blog-color-outline-rgb'),
        },
      },
      fontFamily: {
        body: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        display: ['Space Grotesk', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        terminal: '0 0 18px rgb(var(--blog-color-primary-rgb) / 0.12)',
        'terminal-card': '0 18px 36px rgb(0 0 0 / 0.18)',
        'terminal-card-hover': '0 24px 52px rgb(0 0 0 / 0.26)',
      },
      letterSpacing: {
        terminal: '0.18em',
      },
    },
  },
  plugins: [],
  content: [
    "./src/**/*.js",
    "./src/**/*.ts",
    "./src/**/*.vue",
    "./src/**/*.md",
  ],
  options: {
    safelist: ["html", "body"],
  },
};

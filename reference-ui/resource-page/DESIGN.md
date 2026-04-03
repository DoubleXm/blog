# Design System Document

## 1. Overview & Creative North Star: "The Terminal Authority"

This design system is engineered for the high-level programmer—moving away from the "cluttered dashboard" trope and toward a "High-End Editorial Terminal." The Creative North Star is **The Terminal Authority**: a marriage between the raw, functional power of a command-line interface and the sophisticated layout of a premium digital journal.

We break the "standard template" look through **Intentional Asymmetry**. Metadata and code snippets should feel like they are floating in an obsidian void, anchored by high-contrast neon accents. By utilizing a mix of ultra-modern typography and glassmorphism, we create a sense of depth that feels like looking into a high-end HUD (Heads-Up Display) rather than a flat web page.

---

## 2. Colors: Obsidian & Neon Precision

The palette is rooted in deep space blacks, using neon accents not as mere "colors," but as light sources.

### Core Tokens
- **Background/Surface:** `#0e0e0e` (Surface) and `#000000` (Surface-Container-Lowest). This provides the "Obsidian" foundation.
- **Primary (The Glow):** `#f3ffca` (Primary) scaling into `#cafd00` (Cyber Lime). Use this for critical actions and focal points.
- **Secondary (The Matrix):** `#00fc40` (Secondary). Reserved for success states, code syntax highlights, and active terminal indicators.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for layout sectioning. Boundaries must be defined through **Background Color Shifts**. 
- To separate a sidebar from a main feed, use a transition from `surface` to `surface-container-low`.
- For content cards, use `surface-container-high` to create a natural "lift" against the `surface` background without a single line of CSS border.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of smoked glass.
- **Level 0 (Foundation):** `surface` (#0e0e0e)
- **Level 1 (Subtle Inset):** `surface-container-low` (#131313) - Use for large background regions.
- **Level 2 (The Card):** `surface-container-high` (#201f1f) - Use for floating content blocks.
- **Level 3 (The Interaction):** `surface-container-highest` (#262626) - Use for hover states and active UI elements.

### Signature Textures
- **The Glass Rule:** Use `backdrop-blur: 12px` combined with a semi-transparent `surface-variant` (20-40% opacity) for navigation bars and floating modals.
- **The Glow:** Apply a `0 0 15px` box-shadow using the `primary` color at 30% opacity for main CTAs to simulate a neon hardware light.

---

## 3. Typography: Editorial Logic

The typography system prioritizes the "Developer-Writer." It balances the high-tech precision of **Space Grotesk** for displays with the hyper-readability of **Inter** for long-form Chinese and English prose.

- **Display & Headlines (Space Grotesk):** These should be treated as architectural elements. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for a bold, authoritative tech-header feel.
- **Body Text (Inter / PingFang SC / Microsoft YaHei):** Optimized for technical reading. English and Chinese text must coexist harmoniously. Set `body-lg` at 1rem with a 1.6 line-height to ensure comfort during deep-dive technical tutorials.
- **Metadata & Code (JetBrains Mono / Fira Code):** Use for `label-md` and all code snippets. This monospace font acts as the "Geek" signature of the system, providing a secondary visual layer that signals technical expertise.

---

## 4. Elevation & Depth: Tonal Layering

We reject drop shadows that look like "fuzz." Elevation in this system is achieved through light and material density.

- **The Layering Principle:** Depth is a staircase of color. A `surface-container-highest` card sitting on a `surface` background creates an optical lift. 
- **Ambient Shadows:** When a true "floating" element (like a dropdown) is required, use a 32px blur with the shadow color set to `surface-tint` at 5% opacity. It should feel like an ambient glow, not a dark smudge.
- **The Ghost Border:** For high-density components where separation is critical (e.g., code blocks), use the `outline-variant` (#494847) at **15% opacity**. This creates a "hairline" suggestion of a border that feels modern and precise.
- **Grid-Based Patterns:** On `surface-container-lowest` areas, implement a subtle 24px grid pattern using `outline-variant` at 5% opacity to evoke a blueprint or terminal background.

---

## 5. Components

### Buttons
- **Primary:** `primary-container` (#cafd00) background with `on-primary-container` (#4a5e00) text. Sharp 4px corners. State: On hover, add a `primary` outer glow.
- **Tertiary (Ghost):** No background, `primary` text. On hover, background becomes `surface-container-highest`.

### Input Fields
- **Base:** `surface-container-high` background. No border, only a 2px `primary` bottom-bar that "activates" (scales from center) on focus.
- **Text:** `on-surface` for input, `on-surface-variant` for placeholders.

### Cards & Code Blocks
- **The "No-Divider" Rule:** Never use a horizontal rule `<hr>` to separate list items. Use 24px of vertical whitespace or a transition to `surface-container-low`.
- **Code Snippets:** Use a `surface-container-lowest` (#000000) background to create a "black hole" effect that makes syntax highlighting pop. Apply a `0.5rem` (lg) corner radius.

### Navigation
- **Top Bar:** Glassmorphic (`backdrop-blur`) using `surface` at 70% opacity. 
- **Active State:** Instead of an underline, use a small `primary` colored dot or a "Matrix Green" (#00ff41) `secondary` highlight on the monospace label.

---

## 6. Do's and Don'ts

### Do
- **Do** lean into white space. Technical content is dense; the UI shouldn't be.
- **Do** use `primary` (Cyber Lime) sparingly. It is a "laser pointer," not a paint brush.
- **Do** ensure that Chinese characters have sufficient line-height (minimum 1.5) to maintain legibility against the dark background.

### Don't
- **Don't** use 100% white (#ffffff) for long-form body text. Use `on-surface-variant` (#adaaaa) for secondary text to reduce eye strain on dark OLED screens.
- **Don't** use generic "Material Design" rounded corners (above 8px). Keep corners between 4px and 8px to maintain a "hardware" feel.
- **Don't** use standard blue for links. All interactive elements must stay within the `primary` (lime) or `secondary` (green) spectrum.
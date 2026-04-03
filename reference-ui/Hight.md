# Design System: Technical Editorial & Light-Mode Precision

## 1. Overview & Creative North Star
**Creative North Star: "The Analog Architect"**

This design system is a sophisticated translation of terminal aesthetics into a high-end, editorial light-mode experience. We are moving away from the "hacker in a basement" dark-mode trope toward the "architect of systems"—think high-end technical journals, architectural blueprints, and precision-engineered documentation.

The system breaks the "bootstrap template" look by utilizing **intentional asymmetry** and **brutalist precision**. We replace traditional UI "fluff" with raw structural hierarchy. Every pixel must feel calculated; every element must serve a functional purpose. We leverage the tension between the geometric rigidity of *Space Grotesk* and the monospace pragmatism of *JetBrains Mono* to create a layout that feels both authored and automated.

---

## 2. Colors: Tonal Rigor
The palette is built on a foundation of "Off-White High-Contrast." We avoid pure white to reduce eye strain, opting instead for a clinical, gallery-like `#f8f9fa`.

### Color Strategy
- **Primary (`#00478d`):** Our "Technical Blue." It is sharp, authoritative, and high-contrast. Use this for moments of high intent.
- **Tertiary (`#793100`):** A "Burnished Copper" used for technical warnings or syntax-related highlights that require a warmer, human touch.
- **The "No-Line" Rule:** Standard 1px borders are largely prohibited for sectioning. We define boundaries through **surface-tier shifts**. A side panel should not be separated by a line, but by a transition from `surface` to `surface-container-low`.
- **Surface Hierarchy & Nesting:** Treat the UI as a physical stack of technical paper.
    - **Base:** `surface` (#f8f9fa)
    - **Floating Elements:** `surface-container-lowest` (#ffffff) for maximum "lift."
    - **Inset Logic:** Use `surface-container-high` (#e7e8e9) for nested technical blocks or code snippets to create a "recessed" feel.

---

## 3. Typography: The Editorial Monospace
Typography is the core of the "Geek" aesthetic. We pair a modern sans-serif with a high-performance monospace to bridge the gap between design and development.

- **Display & Headlines (Space Grotesk):** These should be treated as structural elements. Use `display-lg` for impactful entry points. The tight tracking and geometric terminals of Space Grotesk should feel "engineered."
- **Technical Elements (JetBrains Mono):** *Note: In this implementation, we utilize JetBrains Mono for all "Label" and "Technical Body" instances to maintain the programmer focus.*
- **Body (Inter):** We use Inter for long-form reading (`body-lg`) because technical legibility is paramount. It provides a neutral ground between the loud headlines and the data-heavy monospace elements.

---

## 4. Elevation & Depth: Tonal Layering
We reject the heavy drop shadows of the early 2010s. Depth is achieved through light physics and material density.

- **The Layering Principle:** Instead of shadows, use background nesting. Place a `surface-container-lowest` card atop a `surface-container` background. The subtle delta in hex value creates a "soft lift."
- **Ambient Shadows:** For floating menus or modals, use a "Ghost Shadow."
    - **Value:** `0px 12px 32px rgba(25, 28, 29, 0.06)`
    - This creates an atmospheric blur that feels like natural light hitting a matte surface, rather than a digital glow.
- **The "Ghost Border" Fallback:** If a technical boundary is required (e.g., a code editor window), use the `outline-variant` (#c2c6d4) at **15% opacity**. It should be barely visible—a suggestion of an edge, not a cage.
- **Glassmorphism:** Use `surface` with 80% opacity and a `20px` backdrop-blur for technical overlays to keep the user grounded in the "system" beneath.

---

## 5. Components: Precision Engineered
All components follow a **0px Border Radius** (Sharp Square). Roundness is for consumers; sharp edges are for creators.

### Buttons
- **Primary:** Background: `primary` (#00478d) | Text: `on-primary` (#ffffff). No shadow. On hover, shift to `primary_container`. 
- **Secondary:** Background: `transparent` | Border: 1px `outline` (#727783) | Text: `primary`.
- **Tertiary (The "Command" Button):** Use `JetBrains Mono` for the label to make it look like a CLI command.

### Input Fields
- **Design:** Use a bottom-only border (2px) of `outline-variant` in the idle state. 
- **Focus State:** Transition the border to `primary`. Labels should use `label-sm` (Space Grotesk) in uppercase for an "Engineering Form" feel.

### Cards & Technical Containers
- **Rule:** Forbid divider lines within cards.
- **Separation:** Use 24px or 32px of vertical white space to separate content groups. If separation is needed, use a subtle background shift to `surface-container-low`.

### Technical Chips
- **Selection Chips:** Sharp squares. Background: `secondary_container` (#c0d5ff). Use `JetBrains Mono` at `label-sm` sizing.

---

## 6. Do’s and Don’ts

### Do:
- **Use "Data-Density":** Don't be afraid of whitespace, but ensure information is presented with high precision (e.g., using `label-sm` for metadata).
- **Align to a Rigid Grid:** Every element should snap to an 8px grid. Asymmetry should be intentional (e.g., a massive headline offset against a tiny technical label).
- **Highlight with Purpose:** Use `primary` sparingly. If everything is blue, nothing is technical.

### Don't:
- **Don't Use Rounded Corners:** This design system is built on "0px" philosophy. Rounding corners "softens" the technical edge we are trying to maintain.
- **Don't Use 1px Solid Borders for Layout:** Use background color shifts. If you find yourself reaching for a `#CCCCCC` border, use a `surface-container` fill instead.
- **Don't Use Neon Glows:** This is a light-mode, professional system. We replace "glow" with "tonal depth."

---

## 7. Signature Element: The "Status Indicator"
To maintain the programmer-focused aesthetic, every major section or card should include a "Status Indicator" in the top right corner using `label-sm` (JetBrains Mono). 
- **Example:** `[ STATUS: STABLE ]` or `[ VERSION: 1.0.4 ]`.
- This reinforces the "Terminal" heritage of the design system while remaining clean and professional.
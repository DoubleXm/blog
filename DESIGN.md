```markdown
# Design System Specification: The Cybernetic Library

## 1. Overview & Creative North Star
The "Cybernetic Library" represents the intersection of infinite data and monastic focus. This design system is not a mere "dark mode" interface; it is a high-precision instrument designed for the curation of complex information. It rejects the "bubbly" trends of consumer web design in favor of a structural, editorial aesthetic that feels both ancient and futuristic.

### The Creative North Star: The Cybernetic Library
Imagine a sanctuary of knowledge carved from obsidian, illuminated by the precise glow of a terminal.
*   **Intentional Asymmetry:** Avoid perfectly centered, "safe" layouts. Use wide margins and offset headers to create a sense of architectural space.
*   **Tonal Depth:** We do not use "gray." We use varying densities of darkness.
*   **The Technical Edge:** Every element must look engineered. Thin lines, monospace data points, and sharp corners suggest a system that is calibrated, not just "drawn."

---

## 2. Colors & Surface Architecture
The palette is rooted in absolute zero (`#000000`), using the "Electric Blue" accent as a surgical tool for focus.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. They clutter the interface and break the "library" immersion. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` (#131313) to `surface-container-low` (#1b1b1b).
2.  **Negative Space:** Using the spacing scale to create clear "voids" between functional areas.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical, light-absorbing layers.
*   **Base:** `surface` (#131313) or `surface-container-lowest` (#0e0e0e) for the deep background.
*   **Cards/Panels:** Use `surface-container` (#1f1f1f) to create a subtle lift.
*   **Active/Elevated Elements:** Use `surface-bright` (#393939) for transient panels.

### The "Glass & Glow" Rule
To achieve the "Cybernetic" feel, use Glassmorphism for floating overlays (e.g., Command Palettes, Tooltips). Use the `primary` color (#adc6ff) at 5-10% opacity with a `20px` backdrop blur. 
*   **Signature Texture:** Apply a `1px` inner glow (box-shadow: inset 0 0 4px) using `primary` at 20% opacity to "charged" containers.

---

## 3. Typography
A tri-font system that separates the "System," the "Data," and the "Narrative."

*   **Display & Headlines (Space Grotesk):** Our structural voice. Set with tight letter-spacing (-0.02em) to feel like architectural signage. Use `display-lg` for high-impact editorial moments.
*   **Technical Data (JetBrains Mono):** Used for metadata, labels, and code. This conveys precision. When a user sees JetBrains Mono, they are looking at "The Truth" of the data.
*   **Body & Narrative (Inter):** For long-form reading. Inter provides a neutral, highly legible contrast to the technical sharpness of the other two faces.

---

## 4. Elevation & Depth
In a pure black environment, traditional shadows are invisible. Depth is achieved through **Tonal Layering.**

### The Layering Principle
Stacking containers creates a "stepped" hierarchy. 
*   **Example:** A `surface-container-high` (#2a2a2a) modal should sit on a `surface-dim` (#131313) overlay.

### Ambient Glows
Instead of shadows, use "Light Leaks." For high-priority floating elements, apply a very large, soft blur (60px+) of `primary` (#adc6ff) at 3-5% opacity *behind* the element. This mimics the glow of a screen in a dark room.

### The "Ghost Border" Fallback
If a container requires a stroke for accessibility (e.g., Input Fields), use the "Ghost Border" method:
*   **Token:** `outline-variant` (#424754)
*   **Execution:** 1px width at 20% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary_container` (#4d8eff) with `on_primary_container` (#00285d) text. Sharp corners (`none` or `sm`).
*   **Secondary (The Neon-Link):** Ghost button with `1px` border of `primary` (#adc6ff). Upon hover, add a subtle `box-shadow` blue glow.
*   **Tertiary:** JetBrains Mono text in `primary`. No container. Use `>` as a trailing icon.

### Input Fields
*   **State:** Background is `surface-container-lowest`. Bottom-only border using `outline` (#8c909f) at 30% opacity. 
*   **Focus:** Border transitions to `primary` (#adc6ff) with a subtle `2px` outer glow. Label shifts to JetBrains Mono in `primary`.

### Cards & Lists
*   **No Dividers:** Separate list items with 12px of vertical space or a 2% color shift on hover. 
*   **Content:** Headlines in Space Grotesk, metadata (tags, dates) in JetBrains Mono at `label-sm`.

### Cybernetic Chips
*   **Visual:** Rectangular (`none` roundness). Background `primary` at 10% opacity. Border 1px `primary` at 30%. Text: JetBrains Mono.

---

## 6. Do's and Don'ts

### Do
*   **Use Verticality:** Lean into tall, slim columns that mimic a library's stacks.
*   **Embrace the Dark:** Allow large areas of `#000000` to exist. It provides the "visual silence" required for high-tech focus.
*   **Technical Accents:** Use `tertiary` (#ffb786) sparingly for "Warning" or "Critical Data" states—it provides a warm, analog contrast to the Electric Blue.

### Don't
*   **No Rounding:** Never use `xl` or `full` roundness. This system is precise and architectural; rounded corners feel too "approachable" and soft.
*   **No Gradients (Standard):** Avoid multi-color rainbow gradients. If using a gradient, stay within the blue monochromatic range (e.g., `primary` to `primary_container`).
*   **No Heavy Borders:** Never use an opaque `1px` white border. It shatters the high-end dark aesthetic and creates "visual noise."

---

## 7. Signature Layout Patterns
*   **The "Data Header":** A `headline-lg` title in Space Grotesk, paired with a small block of JetBrains Mono metadata (e.g., `SCAN_ID: 00429`) positioned in the top right of the container.
*   **The Offset Grid:** Align body text to a 12-column grid, but allow Display headings to "break" the grid and bleed into the left margin. This creates a bespoke, editorial feel that distinguishes the system from a template.```
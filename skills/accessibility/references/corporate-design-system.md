# Corporate Design System

AAA-compliant design tokens and patterns for corporate/formal web applications. All values are provided as CSS custom properties for framework-agnostic use.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing and Layout](#spacing-and-layout)
4. [Component Patterns](#component-patterns)
5. [Tone and Language](#tone-and-language)

---

## Color System

All color pairings below meet WCAG 2.2 AAA contrast requirements (7:1 for normal text, 4.5:1 for large text).

### Default Corporate Palette

These are sensible defaults. When the user provides brand colors, verify all pairings meet AAA ratios using the `check_contrast.py` script.

| Token | Value | Usage | Contrast vs White | Contrast vs Dark |
|-------|-------|-------|-------------------|------------------|
| `--color-primary` | `#1a365d` | Primary actions, headings | 12.6:1 | -- |
| `--color-primary-dark` | `#0f2440` | Hover states on primary | 15.4:1 | -- |
| `--color-secondary` | `#2d5016` | Secondary actions, accents | 8.5:1 | -- |
| `--color-secondary-dark` | `#1e3a0f` | Hover states on secondary | 11.2:1 | -- |
| `--color-text` | `#1a1a1a` | Body text | 17.2:1 | -- |
| `--color-text-muted` | `#3d3d3d` | Secondary text | 11.7:1 | -- |
| `--color-bg` | `#ffffff` | Page background | -- | -- |
| `--color-bg-alt` | `#f5f5f5` | Alternate sections | -- | -- |
| `--color-border` | `#4a4a4a` | Borders, dividers | 9.7:1 vs white | -- |
| `--color-error` | `#8b0000` | Error states | 9.4:1 | -- |
| `--color-success` | `#1a5c1a` | Success states | 8.1:1 | -- |
| `--color-warning` | `#6b4c00` | Warning states | 8.9:1 | -- |
| `--color-focus` | `#0050a0` | Focus indicators | 7.3:1 | -- |

### Contrast Verification Rules

Before using any color pairing, verify:
- Normal text (<18pt): contrast ratio >= 7:1
- Large text (>=18pt or >=14pt bold): contrast ratio >= 4.5:1
- UI components and graphical objects: contrast ratio >= 3:1
- Focus indicators: contrast ratio >= 3:1 against adjacent colors

Run `python3 scripts/check_contrast.py <fg_hex> <bg_hex>` to verify any pairing.

---

## Typography

### Font Stack

Use system fonts for performance and accessibility. Avoid decorative or thin-weight fonts.

```css
:root {
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --font-heading: var(--font-body);
  --font-mono: "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono",
    "Courier New", monospace;
}
```

### Type Scale

Use `rem` units exclusively. Base size: `1rem` = `16px`.

| Token | Size | Weight | Line-Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 0.75rem (12px) | 400 | 1.667 | Fine print, captions |
| `--text-sm` | 0.875rem (14px) | 400 | 1.571 | Secondary text, labels |
| `--text-base` | 1rem (16px) | 400 | 1.625 | Body text |
| `--text-lg` | 1.125rem (18px) | 400 | 1.556 | Lead paragraphs |
| `--text-xl` | 1.25rem (20px) | 600 | 1.5 | H4 |
| `--text-2xl` | 1.5rem (24px) | 700 | 1.5 | H3 |
| `--text-3xl` | 1.875rem (30px) | 700 | 1.5 | H2 |
| `--text-4xl` | 2.25rem (36px) | 700 | 1.5 | H1 |

### AAA Typography Rules (1.4.8)

- Maximum line width: 80 characters (`max-width: 80ch` on text containers)
- Text alignment: `text-align: start` (never `justify`)
- Line height: minimum 1.5x font size (`line-height: 1.5` or greater)
- Paragraph spacing: minimum 2x font size (`margin-block-end` >= 2em)
- Letter spacing: must tolerate user override to 0.12em without breaking
- Word spacing: must tolerate user override to 0.16em without breaking

---

## Spacing and Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight internal spacing |
| `--space-2` | 0.5rem (8px) | Compact element spacing |
| `--space-3` | 0.75rem (12px) | Default internal padding |
| `--space-4` | 1rem (16px) | Standard element spacing |
| `--space-5` | 1.5rem (24px) | Section internal padding |
| `--space-6` | 2rem (32px) | Section separation |
| `--space-8` | 3rem (48px) | Major section separation |
| `--space-10` | 4rem (64px) | Page-level separation |
| `--space-12` | 6rem (96px) | Hero/banner spacing |

### Layout Rules

- Use CSS Grid for page-level layout; Flexbox for component-level alignment
- Maintain consistent gutters: `--space-4` (sm), `--space-5` (md), `--space-6` (lg)
- Content containers: `max-width` with `margin-inline: auto` for centering
- Never use `position: fixed` for content that obscures focused elements (2.4.12)

---

## Component States

### Focus State (2.4.13)

All interactive elements must have a highly visible focus state. The default in `tokens.css` is a 3px solid outline with a 2px offset.

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Disabled State

Avoid disabling buttons and inputs where possible. It is often more accessible to leave them enabled and show an error on interaction. If you must disable an element, use `aria-disabled="true"` instead of the `disabled` attribute for elements that are not focusable by default. This keeps them in the tab order so screen reader users are aware of them.

```css
[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## Component Patterns

### Buttons

```css
.btn {
  min-height: var(--target-size-min);
  min-width: var(--target-size-min);
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  line-height: var(--leading-heading);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.btn:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Form Controls

```css
.form-control {
  min-height: var(--target-size-min);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  line-height: var(--leading-heading);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  color: var(--color-text);
  width: 100%;
}

.form-control:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
  border-color: var(--color-focus);
}

.form-label {
  display: block;
  font-weight: var(--font-semibold);
  margin-block-end: var(--space-2);
  color: var(--color-text);
}

.form-error {
  color: var(--color-error);
  font-size: var(--text-sm);
  margin-block-start: var(--space-1);
}
```

### Links

```css
a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

a:hover {
  color: var(--color-primary-dark);
}

a:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

Always use underlines on links. Never rely on color alone to distinguish links from surrounding text (1.4.1).

---

## Internationalization & Layout

### CSS Logical Properties

Use logical properties (`margin-inline-start`, `padding-inline-end`, `border-block-start`) instead of directional properties (`margin-left`, `padding-right`, `border-top`) to support right-to-left (RTL) and vertical writing modes automatically.

| Directional | Logical (LTR) | Logical (RTL) |
|-------------|-----------------|---------------|
| `margin-left` | `margin-inline-start` | `margin-right` |
| `padding-right` | `padding-inline-end` | `padding-left` |
| `border-top` | `border-block-start` | `border-top` |

### Fluid Typography

Use `clamp()` for font sizes to create fluid typography that scales smoothly with the viewport, improving readability on all screen sizes.

```css
/* Example for H1 */
h1 {
  font-size: clamp(1.8rem, 1.5rem + 2vw, 2.25rem);
}
```

---

## Tone and Language

### Corporate/Formal Writing Rules

- No emoji in any user-facing text
- Use complete sentences with proper punctuation
- Use formal vocabulary; avoid slang, colloquialisms, and contractions
- Use title case for headings and navigation labels
- Use sentence case for body text and descriptions
- Provide definitions for technical terms and abbreviations (3.1.3, 3.1.4)
- Write at a clear, professional reading level; provide summaries for complex content (3.1.5)
- Use structured layouts: headings, tables, and ordered lists to organize information
- Every page section must have a descriptive heading (2.4.10)

---

## Visual Hierarchy & Information Density

In corporate design, the goal is a clear, scannable path through dense information. This is achieved by minimizing unnecessary variation and using space deliberately.

### Visual Hierarchy Rules

- **Limit Type Sizes**: Use no more than 4 distinct sizes for headings and body text to create a clear hierarchy without clutter.
- **Limit Colors**: Adhere to a strict color palette (e.g., 2 primary, 2 secondary colors) to maintain a formal tone.
- **Limit Contrast Levels**: Use no more than 3 levels of text contrast (e.g., primary, secondary, disabled) to guide the user's attention.

### Information Density

Enterprise users often need to see a lot of data at once. The design must support this without becoming overwhelming. Provide controls to adjust density where appropriate (e.g., in data tables).

| Density | Use Case |
|---|---|
| **Compact** | For power users and data-heavy screens where maximizing visible data is critical. Uses smaller spacing and tighter layouts. |
| **Comfortable** | The default for most applications. A balance between information density and readability. |
| **Spacious** | For applications that are less data-intensive or will be used on touch devices. Uses generous spacing. |

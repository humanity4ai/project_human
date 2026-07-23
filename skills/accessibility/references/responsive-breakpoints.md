# Responsive Design Patterns

Device-sensitive design patterns for WCAG AAA compliant web applications. All breakpoints use mobile-first methodology with `min-width` media queries.

## Table of Contents

1. [Breakpoint System](#breakpoint-system)
2. [Layout Patterns by Breakpoint](#layout-patterns-by-breakpoint)
3. [AAA-Specific Responsive Considerations](#aaa-specific-responsive-considerations)
4. [Touch Target Sizing](#touch-target-sizing)

---

## Breakpoint System

Three required breakpoints (minimum), with two optional enhancements:

| Token | Range | Target Devices | CSS Variable |
|-------|-------|----------------|--------------|
| `sm` | 0 -- 767px | Phones (portrait/landscape) | `--bp-sm: 0px` |
| `md` | 768px -- 1023px | Tablets, small laptops | `--bp-md: 768px` |
| `lg` | 1024px+ | Desktops, large screens | `--bp-lg: 1024px` |
| `xl` (optional) | 1280px+ | Wide desktops | `--bp-xl: 1280px` |
| `xxl` (optional) | 1536px+ | Ultra-wide displays | `--bp-xxl: 1536px` |

### CSS Custom Properties (Framework-Agnostic)

```css
:root {
  --bp-sm: 0px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-xxl: 1536px;
}

/* Mobile-first: base styles apply to sm */
/* md and up */
@media (min-width: 768px) { }
/* lg and up */
@media (min-width: 1024px) { }
/* xl and up (optional) */
@media (min-width: 1280px) { }
```

### Container Width Strategy

| Breakpoint | Container Max-Width | Side Padding |
|------------|-------------------|--------------|
| sm | 100% | 16px (1rem) |
| md | 720px | 24px (1.5rem) |
| lg | 960px | 32px (2rem) |
| xl | 1140px | 32px (2rem) |
| xxl | 1320px | 32px (2rem) |

Enforce `max-width: 80ch` on text blocks to satisfy WCAG 1.4.8 (max 80 characters per line).

---

## Layout Patterns by Breakpoint

### Header/Navigation

| Breakpoint | Pattern |
|------------|---------|
| sm | Hamburger menu with off-canvas panel; logo left-aligned; essential actions visible |
| md | Condensed horizontal nav or priority+ pattern; logo + primary links visible |
| lg+ | Full horizontal navigation; logo + all nav items + utility links |

Navigation must be keyboard-operable at all breakpoints. Hamburger toggle must have `aria-expanded`, `aria-controls`, and `aria-label`.

### Content Grid

| Breakpoint | Columns | Gutter |
|------------|---------|--------|
| sm | 1 column (stacked) | 16px |
| md | 2 columns | 24px |
| lg | 3--4 columns | 32px |

Use CSS Grid or Flexbox. Never use `float`-based layouts. Grid areas must maintain logical reading order in DOM regardless of visual placement.

### Footer

| Breakpoint | Pattern |
|------------|---------|
| sm | Single column, stacked sections, full-width links (44px min-height) |
| md | 2-column grid for link groups |
| lg+ | Multi-column layout with all sections visible |

---

## AAA-Specific Responsive Considerations

### Reflow (1.4.10)
Content must reflow without horizontal scrolling at 320px CSS width (equivalent to 400% zoom on a 1280px viewport). Test by setting browser width to 320px.

### Text Resize (1.4.4)
All text must remain readable and functional at 200% browser zoom. Use `rem` or `em` units for font sizes, never `px` for body text.

### Orientation (1.3.4)
Never lock orientation. Content must function in both portrait and landscape. Test both orientations at every breakpoint.

### Touch Targets (2.5.5 AAA)
All interactive elements must be at least 44x44 CSS pixels at every breakpoint. This is especially critical on sm/md breakpoints where touch is primary input.

### Spacing for Touch (AAA)
Minimum 8px gap between adjacent interactive elements to prevent accidental activation.

---

## Modern CSS Layout

### Container Queries

Use container queries to create components that respond to the width of their container, not just the viewport. This makes components more modular and reusable.

```css
.card-container {
  container-type: inline-size;
}

/* Styles apply when the container is > 400px wide */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Fluid Spacing

Use `clamp()` for padding and margins to create fluid spacing that adapts to the viewport, preventing overly large or small gaps.

```css
.section {
  padding-block: clamp(2rem, 1rem + 5vw, 6rem);
}
```

---

## Touch Target Sizing

### Minimum Dimensions by Element Type

| Element | Min Width | Min Height | Notes |
|---------|-----------|------------|-------|
| Buttons | 44px | 44px | Includes padding |
| Links (inline) | N/A | 44px line-height | Ensure sufficient vertical space |
| Links (nav/list) | 44px | 44px | Full clickable area |
| Form inputs | 100% (sm) | 44px | Full-width on mobile |
| Checkboxes/radios | 44px | 44px | Use padding or label click area |
| Icon buttons | 44px | 44px | Touch area may exceed visual icon |

### Implementation Pattern

```css
/* Ensure all interactive elements meet AAA target size */
button,
[role="button"],
input[type="submit"],
input[type="reset"],
input[type="button"],
select,
a:not([class*="inline"]) {
  min-height: 44px;
  min-width: 44px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"],
input[type="tel"],
input[type="url"],
input[type="number"],
textarea,
select {
  min-height: 44px;
  padding: 0.5rem 0.75rem;
}
```

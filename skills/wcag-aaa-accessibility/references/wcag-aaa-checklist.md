# WCAG 2.2 AAA Success Criteria Checklist

This reference covers all 87 WCAG 2.2 success criteria (A + AA + AAA cumulative) organized by the four POUR principles. Use this as a design-time and review-time checklist.

## Table of Contents

1. [Perceivable (28 Criteria)](#perceivable)
2. [Operable (29 Criteria)](#operable)
3. [Understandable (17 Criteria)](#understandable)
4. [Robust (2 Criteria)](#robust)
5. [AAA-Specific Design Implications](#aaa-specific-design-implications)

---

## Perceivable

### 1.1 Text Alternatives

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 1.1.1 | A | Text alternatives for non-text content | Every `<img>` has descriptive `alt`; decorative images use `alt=""`; complex images have long descriptions |

### 1.2 Time-Based Media

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 1.2.1 | A | Alternatives for prerecorded audio/video | Provide transcript or text alternative |
| 1.2.2 | A | Captions for prerecorded audio in video | Synchronized captions for all video |
| 1.2.3 | A | Audio description or media alternative | Audio description track or full text alternative |
| 1.2.4 | AA | Captions for live audio | Real-time captions for live streams |
| 1.2.5 | AA | Audio description for prerecorded video | Narrated description of visual content |
| 1.2.6 | AAA | Sign language for prerecorded content | Embedded sign language interpretation |
| 1.2.7 | AAA | Extended audio description | Pause video to insert descriptions when gaps are insufficient |
| 1.2.8 | AAA | Full text alternative for prerecorded media | Complete text transcript of all audio and visual information |
| 1.2.9 | AAA | Alternative for live audio-only | Real-time text alternative for live audio |

### 1.3 Adaptable

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 1.3.1 | A | Info and relationships in code | Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<section>`); proper heading hierarchy; `<table>` with `<th>` and `scope` |
| 1.3.2 | A | Meaningful sequence | DOM order matches visual order; CSS does not reorder content in ways that break reading sequence |
| 1.3.3 | A | Sensory characteristics | Never rely solely on shape, color, size, position, or sound to convey information |
| 1.3.4 | AA | Orientation | Content not restricted to portrait or landscape; use flexible layouts |
| 1.3.5 | AA | Identify input purpose | Use `autocomplete` attributes on form fields for personal data |
| 1.3.6 | AAA | Identify purpose | Use ARIA landmarks, `role` attributes, and microdata to identify UI component purpose |

### 1.4 Distinguishable

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 1.4.1 | A | Use of color | Never use color as the sole indicator; pair with text, icons, or patterns |
| 1.4.2 | A | Audio control | Auto-playing audio has pause/stop/mute within first 3 seconds |
| 1.4.3 | AA | Contrast minimum | 4.5:1 for normal text, 3:1 for large text (>=18pt or >=14pt bold) |
| 1.4.4 | AA | Resize text | Text resizable to 200% without loss of content or function |
| 1.4.5 | AA | Images of text | Use real text, not images of text (except logos) |
| 1.4.6 | **AAA** | **Contrast enhanced** | **7:1 for normal text, 4.5:1 for large text** |
| 1.4.7 | AAA | Low/no background audio | Speech recordings: background >=20dB quieter, or no background, or toggle |
| 1.4.8 | **AAA** | **Visual presentation** | **User-selectable foreground/background colors; max 80 chars/line; no justified text; line-height >=1.5; paragraph spacing >=2x line-height; text resizable to 200%** |
| 1.4.9 | AAA | Images of text (no exception) | Only use images of text for pure decoration or where essential |
| 1.4.10 | AA | Reflow | No horizontal scroll at 320px CSS width (400% zoom) |
| 1.4.11 | AA | Non-text contrast | UI components and graphical objects have 3:1 contrast |
| 1.4.12 | AA | Text spacing | No loss of content when: line-height >=1.5x, paragraph spacing >=2x, letter-spacing >=0.12em, word-spacing >=0.16em |
| 1.4.13 | AA | Content on hover/focus | Hoverable, dismissable, persistent tooltips/popovers |

---

## Operable

### 2.1 Keyboard Accessible

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 2.1.1 | A | Keyboard | All functionality operable via keyboard |
| 2.1.2 | A | No keyboard trap | Focus can always be moved away from any component |
| 2.1.3 | AAA | Keyboard (no exception) | ALL functionality via keyboard with zero exceptions |
| 2.1.4 | A | Character key shortcuts | Single-character shortcuts can be remapped or disabled |

### 2.2 Enough Time

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 2.2.1 | A | Timing adjustable | Time limits can be turned off, adjusted, or extended |
| 2.2.2 | A | Pause, stop, hide | Moving/blinking/scrolling content has pause/stop/hide controls |
| 2.2.3 | AAA | No timing | No time limits at all (except real-time events) |
| 2.2.4 | AAA | Interruptions | All non-emergency interruptions can be postponed or suppressed |
| 2.2.5 | AAA | Re-authenticating | Data preserved when session expires and user re-authenticates |
| 2.2.6 | AAA | Timeouts | Warn users about inactivity timeouts that cause data loss |

### 2.3 Seizures and Physical Reactions

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 2.3.1 | A | Three flashes or below threshold | No content flashes >3 times/second |
| 2.3.2 | AAA | Three flashes | No content flashes >3 times/second (no exceptions) |
| 2.3.3 | AAA | Animation from interactions | Motion animation triggered by interaction can be disabled; respect `prefers-reduced-motion` |

### 2.4 Navigable

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 2.4.1 | A | Bypass blocks | Skip-to-content link; ARIA landmarks |
| 2.4.2 | A | Page titled | Descriptive, unique `<title>` per page |
| 2.4.3 | A | Focus order | Tab order follows logical reading order |
| 2.4.4 | A | Link purpose (in context) | Link text + context makes purpose clear |
| 2.4.5 | AA | Multiple ways | At least two ways to find pages (nav, search, sitemap) |
| 2.4.6 | AA | Headings and labels | Headings and labels describe topic/purpose |
| 2.4.7 | AA | Focus visible | Keyboard focus indicator is visible |
| 2.4.8 | AAA | Location | Breadcrumbs or other location indicator |
| 2.4.9 | AAA | Link purpose (link only) | Link text alone makes purpose clear (no "click here") |
| 2.4.10 | AAA | Section headings | Content organized with section headings |
| 2.4.11 | AA | Focus not obscured (minimum) | Focused element not entirely hidden |
| 2.4.12 | AAA | Focus not obscured (enhanced) | Focused element not even partially hidden |
| 2.4.13 | AAA | Focus appearance | Focus indicator: >=2px outline, 3:1 contrast against unfocused state, encloses the component |

### 2.5 Input Modalities

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 2.5.1 | A | Pointer gestures | Multi-point/path gestures have single-pointer alternatives |
| 2.5.2 | A | Pointer cancellation | Actions fire on up-event, not down-event; can abort |
| 2.5.3 | A | Label in name | Visible label is included in accessible name |
| 2.5.4 | A | Motion actuation | Shake/tilt features have button alternatives; can be disabled |
| 2.5.5 | AAA | Target size (enhanced) | Interactive targets >=44x44 CSS pixels |
| 2.5.6 | AAA | Concurrent input mechanisms | Do not restrict to single input type (mouse, keyboard, touch) |
| 2.5.7 | AA | Dragging movements | Drag-and-drop has single-pointer alternative |
| 2.5.8 | AA | Target size (minimum) | Interactive targets >=24x24 CSS pixels |

---

## Understandable

### 3.1 Readable

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 3.1.1 | A | Language of page | `<html lang="en">` (or appropriate language) |
| 3.1.2 | AA | Language of parts | `lang` attribute on passages in different languages |
| 3.1.3 | AAA | Unusual words | Glossary or inline definitions for jargon/idioms |
| 3.1.4 | AAA | Abbreviations | Expand abbreviations on first use; provide `<abbr>` with `title` |
| 3.1.5 | AAA | Reading level | Supplemental content or summaries when text exceeds lower secondary education level |
| 3.1.6 | AAA | Pronunciation | Provide pronunciation guide for ambiguous words |

### 3.2 Predictable

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 3.2.1 | A | On focus | No context change when element receives focus |
| 3.2.2 | A | On input | No unexpected context change on input; warn users |
| 3.2.3 | AA | Consistent navigation | Navigation order consistent across pages |
| 3.2.4 | AA | Consistent identification | Same function = same label across pages |
| 3.2.5 | AAA | Change on request | Context changes only when user explicitly requests them |
| 3.2.6 | A | Consistent help | Help mechanisms in consistent location across pages |

### 3.3 Input Assistance

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 3.3.1 | A | Error identification | Errors described in text, field identified |
| 3.3.2 | A | Labels or instructions | All inputs have visible labels and instructions |
| 3.3.3 | AA | Error suggestion | Provide correction suggestions when errors are detected |
| 3.3.4 | AA | Error prevention (legal/financial/data) | Reversible, checked, or confirmed submissions |
| 3.3.5 | AAA | Help | Context-sensitive help available for all inputs |
| 3.3.6 | AAA | Error prevention (all) | ALL form submissions are reversible, checked, or confirmed |
| 3.3.7 | A | Redundant entry | Auto-populate previously entered information |
| 3.3.8 | AA | Accessible authentication (minimum) | No cognitive function test for login |
| 3.3.9 | AAA | Accessible authentication (enhanced) | No object or user-content recognition for login |

---

## Robust

| SC | Level | Requirement | Implementation |
|----|-------|-------------|----------------|
| 4.1.2 | A | Name, role, value | All UI components have accessible name, role, and state via ARIA or native HTML |
| 4.1.3 | AA | Status messages | Status messages announced via `role="status"` or `aria-live` without focus change |

---

## AAA-Specific Design Implications

These AAA criteria have the most significant impact on visual design and architecture decisions:

### Contrast (1.4.6)
Normal text: 7:1 minimum contrast ratio. Large text (>=18pt or >=14pt bold): 4.5:1 minimum. This eliminates most light grays, pastels, and low-contrast color combinations.

### Visual Presentation (1.4.8)
Maximum line width of 80 characters. No justified text alignment. Line-height >=1.5x font size. Paragraph spacing >=2x line-height. User-selectable foreground/background colors.

### Target Size (2.5.5)
All interactive elements must be at least 44x44 CSS pixels. This affects button sizing, link spacing, form controls, and navigation items.

### Focus Appearance (2.4.13)
Focus indicators must have >=2px solid outline with 3:1 contrast ratio against the unfocused state and against adjacent colors. The indicator must fully enclose the component.

### No Timing (2.2.3)
No time limits on any user interaction. Session timeouts must preserve data. Carousels and auto-advancing content must be user-controlled only.

### Change on Request (3.2.5)
No automatic context changes. All navigation, page loads, and state changes must be explicitly triggered by the user.

# ARIA Design Patterns for Web Applications

This document provides production-grade, accessible component patterns based on the WAI-ARIA Authoring Practices Guide (APG). Use these patterns for common interactive widgets in web applications to ensure they are operable and understandable for all users, including those using assistive technologies.

## Table of Contents

1.  [Core Concepts](#core-concepts)
2.  [Modal Dialog](#modal-dialog)
3.  [Tabs](#tabs)
4.  [Accordion](#accordion)
5.  [Alert & Toast](#alert--toast)
6.  [Menu & Menu Button](#menu--menu-button)

---

## Core Concepts

-   **Keyboard Interaction**: All interactive components MUST be fully operable with a keyboard. The APG provides detailed keyboard interaction models for each pattern (e.g., arrow keys for tabs, Escape key for modals).
-   **Focus Management**: Scripts MUST manage focus. When a widget opens, focus must move to it. When it closes, focus must return to the element that opened it.
-   **ARIA Roles, States, and Properties**: Use ARIA attributes to define the role of a component (e.g., `role="dialog"`), its current state (e.g., `aria-expanded="true"`), and its properties (e.g., `aria-labelledby`).

---

## Modal Dialog

A modal dialog is a window overlaid on the primary page content. It requires a user response and **must** trap focus until it is closed.

### ARIA Roles and Attributes

-   **Dialog Container**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="dialog-title"`, `aria-describedby="dialog-desc"`.
-   **Title**: An element with an `id` matching the `aria-labelledby` value.
-   **Description**: An element with an `id` matching the `aria-describedby` value.
-   **Close Button**: A `<button>` element.

### Keyboard Interaction

-   **Tab**: Moves focus between focusable elements *inside* the dialog. Focus is trapped and cannot leave the modal.
-   **Shift + Tab**: Moves focus backward *inside* the dialog.
-   **Escape**: Closes the dialog and returns focus to the button that opened it.

### Example Structure

```html
<div id="dialog-container" role="dialog" aria-modal="true" aria-labelledby="dialog-title" hidden>
  <h2 id="dialog-title">Dialog Title</h2>
  <p id="dialog-desc">Description of the dialog's purpose.</p>
  <!-- Form elements or other content -->
  <button id="close-dialog-btn">Close</button>
</div>
```

### Focus Management Script

1.  **On Open**: Store the triggering element (e.g., the "Open Dialog" button). Move focus to the first focusable element inside the dialog.
2.  **While Open**: Implement a focus trap. Listen for `keydown` events. If the user presses `Tab` on the last focusable element, loop focus back to the first. If they press `Shift + Tab` on the first, loop to the last.
3.  **On Close**: Return focus to the stored triggering element.

---

## Tabs

Tabs are a set of layered sections of content (tab panels) where only one panel is visible at a time.

### ARIA Roles and Attributes

-   **Tab List**: The container for the tabs has `role="tablist"`.
-   **Tab**: Each tab button has `role="tab"`, `aria-selected="true/false"`, and `aria-controls="panel-id"`.
-   **Tab Panel**: Each content panel has `role="tabpanel"` and `aria-labelledby="tab-id"`.

### Keyboard Interaction

-   **Tab**: Moves focus into the active tab, then through the tab panel content. When focus is on a tab, the next `Tab` press moves focus to the active tab panel.
-   **Right Arrow** (in LTR): Moves focus to the next tab in the `tablist`, activating it.
-   **Left Arrow** (in LTR): Moves focus to the previous tab, activating it.
-   **Home**: Moves focus to and activates the first tab.
-   **End**: Moves focus to and activates the last tab.

### Example Structure

```html
<div class="tabs">
  <div role="tablist" aria-label="Example Tabs">
    <button role="tab" aria-selected="true" id="tab-1" aria-controls="panel-1">Tab 1</button>
    <button role="tab" aria-selected="false" id="tab-2" aria-controls="panel-2" tabindex="-1">Tab 2</button>
  </div>
  <div id="panel-1" role="tabpanel" aria-labelledby="tab-1">
    <p>Content for Panel 1</p>
  </div>
  <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" hidden>
    <p>Content for Panel 2</p>
  </div>
</div>
```

---

## Accordion

An accordion is a vertically stacked set of interactive headings that each contain a title representing a section of content, which can be expanded or collapsed.

### ARIA Roles and Attributes

-   **Accordion Heading**: A `<h2>` (or other appropriate heading level) containing a `<button>`.
-   **Accordion Button**: The `<button>` has `aria-expanded="true/false"` and `aria-controls="section-id"`.
-   **Accordion Panel**: The content panel has `role="region"`, an `id` matching the `aria-controls` value, and `aria-labelledby` pointing to the button's `id`.

### Keyboard Interaction

-   **Tab**: Moves focus between accordion headings.
-   **Enter** or **Space**: Toggles the expansion of the associated panel.
-   **Down Arrow**: Moves focus to the next accordion heading.
-   **Up Arrow**: Moves focus to the previous accordion heading.
-   **Home**: Moves focus to the first accordion heading.
-   **End**: Moves focus to the last accordion heading.

### Example Structure

```html
<h3>
  <button aria-expanded="true" id="accordion-btn-1" aria-controls="accordion-panel-1">
    Section 1
  </button>
</h3>
<div id="accordion-panel-1" role="region" aria-labelledby="accordion-btn-1">
  <p>Content for Section 1.</p>
</div>
```

---

## Alert & Toast

Alerts are for assertive, time-sensitive information. Toasts are a less intrusive type of alert.

### ARIA Roles and Attributes

-   **Live Region Container**: A container element is always present in the DOM.
-   **Assertive Alerts**: For critical errors or updates, use `role="alert"` or `aria-live="assertive"`. Screen readers will interrupt whatever they are doing to announce it.
-   **Polite Toasts**: For status updates or confirmations, use `role="status"` or `aria-live="polite"`. Screen readers will wait for a moment of silence before announcing.

### Implementation

1.  **Create a container** at the end of the `<body>`.
2.  **Dynamically inject** the alert message into the container using JavaScript.
3.  The browser and assistive technologies will automatically announce the content when it appears.
4.  **Do not** move focus to the alert unless it requires user interaction (in which case, use a Modal Dialog).

### Example

```html
<!-- Polite Live Region for Toasts/Status -->
<div id="status-announcer" role="status" aria-live="polite" class="sr-only"></div>

<!-- Assertive Live Region for Alerts -->
<div id="alert-announcer" role="alert" aria-live="assertive" class="sr-only"></div>
```

```javascript
// To announce a success message:
document.getElementById('status-announcer').textContent = 'Your changes have been saved.';

// To announce an error:
document.getElementById('alert-announcer').textContent = 'Network connection lost.';
```

---

## Menu & Menu Button

A menu button is a button that opens a dropdown menu of choices.

### ARIA Roles and Attributes

-   **Menu Button**: A `<button>` with `aria-haspopup="true"` and `aria-expanded="true/false"`.
-   **Menu Container**: A `<ul>` with `role="menu"` and `aria-labelledby` pointing to the menu button's `id`.
-   **Menu Item**: Each `<li>` has `role="presentation"`. The link or button inside has `role="menuitem"` and `tabindex="-1"`.

### Keyboard Interaction

-   **Enter**, **Space**, **Down Arrow**: Opens the menu and places focus on the first item.
-   **Down Arrow** (in menu): Moves focus to the next item.
-   **Up Arrow** (in menu): Moves focus to the previous item.
-   **Escape**: Closes the menu and returns focus to the menu button.
-   **Enter** or **Space** (on item): Activates the item and closes the menu.

### Example Structure

```html
<button id="menu-btn" aria-haspopup="true" aria-expanded="false">Actions</button>
<ul role="menu" aria-labelledby="menu-btn" hidden>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="/edit">Edit</a>
  </li>
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="/delete">Delete</a>
  </li>
</ul>
```

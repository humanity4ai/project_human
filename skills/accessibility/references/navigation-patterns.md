# Corporate Navigation Patterns

## Table of Contents

1. [Primary Navigation Patterns](#1-primary-navigation-patterns)
2. [Secondary Navigation Patterns](#2-secondary-navigation-patterns)

---

Navigation in complex corporate and enterprise web applications must be predictable, efficient, and scalable. It provides the information architecture for the entire system.

## 1. Primary Navigation Patterns

Choose a primary navigation pattern based on the application's complexity and structure.

### Pattern: Collapsible Sidebar Navigation

This is the **recommended default** for most corporate web applications.

![Sidebar Navigation Example](https://carbondesignsystem.com/static/4a2f5d13f5919e0a04098999334583a3/2923f/Global-header-w-side-nav.png)
*(Source: IBM Carbon Design System)*

**When to Use:**
- The application has a deep, hierarchical information architecture (e.g., more than 5-7 top-level items).
- Users need to frequently switch between different sections or modules.

**Best Practices:**
- **Collapsible**: The sidebar should be collapsible to maximize content space when needed.
- **Icons and Text**: Use both icons and clear text labels for top-level items. On collapse, show icons with tooltips.
- **Hierarchy**: Use accordions or fly-out menus to reveal nested sub-navigation items.
- **Stateful**: The navigation should clearly indicate the user's current location (`aria-current="page"`).

### Pattern: Top Navigation (Header)

**When to Use:**
- The application has a relatively flat structure with a limited number of primary sections (typically 5-7 items).
- The primary focus is on the content, and vertical space is not a major concern.

**Best Practices:**
- **Limited Items**: Do not overcrowd the top navigation. If you have more than 7 items, consider a sidebar.
- **Descriptive Labels**: Use short, clear labels (1-2 words).
- **Dropdowns for Sub-items**: Use dropdown menus (`<button>` with `aria-haspopup="true"`) for sub-navigation, but avoid more than one level of nesting.

---

## 2. Secondary Navigation Patterns

These patterns help users navigate within a specific section of the application.

### Pattern: Tabbed Navigation

Tabs are excellent for switching between different views or datasets within the same context.

**When to Use:**
- To alternate between different representations of the same data (e.g., "Table View" vs. "Chart View").
- To break down a complex page into logical sections (e.g., "Settings > Profile", "Settings > Notifications").

**Best Practices:**
- **Use ARIA Tabs Pattern**: Follow the WAI-ARIA pattern for tabs, which uses `role="tablist"`, `role="tab"`, and `role="tabpanel"`. An implementation is in `/references/aria-patterns.md`.
- **Don't Use for Sequential Steps**: Tabs are for alternating views, not for a multi-step process. Use a stepper or wizard for that.

### Pattern: Breadcrumbs

Breadcrumbs are a critical secondary navigation aid that shows the user's location in the site hierarchy.

**When to Use:**
- In any application with more than two levels of depth.

**Best Practices:**
- **Show the Path**: Display the full path from the homepage to the current page.
- **Last Item is Current Page**: The last item in the breadcrumb trail should be the current page and should not be a link.
- **Use `aria-label`**: The `<nav>` element containing the breadcrumbs should have an `aria-label="breadcrumb"`.
- **Separator**: Use a simple separator (e.g., `/` or `>`) between links. This should be done with CSS `::before` content for accessibility.

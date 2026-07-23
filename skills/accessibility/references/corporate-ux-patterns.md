# Corporate Web Application UX Patterns

## Table of Contents

1. [Core Principles of Enterprise UX](#core-principles-of-enterprise-ux)
2. [Key Pattern Categories](#key-pattern-categories)
3. [Visual Hierarchy & Information Density](#visual-hierarchy--information-density)

---

This document provides best practices and patterns for designing formal, corporate, and enterprise web applications. These guidelines supplement the core WCAG AAA requirements with a focus on usability, efficiency, and scalability for complex, data-intensive systems.

## Core Principles of Enterprise UX

Corporate web applications prioritize efficiency, clarity, and role-based functionality over aesthetic trends. The design must reduce cognitive load for users who may spend hours in the application daily.

| Principle | Description | Key Implementation |
|---|---|---|
| **Efficiency Over Delight** | The primary goal is to help users complete complex tasks quickly and accurately. | Streamlined workflows, keyboard shortcuts, and predictable interfaces. |
| **Role-Based Design** | The application must serve multiple user roles, from beginners to power users, each with different needs. | Customizable dashboards, role-specific navigation, and feature sets. |
| **High Information Density** | Enterprise users often need to see large amounts of data at once to make informed decisions. The design must balance density with clarity. | Compact data tables, effective use of whitespace, and clear visual hierarchy. |
| **Progressive Disclosure** | To avoid overwhelming users, advanced options and secondary information should be hidden by default and revealed only when needed. | Use of disclosures, modals, and side panels to show contextual information. |
| **Scalable Design Systems** | The UI must be consistent across a large, evolving application. | Strict adherence to a design system with reusable components and patterns. |

---

## Key Pattern Categories

This skill provides detailed guidance on the following critical pattern categories for corporate web applications. Consult these documents for implementation details.

### 1. Application States

Properly communicating application states is crucial for preventing user confusion and building trust. An application is not always full of data; it can be loading, empty, or in an error state.

**[➡️ See full guidance: `application-states.md`](./application-states.md)**

- **Loading States**: Use skeleton screens to provide a low-fidelity preview of the UI, which reduces perceived wait time compared to a generic spinner.
- **Empty States**: Design for first-use, "no results," and success scenarios. Guide the user on what to do next.
- **Error States**: Provide clear, actionable error messages. Distinguish between system errors and user input validation errors.

### 2. Data Presentation

Presenting complex data is a core function of most corporate applications. The goal is to make data scannable, comparable, and actionable.

**[➡️ See full guidance: `data-presentation.md`](./data-presentation.md)**

- **Data Tables**: The workhorse of enterprise UX. Must support sorting, filtering, and customization. Follow strict alignment and typography rules.
- **Dashboards**: Provide a high-level overview of key metrics and system status. Should be role-based and customizable.

### 3. Navigation Patterns

Navigation in complex applications must be predictable and efficient, providing clear pathways through a deep information architecture.

**[➡️ See full guidance: `navigation-patterns.md`](./navigation-patterns.md)**

- **Sidebar Navigation**: Ideal for applications with a deep, hierarchical structure. Allows for persistent global navigation.
- **Tabbed Navigation**: Useful for switching between different views or datasets within the same context.
- **Breadcrumbs**: Essential for showing the user's location within a deep hierarchy and providing a quick way to navigate up the tree.

---

## Visual Hierarchy & Information Density

In corporate design, visual hierarchy is not about flashy graphics but about creating a clear, scannable path through dense information.

- **Limit Variation**: A formal aesthetic is achieved by minimizing variation. Adhere to these rules:
    - **Type Sizes**: Use no more than 3-4 distinct sizes for headings and body text.
    - **Colors**: Use a limited palette (e.g., 2 primary, 2 secondary colors) and ensure all have AAA contrast.
    - **Contrast Levels**: Use no more than 3 levels of text contrast (e.g., primary text, secondary text, disabled text).

- **Embrace Whitespace**: While information density is high, whitespace (or negative space) is the most powerful tool for creating groups and directing attention. Use it deliberately to separate sections and reduce cognitive load.

- **The Squint Test**: When you squint at the interface, the most important elements should still stand out. The overall structure and hierarchy should be apparent even when the details are blurred.

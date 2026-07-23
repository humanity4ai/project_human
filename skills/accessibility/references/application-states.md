# Application State Patterns

## Table of Contents

1. [Loading States](#1-loading-states)
2. [Empty States](#2-empty-states)
3. [Error States](#3-error-states)

---

This document provides patterns for handling common application states: loading, empty, and error. These states are critical for a good user experience, as they provide feedback, prevent confusion, and guide the user.

## 1. Loading States

Loading states inform the user that the system is working and content is being fetched. They reduce uncertainty and can make the application feel faster.

### Pattern: Skeleton Screens

For initial page or component loads, **skeleton screens** are the preferred pattern over generic spinners. A skeleton screen is a wireframe-like preview of the UI where content is gradually loaded in.

![Skeleton Screen Example](https://media.nngroup.com/media/editor/2023/05/23/linkedin-skeleton-screen-example.png)
*(Source: Nielsen Norman Group)*

**Benefits:**
- Reduces perceived loading time.
- Informs the user about the expected layout, preventing content from "jumping" as it loads.
- Provides a more engaging experience than a blank screen with a spinner.

**Implementation:**
- Create placeholder elements with a subtle background color and a soft, pulsing animation to indicate activity.
- The skeleton layout should closely match the actual content layout.

```css
/* Basic Skeleton Animation */
.skeleton {
  background-color: var(--color-skeleton);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: 																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																							'';
  display: block;
  position: absolute;
  top: 0;
  left: -150%;
  height: 100%;
  width: 150%;
  background: linear-gradient(to right, transparent 0%, var(--color-skeleton-highlight) 50%, transparent 100%);
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { left: -150%; }
  100% { left: 150%; }
}
```

---

## 2. Empty States

An empty state occurs when there is no data to display. This is an opportunity to guide the user.

### Types of Empty States

| Type | When to Use | Goal | Example | 
|---|---|---|---|
| **No Data (First Use)** | A user's first interaction with a feature. | Educate the user on what the feature does and guide them to their first action. | "You haven't created any projects yet. Click 'New Project' to get started." |
| **No Results** | A search or filter returns no matches. | Help the user refine their query. Offer suggestions or a way to broaden the search. | "No results found for 'Q4 Report'. Try searching by author or date." |
| **Action Complete** | A user successfully completes a task, such as clearing all notifications. | Provide positive reinforcement and a clear sense of completion. | "All caught up! You have no new notifications." |

### Anatomy of an Empty State

A good empty state is composed of three parts:
1.  **Image (Optional)**: A simple, non-distracting illustration that relates to the context.
2.  **Title**: A clear, concise message. Frame it positively (e.g., "Start by adding data" instead of "You have no data").
3.  **Body & Action**: A brief explanation of why the state is empty and a clear call-to-action (button or link) to guide the user's next step.

---

## 3. Error States

Error states communicate that something has gone wrong. They must be clear, concise, and actionable. A robust application handles both user input errors and unexpected system failures gracefully.

For full guidance on client-side API error handling and JavaScript error boundaries, see `references/security-error-handling.md`.

### Designing User-Facing Error Messages

Error states communicate that something has gone wrong. They must be clear, concise, and actionable.

### Types of Errors

- **Input Validation Errors**: The user has entered data incorrectly. These should be displayed inline, next to the problematic field.
- **System Errors**: The system failed to complete an action (e.g., network error, server issue). These are typically displayed in a more prominent notification, like a toast or banner.

### Designing Error Messages

- **Be Specific**: Tell the user exactly what is wrong (e.g., "Email address is invalid" not "Invalid input").
- **Be Constructive**: Tell the user how to fix the problem (e.g., "Password must be at least 8 characters long").
- **Don't Blame the User**: Use a neutral, helpful tone.
- **Use the Right Component**: Use inline text for form validation and toasts/banners for system-level feedback.

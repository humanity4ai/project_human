# Accessible Form Patterns

This guide provides industrial best practices for creating fully accessible forms that meet WCAG 2.2 AAA requirements. It covers labeling, grouping, validation, and error handling.

## Table of Contents

1.  [Labeling and Instructions](#labeling-and-instructions)
2.  [Grouping Related Controls](#grouping-related-controls)
3.  [Error Identification & Validation](#error-identification--validation)
4.  [Providing Help and Suggestions](#providing-help-and-suggestions)

---

## Labeling and Instructions (3.3.2)

Every form control must have a programmatically associated label.

### Best Practice: Explicit `<label>`

Always use an explicit `<label>` with a `for` attribute that matches the `id` of the form control. This is the most robust method.

```html
<label for="first-name">First Name</label>
<input type="text" id="first-name" name="first-name" autocomplete="given-name">
```

### Instructions and Formatting Requirements

For complex inputs, provide instructions. Use `aria-describedby` to link instructions to the input so screen readers announce them.

```html
<label for="password">Password</label>
<input type="password" id="password" name="password" aria-describedby="password-hint">
<p id="password-hint">Must be at least 12 characters long and include a number.</p>
```

---

## Grouping Related Controls (1.3.1, 3.3.2)

Use `<fieldset>` and `<legend>` to group related sets of controls, such as radio buttons or checkboxes.

-   The `<fieldset>` groups the controls.
-   The `<legend>` provides a visible label for the entire group.

This is essential for screen reader users to understand the context of questions with multiple choices.

### Example: Radio Button Group

```html
<fieldset>
  <legend>Choose your delivery option</legend>

  <input type="radio" id="standard" name="delivery" value="std">
  <label for="standard">Standard Delivery</label>

  <input type="radio" id="express" name="delivery" value="exp">
  <label for="express">Express Delivery</label>
</fieldset>
```

---

## Security: CSRF and XSS Prevention

All forms that perform state-changing actions (e.g., POST, PUT, DELETE) MUST be protected against Cross-Site Request Forgery (CSRF). All user input rendered back to the page MUST be encoded to prevent Cross-Site Scripting (XSS).

### CSRF: Synchronizer Token Pattern

1.  **Generate Token**: On the server, generate a unique, random token for the user session.
2.  **Embed Token**: Include the token in a hidden `<input>` field in every state-changing form.
3.  **Verify Token**: On submission, the server MUST verify that the token from the form matches the one stored in the session.

```html
<form action="/update-profile" method="post">
  <input type="hidden" name="_csrf" value="{{CSRF_TOKEN}}">
  <!-- other form fields -->
</form>
```

### XSS: Output Encoding

When re-displaying user input (e.g., after a validation error), always use `textContent` to prevent the browser from interpreting it as HTML.

```javascript
// When re-populating a form field after a server-side error:
document.getElementById("email").value = submittedEmail; // SAFE

// When displaying submitted content:
document.getElementById("comment-display").textContent = submittedComment; // SAFE
```

---

## Error Identification & Validation (3.3.1, 3.3.3)

When a form submission fails, errors must be identified clearly and programmatically.

### Best Practice: Inline Errors + Error Summary

1.  **Error Summary**: At the top of the form, display a summary of all errors. This should be contained in an element with `role="alert"` to ensure it is announced immediately. Each error in the summary should be a link that jumps the user to the corresponding invalid field.

2.  **Inline Errors**: Display a specific error message directly next to the invalid field.

3.  **Programmatic Association**: Link the error message to the input using `aria-describedby`. Also, set `aria-invalid="true"` on the input.

### Example: Invalid Email Field

```html
<!-- Error Summary at top of form -->
<div role="alert">
  <h2>Please correct the following errors:</h2>
  <ul>
    <li><a href="#email">Email address is not valid.</a></li>
  </ul>
</div>

<!-- Form Field -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error" class="form-error">Please enter a valid email address.</p>
```

### Confirmation for Destructive Actions (3.3.4)

For any form submission that is destructive or irreversible (e.g., deleting data, making a payment), you MUST provide a confirmation step.

-   **Pattern**: Use a JavaScript `confirm()` dialog for simplicity, or a full confirmation modal for more complex scenarios.
-   **Implementation**: Add a `data-confirm="Are you sure?"` attribute to the submit button and use the provided `initConfirmActions()` function in `templates/main.js`.

```html
<button type="submit" data-confirm="Are you sure you want to delete this item?">Delete</button>
```

### Validation Strategy

-   **Client-Side**: Provide real-time feedback where possible, but do not be overly aggressive. Validate on blur or on submit.
-   **Server-Side**: Always re-validate on the server. Never trust client-side validation alone.
-   **Error Prevention (3.3.4, 3.3.6)**: For legal, financial, or data-modifying forms, all submissions MUST be reversible, checked, or confirmed. Provide a confirmation page before final submission.

---

## Providing Help and Suggestions (3.3.5)

For complex forms, provide context-sensitive help.

### Help Text

Use `aria-describedby` to associate persistent help text with a field, as shown in the password example above.

### Tooltips

If using a help icon with a tooltip, ensure the tooltip is accessible. Follow the Tooltip pattern in `references/aria-patterns.md`. The help icon button should have an `aria-label` like "Help for Password field".

### Error Suggestions (3.3.3)

When an error is correctable, provide a suggestion. For example, if a username is taken, suggest alternatives.

```html
<p id="username-error" class="form-error">
  Username "simon" is already taken. Did you mean "simon123"?
</p>
```

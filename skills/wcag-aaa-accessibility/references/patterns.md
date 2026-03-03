# Accessibility Patterns & Anti-Patterns

## Common Accessibility Patterns

### 1. Proper Heading Structure

**✅ Good Pattern:**
```html
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
<h2>Next Section</h2>
```

**❌ Anti-Pattern:**
```html
<h1>Page Title</h1>
<h4>Section Title</h4>  <!-- Skipping levels -->
<h2>Subsection</h2>
```

### 2. Descriptive Link Text

**✅ Good Pattern:**
```html
<a href="/pricing">View our pricing plans</a>
<a href="/docs/getting-started">Read the getting started guide</a>
```

**❌ Anti-Pattern:**
```html
<a href="/pricing">Click here</a>
<a href="/docs">Here</a>
<a href="/details">more</a>
```

### 3. Form Labels

**✅ Good Pattern:**
```html
<label for="email">Email address</label>
<input type="email" id="email" name="email">

<!-- Or implicit labeling -->
<label>
  Email address
  <input type="email" name="email">
</label>
```

**❌ Anti-Pattern:**
```html
<input type="email" placeholder="Email">
<label>Email <input type="email"></label>  <!-- Placeholder is not a label -->
```

### 4. Keyboard Focus Indicators

**✅ Good Pattern:**
```css
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.button:focus {
  box-shadow: 0 0 0 3px #2563eb;
}
```

**❌ Anti-Pattern:**
```css
:focus {
  outline: none;  /* Removes focus indicator */
}
```

### 5. Skip Links

**✅ Good Pattern:**
```html
<a href="#main" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
</style>

<main id="main">
  <!-- Page content -->
</main>
```

### 6. ARIA Attributes

**✅ Good Pattern:**
```html
<button aria-label="Close dialog" aria-describedby="dialog-desc">
  <span aria-hidden="true">&times;</span>
</button>
<p id="dialog-desc">This dialog can be closed by pressing Escape or clicking the close button</p>
```

**❌ Anti-Pattern:**
```html
<div onclick="closeDialog()">
  <span class="close-icon">X</span>
</div>
```

### 7. Color Contrast

**✅ Good Pattern:**
```css
/* AAA compliant: 7:1 for normal text */
.text {
  color: #1a1a1a;  /* On white: 19:1 */
  background: #fff;
}

/* AAA compliant for large text: 4.5:1 */
.large-text {
  color: #4a4a4a;  /* On white: 10.8:1 */
  font-size: 18px;
}
```

**❌ Anti-Pattern:**
```css
.text {
  color: #999;  /* On white: 2.42:1 - fails WCAG AA and AAA */
}
```

### 8. Image Alt Text

**✅ Good Pattern:**
```html
<!-- Informative image -->
<img src="chart.png" alt="Bar chart showing Q1-Q4 sales: Q1 $50K, Q2 $75K, Q3 $60K, Q4 $90K">

<!-- Decorative image -->
<img src="decoration.png" alt="">

<!-- Complex image -->
<img src="flowchart.png" alt="Process flowchart showing steps A, B, C, and D">
<aria-describedby="flow-desc">
<p id="flow-desc">Detailed description of the flowchart...</p>
```

**❌ Anti-Pattern:**
```html
<img src="chart.png" alt="chart">  <!-- Too vague -->
<img src="spacer.gif">  <!-- Missing alt -->
```

### 9. Error Handling

**✅ Good Pattern:**
```html
<label for="phone">Phone number</label>
<input type="tel" id="phone" name="phone" 
       aria-invalid="true" 
       aria-describedby="phone-error">
<span id="phone-error" role="alert">
  Please enter a valid phone number (10 digits)
</span>
```

**❌ Anti-Pattern:**
```html
<input type="tel">
<span style="color: red">Invalid phone</span>
```

### 10. Modal/Dialog Accessibility

**✅ Good Pattern:**
```html
<div role="dialog" 
     aria-modal="true" 
     aria-labelledby="dialog-title"
     aria-describedby="dialog-desc">
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">Are you sure you want to proceed?</p>
  <button>Confirm</button>
  <button>Cancel</button>
</div>
```

### 11. Required Field Indicators

**✅ Good Pattern:**
```html
<label for="name">
  Name <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input id="name" required aria-required="true">
```

### 12. Live Regions for Dynamic Content

**✅ Good Pattern:**
```html
<!-- For status messages -->
<div aria-live="polite" aria-atomic="true">
  Changes saved
</div>

<!-- For errors -->
<form aria-invalid="true">
  <div aria-live="assertive" role="alert">
    Please correct the errors below
  </div>
</form>
```

---

## Common Mistakes to Avoid

### 1. Using Placeholder as Label

**❌ Never do this:**
```html
<input placeholder="Enter your email">
```

**✅ Always do this:**
```html
<label for="email">Email</label>
<input id="email" placeholder="user@example.com">
```

### 2. Removing Focus Styles

**❌ Never do this:**
```css
*:focus {
  outline: none;
}
```

**✅ Always do this:**
```css
*:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### 3. Missing Form Errors

**❌ Never do this:**
```html
<input type="email" required>
<!-- No error message -->
```

**✅ Always do this:**
```html
<input type="email" required aria-describedby="email-error">
<span id="email-error" role="alert">Email is required</span>
```

### 4. Auto-Playing Media

**❌ Never do this:**
```html
<video autoplay>
```

**✅ Always do this:**
```html
<video autoplay muted>  <!-- Must be muted -->
<!-- Or better: -->
<video>
  <button aria-label="Play video">Play</button>
</video>
```

### 5. Relying on Color Alone

**❌ Never do this:**
```html
<span style="color: red">Error</span>
```

**✅ Always do this:**
```html
<span role="alert" style="color: red">
  <span aria-hidden="true">⚠</span> Error
</span>
```

### 6. Using Title as Accessibility

**❌ Never rely on this:**
```html
<a href="#" title="Go to home page">Home</title>
```

**✅ Instead use:**
```html
<a href="/">Home</a>
```

### 7. Missing Language Declaration

**❌ Never do this:**
```html
<html>
```

**✅ Always do this:**
```html
<html lang="en">
```

### 8. Incorrect Heading Order

**❌ Never do this:**
```html
<h1>Title</h1>
<h3>Subtitle</h3>  <!-- Skipped h2 -->
```

**✅ Always do this:**
```html
<h1>Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

---

## Quick Checklist

- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Color contrast meets 4.5:1 (AA) or 7:1 (AAA)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] No auto-playing audio/video
- [ ] Error messages are descriptive
- [ ] Headings in logical order
- [ ] Links have descriptive text
- [ ] Language declared in HTML

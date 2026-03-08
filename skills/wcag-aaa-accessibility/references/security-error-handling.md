# Web App Security & Error Handling Patterns

This document provides essential security and error handling patterns for building production-grade, full-stack web applications. It covers defensive coding, secure configuration, and robust error management to protect against common vulnerabilities and ensure a reliable user experience.

## Table of Contents

1.  [Web Application Security](#web-application-security)
    *   [HTTP Security Headers](#http-security-headers)
    *   [Content Security Policy (CSP)](#content-security-policy-csp)
    *   [Cross-Site Scripting (XSS) Prevention](#cross-site-scripting-xss-prevention)
    *   [Cross-Site Request Forgery (CSRF) Prevention](#cross-site-request-forgery-csrf-prevention)
    *   [Secrets Management](#secrets-management)
2.  [Robust Error Handling](#robust-error-handling)
    *   [Client-Side API Error Handling](#client-side-api-error-handling)
    *   [Global JavaScript Error Handling](#global-javascript-error-handling)

---

## Web Application Security

Security is not a feature but a foundational requirement. The following patterns provide defense-in-depth against the most common web vulnerabilities.

### HTTP Security Headers

HTTP security headers are a critical, server-side defense mechanism that instructs the browser on how to behave when handling your site’s content. They should be configured on your web server or reverse proxy.

| Header | Purpose & Recommended Value |
| --- | --- |
| `Content-Security-Policy` | Prevents XSS, clickjacking, and other injection attacks. See the [CSP section](#content-security-policy-csp) for a strict policy. |
| `Strict-Transport-Security` | Enforces secure (HTTPS) connections. `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | Prevents MIME-sniffing attacks. `nosniff` |
| `Referrer-Policy` | Controls how much referrer information is sent. `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables browser features that are not needed. `camera=(), microphone=(), geolocation=()` |
| `Cross-Origin-Opener-Policy` | Protects against cross-origin attacks. `same-origin` |

### Content Security Policy (CSP)

A strict CSP is the most effective way to mitigate injection vulnerabilities. It drastically reduces the attack surface by telling the browser which dynamic resources are allowed to load.

**Best Practice: Nonce-Based Strict CSP**

This approach is highly secure and easier to maintain than allowlist-based policies.

1.  **Generate a Nonce**: For every server-rendered page request, generate a unique, random, base64-encoded string (the "nonce").
2.  **Set the Header**: Include the nonce in the `Content-Security-Policy` header.
3.  **Apply to Scripts**: Add a `nonce="{{YOUR_NONCE}}"` attribute to every legitimate `<script>` tag on the page.

**Recommended Strict Policy Template:**

```http
Content-Security-Policy:
  script-src 'nonce-{{YOUR_NONCE}}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
  require-trusted-types-for 'script';
```

-   `script-src 'nonce-...' 'strict-dynamic'`: Allows scripts with the correct nonce to execute, and allows those scripts to load other scripts.
-   `object-src 'none'`: Disables legacy plugins like Flash.
-   `base-uri 'none'`: Prevents attackers from changing the base URL of the page.
-   `require-trusted-types-for 'script'`: Enforces DOM XSS protection.

### Cross-Site Scripting (XSS) Prevention

XSS occurs when an attacker injects malicious scripts into a trusted website. The primary defense is to **never trust user input** and to properly encode all output.

**Rule 1: Use `textContent` over `innerHTML`**

To prevent DOM-based XSS, always use `element.textContent` to insert data into the page. Never use `innerHTML` with user-provided content.

```javascript
// SAFE: Automatically encodes HTML
document.getElementById('user-comment').textContent = untrustedUserData;

// UNSAFE: Renders HTML, allowing script execution
document.getElementById('user-comment').innerHTML = untrustedUserData;
```

**Rule 2: Sanitize HTML with DOMPurify**

If you absolutely must render user-provided HTML, sanitize it first with a library like [DOMPurify](https://github.com/cure53/DOMPurify).

```javascript
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(untrustedHTML);
document.getElementById('content').innerHTML = cleanHTML;
```

### Cross-Site Request Forgery (CSRF) Prevention

CSRF tricks a user's browser into making an unwanted request to your application on their behalf. The standard defense is the **Synchronizer Token Pattern**.

1.  **Generate Token**: When rendering a form, the server generates a unique, random token (CSRF token).
2.  **Embed Token**: The token is embedded in a hidden `<input>` field within the form.
3.  **Verify Token**: When the form is submitted, the server checks that the token from the form body matches the token it expects for that user's session. If they don't match, the request is rejected.

**Example Form with CSRF Token:**

```html
<form action="/update-profile" method="post">
  <input type="hidden" name="_csrf" value="{{CSRF_TOKEN}}">
  <!-- other form fields -->
  <button type="submit">Update</button>
</form>
```

### Secrets Management

Never hardcode API keys, database credentials, or other secrets directly in your front-end or back-end code. Use environment variables to store secrets and load them at runtime.

-   **Front-End**: Use build tool features (e.g., Vite's `import.meta.env.VITE_API_KEY`) to expose non-critical keys. **Never** expose server-side or high-privilege keys to the client.
-   **Back-End**: Use a `.env` file locally and your hosting provider's secret management system in production.

---

## Robust Error Handling

### Client-Side API Error Handling

Web applications must gracefully handle API failures. A robust pattern involves a centralized API client that handles common error scenarios.

**API Client Logic:**

1.  **Check Network Errors**: Wrap `fetch` calls in a `try...catch` block to handle network failures or DNS issues.
2.  **Check HTTP Status**: If a response is received, check `response.ok`. If it's `false` (e.g., status 404, 500), parse the error body and throw a structured error.
3.  **Handle Timeouts**: Use an `AbortController` to implement request timeouts.
4.  **Implement Retry Logic**: For transient errors (e.g., 503 Service Unavailable), implement an exponential backoff retry mechanism.

**Example API Error Structure:**

```json
{
  "error": {
    "status": 401,
    "code": "UNAUTHORIZED",
    "message": "Authentication token is missing or invalid."
  }
}
```

### Global JavaScript Error Handling

To catch unexpected errors and prevent the application from crashing, implement global error handlers.

**Pattern: Error Boundaries & Global Handlers**

-   **Error Boundaries (React)**: In React, wrap sections of your UI in an Error Boundary component. It will catch rendering errors in its children, log them, and display a fallback UI.
-   **Global Handlers (Vanilla JS)**: Use `window.onerror` and `window.onunhandledrejection` to catch uncaught synchronous errors and unhandled promise rejections. These handlers are the last line of defense and should be used to log the error to a monitoring service and inform the user that something went wrong.

**Example: Global Error Handler**

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Caught unhandled error:', { message, source, lineno, error });
  // Log to a remote service
  // Show a generic error message to the user
  return true; // Prevents the default browser error handling
};
```

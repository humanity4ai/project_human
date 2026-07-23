/**
 * Main Application JavaScript
 * WCAG 2.2 AAA Compliant — Framework-Agnostic
 *
 * This file provides production-ready, accessible JavaScript for:
 *   - Mobile navigation (toggle, focus trap, Escape key)
 *   - Sidebar navigation (toggle, overlay, focus trap)
 *   - Expandable sidebar sections (accordion pattern)
 *   - Footer year auto-update
 *   - Global error handling
 *   - Accessible announcements (live regions)
 *   - Confirmation dialog for destructive actions
 *
 * SECURITY NOTES:
 *   - All DOM text insertion uses textContent (never innerHTML)
 *   - All user input is treated as untrusted
 *   - Event listeners are attached via addEventListener (no inline handlers)
 *
 * ARCHITECTURE:
 *   - Each feature is encapsulated in its own function (Single Responsibility)
 *   - No global variables are leaked (IIFE or module pattern)
 *   - All DOM queries are performed once and cached
 *   - Defensive null checks prevent errors when elements are absent
 */

(function () {
  'use strict';

  // ============================================
  // UTILITY: Accessible Announcements
  // ============================================

  /**
   * Announce a message to screen readers via a live region.
   * @param {string} message - The message to announce (plain text only).
   * @param {'polite'|'assertive'} priority - The urgency of the announcement.
   */
  function announce(message, priority) {
    if (priority === void 0) { priority = 'polite'; }
    var regionId = priority === 'assertive' ? 'alert-announcer' : 'status-announcer';
    var region = document.getElementById(regionId);
    if (region) {
      // Clear first, then set — ensures re-announcement of identical messages
      region.textContent = '';
      requestAnimationFrame(function () {
        region.textContent = message;
      });
    }
  }

  // ============================================
  // UTILITY: Focus Trap
  // ============================================

  /**
   * Creates a focus trap within a container element.
   * @param {HTMLElement} container - The element to trap focus within.
   * @returns {{ activate: Function, deactivate: Function }}
   */
  function createFocusTrap(container) {
    var FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var handler = null;

    function activate() {
      handler = function (e) {
        if (e.key !== 'Tab') return;
        var focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      container.addEventListener('keydown', handler);
    }

    function deactivate() {
      if (handler) {
        container.removeEventListener('keydown', handler);
        handler = null;
      }
    }

    return { activate: activate, deactivate: deactivate };
  }

  // ============================================
  // FEATURE: Mobile Navigation
  // ============================================

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-navigation');
    var overlay = document.querySelector('.nav-overlay');
    if (!toggle || !nav) return;

    var focusTrap = createFocusTrap(nav);

    function openNav() {
      nav.setAttribute('data-open', 'true');
      if (overlay) overlay.setAttribute('data-open', 'true');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close Navigation Menu');
      focusTrap.activate();
      var firstLink = nav.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
      announce('Navigation menu opened', 'polite');
    }

    function closeNav() {
      nav.setAttribute('data-open', 'false');
      if (overlay) overlay.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open Navigation Menu');
      focusTrap.deactivate();
      toggle.focus();
      announce('Navigation menu closed', 'polite');
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.getAttribute('data-open') === 'true';
      isOpen ? closeNav() : openNav();
    });

    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        closeNav();
      }
    });
  }

  // ============================================
  // FEATURE: Sidebar Navigation
  // ============================================

  function initSidebar() {
    var sidebar = document.getElementById('sidebar-nav');
    var sidebarToggle = document.querySelector('.sidebar-toggle');
    var sidebarClose = sidebar ? sidebar.querySelector('.sidebar__close') : null;
    var sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebar || !sidebarToggle) return;

    var focusTrap = createFocusTrap(sidebar);

    function openSidebar() {
      sidebar.classList.add('is-open');
      sidebar.setAttribute('aria-hidden', 'false');
      sidebarToggle.setAttribute('aria-expanded', 'true');
      if (sidebarOverlay) {
        sidebarOverlay.hidden = false;
        sidebarOverlay.setAttribute('aria-hidden', 'false');
      }
      focusTrap.activate();
      var firstLink = sidebar.querySelector('.sidebar__link');
      if (firstLink) firstLink.focus();
    }

    function closeSidebar() {
      sidebar.classList.remove('is-open');
      sidebar.setAttribute('aria-hidden', 'true');
      sidebarToggle.setAttribute('aria-expanded', 'false');
      if (sidebarOverlay) {
        sidebarOverlay.hidden = true;
        sidebarOverlay.setAttribute('aria-hidden', 'true');
      }
      focusTrap.deactivate();
      sidebarToggle.focus();
    }

    sidebarToggle.addEventListener('click', function () {
      var isOpen = sidebar.classList.contains('is-open');
      isOpen ? closeSidebar() : openSidebar();
    });

    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeSidebar();
      }
    });
  }

  // ============================================
  // FEATURE: Expandable Sidebar Sections
  // ============================================

  function initExpandableSections() {
    var expandButtons = document.querySelectorAll('.sidebar__item--expandable > .sidebar__link');
    expandButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var targetId = btn.getAttribute('aria-controls');
        var target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;

        btn.setAttribute('aria-expanded', String(!expanded));
        target.hidden = expanded;
      });
    });
  }

  // ============================================
  // FEATURE: Footer Year Auto-Update
  // ============================================

  function initFooterYear() {
    var yearEl = document.getElementById('footer-year');
    if (yearEl) {
      // SECURITY: textContent is safe; innerHTML would be an XSS vector
      yearEl.textContent = new Date().getFullYear().toString();
    }
  }

  // ============================================
  // FEATURE: Confirmation for Destructive Actions
  // ============================================

  /**
   * Attach confirmation dialogs to all buttons marked with
   * data-confirm="Are you sure?". Prevents the default action
   * unless the user confirms.
   *
   * Usage:
   *   <button data-confirm="Delete this item permanently?">Delete</button>
   */
  function initConfirmActions() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-confirm]');
      if (!target) return;
      var message = target.getAttribute('data-confirm');
      if (message && !window.confirm(message)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  }

  // ============================================
  // FEATURE: Global Error Handling
  // ============================================

  function initGlobalErrorHandling() {
    window.onerror = function (message, source, lineno, colno, error) {
      // Log to console in development; replace with remote logging in production
      console.error('Unhandled error:', { message: message, source: source, lineno: lineno, error: error });
      announce('An unexpected error occurred. Please try again.', 'assertive');
      return true; // Prevents the default browser error handling
    };

    window.onunhandledrejection = function (event) {
      console.error('Unhandled promise rejection:', event.reason);
      announce('An unexpected error occurred. Please try again.', 'assertive');
    };
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize all features when the DOM is ready.
   * Each init function is defensive — it checks for required elements
   * before attaching listeners, so it is safe to call on any page.
   */
  function init() {
    initGlobalErrorHandling();
    initMobileNav();
    initSidebar();
    initExpandableSections();
    initFooterYear();
    initConfirmActions();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

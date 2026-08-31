// CyberCompile — minimal extra JavaScript
// Kept deliberately small; Material for MkDocs already handles the
// interactive pieces. This file is a hook point for any future
// site-wide behaviour without editing theme components.
(function () {
  'use strict';

  // Example hook: fire a custom event once the page content is ready.
  // Other scripts (or future inline widgets) can listen for it.
  document.addEventListener('DOMContentLoaded', function () {
    document.body.dispatchEvent(
      new CustomEvent('cybercompile:ready', { bubbles: true })
    );
  });
})();

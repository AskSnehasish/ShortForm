(function() {
  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function getCSSProp(name, fallback) {
    var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  }

  function getSignupColor() {
    var ac = getCSSProp('--color-accent', '#2563eb');
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ac);
    if (!m) return '#fff';
    var br = (parseInt(m[1],16)*299 + parseInt(m[2],16)*587 + parseInt(m[3],16)*114) / 2550;
    return br > 55 ? '#1a1a1a' : '#fff';
  }

  function buildCSS() {
    var accentColor = getCSSProp('--color-accent', '#2563eb');
    var textColor = getCSSProp('--color-text', '#222');
    var textSecondary = getCSSProp('--color-text-secondary', '#666');
    var textMuted = getCSSProp('--color-text-muted', '#888');
    var bgColor = getCSSProp('--color-bg', '#fff');
    var borderColor = getCSSProp('--color-border', 'rgba(0,0,0,0.08)');
    var linkUnderline = getCSSProp('--color-link-underline', 'rgba(34,34,34,0.12)');

    var signupColor = getSignupColor();

    return [
      '.text-black, .text-neutral-900, .text-neutral-900\\\\/50, .text-neutral-900\\\\/60, .text-neutral-900\\\\/55,',
      '.text-neutral-900\\\\/40, .text-neutral-900\\\\/25, h1, h2, h3, h4, .font-semibold, .font-bold,',
      '.text-\\[2\\.2rem\\], .text-2xl, .gh-comment-content,',
      '[class*="text-neutral-900"]:not([class*="\\\\/"]) {',
      '  --tw-text-opacity: 1 !important;',
      '  color: ' + textColor + ' !important;',
      '}',
      '',
      '.text-neutral-600, .text-neutral-700, .text-neutral-500,',
      '.text-\\[rgba\\(0\\,0\\,0\\,0\\.4\\)\\], .text-black\\/50, .text-black\\/90, .text-black\\/30,',
      '.text-neutral-900\\\\/50, .text-neutral-900\\\\/60, .text-neutral-900\\\\/55,',
      '.text-neutral-900\\\\/40 {',
      '  --tw-text-opacity: 1 !important;',
      '  color: ' + textSecondary + ' !important;',
      '}',
      '',
      '.text-neutral-400, .text-\\[rgba\\(0\\,0\\,0\\,0\\.4\\)\\], .text-black\\/50,',
      '.text-neutral-900\\\\/40, .text-neutral-900\\\\/25,',
      '.text-\\[15px\\], .text-sm.text-neutral-500, .text-neutral-500 {',
      '  --tw-text-opacity: 1 !important;',
      '  color: ' + textMuted + ' !important;',
      '}',
      '',
      '[data-testid="signin-button"] {',
      '  color: ' + textColor + ' !important;',
      '}',
      '',
      ':root button[data-testid="signup-button"] {',
      '  background: ' + accentColor + ' !important;',
      '  color: ' + signupColor + ' !important;',
      '  border-color: ' + accentColor + ' !important;',
      '}',
      '',
      '.gh-comment-content a {',
      '  color: ' + textColor + ' !important;',
      '  text-decoration: underline !important;',
      '  text-underline-offset: 3px !important;',
      '  text-decoration-thickness: 2px !important;',
      '  text-decoration-color: ' + linkUnderline + ' !important;',
      '  transition: text-decoration-color 250ms ease !important;',
      '}',
      '.gh-comment-content a:hover {',
      '  text-decoration-color: ' + accentColor + ' !important;',
      '}',
      '',
      'input:focus, textarea:focus {',
      '  outline: none !important;',
      '  border-color: ' + accentColor + ' !important;',
      '}',
      '',
      'button:focus-visible {',
      '  outline: 2px solid ' + accentColor + ' !important;',
      '  outline-offset: 2px !important;',
      '}',
      '',
      '.ProseMirror p.is-editor-empty:first-child:before {',
      '  color: ' + textMuted + ' !important;',
      '}',
      '',
      '#ghost-comments-root section {',
      '  --gh-accent-color: ' + accentColor + ';',
      '}'
    ].join('\n');
  }

  var injectionCount = 0;
  var maxInjections = 100;

  function injectStyles() {
    injectionCount++;
    var root = document.getElementById('ghost-comments-root');
    if (!root) return;
    var iframe = root.querySelector('iframe');
    if (!iframe) return;
    try {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.head) return;
      var existing = doc.getElementById('gh-comments-theme-css');
      var style;
      if (existing) {
        style = existing;
        style.textContent = '';
      } else {
        style = doc.createElement('style');
        style.id = 'gh-comments-theme-css';
        doc.head.appendChild(style);
      }
      style.textContent = buildCSS();
    } catch(e) {}
  }

  function pollInject() {
    injectStyles();
    if (injectionCount < maxInjections) {
      setTimeout(pollInject, 100);
    }
  }

  pollInject();
})();

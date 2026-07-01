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
    var ac = getCSSProp('--color-accent', '#000');
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ac);
    var br = m ? (parseInt(m[1],16)*299+parseInt(m[2],16)*587+parseInt(m[3],16)*114)/2550 : 128;
    return br > 78 ? '#fff' : ac;
  }

  function buildCSS() {
    var textColor = getCSSProp('--color-text', '#000');
    var textSecondary = getCSSProp('--color-text-secondary', '#525252');
    var textMuted = getCSSProp('--color-text-muted', 'rgba(0,0,0,0.4)');
    var bgColor = getCSSProp('--color-bg', '#fff');
    var borderColor = getCSSProp('--color-border', '#e5e5e5');
    var textColorDark = getCSSProp('--color-text-dark', 'rgba(255,255,255,0.85)');
    var textSecondaryDark = getCSSProp('--color-text-secondary-dark', 'rgba(255,255,255,0.6)');
    var textMutedDark = getCSSProp('--color-text-muted-dark', 'rgba(255,255,255,0.5)');
    var bgDark = getCSSProp('--color-bg-dark', '#1a1a1a');
    var borderDark = getCSSProp('--color-border-dark', '#333');

    var signupColor = getSignupColor();

    var r = hexToRgb(textColor);
    if (r && bgColor === textColor) {
      textColor = 'hsl(' + r.h + ', ' + Math.min(r.s * 0.08, 6) + '%, 92%)';
    }

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

      ':root button[data-testid="signup-button"] {',
      '  color: ' + signupColor + ' !important;',
      '}',

      '.ProseMirror p.is-editor-empty:first-child:before {',
      '  color: ' + textMuted + ' !important;',
      '}',
      '',
      '.dark-mode .text-black, .dark .text-black,',
      '.dark-mode .text-neutral-900, .dark .text-neutral-900,',
      '.dark-mode .text-\\[2\\.2rem\\], .dark .text-\\[2\\.2rem\\], .dark-mode .text-2xl, .dark .text-2xl,',
      '.dark-mode h1, .dark h1, .dark-mode h2, .dark h2, .dark-mode h3, .dark h3, .dark-mode h4, .dark h4,',
      '.dark-mode .dark\\\\:text-white, .dark .dark\\\\:text-white,',
      '.dark-mode .dark\\\\:text-neutral-100, .dark .dark\\\\:text-neutral-100,',
      '.dark-mode .dark\\\\:text-neutral-200, .dark .dark\\\\:text-neutral-200,',
      '.dark-mode .dark\\\\:text-neutral-300, .dark .dark\\\\:text-neutral-300,',
      '.dark-mode .dark\\\\:text-\\[rgba\\(255\\,255\\,255\\,0\\.85\\)\\], .dark .dark\\\\:text-\\[rgba\\(255\\,255\\,255\\,0\\.85\\)\\],',
      '.dark-mode .dark\\\\:text-white\\\\/85, .dark .dark\\\\:text-white\\\\/85,',
      '.dark-mode .dark\\\\:text-white\\\\/90, .dark .dark\\\\:text-white\\\\/90,',
      '.dark-mode .dark\\\\:text-white\\\\/70, .dark .dark\\\\:text-white\\\\/70 {',
      '  color: ' + textColorDark + ' !important;',
      '}',
      '',
      '.dark-mode .text-neutral-600, .dark .text-neutral-600,',
      '.dark-mode .text-neutral-700, .dark .text-neutral-700,',
      '.dark-mode .text-neutral-500, .dark .text-neutral-500,',
      '.dark-mode .dark\\\\:text-neutral-400, .dark .dark\\\\:text-neutral-400,',
      '.dark-mode .dark\\\\:text-\\[rgba\\(255\\,255\\,255\\,0\\.5\\)\\], .dark .dark\\\\:text-\\[rgba\\(255\\,255\\,255\\,0\\.5\\)\\] {',
      '  color: ' + textSecondaryDark + ' !important;',
      '}',
      '',
      '.dark-mode .dark\\\\:text-white\\\\/60, .dark .dark\\\\:text-white\\\\/60,',
      '.dark-mode .dark\\\\:text-white\\\\/50, .dark .dark\\\\:text-white\\\\/50,',
      '.dark-mode .dark\\\\:text-white\\\\/30, .dark .dark\\\\:text-white\\\\/30 {',
      '  color: ' + textMutedDark + ' !important;',
      '}',
      '',
      '.dark-mode [data-testid="signin-button"],',
      '.dark [data-testid="signin-button"] {',
      '  color: ' + textSecondaryDark + ' !important;',
      '}',

      '.dark-mode button[data-testid="signup-button"],',
      '.dark button[data-testid="signup-button"] {',
      '  background: #fff !important;',
      '  color: ' + textColorDark + ' !important;',
      '}',
      '',
      '.dark-mode .gh-comment-content p.is-editor-empty:first-child:before {',
      '  color: ' + textMutedDark + ' !important;',
      '}',
      '',
      '#ghost-comments-root section {',
      '  --gh-accent-color: ' + getCSSProp('--color-accent', 'var(--gh-accent-color, #000)') + ';',
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

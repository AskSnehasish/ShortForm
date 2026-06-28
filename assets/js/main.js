(function () {
  'use strict';

  /* ==========================================
     Settings from Ghost Admin
     ========================================== */

  var metaAccent = document.querySelector('meta[name="ghost:site-accent"]');
  var metaScheme = document.querySelector('meta[name="ghost:color-scheme"]');
  var accentColor = (metaAccent && metaAccent.getAttribute('content')) || '#2563eb';
  var colorScheme = (metaScheme && metaScheme.getAttribute('content')) || 'light';

  /* ==========================================
     Accent-based Background (Light Mode)
     ========================================== */

  var html = document.documentElement;
  var accentProps = {};

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function computeAccentProps() {
    if (!accentColor) return;
    var r = hexToRgb(accentColor);
    if (!r) return;
    var hsl = rgbToHsl(r.r, r.g, r.b);
    var h = hsl.h, s = hsl.s, l = hsl.l;
    var useLightText = l <= 60;
    var ts = Math.min(s * 0.08, 6);
    var tl = useLightText ? 92 : 14;
    var borderSat = Math.min(s * 0.25, 15);
    var borderL = useLightText ? 45 : 62;
    accentProps = {
      '--color-bg': accentColor,
      '--color-text': 'hsl(' + h + ', ' + ts + '%, ' + tl + '%)',
      '--color-text-secondary': 'hsl(' + h + ', ' + ts + '%, ' + (useLightText ? 80 : 28) + '%)',
      '--color-text-muted': 'hsl(' + h + ', ' + ts + '%, ' + (useLightText ? 65 : 42) + '%)',
      '--color-border': 'hsl(' + h + ', ' + borderSat + '%, ' + borderL + '%)',
      '--color-code-bg': 'hsl(' + h + ', ' + Math.min(s * 0.15, 8) + '%, ' + (useLightText ? '38' : '72') + '%)',
      '--color-selection': 'hsl(' + h + ', 30%, ' + (useLightText ? 80 : 25) + ')',
      '--color-link-underline': 'hsla(' + h + ', ' + ts + '%, ' + tl + '%, 0.25)'
    };
  }

  computeAccentProps();

  var themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyAccent() {
    if (!accentColor || html.classList.contains('dark-mode')) return;
    for (var p in accentProps) html.style.setProperty(p, accentProps[p]);
  }

  function removeAccent() {
    for (var p in accentProps) html.style.removeProperty(p);
  }

  /* ==========================================
     Dark Mode
     ========================================== */

  var themeToggle = document.querySelector('[data-theme-toggle]');

  function getPreferredTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    if (colorScheme === 'dark') return 'dark';
    if (colorScheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark-mode');
      removeAccent();
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#1a1a1a');
    } else {
      html.classList.remove('dark-mode');
      applyAccent();
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', accentColor || '#ffffff');
      }
    }
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    var current = html.classList.contains('dark-mode') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Init theme
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme') && colorScheme === 'auto') {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ==========================================
     Copy Code Button
     ========================================== */

  document.querySelectorAll('.code-block').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre) return;

    var header = document.createElement('div');
    header.className = 'code-block-header';

    var lang = document.createElement('span');
    lang.className = 'code-block-lang';
    var codeEl = pre.querySelector('code');
    if (codeEl && codeEl.className) {
      var match = codeEl.className.match(/language-(\w+)/);
      if (match) lang.textContent = match[1];
    }
    if (!lang.textContent) lang.textContent = 'Code';

    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button';
    copyBtn.type = 'button';
    copyBtn.innerHTML = '<span class="copy-label">Copy</span>';

    copyBtn.addEventListener('click', function () {
      var text = pre.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.setAttribute('data-copied', 'true');
          copyBtn.querySelector('.copy-label').textContent = 'Copied';
          setTimeout(function () {
            copyBtn.removeAttribute('data-copied');
            copyBtn.querySelector('.copy-label').textContent = 'Copy';
          }, 2000);
        });
      } else {
        // Fallback
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          copyBtn.setAttribute('data-copied', 'true');
          copyBtn.querySelector('.copy-label').textContent = 'Copied';
          setTimeout(function () {
            copyBtn.removeAttribute('data-copied');
            copyBtn.querySelector('.copy-label').textContent = 'Copy';
          }, 2000);
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });

    header.appendChild(lang);
    header.appendChild(copyBtn);
    block.insertBefore(header, pre);
  });

  /* ==========================================
     Reading Progress Bar
     ========================================== */

  var progressBar = document.querySelector('[data-progress-bar]');
  if (progressBar) {
    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var progress = Math.min((scrollTop / docHeight) * 100, 100);
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  /* ==========================================
     Header Auto-Hide
     ========================================== */

  var header = document.querySelector('.site-header');
  var lastScrollY = window.scrollY;
  var ticking = false;
  var headerHidden = false;

  if (header) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 120) {
            if (!headerHidden) {
              header.classList.add('site-header--hidden');
              headerHidden = true;
            }
          } else if (currentScrollY < lastScrollY) {
            if (headerHidden) {
              header.classList.remove('site-header--hidden');
              headerHidden = false;
            }
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================
     Nav More Dropdown (mobile)
     ========================================== */

  var navMore = document.querySelector('[data-nav-more]');
  var navDropdown = document.querySelector('[data-nav-dropdown]');
  var navMoreToggle = navMore ? navMore.querySelector('.nav-more-toggle') : null;

  if (navMore && navDropdown && navMoreToggle) {
    // Populate dropdown with nav items 4+
    var navList = document.querySelector('.site-nav ul');
    if (navList) {
      var items = navList.querySelectorAll('li');
      if (items.length > 3) {
        for (var i = 3; i < items.length; i++) {
          var clone = items[i].cloneNode(true);
          var link = clone.querySelector('a');
          if (link) {
            link.addEventListener('click', function () {
              navDropdown.classList.remove('open');
              navMoreToggle.setAttribute('aria-expanded', 'false');
            });
          }
          navDropdown.appendChild(clone);
        }
      }
    }

    // Also add Subscribe/Account link to dropdown
    var subscribeLink = document.querySelector('#nav-subscribe');
    if (subscribeLink) {
      var subClone = subscribeLink.cloneNode(true);
      subClone.removeAttribute('id');
      subClone.addEventListener('click', function () {
        navDropdown.classList.remove('open');
        navMoreToggle.setAttribute('aria-expanded', 'false');
      });
      navDropdown.appendChild(subClone);
    }

    // Toggle dropdown
    navMoreToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navDropdown.classList.toggle('open');
      navMoreToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!navMore.contains(e.target)) {
        navDropdown.classList.remove('open');
        navMoreToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================
     Image Zoom
     ========================================== */

  var contentImages = document.querySelectorAll('.post-content img');
  contentImages.forEach(function (img) {
    if (img.closest('figure') || img.closest('a')) return;
    img.setAttribute('data-zoomable', '');
    img.addEventListener('click', function () {
      var overlay = document.createElement('div');
      overlay.className = 'img-zoom-overlay';
      var clone = img.cloneNode();
      overlay.appendChild(clone);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      overlay.addEventListener('click', function () {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      });
    });
  });

  /* ==========================================
     Persist theme-color across chrome events
     ========================================== */

  function syncThemeColor() {
    if (!themeColorMeta) return;
    if (html.classList.contains('dark-mode')) {
      themeColorMeta.setAttribute('content', '#1a1a1a');
    } else {
      themeColorMeta.setAttribute('content', accentColor || '#ffffff');
    }
  }

  window.addEventListener('pageshow', syncThemeColor);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) syncThemeColor();
  });
})();

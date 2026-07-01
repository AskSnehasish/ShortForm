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
     Dark Mode
     ========================================== */

  var html = document.documentElement;
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
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
      if (themeColorMeta) themeColorMeta.setAttribute('content', '#1a1a1a');
    } else {
      html.classList.remove('dark-mode');
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
          } else if (currentScrollY < lastScrollY - 20) {
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

  /* ==========================================
     Scroll Reveal (Intersection Observer)
     ========================================== */

  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-40px 0px', threshold: 0 });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();

(function () {
  'use strict';

  /* ==========================================
     Settings from Ghost Admin
     ========================================== */

  var metaAccent = document.querySelector('meta[name="ghost:accent-color"]');
  var metaTinted = document.querySelector('meta[name="ghost:tinted-bg"]');
  var metaScheme = document.querySelector('meta[name="ghost:color-scheme"]');
  var accentColor = (metaAccent && metaAccent.getAttribute('content')) || '#2563eb';
  var tintedBg = !(metaTinted && metaTinted.getAttribute('content') === 'false');
  var colorScheme = (metaScheme && metaScheme.getAttribute('content')) || 'light';

  /* ==========================================
     Accent-based Background (Light Mode)
     ========================================== */

  var html = document.documentElement;
  var tintedProps = {};

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

  function computeTintedProps() {
    var r = hexToRgb(accentColor);
    if (!r) return;
    var hsl = rgbToHsl(r.r, r.g, r.b);
    var h = hsl.h, s = hsl.s;
    tintedProps = {
      '--color-bg': 'hsl(' + h + ', ' + Math.min(s * 0.4, 8) + '%, 97%)',
      '--color-border': 'hsl(' + h + ', ' + Math.min(s * 0.6, 12) + '%, 92%)',
      '--color-selection': 'hsl(' + h + ', 40%, 88%)',
      '--color-link-underline': 'hsl(' + h + ', 60%, 40%, 0.2)'
    };
  }

  // Pre-compute tinted values
  computeTintedProps();

  // Always set accent color (works in all modes)
  var r = hexToRgb(accentColor);
  if (r) {
    html.style.setProperty('--color-accent', accentColor);
  }

  function applyTinted() {
    if (!tintedBg || html.classList.contains('dark-mode')) return;
    for (var p in tintedProps) html.style.setProperty(p, tintedProps[p]);
  }

  function removeTinted() {
    for (var p in tintedProps) html.style.removeProperty(p);
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
      removeTinted();
    } else {
      html.classList.remove('dark-mode');
      applyTinted();
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
     Search
     ========================================== */

  var searchToggle = document.querySelector('[data-search-toggle]');
  var searchOverlay = document.querySelector('[data-search-overlay]');
  var searchModal = document.querySelector('[data-search-modal]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchData = [];

  function openSearch() {
    if (!searchOverlay || !searchModal) return;
    searchOverlay.classList.add('open');
    searchModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (searchResults) searchResults.innerHTML = '';
  }

  function closeSearch() {
    if (!searchOverlay || !searchModal) return;
    searchOverlay.classList.remove('open');
    searchModal.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', openSearch);
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', closeSearch);
  }

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal && searchModal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Fetch search data from Ghost's public API
  if (searchInput && searchResults && window.location.origin) {
    var searchUrl = window.location.origin + '/ghost/api/content/posts/?limit=all&include=tags,authors&key=';

    // Try to find the content API key from meta tag or configuration
    var metaKey = document.querySelector('meta[name="ghost-search-key"]');
    if (metaKey) {
      searchUrl += metaKey.getAttribute('content');
    }

    if (metaKey) {
      fetch(searchUrl)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.posts) {
            searchData = data.posts.map(function (p) {
              return {
                title: p.title,
                excerpt: p.custom_excerpt || p.excerpt || '',
                url: p.url,
                slug: p.slug,
              };
            });
          }
        })
        .catch(function () {});
    }

    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase().trim();
      if (!query) {
        searchResults.innerHTML = '';
        return;
      }

      var matches = searchData.filter(function (item) {
        return item.title.toLowerCase().indexOf(query) !== -1 ||
               item.excerpt.toLowerCase().indexOf(query) !== -1;
      });

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">No results found</div>';
        return;
      }

      var html = '';
      matches.slice(0, 10).forEach(function (item) {
        html += '<a href="' + item.url + '" class="search-result-item">' +
                '<div class="search-result-title">' + escapeHtml(item.title) + '</div>' +
                (item.excerpt ? '<div class="search-result-excerpt">' + escapeHtml(item.excerpt.slice(0, 120)) + '</div>' : '') +
                '</a>';
      });
      searchResults.innerHTML = html;
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
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
     Keyboard Navigation for Search
     ========================================== */

  if (searchModal) {
    searchModal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
    });
  }
})();

/* ============================================================
   SPA Router — smooth client-side navigation (no full reload)
   ============================================================ */

(function () {
  var CONTENT_ID  = 'page-content';
  var FADE_MS     = 180;
  var controller  = null;

  /* ---------- helpers ---------- */

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function isInternal(a) {
    if (!a) return false;
    if (a.target === '_blank') return false;
    if (a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return false;
    return a.hostname === location.hostname;
  }

  /* ---------- re-initialise per-page behaviours ---------- */

  function reinitNav() {
    var page = currentPage();
    document.querySelectorAll('.nav-links a, .footer-links a').forEach(function (a) {
      a.classList.remove('active');
      var href = a.getAttribute('href');
      if (href === page) a.classList.add('active');
    });
    document.querySelectorAll('.bottom-nav-item').forEach(function (a) {
      a.classList.remove('active');
      var href = a.getAttribute('href');
      if (href === page) a.classList.add('active');
    });
  }

  function reinitFade() {
    var els = document.querySelectorAll('#' + CONTENT_ID + ' .fade-in');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { el.classList.remove('visible'); obs.observe(el); });
  }

  function reinitCopy() {
    var btn   = document.getElementById('copyLinkBtn');
    var input = document.getElementById('shareUrl');
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var val = input.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).catch(function () { input.select(); document.execCommand('copy'); });
      } else {
        input.select(); document.execCommand('copy');
      }
      btn.textContent = (window.RHCi18n ? window.RHCi18n.get('btn_copied') : '✓ Copied!');
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = (window.RHCi18n ? window.RHCi18n.get('btn_copyLink') : 'Copy Link');
        btn.classList.remove('copied');
      }, 2200);
    });
  }

  function reinitDownload() {
    var ua           = navigator.userAgent;
    var isIos        = /iphone|ipad|ipod/i.test(ua);
    var isSafari     = isIos && /safari/i.test(ua) && !/crios|fxios|opios|mercury/i.test(ua);
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;
    if (isIos && isSafari) {
      var note = document.getElementById('iosInstallNote');
      if (note) note.style.display = 'block';
      return;
    }
    var wrap = document.getElementById('inlineInstallWrap');
    var btn  = document.getElementById('inlineInstallBtn');
    if (wrap && btn && window.__rhcDeferredPrompt) {
      wrap.style.display = 'block';
      btn.addEventListener('click', function () {
        if (window.__rhcDeferredPrompt) window.__rhcDeferredPrompt.prompt();
      });
    }
  }

  function reinitBooklet() {
    var btn    = document.getElementById('readBookletBtn');
    var viewer = document.getElementById('bookletViewer');
    if (!btn || !viewer) return;
    btn.addEventListener('click', function () {
      var isOpen = viewer.style.display !== 'none';
      if (isOpen) {
        viewer.style.display = 'none';
        updateBookletBtn(btn, false);
      } else {
        viewer.style.display = 'block';
        updateBookletBtn(btn, true);
        viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function updateBookletBtn(btn, isOpen) {
    var icon = btn.querySelector('i');
    var span = btn.querySelector('span');
    if (icon) { icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-book-reader'; }
    if (span) {
      var key = isOpen ? 'btn_closeBooklet' : 'btn_readBooklet';
      span.setAttribute('data-i18n', key);
      span.textContent = (window.RHCi18n ? window.RHCi18n.get(key) : span.textContent);
    }
  }

  function reinitAll() {
    reinitNav();
    reinitFade();
    reinitCopy();
    reinitDownload();
    reinitBooklet();
    if (window.RHCi18n && window.RHCi18n.apply) window.RHCi18n.apply();
  }

  /* ---------- navigation ---------- */

  function navigate(url, push) {
    var main = document.getElementById(CONTENT_ID);
    if (!main) { location.href = url; return; }

    // Cancel any in-flight request
    if (controller) { try { controller.abort(); } catch (e) {} }
    controller = window.AbortController ? new AbortController() : null;

    // Close hamburger if open
    var ham = document.querySelector('.hamburger.open');
    if (ham) {
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      var nl = document.querySelector('.nav-links');
      if (nl) nl.classList.remove('open');
    }

    // Fade out
    main.style.transition = 'opacity ' + FADE_MS + 'ms ease, transform ' + FADE_MS + 'ms ease';
    main.style.opacity    = '0';
    main.style.transform  = 'translateY(10px)';

    var opts = controller ? { signal: controller.signal } : {};
    fetch(url, opts)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc  = new DOMParser().parseFromString(html, 'text/html');
        var next = doc.getElementById(CONTENT_ID);
        if (!next) { location.href = url; return; }

        setTimeout(function () {
          main.innerHTML    = next.innerHTML;
          document.title    = doc.title;

          if (push !== false) history.pushState({ url: url }, doc.title, url);

          // Reset: snap to top-start invisible position, then fade in
          main.style.transition = 'none';
          main.style.opacity    = '0';
          main.style.transform  = 'translateY(-8px)';
          main.getBoundingClientRect(); // force reflow

          main.style.transition = 'opacity ' + FADE_MS + 'ms ease, transform ' + FADE_MS + 'ms ease';
          main.style.opacity    = '1';
          main.style.transform  = 'translateY(0)';

          window.scrollTo({ top: 0, behavior: 'instant' });
          reinitAll();
          controller = null;
        }, FADE_MS);
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        location.href = url;
      });
  }

  /* ---------- event wiring ---------- */

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !isInternal(a)) return;
    var dest = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (dest === currentPage()) return;
    e.preventDefault();
    navigate(a.getAttribute('href'));
  });

  window.addEventListener('popstate', function () {
    navigate(location.href, false);
  });

  // Seed initial history entry
  history.replaceState({ url: location.href }, document.title, location.href);

  // Expose for external calls (e.g. after i18n toggle)
  window.RHCRouter = { reinit: reinitAll };
})();

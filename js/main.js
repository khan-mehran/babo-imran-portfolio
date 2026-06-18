/* ============================================================
   Babu Imran Qureshi — Portfolio Site — main.js
   ============================================================ */

// ---------- Hamburger Menu ----------
(function () {
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    var expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---------- Scroll Fade-In ----------
(function () {
  var elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
})();

// ---------- Active Nav Link ----------
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ---------- Copy Link Button ----------
(function () {
  var btn   = document.getElementById('copyLinkBtn');
  var input = document.getElementById('shareUrl');
  if (!btn || !input) return;

  btn.addEventListener('click', function () {
    var value = input.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).catch(function () {
        input.select(); document.execCommand('copy');
      });
    } else {
      input.select(); document.execCommand('copy');
    }
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = 'Copy Link';
      btn.classList.remove('copied');
    }, 2200);
  });
})();

// ---------- PWA Install Bottom Sheet ----------
(function () {
  var ua         = navigator.userAgent;
  var isIos      = /iphone|ipad|ipod/i.test(ua);
  var isSafari   = isIos && /safari/i.test(ua) && !/crios|fxios|opios|mercury/i.test(ua);
  var isAndroid  = /android/i.test(ua);
  var isMobile   = isIos || isAndroid;

  // Don't run on desktop or if already installed
  var isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isStandalone) return;

  // Don't show if user dismissed during this session
  if (sessionStorage.getItem('rhc-pwa-dismissed')) return;

  var deferredPrompt = null;
  var sheetEl = null;
  var backdropEl = null;

  // ---- Build Android bottom sheet HTML ----
  function buildAndroidSheet() {
    return [
      '<div class="pwa-sheet-handle"></div>',
      '<div class="pwa-sheet-header">',
      '  <div class="pwa-sheet-app-icon">',
      '    <i class="fa-solid fa-moon"></i>',
      '    <span>RHC</span>',
      '  </div>',
      '  <div class="pwa-sheet-meta">',
      '    <h3>Rafiq-e-Hujjaj Guide</h3>',
      '    <p>rafiq-e-hujjaj committee</p>',
      '  </div>',
      '  <button class="pwa-sheet-close" id="pwaSheetClose" aria-label="Dismiss">',
      '    <i class="fa-solid fa-xmark"></i>',
      '  </button>',
      '</div>',
      '<div class="pwa-sheet-divider"></div>',
      '<div class="pwa-android-body">',
      '  <ul class="pwa-feature-list">',
      '    <li><i class="fa-solid fa-circle-check"></i> Works offline — no internet needed</li>',
      '    <li><i class="fa-solid fa-circle-check"></i> Installs instantly — no app store needed</li>',
      '    <li><i class="fa-solid fa-circle-check"></i> Hajj booklets, videos &amp; prayer guides</li>',
      '  </ul>',
      '  <div class="pwa-action-row">',
      '    <button class="btn-pwa-later" id="pwaLaterBtn">Not Now</button>',
      '    <button class="btn-pwa-install" id="pwaInstallBtn">',
      '      <i class="fa-solid fa-download"></i> Install App',
      '    </button>',
      '  </div>',
      '</div>',
      '<div class="pwa-safe-area"></div>'
    ].join('');
  }

  // ---- Build iOS bottom sheet HTML ----
  function buildIosSheet() {
    return [
      '<div class="pwa-sheet-handle"></div>',
      '<div class="pwa-sheet-header">',
      '  <div class="pwa-sheet-app-icon">',
      '    <i class="fa-solid fa-moon"></i>',
      '    <span>RHC</span>',
      '  </div>',
      '  <div class="pwa-sheet-meta">',
      '    <h3>Install on iPhone</h3>',
      '    <p>Add to your Home Screen</p>',
      '  </div>',
      '  <button class="pwa-sheet-close" id="pwaSheetClose" aria-label="Dismiss">',
      '    <i class="fa-solid fa-xmark"></i>',
      '  </button>',
      '</div>',
      '<div class="pwa-sheet-divider"></div>',
      '<div class="pwa-ios-body">',
      '  <div class="pwa-ios-steps">',
      '    <div class="pwa-ios-step">',
      '      <span class="pwa-step-num">1</span>',
      '      <span>Tap the <span class="pwa-ios-icon">',
      '        <i class="fa-solid fa-arrow-up-from-bracket"></i>',
      '      </span> <strong>Share</strong> button at the bottom of Safari</span>',
      '    </div>',
      '    <div class="pwa-ios-step">',
      '      <span class="pwa-step-num">2</span>',
      '      <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>',
      '    </div>',
      '    <div class="pwa-ios-step">',
      '      <span class="pwa-step-num">3</span>',
      '      <span>Tap <strong>"Add"</strong> in the top-right corner</span>',
      '    </div>',
      '  </div>',
      '  <button class="btn-pwa-gotit" id="pwaGotItBtn">Got it</button>',
      '</div>',
      '<div class="pwa-safe-area"></div>'
    ].join('');
  }

  // ---- Inject elements into DOM ----
  function mountSheet(htmlContent) {
    backdropEl = document.createElement('div');
    backdropEl.className = 'pwa-backdrop';
    backdropEl.id = 'pwaBackdrop';
    document.body.appendChild(backdropEl);

    sheetEl = document.createElement('div');
    sheetEl.className = 'pwa-sheet';
    sheetEl.id = 'pwaSheet';
    sheetEl.setAttribute('role', 'dialog');
    sheetEl.setAttribute('aria-modal', 'true');
    sheetEl.setAttribute('aria-label', 'Install app');
    sheetEl.innerHTML = htmlContent;
    document.body.appendChild(sheetEl);

    // Wire up close handlers
    sheetEl.addEventListener('click', function (e) {
      var t = e.target;
      if (t.id === 'pwaSheetClose' || t.closest('#pwaSheetClose') ||
          t.id === 'pwaLaterBtn'   || t.closest('#pwaLaterBtn')  ||
          t.id === 'pwaGotItBtn'   || t.closest('#pwaGotItBtn')) {
        dismissSheet();
      }
      if (t.id === 'pwaInstallBtn' || t.closest('#pwaInstallBtn')) {
        triggerInstall();
      }
    });

    backdropEl.addEventListener('click', dismissSheet);
  }

  function showSheet() {
    if (!sheetEl) return;
    // Force a reflow so the transition plays
    sheetEl.getBoundingClientRect();
    backdropEl.classList.add('show');
    sheetEl.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function dismissSheet() {
    if (!sheetEl) return;
    backdropEl.classList.remove('show');
    sheetEl.classList.remove('show');
    document.body.style.overflow = '';
    sessionStorage.setItem('rhc-pwa-dismissed', '1');
  }

  function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () {
      deferredPrompt = null;
      dismissSheet();
    });
  }

  // ---- Platform routing ----

  // iOS Safari: show after 2.5s
  if (isIos && isSafari) {
    mountSheet(buildIosSheet());
    setTimeout(showSheet, 2500);
    return;
  }

  // iOS but not Safari: don't show (user needs to open in Safari first)
  if (isIos && !isSafari) return;

  // Android Chrome / desktop Chrome: wait for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    window.__rhcDeferredPrompt = e; // expose for download page inline button

    if (!sheetEl) {
      mountSheet(buildAndroidSheet());
    }
    // Show after 2s so the page has time to load
    setTimeout(showSheet, 2000);
  });

  // Hide if user installs via browser's own UI
  window.addEventListener('appinstalled', function () {
    dismissSheet();
    sessionStorage.removeItem('rhc-pwa-dismissed');
  });
})();

// ---------- Register Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  });
}

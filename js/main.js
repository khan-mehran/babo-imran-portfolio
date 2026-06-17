/* ============================================================
   Babu Imran Qureshi — Portfolio Site — main.js
   ============================================================ */

// ---------- Hamburger Menu ----------
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

// ---------- Scroll Fade-In ----------
(function () {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
})();

// ---------- Active Nav Link ----------
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ---------- Copy Link Button ----------
(function () {
  const btn   = document.getElementById('copyLinkBtn');
  const input = document.getElementById('shareUrl');
  if (!btn || !input) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(input.value);
    } catch {
      input.select();
      document.execCommand('copy');
    }
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy Link';
      btn.classList.remove('copied');
    }, 2200);
  });
})();

// ---------- PWA: beforeinstallprompt ----------
(function () {
  let deferredPrompt = null;
  const prompt     = document.getElementById('pwaPrompt');
  const installBtn = document.getElementById('pwaInstall');
  const dismissBtn = document.getElementById('pwaDismiss');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (prompt) prompt.classList.add('show');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (prompt) prompt.classList.remove('show');
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      if (prompt) prompt.classList.remove('show');
    });
  }
})();

// ---------- Register Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

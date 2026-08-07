/* =========================================================
   QAROO 3 — MAIN JAVASCRIPT (WIX DAVON TEMPLATE STYLE)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. HEADER SCROLL EFFECT ─────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 2. MOBILE DRAWER ────────────────────────────────────
  const burgerBtn    = document.getElementById('burger-btn');
  const drawer       = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose  = document.getElementById('drawer-close');

  const openDrawer = () => {
    drawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  burgerBtn?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  // ── 3. SEARCH OVERLAY ───────────────────────────────────
  const searchTrigger = document.getElementById('search-trigger');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose   = document.getElementById('search-close');
  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const openSearch = () => {
    searchOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 150);
  };
  const closeSearch = () => {
    searchOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  };

  searchTrigger?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); }
  });

  // Live Search
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q || !window.QAROO_COURSES || !searchResults) {
      if (searchResults) searchResults.innerHTML = '';
      return;
    }
    const matches = window.QAROO_COURSES.filter(c =>
      c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
    if (!matches.length) {
      searchResults.innerHTML = `<div class="search-result-item"><p class="search-result-desc">No courses found for "${q}"</p></div>`;
      return;
    }
    searchResults.innerHTML = matches.slice(0, 8).map(c => `
      <div class="search-result-item">
        <a href="${c.url}">
          <p class="search-result-title">${c.title}</p>
          <p class="search-result-desc">${c.desc.substring(0, 90)}...</p>
        </a>
      </div>
    `).join('');
  });

  // ── 4. SCROLL REVEAL ANIMATIONS ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── 5. ACTIVE NAV LINK ──────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 6. SMOOTH COUNT-UP ON STATS ─────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const update = (time) => {
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ── 7. FORM SUBMISSION ───────────────────────────────────
  document.querySelectorAll('form[data-qaroo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn?.textContent;
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.textContent = '✓ Submitted!'; btn.style.background = '#22c55e'; }
        setTimeout(() => {
          if (btn) { btn.textContent = original; btn.disabled = false; btn.style.background = ''; }
          form.reset();
        }, 3000);
      }, 1200);
    });
  });

});

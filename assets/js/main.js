/* ═══════════════════════════════════════════════
   QAROO — EDITORIAL DARK-TECH — MAIN.JS v8.0
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Scroll Progress ────────────────────────── */
  const prog = document.getElementById('scroll-progress');
  if (prog) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    }, { passive: true });
  }

  /* ── Preloader ──────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const p = document.getElementById('preloader');
      if (p) p.classList.add('done');
    }, 1400);
  });

  /* ── Sticky Nav ─────────────────────────────── */
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    if ((a.getAttribute('href') || '') === page) a.classList.add('active');
  });

  /* ── Mobile Drawer ──────────────────────────── */
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('m-drawer');
  const dClose = document.getElementById('drawer-close');
  if (burger && drawer) {
    burger.addEventListener('click', () => { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; });
  }
  if (dClose && drawer) {
    dClose.addEventListener('click', () => { drawer.classList.remove('open'); document.body.style.overflow = ''; });
  }

  /* ── Search ─────────────────────────────────── */
  const sTrigger  = document.getElementById('search-trigger');
  const sOverlay  = document.getElementById('search-overlay');
  const sClose    = document.getElementById('search-close');
  const sInput    = document.getElementById('search-input');
  const sResults  = document.getElementById('search-results');

  function openSearch()  { sOverlay && sOverlay.classList.add('open'); setTimeout(() => sInput && sInput.focus(), 80); }
  function closeSearch() {
    sOverlay && sOverlay.classList.remove('open');
    if (sInput)   sInput.value = '';
    if (sResults) sResults.innerHTML = '';
  }

  sTrigger && sTrigger.addEventListener('click', openSearch);
  sClose   && sClose.addEventListener('click', closeSearch);
  sOverlay && sOverlay.addEventListener('click', e => { if (e.target === sOverlay) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); if ((e.metaKey||e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); } });

  if (sInput && sResults) {
    sInput.addEventListener('input', () => {
      const q = sInput.value.trim().toLowerCase();
      if (!q || !window.QAROO_COURSES) { sResults.innerHTML = ''; return; }
      const hits = window.QAROO_COURSES.filter(c =>
        c.title.toLowerCase().includes(q) || (c.category||'').toLowerCase().includes(q)
      ).slice(0, 7);
      if (!hits.length) {
        sResults.innerHTML = '<div style="padding:18px 20px;font-size:13px;color:rgba(255,255,255,0.25);font-family:var(--mono);">No programs found.</div>';
        return;
      }
      sResults.innerHTML = hits.map(c => `
        <a href="${c.url}" class="s-item">
          <div class="s-ico">📚</div>
          <div>
            <div class="s-title">${c.title}</div>
            <div class="s-cat">${c.category}</div>
          </div>
        </a>`).join('');
    });
  }

  /* ── Scroll-to-top ──────────────────────────── */
  const stopBtn = document.getElementById('scroll-top');
  if (stopBtn) {
    window.addEventListener('scroll', () => stopBtn.classList.toggle('vis', window.scrollY > 500), { passive: true });
    stopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Reveal on Scroll ───────────────────────── */
  const rvEls = document.querySelectorAll('.rv');
  if (rvEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    rvEls.forEach(el => io.observe(el));
  }

  /* ── Counter Animation ──────────────────────── */
  function countUp(el, to, dur = 2000) {
    let start = 0; const step = to / (dur / 16);
    const tick = () => {
      start = Math.min(start + step, to);
      el.textContent = Math.floor(start).toLocaleString('en-IN') + (el.dataset.suffix || '');
      if (start < to) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target, +e.target.dataset.count); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  }

  /* ── Course Row Image Follow Mouse ─────────── */
  document.querySelectorAll('.course-row').forEach(row => {
    const img = row.querySelector('.course-row-img');
    if (!img) return;
    row.addEventListener('mousemove', e => {
      img.style.left = (e.clientX + 20) + 'px';
      img.style.top  = (e.clientY - 80) + 'px';
    });
  });

  /* ── Course Filter ──────────────────────────── */
  const lfBtns = document.querySelectorAll('.lf');
  const cRows  = document.querySelectorAll('.course-row[data-cat]');
  if (lfBtns.length && cRows.length) {
    lfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lfBtns.forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const cat = btn.dataset.cat;
        cRows.forEach(r => {
          const show = cat === 'all' || r.dataset.cat === cat;
          r.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── Forms ──────────────────────────────────── */
  document.querySelectorAll('[data-qform]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"],.cd-submit,.co-submit');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Sent ✓';
        btn.style.background = '#16a34a';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3000);
      }
    });
  });

})();

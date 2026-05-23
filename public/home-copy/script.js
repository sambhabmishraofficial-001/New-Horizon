/* ═══════════════════════════════════════
   New Horizon - Main Script
   Matches Edison Scientific interactions
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLenisSmoothScroll();
  initThemeToggle();
  initMobileMenu();
  initAccordion();
  initCarousel();
  initStatsGraph();
  initStatCounter();
  initScrollReveal();
  initSmoothScroll();
  initActiveNav();
  initNavScroll();
  initContactForm();
  initFooterForm();
  initSelectionBinaryOverlay();
});

/* ═══════════════════════════════════════
   TEXT SELECTION - binary (0/1) overlay
   (same technique as tetsuwan.com: semi-transparent canvas over selection bbox)
   ═══════════════════════════════════════ */
const BINARY_OVERLAY_CHARS = '01';

function initSelectionBinaryOverlay() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.selectionOverlay = 'binary';
  Object.assign(canvas.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    display: 'none',
  });
  document.body.appendChild(canvas);

  let raf = 0;

  function paint() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function draw() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      canvas.style.display = 'none';
      return;
    }

    const rects = Array.from(sel.getRangeAt(0).getClientRects());
    if (!rects.length) {
      canvas.style.display = 'none';
      return;
    }

    let minL = Infinity;
    let minT = Infinity;
    let maxR = 0;
    let maxB = 0;
    for (const r of rects) {
      if (r.width < 1 || r.height < 1) continue;
      minL = Math.min(minL, r.left);
      minT = Math.min(minT, r.top);
      maxR = Math.max(maxR, r.right);
      maxB = Math.max(maxB, r.bottom);
    }

    if (minL >= maxR || minT >= maxB) {
      canvas.style.display = 'none';
      return;
    }

    const w = maxR - minL;
    const h = maxB - minT;
    const dpr = window.devicePixelRatio || 1;

    canvas.style.display = 'block';
    canvas.style.left = `${minL}px`;
    canvas.style.top = `${minT}px`;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.ceil(w * dpr);
    canvas.height = Math.ceil(h * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '9px "Artific Variable", "Open Sans", sans-serif';
    ctx.textBaseline = 'top';

    const seq = BINARY_OVERLAY_CHARS;

    for (const e of rects) {
      if (e.width < 1 || e.height < 1) continue;
      const ox = e.left - minL;
      const oy = e.top - minT;
      ctx.fillStyle = 'rgba(61, 126, 255, 0.08)';
      ctx.fillRect(ox, oy, e.width, e.height);

      const cols = Math.ceil(e.width / 7);
      const rows = Math.ceil(e.height / 11);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const xorResult =
            0x9e3779b1 * (col + Math.floor(e.left)) ^
            0x85ebca77 * (row + Math.floor(e.top));
          const a = ((65535 & xorResult) >>> 0) / 65535;
          if (a < 0.45) continue;
          const alpha = 0.25 + 0.35 * a;
          ctx.fillStyle = `rgba(61, 126, 255, ${alpha.toFixed(2)})`;
          const ch = seq[Math.floor(a * seq.length) % seq.length];
          ctx.fillText(ch, ox + 7 * col, oy + 11 * row + 1);
        }
      }
    }
  }

  document.addEventListener('selectionchange', paint);
  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint, { passive: true });
}

/* ═══════════════════════════════════════
   LENIS SMOOTH SCROLL
   ═══════════════════════════════════════ */
function initLenisSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.__lenis = lenis;
}

function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (_error) {
    return null;
  }
}

function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  document.querySelectorAll('.theme-toggle').forEach(button => {
    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function themeTogglePrefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_e) {
    return false;
  }
}

function setThemeRevealOriginFromButton(button) {
  const rect = button.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const maxR = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy)
  );
  const root = document.documentElement;
  root.style.setProperty('--theme-reveal-x', `${cx}px`);
  root.style.setProperty('--theme-reveal-y', `${cy}px`);
  root.style.setProperty('--theme-reveal-r', `${maxR}px`);
}

function toggleThemeFromClick(button) {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  const persistAndApply = () => {
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (_error) {
      // Ignore storage failures and still apply the theme for this session.
    }
    applyTheme(nextTheme);
  };

  if (typeof document.startViewTransition !== 'function' || themeTogglePrefersReducedMotion()) {
    persistAndApply();
    return;
  }

  setThemeRevealOriginFromButton(button);
  document.startViewTransition(persistAndApply);
}

function initThemeToggle() {
  const buttons = document.querySelectorAll('.theme-toggle');
  if (!buttons.length) return;

  applyTheme(getPreferredTheme());

  buttons.forEach(button => {
    button.addEventListener('click', () => toggleThemeFromClick(button));
  });

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = event => {
    if (getStoredTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light');
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemThemeChange);
  }
}


function initMobileMenu() {
  const toggle = document.getElementById('nav-mobile-toggle');
  const overlay = document.getElementById('mobile-overlay');
  if (!toggle || !overlay) return;

  const links = overlay.querySelectorAll('.mobile-overlay__link');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(l => l.addEventListener('click', () => {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ═══════════════════════════════════════
   ACCORDION
   ═══════════════════════════════════════ */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  items.forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });
}

/* ═══════════════════════════════════════
   CAROUSEL / SLIDER
   ═══════════════════════════════════════ */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const counter = document.getElementById('carousel-counter');
  const badge = document.getElementById('carousel-badge');

  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  let autoTimer = null;

  function show(i) {
    slides.forEach(s => s.classList.remove('is-active'));
    slides[i].classList.add('is-active');
    current = i;
    if (counter) counter.textContent = `${i + 1}/${total}`;
    if (badge) {
      const t = slides[i].getAttribute('data-badge');
      if (t) badge.textContent = t;
    }

    // Text animation
    const p = slides[i].querySelector('.body-text');
    if (p) {
      p.style.opacity = '0';
      p.style.transform = 'translateY(12px)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }));
    }
  }

  function next() { show((current + 1) % total); }
  function prev() { show((current - 1 + total) % total); }
  function startAuto() { autoTimer = setInterval(next, 5000); }
  function stopAuto() { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  show(0);
  startAuto();
}

/* ═══════════════════════════════════════
   STATS - PERFORMANCE GRAPH
   ═══════════════════════════════════════ */
function initStatsGraph() {
  const bars = {
    traditional: document.getElementById('bar-traditional'),
    galactus: document.getElementById('bar-galactus')
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Traditional bar: 100% width
        if (bars.traditional) bars.traditional.style.width = '100%';
        // Galactus bar: 1/180th width (but make it slightly visible for effect, e.g. 1%)
        if (bars.galactus) bars.galactus.style.width = '2%';
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const container = document.querySelector('.stats-graph-container');
  if (container) observer.observe(container);
}

/* ═══════════════════════════════════════
   STAT COUNTER ANIMATION
   ═══════════════════════════════════════ */
function initStatCounter() {
  const el = document.getElementById('stat-counter');
  if (!el) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        animateCount(el, 0, 120, 3000);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(el);
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.stats-comparison, .feature-rows, .accordion, .news-grid, ' +
    '.platform-intro, .carousel-section, .drug-steps, ' +
    '.testimonial, .cta-section, .contact-grid'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const id = decodeURIComponent(href.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ═══════════════════════════════════════
   ACTIVE NAV
   ═══════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ═══════════════════════════════════════
   NAV SCROLL HIDE
   ═══════════════════════════════════════ */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current > lastScroll && current > 200) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.classList.add('show');
  });
}

/* ═══════════════════════════════════════
   FOOTER FORM
   ═══════════════════════════════════════ */
function initFooterForm() {
  const form = document.getElementById('footer-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input) {
      input.value = '';
      input.placeholder = 'Thank you!';
      setTimeout(() => { input.placeholder = 'Enter your email'; }, 3000);
    }
  });
}

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCursor();
  initCounters();
  initMobileNav();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }

  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 7,
      speed: 450,
      glare: false,
      scale: 1.015,
      perspective: 900,
    });
  }
});

// ---- Navigation scroll state ----
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ---- Custom cursor ----
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let fx = mx, fy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  }, { passive: true });

  (function followLoop() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followLoop);
  })();

  // Grow on hover
  document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

// ---- Animated counters ----
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      animateCounter(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const prefix   = el.dataset.prefix  || '';
  const suffix   = el.dataset.suffix  || '';
  const duration = 1800;
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const val  = Math.floor(ease * target);
    el.textContent = prefix + val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}

// ---- Mobile navigation ----
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  const cta    = document.getElementById('nav-cta');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    if (links) links.classList.toggle('open', open);
    if (cta)   cta.classList.toggle('open', open);
  });

  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      if (links) links.classList.remove('open');
      if (cta)   cta.classList.remove('open');
    });
  });
}

// ---- GSAP Scroll Animations ----
function initGSAP() {
  // Hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  heroTl
    .from('.hero-badge',    { opacity: 0, y: 18, duration: 0.7, delay: 0.2 })
    .from('.hero-title',    { opacity: 0, y: 42, duration: 0.9 }, '-=0.4')
    .from('.hero-subtitle', { opacity: 0, y: 28, duration: 0.7 }, '-=0.5')
    .from('.hero-cta',      { opacity: 0, y: 24, duration: 0.6 }, '-=0.4')
    .from('.hero-stats',    { opacity: 0, y: 18, duration: 0.6 }, '-=0.3');

  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      opacity: 0, y: 32, duration: 0.7, ease: 'power2.out',
    });
  });

  // Step cards
  const stepCards = document.querySelectorAll('.step-card');
  if (stepCards.length) {
    gsap.from(stepCards, {
      scrollTrigger: { trigger: '.steps-grid', start: 'top 78%', once: true },
      opacity: 0, y: 44, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    });
  }

  // Plan cards
  const planCards = document.querySelectorAll('.plan-card');
  if (planCards.length) {
    gsap.from(planCards, {
      scrollTrigger: { trigger: '.plans-grid', start: 'top 78%', once: true },
      opacity: 0, y: 44, duration: 0.65, stagger: 0.1, ease: 'power2.out',
    });
  }

  // Feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length) {
    gsap.from(featureCards, {
      scrollTrigger: { trigger: '.features-grid', start: 'top 78%', once: true },
      opacity: 0, y: 40, duration: 0.65, stagger: 0.1, ease: 'power2.out',
    });
  }

  // Testimonial cards
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  if (testimonialCards.length) {
    gsap.from(testimonialCards, {
      scrollTrigger: { trigger: '.testimonials-grid', start: 'top 78%', once: true },
      opacity: 0, y: 40, duration: 0.65, stagger: 0.15, ease: 'power2.out',
    });
  }

  // CTA
  gsap.from('.cta-content', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 72%', once: true },
    opacity: 0, scale: 0.96, duration: 0.8, ease: 'power2.out',
  });
}

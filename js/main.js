'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCursor();
  initCounters();
  initMobileNav();
  initFAQ();
  initPayoutsFeed();

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

// ---- FAQ Accordion ----
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all open items
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ---- Live Payouts Feed ----
const PAYOUT_POOL = [
  { initials: 'AK', name: 'Alex K.',    flag: 'US', account: '$100K', amount: 4200  },
  { initials: 'MR', name: 'Marcus R.',  flag: 'GB', account: '$200K', amount: 11800 },
  { initials: 'SL', name: 'Sarah L.',   flag: 'AU', account: '$50K',  amount: 2640  },
  { initials: 'JT', name: 'James T.',   flag: 'CA', account: '$25K',  amount: 1450  },
  { initials: 'DP', name: 'David P.',   flag: 'DE', account: '$100K', amount: 6900  },
  { initials: 'NA', name: 'Nina A.',    flag: 'AE', account: '$50K',  amount: 3100  },
  { initials: 'RB', name: 'Ryan B.',    flag: 'ZA', account: '$200K', amount: 15200 },
  { initials: 'KM', name: 'Kenji M.',   flag: 'JP', account: '$100K', amount: 5400  },
  { initials: 'LC', name: 'Luca C.',    flag: 'IT', account: '$50K',  amount: 2950  },
  { initials: 'FS', name: 'Fatima S.',  flag: 'MA', account: '$25K',  amount: 1320  },
  { initials: 'OA', name: 'Omar A.',    flag: 'EG', account: '$100K', amount: 7800  },
  { initials: 'PK', name: 'Pavel K.',   flag: 'PL', account: '$50K',  amount: 4100  },
  { initials: 'TW', name: 'Tom W.',     flag: 'NZ', account: '$200K', amount: 18600 },
  { initials: 'YN', name: 'Yui N.',     flag: 'JP', account: '$50K',  amount: 2200  },
  { initials: 'EM', name: 'Elena M.',   flag: 'RO', account: '$100K', amount: 8300  },
];

const FLAGS = {
  US:'🇺🇸', GB:'🇬🇧', AU:'🇦🇺', CA:'🇨🇦', DE:'🇩🇪',
  AE:'🇦🇪', ZA:'🇿🇦', JP:'🇯🇵', IT:'🇮🇹', MA:'🇲🇦',
  EG:'🇪🇬', PL:'🇵🇱', NZ:'🇳🇿', RO:'🇷🇴',
};

function relativeTime(seconds) {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function createPayoutCard(data, ageSeconds) {
  const card = document.createElement('div');
  card.className = 'payout-card';
  const flag = FLAGS[data.flag] || '';
  const amt = '$' + data.amount.toLocaleString();
  card.innerHTML = `
    <div class="payout-avatar">${data.initials}</div>
    <div class="payout-info">
      <div class="payout-name">${data.name} ${flag}</div>
      <div class="payout-meta">${data.account} account · ${relativeTime(ageSeconds)}</div>
    </div>
    <div class="payout-amount">${amt}</div>
  `;
  return card;
}

function initPayoutsFeed() {
  const feed = document.getElementById('payouts-feed');
  if (!feed) return;

  const MAX_CARDS = 9;
  const shuffled = [...PAYOUT_POOL].sort(() => Math.random() - 0.5);
  const initial = shuffled.slice(0, MAX_CARDS);

  initial.forEach((data, i) => {
    const card = createPayoutCard(data, (i + 1) * 43 + Math.floor(Math.random() * 30));
    feed.appendChild(card);
  });

  let poolIndex = MAX_CARDS % PAYOUT_POOL.length;

  // Swap a random card every 4-6 seconds
  function addNewPayout() {
    const cards = feed.querySelectorAll('.payout-card:not(.removing)');
    if (!cards.length) return;

    const toRemove = cards[Math.floor(Math.random() * cards.length)];
    toRemove.classList.add('removing');

    setTimeout(() => {
      const newData = PAYOUT_POOL[poolIndex % PAYOUT_POOL.length];
      poolIndex++;
      const newCard = createPayoutCard(newData, Math.floor(Math.random() * 15) + 1);
      feed.replaceChild(newCard, toRemove);
    }, 350);
  }

  function scheduleNext() {
    const delay = 4000 + Math.random() * 2500;
    setTimeout(() => {
      addNewPayout();
      scheduleNext();
    }, delay);
  }

  // Only start when section is visible
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      scheduleNext();
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(feed);
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

  // Comparison table
  gsap.from('.comparison-table', {
    scrollTrigger: { trigger: '.comparison-table', start: 'top 80%', once: true },
    opacity: 0, y: 36, duration: 0.7, ease: 'power2.out',
  });

  // Payout cards
  gsap.from('.payouts-header-row', {
    scrollTrigger: { trigger: '.payouts-header-row', start: 'top 82%', once: true },
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
  });

  // FAQ items
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    gsap.from(faqItems, {
      scrollTrigger: { trigger: '.faq-list', start: 'top 78%', once: true },
      opacity: 0, y: 28, duration: 0.55, stagger: 0.08, ease: 'power2.out',
    });
  }
}

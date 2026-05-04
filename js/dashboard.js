'use strict';

/* ============================================================
   SUPERFUNDED — DASHBOARD JS
   ============================================================ */

// ── Greeting ──────────────────────────────────────────────────
(function initGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const hour = new Date().getHours();
  let period;
  if (hour < 12)      period = 'morning';
  else if (hour < 18) period = 'afternoon';
  else                period = 'evening';
  el.textContent = `Good ${period}, Alex 👋`;
})();

// ── Date / Time Display ───────────────────────────────────────
(function initDateTime() {
  const el = document.getElementById('topbarDate');
  if (!el) return;

  function render() {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('en-US', opts);
  }

  render();
  // Refresh once per minute
  setInterval(render, 60000);
})();

// ── Equity Curve Chart ────────────────────────────────────────
(function initEquityChart() {
  const canvas = document.getElementById('equityChart');
  if (!canvas || typeof Chart === 'undefined') return;

  // Generate 30 data points from Apr 1 to Apr 30
  const startBalance = 100000;
  const endBalance   = 104320;
  const numPoints    = 30;

  // Build labels (Apr 1 … Apr 30)
  const labels = [];
  const base = new Date(2026, 3, 1); // April 1 2026
  for (let i = 0; i < numPoints; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const month = d.toLocaleString('en-US', { month: 'short' });
    labels.push(`${month} ${d.getDate()}`);
  }

  // Generate realistic equity curve with upward drift + noise
  const seed = (function makeLCG() {
    let s = 42;
    return function() {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  })();

  const values = [];
  const totalGain = endBalance - startBalance;
  let current = startBalance;

  for (let i = 0; i < numPoints; i++) {
    if (i === 0) {
      values.push(current);
      continue;
    }
    const progress   = i / (numPoints - 1);
    const drift      = (totalGain / numPoints) * (0.6 + seed() * 0.8);
    const noise      = (seed() - 0.48) * 600;
    const pullToPath = (startBalance + totalGain * progress - current) * 0.25;
    current = current + drift + noise + pullToPath;
    // Clamp so it never drops below start and ends near target
    current = Math.max(current, startBalance - 400);
    values.push(Math.round(current));
  }
  // Force last point to exact target
  values[numPoints - 1] = endBalance;

  const ctx = canvas.getContext('2d');

  // Red gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight || 260);
  gradient.addColorStop(0,   'rgba(230, 57, 70, 0.35)');
  gradient.addColorStop(0.5, 'rgba(230, 57, 70, 0.10)');
  gradient.addColorStop(1,   'rgba(230, 57, 70, 0.00)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Equity',
        data: values,
        borderColor: '#E63946',
        borderWidth: 2.5,
        backgroundColor: gradient,
        fill: true,
        tension: 0.42,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#E63946',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      animation: {
        duration: 1400,
        easing: 'easeInOutQuart',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          borderColor: 'rgba(230,57,70,0.3)',
          borderWidth: 1,
          titleColor: '#9a9a9a',
          bodyColor: '#ffffff',
          titleFont: { family: 'Inter', size: 11, weight: '500' },
          bodyFont: { family: 'Bebas Neue', size: 18 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed.y;
              return '$' + val.toLocaleString('en-US');
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255,255,255,0.03)',
            drawBorder: false,
          },
          ticks: {
            color: '#555555',
            font: { family: 'Inter', size: 10 },
            maxTicksLimit: 7,
            maxRotation: 0,
          },
          border: { display: false },
        },
        y: {
          position: 'right',
          grid: {
            color: 'rgba(255,255,255,0.04)',
            drawBorder: false,
          },
          ticks: {
            color: '#555555',
            font: { family: 'Inter', size: 10 },
            maxTicksLimit: 5,
            callback: function(value) {
              if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
              return '$' + value;
            }
          },
          border: { display: false },
        }
      }
    }
  });
})();

// ── SVG Circular Progress ─────────────────────────────────────
(function initRingProgress() {
  const ring = document.getElementById('ringFill');
  if (!ring) return;

  const circumference = 2 * Math.PI * 68; // ≈ 427.26
  const targetPct     = 43.2;             // 4.32 / 10 = 43.2%
  const targetOffset  = circumference * (1 - targetPct / 100);

  // Trigger after a short delay so transition fires
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      ring.style.strokeDashoffset = targetOffset.toFixed(4);
    });
  });
})();

// ── Progress Bar Animations (IntersectionObserver) ────────────
(function initProgressBars() {
  const bars = document.querySelectorAll('.rule-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = parseFloat(bar.dataset.width);
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(function(bar) {
    observer.observe(bar);
  });
})();

// ── Sidebar Mobile Toggle ─────────────────────────────────────
(function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const hamburger = document.getElementById('hamburgerBtn');
  if (!sidebar || !overlay || !hamburger) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when a nav link is clicked on mobile
  sidebar.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // Nav link active state
  sidebar.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      sidebar.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });
})();

// ── Toast Utility ─────────────────────────────────────────────
function showToast(message, duration) {
  duration = duration || 3200;
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(function() {
    toast.classList.remove('show');
  }, duration);
}

// ── Payout Request Buttons ────────────────────────────────────
(function initPayoutButtons() {
  const btnTop    = document.getElementById('payoutBtnTop');
  const btnAction = document.getElementById('payoutBtnAction');

  function handlePayout(e) {
    e.preventDefault();
    showToast('✓ Payout request submitted! Processing within 24 hours.');
  }

  if (btnTop)    btnTop.addEventListener('click', handlePayout);
  if (btnAction) btnAction.addEventListener('click', handlePayout);
})();

// ── Download PDF Button ───────────────────────────────────────
(function initDownloadButton() {
  const btn = document.getElementById('downloadBtn');
  if (!btn) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    showToast('⟳ Generating your statement... Download will begin shortly.');
  });
})();

// ── Logout ────────────────────────────────────────────────────
(function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    showToast('Logging out...');
  });
})();

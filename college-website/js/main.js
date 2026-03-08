/* =====================================================
   main.js – Landing Page Logic
   ===================================================== */

'use strict';

/* ── Navbar scroll effect ──────────────────────────── */
const navbar = document.getElementById('main-navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ── Mobile hamburger ──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ── Scroll Reveal (IntersectionObserver) ──────────── */
function initScrollReveal() {
    const selectors = '.reveal, .reveal-left, .reveal-right';
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll(selectors).forEach(el => observer.observe(el));
}

/* ── Counter animation ─────────────────────────────── */
function animateCounter(el, target, duration = 2000) {
    const suffix = el.dataset.suffix || '';
    let start = 0;
    const step = target / (duration / 16);

    function update() {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start).toLocaleString() + suffix;
        if (start < target) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCounter(el, parseInt(el.dataset.counter), 2000);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ── Load Announcements on landing page ────────────── */
function loadAnnouncements() {
    const container = document.getElementById('announcements-container');
    if (!container) return;

    const announcements = CollegeData.getAnnouncements();
    if (!announcements.length) {
        container.innerHTML = '<p class="text-muted text-center" style="grid-column:1/-1;padding:40px">No announcements yet.</p>';
        return;
    }

    const categoryColors = {
        'Exams': 'badge-danger',
        'Events': 'badge-success',
        'Admissions': 'badge-info',
        'General': 'badge-accent',
    };

    container.innerHTML = announcements.slice(0, 3).map(ann => `
    <div class="news-card reveal">
      <div class="news-img">
        <i class="${ann.icon || 'fa-solid fa-bullhorn'}"></i>
        <span class="news-category">${ann.category || 'General'}</span>
      </div>
      <div class="news-body">
        <div class="news-meta">
          <span class="news-date"><i class="fa-regular fa-calendar"></i> ${CollegeData.formatDate(ann.date)}</span>
          <span class="news-author"><i class="fa-solid fa-user"></i> ${ann.author || 'Admin'}</span>
        </div>
        <h3 class="news-title">${ann.title}</h3>
        <p class="news-excerpt">${ann.excerpt || ''}</p>
        <span class="news-read-more">Read More <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </div>
  `).join('');

    // re-observe newly inserted elements
    initScrollReveal();
}

/* ── Load Programs on landing page ────────────────── */
function loadPrograms() {
    const container = document.getElementById('programs-container');
    if (!container || typeof CollegeData === 'undefined') return;

    container.innerHTML = CollegeData.programs.map((p, i) => `
    <div class="card reveal" style="animation-delay:${i * 0.1}s">
      <div class="card-icon card-icon-${i % 2 === 0 ? 'accent' : i % 3 === 0 ? 'gold' : 'info'}">
        <i class="${p.icon}"></i>
      </div>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-text">${p.desc}</p>
      <div style="display:flex;gap:12px;margin-top:20px">
        <span class="badge badge-accent"><i class="fa-solid fa-clock"></i> ${p.duration}</span>
        <span class="badge badge-info"><i class="fa-solid fa-users"></i> ${p.seats} Seats</span>
      </div>
    </div>
  `).join('');
}

/* ── Toast helper ──────────────────────────────────── */
function showToast(title, msg, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = { success: 'fa-check', error: 'fa-times', info: 'fa-info' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${iconMap[type] || iconMap.info}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}

/* ── Smooth scroll for anchor links ^^^^^^^^^^^^^^^^── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── Contact form ──────────────────────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            form.reset();
            showToast('Message Sent!', 'Thank you! We will get back to you shortly.', 'success');
        }, 1800);
    });
}

/* ── Init ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    loadAnnouncements();
    loadPrograms();
    initContactForm();
});

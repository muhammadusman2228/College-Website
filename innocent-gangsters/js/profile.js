/*
  =====================================================
  js/profile.js  –  Profile Modal + Photo Lightbox
  =====================================================
*/

'use strict';

/* ── State ─────────────────────────────────────────── */
let isOpen = false;

/* ── Open profile ──────────────────────────────────── */
function openProfile(friend) {
    const overlay = document.getElementById('profile-overlay');
    const sheet = document.getElementById('profile-sheet');
    if (!overlay || !sheet) return;

    // Set the color variable for this friend's theme
    sheet.style.setProperty('--profile-color', friend.color);

    // Build profile content
    sheet.innerHTML = buildProfileHTML(friend);

    // Wire up close button
    sheet.querySelector('.profile-close')?.addEventListener('click', closeProfile);

    // Wire up photo thumbnails → lightbox
    sheet.querySelectorAll('.photo-thumb').forEach((thumb, idx) => {
        thumb.addEventListener('click', () => openLightbox(friend.photos, idx));
    });

    // Open overlay
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    isOpen = true;
}

/* ── Close profile ─────────────────────────────────── */
function closeProfile() {
    const overlay = document.getElementById('profile-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    isOpen = false;
}

/* ── Build profile HTML ────────────────────────────── */
function buildProfileHTML(friend) {
    const { name, nickname, rank, quote, phone, color,
        coverPhoto, photos, biodata } = friend;

    // Photo gallery thumbnails
    const galleryHTML = photos.length
        ? photos.map((src, i) => `
        <div class="photo-thumb">
          <img src="${src}" alt="${name} photo ${i + 1}" loading="lazy"
               onerror="this.parentElement.style.display='none'">
        </div>
      `).join('')
        : '<p style="color:var(--muted);font-size:0.8rem;grid-column:1/-1">No photos added yet. See data.js to add photos.</p>';

    // Biodata items
    const biodataFields = [
        { key: 'realName', label: '📛 Real Name' },
        { key: 'age', label: '🎂 Age' },
        { key: 'city', label: '📍 City' },
        { key: 'program', label: '🎓 Program' },
        { key: 'hobbies', label: '🎯 Hobbies' },
        { key: 'biggestFear', label: '😱 Biggest Fear' },
        { key: 'bestMemory', label: '💫 Best Memory' },
        { key: 'funFact', label: '🤔 Fun Fact' },
    ];

    const biodataHTML = biodataFields.map(f => `
    <div class="biodata-item">
      <div class="biodata-label">${f.label}</div>
      <div class="biodata-value">${biodata[f.key] || '—'}</div>
    </div>
  `).join('');

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`Hey ${name.split(' ')[0]}! 👋`)}`;

    return `
    <!-- Drag handle -->
    <div class="profile-handle"></div>

    <!-- Close button -->
    <button class="profile-close" aria-label="Close profile">✕</button>

    <!-- Banner -->
    <div class="profile-banner">
      <img src="${coverPhoto}" alt="${name}"
           onerror="this.style.display='none'">
      <div class="profile-banner-overlay"></div>
      <div class="profile-banner-name">
        <span class="profile-badge" style="color:${color};border:1px solid ${color}30;background:${color}10">
          ${rank}
        </span>
        <h2>${name}</h2>
        <div style="font-size:0.8rem;color:rgba(240,244,255,0.5);margin-top:4px;letter-spacing:0.08em">${nickname}</div>
      </div>
    </div>

    <!-- Body -->
    <div class="profile-body">

      <!-- Quote -->
      <blockquote class="profile-quote">${quote}</blockquote>

      <!-- Superpower -->
      <div class="superpower-card">
        <div class="superpower-icon">⚡</div>
        <div>
          <div class="superpower-label">Secret Superpower</div>
          <div class="superpower-text">${biodata.superpower}</div>
        </div>
      </div>

      <!-- Photos -->
      <div class="profile-section-title">Photos</div>
      <div class="photo-gallery">${galleryHTML}</div>

      <!-- Biodata -->
      <div class="profile-section-title">The Files</div>
      <div class="biodata-grid">${biodataHTML}</div>

      <!-- WhatsApp -->
      ${phone ? `
        <a class="wa-cta" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send a Message on WhatsApp
        </a>
      ` : ''}

    </div>
  `;
}

/* ── Lightbox ──────────────────────────────────────── */
let lightboxPhotos = [];
let lightboxIndex = 0;

function openLightbox(photos, startIndex = 0) {
    lightboxPhotos = photos;
    lightboxIndex = startIndex;
    showLightboxPhoto();

    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.add('open');
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
}

function showLightboxPhoto() {
    const img = document.getElementById('lightbox-img');
    if (img && lightboxPhotos[lightboxIndex]) {
        img.src = lightboxPhotos[lightboxIndex];
        img.alt = `Photo ${lightboxIndex + 1} of ${lightboxPhotos.length}`;
    }
}

function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
    showLightboxPhoto();
}

function lightboxPrev() {
    lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    showLightboxPhoto();
}

/* ── Event Listeners (global) ──────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Close profile by clicking overlay backdrop
    document.getElementById('profile-overlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeProfile();
    });

    // Lightbox controls
    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-next')?.addEventListener('click', lightboxNext);
    document.getElementById('lightbox-prev')?.addEventListener('click', lightboxPrev);

    // Close lightbox clicking outside image
    document.getElementById('lightbox')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeLightbox();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('lightbox')?.classList.contains('open')) {
                closeLightbox();
            } else if (isOpen) {
                closeProfile();
            }
        }
        if (document.getElementById('lightbox')?.classList.contains('open')) {
            if (e.key === 'ArrowRight') lightboxNext();
            if (e.key === 'ArrowLeft') lightboxPrev();
        }
    });
});

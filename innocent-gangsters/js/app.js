/*
  =====================================================
  js/app.js  –  Card Rendering + 3D Tilt + Particles
  =====================================================
*/

'use strict';

/* ── Particle background ───────────────────────────── */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    // Particle config
    const PARTICLE_COUNT = 60;
    const particles = [];
    const colors = ['#00ff87', '#8b5cf6', '#ff6b35', '#06b6d4', '#f59e0b'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.1,
        });
    }

    let mouseX = W / 2, mouseY = H / 2;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            // Subtle attraction to cursor
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                p.vx += (dx / dist) * 0.005;
                p.vy += (dy / dist) * 0.005;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Wrap around edges
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });

        // Draw connections between close particles
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particles[i].color;
                    ctx.globalAlpha = (1 - dist / 100) * 0.12;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;

        requestAnimationFrame(draw);
    }

    draw();
}

/* ── 3D Tilt on card hover ─────────────────────────── */
function initTilt(card) {
    const MAX_TILT = 12; // degrees
    const MAX_SHINE = 80; // pixels offset

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * MAX_TILT;
        const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * MAX_TILT;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

        // Shine effect
        const shine = card.querySelector('.card-shine');
        if (shine) {
            const shineX = ((e.clientX - rect.left) / rect.width) * 100;
            const shineY = ((e.clientY - rect.top) / rect.height) * 100;
            shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.06) 0%, transparent 65%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        const shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = '';
    });
}

/* ── Render one card ───────────────────────────────── */
function buildCard(friend) {
    const card = document.createElement('div');
    card.className = 'friend-card';
    card.style.setProperty('--card-color', friend.color);

    // Cover photo or placeholder
    const hasCover = friend.coverPhoto && friend.coverPhoto.trim() !== '';
    const coverHTML = hasCover
        ? `<img src="${friend.coverPhoto}" alt="${friend.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=card-cover-placeholder><span>${friend.name.charAt(0)}</span><p>Add your photo</p></div>'">`
        : `<div class="card-cover-placeholder">
         <span>${friend.name.charAt(0)}</span>
         <p>No photo yet</p>
       </div>`;

    card.innerHTML = `
    <div class="card-cover">
      ${coverHTML}
      <div class="card-cover-overlay"></div>
      <div class="card-rank">${friend.rank}</div>
      <div class="card-photo-count">
        <span>📸 ${friend.photos.length}</span>
      </div>
    </div>

    <div class="card-shine"></div>

    <div class="card-body">
      <div class="card-nickname">${friend.nickname}</div>
      <div class="card-name">${friend.name}</div>
      <div class="card-divider"></div>
      <p class="card-intro">${friend.funnyIntro}</p>
    </div>

    <div class="card-footer">
      <div class="card-cta">
        View Profile
        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>

      <a class="card-wa-btn"
         href="https://wa.me/${friend.phone}"
         target="_blank"
         rel="noopener noreferrer"
         title="WhatsApp ${friend.name}"
         onclick="event.stopPropagation()">
        <svg viewBox="0 0 24 24" fill="#25d366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  `;

    // Click card → open profile
    card.addEventListener('click', () => openProfile(friend));

    // 3D tilt
    initTilt(card);

    return card;
}

/* ── Render all cards ──────────────────────────────── */
function renderCards() {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    if (!window.GANG || !GANG.length) {
        grid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;padding:60px">No friends added yet in data.js.</p>';
        return;
    }

    GANG.forEach(friend => grid.appendChild(buildCard(friend)));

    // Update gang count in hero
    const countEl = document.getElementById('gang-count');
    if (countEl) countEl.textContent = GANG.length;
}

/* ── Init ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    renderCards();
});

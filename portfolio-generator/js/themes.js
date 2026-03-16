// ══════════════════════════════════════════════════════════════
//  Portfolio Generator — Theme Templates
//  Each theme returns a full HTML string for the iframe preview
// ══════════════════════════════════════════════════════════════

const PortfolioThemes = {

  /* ── Theme 1: Dark Neon ── */
  dark(data) {
    const { name='', title='', bio='', skills=[], projects=[], social={} } = data;
    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#f0f4ff;min-height:100vh;}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  nav{padding:16px 48px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.07);background:rgba(10,10,15,0.9);position:sticky;top:0;}
  nav .logo{font-weight:800;font-size:1.2rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  nav .nav-links{display:flex;gap:24px;}
  nav a{color:#94a3b8;text-decoration:none;font-size:0.88rem;font-weight:500;}
  .hero{min-height:90vh;display:flex;align-items:center;padding:60px 48px;gap:60px;}
  .hero-text{flex:1;}
  .tag{display:inline-block;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);color:#a78bfa;padding:5px 14px;border-radius:50px;font-size:0.8rem;font-weight:600;margin-bottom:18px;}
  h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;margin-bottom:12px;}
  h1 span{background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .subtitle{color:#06b6d4;font-size:1rem;font-weight:600;margin-bottom:18px;}
  .bio{color:#94a3b8;font-size:0.95rem;line-height:1.7;max-width:500px;margin-bottom:28px;}
  .hero-btns{display:flex;gap:12px;flex-wrap:wrap;}
  .btn-main{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;padding:12px 28px;border-radius:50px;font-weight:600;text-decoration:none;font-size:0.9rem;}
  .btn-out{border:1px solid rgba(255,255,255,0.15);color:#f0f4ff;padding:11px 28px;border-radius:50px;font-weight:600;text-decoration:none;font-size:0.9rem;}
  .avatar{width:220px;height:220px;border-radius:24px;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:5rem;flex-shrink:0;box-shadow:0 0 60px rgba(124,58,237,0.4);}
  section{padding:80px 48px;}
  .sec-title{font-size:0.72rem;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;font-weight:700;margin-bottom:10px;}
  h2{font-size:2rem;font-weight:800;margin-bottom:40px;}
  .skills-wrap{display:flex;flex-wrap:wrap;gap:10px;}
  .skill{background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.3);color:#a78bfa;padding:8px 18px;border-radius:50px;font-size:0.88rem;font-weight:500;}
  .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;}
  .proj-card{background:#16162a;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:24px;transition:border-color 0.2s;}
  .proj-card:hover{border-color:rgba(124,58,237,0.5);}
  .proj-card h3{font-size:1rem;font-weight:700;margin-bottom:8px;}
  .proj-card p{color:#94a3b8;font-size:0.88rem;line-height:1.6;margin-bottom:14px;}
  .proj-tech{display:flex;flex-wrap:wrap;gap:6px;}
  .tech-tag{background:rgba(6,182,212,0.12);color:#67e8f9;padding:3px 10px;border-radius:50px;font-size:0.76rem;}
  .social-row{display:flex;gap:14px;flex-wrap:wrap;}
  .slink{display:flex;align-items:center;gap:8px;background:#16162a;border:1px solid rgba(255,255,255,0.07);color:#f0f4ff;padding:10px 20px;border-radius:10px;font-size:0.88rem;font-weight:500;text-decoration:none;}
  footer{text-align:center;padding:30px;border-top:1px solid rgba(255,255,255,0.05);color:#64748b;font-size:0.85rem;}
</style></head><body>
<nav>
  <span class="logo">${name || 'Portfolio'}</span>
  <div class="nav-links">
    <a href="#skills">Skills</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </div>
</nav>

<div class="hero">
  <div class="hero-text">
    <div class="tag">👋 Available for hire</div>
    <h1>Hi, I'm <span>${name || 'Your Name'}</span></h1>
    <p class="subtitle">${title || 'Developer & Creator'}</p>
    <p class="bio">${bio || 'Add your bio in the form to see it here.'}</p>
    <div class="hero-btns">
      <a href="#projects" class="btn-main">View My Work</a>
      <a href="#contact" class="btn-out">Contact Me</a>
    </div>
  </div>
  <div class="avatar">${(name||'U').charAt(0).toUpperCase()}</div>
</div>

<section id="skills" style="background:#0d0d1a;">
  <div class="sec-title">What I Know</div>
  <h2>My Skills</h2>
  <div class="skills-wrap">
    ${skills.length ? skills.map(s=>`<span class="skill">${s}</span>`).join('') : '<span class="skill" style="opacity:0.4">Add skills in the form...</span>'}
  </div>
</section>

<section id="projects">
  <div class="sec-title">What I've Built</div>
  <h2>Projects</h2>
  <div class="projects-grid">
    ${projects.length ? projects.map(p=>`
      <div class="proj-card">
        <h3>${p.name||'Project Name'}</h3>
        <p>${p.desc||'Project description'}</p>
        <div class="proj-tech">${(p.tech||'').split(',').filter(t=>t.trim()).map(t=>`<span class="tech-tag">${t.trim()}</span>`).join('')}</div>
        ${p.link?`<a href="${p.link}" style="display:inline-block;margin-top:12px;color:#7c3aed;font-size:0.85rem;font-weight:600;">View Project →</a>`:''}
      </div>`).join('') : `<div class="proj-card"><h3 style="opacity:0.4">Add projects in the form...</h3></div>`}
  </div>
</section>

<section id="contact" style="background:#0d0d1a;">
  <div class="sec-title">Get in Touch</div>
  <h2>Contact</h2>
  <div class="social-row">
    ${social.github?`<a class="slink" href="https://${social.github}">💻 GitHub</a>`:''}
    ${social.linkedin?`<a class="slink" href="https://${social.linkedin}">🔗 LinkedIn</a>`:''}
    ${social.twitter?`<a class="slink" href="https://${social.twitter}">🐦 Twitter/X</a>`:''}
    ${social.email?`<a class="slink" href="mailto:${social.email}">✉️ Email</a>`:''}
    ${!social.github&&!social.linkedin&&!social.twitter&&!social.email?'<p style="color:#64748b">Add social links in the form...</p>':''}
  </div>
</section>

<footer>Built with PortfolioForge · ${name || 'Your Name'} ${new Date().getFullYear()}</footer>
</body></html>`;
  },

  /* ── Theme 2: Light Minimal ── */
  light(data) {
    const { name='', title='', bio='', skills=[], projects=[], social={} } = data;
    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#fafafa;color:#111;min-height:100vh;}
  nav{padding:16px 48px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb;background:#fff;position:sticky;top:0;}
  nav .logo{font-weight:800;font-size:1.2rem;color:#111;}
  nav a{color:#6b7280;text-decoration:none;font-size:0.88rem;font-weight:500;margin-left:24px;}
  .hero{padding:80px 48px;max-width:800px;margin:0 auto;text-align:center;}
  .avatar{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:800;color:#fff;}
  h1{font-size:2.5rem;font-weight:800;margin-bottom:8px;}
  .subtitle{color:#6366f1;font-size:1rem;font-weight:600;margin-bottom:16px;}
  .bio{color:#6b7280;font-size:0.95rem;line-height:1.7;max-width:560px;margin:0 auto 28px;}
  .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
  .bm{background:#6366f1;color:#fff;padding:11px 26px;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.9rem;}
  .bo{border:2px solid #e5e7eb;color:#374151;padding:10px 26px;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.9rem;}
  section{padding:72px 48px;max-width:900px;margin:0 auto;}
  h2{font-size:1.8rem;font-weight:800;margin-bottom:8px;}
  .divider{width:48px;height:4px;background:#6366f1;border-radius:2px;margin-bottom:32px;}
  .skills-wrap{display:flex;flex-wrap:wrap;gap:10px;}
  .skill{border:1px solid #e5e7eb;padding:7px 16px;border-radius:6px;font-size:0.88rem;color:#374151;font-weight:500;}
  .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;}
  .proj{border:1px solid #e5e7eb;border-radius:12px;padding:22px;background:#fff;transition:box-shadow 0.2s;}
  .proj:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);}
  .proj h3{font-size:1rem;font-weight:700;margin-bottom:8px;}
  .proj p{color:#6b7280;font-size:0.88rem;line-height:1.6;margin-bottom:12px;}
  .tech-tag{background:#f3f4f6;color:#374151;padding:3px 9px;border-radius:50px;font-size:0.75rem;margin-right:5px;display:inline-block;margin-top:4px;}
  .slinks{display:flex;gap:12px;flex-wrap:wrap;}
  .sl{display:flex;align-items:center;gap:8px;border:1px solid #e5e7eb;color:#374151;padding:9px 18px;border-radius:8px;font-size:0.88rem;font-weight:500;text-decoration:none;background:#fff;}
  footer{text-align:center;padding:28px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:0.84rem;}
</style></head><body>
<nav>
  <span class="logo">${name||'Portfolio'}</span>
  <div><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
</nav>

<div class="hero">
  <div class="avatar">${(name||'U').charAt(0).toUpperCase()}</div>
  <h1>${name||'Your Name'}</h1>
  <p class="subtitle">${title||'Developer & Creator'}</p>
  <p class="bio">${bio||'Add your bio in the form to see it here.'}</p>
  <div class="btns">
    <a href="#projects" class="bm">View Work</a>
    <a href="#contact" class="bo">Contact</a>
  </div>
</div>

<section id="skills"><h2>Skills</h2><div class="divider"></div>
  <div class="skills-wrap">
    ${skills.length?skills.map(s=>`<span class="skill">${s}</span>`).join(''):'<span class="skill" style="opacity:0.4">Add skills...</span>'}
  </div>
</section>

<section id="projects"><h2>Projects</h2><div class="divider"></div>
  <div class="projects-grid">
    ${projects.length?projects.map(p=>`
      <div class="proj">
        <h3>${p.name||'Project'}</h3>
        <p>${p.desc||''}</p>
        ${(p.tech||'').split(',').filter(t=>t.trim()).map(t=>`<span class="tech-tag">${t.trim()}</span>`).join('')}
        ${p.link?`<br/><a href="${p.link}" style="color:#6366f1;font-size:0.85rem;font-weight:600;display:inline-block;margin-top:10px;">View →</a>`:''}
      </div>`).join(''):`<div class="proj"><h3 style="opacity:0.4">Add projects...</h3></div>`}
  </div>
</section>

<section id="contact"><h2>Contact</h2><div class="divider"></div>
  <div class="slinks">
    ${social.github?`<a class="sl" href="https://${social.github}">💻 GitHub</a>`:''}
    ${social.linkedin?`<a class="sl" href="https://${social.linkedin}">🔗 LinkedIn</a>`:''}
    ${social.twitter?`<a class="sl" href="https://${social.twitter}">🐦 Twitter</a>`:''}
    ${social.email?`<a class="sl" href="mailto:${social.email}">✉️ Email</a>`:''}
    ${!social.github&&!social.linkedin&&!social.twitter&&!social.email?'<p style="color:#9ca3af">Add social links...</p>':''}
  </div>
</section>

<footer>© ${new Date().getFullYear()} ${name||'Portfolio'} · Built with PortfolioForge</footer>
</body></html>`;
  },

  /* ── Theme 3: Gradient Bold ── */
  gradient(data) {
    const { name='', title='', bio='', skills=[], projects=[], social={} } = data;
    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;min-height:100vh;}
  nav{padding:16px 48px;display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.3);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.1);position:sticky;top:0;}
  nav .logo{font-weight:800;font-size:1.2rem;color:#fff;}
  nav a{color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.88rem;margin-left:24px;}
  .hero{padding:100px 48px;text-align:center;}
  .glow-circle{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#f093fb,#f5576c,#4facfe);margin:0 auto 28px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;font-weight:800;box-shadow:0 0 60px rgba(240,147,251,0.5);}
  h1{font-size:3rem;font-weight:800;margin-bottom:10px;}
  h1 em{font-style:normal;background:linear-gradient(135deg,#f093fb,#4facfe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .subtitle{color:rgba(255,255,255,0.7);font-size:1rem;font-weight:500;margin-bottom:18px;}
  .bio{color:rgba(255,255,255,0.6);font-size:0.95rem;line-height:1.7;max-width:560px;margin:0 auto 32px;}
  .bm{background:linear-gradient(135deg,#f093fb,#4facfe);color:#fff;padding:13px 30px;border-radius:50px;font-weight:700;text-decoration:none;font-size:0.9rem;display:inline-block;box-shadow:0 0 30px rgba(240,147,251,0.4);}
  section{padding:72px 48px;max-width:960px;margin:0 auto;}
  h2{font-size:1.8rem;font-weight:800;margin-bottom:32px;text-align:center;}
  .glass{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:12px;}
  .skills-wrap{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
  .skill{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);padding:8px 18px;border-radius:50px;font-size:0.88rem;color:#fff;}
  .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;}
  .proj{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:22px;}
  .proj h3{font-size:1rem;font-weight:700;margin-bottom:8px;}
  .proj p{color:rgba(255,255,255,0.6);font-size:0.87rem;line-height:1.6;margin-bottom:12px;}
  .tech-tag{background:rgba(240,147,251,0.15);color:#f0abfc;padding:3px 9px;border-radius:50px;font-size:0.74rem;display:inline-block;margin:2px;}
  .slinks{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;}
  .sl{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:10px 20px;border-radius:10px;font-size:0.88rem;font-weight:500;text-decoration:none;display:flex;align-items:center;gap:7px;}
  footer{text-align:center;padding:28px;border-top:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:0.84rem;}
</style></head><body>
<nav>
  <span class="logo">✦ ${name||'Portfolio'}</span>
  <div><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
</nav>

<div class="hero">
  <div class="glow-circle">${(name||'U').charAt(0).toUpperCase()}</div>
  <h1>I'm <em>${name||'Your Name'}</em></h1>
  <p class="subtitle">${title||'Developer & Creator'}</p>
  <p class="bio">${bio||'Add your bio in the form to see it here.'}</p>
  <a href="#projects" class="bm">✨ See My Work</a>
</div>

<section id="skills"><h2>⚡ Skills</h2>
  <div class="skills-wrap">
    ${skills.length?skills.map(s=>`<span class="skill">${s}</span>`).join(''):'<span class="skill" style="opacity:0.4">Add skills...</span>'}
  </div>
</section>

<section id="projects"><h2>🚀 Projects</h2>
  <div class="projects-grid">
    ${projects.length?projects.map(p=>`
      <div class="proj">
        <h3>${p.name||'Project'}</h3>
        <p>${p.desc||''}</p>
        ${(p.tech||'').split(',').filter(t=>t.trim()).map(t=>`<span class="tech-tag">${t.trim()}</span>`).join('')}
        ${p.link?`<br/><a href="${p.link}" style="color:#f0abfc;font-size:0.85rem;font-weight:600;display:inline-block;margin-top:10px;">View →</a>`:''}
      </div>`).join(''):`<div class="proj"><h3 style="opacity:0.4">Add projects...</h3></div>`}
  </div>
</section>

<section id="contact"><h2>🤝 Contact</h2>
  <div class="slinks">
    ${social.github?`<a class="sl" href="https://${social.github}">💻 GitHub</a>`:''}
    ${social.linkedin?`<a class="sl" href="https://${social.linkedin}">🔗 LinkedIn</a>`:''}
    ${social.twitter?`<a class="sl" href="https://${social.twitter}">🐦 Twitter</a>`:''}
    ${social.email?`<a class="sl" href="mailto:${social.email}">✉️ Email</a>`:''}
    ${!social.github&&!social.linkedin&&!social.twitter&&!social.email?'<p style="color:rgba(255,255,255,0.3)">Add social links...</p>':''}
  </div>
</section>

<footer>✦ ${name||'Portfolio'} · Built with PortfolioForge · ${new Date().getFullYear()}</footer>
</body></html>`;
  }
};

// ══════════════════════════════════════════════════════════════
//  PortfolioForge — Generator App Logic
// ══════════════════════════════════════════════════════════════

// ── State ─────────────────────────────────────────────────────
let currentStep = 0;
let currentTheme = 'dark';
let portData = {
  name: '', title: '', bio: '',
  skills: [],
  projects: [],
  social: { github: '', linkedin: '', twitter: '', email: '' }
};

const stepNames = ['Personal Info', 'Bio & Skills', 'Projects', 'Social Links', 'Review'];

// ── Step Templates ─────────────────────────────────────────────
const steps = [

  // STEP 0: Personal Info
  () => `
    <div class="steptitle">👤 Personal Info</div>
    <div class="stepsub">This is the first thing visitors see.</div>
    <div class="fg">
      <label>Full Name *</label>
      <input type="text" id="p-name" placeholder="e.g. Muhammad Usman" value="${portData.name}" oninput="portData.name=this.value;render()"/>
    </div>
    <div class="fg">
      <label>Professional Title</label>
      <input type="text" id="p-title" placeholder="e.g. Frontend Developer | CS Student" value="${portData.title}" oninput="portData.title=this.value;render()"/>
    </div>`,

  // STEP 1: Bio & Skills
  () => `
    <div class="steptitle">✍️ Bio & Skills</div>
    <div class="stepsub">Tell visitors who you are and what you can do.</div>
    <div class="fg">
      <label>Short Bio</label>
      <textarea id="p-bio" placeholder="e.g. I'm a CS student who loves building web apps. I specialize in HTML, CSS, and JavaScript." oninput="portData.bio=this.value;render()" style="min-height:100px;">${portData.bio}</textarea>
    </div>
    <div class="fg">
      <label>Skills</label>
      <div class="tags-wrap" id="skills-wrap">
        ${portData.skills.map((s,i)=>`<div class="tag">${s}<button onclick="removeSk(${i})">×</button></div>`).join('')}
      </div>
      <div class="tag-inp-row">
        <input type="text" id="sk-inp" placeholder="e.g. HTML/CSS, JavaScript..." onkeydown="if(event.key==='Enter')addSk();"/>
        <button onclick="addSk()">Add</button>
      </div>
    </div>
    <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:12px;margin-top:6px;">
      <p style="font-size:0.78rem;color:#a5b4fc;font-weight:600;margin-bottom:8px;">💡 Quick Add</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${['HTML/CSS','JavaScript','React','Python','Git','Figma','Node.js','MongoDB','TypeScript','NextJS','Tailwind'].map(s=>
          `<span onclick="quickSk('${s}')" style="cursor:pointer;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;padding:3px 9px;border-radius:50px;font-size:0.75rem;">${s}</span>`
        ).join('')}
      </div>
    </div>`,

  // STEP 2: Projects
  () => {
    const proj = portData.projects;
    return `
      <div class="steptitle">🚀 Projects</div>
      <div class="stepsub">Showcase your best work. Add at least 1.</div>
      <div id="proj-list">
        ${proj.map((p, i) => projItem(p, i)).join('')}
      </div>
      <button class="add-btn" onclick="addProj()">+ Add Project</button>`;
  },

  // STEP 3: Social Links
  () => `
    <div class="steptitle">🔗 Social Links</div>
    <div class="stepsub">Help people find and contact you.</div>
    <div class="fg">
      <label>GitHub (URL or username)</label>
      <input type="text" placeholder="github.com/yourusername" value="${portData.social.github}" oninput="portData.social.github=this.value;render()"/>
    </div>
    <div class="fg">
      <label>LinkedIn (URL)</label>
      <input type="text" placeholder="linkedin.com/in/yourname" value="${portData.social.linkedin}" oninput="portData.social.linkedin=this.value;render()"/>
    </div>
    <div class="fg">
      <label>Twitter / X (URL or handle)</label>
      <input type="text" placeholder="twitter.com/yourhandle" value="${portData.social.twitter}" oninput="portData.social.twitter=this.value;render()"/>
    </div>
    <div class="fg">
      <label>Email Address</label>
      <input type="email" placeholder="your@email.com" value="${portData.social.email}" oninput="portData.social.email=this.value;render()"/>
    </div>`,

  // STEP 4: Review
  () => `
    <div class="steptitle">✅ Almost Done!</div>
    <div class="stepsub">Review your info and download your portfolio HTML.</div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:16px;display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);font-size:0.85rem;">Name</span><span style="font-size:0.88rem;font-weight:600;">${portData.name||'—'}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);font-size:0.85rem;">Title</span><span style="font-size:0.88rem;">${portData.title||'—'}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);font-size:0.85rem;">Skills</span><span style="font-size:0.88rem;">${portData.skills.length} added</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);font-size:0.85rem;">Projects</span><span style="font-size:0.88rem;">${portData.projects.length} added</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="color:var(--muted);font-size:0.85rem;">Theme</span><span style="font-size:0.88rem;font-weight:600;text-transform:capitalize;">${currentTheme}</span></div>
    </div>
    <div style="background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:var(--rs);padding:14px;">
      <p style="font-size:0.83rem;color:#6ee7b7;font-weight:600;margin-bottom:6px;">🎉 Your portfolio is ready!</p>
      <p style="font-size:0.82rem;color:var(--muted);">Click "Copy HTML" in the preview panel, paste into a file called <strong>index.html</strong>, and upload it to GitHub Pages or Netlify for a free live link.</p>
    </div>`
];

// ── Project Item HTML ──────────────────────────────────────────
function projItem(p = {}, i) {
  return `
    <div class="rep-item" id="proj-${i}">
      <button class="rm" onclick="removeProj(${i})">×</button>
      <div class="fg">
        <label>Project Name</label>
        <input type="text" placeholder="e.g. College Website" value="${p.name||''}" oninput="portData.projects[${i}].name=this.value;render()"/>
      </div>
      <div class="fg">
        <label>Description</label>
        <textarea placeholder="What does it do? What did you use?" oninput="portData.projects[${i}].desc=this.value;render()">${p.desc||''}</textarea>
      </div>
      <div class="fg">
        <label>Tech Stack (comma-separated)</label>
        <input type="text" placeholder="HTML, CSS, JavaScript, Firebase" value="${p.tech||''}" oninput="portData.projects[${i}].tech=this.value;render()"/>
      </div>
      <div class="fg">
        <label>Live Link (optional)</label>
        <input type="text" placeholder="https://myproject.netlify.app" value="${p.link||''}" oninput="portData.projects[${i}].link=this.value;render()"/>
      </div>
    </div>`;
}

// ── Skills ─────────────────────────────────────────────────────
function addSk() {
  const inp = document.getElementById('sk-inp');
  const v = inp.value.trim();
  if (!v || portData.skills.includes(v)) { inp.value=''; return; }
  portData.skills.push(v);
  inp.value = '';
  renderStep(); render();
}
function removeSk(i) { portData.skills.splice(i,1); renderStep(); render(); }
function quickSk(v) {
  if (portData.skills.includes(v)) return;
  portData.skills.push(v); renderStep(); render();
}

// ── Projects ───────────────────────────────────────────────────
function addProj() {
  portData.projects.push({ name:'', desc:'', tech:'', link:'' });
  const list = document.getElementById('proj-list');
  const i = portData.projects.length - 1;
  list.insertAdjacentHTML('beforeend', projItem(portData.projects[i], i));
}
function removeProj(i) { portData.projects.splice(i,1); renderStep(); }

// ── Step Navigation ────────────────────────────────────────────
function renderStep() {
  document.getElementById('fcontent').innerHTML = steps[currentStep]();
  document.getElementById('step-label').textContent = `Step ${currentStep+1} of 5 — ${stepNames[currentStep]}`;
  for (let i=0;i<5;i++) {
    const d = document.getElementById(`sd-${i}`);
    d.className = 'sdot' + (i < currentStep ? ' done' : i === currentStep ? ' active' : '');
  }
  document.getElementById('fbk').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('fnxt').textContent = currentStep === 4 ? '📋 Copy & Finish' : 'Continue →';
}
function nextStep() {
  if (currentStep === 4) { copyHTML(); return; }
  currentStep++; renderStep();
}
function prevStep() {
  if (currentStep > 0) { currentStep--; renderStep(); }
}

// ── Theme Switching ────────────────────────────────────────────
function switchTheme(t) {
  currentTheme = t;
  document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('active'));
  document.getElementById(`th-${t}`).classList.add('active');
  render();
}

// ── Preview Render ─────────────────────────────────────────────
function render() {
  const frame = document.getElementById('portfolio-preview');
  if (!frame) return;
  const html = PortfolioThemes[currentTheme](portData);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  frame.src = url;
  autosave();
}

// ── Copy HTML ──────────────────────────────────────────────────
function copyHTML() {
  const html = PortfolioThemes[currentTheme](portData);
  navigator.clipboard.writeText(html).then(() => {
    const btn = document.getElementById('copy-html-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2500);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = html; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    alert('HTML copied to clipboard! Paste into index.html and deploy.');
  });
}

// ── Autosave ───────────────────────────────────────────────────
function autosave() {
  localStorage.setItem('pf_data', JSON.stringify(portData));
  const ind = document.getElementById('saved-ind');
  if (ind) { ind.textContent = 'Draft saved ✓'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 2000); }
}
function loadSaved() {
  const s = localStorage.getItem('pf_data');
  if (s) { try { portData = JSON.parse(s); } catch(e){} }
}

// ── URL Theme Param ────────────────────────────────────────────
function applyUrlTheme() {
  const p = new URLSearchParams(window.location.search);
  const t = p.get('theme');
  if (t && ['dark','light','gradient'].includes(t)) {
    currentTheme = t;
    document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`th-${t}`);
    if (btn) btn.classList.add('active');
  }
}

// ── Init ───────────────────────────────────────────────────────
loadSaved();
applyUrlTheme();
renderStep();
render();

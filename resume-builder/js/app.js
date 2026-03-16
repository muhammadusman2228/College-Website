// ══════════════════════════════════════════════════════════════
//  ResumeForge — App Logic
// ══════════════════════════════════════════════════════════════

// ── State ─────────────────────────────────────────────────────
let currentStep = 0;
let currentTemplate = 'modern';
let resumeData = {
  personal: {},
  summary: '',
  experience: [],
  education: [],
  skills: []
};

const stepNames = ['Personal Info', 'Summary', 'Experience', 'Education', 'Skills'];

// ── Steps Definition ──────────────────────────────────────────
const steps = [

  // STEP 0: Personal Info
  () => `
    <div class="step-title">👤 Personal Information</div>
    <div class="step-sub">This appears at the top of your resume.</div>
    <div class="form-group">
      <label>Full Name *</label>
      <input type="text" id="f-name" placeholder="e.g. Muhammad Usman" value="${resumeData.personal.name || ''}" oninput="updatePersonal('name', this.value)"/>
    </div>
    <div class="form-group">
      <label>Professional Title</label>
      <input type="text" id="f-title" placeholder="e.g. Frontend Developer | CS Student" value="${resumeData.personal.title || ''}" oninput="updatePersonal('title', this.value)"/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="f-email" placeholder="your@email.com" value="${resumeData.personal.email || ''}" oninput="updatePersonal('email', this.value)"/>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" id="f-phone" placeholder="+92 300 0000000" value="${resumeData.personal.phone || ''}" oninput="updatePersonal('phone', this.value)"/>
      </div>
    </div>
    <div class="form-group">
      <label>Location</label>
      <input type="text" id="f-location" placeholder="e.g. Lahore, Pakistan" value="${resumeData.personal.location || ''}" oninput="updatePersonal('location', this.value)"/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>LinkedIn URL</label>
        <input type="text" id="f-linkedin" placeholder="linkedin.com/in/yourname" value="${resumeData.personal.linkedin || ''}" oninput="updatePersonal('linkedin', this.value)"/>
      </div>
      <div class="form-group">
        <label>GitHub URL</label>
        <input type="text" id="f-github" placeholder="github.com/yourname" value="${resumeData.personal.github || ''}" oninput="updatePersonal('github', this.value)"/>
      </div>
    </div>`,

  // STEP 1: Summary
  () => `
    <div class="step-title">📝 Professional Summary</div>
    <div class="step-sub">A 2–3 sentence overview of who you are and what you bring.</div>
    <div class="form-group">
      <label>Summary</label>
      <textarea id="f-summary" placeholder="e.g. Passionate Computer Science student with hands-on experience building web apps using HTML, CSS, and JavaScript. Seeking a front-end developer role where I can grow and contribute to real-world projects." oninput="updateSummary(this.value)" style="min-height:140px;">${resumeData.summary || ''}</textarea>
    </div>
    <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:8px;padding:14px;margin-top:8px;">
      <p style="font-size:0.82rem;color:#a78bfa;font-weight:600;margin-bottom:6px;">💡 Writing Tips</p>
      <ul style="font-size:0.82rem;color:#94a3b8;padding-left:16px;display:flex;flex-direction:column;gap:4px;">
        <li>Mention your field of study or key skill</li>
        <li>Highlight 1-2 achievements or projects</li>
        <li>End with what you are looking for</li>
      </ul>
    </div>`,

  // STEP 2: Experience
  () => {
    const exp = resumeData.experience;
    return `
      <div class="step-title">💼 Work Experience</div>
      <div class="step-sub">Add internships, part-time jobs, or freelance work. OK to leave empty if you have none.</div>
      <div id="exp-list">
        ${exp.map((e, i) => expItem(e, i)).join('')}
      </div>
      <button class="add-more-btn" onclick="addExperience()">+ Add Experience</button>`;
  },

  // STEP 3: Education
  () => {
    const edu = resumeData.education;
    return `
      <div class="step-title">🎓 Education</div>
      <div class="step-sub">Add your degrees, certifications, or courses.</div>
      <div id="edu-list">
        ${edu.map((e, i) => eduItem(e, i)).join('')}
      </div>
      <button class="add-more-btn" onclick="addEducation()">+ Add Education</button>`;
  },

  // STEP 4: Skills
  () => `
    <div class="step-title">⚡ Skills</div>
    <div class="step-sub">Add your technical and soft skills. Press Enter or click Add.</div>
    <div class="skills-container" id="skills-container">
      ${resumeData.skills.map((s, i) => `
        <div class="skill-tag" id="skill-${i}">
          ${s} <button onclick="removeSkill(${i})">×</button>
        </div>`).join('')}
    </div>
    <div class="skill-input-row">
      <input type="text" id="skill-input" placeholder="e.g. JavaScript, React, Figma..." onkeydown="if(event.key==='Enter'){addSkill();}"/>
      <button onclick="addSkill()">Add</button>
    </div>
    <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.3);border-radius:8px;padding:14px;margin-top:16px;">
      <p style="font-size:0.82rem;color:#67e8f9;font-weight:600;margin-bottom:8px;">🔥 Suggested Skills</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${['HTML/CSS','JavaScript','React','Python','Git','Figma','Node.js','SQL','TypeScript','Communication','Problem Solving','Team Work'].map(s =>
          `<span onclick="quickAddSkill('${s}')" style="cursor:pointer;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);color:#67e8f9;padding:4px 10px;border-radius:50px;font-size:0.78rem;">${s}</span>`
        ).join('')}
      </div>
    </div>`
];

// ── Experience Item HTML ───────────────────────────────────────
function expItem(e = {}, i) {
  return `
    <div class="repeatable-item" id="exp-item-${i}">
      <button class="remove-btn" onclick="removeExperience(${i})">×</button>
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" placeholder="e.g. Frontend Intern" value="${e.role || ''}" oninput="updateExp(${i},'role',this.value)"/>
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" placeholder="e.g. ABC Company" value="${e.company || ''}" oninput="updateExp(${i},'company',this.value)"/>
      </div>
      <div class="form-group">
        <label>Duration</label>
        <input type="text" placeholder="e.g. Jun 2024 – Aug 2024" value="${e.duration || ''}" oninput="updateExp(${i},'duration',this.value)"/>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea placeholder="What did you do? What did you achieve?" oninput="updateExp(${i},'description',this.value)">${e.description || ''}</textarea>
      </div>
    </div>`;
}

// ── Education Item HTML ───────────────────────────────────────
function eduItem(e = {}, i) {
  return `
    <div class="repeatable-item" id="edu-item-${i}">
      <button class="remove-btn" onclick="removeEducation(${i})">×</button>
      <div class="form-group">
        <label>Degree / Certification</label>
        <input type="text" placeholder="e.g. B.Sc. Computer Science" value="${e.degree || ''}" oninput="updateEdu(${i},'degree',this.value)"/>
      </div>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" placeholder="e.g. University of Punjab" value="${e.school || ''}" oninput="updateEdu(${i},'school',this.value)"/>
      </div>
      <div class="form-group">
        <label>Year / Duration</label>
        <input type="text" placeholder="e.g. 2022 – 2026" value="${e.year || ''}" oninput="updateEdu(${i},'year',this.value)"/>
      </div>
    </div>`;
}

// ── Update Helpers ─────────────────────────────────────────────
function updatePersonal(key, val) {
  resumeData.personal[key] = val;
  renderPreview();
}
function updateSummary(val) {
  resumeData.summary = val;
  renderPreview();
}
function updateExp(i, key, val) {
  resumeData.experience[i][key] = val;
  renderPreview();
}
function updateEdu(i, key, val) {
  resumeData.education[i][key] = val;
  renderPreview();
}

// ── Experience CRUD ────────────────────────────────────────────
function addExperience() {
  resumeData.experience.push({ role: '', company: '', duration: '', description: '' });
  const list = document.getElementById('exp-list');
  const i = resumeData.experience.length - 1;
  list.insertAdjacentHTML('beforeend', expItem(resumeData.experience[i], i));
}
function removeExperience(i) {
  resumeData.experience.splice(i, 1);
  renderStep();
}

// ── Education CRUD ─────────────────────────────────────────────
function addEducation() {
  resumeData.education.push({ degree: '', school: '', year: '' });
  const list = document.getElementById('edu-list');
  const i = resumeData.education.length - 1;
  list.insertAdjacentHTML('beforeend', eduItem(resumeData.education[i], i));
}
function removeEducation(i) {
  resumeData.education.splice(i, 1);
  renderStep();
}

// ── Skills ─────────────────────────────────────────────────────
function addSkill() {
  const input = document.getElementById('skill-input');
  const val = input.value.trim();
  if (!val || resumeData.skills.includes(val)) { input.value = ''; return; }
  resumeData.skills.push(val);
  input.value = '';
  renderStep();
  renderPreview();
}
function removeSkill(i) {
  resumeData.skills.splice(i, 1);
  renderStep();
  renderPreview();
}
function quickAddSkill(val) {
  if (resumeData.skills.includes(val)) return;
  resumeData.skills.push(val);
  renderStep();
  renderPreview();
}

// ── Step Navigation ────────────────────────────────────────────
function renderStep() {
  document.getElementById('form-content').innerHTML = steps[currentStep]();
  document.getElementById('step-counter').textContent = `Step ${currentStep + 1} of 5 — ${stepNames[currentStep]}`;
  // Dots
  for (let i = 0; i < 5; i++) {
    const dot = document.getElementById(`dot-${i}`);
    dot.className = 'step-dot' + (i < currentStep ? ' done' : i === currentStep ? ' active' : '');
  }
  // Back button
  document.getElementById('btn-back').style.display = currentStep > 0 ? 'block' : 'none';
  // Next/Finish button
  document.getElementById('btn-next').textContent = currentStep === 4 ? '✅ Finish & Download' : 'Continue →';
}

function nextStep() {
  if (currentStep === 4) {
    downloadPDF();
    return;
  }
  currentStep++;
  renderStep();
}
function prevStep() {
  if (currentStep > 0) { currentStep--; renderStep(); }
}

// ── Template Switching ─────────────────────────────────────────
function switchTemplate(tmpl) {
  currentTemplate = tmpl;
  document.querySelectorAll('.tmpl-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tmpl-${tmpl}`).classList.add('active');
  renderPreview();
}

// ── Preview Render ─────────────────────────────────────────────
function renderPreview() {
  const el = document.getElementById('resume-preview');
  if (el) el.innerHTML = ResumeTemplates[currentTemplate](resumeData);
  autosave();
}

// ── PDF Download ───────────────────────────────────────────────
function downloadPDF() {
  renderPreview();
  setTimeout(() => window.print(), 200);
}

// ── Autosave to localStorage ───────────────────────────────────
function autosave() {
  localStorage.setItem('rf_data', JSON.stringify(resumeData));
  const ind = document.getElementById('autosave-indicator');
  if (ind) { ind.textContent = 'Draft saved ✓'; setTimeout(() => { if(ind) ind.textContent = ''; }, 2000); }
}
function loadSaved() {
  const saved = localStorage.getItem('rf_data');
  if (saved) {
    try { resumeData = JSON.parse(saved); } catch(e) {}
  }
}

// ── URL Template Param ──────────────────────────────────────────
function applyUrlTemplate() {
  const params = new URLSearchParams(window.location.search);
  const tmpl = params.get('tmpl');
  if (tmpl && ['modern','minimal','executive'].includes(tmpl)) {
    currentTemplate = tmpl;
    document.querySelectorAll('.tmpl-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`tmpl-${tmpl}`);
    if (btn) btn.classList.add('active');
  }
}

// ── Init ───────────────────────────────────────────────────────
loadSaved();
applyUrlTemplate();
renderStep();
renderPreview();

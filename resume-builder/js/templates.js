// ══════════════════════════════════════════════════════════════
//  Resume Templates — returns full HTML string for the preview
// ══════════════════════════════════════════════════════════════

const ResumeTemplates = {

  /* ── Template 1: Modern Purple ── */
  modern(data) {
    const { personal = {}, summary = '', education = [], experience = [], skills = [] } = data;
    return `
      <div style="display:flex;min-height:1123px;font-family:'Inter',sans-serif;">
        <!-- Sidebar -->
        <div style="width:260px;background:linear-gradient(180deg,#7c3aed,#4f46e5);color:#fff;padding:36px 24px;flex-shrink:0;">
          <div style="width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;border:3px solid rgba(255,255,255,0.4);">
            ${(personal.name || 'U').charAt(0).toUpperCase()}
          </div>
          <h1 style="font-size:1.3rem;font-weight:700;text-align:center;margin-bottom:4px;">${personal.name || 'Your Name'}</h1>
          <p style="text-align:center;opacity:0.8;font-size:0.85rem;margin-bottom:28px;">${personal.title || 'Professional Title'}</p>
          
          <div style="margin-bottom:24px;">
            <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;opacity:0.6;margin-bottom:12px;">Contact</h3>
            ${personal.email ? `<p style="font-size:0.82rem;opacity:0.9;margin-bottom:6px;">📧 ${personal.email}</p>` : ''}
            ${personal.phone ? `<p style="font-size:0.82rem;opacity:0.9;margin-bottom:6px;">📱 ${personal.phone}</p>` : ''}
            ${personal.location ? `<p style="font-size:0.82rem;opacity:0.9;margin-bottom:6px;">📍 ${personal.location}</p>` : ''}
            ${personal.linkedin ? `<p style="font-size:0.82rem;opacity:0.9;margin-bottom:6px;">🔗 ${personal.linkedin}</p>` : ''}
            ${personal.github ? `<p style="font-size:0.82rem;opacity:0.9;">💻 ${personal.github}</p>` : ''}
          </div>

          ${skills.length ? `
          <div>
            <h3 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;opacity:0.6;margin-bottom:12px;">Skills</h3>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${skills.map(s => `<span style="background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:50px;font-size:0.78rem;">${s}</span>`).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- Main -->
        <div style="flex:1;padding:36px 32px;">
          ${summary ? `
          <div style="margin-bottom:28px;">
            <h2 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;font-weight:700;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #7c3aed;">Professional Summary</h2>
            <p style="color:#374151;font-size:0.9rem;line-height:1.7;">${summary}</p>
          </div>` : ''}

          ${experience.length ? `
          <div style="margin-bottom:28px;">
            <h2 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;font-weight:700;margin-bottom:14px;padding-bottom:6px;border-bottom:2px solid #7c3aed;">Experience</h2>
            ${experience.map(exp => `
              <div style="margin-bottom:18px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                  <div>
                    <h3 style="font-size:1rem;font-weight:700;color:#111;">${exp.role || 'Role'}</h3>
                    <p style="color:#7c3aed;font-size:0.88rem;font-weight:600;">${exp.company || 'Company'}</p>
                  </div>
                  <span style="color:#6b7280;font-size:0.82rem;background:#f3f4f6;padding:3px 10px;border-radius:50px;">${exp.duration || 'Duration'}</span>
                </div>
                ${exp.description ? `<p style="color:#374151;font-size:0.88rem;margin-top:8px;line-height:1.6;">${exp.description}</p>` : ''}
              </div>`).join('')}
          </div>` : ''}

          ${education.length ? `
          <div>
            <h2 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;font-weight:700;margin-bottom:14px;padding-bottom:6px;border-bottom:2px solid #7c3aed;">Education</h2>
            ${education.map(edu => `
              <div style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <h3 style="font-size:0.95rem;font-weight:700;color:#111;">${edu.degree || 'Degree'}</h3>
                  <p style="color:#7c3aed;font-size:0.85rem;font-weight:500;">${edu.school || 'Institution'}</p>
                </div>
                <span style="color:#6b7280;font-size:0.82rem;background:#f3f4f6;padding:3px 10px;border-radius:50px;">${edu.year || 'Year'}</span>
              </div>`).join('')}
          </div>` : ''}
        </div>
      </div>`;
  },

  /* ── Template 2: Minimal Clean ── */
  minimal(data) {
    const { personal = {}, summary = '', education = [], experience = [], skills = [] } = data;
    return `
      <div style="padding:48px 56px;font-family:'Inter',sans-serif;min-height:1123px;color:#111;">
        <div style="border-bottom:3px solid #111;padding-bottom:20px;margin-bottom:28px;">
          <h1 style="font-size:2.2rem;font-weight:800;letter-spacing:-0.5px;">${personal.name || 'Your Name'}</h1>
          <p style="color:#6b7280;font-size:1rem;margin-top:4px;">${personal.title || 'Professional Title'}</p>
          <div style="display:flex;gap:20px;margin-top:12px;flex-wrap:wrap;">
            ${personal.email ? `<span style="font-size:0.82rem;color:#374151;">✉ ${personal.email}</span>` : ''}
            ${personal.phone ? `<span style="font-size:0.82rem;color:#374151;">✆ ${personal.phone}</span>` : ''}
            ${personal.location ? `<span style="font-size:0.82rem;color:#374151;">⌖ ${personal.location}</span>` : ''}
            ${personal.linkedin ? `<span style="font-size:0.82rem;color:#374151;">in ${personal.linkedin}</span>` : ''}
            ${personal.github ? `<span style="font-size:0.82rem;color:#374151;">⌘ ${personal.github}</span>` : ''}
          </div>
        </div>

        ${summary ? `
        <div style="margin-bottom:28px;">
          <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;font-weight:700;margin-bottom:10px;">Summary</h2>
          <p style="color:#374151;font-size:0.92rem;line-height:1.75;">${summary}</p>
        </div>` : ''}

        ${experience.length ? `
        <div style="margin-bottom:28px;">
          <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;font-weight:700;margin-bottom:14px;">Experience</h2>
          ${experience.map(exp => `
            <div style="margin-bottom:20px;">
              <div style="display:flex;justify-content:space-between;">
                <strong style="font-size:0.98rem;">${exp.role || 'Role'}</strong>
                <span style="color:#9ca3af;font-size:0.85rem;">${exp.duration || ''}</span>
              </div>
              <p style="color:#6b7280;font-size:0.88rem;margin-top:2px;">${exp.company || 'Company'}</p>
              ${exp.description ? `<p style="color:#374151;font-size:0.88rem;margin-top:8px;line-height:1.6;">${exp.description}</p>` : ''}
            </div>`).join('')}
        </div>` : ''}

        ${education.length ? `
        <div style="margin-bottom:28px;">
          <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;font-weight:700;margin-bottom:14px;">Education</h2>
          ${education.map(edu => `
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <div>
                <strong style="font-size:0.95rem;">${edu.degree || 'Degree'}</strong>
                <p style="color:#6b7280;font-size:0.85rem;">${edu.school || 'Institution'}</p>
              </div>
              <span style="color:#9ca3af;font-size:0.85rem;">${edu.year || ''}</span>
            </div>`).join('')}
        </div>` : ''}

        ${skills.length ? `
        <div>
          <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:3px;font-weight:700;margin-bottom:12px;">Skills</h2>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${skills.map(s => `<span style="border:1px solid #d1d5db;padding:5px 14px;border-radius:50px;font-size:0.82rem;color:#374151;">${s}</span>`).join('')}
          </div>
        </div>` : ''}
      </div>`;
  },

  /* ── Template 3: Executive Dark ── */
  executive(data) {
    const { personal = {}, summary = '', education = [], experience = [], skills = [] } = data;
    return `
      <div style="font-family:'Inter',sans-serif;min-height:1123px;background:#1e293b;color:#f8fafc;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:40px 48px;border-bottom:2px solid #06b6d4;">
          <h1 style="font-size:2.2rem;font-weight:800;letter-spacing:-0.5px;">${personal.name || 'Your Name'}</h1>
          <p style="color:#06b6d4;font-size:1rem;margin:6px 0 16px;font-weight:500;">${personal.title || 'Professional Title'}</p>
          <div style="display:flex;gap:20px;flex-wrap:wrap;">
            ${personal.email ? `<span style="font-size:0.82rem;color:#94a3b8;">✉ ${personal.email}</span>` : ''}
            ${personal.phone ? `<span style="font-size:0.82rem;color:#94a3b8;">✆ ${personal.phone}</span>` : ''}
            ${personal.location ? `<span style="font-size:0.82rem;color:#94a3b8;">📍 ${personal.location}</span>` : ''}
            ${personal.linkedin ? `<span style="font-size:0.82rem;color:#94a3b8;">in ${personal.linkedin}</span>` : ''}
            ${personal.github ? `<span style="font-size:0.82rem;color:#94a3b8;">⌘ ${personal.github}</span>` : ''}
          </div>
        </div>
        
        <div style="display:flex;">
          <!-- Main -->
          <div style="flex:1;padding:36px 40px;">
            ${summary ? `
            <div style="margin-bottom:28px;">
              <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#06b6d4;margin-bottom:10px;">Summary</h2>
              <p style="color:#cbd5e1;font-size:0.9rem;line-height:1.8;">${summary}</p>
            </div>` : ''}
            
            ${experience.length ? `
            <div style="margin-bottom:28px;">
              <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#06b6d4;margin-bottom:16px;">Experience</h2>
              ${experience.map(exp => `
                <div style="margin-bottom:20px;padding-left:14px;border-left:2px solid #334155;">
                  <h3 style="font-weight:700;font-size:0.98rem;">${exp.role || 'Role'}</h3>
                  <p style="color:#06b6d4;font-size:0.85rem;">${exp.company || 'Company'} · ${exp.duration || ''}</p>
                  ${exp.description ? `<p style="color:#94a3b8;font-size:0.87rem;margin-top:8px;line-height:1.6;">${exp.description}</p>` : ''}
                </div>`).join('')}
            </div>` : ''}

            ${education.length ? `
            <div>
              <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#06b6d4;margin-bottom:14px;">Education</h2>
              ${education.map(edu => `
                <div style="margin-bottom:14px;padding-left:14px;border-left:2px solid #334155;">
                  <h3 style="font-weight:700;font-size:0.95rem;">${edu.degree || 'Degree'}</h3>
                  <p style="color:#94a3b8;font-size:0.85rem;">${edu.school || 'Institution'} · ${edu.year || ''}</p>
                </div>`).join('')}
            </div>` : ''}
          </div>

          <!-- Sidebar -->
          ${skills.length ? `
          <div style="width:220px;background:#0f172a;padding:36px 24px;border-left:1px solid #334155;">
            <h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:2px;color:#06b6d4;margin-bottom:14px;">Skills</h2>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${skills.map(s => `
                <div style="background:#1e293b;border:1px solid #334155;padding:7px 12px;border-radius:6px;font-size:0.82rem;color:#e2e8f0;">${s}</div>
              `).join('')}
            </div>
          </div>` : ''}
        </div>
      </div>`;
  }
};

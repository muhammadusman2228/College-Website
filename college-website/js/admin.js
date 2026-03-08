/* =====================================================
   js/admin.js – Admin Portal Page Controllers (API version)
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────────────
   ADMIN LOGIN
   ───────────────────────────────────────────────────── */
async function initAdminLogin() {
    if (!document.getElementById('admin-login-form')) return;
    if (Auth.isAdmin()) { window.location.href = '/pages/admin-dashboard.html'; return; }

    const form = document.getElementById('admin-login-form');
    const userEl = document.getElementById('admin-username');
    const passEl = document.getElementById('admin-password');
    const errorEl = document.getElementById('admin-login-error');
    const submitBtn = form.querySelector('[type="submit"]');
    const pwdToggle = document.getElementById('admin-pwd-toggle');

    if (pwdToggle) {
        pwdToggle.addEventListener('click', () => {
            const t = passEl.type === 'password' ? 'text' : 'password';
            passEl.type = t;
            pwdToggle.innerHTML = t === 'password' ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = userEl.value.trim();
        const password = passEl.value;
        if (!username || !password) { showAdminError(errorEl, 'Enter username and password.'); return; }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

        try {
            const res = await adminLogin(username, password);
            if (res.success) {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Access Granted';
                setTimeout(() => { window.location.href = '/pages/admin-dashboard.html'; }, 600);
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Admin Login';
            showAdminError(errorEl, err.message || 'Invalid credentials.');
        }
    });
}

function showAdminError(el, msg) {
    if (!el) return;
    el.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    el.style.display = 'block';
}

/* ─────────────────────────────────────────────────────
   ADMIN DASHBOARD
   ───────────────────────────────────────────────────── */
async function initAdminDashboard() {
    if (!document.getElementById('admin-dash-content')) return;
    if (!Auth.initDashboard('admin')) return;

    try {
        const res = await AdminAPI.getStats();
        const d = res.data;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('stat-total-students', d.totalStudents);
        setEl('stat-announcements', d.totalAnnouncements);
        setEl('stat-admissions', d.totalAdmissions);
        setEl('stat-pending-adm', d.pendingAdmissions);

        const recentList = document.getElementById('recent-ann-list');
        if (recentList && d.recentAnnouncements?.length) {
            recentList.innerHTML = d.recentAnnouncements.map(ann => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--glass-border)">
          <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:rgba(233,69,96,0.1);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0">
            <i class="${ann.icon || 'fa-solid fa-bullhorn'}"></i>
          </div>
          <div style="flex:1;overflow:hidden">
            <div style="font-size:0.85rem;font-weight:600;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ann.title}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${formatDate(ann.date)}</div>
          </div>
          <span class="badge badge-accent">${ann.category || 'General'}</span>
        </div>
      `).join('');
        } else if (recentList) {
            recentList.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem;padding:20px 0">No announcements yet.</p>';
        }
    } catch (err) {
        console.error('Admin dash error:', err);
    }
}

/* ─────────────────────────────────────────────────────
   ANNOUNCEMENTS
   ───────────────────────────────────────────────────── */
async function initAnnouncementsPage() {
    if (!document.getElementById('ann-list-container')) return;
    if (!Auth.initDashboard('admin')) return;

    async function renderList() {
        const container = document.getElementById('ann-list-container');
        if (!container) return;
        try {
            const res = await AdminAPI.getAnnouncements();
            const list = res.data;

            if (!list.length) {
                container.innerHTML = '<p style="color:var(--text-muted);padding:40px;text-align:center">No announcements yet.</p>';
                return;
            }

            container.innerHTML = list.map((ann, i) => `
        <div class="page-card" style="margin-bottom:16px;animation:fadeInUp 0.4s ease ${i * 0.05}s both">
          <div class="page-card-header">
            <div class="page-card-title" style="flex:1;min-width:0">
              <i class="${ann.icon || 'fa-solid fa-bullhorn'}"></i>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ann.title}</span>
            </div>
            <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
              <span class="badge badge-accent">${ann.category}</span>
              <span style="font-size:0.75rem;color:var(--text-muted)">${formatDate(ann.date)}</span>
              <button class="btn btn-sm" style="background:rgba(231,76,60,0.15);color:var(--danger)" onclick="deleteAnn(${ann.id})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="page-card-body" style="padding-top:16px">
            <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.7">${ann.excerpt}</p>
          </div>
        </div>
      `).join('');
        } catch (err) {
            container.innerHTML = `<p style="color:var(--danger);text-align:center;padding:40px">${err.message}</p>`;
        }
    }

    document.getElementById('add-ann-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            title: document.getElementById('ann-title').value.trim(),
            category: document.getElementById('ann-category').value,
            author: document.getElementById('ann-author').value.trim() || 'Admin',
            excerpt: document.getElementById('ann-excerpt').value.trim(),
        };
        if (!body.title || !body.excerpt) { alert('Fill in title and content.'); return; }
        try {
            await AdminAPI.addAnnouncement(body);
            document.getElementById('add-ann-form').reset();
            await renderList();
            showToast('Published', 'Announcement published successfully.', 'success');
        } catch (err) { showToast('Error', err.message, 'error'); }
    });

    window.deleteAnn = async (id) => {
        if (!confirm('Delete this announcement?')) return;
        try {
            await AdminAPI.deleteAnnouncement(id);
            await renderList();
            showToast('Deleted', 'Announcement removed.', 'info');
        } catch (err) { showToast('Error', err.message, 'error'); }
    };

    renderList();
}

/* ─────────────────────────────────────────────────────
   ADMISSIONS
   ───────────────────────────────────────────────────── */
async function initAdmissionsPage() {
    if (!document.getElementById('admissions-tbody')) return;
    if (!Auth.initDashboard('admin')) return;

    let currentFilter = 'All';

    async function renderAdmissions() {
        const tbody = document.getElementById('admissions-tbody');
        if (!tbody) return;
        try {
            const res = await AdminAPI.getAdmissions(currentFilter);
            const list = res.data;

            if (!list.length) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:40px">No applications found.</td></tr>`;
                return;
            }

            const statusBadge = s => {
                const map = { Approved: 'badge-success', Pending: 'badge-warning', Rejected: 'badge-danger' };
                return `<span class="badge ${map[s] || 'badge-info'}">${s}</span>`;
            };

            tbody.innerHTML = list.map(adm => `
        <tr>
          <td style="font-weight:600;color:var(--accent)">${adm.id}</td>
          <td style="font-weight:500">${adm.name}</td>
          <td>${adm.program}</td>
          <td>${formatDate(adm.applied_on)}</td>
          <td>${statusBadge(adm.status)}</td>
          <td>
            <div style="display:flex;gap:6px">
              ${adm.status === 'Pending' ? `
                <button class="btn btn-sm" style="background:rgba(39,174,96,0.15);color:var(--success)" onclick="updateAdm('${adm.id}','Approved')">Approve</button>
                <button class="btn btn-sm" style="background:rgba(231,76,60,0.15);color:var(--danger)"  onclick="updateAdm('${adm.id}','Rejected')">Reject</button>
              ` : `<span style="font-size:0.8rem;color:var(--text-muted)">—</span>`}
            </div>
          </td>
        </tr>
      `).join('');
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" style="color:var(--danger);padding:40px;text-align:center">${err.message}</td></tr>`;
        }
    }

    window.updateAdm = async (id, status) => {
        try {
            await AdminAPI.updateAdmission(id, { status });
            await renderAdmissions();
            showToast('Updated', `Application ${id} → ${status}`, status === 'Approved' ? 'success' : 'info');
        } catch (err) { showToast('Error', err.message, 'error'); }
    };

    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderAdmissions();
        });
    });

    // Add modal
    const modal = document.getElementById('add-adm-modal');
    document.getElementById('open-add-adm')?.addEventListener('click', () => modal?.classList.remove('hidden'));
    document.getElementById('close-adm-modal')?.addEventListener('click', () => modal?.classList.add('hidden'));
    modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

    document.getElementById('add-adm-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            name: document.getElementById('adm-name').value.trim(),
            program: document.getElementById('adm-program').value,
            cnic: document.getElementById('adm-cnic').value.trim(),
            email: document.getElementById('adm-email').value.trim(),
        };
        if (!body.name || !body.program || !body.email) { alert('Fill all fields.'); return; }
        try {
            await AdminAPI.addAdmission(body);
            e.target.reset();
            modal?.classList.add('hidden');
            await renderAdmissions();
            showToast('Added', `${body.name} registered for ${body.program}.`, 'success');
        } catch (err) { showToast('Error', err.message, 'error'); }
    });

    renderAdmissions();
}

/* ─────────────────────────────────────────────────────
   STUDENTS
   ───────────────────────────────────────────────────── */
async function initStudentsPage() {
    if (!document.getElementById('students-tbody')) return;
    if (!Auth.initDashboard('admin')) return;

    async function renderStudents(search = '') {
        const tbody = document.getElementById('students-tbody');
        if (!tbody) return;
        try {
            const res = await AdminAPI.getStudents(search);
            const list = res.data;

            if (!list.length) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:40px">No students found.</td></tr>`;
                return;
            }

            tbody.innerHTML = list.map(s => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:36px;height:36px;border-radius:50%;background:var(--grad-accent);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--white);flex-shrink:0">${s.avatar_initials}</div>
              <div>
                <div style="font-weight:600;color:var(--white)">${s.name}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${s.email}</div>
              </div>
            </div>
          </td>
          <td style="font-weight:600;color:var(--accent)">${s.roll_no}</td>
          <td>${s.program}</td>
          <td>${s.semester}</td>
          <td><span style="color:var(--accent);font-weight:700">${Number(s.gpa).toFixed(2)}</span></td>
          <td><span class="badge badge-success">${s.status}</span></td>
        </tr>
      `).join('');
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" style="color:var(--danger);padding:40px;text-align:center">${err.message}</td></tr>`;
        }
    }

    let searchTimer;
    document.getElementById('student-search')?.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => renderStudents(e.target.value), 400);
    });

    renderStudents();
}

/* ── Auto-init ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initAdminLogin();
    initAdminDashboard();
    initAnnouncementsPage();
    initAdmissionsPage();
    initStudentsPage();
});

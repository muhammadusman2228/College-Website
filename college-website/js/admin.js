/* =====================================================
   admin.js – Admin Panel Page Controllers
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────────────
   ADMIN LOGIN
   ───────────────────────────────────────────────────── */
function initAdminLogin() {
    if (!document.getElementById('admin-login-form')) return;

    if (Auth.isAdmin()) {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    const form = document.getElementById('admin-login-form');
    const userInput = document.getElementById('admin-username');
    const passInput = document.getElementById('admin-password');
    const errorEl = document.getElementById('admin-login-error');
    const submitBtn = form.querySelector('[type="submit"]');
    const pwdToggle = document.getElementById('admin-pwd-toggle');

    if (pwdToggle) {
        pwdToggle.addEventListener('click', () => {
            const type = passInput.type === 'password' ? 'text' : 'password';
            passInput.type = type;
            pwdToggle.innerHTML = type === 'password'
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = userInput.value.trim();
        const password = passInput.value;
        if (!username || !password) {
            showAdminError(errorEl, 'Please enter username and password.');
            return;
        }
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
        setTimeout(() => {
            const result = Auth.loginAdmin(username, password);
            if (result.success) {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Access Granted';
                setTimeout(() => { window.location.href = 'admin-dashboard.html'; }, 600);
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Admin Login';
                showAdminError(errorEl, result.msg);
            }
        }, 1000);
    });
}

function showAdminError(el, msg) {
    if (!el) return;
    el.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    el.style.display = 'flex';
}

/* ─────────────────────────────────────────────────────
   ADMIN DASHBOARD
   ───────────────────────────────────────────────────── */
function initAdminDashboard() {
    if (!document.getElementById('admin-dash-content')) return;
    if (!Auth.initDashboard('admin')) return;

    const announcements = CollegeData.getAnnouncements();
    const admissions = CollegeData.getAdmissions();

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('stat-total-students', CollegeData.students.length);
    setEl('stat-announcements', announcements.length);
    setEl('stat-admissions', admissions.length);
    setEl('stat-pending-adm', admissions.filter(a => a.status === 'Pending').length);

    // Recent announcements list
    const recentList = document.getElementById('recent-ann-list');
    if (recentList) {
        recentList.innerHTML = announcements.slice(0, 3).map(ann => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--glass-border)">
        <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:rgba(233,69,96,0.1);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0;font-size:0.9rem">
          <i class="${ann.icon || 'fa-solid fa-bullhorn'}"></i>
        </div>
        <div style="flex:1;overflow:hidden">
          <div style="font-size:0.85rem;font-weight:600;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ann.title}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${CollegeData.formatDate(ann.date)}</div>
        </div>
        <span class="badge badge-accent" style="flex-shrink:0">${ann.category || 'General'}</span>
      </div>
    `).join('') || '<p style="color:var(--text-muted);padding:20px 0;font-size:0.875rem">No announcements yet.</p>';
    }
}

/* ─────────────────────────────────────────────────────
   ANNOUNCEMENTS MANAGEMENT
   ───────────────────────────────────────────────────── */
function initAnnouncementsPage() {
    if (!document.getElementById('ann-list-container')) return;
    if (!Auth.initDashboard('admin')) return;

    function renderList() {
        const list = CollegeData.getAnnouncements();
        const container = document.getElementById('ann-list-container');
        if (!container) return;

        if (!list.length) {
            container.innerHTML = '<p style="color:var(--text-muted);padding:40px;text-align:center">No announcements yet. Add one above.</p>';
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
            <span class="badge badge-accent">${ann.category || 'General'}</span>
            <span style="font-size:0.75rem;color:var(--text-muted)">${CollegeData.formatDate(ann.date)}</span>
            <button class="btn btn-sm btn-ghost" onclick="editAnnouncement('${ann.id}')">
              <i class="fa-solid fa-edit"></i>
            </button>
            <button class="btn btn-sm" style="background:rgba(231,76,60,0.15);color:var(--danger)" onclick="deleteAnnouncement('${ann.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="page-card-body" style="padding-top:16px">
          <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.7">${ann.excerpt}</p>
        </div>
      </div>
    `).join('');
    }

    // Add form
    const addForm = document.getElementById('add-ann-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('ann-title').value.trim();
            const category = document.getElementById('ann-category').value;
            const excerpt = document.getElementById('ann-excerpt').value.trim();
            const author = document.getElementById('ann-author').value.trim() || 'Admin';

            if (!title || !excerpt) { alert('Please fill in title and content.'); return; }

            const list = CollegeData.getAnnouncements();
            const catIcons = { Exams: 'fa-solid fa-calendar-check', Events: 'fa-solid fa-trophy', Admissions: 'fa-solid fa-graduation-cap', General: 'fa-solid fa-bullhorn' };
            list.unshift({
                id: 'ann-' + Date.now(),
                title, category, excerpt, author,
                date: new Date().toISOString().split('T')[0],
                icon: 'fa-solid ' + (catIcons[category] || 'fa-bullhorn'),
            });
            CollegeData.saveAnnouncements(list);
            addForm.reset();
            renderList();
            showAdminToast('Announcement Added', 'Your announcement has been published.', 'success');
        });
    }

    window.deleteAnnouncement = function (id) {
        if (!confirm('Delete this announcement?')) return;
        const list = CollegeData.getAnnouncements().filter(a => a.id !== id);
        CollegeData.saveAnnouncements(list);
        renderList();
        showAdminToast('Deleted', 'Announcement removed.', 'info');
    };

    window.editAnnouncement = function (id) {
        const ann = CollegeData.getAnnouncements().find(a => a.id === id);
        if (!ann) return;
        document.getElementById('ann-title').value = ann.title;
        document.getElementById('ann-category').value = ann.category || 'General';
        document.getElementById('ann-excerpt').value = ann.excerpt;
        document.getElementById('ann-author').value = ann.author || '';

        // Delete old, submit will create new
        CollegeData.saveAnnouncements(CollegeData.getAnnouncements().filter(a => a.id !== id));
        document.getElementById('ann-title').focus();
        renderList();
    };

    renderList();
}

/* ─────────────────────────────────────────────────────
   ADMISSIONS MANAGEMENT
   ───────────────────────────────────────────────────── */
function initAdmissionsPage() {
    if (!document.getElementById('admissions-tbody')) return;
    if (!Auth.initDashboard('admin')) return;

    function renderAdmissions(filter = 'All') {
        let list = CollegeData.getAdmissions();
        if (filter !== 'All') list = list.filter(a => a.status === filter);

        const tbody = document.getElementById('admissions-tbody');
        if (!tbody) return;

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:40px">No admissions found.</td></tr>`;
            return;
        }

        const statusBadge = (s) => {
            const map = { Approved: 'badge-success', Pending: 'badge-warning', Rejected: 'badge-danger' };
            return `<span class="badge ${map[s] || 'badge-info'}">${s}</span>`;
        };

        tbody.innerHTML = list.map(adm => `
      <tr>
        <td style="font-weight:600;color:var(--accent)">${adm.id}</td>
        <td style="font-weight:500">${adm.name}</td>
        <td>${adm.program}</td>
        <td>${CollegeData.formatDate(adm.date)}</td>
        <td>${statusBadge(adm.status)}</td>
        <td>
          <div style="display:flex;gap:6px">
            ${adm.status === 'Pending' ? `
              <button class="btn btn-sm" style="background:rgba(39,174,96,0.15);color:var(--success)" onclick="updateAdmStatus('${adm.id}','Approved')">Approve</button>
              <button class="btn btn-sm" style="background:rgba(231,76,60,0.15);color:var(--danger)"  onclick="updateAdmStatus('${adm.id}','Rejected')">Reject</button>
            ` : `<span style="font-size:0.8rem;color:var(--text-muted)">—</span>`}
          </div>
        </td>
      </tr>
    `).join('');
    }

    window.updateAdmStatus = function (id, status) {
        const list = CollegeData.getAdmissions();
        const idx = list.findIndex(a => a.id === id);
        if (idx === -1) return;
        list[idx].status = status;
        CollegeData.saveAdmissions(list);
        renderAdmissions(currentFilter);
        showAdminToast('Updated', `Admission ${id} marked as ${status}.`, status === 'Approved' ? 'success' : 'info');
    };

    let currentFilter = 'All';
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderAdmissions(currentFilter);
        });
    });

    // Add new admission form
    const addForm = document.getElementById('add-adm-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('adm-name').value.trim();
            const program = document.getElementById('adm-program').value;
            const cnic = document.getElementById('adm-cnic').value.trim();
            const email = document.getElementById('adm-email').value.trim();
            if (!name || !program || !cnic || !email) { alert('Please fill all fields.'); return; }
            const list = CollegeData.getAdmissions();
            const newAdm = { id: 'ADM-' + String(list.length + 1).padStart(3, '0'), name, program, cnic, email, status: 'Pending', date: new Date().toISOString().split('T')[0] };
            list.unshift(newAdm);
            CollegeData.saveAdmissions(list);
            addForm.reset();
            const modal = document.getElementById('add-adm-modal');
            if (modal) modal.classList.add('hidden');
            renderAdmissions(currentFilter);
            showAdminToast('Application Added', `${name} registered for ${program}.`, 'success');
        });
    }

    // Modal
    const openModalBtn = document.getElementById('open-add-adm');
    const closeModalBtn = document.getElementById('close-adm-modal');
    const modal = document.getElementById('add-adm-modal');
    if (openModalBtn && modal) openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeModalBtn && modal) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    renderAdmissions();
}

/* ─────────────────────────────────────────────────────
   STUDENTS MANAGEMENT
   ───────────────────────────────────────────────────── */
function initStudentsPage() {
    if (!document.getElementById('students-tbody')) return;
    if (!Auth.initDashboard('admin')) return;

    function renderStudents(query = '') {
        let list = CollegeData.students;
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.rollNo.toLowerCase().includes(q) ||
                s.program.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q)
            );
        }

        const tbody = document.getElementById('students-tbody');
        if (!tbody) return;

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:40px">No students found.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(s => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:50%;background:var(--grad-accent);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--white);flex-shrink:0">${s.avatarInitials}</div>
            <div>
              <div style="font-weight:600;color:var(--white)">${s.name}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${s.email}</div>
            </div>
          </div>
        </td>
        <td style="font-weight:600;color:var(--accent)">${s.rollNo}</td>
        <td>${s.program}</td>
        <td>${s.semester}</td>
        <td><span style="color:var(--accent);font-weight:700">${s.gpa.toFixed(2)}</span></td>
        <td><span class="badge badge-success">${s.status}</span></td>
      </tr>
    `).join('');
    }

    const searchInput = document.getElementById('student-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderStudents(searchInput.value));
    }

    renderStudents();
}

/* ─────────────────────────────────────────────────────
   Toast helper for admin pages
   ───────────────────────────────────────────────────── */
function showAdminToast(title, msg, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;
    const iconMap = { success: 'fa-check', error: 'fa-times', info: 'fa-info' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${iconMap[type] || 'fa-info'}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
  `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
}

/* ── Auto-init ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initAdminLogin();
    initAdminDashboard();
    initAnnouncementsPage();
    initAdmissionsPage();
    initStudentsPage();
});

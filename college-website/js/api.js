/* =====================================================
   js/api.js – API Client (replaces localStorage CollegeData)
   All fetch calls go to http://localhost:3001
   ===================================================== */

'use strict';

// Auto-detect environment: use relative URLs in production (Railway/Render),
// and absolute localhost in local development.
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? `http://${window.location.hostname}:3001/api`
    : '/api';


/* ── Token Storage ──────────────────────────────────── */
const Auth = {
    getToken() { return sessionStorage.getItem('gc_token'); },
    setToken(t) { sessionStorage.setItem('gc_token', t); },
    clearToken() { sessionStorage.removeItem('gc_token'); sessionStorage.removeItem('gc_user'); },
    getUser() { try { return JSON.parse(sessionStorage.getItem('gc_user')); } catch { return null; } },
    setUser(u) { sessionStorage.setItem('gc_user', JSON.stringify(u)); },
    isStudent() { const u = this.getUser(); return u && u.role === 'student'; },
    isAdmin() { const u = this.getUser(); return u && u.role === 'admin'; },

    requireStudent() {
        if (!this.isStudent()) {
            window.location.href = '/pages/student-login.html';
            return false;
        }
        return true;
    },

    requireAdmin() {
        if (!this.isAdmin()) {
            window.location.href = '/pages/admin-login.html';
            return false;
        }
        return true;
    },

    logout() {
        this.clearToken();
        window.location.href = '/pages/student-login.html';
    },

    adminLogout() {
        this.clearToken();
        window.location.href = '/pages/admin-login.html';
    },

    /* Init sidebar / topbar for dashboard pages */
    initDashboard(role = 'student') {
        if (role === 'student' && !this.requireStudent()) return false;
        if (role === 'admin' && !this.requireAdmin()) return false;

        const user = this.getUser();
        if (!user) return false;

        // Sidebar user info
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('sidebar-user-name', user.name || 'User');
        setEl('sidebar-user-id', user.rollNo || user.username || '');
        if (document.getElementById('sidebar-avatar')) {
            document.getElementById('sidebar-avatar').textContent = user.avatarInitials || (user.name || 'U').slice(0, 2).toUpperCase();
        }

        // Topbar date
        const dateEl = document.getElementById('topbar-date');
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            if (link.href && window.location.pathname.includes(new URL(link.href, location.origin).pathname.split('/').pop().replace('.html', ''))) {
                link.classList.add('active');
            }
        });

        // Logout buttons
        document.querySelectorAll('[data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', () => { role === 'admin' ? Auth.adminLogout() : Auth.logout(); });
        });

        // Sidebar toggle (mobile)
        const toggleBtn = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        }

        return true;
    }
};

/* ── HTTP Helper ────────────────────────────────────── */
async function apiFetch(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
    return data;
}

/* ── Public API ─────────────────────────────────────── */
const PublicAPI = {
    async getAnnouncements() { return apiFetch('/announcements'); },
    async getPrograms() { return apiFetch('/programs'); },
    async healthCheck() { return apiFetch('/health'); },
};

/* ── Student Auth ───────────────────────────────────── */
async function studentLogin(email, password) {
    const data = await apiFetch('/auth/student-login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (data.success) {
        Auth.setToken(data.token);
        Auth.setUser(data.user);
    }
    return data;
}

/* ── Admin Auth ─────────────────────────────────────── */
async function adminLogin(username, password) {
    const data = await apiFetch('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    if (data.success) {
        Auth.setToken(data.token);
        Auth.setUser(data.user);
    }
    return data;
}

/* ── Student Data API ───────────────────────────────── */
const StudentAPI = {
    async getProfile() { return apiFetch('/student/profile'); },
    async getResults() { return apiFetch('/student/results'); },
    async getFee() { return apiFetch('/student/fee'); },
    async getTimetable() { return apiFetch('/student/timetable'); },
};

/* ── Payment API ────────────────────────────────────── */
const PaymentAPI = {
    async createIntent(feeRecordId) {
        return apiFetch('/payment/create-intent', {
            method: 'POST',
            body: JSON.stringify({ feeRecordId }),
        });
    },
    async confirmMock(paymentIntentId) {
        return apiFetch('/payment/confirm-mock', {
            method: 'POST',
            body: JSON.stringify({ paymentIntentId }),
        });
    },
    async getHistory() { return apiFetch('/payment/history'); },
};

/* ── Admin API ──────────────────────────────────────── */
const AdminAPI = {
    async getStats() { return apiFetch('/admin/stats'); },
    async getAnnouncements() { return apiFetch('/admin/announcements'); },
    async addAnnouncement(d) { return apiFetch('/admin/announcements', { method: 'POST', body: JSON.stringify(d) }); },
    async deleteAnnouncement(id) { return apiFetch(`/admin/announcements/${id}`, { method: 'DELETE' }); },
    async updateAnnouncement(id, d) { return apiFetch(`/admin/announcements/${id}`, { method: 'PATCH', body: JSON.stringify(d) }); },

    async getAdmissions(status) { return apiFetch(`/admin/admissions${status && status !== 'All' ? '?status=' + status : ''}`); },
    async addAdmission(d) { return apiFetch('/admin/admissions', { method: 'POST', body: JSON.stringify(d) }); },
    async updateAdmission(id, d) { return apiFetch(`/admin/admissions/${id}`, { method: 'PATCH', body: JSON.stringify(d) }); },
    async deleteAdmission(id) { return apiFetch(`/admin/admissions/${id}`, { method: 'DELETE' }); },

    async getStudents(search) { return apiFetch(`/admin/students${search ? '?search=' + encodeURIComponent(search) : ''}`); },
};

/* ── Toast Utility ───────────────────────────────────── */
function showToast(title, msg, type = 'info') {
    const container = document.getElementById('toast-container') || document.getElementById('admin-toast-container');
    if (!container) return;
    const iconMap = { success: 'fa-check', error: 'fa-times', info: 'fa-info', warning: 'fa-triangle-exclamation' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${iconMap[type] || 'fa-info'}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); toast.addEventListener('animationend', () => toast.remove()); }, 4000);
}

/* ── Currency / Date Formatters ──────────────────────── */
function formatCurrency(amount) {
    return 'PKR ' + Number(amount || 0).toLocaleString('en-PK');
}
function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

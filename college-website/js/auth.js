/* =====================================================
   auth.js – Authentication Guard & Helpers
   ===================================================== */

'use strict';

const Auth = (() => {

    const SESSION_KEY = 'gc_session';

    function getSession() {
        try {
            const s = localStorage.getItem(SESSION_KEY);
            return s ? JSON.parse(s) : null;
        } catch (e) {
            return null;
        }
    }

    function setSession(data) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    function isLoggedIn() {
        return getSession() !== null;
    }

    function isStudent() {
        const s = getSession();
        return s && s.role === 'student';
    }

    function isAdmin() {
        const s = getSession();
        return s && s.role === 'admin';
    }

    /* Guard for student pages */
    function requireStudent(redirectUrl = '../pages/student-login.html') {
        if (!isStudent()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /* Guard for admin pages */
    function requireAdmin(redirectUrl = '../pages/admin-login.html') {
        if (!isAdmin()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /* Student login */
    function loginStudent(email, password) {
        if (typeof CollegeData === 'undefined') return { success: false, msg: 'Data not available.' };
        const student = CollegeData.getStudentByEmail(email);
        if (!student) return { success: false, msg: 'No account found with this email address.' };
        if (student.password !== password) return { success: false, msg: 'Incorrect password. Please try again.' };
        setSession({ role: 'student', id: student.id, name: student.name, email: student.email });
        return { success: true, student };
    }

    /* Admin login */
    function loginAdmin(username, password) {
        const ADMIN_USER = 'admin';
        const ADMIN_PASS = 'admin123';
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            setSession({ role: 'admin', name: 'Admin', username });
            return { success: true };
        }
        return { success: false, msg: 'Invalid admin credentials.' };
    }

    function logout(redirectUrl = '../index.html') {
        clearSession();
        window.location.href = redirectUrl;
    }

    /* Populate UI elements with session info */
    function populateSidebarUser() {
        const session = getSession();
        if (!session) return;

        const nameEl = document.getElementById('sidebar-user-name');
        const idEl = document.getElementById('sidebar-user-id');
        const avatarEl = document.getElementById('sidebar-avatar');

        if (nameEl) nameEl.textContent = session.name;

        if (session.role === 'student') {
            const student = CollegeData.getStudentById(session.id);
            if (student) {
                if (idEl) idEl.textContent = student.rollNo;
                if (avatarEl) avatarEl.textContent = student.avatarInitials;
            }
        } else if (session.role === 'admin') {
            if (idEl) idEl.textContent = 'Administrator';
            if (avatarEl) avatarEl.textContent = 'AD';
        }
    }

    /* Highlight active sidebar link */
    function setActiveSidebarLink() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }

    /* Wire sidebar logout buttons */
    function wireLogout() {
        document.querySelectorAll('[data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const session = getSession();
                const role = session ? session.role : 'student';
                const redirect = role === 'admin' ? '../pages/admin-login.html' : '../pages/student-login.html';
                logout(redirect);
            });
        });
    }

    /* Sidebar toggle (mobile) */
    function wireSidebarToggle() {
        const btn = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (btn && sidebar) {
            btn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    /* Initialize common dashboard behaviours */
    function initDashboard(role) {
        if (role === 'student') {
            if (!requireStudent()) return false;
        } else if (role === 'admin') {
            if (!requireAdmin()) return false;
        }
        populateSidebarUser();
        setActiveSidebarLink();
        wireLogout();
        wireSidebarToggle();
        return true;
    }

    return {
        getSession,
        setSession,
        clearSession,
        isLoggedIn,
        isStudent,
        isAdmin,
        requireStudent,
        requireAdmin,
        loginStudent,
        loginAdmin,
        logout,
        initDashboard,
        populateSidebarUser,
    };
})();

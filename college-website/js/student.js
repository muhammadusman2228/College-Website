/* =====================================================
   js/student.js – Student Portal Page Controllers
   Uses API-based data (api.js) instead of localStorage
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────────────
   STUDENT LOGIN
   ───────────────────────────────────────────────────── */
async function initStudentLogin() {
    if (!document.getElementById('student-login-form')) return;

    // Already logged in?
    if (Auth.isStudent()) {
        window.location.href = '/pages/student-dashboard.html';
        return;
    }

    const form = document.getElementById('student-login-form');
    const emailEl = document.getElementById('login-email');
    const passEl = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit-btn');
    const pwdToggle = document.getElementById('pwd-toggle');

    if (pwdToggle) {
        pwdToggle.addEventListener('click', () => {
            const type = passEl.type === 'password' ? 'text' : 'password';
            passEl.type = type;
            pwdToggle.innerHTML = type === 'password'
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailEl.value.trim();
        const password = passEl.value;

        if (!email || !password) {
            showErr(errorEl, 'Please enter email and password.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

        try {
            const result = await studentLogin(email, password);
            if (result.success) {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
                setTimeout(() => { window.location.href = '/pages/student-dashboard.html'; }, 600);
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-sign-in-alt"></i> Login';
            showErr(errorEl, err.message || 'Login failed. Check credentials.');
        }
    });
}

function showErr(el, msg) {
    if (!el) return;
    el.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    el.style.display = 'block';
}

/* ─────────────────────────────────────────────────────
   STUDENT DASHBOARD
   ───────────────────────────────────────────────────── */
async function initStudentDashboard() {
    if (!document.getElementById('dashboard-welcome-section')) return;
    if (!Auth.initDashboard('student')) return;

    const user = Auth.getUser();
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('dashboard-welcome', user?.name?.split(' ')[0] || 'Student');

    try {
        const [profileRes, feeRes] = await Promise.all([
            StudentAPI.getProfile(),
            StudentAPI.getFee(),
        ]);

        const p = profileRes.data;
        const f = feeRes.data;

        setEl('stat-gpa', p.gpa?.toFixed(2) || '—');
        setEl('stat-program', p.program || '—');
        setEl('stat-sem', p.semester || '—');
        setEl('stat-fee', formatCurrency(f.summary?.pending || 0));
    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}

/* ─────────────────────────────────────────────────────
   PROFILE
   ───────────────────────────────────────────────────── */
async function initProfile() {
    if (!document.getElementById('pf-name')) return;
    if (!Auth.initDashboard('student')) return;

    try {
        const res = await StudentAPI.getProfile();
        const p = res.data;
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };

        // Avatar
        const avatarEl = document.getElementById('profile-avatar-initials');
        if (avatarEl) avatarEl.textContent = p.avatar_initials || p.name?.slice(0, 2).toUpperCase() || 'ST';

        setEl('profile-name-display', p.name);
        setEl('profile-roll', p.roll_no);
        setEl('pf-name', p.name);
        setEl('pf-email', p.email);
        setEl('pf-phone', p.phone);
        setEl('pf-dob', formatDate(p.dob));
        setEl('pf-cnic', p.cnic);
        setEl('pf-address', p.address);
        setEl('pf-program', p.program);
        setEl('pf-semester', p.semester);
        setEl('pf-section', p.section);
        setEl('pf-rollno', p.roll_no);
        setEl('pf-admission', formatDate(p.admission_date));
        setEl('pf-gpa', p.gpa?.toFixed(2));
        setEl('pf-guardian', p.guardian);
        setEl('pf-guardian-phone', p.guardian_phone);
    } catch (err) {
        console.error('Profile error:', err);
    }
}

/* ─────────────────────────────────────────────────────
   RESULTS
   ───────────────────────────────────────────────────── */
async function initResults() {
    if (!document.getElementById('result-container')) return;
    if (!Auth.initDashboard('student')) return;

    const container = document.getElementById('result-container');
    const cgpaEl = document.getElementById('cgpa-display');

    try {
        const res = await StudentAPI.getResults();
        const { semesters, cgpa } = res.data;
        if (cgpaEl) cgpaEl.textContent = cgpa;

        if (!semesters.length) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">No results available.</p>';
            return;
        }

        const gradeColor = g => {
            if (g?.startsWith('A')) return 'grade-A';
            if (g?.startsWith('B')) return 'grade-B';
            if (g?.startsWith('C')) return 'grade-C';
            return 'grade-D';
        };

        container.innerHTML = semesters.map((sem, i) => `
      <div class="page-card anim-fade-up" style="margin-bottom:20px;animation-delay:${i * 0.05}s">
        <div class="page-card-header">
          <div class="page-card-title">
            <i class="fa-solid fa-book-open"></i> ${sem.label}
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:0.75rem;color:var(--text-muted)">Sem GPA</span>
            <span style="font-size:1.1rem;font-weight:800;color:var(--accent)">${Number(sem.gpa).toFixed(2)}</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th><th>Subject</th><th>Credits</th>
                <th>Marks</th><th>Progress</th><th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${sem.subjects.map(sub => `
                <tr>
                  <td style="font-size:0.75rem;color:var(--text-muted)">${sub.code}</td>
                  <td style="font-weight:500">${sub.name}</td>
                  <td style="text-align:center">${sub.credit}</td>
                  <td style="font-weight:600;color:var(--white)">${sub.marks}<span style="color:var(--text-muted;font-size:0.7rem">/${sub.total}</span></td>
                  <td style="min-width:100px">
                    <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden">
                      <div style="height:100%;width:${Math.round((sub.marks / sub.total) * 100)}%;background:var(--grad-accent);border-radius:99px;transition:width 1s"></div>
                    </div>
                  </td>
                  <td><span class="grade-badge ${gradeColor(sub.grade)}">${sub.grade}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');

    } catch (err) {
        container.innerHTML = `<p style="color:var(--danger);padding:40px;text-align:center"><i class="fa-solid fa-circle-exclamation"></i> ${err.message}</p>`;
    }
}

/* ─────────────────────────────────────────────────────
   FEE STATUS
   ───────────────────────────────────────────────────── */
async function initFeeStatus() {
    if (!document.getElementById('fee-items-body')) return;
    if (!Auth.initDashboard('student')) return;

    try {
        const res = await StudentAPI.getFee();
        const { records, summary } = res.data;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('fee-total', formatCurrency(summary.total));
        setEl('fee-paid', formatCurrency(summary.paid));
        setEl('fee-pending', formatCurrency(summary.pending));
        setEl('fee-progress-pct', summary.percentage + '%');
        setEl('fee-progress-pct-2', summary.percentage + '% paid');

        // Progress bar
        const bar = document.getElementById('fee-progress-bar');
        if (bar) setTimeout(() => { bar.style.width = summary.percentage + '%'; }, 200);

        // Table
        const tbody = document.getElementById('fee-items-body');
        if (!tbody) return;

        const statusBadge = s => {
            const map = { Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-danger' };
            return `<span class="badge ${map[s] || 'badge-info'}">${s}</span>`;
        };

        tbody.innerHTML = records.map(r => `
      <tr>
        <td style="font-weight:500">${r.title}</td>
        <td style="font-weight:600;color:var(--white)">${formatCurrency(r.amount)}</td>
        <td>${formatDate(r.due_date)}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${r.paid_on ? formatDate(r.paid_on) : '<span style="color:var(--text-muted)">—</span>'}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:40px">No fee records found.</td></tr>';

    } catch (err) {
        console.error('Fee status error:', err);
    }
}

/* ─────────────────────────────────────────────────────
   FEE PAYMENT (Multi-step + Stripe)
   ───────────────────────────────────────────────────── */
async function initFeePayment() {
    if (!document.querySelector('.payment-step')) return;
    if (!Auth.initDashboard('student')) return;

    /* ── Populate dropdown ── */
    try {
        const res = await StudentAPI.getFee();
        const pendingItems = res.data.records.filter(r => r.status !== 'Paid');
        const select = document.getElementById('payment-amount-select');
        if (select) {
            select.innerHTML = '<option value="">-- Select a fee item --</option>' +
                pendingItems.map(r => `<option value="${r.id}" data-amount="${r.amount}">${r.title} – ${formatCurrency(r.amount)}</option>`).join('');
        }
    } catch { /* silent */ }

    let selectedRecord = null;
    let paymentIntentId = null;
    let isMockMode = false;

    /* ── Step navigation ── */
    const goToStep = (n) => {
        document.querySelectorAll('.payment-step').forEach(el => el.style.display = 'none');
        const target = document.querySelector(`.payment-step[data-step="${n}"]`);
        if (target) target.style.display = 'block';
        [1, 2, 3].forEach(i => {
            const item = document.getElementById(`step-${i}-item`);
            const line = document.getElementById(`step-line-${i}`);
            if (item) item.className = 'step-item' + (i < n ? ' done' : (i === n ? ' active' : ''));
            if (line) line.className = 'step-line' + (i < n ? ' done' : '');
        });
    };

    /* ── Step 1: Select ── */
    document.getElementById('next-step-1')?.addEventListener('click', async () => {
        const select = document.getElementById('payment-amount-select');
        if (!select?.value) { alert('Please select a fee item.'); return; }
        const opt = select.options[select.selectedIndex];
        selectedRecord = { id: select.value, amount: parseInt(opt.dataset.amount), title: opt.text };
        const amtEl = document.getElementById('payment-amount-display');
        if (amtEl) amtEl.textContent = formatCurrency(selectedRecord.amount);
        goToStep(2);
    });

    /* ── Step 2: Card Preview ── */
    const numberEl = document.getElementById('card-number');
    const holderEl = document.getElementById('card-holder');
    const expiryEl = document.getElementById('card-expiry');
    const cvvEl = document.getElementById('card-cvv');

    const numDisplay = document.getElementById('card-number-display');
    const holderDisplay = document.getElementById('card-holder-display');
    const expiryDisplay = document.getElementById('card-expiry-display');

    if (numberEl) {
        numberEl.addEventListener('input', () => {
            let v = numberEl.value.replace(/\D/g, '').slice(0, 16);
            numberEl.value = v.replace(/(.{4})/g, '$1 ').trim();
            if (numDisplay) numDisplay.textContent = numberEl.value || '•••• •••• •••• ••••';
        });
    }
    if (holderEl && holderDisplay) holderEl.addEventListener('input', () => { holderDisplay.textContent = holderEl.value.toUpperCase() || 'YOUR NAME'; });
    if (expiryEl) {
        expiryEl.addEventListener('input', () => {
            let v = expiryEl.value.replace(/\D/g, '').slice(0, 4);
            if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
            expiryEl.value = v;
            if (expiryDisplay) expiryDisplay.textContent = expiryEl.value || 'MM/YY';
        });
    }

    document.getElementById('back-step-2')?.addEventListener('click', () => goToStep(1));

    /* ── Step 2 Submit: call API then confirm ── */
    document.getElementById('payment-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

        try {
            // 1. Create PaymentIntent
            const intentRes = await PaymentAPI.createIntent(selectedRecord.id);
            paymentIntentId = intentRes.paymentIntentId;
            isMockMode = intentRes.mock === true;

            // 2a. If real Stripe – use Stripe.js
            if (!isMockMode && intentRes.publishableKey && window.Stripe) {
                const stripe = Stripe(intentRes.publishableKey);
                const cardNum = numberEl.value.replace(/\s/g, '');
                const [expMonth, expYear] = (expiryEl.value || '').split('/');
                const confirmResult = await stripe.confirmCardPayment(intentRes.clientSecret, {
                    payment_method: {
                        card: { number: cardNum, exp_month: expMonth, exp_year: '20' + expYear, cvc: cvvEl.value },
                        billing_details: { name: holderEl.value },
                    },
                });
                if (confirmResult.error) throw new Error(confirmResult.error.message);
                showReceipt({ amount: selectedRecord.amount, feeTitle: selectedRecord.title });
                goToStep(3);
                return;
            }

            // 2b. Mock mode: confirm via API
            const confirmRes = await PaymentAPI.confirmMock(paymentIntentId);
            showReceipt(confirmRes.receipt);
            goToStep(3);

        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-lock"></i> Pay Securely';
            alert('Payment error: ' + err.message);
        }
    });

    function showReceipt(r) {
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('receipt-txn', r?.transactionId || 'TXN-' + Date.now());
        setEl('receipt-amount', formatCurrency(r?.amount || 0));
        setEl('receipt-date', r?.date || new Date().toLocaleString('en-PK'));
        setEl('receipt-card', `•••• •••• •••• ${(document.getElementById('card-number')?.value || '').replace(/\s/g, '').slice(-4) || '****'}`);
    }
}

/* ─────────────────────────────────────────────────────
   TIMETABLE
   ───────────────────────────────────────────────────── */
async function initTimetable() {
    if (!document.getElementById('timetable-body')) return;
    if (!Auth.initDashboard('student')) return;

    const tbody = document.getElementById('timetable-body');
    const ttProgEl = document.getElementById('tt-program');

    try {
        const res = await StudentAPI.getTimetable();
        const { program, days } = res.data;
        if (ttProgEl) ttProgEl.textContent = program;

        if (!days.length) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:40px">No timetable data.</td></tr>';
            return;
        }

        const getCellClass = (val) => {
            if (!val || val === 'Free') return 'tt-cell tt-free';
            const v = val.toLowerCase();
            if (v.includes('break') || v.includes('lunch') || v.includes('prayer')) return 'tt-cell tt-break';
            if (v.includes('cs') || v.includes('comput')) return 'tt-cell tt-cs';
            if (v.includes('math') || v.includes('calc')) return 'tt-cell tt-math';
            if (v.includes('phy') || v.includes('ee-') || v.includes('electric')) return 'tt-cell tt-phy';
            if (v.includes('eng') || v.includes('bba') || v.includes('mkt') || v.includes('fin') || v.includes('hrm') || v.includes('acc')) return 'tt-cell tt-eng';
            return 'tt-cell';
        };

        tbody.innerHTML = days.map(d => {
            const periods = [d.period_1, d.period_2, d.period_3, d.period_4, d.period_5, d.period_6, d.period_7];
            return `<tr>
        <td style="font-weight:700;color:var(--white)">${d.day}</td>
        ${periods.map(p => `<td><div class="${getCellClass(p)}">${p || 'Free'}</div></td>`).join('')}
      </tr>`;
        }).join('');

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--danger);padding:40px">${err.message}</td></tr>`;
    }
}

/* ── Auto-init ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initStudentLogin();
    initStudentDashboard();
    initProfile();
    initResults();
    initFeeStatus();
    initFeePayment();
    initTimetable();
});

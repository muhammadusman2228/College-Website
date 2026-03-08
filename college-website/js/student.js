/* =====================================================
   student.js – Student Portal Page Controllers
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────────────────
   LOGIN PAGE
   ───────────────────────────────────────────────────── */
function initStudentLogin() {
    if (!document.getElementById('student-login-form')) return;

    // Redirect if already logged in
    if (Auth.isStudent()) {
        window.location.href = 'student-dashboard.html';
        return;
    }

    const form = document.getElementById('student-login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.getElementById('login-error');
    const submitBtn = form.querySelector('[type="submit"]');
    const pwdToggle = document.getElementById('pwd-toggle');

    // Password visibility toggle
    if (pwdToggle) {
        pwdToggle.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            pwdToggle.innerHTML = type === 'password'
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showFormError(errorMsg, 'Please fill in all fields.');
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';

        setTimeout(() => {
            const result = Auth.loginStudent(email, password);
            if (result.success) {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Logged In!';
                setTimeout(() => { window.location.href = 'student-dashboard.html'; }, 600);
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-sign-in-alt"></i> Login';
                showFormError(errorMsg, result.msg);
                emailInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
            }
        }, 1000);
    });

    // Clear errors on input
    [emailInput, passwordInput].forEach(el => {
        el.addEventListener('input', () => {
            el.classList.remove('is-invalid');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    });
}

function showFormError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '8px';
    el.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
}

/* ─────────────────────────────────────────────────────
   DASHBOARD PAGE
   ───────────────────────────────────────────────────── */
function initStudentDashboard() {
    if (!document.getElementById('dashboard-welcome')) return;

    if (!Auth.initDashboard('student')) return;

    const session = Auth.getSession();
    const student = CollegeData.getStudentById(session.id);
    if (!student) return;

    // Welcome text
    const welcomeEl = document.getElementById('dashboard-welcome');
    if (welcomeEl) welcomeEl.textContent = student.name.split(' ')[0] + '!';

    // Stats
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('stat-gpa', student.gpa.toFixed(2));
    setEl('stat-program', student.program.replace('BS ', '').replace('Bachelor of ', ''));
    setEl('stat-sem', student.semester);

    // Fee pending
    const fee = CollegeData.feeRecords[student.id];
    if (fee) {
        setEl('stat-fee', CollegeData.formatCurrency(fee.pending));
    }

    // Topbar date
    const dateEl = document.getElementById('topbar-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}

/* ─────────────────────────────────────────────────────
   PROFILE PAGE
   ───────────────────────────────────────────────────── */
function initProfilePage() {
    if (!document.getElementById('profile-name-display')) return;

    if (!Auth.initDashboard('student')) return;

    const session = Auth.getSession();
    const student = CollegeData.getStudentById(session.id);
    if (!student) return;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

    setEl('profile-name-display', student.name);
    setEl('profile-roll', student.rollNo);
    setEl('profile-avatar-initials', student.avatarInitials);
    setEl('pf-name', student.name);
    setEl('pf-email', student.email);
    setEl('pf-phone', student.phone);
    setEl('pf-dob', CollegeData.formatDate(student.dob));
    setEl('pf-cnic', student.cnic);
    setEl('pf-address', student.address);
    setEl('pf-program', student.program);
    setEl('pf-semester', student.semester);
    setEl('pf-section', student.section);
    setEl('pf-rollno', student.rollNo);
    setEl('pf-guardian', student.guardian);
    setEl('pf-guardian-phone', student.guardianPhone);
    setEl('pf-admission', CollegeData.formatDate(student.admissionDate));
    setHtml('pf-status', `<span class="badge badge-success">${student.status}</span>`);
    setHtml('pf-gpa', `<span style="color:var(--accent);font-weight:700">${student.gpa.toFixed(2)}</span>`);
}

/* ─────────────────────────────────────────────────────
   RESULT PAGE
   ───────────────────────────────────────────────────── */
function initResultPage() {
    if (!document.getElementById('result-container')) return;

    if (!Auth.initDashboard('student')) return;

    const session = Auth.getSession();
    const semesters = CollegeData.results[session.id];
    if (!semesters) return;

    const container = document.getElementById('result-container');
    const cgpaEl = document.getElementById('cgpa-display');

    const gradeClass = (g) => {
        if (g.startsWith('A')) return 'grade-A';
        if (g.startsWith('B')) return 'grade-B';
        if (g.startsWith('C')) return 'grade-C';
        return 'grade-D';
    };

    let totalGpaSum = 0;

    container.innerHTML = semesters.map((sem, i) => {
        totalGpaSum += sem.gpa;
        return `
      <div class="page-card reveal" style="margin-bottom:24px;animation-delay:${i * 0.1}s">
        <div class="page-card-header">
          <div class="page-card-title">
            <i class="fa-solid fa-graduation-cap"></i>
            ${sem.semester}
          </div>
          <div style="display:flex;gap:12px;align-items:center">
            <span class="badge badge-info">Credits: ${sem.totalCredits}</span>
            <span class="badge badge-accent">GPA: ${sem.gpa.toFixed(2)}</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject</th>
                <th>Credits</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${sem.subjects.map(sub => `
                <tr>
                  <td><code style="color:var(--text-muted);font-size:0.8rem">${sub.code}</code></td>
                  <td style="font-weight:500">${sub.name}</td>
                  <td>${sub.credit}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      ${sub.marks}/${sub.total}
                      <div style="flex:1;max-width:60px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden">
                        <div style="width:${sub.marks}%;height:100%;background:var(--grad-accent)"></div>
                      </div>
                    </div>
                  </td>
                  <td><span class="grade-badge ${gradeClass(sub.grade)}">${sub.grade}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    }).join('');

    const cgpa = (totalGpaSum / semesters.length).toFixed(2);
    if (cgpaEl) cgpaEl.textContent = cgpa;
}

/* ─────────────────────────────────────────────────────
   FEE STATUS PAGE
   ───────────────────────────────────────────────────── */
function initFeeStatusPage() {
    if (!document.getElementById('fee-items-body')) return;

    if (!Auth.initDashboard('student')) return;

    const session = Auth.getSession();
    const feeData = CollegeData.feeRecords[session.id];
    if (!feeData) return;

    // Summary cards
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('fee-total', CollegeData.formatCurrency(feeData.total));
    setEl('fee-paid', CollegeData.formatCurrency(feeData.paid));
    setEl('fee-pending', CollegeData.formatCurrency(feeData.pending));

    // Table
    const tbody = document.getElementById('fee-items-body');
    const statusBadge = (s) => {
        const map = { Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-danger' };
        return `<span class="badge ${map[s] || 'badge-info'}">${s}</span>`;
    };

    tbody.innerHTML = feeData.items.map(item => `
    <tr>
      <td style="font-weight:500">${item.title}</td>
      <td>${CollegeData.formatCurrency(item.amount)}</td>
      <td>${CollegeData.formatDate(item.dueDate)}</td>
      <td>${statusBadge(item.status)}</td>
      <td>${item.paidOn ? CollegeData.formatDate(item.paidOn) : '—'}</td>
    </tr>
  `).join('');

    // Progress bar
    const pct = Math.round((feeData.paid / feeData.total) * 100);
    const bar = document.getElementById('fee-progress-bar');
    const pctEl = document.getElementById('fee-progress-pct');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
}

/* ─────────────────────────────────────────────────────
   FEE PAYMENT PAGE
   ───────────────────────────────────────────────────── */
function initFeePaymentPage() {
    if (!document.getElementById('payment-form')) return;

    if (!Auth.initDashboard('student')) return;

    const session = Auth.getSession();
    const feeData = CollegeData.feeRecords[session.id];

    let currentStep = 1;

    // Populate pending amounts
    const amountSelect = document.getElementById('payment-amount-select');
    if (amountSelect && feeData) {
        const pending = feeData.items.filter(i => i.status !== 'Paid');
        amountSelect.innerHTML = `<option value="">-- Select a fee item --</option>` +
            pending.map(i => `<option value="${i.amount}">${i.title} – ${CollegeData.formatCurrency(i.amount)}</option>`).join('');
    }

    // Step navigation
    function showStep(n) {
        document.querySelectorAll('.payment-step').forEach(el => {
            el.style.display = el.dataset.step == n ? 'block' : 'none';
        });
        document.querySelectorAll('.step-item').forEach((el, idx) => {
            el.classList.remove('active', 'done');
            if (idx + 1 < n) el.classList.add('done');
            if (idx + 1 === n) el.classList.add('active');
        });
        document.querySelectorAll('.step-line').forEach((el, idx) => {
            el.classList.toggle('done', idx + 1 < n);
        });
        currentStep = n;
    }

    // Card number formatting
    const cardNumberEl = document.getElementById('card-number');
    const cardDisplayEl = document.getElementById('card-number-display');
    if (cardNumberEl) {
        cardNumberEl.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 16);
            e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
            if (cardDisplayEl) {
                const padded = v.padEnd(16, '•');
                cardDisplayEl.textContent = padded.replace(/(.{4})/g, '$1 ').trim();
            }
        });
    }

    const cardNameEl = document.getElementById('card-holder');
    const cardNameDisplayEl = document.getElementById('card-holder-display');
    if (cardNameEl && cardNameDisplayEl) {
        cardNameEl.addEventListener('input', () => {
            cardNameDisplayEl.textContent = cardNameEl.value.toUpperCase() || 'YOUR NAME';
        });
    }

    const expiryEl = document.getElementById('card-expiry');
    const expiryDisplayEl = document.getElementById('card-expiry-display');
    if (expiryEl) {
        expiryEl.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
            if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
            e.target.value = v;
            if (expiryDisplayEl) expiryDisplayEl.textContent = v || 'MM/YY';
        });
    }

    const cvvEl = document.getElementById('card-cvv');
    if (cvvEl) {
        cvvEl.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }

    // Step 1 → Step 2
    const nextBtn1 = document.getElementById('next-step-1');
    if (nextBtn1) {
        nextBtn1.addEventListener('click', () => {
            const amount = document.getElementById('payment-amount-select').value;
            if (!amount) { alert('Please select a fee item.'); return; }
            const amtDisplay = document.getElementById('payment-amount-display');
            if (amtDisplay) amtDisplay.textContent = CollegeData.formatCurrency(parseInt(amount));
            showStep(2);
        });
    }

    // Step 2 back
    const backBtn2 = document.getElementById('back-step-2');
    if (backBtn2) backBtn2.addEventListener('click', () => showStep(1));

    // Submit payment
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const cardNum = (cardNumberEl?.value || '').replace(/\s/g, '');
            const holder = cardNameEl?.value || '';
            const expiry = expiryEl?.value || '';
            const cvv = cvvEl?.value || '';

            if (cardNum.length < 16 || !holder || expiry.length < 5 || cvv.length < 3) {
                alert('Please fill in all card details correctly.');
                return;
            }

            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

            setTimeout(() => {
                const amount = parseInt(document.getElementById('payment-amount-select').value);
                const txnId = 'TXN' + Date.now();

                CollegeData.addPayment({
                    txnId,
                    studentId: session.id,
                    amount,
                    date: new Date().toISOString(),
                    method: 'Card',
                    last4: cardNum.slice(-4),
                });

                // Show receipt
                document.getElementById('receipt-txn').textContent = txnId;
                document.getElementById('receipt-amount').textContent = CollegeData.formatCurrency(amount);
                document.getElementById('receipt-date').textContent = new Date().toLocaleString('en-PK');
                document.getElementById('receipt-card').textContent = '•••• •••• •••• ' + cardNum.slice(-4);
                showStep(3);
            }, 2000);
        });
    }

    showStep(1);
}

/* ─────────────────────────────────────────────────────
   TIMETABLE PAGE
   ───────────────────────────────────────────────────── */
function initTimetablePage() {
    if (!document.getElementById('timetable-body')) return;

    if (!Auth.initDashboard('student')) return;

    const session = Auth.getSession();
    const tt = CollegeData.timetables[session.id];
    if (!tt) return;

    const programEl = document.getElementById('tt-program');
    if (programEl) programEl.textContent = tt.program;

    const days = Object.keys(tt.days);
    const tbody = document.getElementById('timetable-body');

    const subjectClass = (text) => {
        if (!text || text === 'Free') return 'tt-free';
        if (text.includes('Break') || text.includes('Lunch') || text.includes('Prayer')) return 'tt-break';
        const t = text.toLowerCase();
        if (t.includes('math') || t.includes('calc') || t.includes('dm')) return 'tt-math';
        if (t.includes('phys') || t.includes('phy')) return 'tt-phy';
        if (t.includes('chem')) return 'tt-chem';
        if (t.includes('bio')) return 'tt-bio';
        if (t.includes('eng')) return 'tt-eng';
        if (t.includes('cs') || t.includes('db') || t.includes('oop') || t.includes('dsa') || t.includes('computing')) return 'tt-cs';
        if (t.includes('urdu')) return 'tt-urdu';
        if (t.includes('isl')) return 'tt-isl';
        if (t.includes('pak')) return 'tt-pak';
        if (t.includes('ee') || t.includes('circuit') || t.includes('elec')) return 'tt-phy';
        if (t.includes('mkt') || t.includes('fin') || t.includes('acc') || t.includes('hrm') || t.includes('bba')) return 'tt-eng';
        return 'tt-cs';
    };

    tbody.innerHTML = days.map(day => `
    <tr>
      <td style="font-weight:700;color:var(--accent);white-space:nowrap">${day}</td>
      ${tt.days[day].map(cell => `
        <td>
          ${cell === 'Free' || !cell
            ? `<span class="tt-free">${cell || '—'}</span>`
            : `<div class="tt-cell ${subjectClass(cell)}">${cell}</div>`
        }
        </td>
      `).join('')}
    </tr>
  `).join('');
}

/* ── Auto-init based on page ───────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initStudentLogin();
    initStudentDashboard();
    initProfilePage();
    initResultPage();
    initFeeStatusPage();
    initFeePaymentPage();
    initTimetablePage();
});

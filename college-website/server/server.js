/* =====================================================
   server.js – Greenfield College Backend
   Node.js + Express + SQLite + Stripe
   Run: npm run dev  (uses nodemon)
   ===================================================== */

'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { getDb, createTables } = require('./db/database');

const publicRoutes = require('./routes/public.routes');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');

const PORT = process.env.PORT || 3001;

const app = express();

/* ── Security Headers ─────────────────────────────── */
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

/* ── CORS ─────────────────────────────────────────── */
app.use(cors({
    origin: (origin, cb) => cb(null, true),  // allow all origins in dev (file://)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

/* ── Rate Limiting ────────────────────────────────── */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

/* ── Body Parsing ─────────────────────────────────── */
// NOTE: Stripe webhook needs raw body, so it's registered BEFORE json parser
// via express.raw() inside payment.routes.js

app.use((req, res, next) => {
    // Skip raw body for webhook – handled in route
    if (req.path === '/api/payment/webhook') return next();
    express.json({ limit: '2mb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

/* ── Serve Frontend Static Files ──────────────────── */
const FRONTEND = path.join(__dirname, '..'); // college-website/
app.use(express.static(FRONTEND));

/* ── API Routes ───────────────────────────────────── */
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

/* ── SPA Fallback ─────────────────────────────────── */
app.get('/pages/*', (req, res) => {
    const filePath = path.join(FRONTEND, req.path);
    res.sendFile(filePath, err => {
        if (err) res.status(404).send('Page not found');
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND, 'index.html'));
});

/* ── Error Handler ────────────────────────────────── */
app.use((err, req, res, _next) => {
    console.error('[Error]', err.stack || err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

/* ── Startup ──────────────────────────────────────── */
async function start() {
    try {
        // Initialize database
        await getDb();
        createTables();
        console.log('✓ Database ready (college.db)');

        // Auto-seed if database is empty (fresh Railway deploy)
        const { get: dbGet, run: dbRun, all: dbAll } = require('./db/database');
        const count = dbGet('SELECT COUNT(*) as c FROM students');
        if (!count || count.c === 0) {
            console.log('📦 Empty database – running seeder...');
            try {
                // Call seed.js logic without process.exit
                const bcrypt = require('bcryptjs');
                const students = [
                    { id: 'S001', name: 'Sara Ahmed', email: 'sara@college.edu', pw: 'password123', rn: '2024-CS-001', program: 'BS Computer Science', sem: '4th', sec: 'A', dob: '2004-05-15', ph: '+92-300-1234567', addr: 'Gulberg, Lahore', grd: 'Mr. Arif Ahmed', gph: '+92-321-7654321', gpa: 3.75, d: '2024-09-01', av: 'SA' },
                    { id: 'S002', name: 'Ali Hassan', email: 'ali@college.edu', pw: 'pass456', rn: '2024-EE-012', program: 'BS Electrical Engineering', sem: '2nd', sec: 'B', dob: '2005-02-20', ph: '+92-311-9876543', addr: 'Model Town, Lahore', grd: 'Mr. Tariq Hassan', gph: '+92-333-1122334', gpa: 3.20, d: '2025-01-15', av: 'AH' },
                    { id: 'S003', name: 'Fatima Khan', email: 'fatima@college.edu', pw: 'khan789', rn: '2023-BBA-007', program: 'BBA', sem: '6th', sec: 'C', dob: '2003-11-08', ph: '+92-333-4455667', addr: 'Bahria Town, RWP', grd: 'Mr. Imran Khan', gph: '+92-345-6677889', gpa: 3.90, d: '2023-09-01', av: 'FK' },
                ];
                for (const s of students) {
                    const hash = bcrypt.hashSync(s.pw, 10);
                    dbRun(`INSERT OR IGNORE INTO students (id,name,email,password_hash,roll_no,program,semester,section,dob,phone,address,guardian,guardian_phone,gpa,status,admission_date,avatar_initials) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [s.id, s.name, s.email, hash, s.rn, s.program, s.sem, s.sec, s.dob, s.ph, s.addr, s.grd, s.gph, s.gpa, 'Active', s.d, s.av]);
                }
                // Seed announcements
                const anns = [
                    ['Mid-Term Examinations Schedule 2025', 'Exams', 'Examination Department', 'Mid-term examinations for all departments will commence from March 20, 2025.', '2026-03-01', 'fa-solid fa-calendar-check'],
                    ['Annual Sports Week – Registration Open', 'Events', 'Sports Committee', 'Annual Sports Week: April 10–15, 2025. Register for cricket, football, basketball.', '2026-02-25', 'fa-solid fa-trophy'],
                    ['Admissions Open for Fall 2025', 'Admissions', 'Admissions Office', 'Admissions for Fall 2025 are now open. Merit-based scholarships available.', '2026-02-20', 'fa-solid fa-graduation-cap'],
                ];
                for (const a of anns) dbRun(`INSERT OR IGNORE INTO announcements (title,category,author,excerpt,date,icon) VALUES (?,?,?,?,?,?)`, a);
                // Seed admissions
                const admArr = [
                    ['ADM-001', 'Bilal Raza', 'BS Computer Science', '35201-1112223-4', 'bilal@mail.com', 'Approved', '2026-03-01'],
                    ['ADM-002', 'Sana Malik', 'BBA', '35202-3334445-6', 'sana@mail.com', 'Pending', '2026-03-03'],
                    ['ADM-003', 'Usman Tariq', 'BS Electrical Engineering', '35203-5556667-8', 'usman@mail.com', 'Pending', '2026-03-05'],
                    ['ADM-004', 'Ayesha Noor', 'BS Computer Science', '35204-7778889-0', 'ayesha@mail.com', 'Rejected', '2026-03-02'],
                ];
                for (const a of admArr) dbRun(`INSERT OR IGNORE INTO admissions (id,name,program,cnic,email,status,applied_on) VALUES (?,?,?,?,?,?,?)`, a);
                console.log('✓ Auto-seed complete');
            } catch (seedErr) {
                console.error('⚠ Auto-seed error:', seedErr.message);
            }
        } else {
            console.log(`✓ Found ${count.c} student(s) in database`);
        }

        // Bind to 0.0.0.0 so Railway/Render can reach the server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🎓 Greenfield College running on port ${PORT}`);
            console.log(`🔗 API health: /api/health`);
            console.log(`👤 Student: sara@college.edu / password123`);
            console.log(`🔐 Admin:   admin / admin123\n`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

start();

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

        app.listen(PORT, () => {
            console.log('');
            console.log('┌──────────────────────────────────────────────────┐');
            console.log('│   🎓 Greenfield College Backend Server             │');
            console.log('├──────────────────────────────────────────────────┤');
            console.log(`│   ✅ Running on: http://localhost:${PORT}            │`);
            console.log('│   📚 Frontend:   http://localhost:3001/           │');
            console.log('│   🔗 API Docs:   http://localhost:3001/api/health │');
            console.log('├──────────────────────────────────────────────────┤');
            console.log('│   Student Logins:                                  │');
            console.log('│   sara@college.edu / password123                  │');
            console.log('│   ali@college.edu / pass456                       │');
            console.log('│   fatima@college.edu / khan789                    │');
            console.log('│   Admin: admin / admin123                         │');
            console.log('└──────────────────────────────────────────────────┘');
            console.log('');
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

start();

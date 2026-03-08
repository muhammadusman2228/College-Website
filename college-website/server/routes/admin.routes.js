/* =====================================================
   routes/admin.routes.js
   All routes require valid admin JWT
   GET  /api/admin/stats
   GET/POST/DELETE /api/admin/announcements
   GET/POST/PATCH  /api/admin/admissions
   GET             /api/admin/students
   ===================================================== */

'use strict';

const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { get, all, run } = require('../db/database');

// All admin routes require admin JWT
router.use(requireAdmin);

/* ── Dashboard Stats ─────────────────────────────── */
router.get('/stats', (req, res) => {
    try {
        const totalStudents = get('SELECT COUNT(*) as c FROM students')?.c || 0;
        const totalAnn = get('SELECT COUNT(*) as c FROM announcements')?.c || 0;
        const totalAdm = get('SELECT COUNT(*) as c FROM admissions')?.c || 0;
        const pendingAdm = get('SELECT COUNT(*) as c FROM admissions WHERE status = "Pending"')?.c || 0;
        const paidPayments = get('SELECT SUM(amount) as s FROM payments WHERE status = "succeeded"')?.s || 0;
        const recentAnn = all('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 3');

        res.json({
            success: true,
            data: {
                totalStudents,
                totalAnnouncements: totalAnn,
                totalAdmissions: totalAdm,
                pendingAdmissions: pendingAdm,
                totalPaymentsCollected: paidPayments,
                recentAnnouncements: recentAnn,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ── Announcements ───────────────────────────────── */

// GET all
router.get('/announcements', (req, res) => {
    try {
        const rows = all('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create
router.post('/announcements', (req, res) => {
    try {
        const { title, category, author, excerpt, icon } = req.body;
        if (!title || !excerpt) {
            return res.status(400).json({ success: false, message: 'Title and excerpt are required.' });
        }
        const catIcons = { Exams: 'fa-solid fa-calendar-check', Events: 'fa-solid fa-trophy', Admissions: 'fa-solid fa-graduation-cap', General: 'fa-solid fa-bullhorn' };
        const finalIcon = icon || catIcons[category] || 'fa-solid fa-bullhorn';
        const today = new Date().toISOString().split('T')[0];

        run(
            `INSERT INTO announcements (title, category, author, excerpt, date, icon) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, category || 'General', author || 'Admin', excerpt, today, finalIcon]
        );

        const created = all('SELECT * FROM announcements ORDER BY id DESC LIMIT 1')[0];
        res.status(201).json({ success: true, message: 'Announcement created.', data: created });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE
router.delete('/announcements/:id', (req, res) => {
    try {
        const { id } = req.params;
        const existing = get('SELECT id FROM announcements WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'Announcement not found.' });
        run('DELETE FROM announcements WHERE id = ?', [id]);
        res.json({ success: true, message: 'Announcement deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PATCH update
router.patch('/announcements/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, author, excerpt } = req.body;
        const existing = get('SELECT id FROM announcements WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'Not found.' });

        run(
            `UPDATE announcements SET title=?, category=?, author=?, excerpt=? WHERE id=?`,
            [title, category || 'General', author || 'Admin', excerpt, id]
        );
        res.json({ success: true, message: 'Updated.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ── Admissions ──────────────────────────────────── */

// GET all (with optional ?status= filter)
router.get('/admissions', (req, res) => {
    try {
        const { status } = req.query;
        const rows = status && status !== 'All'
            ? all('SELECT * FROM admissions WHERE status = ? ORDER BY applied_on DESC', [status])
            : all('SELECT * FROM admissions ORDER BY applied_on DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create new admission
router.post('/admissions', (req, res) => {
    try {
        const { name, program, cnic, email } = req.body;
        if (!name || !program || !email) {
            return res.status(400).json({ success: false, message: 'Name, program and email are required.' });
        }

        // Generate ID
        const countRow = get('SELECT COUNT(*) as c FROM admissions');
        const id = 'ADM-' + String((countRow?.c || 0) + 1).padStart(3, '0');
        const today = new Date().toISOString().split('T')[0];

        run(
            `INSERT INTO admissions (id, name, program, cnic, email, status, applied_on) VALUES (?,?,?,?,?,'Pending',?)`,
            [id, name, program, cnic || '', email, today]
        );

        const created = get('SELECT * FROM admissions WHERE id = ?', [id]);
        res.status(201).json({ success: true, message: 'Admission application added.', data: created });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PATCH update status
router.patch('/admissions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }
        const existing = get('SELECT id FROM admissions WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'Admission not found.' });

        run('UPDATE admissions SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: `Status updated to ${status}.` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE admission
router.delete('/admissions/:id', (req, res) => {
    try {
        run('DELETE FROM admissions WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Admission deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ── Students ────────────────────────────────────── */
router.get('/students', (req, res) => {
    try {
        const { search } = req.query;
        let rows;
        if (search) {
            const q = `%${search}%`;
            rows = all(
                `SELECT id, name, email, roll_no, program, semester, gpa, status, avatar_initials
         FROM students WHERE name LIKE ? OR roll_no LIKE ? OR email LIKE ? OR program LIKE ?`,
                [q, q, q, q]
            );
        } else {
            rows = all(
                `SELECT id, name, email, roll_no, program, semester, gpa, status, avatar_initials FROM students`
            );
        }
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ── Student Fee Records (admin view) ───────────── */
router.get('/students/:id/fee', (req, res) => {
    try {
        const records = all('SELECT * FROM fee_records WHERE student_id = ?', [req.params.id]);
        res.json({ success: true, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

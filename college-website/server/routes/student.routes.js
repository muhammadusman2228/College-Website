/* =====================================================
   routes/student.routes.js
   All routes require valid student JWT
   GET /api/student/profile
   GET /api/student/results
   GET /api/student/fee
   GET /api/student/timetable
   ===================================================== */

'use strict';

const express = require('express');
const router = express.Router();
const { requireStudent } = require('../middleware/auth');
const { get, all } = require('../db/database');

// All student routes require authentication
router.use(requireStudent);

/** GET /api/student/profile */
router.get('/profile', (req, res) => {
    try {
        const student = get(
            `SELECT id, name, email, roll_no, cnic, program, semester, section, dob,
              phone, address, guardian, guardian_phone, gpa, status, admission_date, avatar_initials
       FROM students WHERE id = ?`,
            [req.user.id]
        );
        if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
        res.json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** GET /api/student/results */
router.get('/results', (req, res) => {
    try {
        const rows = all(
            `SELECT * FROM results WHERE student_id = ? ORDER BY semester_order ASC, subject_code ASC`,
            [req.user.id]
        );

        // Group by semester
        const semesters = {};
        for (const row of rows) {
            if (!semesters[row.semester_label]) {
                semesters[row.semester_label] = {
                    label: row.semester_label,
                    order: row.semester_order,
                    gpa: row.semester_gpa,
                    subjects: [],
                };
            }
            semesters[row.semester_label].subjects.push({
                code: row.subject_code,
                name: row.subject_name,
                credit: row.credit,
                marks: row.marks,
                total: row.total_marks,
                grade: row.grade,
            });
        }

        const semList = Object.values(semesters).sort((a, b) => a.order - b.order);

        // Calculate CGPA
        const allGpas = semList.map(s => s.gpa);
        const cgpa = allGpas.length ? (allGpas.reduce((a, b) => a + b, 0) / allGpas.length).toFixed(2) : '0.00';

        res.json({ success: true, data: { semesters: semList, cgpa } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** GET /api/student/fee */
router.get('/fee', (req, res) => {
    try {
        const records = all(
            `SELECT * FROM fee_records WHERE student_id = ? ORDER BY id ASC`,
            [req.user.id]
        );

        const total = records.reduce((s, r) => s + r.amount, 0);
        const paid = records.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0);
        const pending = total - paid;
        const pct = total ? Math.round((paid / total) * 100) : 0;

        res.json({
            success: true,
            data: {
                records,
                summary: { total, paid, pending, percentage: pct },
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** GET /api/student/timetable */
router.get('/timetable', (req, res) => {
    try {
        const rows = all(
            `SELECT * FROM timetable WHERE student_id = ? ORDER BY id ASC`,
            [req.user.id]
        );
        const program = rows.length ? rows[0].program : '';
        res.json({ success: true, data: { program, days: rows } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

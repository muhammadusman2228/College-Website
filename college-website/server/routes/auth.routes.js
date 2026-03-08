/* =====================================================
   routes/auth.routes.js
   POST /api/auth/student-login
   POST /api/auth/admin-login
   ===================================================== */

'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'greenfield_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

/** POST /api/auth/student-login */
router.post('/student-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const student = get('SELECT * FROM students WHERE email = ?', [email.trim().toLowerCase()]);
        if (!student) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const valid = await bcrypt.compare(password, student.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const payload = {
            role: 'student',
            id: student.id,
            name: student.name,
            email: student.email,
            rollNo: student.roll_no,
            program: student.program,
            semester: student.semester,
            avatarInitials: student.avatar_initials,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: payload,
        });
    } catch (err) {
        console.error('[auth/student-login]', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

/** POST /api/auth/admin-login */
router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        const validUsername = username === (process.env.ADMIN_USERNAME || 'admin');
        const validPassword = password === (process.env.ADMIN_PASSWORD || 'admin123');

        if (!validUsername || !validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
        }

        const payload = { role: 'admin', username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        res.json({
            success: true,
            message: 'Admin login successful.',
            token,
            user: payload,
        });
    } catch (err) {
        console.error('[auth/admin-login]', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;

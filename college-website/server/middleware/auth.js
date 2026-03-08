/* =====================================================
   middleware/auth.js – JWT Verification Middleware
   ===================================================== */

'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'greenfield_secret';

/**
 * Verify JWT and attach decoded payload to req.user
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
}

/**
 * Ensure the authenticated user is a student
 */
function requireStudent(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Student access required.' });
        }
        next();
    });
}

/**
 * Ensure the authenticated user is an admin
 */
function requireAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required.' });
        }
        next();
    });
}

module.exports = { verifyToken, requireStudent, requireAdmin };

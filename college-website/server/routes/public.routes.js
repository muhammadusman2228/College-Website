/* =====================================================
   routes/public.routes.js – No-auth public endpoints
   GET /api/health
   GET /api/announcements
   GET /api/programs
   ===================================================== */

'use strict';

const express = require('express');
const router = express.Router();
const { all } = require('../db/database');

// GET /api/health
router.get('/health', (req, res) => {
    res.json({ success: true, message: 'Greenfield College API is running.', timestamp: new Date().toISOString() });
});

// GET /api/announcements
router.get('/announcements', (req, res) => {
    try {
        const rows = all('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/announcements (for the landing page contact form – or public additions)
// Actually announcements are admin-only writes; GET is public.

// GET /api/programs
router.get('/programs', (req, res) => {
    const programs = [
        { id: 1, title: 'BS Computer Science', icon: 'fa-solid fa-laptop-code', duration: '4 Years', seats: 60, description: 'A rigorous program covering software engineering, AI, networking, and databases.', color: 'card-icon-info' },
        { id: 2, title: 'BS Electrical Engineering', icon: 'fa-solid fa-bolt', duration: '4 Years', seats: 40, description: 'Covers power systems, electronics, signal processing and embedded systems.', color: 'card-icon-accent' },
        { id: 3, title: 'BBA', icon: 'fa-solid fa-briefcase', duration: '4 Years', seats: 80, description: 'Prepares future business leaders with management, finance, marketing and HR skills.', color: 'card-icon-success' },
        { id: 4, title: 'BS Chemistry', icon: 'fa-solid fa-flask', duration: '4 Years', seats: 30, description: 'Organic, inorganic, and physical chemistry with fully equipped modern labs.', color: 'card-icon-gold' },
        { id: 5, title: 'BS Biotechnology', icon: 'fa-solid fa-dna', duration: '4 Years', seats: 30, description: 'Cutting-edge study of genetics, microbiology, biochemistry and bioinformatics.', color: '' },
        { id: 6, title: 'LLB (Hons)', icon: 'fa-solid fa-scale-balanced', duration: '5 Years', seats: 50, description: 'A comprehensive 5-year law program with moot courts and legal internships.', color: '' },
    ];
    res.json({ success: true, data: programs });
});

module.exports = router;

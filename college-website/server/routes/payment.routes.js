/* =====================================================
   routes/payment.routes.js
   POST /api/payment/create-intent   → Stripe PaymentIntent
   POST /api/payment/webhook         → Stripe webhook (marks fee Paid)
   GET  /api/payment/history         → Student payment history
   ===================================================== */

'use strict';

const express = require('express');
const router = express.Router();
const { requireStudent } = require('../middleware/auth');
const { get, run, all } = require('../db/database');

// Stripe – graceful degradation if key not set
let stripe = null;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

if (STRIPE_SECRET && !STRIPE_SECRET.includes('YOUR_STRIPE')) {
    stripe = require('stripe')(STRIPE_SECRET);
    console.log('✓ Stripe initialized in', STRIPE_SECRET.startsWith('sk_live') ? 'LIVE' : 'TEST', 'mode');
} else {
    console.log('⚠ Stripe keys not configured. Payment mock mode active.');
}

/* ── POST /api/payment/create-intent ─────────────────
   Creates a Stripe PaymentIntent for a pending fee item.
   Body: { feeRecordId }
   Returns: { clientSecret, publishableKey, amount, currency }
   ─────────────────────────────────────────────────── */
router.post('/create-intent', requireStudent, async (req, res) => {
    try {
        const { feeRecordId } = req.body;
        if (!feeRecordId) {
            return res.status(400).json({ success: false, message: 'feeRecordId is required.' });
        }

        const feeRecord = get('SELECT * FROM fee_records WHERE id = ? AND student_id = ?', [feeRecordId, req.user.id]);
        if (!feeRecord) {
            return res.status(404).json({ success: false, message: 'Fee record not found.' });
        }
        if (feeRecord.status === 'Paid') {
            return res.status(400).json({ success: false, message: 'This fee has already been paid.' });
        }

        if (!stripe) {
            // ── MOCK MODE (no Stripe key configured) ─────────
            const mockIntentId = 'pi_mock_' + Date.now();
            run(
                `INSERT INTO payments (student_id, fee_record_id, stripe_payment_intent_id, amount, currency, status)
         VALUES (?, ?, ?, ?, 'pkr', 'pending')`,
                [req.user.id, feeRecord.id, mockIntentId, feeRecord.amount]
            );
            return res.json({
                success: true,
                mock: true,
                clientSecret: 'mock_client_secret_' + Date.now(),
                publishableKey: 'pk_test_mock',
                paymentIntentId: mockIntentId,
                amount: feeRecord.amount,
                currency: 'PKR',
                feeTitle: feeRecord.title,
                message: 'Mock mode: Stripe keys not configured. Payment will be simulated.',
            });
        }

        // ── REAL STRIPE ───────────────────────────────────
        // Stripe amounts are in smallest currency unit (paisa for PKR)
        const amountInPaisa = feeRecord.amount * 100;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaisa,
            currency: process.env.STRIPE_CURRENCY || 'pkr',
            metadata: {
                student_id: req.user.id,
                student_name: req.user.name,
                fee_record_id: String(feeRecord.id),
                fee_title: feeRecord.title,
            },
            description: `${req.user.name} – ${feeRecord.title}`,
        });

        // Record payment intent in DB
        run(
            `INSERT INTO payments (student_id, fee_record_id, stripe_payment_intent_id, amount, currency, status)
       VALUES (?, ?, ?, ?, 'pkr', 'pending')`,
            [req.user.id, feeRecord.id, paymentIntent.id, feeRecord.amount]
        );

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
            paymentIntentId: paymentIntent.id,
            amount: feeRecord.amount,
            currency: 'PKR',
            feeTitle: feeRecord.title,
        });

    } catch (err) {
        console.error('[payment/create-intent]', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ── POST /api/payment/confirm-mock ─────────────────
   Mock-mode: manually confirm a payment (simulates webhook).
   Body: { paymentIntentId }
   ─────────────────────────────────────────────────── */
router.post('/confirm-mock', requireStudent, (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
            return res.status(400).json({ success: false, message: 'paymentIntentId required.' });
        }

        const payment = get('SELECT * FROM payments WHERE stripe_payment_intent_id = ? AND student_id = ?', [paymentIntentId, req.user.id]);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

        // Mark payment succeeded
        run(`UPDATE payments SET status = 'succeeded' WHERE stripe_payment_intent_id = ?`, [paymentIntentId]);

        // Mark fee record paid
        const today = new Date().toISOString().split('T')[0];
        run(`UPDATE fee_records SET status = 'Paid', paid_on = ? WHERE id = ?`, [today, payment.fee_record_id]);

        const feeRecord = get('SELECT title, amount FROM fee_records WHERE id = ?', [payment.fee_record_id]);
        const txnId = 'TXN-' + String(Date.now()).slice(-10).toUpperCase();

        res.json({
            success: true,
            message: 'Payment confirmed.',
            receipt: {
                transactionId: txnId,
                amount: payment.amount,
                feeTitle: feeRecord?.title || '',
                date: new Date().toLocaleString('en-PK'),
                status: 'Paid',
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ── POST /api/payment/webhook ───────────────────────
   Stripe calls this with payment events.
   Marks fee_records as Paid on payment_intent.succeeded
   ─────────────────────────────────────────────────── */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) return res.json({ received: true }); // skip in mock mode

    let event;
    try {
        event = STRIPE_WEBHOOK_SECRET
            ? stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET)
            : JSON.parse(req.body.toString());
    } catch (err) {
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object;
        const feeRecordId = pi.metadata?.fee_record_id;

        // Mark payment
        run(`UPDATE payments SET status = 'succeeded' WHERE stripe_payment_intent_id = ?`, [pi.id]);

        // Mark fee as paid
        if (feeRecordId) {
            const today = new Date().toISOString().split('T')[0];
            run(`UPDATE fee_records SET status = 'Paid', paid_on = ? WHERE id = ?`, [today, feeRecordId]);
        }
    }

    res.json({ received: true });
});

/* ── GET /api/payment/history ────────────────────────
   Returns the student's payment history.
   ─────────────────────────────────────────────────── */
router.get('/history', requireStudent, (req, res) => {
    try {
        const payments = all(
            `SELECT p.*, f.title AS fee_title
       FROM payments p
       LEFT JOIN fee_records f ON p.fee_record_id = f.id
       WHERE p.student_id = ?
       ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

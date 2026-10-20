const express = require('express');
const router = express.Router();
const {
  getFinanceStats,
  getMonthlyReport,
  getPenghuniPaymentHistory,
  getOverduePayments,
  getYearlySummary
} = require('../controllers/financeController');
const { protect } = require('../middlewares/authMiddleware');

// Protect semua routes (require authentication)
router.use(protect);

// @route   GET /api/finance/stats
// @desc    Get financial statistics
// @access  Private (Owner/Admin)
router.get('/stats', getFinanceStats);

// @route   GET /api/finance/report
// @desc    Get monthly financial report (?bulan=Januari&tahun=2024)
// @access  Private (Owner/Admin)
router.get('/report', getMonthlyReport);

// @route   GET /api/finance/overdue
// @desc    Get all overdue payments
// @access  Private (Owner/Admin)
router.get('/overdue', getOverduePayments);

// @route   GET /api/finance/yearly
// @desc    Get yearly financial summary (?tahun=2024)
// @access  Private (Owner/Admin)
router.get('/yearly', getYearlySummary);

// @route   GET /api/finance/penghuni/:id/history
// @desc    Get payment history for a penghuni
// @access  Private
router.get('/penghuni/:id/history', getPenghuniPaymentHistory);

module.exports = router;

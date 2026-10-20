const express = require('express');
const router = express.Router();
const {
  createPenghuni,
  getPenghuni,
  getPenghuniById,
  updatePenghuni,
  deletePenghuni,
  addPayment,
  updatePayment,
  getPenghuniByRoom
} = require('../controllers/penghuniController');
const { protect } = require('../middlewares/authMiddleware');

// Protect semua routes (require authentication)
router.use(protect);

// @route   GET /api/penghuni/room/:kamarId
// @desc    Get penghuni by room
// @access  Private
router.get('/room/:kamarId', getPenghuniByRoom);

// @route   POST /api/penghuni
// @desc    Create new penghuni
// @access  Private
router.post('/', createPenghuni);

// @route   GET /api/penghuni
// @desc    Get all penghuni with optional filters (?status=aktif&kamarId=xxx)
// @access  Private
router.get('/', getPenghuni);

// @route   GET /api/penghuni/:id
// @desc    Get single penghuni by ID
// @access  Private
router.get('/:id', getPenghuniById);

// @route   PUT /api/penghuni/:id
// @desc    Update penghuni
// @access  Private
router.put('/:id', updatePenghuni);

// @route   DELETE /api/penghuni/:id
// @desc    Delete/Checkout penghuni
// @access  Private
router.delete('/:id', deletePenghuni);

// @route   POST /api/penghuni/:id/payment
// @desc    Add payment to penghuni
// @access  Private
router.post('/:id/payment', addPayment);

// @route   PUT /api/penghuni/:id/payment/:paymentId
// @desc    Update payment status
// @access  Private
router.put('/:id/payment/:paymentId', updatePayment);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createKos,
  getAllKos,
  getKosById,
  updateKos,
  deleteKos,
  getKosStats,
  updateKosStats
} = require('../controllers/kosController');
const { protect } = require('../middlewares/authMiddleware');

// Protect semua routes (require authentication)
router.use(protect);

// @route   GET /api/kos/stats/overview
// @desc    Get kos statistics
// @access  Private (Owner/Admin)
router.get('/stats/overview', getKosStats);

// @route   POST /api/kos
// @desc    Create new kos
// @access  Private (Owner)
router.post('/', createKos);

// @route   GET /api/kos
// @desc    Get all kos with optional filters (?status=aktif&kota=Bogor&search=keyword)
// @access  Private
router.get('/', getAllKos);

// @route   GET /api/kos/:id
// @desc    Get single kos by ID (with kamar list)
// @access  Private
router.get('/:id', getKosById);

// @route   PUT /api/kos/:id
// @desc    Update kos
// @access  Private (Owner)
router.put('/:id', updateKos);

// @route   DELETE /api/kos/:id
// @desc    Delete kos
// @access  Private (Owner)
router.delete('/:id', deleteKos);

// @route   PUT /api/kos/:id/stats
// @desc    Update kos statistics manually
// @access  Private (Owner)
router.put('/:id/stats', updateKosStats);

module.exports = router;

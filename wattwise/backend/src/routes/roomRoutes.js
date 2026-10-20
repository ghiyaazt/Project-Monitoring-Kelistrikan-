const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomPenghuni,
  getRoomStats
} = require('../controllers/roomController');
const { protect } = require('../middlewares/authMiddleware');

// Protect semua routes (require authentication)
router.use(protect);

// @route   GET /api/rooms/stats
// @desc    Get room statistics (total, terisi, kosong, pendapatan)
// @access  Private
router.get('/stats', getRoomStats);

// @route   POST /api/rooms
// @desc    Create new room
// @access  Private
router.post('/', createRoom);

// @route   GET /api/rooms
// @desc    Get all rooms with optional filters (?status=kosong&kosId=xxx)
// @access  Private
router.get('/', getRooms);

// @route   GET /api/rooms/:id
// @desc    Get single room by ID
// @access  Private
router.get('/:id', getRoomById);

// @route   PUT /api/rooms/:id
// @desc    Update room
// @access  Private
router.put('/:id', updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Delete room
// @access  Private
router.delete('/:id', deleteRoom);

// @route   GET /api/rooms/:id/penghuni
// @desc    Get penghuni list of a room
// @access  Private
router.get('/:id/penghuni', getRoomPenghuni);

module.exports = router;

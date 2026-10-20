const express = require('express');
const router = express.Router();
const {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDeviceStats,
  updateDeviceData,
  getDeviceHistory
} = require('../controllers/deviceController');
const { protect } = require('../middlewares/authMiddleware');

// Protect semua routes (require authentication)
router.use(protect);

// @route   GET /api/devices/stats/overview
// @desc    Get device statistics
// @access  Private (Owner/Admin)
router.get('/stats/overview', getDeviceStats);

// @route   POST /api/devices
// @desc    Create new device
// @access  Private (Owner)
router.post('/', createDevice);

// @route   GET /api/devices
// @desc    Get all devices with optional filters (?kamarId=xxx&status=online)
// @access  Private
router.get('/', getAllDevices);

// @route   GET /api/devices/:id
// @desc    Get single device by ID
// @access  Private
router.get('/:id', getDeviceById);

// @route   PUT /api/devices/:id
// @desc    Update device
// @access  Private (Owner)
router.put('/:id', updateDevice);

// @route   DELETE /api/devices/:id
// @desc    Delete device
// @access  Private (Owner)
router.delete('/:id', deleteDevice);

// @route   PUT /api/devices/:deviceId/data
// @desc    Update device real-time data (from MQTT)
// @access  Private
router.put('/:deviceId/data', updateDeviceData);

// @route   GET /api/devices/:id/history
// @desc    Get device history
// @access  Private
router.get('/:id/history', getDeviceHistory);

module.exports = router;

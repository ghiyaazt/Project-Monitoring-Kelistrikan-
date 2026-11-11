const express = require('express');
const router = express.Router();
const {
    addDevice,
    getDevicesByRoom,
    getDeviceById,
    updateDevice,
    deleteDevice
} = require('../controllers/deviceController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Device routes
router.post('/', addDevice);
router.get('/room/:kamarId', getDevicesByRoom);
router.get('/:deviceId', getDeviceById);
router.put('/:deviceId', updateDevice);
router.delete('/:deviceId', deleteDevice);

module.exports = router;

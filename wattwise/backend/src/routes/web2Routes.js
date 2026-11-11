const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import controllers
const kosController = require('../controllers/kosControllerWeb2');
const kamarController = require('../controllers/kamarControllerWeb2');
const penghuniController = require('../controllers/penghuniControllerWeb2');
const paymentController = require('../controllers/paymentControllerWeb2');

// =====================================================
// KOS MANAGEMENT ROUTES
// =====================================================

// @route   GET /api/web2/kos
// @desc    Get all kos owned by current user
// @access  Private
router.get('/kos', protect, kosController.getKosList);

// @route   POST /api/web2/kos
// @desc    Create new kos
// @access  Private (owner, admin)
router.post('/kos', protect, authorize('owner', 'admin'), kosController.createKos);

// @route   GET /api/web2/kos/:kosId
// @desc    Get single kos with full details
// @access  Private
router.get('/kos/:kosId', protect, kosController.getKosById);

// @route   PUT /api/web2/kos/:kosId
// @desc    Update kos
// @access  Private (owner)
router.put('/kos/:kosId', protect, kosController.updateKos);

// @route   DELETE /api/web2/kos/:kosId
// @desc    Delete kos (soft delete)
// @access  Private (owner)
router.delete('/kos/:kosId', protect, kosController.deleteKos);

// =====================================================
// KAMAR (ROOM) MANAGEMENT ROUTES
// =====================================================

// @route   GET /api/web2/kos/:kosId/kamar/:kamarId
// @desc    Get kamar with full details
// @access  Private
router.get('/kos/:kosId/kamar/:kamarId', protect, kamarController.getKamarById);

// @route   POST /api/web2/kos/:kosId/kamar
// @desc    Add new kamar to kos
// @access  Private (owner)
router.post('/kos/:kosId/kamar', protect, kamarController.createKamar);

// @route   PUT /api/web2/kos/:kosId/kamar/:kamarId
// @desc    Update kamar
// @access  Private (owner)
router.put('/kos/:kosId/kamar/:kamarId', protect, kamarController.updateKamar);

// @route   DELETE /api/web2/kos/:kosId/kamar/:kamarId
// @desc    Delete kamar (only if kosong)
// @access  Private (owner)
router.delete('/kos/:kosId/kamar/:kamarId', protect, kamarController.deleteKamar);

// =====================================================
// PENGHUNI (TENANT) MANAGEMENT ROUTES
// =====================================================

// @route   POST /api/web2/kos/:kosId/kamar/:kamarId/penghuni
// @desc    Add penghuni to kamar
// @access  Private (owner)
router.post('/kos/:kosId/kamar/:kamarId/penghuni', protect, penghuniController.addPenghuniToKamar);

// @route   PUT /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
// @desc    Update penghuni info
// @access  Private (owner)
router.put('/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId', protect, penghuniController.updatePenghuni);

// @route   DELETE /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
// @desc    Remove penghuni from kamar
// @access  Private (owner)
router.delete('/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId', protect, penghuniController.removePenghuniFromKamar);

// =====================================================
// PAYMENT MANAGEMENT ROUTES
// =====================================================

// @route   GET /api/web2/kos/:kosId/kamar/:kamarId/payments
// @desc    Get all payments for a kamar
// @access  Private
router.get('/kos/:kosId/kamar/:kamarId/payments', protect, paymentController.getPaymentsByKamar);

// @route   POST /api/web2/kos/:kosId/kamar/:kamarId/payments
// @desc    Create payment record
// @access  Private (owner)
router.post('/kos/:kosId/kamar/:kamarId/payments', protect, paymentController.createPayment);

// @route   PUT /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId
// @desc    Update payment
// @access  Private (owner)
router.put('/kos/:kosId/kamar/:kamarId/payments/:paymentId', protect, paymentController.updatePayment);

// @route   POST /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm
// @desc    Confirm payment
// @access  Private (owner, penghuni)
router.post('/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm', protect, paymentController.confirmPayment);

// =====================================================
// DEVICE & PERANGKAT ROUTES (TODO - Phase 3)
// =====================================================

// TODO: Implement these routes in Phase 3
// - GET /api/web2/devices
// - POST /api/web2/devices
// - PUT /api/web2/devices/:deviceId
// - DELETE /api/web2/devices/:deviceId
// - GET /api/web2/devices/:deviceId/realtime
// - GET /api/web2/perangkat
// - POST /api/web2/perangkat
// - DELETE /api/web2/perangkat/:perangkatId

// =====================================================
// GROUP & FINANCE ROUTES (TODO - Phase 4)
// =====================================================

// TODO: Implement these routes in Phase 4
// - GET /api/web2/groups
// - POST /api/web2/groups
// - PUT /api/web2/groups/:groupId
// - DELETE /api/web2/groups/:groupId
// - GET /api/web2/finance/summary
// - GET /api/web2/finance/report

module.exports = router;

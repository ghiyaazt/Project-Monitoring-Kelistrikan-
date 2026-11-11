const Payment = require('../models/Payment');
const Room = require('../models/Room');
const Penghuni = require('../models/Penghuni');
const { transformPaymentToFrontend } = require('../utils/transformers');

/**
 * @desc    Get all payments for a kamar
 * @route   GET /api/web2/kos/:kosId/kamar/:kamarId/payments
 * @access  Private
 */
exports.getPaymentsByKamar = async (req, res) => {
  try {
    const { kosId, kamarId } = req.params;
    const { tahun, bulan, status } = req.query;
    
    // Check if kamar exists and user has access
    const kamar = await Room.findOne({
      _id: kamarId,
      kosId: kosId,
      ownerId: req.user.id
    });
    
    if (!kamar) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    // Build query
    const query = { kamarId: kamarId };
    if (tahun) query.tahun = parseInt(tahun);
    if (bulan) query.bulan = bulan;
    if (status) query.status = status;
    
    const payments = await Payment.find(query)
      .sort({ tahun: -1, bulan: -1 });
    
    const paymentsData = payments.map(p => transformPaymentToFrontend(p));
    
    res.status(200).json({
      success: true,
      data: paymentsData
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pembayaran',
      error: error.message
    });
  }
};

/**
 * @desc    Create payment record
 * @route   POST /api/web2/kos/:kosId/kamar/:kamarId/payments
 * @access  Private (owner)
 */
exports.createPayment = async (req, res) => {
  try {
    const { kosId, kamarId } = req.params;
    const { 
      penghuniId, 
      bulan, 
      tahun, 
      jumlah, 
      tanggalJatuhTempo, 
      keterangan 
    } = req.body;
    
    // Validasi input
    if (!bulan || !tahun || !jumlah) {
      return res.status(400).json({
        success: false,
        message: 'Bulan, tahun, dan jumlah pembayaran harus diisi'
      });
    }
    
    // Check if kamar exists and user owns it
    const kamar = await Room.findOne({
      _id: kamarId,
      kosId: kosId,
      ownerId: req.user.id
    });
    
    if (!kamar) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    // Check for duplicate payment (same kamar, bulan, tahun)
    const existingPayment = await Payment.findOne({
      kamarId: kamarId,
      bulan: bulan,
      tahun: tahun
    });
    
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: `Pembayaran untuk ${bulan} ${tahun} sudah ada`
      });
    }
    
    // Determine status based on tanggalJatuhTempo
    let status = 'belum_bayar';
    if (tanggalJatuhTempo) {
      const dueDate = new Date(tanggalJatuhTempo);
      const now = new Date();
      if (now > dueDate) {
        status = 'terlambat';
      }
    }
    
    // Create payment
    const payment = await Payment.create({
      kamarId,
      penghuniId: penghuniId || null,
      bulan,
      tahun,
      jumlah,
      status,
      tanggalJatuhTempo: tanggalJatuhTempo || null,
      keterangan: keterangan || null
    });
    
    const paymentData = transformPaymentToFrontend(payment);
    
    res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil dibuat',
      data: paymentData
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat pembayaran',
      error: error.message
    });
  }
};

/**
 * @desc    Update payment
 * @route   PUT /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId
 * @access  Private (owner)
 */
exports.updatePayment = async (req, res) => {
  try {
    const { kosId, kamarId, paymentId } = req.params;
    const { 
      status, 
      tanggalBayar, 
      metodePembayaran, 
      buktiPembayaran,
      keterangan 
    } = req.body;
    
    // Verify ownership through kamar
    const kamar = await Room.findOne({
      _id: kamarId,
      kosId: kosId,
      ownerId: req.user.id
    });
    
    if (!kamar) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    const payment = await Payment.findOne({
      _id: paymentId,
      kamarId: kamarId
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    
    // Update fields
    if (status) payment.status = status;
    if (tanggalBayar) payment.tanggalBayar = tanggalBayar;
    if (metodePembayaran) payment.metodePembayaran = metodePembayaran;
    if (buktiPembayaran) payment.buktiPembayaran = buktiPembayaran;
    if (keterangan !== undefined) payment.keterangan = keterangan;
    
    // If status changed to 'sudah_bayar' or 'lunas', set tanggalBayar to now if not provided
    if ((status === 'sudah_bayar' || status === 'lunas') && !tanggalBayar && !payment.tanggalBayar) {
      payment.tanggalBayar = new Date();
    }
    
    await payment.save();
    
    const paymentData = transformPaymentToFrontend(payment);
    
    res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil diupdate',
      data: paymentData
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate pembayaran',
      error: error.message
    });
  }
};

/**
 * @desc    Confirm payment (upload bukti, change status)
 * @route   POST /api/web2/kos/:kosId/kamar/:kamarId/payments/:paymentId/confirm
 * @access  Private (owner or penghuni)
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { kosId, kamarId, paymentId } = req.params;
    const { metodePembayaran, buktiPembayaran } = req.body;
    
    // Verify ownership through kamar
    const kamar = await Room.findOne({
      _id: kamarId,
      kosId: kosId,
      ownerId: req.user.id
    });
    
    if (!kamar) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }
    
    const payment = await Payment.findOne({
      _id: paymentId,
      kamarId: kamarId
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    
    // Update payment status
    payment.status = 'sudah_bayar';
    payment.tanggalBayar = new Date();
    if (metodePembayaran) payment.metodePembayaran = metodePembayaran;
    if (buktiPembayaran) payment.buktiPembayaran = buktiPembayaran;
    
    await payment.save();
    
    const paymentData = transformPaymentToFrontend(payment);
    
    res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi',
      data: paymentData
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengkonfirmasi pembayaran',
      error: error.message
    });
  }
};

module.exports = exports;

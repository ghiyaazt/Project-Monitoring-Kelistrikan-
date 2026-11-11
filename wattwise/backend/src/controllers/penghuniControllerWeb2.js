const Penghuni = require('../models/Penghuni');
const Room = require('../models/Room');
const Kos = require('../models/Kos');
const { transformPenghuniToFrontend } = require('../utils/transformers');

/**
 * @desc    Add penghuni to kamar
 * @route   POST /api/web2/kos/:kosId/kamar/:kamarId/penghuni
 * @access  Private (owner)
 */
exports.addPenghuniToKamar = async (req, res) => {
  try {
    const { kosId, kamarId } = req.params;
    const { nama, email, telepon, tanggalMasuk } = req.body;
    
    // Validasi input
    if (!nama || !email || !telepon) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan telepon harus diisi'
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
    
    // Check if kamar has reached max capacity
    const currentPenghuniCount = await Penghuni.countDocuments({ kamarId: kamarId });
    if (currentPenghuniCount >= kamar.maxPenghuni) {
      return res.status(400).json({
        success: false,
        message: `Kamar sudah penuh (maksimal ${kamar.maxPenghuni} penghuni)`
      });
    }
    
    // Create penghuni
    const penghuni = await Penghuni.create({
      nama,
      email,
      no_telp: telepon, // Map telepon to no_telp
      tanggalMasuk: tanggalMasuk || new Date(),
      kamarId: kamarId,
      ownerId: req.user.id
    });
    
    // Update kamar status to 'terisi'
    kamar.status = 'terisi';
    await kamar.save();
    
    // Update kos statistics
    const kos = await Kos.findById(kosId);
    if (kos) await kos.save();
    
    const penghuniData = transformPenghuniToFrontend(penghuni);
    
    res.status(201).json({
      success: true,
      message: 'Penghuni berhasil ditambahkan',
      data: penghuniData
    });
  } catch (error) {
    console.error('Add penghuni error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email penghuni sudah terdaftar'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Update penghuni info
 * @route   PUT /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
 * @access  Private (owner)
 */
exports.updatePenghuni = async (req, res) => {
  try {
    const { kosId, kamarId, penghuniId } = req.params;
    const { nama, email, telepon, tanggalMasuk } = req.body;
    
    const penghuni = await Penghuni.findOne({
      _id: penghuniId,
      kamarId: kamarId,
      ownerId: req.user.id
    });
    
    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }
    
    // Update fields
    if (nama) penghuni.nama = nama;
    if (email) penghuni.email = email;
    if (telepon) penghuni.no_telp = telepon;
    if (tanggalMasuk) penghuni.tanggalMasuk = tanggalMasuk;
    
    await penghuni.save();
    
    const penghuniData = transformPenghuniToFrontend(penghuni);
    
    res.status(200).json({
      success: true,
      message: 'Data penghuni berhasil diupdate',
      data: penghuniData
    });
  } catch (error) {
    console.error('Update penghuni error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah digunakan oleh penghuni lain'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Remove penghuni from kamar
 * @route   DELETE /api/web2/kos/:kosId/kamar/:kamarId/penghuni/:penghuniId
 * @access  Private (owner)
 */
exports.removePenghuniFromKamar = async (req, res) => {
  try {
    const { kosId, kamarId, penghuniId } = req.params;
    
    const penghuni = await Penghuni.findOne({
      _id: penghuniId,
      kamarId: kamarId,
      ownerId: req.user.id
    });
    
    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }
    
    await penghuni.deleteOne();
    
    // Check if kamar still has other penghuni
    const remainingPenghuni = await Penghuni.countDocuments({ kamarId: kamarId });
    
    // Update kamar status to 'kosong' if no more penghuni
    if (remainingPenghuni === 0) {
      const kamar = await Room.findById(kamarId);
      if (kamar) {
        kamar.status = 'kosong';
        await kamar.save();
      }
    }
    
    // Update kos statistics
    const kos = await Kos.findById(kosId);
    if (kos) await kos.save();
    
    res.status(200).json({
      success: true,
      message: 'Penghuni berhasil dihapus'
    });
  } catch (error) {
    console.error('Remove penghuni error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus penghuni',
      error: error.message
    });
  }
};

module.exports = exports;

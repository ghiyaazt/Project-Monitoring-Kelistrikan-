const Room = require('../models/Room');
const Kos = require('../models/Kos');
const Penghuni = require('../models/Penghuni');
const Payment = require('../models/Payment');
const { transformKamarToFrontend } = require('../utils/transformers');

/**
 * @desc    Get kamar by ID with details
 * @route   GET /api/web2/kos/:kosId/kamar/:kamarId
 * @access  Private
 */
exports.getKamarById = async (req, res) => {
  try {
    const { kosId, kamarId } = req.params;
    
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
    
    // Get penghuni and payments
    const penghuniList = await Penghuni.find({ kamarId: kamar._id });
    const payments = await Payment.find({ kamarId: kamar._id })
      .sort({ tahun: -1, bulan: -1 });
    
    const kamarData = transformKamarToFrontend(kamar, penghuniList, payments);
    
    res.status(200).json({
      success: true,
      data: kamarData
    });
  } catch (error) {
    console.error('Get kamar by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Add new kamar to kos
 * @route   POST /api/web2/kos/:kosId/kamar
 * @access  Private (owner)
 */
exports.createKamar = async (req, res) => {
  try {
    const { kosId } = req.params;
    const { nama, hargaSewa, luasKamar, fasilitas, maxPenghuni, gambar } = req.body;
    
    // Validasi input
    if (!nama || !hargaSewa || !luasKamar) {
      return res.status(400).json({
        success: false,
        message: 'Nama, harga sewa, dan luas kamar harus diisi'
      });
    }
    
    // Check if kos exists and user owns it
    const kos = await Kos.findOne({
      _id: kosId,
      ownerId: req.user.id
    });
    
    if (!kos) {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan'
      });
    }
    
    // Create kamar
    const kamar = await Room.create({
      nama,
      hargaSewa,
      luasKamar,
      fasilitas: fasilitas || [],
      maxPenghuni: maxPenghuni || 1,
      gambar: gambar || [],
      kosId: kosId,
      ownerId: req.user.id,
      status: 'kosong'
    });
    
    // Update kos statistics
    await kos.save(); // Triggers pre-save hook to update stats
    
    const kamarData = transformKamarToFrontend(kamar, [], []);
    
    res.status(201).json({
      success: true,
      message: 'Kamar berhasil ditambahkan',
      data: kamarData
    });
  } catch (error) {
    console.error('Create kamar error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Update kamar
 * @route   PUT /api/web2/kos/:kosId/kamar/:kamarId
 * @access  Private (owner)
 */
exports.updateKamar = async (req, res) => {
  try {
    const { kosId, kamarId } = req.params;
    const { 
      nama, 
      hargaSewa, 
      luasKamar, 
      fasilitas, 
      maxPenghuni, 
      gambar, 
      gambarProfil,
      status 
    } = req.body;
    
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
    
    // Update fields
    if (nama) kamar.nama = nama;
    if (hargaSewa !== undefined) kamar.hargaSewa = hargaSewa;
    if (luasKamar !== undefined) kamar.luasKamar = luasKamar;
    if (fasilitas !== undefined) kamar.fasilitas = fasilitas;
    if (maxPenghuni !== undefined) kamar.maxPenghuni = maxPenghuni;
    if (gambar !== undefined) kamar.gambar = gambar;
    if (gambarProfil !== undefined) kamar.gambarProfil = gambarProfil;
    if (status !== undefined) kamar.status = status;
    
    await kamar.save();
    
    // Update kos statistics
    const kos = await Kos.findById(kosId);
    if (kos) await kos.save();
    
    const penghuniList = await Penghuni.find({ kamarId: kamar._id });
    const payments = await Payment.find({ kamarId: kamar._id });
    
    const kamarData = transformKamarToFrontend(kamar, penghuniList, payments);
    
    res.status(200).json({
      success: true,
      message: 'Kamar berhasil diupdate',
      data: kamarData
    });
  } catch (error) {
    console.error('Update kamar error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Delete kamar
 * @route   DELETE /api/web2/kos/:kosId/kamar/:kamarId
 * @access  Private (owner)
 */
exports.deleteKamar = async (req, res) => {
  try {
    const { kosId, kamarId } = req.params;
    
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
    
    // Check if kamar is empty
    if (kamar.status === 'terisi') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus kamar yang masih terisi'
      });
    }
    
    await kamar.deleteOne();
    
    // Update kos statistics
    const kos = await Kos.findById(kosId);
    if (kos) await kos.save();
    
    res.status(200).json({
      success: true,
      message: 'Kamar berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete kamar error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kamar',
      error: error.message
    });
  }
};

module.exports = exports;

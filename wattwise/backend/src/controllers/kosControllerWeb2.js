const Kos = require('../models/Kos');
const Room = require('../models/Room');
const Penghuni = require('../models/Penghuni');
const Payment = require('../models/Payment');
const { 
  transformKosToFrontend, 
  transformKamarToFrontend 
} = require('../utils/transformers');

/**
 * @desc    Get all kos owned by current user
 * @route   GET /api/web2/kos
 * @access  Private
 */
exports.getKosList = async (req, res) => {
  try {
    const kosList = await Kos.find({ ownerId: req.user.id, status: 'aktif' })
      .sort({ createdAt: -1 });
    
    // Get kamar for each kos
    const kosListWithKamar = await Promise.all(
      kosList.map(async (kos) => {
        const kamarList = await Room.find({ kosId: kos._id })
          .sort({ nama: 1 });
        
        return transformKosToFrontend(kos, kamarList);
      })
    );
    
    res.status(200).json({
      success: true,
      data: kosListWithKamar
    });
  } catch (error) {
    console.error('Get kos list error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kos',
      error: error.message
    });
  }
};

/**
 * @desc    Get single kos with full details
 * @route   GET /api/web2/kos/:kosId
 * @access  Private
 */
exports.getKosById = async (req, res) => {
  try {
    const { kosId } = req.params;
    
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
    
    // Get kamar with penghuni and payments
    const kamarList = await Room.find({ kosId: kos._id })
      .sort({ nama: 1 });
    
    const kamarWithDetails = await Promise.all(
      kamarList.map(async (kamar) => {
        const penghuniList = await Penghuni.find({ kamarId: kamar._id });
        const payments = await Payment.find({ kamarId: kamar._id })
          .sort({ tahun: -1, bulan: -1 })
          .limit(12); // Last 12 months
        
        return transformKamarToFrontend(kamar, penghuniList, payments);
      })
    );
    
    const kosData = transformKosToFrontend(kos, kamarWithDetails);
    
    res.status(200).json({
      success: true,
      data: kosData
    });
  } catch (error) {
    console.error('Get kos by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kos',
      error: error.message
    });
  }
};

/**
 * @desc    Create new kos
 * @route   POST /api/web2/kos
 * @access  Private (owner, admin)
 */
exports.createKos = async (req, res) => {
  try {
    const { nama, alamat, fasilitas, gambar } = req.body;
    
    // Validasi input
    if (!nama || !alamat) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan alamat kos harus diisi'
      });
    }
    
    // Parse alamat string to alamat object
    // Format expected: "Jalan, Kelurahan, Kecamatan, Kota, Provinsi, KodePos"
    const alamatParts = alamat.split(',').map(s => s.trim());
    const alamatObj = {
      jalan: alamatParts[0] || '',
      kelurahan: alamatParts[1] || null,
      kecamatan: alamatParts[2] || null,
      kota: alamatParts[3] || alamatParts[0], // fallback to jalan if not enough parts
      provinsi: alamatParts[4] || 'Indonesia',
      kodePos: alamatParts[5] || null
    };
    
    // Create kos
    const kos = await Kos.create({
      namaKos: nama,
      alamat: alamatObj,
      fasilitasUmum: fasilitas || [],
      gambar: gambar || [],
      ownerId: req.user.id,
      status: 'aktif'
    });
    
    const kosData = transformKosToFrontend(kos, []);
    
    res.status(201).json({
      success: true,
      message: 'Kos berhasil dibuat',
      data: kosData
    });
  } catch (error) {
    console.error('Create kos error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat kos',
      error: error.message
    });
  }
};

/**
 * @desc    Update kos
 * @route   PUT /api/web2/kos/:kosId
 * @access  Private (owner)
 */
exports.updateKos = async (req, res) => {
  try {
    const { kosId } = req.params;
    const { nama, alamat, fasilitas, gambar, gambarProfil } = req.body;
    
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
    
    // Update fields
    if (nama) kos.namaKos = nama;
    
    if (alamat) {
      // Parse alamat string to alamat object
      const alamatParts = alamat.split(',').map(s => s.trim());
      kos.alamat = {
        jalan: alamatParts[0] || kos.alamat.jalan,
        kelurahan: alamatParts[1] || kos.alamat.kelurahan,
        kecamatan: alamatParts[2] || kos.alamat.kecamatan,
        kota: alamatParts[3] || kos.alamat.kota,
        provinsi: alamatParts[4] || kos.alamat.provinsi,
        kodePos: alamatParts[5] || kos.alamat.kodePos
      };
    }
    
    if (fasilitas !== undefined) kos.fasilitasUmum = fasilitas;
    if (gambar !== undefined) kos.gambar = gambar;
    if (gambarProfil !== undefined) kos.gambarProfil = gambarProfil;
    
    await kos.save();
    
    const kamarList = await Room.find({ kosId: kos._id });
    const kosData = transformKosToFrontend(kos, kamarList);
    
    res.status(200).json({
      success: true,
      message: 'Kos berhasil diupdate',
      data: kosData
    });
  } catch (error) {
    console.error('Update kos error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kos',
      error: error.message
    });
  }
};

/**
 * @desc    Delete kos
 * @route   DELETE /api/web2/kos/:kosId
 * @access  Private (owner)
 */
exports.deleteKos = async (req, res) => {
  try {
    const { kosId } = req.params;
    
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
    
    // Check if there are active tenants
    const kamarTerisi = await Room.countDocuments({
      kosId: kos._id,
      status: 'terisi'
    });
    
    if (kamarTerisi > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus kos yang masih memiliki penghuni'
      });
    }
    
    // Soft delete (set status to nonaktif)
    kos.status = 'nonaktif';
    await kos.save();
    
    res.status(200).json({
      success: true,
      message: 'Kos berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete kos error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kos',
      error: error.message
    });
  }
};

module.exports = exports;

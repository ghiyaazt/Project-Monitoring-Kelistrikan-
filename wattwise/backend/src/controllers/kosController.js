const Kos = require('../models/Kos');
const Room = require('../models/Room');

/**
 * @desc    Create new kos (only owner can create)
 * @route   POST /api/kos
 * @access  Private (Owner)
 */
exports.createKos = async (req, res) => {
  try {
    // Only owner can create kos
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Hanya owner yang dapat membuat kos'
      });
    }

    const {
      namaKos,
      alamat,
      deskripsi,
      fasilitasUmum,
      peraturan,
      kontakPemilik,
      gambar,
      gambarProfil
    } = req.body;

    // Validasi input
    if (!namaKos || !alamat) {
      return res.status(400).json({
        success: false,
        message: 'Nama kos dan alamat harus diisi'
      });
    }

    // Validasi alamat minimal
    if (!alamat.jalan || !alamat.kota || !alamat.provinsi) {
      return res.status(400).json({
        success: false,
        message: 'Jalan, kota, dan provinsi harus diisi'
      });
    }

    // Create kos
    const kos = await Kos.create({
      namaKos,
      alamat,
      deskripsi: deskripsi || null,
      fasilitasUmum: fasilitasUmum || [],
      peraturan: peraturan || [],
      kontakPemilik: kontakPemilik || {},
      gambar: gambar || [],
      gambarProfil: gambarProfil || 0,
      ownerId: req.user._id,
      status: 'aktif'
    });

    res.status(201).json({
      success: true,
      message: 'Kos berhasil ditambahkan',
      data: kos
    });

  } catch (error) {
    console.error('Error creating kos:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan kos',
      error: error.message
    });
  }
};

/**
 * @desc    Get all kos (filtered by role)
 * @route   GET /api/kos?status=aktif&kota=Bogor
 * @access  Private
 */
exports.getAllKos = async (req, res) => {
  try {
    const { status, kota, search } = req.query;
    
    // Build filter berdasarkan role
    let filter = {};
    
    if (req.user.role === 'owner') {
      // Owner hanya bisa lihat kos miliknya
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      // Penghuni bisa lihat semua kos aktif (untuk cari kos)
      filter.status = 'aktif';
    }
    // Admin bisa lihat semua
    
    // Filter by status (jika bukan penghuni)
    if (status && req.user.role !== 'penghuni') {
      filter.status = status;
    }
    
    // Filter by kota
    if (kota) {
      filter['alamat.kota'] = { $regex: kota, $options: 'i' };
    }
    
    // Text search (nama kos atau deskripsi)
    if (search) {
      filter.$text = { $search: search };
    }

    const kos = await Kos.find(filter)
      .populate('ownerId', 'nama email no_telp')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: kos.length,
      data: kos
    });

  } catch (error) {
    console.error('Error getting kos:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kos',
      error: error.message
    });
  }
};

/**
 * @desc    Get single kos by ID
 * @route   GET /api/kos/:id
 * @access  Private
 */
exports.getKosById = async (req, res) => {
  try {
    // Build filter berdasarkan role
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      filter.status = 'aktif'; // Penghuni hanya bisa lihat kos aktif
    }
    // Admin tidak ada filter tambahan
    
    const kos = await Kos.findOne(filter)
      .populate('ownerId', 'nama email no_telp');

    if (!kos) {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan'
      });
    }

    // Get kamar-kamar di kos ini
    const rooms = await Room.find({ kosId: kos._id })
      .select('nama status hargaSewa luasKamar fasilitas maxPenghuni gambar')
      .sort({ nama: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...kos.toObject(),
        kamar: rooms
      }
    });

  } catch (error) {
    console.error('Error getting kos:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kos',
      error: error.message
    });
  }
};

/**
 * @desc    Update kos (only owner)
 * @route   PUT /api/kos/:id
 * @access  Private (Owner)
 */
exports.updateKos = async (req, res) => {
  try {
    const {
      namaKos,
      alamat,
      deskripsi,
      fasilitasUmum,
      peraturan,
      kontakPemilik,
      gambar,
      gambarProfil,
      status
    } = req.body;

    // Find kos (must be owner)
    let kos = await Kos.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!kos) {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Update fields
    if (namaKos !== undefined) kos.namaKos = namaKos;
    if (alamat !== undefined) kos.alamat = alamat;
    if (deskripsi !== undefined) kos.deskripsi = deskripsi;
    if (fasilitasUmum !== undefined) kos.fasilitasUmum = fasilitasUmum;
    if (peraturan !== undefined) kos.peraturan = peraturan;
    if (kontakPemilik !== undefined) kos.kontakPemilik = kontakPemilik;
    if (gambar !== undefined) kos.gambar = gambar;
    if (gambarProfil !== undefined) kos.gambarProfil = gambarProfil;
    if (status !== undefined) kos.status = status;

    await kos.save();

    res.status(200).json({
      success: true,
      message: 'Kos berhasil diupdate',
      data: kos
    });

  } catch (error) {
    console.error('Error updating kos:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate kos',
      error: error.message
    });
  }
};

/**
 * @desc    Delete kos (only owner)
 * @route   DELETE /api/kos/:id
 * @access  Private (Owner)
 */
exports.deleteKos = async (req, res) => {
  try {
    const kos = await Kos.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!kos) {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Cek apakah masih ada kamar di kos ini
    const roomCount = await Room.countDocuments({ kosId: kos._id });
    
    if (roomCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus kos yang masih memiliki ${roomCount} kamar. Hapus kamar terlebih dahulu.`
      });
    }

    await kos.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Kos berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting kos:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kos',
      error: error.message
    });
  }
};

/**
 * @desc    Get kos statistics (only owner/admin)
 * @route   GET /api/kos/stats/overview
 * @access  Private (Owner/Admin)
 */
exports.getKosStats = async (req, res) => {
  try {
    // Only owner and admin can see stats
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    
    // Build filter berdasarkan role
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id } : {};
    
    const totalKos = await Kos.countDocuments(filter);
    const kosAktif = await Kos.countDocuments({ ...filter, status: 'aktif' });
    const kosNonaktif = await Kos.countDocuments({ ...filter, status: 'nonaktif' });
    
    // Get all kos untuk hitung total kamar dan pendapatan
    const allKos = await Kos.find(filter);
    
    const totalKamar = allKos.reduce((sum, kos) => sum + kos.totalKamar, 0);
    const totalKamarTerisi = allKos.reduce((sum, kos) => sum + kos.kamarTerisi, 0);
    const totalKamarKosong = allKos.reduce((sum, kos) => sum + kos.kamarKosong, 0);
    
    // Hitung total pendapatan dari semua kamar terisi
    const roomFilter = req.user.role === 'owner' ? { ownerId: req.user._id, status: 'terisi' } : { status: 'terisi' };
    const terisiRooms = await Room.find(roomFilter);
    const totalPendapatan = terisiRooms.reduce((sum, room) => sum + room.hargaSewa, 0);

    res.status(200).json({
      success: true,
      data: {
        totalKos,
        kosAktif,
        kosNonaktif,
        totalKamar,
        totalKamarTerisi,
        totalKamarKosong,
        tingkatHunian: totalKamar > 0 ? ((totalKamarTerisi / totalKamar) * 100).toFixed(1) : 0,
        totalPendapatan
      }
    });

  } catch (error) {
    console.error('Error getting kos stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik kos',
      error: error.message
    });
  }
};

/**
 * @desc    Update kos statistics manually (helper function)
 * @route   PUT /api/kos/:id/stats
 * @access  Private (Owner)
 */
exports.updateKosStats = async (req, res) => {
  try {
    const kos = await Kos.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!kos) {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan'
      });
    }

    // Trigger update statistik
    await kos.save();

    res.status(200).json({
      success: true,
      message: 'Statistik kos berhasil diupdate',
      data: kos
    });

  } catch (error) {
    console.error('Error updating kos stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate statistik kos',
      error: error.message
    });
  }
};

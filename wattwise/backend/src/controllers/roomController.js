const Room = require('../models/Room');

/**
 * @desc    Create new room (owner must have kos first)
 * @route   POST /api/rooms
 * @access  Private (requires authentication)
 */
exports.createRoom = async (req, res) => {
  try {
    // Only owner can create room
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Hanya owner yang dapat membuat kamar'
      });
    }

    const {
      nama,
      status,
      hargaSewa,
      luasKamar,
      fasilitas,
      maxPenghuni,
      gambar,
      gambarProfil,
      kosId
    } = req.body;

    // Validasi input
    if (!nama || !hargaSewa || !luasKamar || !kosId) {
      return res.status(400).json({
        success: false,
        message: 'Nama, harga sewa, luas kamar, dan kos harus diisi'
      });
    }

    // Check if kos exists and belongs to user
    const Kos = require('../models/Kos');
    const kos = await Kos.findOne({
      _id: kosId,
      ownerId: req.user._id
    });

    if (!kos) {
      return res.status(404).json({
        success: false,
        message: 'Kos tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Create room dengan ownerId dari user yang login
    const room = await Room.create({
      nama,
      status: status || 'kosong',
      hargaSewa,
      luasKamar,
      fasilitas: fasilitas || [],
      maxPenghuni: maxPenghuni || 1,
      gambar: gambar || [],
      gambarProfil: gambarProfil || 0,
      kosId: kos._id,
      ownerId: req.user._id
    });

    // Update kos statistics
    await kos.save();

    res.status(201).json({
      success: true,
      message: 'Kamar berhasil ditambahkan',
      data: room
    });

  } catch (error) {
    console.error('Error creating room:', error);
    
    // Handle validation error
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
      message: 'Gagal menambahkan kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Get all rooms (with optional filters, filtered by role)
 * @route   GET /api/rooms?status=kosong&kosId=xxx
 * @access  Private
 */
exports.getRooms = async (req, res) => {
  try {
    const { status, kosId } = req.query;
    
    // Build filter berdasarkan role
    let filter = {};
    
    if (req.user.role === 'owner') {
      // Owner hanya bisa lihat kamar miliknya
      filter.ownerId = req.user._id;
      
      if (status) {
        filter.status = status;
      }
      
      if (kosId) {
        filter.kosId = kosId;
      }
    } else if (req.user.role === 'penghuni') {
      // Penghuni bisa lihat semua kamar kosong (untuk cari kamar)
      filter.status = 'kosong';
      
      if (kosId) {
        filter.kosId = kosId;
      }
    } else if (req.user.role === 'admin') {
      // Admin bisa lihat semua
      if (status) {
        filter.status = status;
      }
      
      if (kosId) {
        filter.kosId = kosId;
      }
    }

    // Get rooms (with populate)
    const rooms = await Room.find(filter)
      .populate('ownerId', 'nama email no_telp')
      .populate('kosId', 'namaKos alamat')
      .populate('penghuniList', 'nama email telepon status')
      .populate('devices', 'nama deviceId status dayaWatt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });

  } catch (error) {
    console.error('Error getting rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Get single room by ID (filtered by role)
 * @route   GET /api/rooms/:id
 * @access  Private
 */
exports.getRoomById = async (req, res) => {
  try {
    // Build filter berdasarkan role
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      filter.status = 'kosong'; // Penghuni hanya bisa lihat detail kamar kosong
    }
    // Admin tidak ada filter tambahan
    
    const room = await Room.findOne(filter)
      .populate('ownerId', 'nama email no_telp')
      .populate('kosId', 'namaKos alamat fasilitasUmum peraturan kontakPemilik')
      .populate('penghuniList', 'nama email telepon tanggalMasuk status payments')
      .populate('devices', 'nama deviceId dayaWatt status lastUpdate');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });

  } catch (error) {
    console.error('Error getting room:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Update room
 * @route   PUT /api/rooms/:id
 * @access  Private
 */
exports.updateRoom = async (req, res) => {
  try {
    const {
      nama,
      status,
      hargaSewa,
      luasKamar,
      fasilitas,
      maxPenghuni,
      gambar,
      gambarProfil,
      kosId
    } = req.body;

    // Find room
    let room = await Room.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    // Update fields yang dikirim
    if (nama !== undefined) room.nama = nama;
    if (status !== undefined) room.status = status;
    if (hargaSewa !== undefined) room.hargaSewa = hargaSewa;
    if (luasKamar !== undefined) room.luasKamar = luasKamar;
    if (fasilitas !== undefined) room.fasilitas = fasilitas;
    if (maxPenghuni !== undefined) room.maxPenghuni = maxPenghuni;
    if (gambar !== undefined) room.gambar = gambar;
    if (gambarProfil !== undefined) room.gambarProfil = gambarProfil;
    if (kosId !== undefined) room.kosId = kosId;

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Kamar berhasil diupdate',
      data: room
    });

  } catch (error) {
    console.error('Error updating room:', error);
    
    // Handle validation error
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
      message: 'Gagal mengupdate kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Delete room
 * @route   DELETE /api/rooms/:id
 * @access  Private
 */
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    // Cek apakah kamar masih terisi
    if (room.status === 'terisi') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus kamar yang masih terisi. Kosongkan dulu kamar tersebut.'
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Kamar berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting room:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kamar',
      error: error.message
    });
  }
};

/**
 * @desc    Get penghuni list of a room
 * @route   GET /api/rooms/:id/penghuni
 * @access  Private
 */
exports.getRoomPenghuni = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });
    // .populate('penghuniList', 'nama email telepon tanggalMasuk payments');  // Disabled

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      count: room.penghuniList ? room.penghuniList.length : 0,
      data: room.penghuniList || []
    });

  } catch (error) {
    console.error('Error getting room penghuni:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Get room statistics (only for owner/admin)
 * @route   GET /api/rooms/stats
 * @access  Private
 */
exports.getRoomStats = async (req, res) => {
  try {
    // Only owner and admin can see stats
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya owner dan admin yang bisa melihat statistik.'
      });
    }
    
    // Build filter berdasarkan role
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id } : {};
    
    const totalRooms = await Room.countDocuments(filter);
    const terisiCount = await Room.countDocuments({ ...filter, status: 'terisi' });
    const kosongCount = await Room.countDocuments({ ...filter, status: 'kosong' });

    const rooms = await Room.find({ ...filter, status: 'terisi' });
    const totalPendapatan = rooms.reduce((sum, room) => sum + room.hargaSewa, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        terisiCount,
        kosongCount,
        tingkatHunian: totalRooms > 0 ? ((terisiCount / totalRooms) * 100).toFixed(1) : 0,
        totalPendapatan
      }
    });

  } catch (error) {
    console.error('Error getting room stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik kamar',
      error: error.message
    });
  }
};

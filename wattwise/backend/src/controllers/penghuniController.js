const Penghuni = require('../models/Penghuni');
const Room = require('../models/Room');

/**
 * @desc    Create new penghuni (2 modes: self-register atau owner input)
 * @route   POST /api/penghuni
 * @access  Private
 */
exports.createPenghuni = async (req, res) => {
  try {
    const {
      nama,
      email,
      telepon,
      tanggalMasuk,
      kamarId,
      identitas,
      kontakDarurat,
      catatan,
      userId // Optional: untuk owner yang input penghuni secara manual
    } = req.body;

    // Validasi input
    if (!nama || !email || !telepon || !kamarId) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, telepon, dan kamar harus diisi'
      });
    }

    // Ambil info room
    const room = await Room.findById(kamarId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    // LOGIC BERDASARKAN ROLE
    let penghuniUserId;
    let penghuniOwnerId;

    if (req.user.role === 'penghuni') {
      // MODE 1: PENGHUNI DAFTAR SENDIRI
      // Cek apakah penghuni sudah terdaftar di kamar lain (aktif)
      const existingPenghuni = await Penghuni.findOne({
        userId: req.user._id,
        status: 'aktif'
      });

      if (existingPenghuni) {
        return res.status(400).json({
          success: false,
          message: 'Anda sudah terdaftar sebagai penghuni aktif di kamar lain'
        });
      }

      // Check if room is full
      const currentPenghuni = await Penghuni.countDocuments({
        kamarId: kamarId,
        status: 'aktif'
      });

      if (currentPenghuni >= room.maxPenghuni) {
        return res.status(400).json({
          success: false,
          message: `Kamar sudah penuh (maksimal ${room.maxPenghuni} penghuni)`
        });
      }

      // Penghuni register untuk dirinya sendiri
      penghuniUserId = req.user._id;
      penghuniOwnerId = room.ownerId;

    } else if (req.user.role === 'owner') {
      // MODE 2: OWNER INPUT PENGHUNI MANUAL
      // Check if room belongs to owner
      if (room.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses ke kamar ini'
        });
      }

      // Check if room is full
      const currentPenghuni = await Penghuni.countDocuments({
        kamarId: kamarId,
        status: 'aktif'
      });

      if (currentPenghuni >= room.maxPenghuni) {
        return res.status(400).json({
          success: false,
          message: `Kamar sudah penuh (maksimal ${room.maxPenghuni} penghuni)`
        });
      }

      // Jika userId diberikan, cek apakah user tersebut ada dan role-nya penghuni
      if (userId) {
        const User = require('../models/User');
        const targetUser = await User.findById(userId);
        
        if (!targetUser) {
          return res.status(404).json({
            success: false,
            message: 'User tidak ditemukan'
          });
        }

        if (targetUser.role !== 'penghuni') {
          return res.status(400).json({
            success: false,
            message: 'User yang dipilih bukan penghuni'
          });
        }

        // Cek apakah user ini sudah jadi penghuni aktif
        const existingPenghuni = await Penghuni.findOne({
          userId: userId,
          status: 'aktif'
        });

        if (existingPenghuni) {
          return res.status(400).json({
            success: false,
            message: 'User ini sudah terdaftar sebagai penghuni aktif'
          });
        }

        penghuniUserId = userId;
      } else {
        // Owner input manual tanpa link ke user (penghuni offline)
        // Cari atau buat user penghuni dummy
        const User = require('../models/User');
        
        // Check if email already registered
        let penghuniUser = await User.findOne({ email });
        
        if (!penghuniUser) {
          // Buat user baru dengan role penghuni
          penghuniUser = await User.create({
            nama,
            email,
            no_telp: telepon,
            password: 'defaultPassword123', // Password default, nanti penghuni bisa ganti
            role: 'penghuni'
          });
        }

        penghuniUserId = penghuniUser._id;
      }

      penghuniOwnerId = req.user._id;

    } else {
      return res.status(403).json({
        success: false,
        message: 'Role tidak diizinkan untuk menambah penghuni'
      });
    }

    // Create penghuni
    const penghuni = await Penghuni.create({
      userId: penghuniUserId,
      nama,
      email,
      telepon,
      tanggalMasuk: tanggalMasuk || Date.now(),
      kamarId,
      ownerId: penghuniOwnerId,
      status: 'aktif',
      identitas: identitas || {},
      kontakDarurat: kontakDarurat || {},
      catatan: catatan || null
    });

    // Update room status to 'terisi'
    room.status = 'terisi';
    await room.save();

    res.status(201).json({
      success: true,
      message: 'Penghuni berhasil ditambahkan',
      data: penghuni
    });

  } catch (error) {
    console.error('Error creating penghuni:', error);
    
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
      message: 'Gagal menambahkan penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Get all penghuni (with optional filters, filtered by role)
 * @route   GET /api/penghuni?status=aktif&kamarId=xxx
 * @access  Private
 */
exports.getPenghuni = async (req, res) => {
  try {
    const { status, kamarId } = req.query;
    
    // Build filter berdasarkan role
    let filter = {};
    
    if (req.user.role === 'owner') {
      // Owner hanya bisa lihat penghuni di kamar miliknya
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      // Penghuni hanya bisa lihat data dirinya sendiri
      filter.userId = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin bisa lihat semua
      // filter kosong = lihat semua
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (kamarId) {
      filter.kamarId = kamarId;
    }

    // Get penghuni with room details
    const penghuni = await Penghuni.find(filter)
      .populate('kamarId', 'nama status hargaSewa')
      .populate('userId', 'nama email no_telp')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: penghuni.length,
      data: penghuni
    });

  } catch (error) {
    console.error('Error getting penghuni:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Get single penghuni by ID (filtered by role)
 * @route   GET /api/penghuni/:id
 * @access  Private
 */
exports.getPenghuniById = async (req, res) => {
  try {
    // Build filter berdasarkan role
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      filter.userId = req.user._id;
    }
    // Admin tidak ada filter tambahan

    const penghuni = await Penghuni.findOne(filter)
      .populate('kamarId', 'nama status hargaSewa luasKamar fasilitas')
      .populate('userId', 'nama email no_telp');

    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: penghuni
    });

  } catch (error) {
    console.error('Error getting penghuni:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
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
 * @desc    Update penghuni
 * @route   PUT /api/penghuni/:id
 * @access  Private
 */
exports.updatePenghuni = async (req, res) => {
  try {
    const {
      nama,
      email,
      telepon,
      status,
      tanggalKeluar,
      identitas,
      kontakDarurat,
      catatan
    } = req.body;

    // Find penghuni
    let penghuni = await Penghuni.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    // Update fields
    if (nama !== undefined) penghuni.nama = nama;
    if (email !== undefined) penghuni.email = email;
    if (telepon !== undefined) penghuni.telepon = telepon;
    if (status !== undefined) penghuni.status = status;
    if (tanggalKeluar !== undefined) penghuni.tanggalKeluar = tanggalKeluar;
    if (identitas !== undefined) penghuni.identitas = identitas;
    if (kontakDarurat !== undefined) penghuni.kontakDarurat = kontakDarurat;
    if (catatan !== undefined) penghuni.catatan = catatan;

    await penghuni.save();

    res.status(200).json({
      success: true,
      message: 'Penghuni berhasil diupdate',
      data: penghuni
    });

  } catch (error) {
    console.error('Error updating penghuni:', error);
    
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
      message: 'Gagal mengupdate penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Delete/Checkout penghuni (set status to 'keluar')
 * @route   DELETE /api/penghuni/:id
 * @access  Private
 */
exports.deletePenghuni = async (req, res) => {
  try {
    const penghuni = await Penghuni.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    // Set status to keluar instead of deleting
    penghuni.status = 'keluar';
    penghuni.tanggalKeluar = new Date();
    await penghuni.save();

    // Check if there are still active penghuni in the room
    const activePenghuni = await Penghuni.countDocuments({
      kamarId: penghuni.kamarId,
      status: 'aktif'
    });

    // If no more active penghuni, update room status to 'kosong'
    if (activePenghuni === 0) {
      await Room.findByIdAndUpdate(penghuni.kamarId, {
        status: 'kosong'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Penghuni berhasil checkout'
    });

  } catch (error) {
    console.error('Error deleting penghuni:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menghapus penghuni',
      error: error.message
    });
  }
};

/**
 * @desc    Add payment to penghuni
 * @route   POST /api/penghuni/:id/payment
 * @access  Private
 */
exports.addPayment = async (req, res) => {
  try {
    const {
      bulan,
      tahun,
      jumlah,
      status,
      tanggalBayar,
      tanggalJatuhTempo,
      metodePembayaran,
      buktiPembayaran,
      keterangan
    } = req.body;

    // Validasi input
    if (!bulan || !tahun || !jumlah || !tanggalJatuhTempo) {
      return res.status(400).json({
        success: false,
        message: 'Bulan, tahun, jumlah, dan tanggal jatuh tempo harus diisi'
      });
    }

    // Find penghuni
    const penghuni = await Penghuni.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    // Check if payment for this month already exists
    const existingPayment = penghuni.payments.find(
      p => p.bulan === bulan && p.tahun === tahun
    );

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: `Pembayaran untuk ${bulan} ${tahun} sudah ada`
      });
    }

    // Add payment
    const newPayment = {
      bulan,
      tahun,
      jumlah,
      status: status || 'belum_bayar',
      tanggalBayar: tanggalBayar || null,
      tanggalJatuhTempo,
      metodePembayaran: metodePembayaran || null,
      buktiPembayaran: buktiPembayaran || null,
      keterangan: keterangan || null
    };

    penghuni.payments.push(newPayment);
    await penghuni.save();

    res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil ditambahkan',
      data: penghuni
    });

  } catch (error) {
    console.error('Error adding payment:', error);
    
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
      message: 'Gagal menambahkan pembayaran',
      error: error.message
    });
  }
};

/**
 * @desc    Update payment status
 * @route   PUT /api/penghuni/:id/payment/:paymentId
 * @access  Private
 */
exports.updatePayment = async (req, res) => {
  try {
    const { status, tanggalBayar, metodePembayaran, buktiPembayaran, keterangan } = req.body;

    // Find penghuni
    const penghuni = await Penghuni.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    // Find payment
    const payment = penghuni.payments.id(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }

    // Update payment fields
    if (status !== undefined) payment.status = status;
    if (tanggalBayar !== undefined) payment.tanggalBayar = tanggalBayar;
    if (metodePembayaran !== undefined) payment.metodePembayaran = metodePembayaran;
    if (buktiPembayaran !== undefined) payment.buktiPembayaran = buktiPembayaran;
    if (keterangan !== undefined) payment.keterangan = keterangan;

    await penghuni.save();

    res.status(200).json({
      success: true,
      message: 'Pembayaran berhasil diupdate',
      data: penghuni
    });

  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate pembayaran',
      error: error.message
    });
  }
};

/**
 * @desc    Get penghuni by room
 * @route   GET /api/penghuni/room/:kamarId
 * @access  Private
 */
exports.getPenghuniByRoom = async (req, res) => {
  try {
    // Verify room belongs to user
    const room = await Room.findOne({
      _id: req.params.kamarId,
      ownerId: req.user._id
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan'
      });
    }

    // Get penghuni in the room
    const penghuni = await Penghuni.find({
      kamarId: req.params.kamarId,
      status: 'aktif'
    }).populate('kamarId', 'nama status hargaSewa');

    res.status(200).json({
      success: true,
      count: penghuni.length,
      data: penghuni
    });

  } catch (error) {
    console.error('Error getting penghuni by room:', error);
    
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

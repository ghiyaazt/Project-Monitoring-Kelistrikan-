const Device = require('../models/Device');
const Room = require('../models/Room');
const SensorData = require('../models/SensorData');

/**
 * @desc    Create new device (only owner)
 * @route   POST /api/devices
 * @access  Private (Owner)
 */
exports.createDevice = async (req, res) => {
  try {
    // Only owner can create device
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Hanya owner yang dapat menambahkan perangkat'
      });
    }

    const {
      nama,
      deviceId,
      kamarId,
      dayaWatt,
      tipe,
      mqttTopic,
      deskripsi
    } = req.body;

    // Validasi input
    if (!nama || !deviceId || !kamarId || !dayaWatt) {
      return res.status(400).json({
        success: false,
        message: 'Nama, device ID, kamar, dan daya watt harus diisi'
      });
    }

    // Check if room exists and belongs to owner
    const room = await Room.findOne({
      _id: kamarId,
      ownerId: req.user._id
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Kamar tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Check if deviceId already exists
    const existingDevice = await Device.findOne({ deviceId: deviceId.toUpperCase() });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        message: 'Device ID sudah terdaftar'
      });
    }

    // Create device
    const device = await Device.create({
      nama,
      deviceId: deviceId.toUpperCase(),
      kamarId,
      ownerId: req.user._id,
      dayaWatt,
      tipe: tipe || 'esp32',
      mqttTopic: mqttTopic || null,
      deskripsi: deskripsi || null,
      status: 'offline'
    });

    res.status(201).json({
      success: true,
      message: 'Perangkat berhasil ditambahkan',
      data: device
    });

  } catch (error) {
    console.error('Error creating device:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Device ID sudah terdaftar'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Get all devices (filtered by role)
 * @route   GET /api/devices?kamarId=xxx&status=online
 * @access  Private
 */
exports.getAllDevices = async (req, res) => {
  try {
    const { kamarId, status } = req.query;
    
    // Build filter berdasarkan role
    let filter = {};
    
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      // Penghuni hanya bisa lihat device di kamarnya
      const Penghuni = require('../models/Penghuni');
      const penghuni = await Penghuni.findOne({
        userId: req.user._id,
        status: 'aktif'
      });
      
      if (!penghuni) {
        return res.status(404).json({
          success: false,
          message: 'Data penghuni tidak ditemukan'
        });
      }
      
      filter.kamarId = penghuni.kamarId;
    }
    // Admin bisa lihat semua
    
    // Apply query filters
    if (kamarId) {
      filter.kamarId = kamarId;
    }
    
    if (status) {
      filter.status = status;
    }

    const devices = await Device.find(filter)
      .populate('kamarId', 'nama status')
      .populate('ownerId', 'nama email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });

  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Get single device by ID
 * @route   GET /api/devices/:id
 * @access  Private
 */
exports.getDeviceById = async (req, res) => {
  try {
    // Build filter berdasarkan role
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      const Penghuni = require('../models/Penghuni');
      const penghuni = await Penghuni.findOne({
        userId: req.user._id,
        status: 'aktif'
      });
      
      if (penghuni) {
        filter.kamarId = penghuni.kamarId;
      }
    }

    const device = await Device.findOne(filter)
      .populate('kamarId', 'nama status hargaSewa')
      .populate('ownerId', 'nama email');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });

  } catch (error) {
    console.error('Error getting device:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Update device (only owner)
 * @route   PUT /api/devices/:id
 * @access  Private (Owner)
 */
exports.updateDevice = async (req, res) => {
  try {
    const {
      nama,
      dayaWatt,
      tipe,
      status,
      mqttTopic,
      deskripsi
    } = req.body;

    // Find device (must be owner)
    let device = await Device.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Update fields
    if (nama !== undefined) device.nama = nama;
    if (dayaWatt !== undefined) device.dayaWatt = dayaWatt;
    if (tipe !== undefined) device.tipe = tipe;
    if (status !== undefined) device.status = status;
    if (mqttTopic !== undefined) device.mqttTopic = mqttTopic;
    if (deskripsi !== undefined) device.deskripsi = deskripsi;

    await device.save();

    res.status(200).json({
      success: true,
      message: 'Perangkat berhasil diupdate',
      data: device
    });

  } catch (error) {
    console.error('Error updating device:', error);
    
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
      message: 'Gagal mengupdate perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Delete device (only owner)
 * @route   DELETE /api/devices/:id
 * @access  Private (Owner)
 */
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    await device.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Perangkat berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting device:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menghapus perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Get device statistics (owner/admin only)
 * @route   GET /api/devices/stats/overview
 * @access  Private (Owner/Admin)
 */
exports.getDeviceStats = async (req, res) => {
  try {
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id } : {};
    
    const totalDevices = await Device.countDocuments(filter);
    const onlineDevices = await Device.countDocuments({ ...filter, status: 'online' });
    const offlineDevices = await Device.countDocuments({ ...filter, status: 'offline' });
    const errorDevices = await Device.countDocuments({ ...filter, status: 'error' });
    
    // Total daya terpasang
    const devices = await Device.find(filter);
    const totalDayaTerpasang = devices.reduce((sum, device) => sum + device.dayaWatt, 0);
    
    // Daya aktif (online devices)
    const onlineDevicesList = await Device.find({ ...filter, status: 'online' });
    const totalDayaAktif = onlineDevicesList.reduce((sum, device) => sum + device.dayaWatt, 0);

    res.status(200).json({
      success: true,
      data: {
        totalDevices,
        onlineDevices,
        offlineDevices,
        errorDevices,
        totalDayaTerpasang,
        totalDayaAktif,
        uptime: totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('Error getting device stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Update device real-time data (dari MQTT)
 * @route   PUT /api/devices/:deviceId/data
 * @access  Private (Internal/MQTT)
 */
exports.updateDeviceData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { voltage, current, power, energy, frequency, powerFactor } = req.body;

    const device = await Device.findOne({ deviceId: deviceId.toUpperCase() });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan'
      });
    }

    // Update lastData
    device.lastData = {
      voltage: voltage || 0,
      current: current || 0,
      power: power || 0,
      energy: energy || 0,
      frequency: frequency || 0,
      powerFactor: powerFactor || 0,
      timestamp: new Date()
    };
    
    device.lastUpdate = new Date();
    device.status = 'online';

    await device.save();

    res.status(200).json({
      success: true,
      message: 'Data perangkat berhasil diupdate',
      data: device
    });

  } catch (error) {
    console.error('Error updating device data:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate data perangkat',
      error: error.message
    });
  }
};

/**
 * @desc    Get device history (from SensorData)
 * @route   GET /api/devices/:id/history?limit=100
 * @access  Private
 */
exports.getDeviceHistory = async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Perangkat tidak ditemukan'
      });
    }

    // Get sensor data history
    const history = await SensorData.find({ deviceId: device.deviceId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    console.error('Error getting device history:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat perangkat',
      error: error.message
    });
  }
};

const Device = require('../models/Device');
const Room = require('../models/Room');
const mqtt = require('../config/mqtt');

// @desc    Add new device to a room
// @route   POST /api/devices
// @access  Private (owner/admin)
exports.addDevice = async (req, res) => {
    try {
        const { nama, deviceId, kamarId, tipe, deskripsi } = req.body;

        // Validasi input
        if (!nama || !deviceId || !kamarId) {
            return res.status(400).json({
                success: false,
                message: "Nama, device ID, dan kamar ID wajib diisi"
            });
        }

        // Check if room exists and user owns it
        const room = await Room.findById(kamarId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Kamar tidak ditemukan"
            });
        }

        // Check ownership
        if (room.ownerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke kamar ini"
            });
        }

        // Check if deviceId already exists
        const existingDevice = await Device.findOne({ deviceId: deviceId.toUpperCase() });
        if (existingDevice) {
            return res.status(400).json({
                success: false,
                message: "Device ID sudah terdaftar"
            });
        }

        // Create device
        const device = await Device.create({
            nama,
            deviceId: deviceId.toUpperCase(),
            kamarId,
            ownerId: req.user.id,
            tipe: tipe || 'esp32',
            deskripsi: deskripsi || null,
            status: 'offline'
        });

        // Subscribe to MQTT topic for this device
        const mqttTopic = device.mqttTopic;
        if (mqtt.client && mqtt.client.connected) {
            mqtt.client.subscribe(mqttTopic, (err) => {
                if (err) {
                    console.error(`Failed to subscribe to ${mqttTopic}:`, err);
                } else {
                    console.log(`✅ Subscribed to MQTT topic: ${mqttTopic}`);
                }
            });
        }

        res.status(201).json({
            success: true,
            message: "Perangkat berhasil ditambahkan",
            data: device
        });
    } catch (error) {
        console.error("Add device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambahkan perangkat",
            error: error.message
        });
    }
};

// @desc    Get devices by room ID
// @route   GET /api/devices/room/:kamarId
// @access  Private
exports.getDevicesByRoom = async (req, res) => {
    try {
        const { kamarId } = req.params;

        // Check room ownership
        const room = await Room.findById(kamarId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Kamar tidak ditemukan"
            });
        }

        if (room.ownerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke kamar ini"
            });
        }

        // Get devices
        const devices = await Device.find({ kamarId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: devices
        });
    } catch (error) {
        console.error("Get devices error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data perangkat",
            error: error.message
        });
    }
};

// @desc    Get device by ID
// @route   GET /api/devices/:deviceId
// @access  Private
exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.deviceId);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Perangkat tidak ditemukan"
            });
        }

        // Check ownership
        if (device.ownerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke perangkat ini"
            });
        }

        res.status(200).json({
            success: true,
            data: device
        });
    } catch (error) {
        console.error("Get device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data perangkat",
            error: error.message
        });
    }
};

// @desc    Update device
// @route   PUT /api/devices/:deviceId
// @access  Private
exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.deviceId);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Perangkat tidak ditemukan"
            });
        }

        // Check ownership
        if (device.ownerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke perangkat ini"
            });
        }

        // Update fields
        const { nama, tipe, deskripsi } = req.body;
        if (nama) device.nama = nama;
        if (tipe) device.tipe = tipe;
        if (deskripsi !== undefined) device.deskripsi = deskripsi;

        await device.save();

        res.status(200).json({
            success: true,
            message: "Perangkat berhasil diupdate",
            data: device
        });
    } catch (error) {
        console.error("Update device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate perangkat",
            error: error.message
        });
    }
};

// @desc    Delete device
// @route   DELETE /api/devices/:deviceId
// @access  Private
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.deviceId);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Perangkat tidak ditemukan"
            });
        }

        // Check ownership
        if (device.ownerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki akses ke perangkat ini"
            });
        }

        // Unsubscribe from MQTT topic
        const mqttTopic = device.mqttTopic;
        if (mqtt.client && mqtt.client.connected) {
            mqtt.client.unsubscribe(mqttTopic, (err) => {
                if (err) {
                    console.error(`Failed to unsubscribe from ${mqttTopic}:`, err);
                } else {
                    console.log(`✅ Unsubscribed from MQTT topic: ${mqttTopic}`);
                }
            });
        }

        await device.deleteOne();

        res.status(200).json({
            success: true,
            message: "Perangkat berhasil dihapus"
        });
    } catch (error) {
        console.error("Delete device error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus perangkat",
            error: error.message
        });
    }
};

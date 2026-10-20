const mongoose = require('mongoose');

// Schema untuk Device/Perangkat IoT (ESP32)
const deviceSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama perangkat harus diisi'],
    trim: true,
    maxlength: [100, 'Nama perangkat maksimal 100 karakter']
  },
  
  deviceId: {
    type: String,
    required: [true, 'Device ID harus diisi'],
    unique: true,
    trim: true,
    uppercase: true
  },
  
  // Reference ke Room (kamar)
  kamarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Kamar ID harus diisi']
  },
  
  // Reference ke User (owner)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID harus diisi']
  },
  
  // Spesifikasi perangkat
  dayaWatt: {
    type: Number,
    required: [true, 'Daya watt harus diisi'],
    min: [0, 'Daya watt tidak boleh negatif']
  },
  
  tipe: {
    type: String,
    enum: {
      values: ['esp32', 'sensor', 'relay', 'smart_plug', 'lainnya'],
      message: 'Tipe perangkat tidak valid'
    },
    default: 'esp32'
  },
  
  // Status perangkat
  status: {
    type: String,
    enum: {
      values: ['online', 'offline', 'error', 'maintenance'],
      message: 'Status perangkat tidak valid'
    },
    default: 'offline'
  },
  
  // Data real-time terakhir
  lastData: {
    voltage: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
    },
    power: {
      type: Number,
      default: 0
    },
    energy: {
      type: Number,
      default: 0
    },
    frequency: {
      type: Number,
      default: 0
    },
    powerFactor: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Date,
      default: null
    }
  },
  
  // Update terakhir
  lastUpdate: {
    type: Date,
    default: null
  },
  
  // Konfigurasi MQTT
  mqttTopic: {
    type: String,
    trim: true,
    default: null
  },
  
  // Catatan/deskripsi
  deskripsi: {
    type: String,
    trim: true,
    maxlength: [500, 'Deskripsi maksimal 500 karakter'],
    default: null
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk cek apakah device aktif (update dalam 5 menit terakhir)
deviceSchema.virtual('isActive').get(function() {
  if (!this.lastUpdate) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastUpdate > fiveMinutesAgo;
});

// Virtual untuk durasi offline (dalam menit)
deviceSchema.virtual('offlineDuration').get(function() {
  if (!this.lastUpdate) return null;
  const diff = Date.now() - this.lastUpdate.getTime();
  return Math.floor(diff / (1000 * 60)); // dalam menit
});

// Middleware: Update timestamp before save
deviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') {
    next();
  }
});

// Middleware: Auto-set MQTT topic jika belum ada
deviceSchema.pre('save', function(next) {
  if (!this.mqttTopic && this.deviceId) {
    this.mqttTopic = `wattwise/${this.deviceId}`;
  }
  if (typeof next === 'function') {
    next();
  }
});

// Index untuk performa query
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ kamarId: 1, status: 1 });
deviceSchema.index({ ownerId: 1, status: 1 });
deviceSchema.index({ status: 1, lastUpdate: -1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;

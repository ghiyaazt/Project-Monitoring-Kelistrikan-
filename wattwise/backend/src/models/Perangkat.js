const mongoose = require('mongoose');

const perangkatSchema = new mongoose.Schema({
  kamarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Kamar ID harus diisi']
  },
  
  nama: {
    type: String,
    required: [true, 'Nama perangkat harus diisi'],
    trim: true,
    maxlength: [100, 'Nama perangkat maksimal 100 karakter']
  },
  
  deviceId: {
    type: String,
    required: [true, 'Device ID harus diisi'],
    trim: true,
    uppercase: true
  },
  
  dayaWatt: {
    type: Number,
    required: [true, 'Daya (Watt) harus diisi'],
    min: [0, 'Daya tidak boleh negatif']
  },
  
  // Optional fields
  jenis: {
    type: String,
    enum: ['AC', 'Kulkas', 'TV', 'Lampu', 'Kipas Angin', 'Dispenser', 'Lainnya'],
    default: 'Lainnya'
  },
  
  statusOperasi: {
    type: String,
    enum: ['aktif', 'nonaktif', 'maintenance'],
    default: 'aktif'
  },
  
  keterangan: {
    type: String,
    trim: true,
    maxlength: [500, 'Keterangan maksimal 500 karakter'],
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

// Virtual untuk link ke device details
perangkatSchema.virtual('device', {
  ref: 'Device',
  localField: 'deviceId',
  foreignField: 'device_id',
  justOne: true
});

// Middleware: Update timestamp before save
perangkatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') {
    next();
  }
});

// Index untuk performa query
perangkatSchema.index({ kamarId: 1 });
perangkatSchema.index({ deviceId: 1 });
perangkatSchema.index({ kamarId: 1, statusOperasi: 1 });

const Perangkat = mongoose.model('Perangkat', perangkatSchema);

module.exports = Perangkat;

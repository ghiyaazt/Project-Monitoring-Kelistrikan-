const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama kamar harus diisi'],
    trim: true,
    maxlength: [50, 'Nama kamar maksimal 50 karakter']
  },
  
  status: {
    type: String,
    enum: {
      values: ['terisi', 'kosong'],
      message: 'Status harus terisi atau kosong'
    },
    default: 'kosong'
  },
  
  hargaSewa: {
    type: Number,
    required: [true, 'Harga sewa harus diisi'],
    min: [0, 'Harga sewa tidak boleh negatif']
  },
  
  luasKamar: {
    type: Number,
    required: [true, 'Luas kamar harus diisi'],
    min: [1, 'Luas kamar minimal 1 m²']
  },
  
  fasilitas: {
    type: [String],
    default: []
  },
  
  maxPenghuni: {
    type: Number,
    required: [true, 'Maksimal penghuni harus diisi'],
    min: [1, 'Minimal 1 penghuni'],
    default: 1
  },
  
  gambar: {
    type: [String],
    default: []
  },
  
  gambarProfil: {
    type: Number,
    default: 0,
    min: [0, 'Index gambar profil tidak valid']
  },
  
  // Reference ke model Kos (kos parent)
  kosId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kos',
    required: [true, 'Kos ID harus diisi']
  },
  
  // Reference ke model User (owner kos)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID harus diisi']
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
  timestamps: true, // Otomatis handle createdAt & updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual untuk populate penghuni
roomSchema.virtual('penghuniList', {
  ref: 'Penghuni',
  localField: '_id',
  foreignField: 'kamarId'
});

// Virtual untuk populate devices
roomSchema.virtual('devices', {
  ref: 'Device',
  localField: '_id',
  foreignField: 'kamarId'
});

// Virtual untuk hitung jumlah penghuni
roomSchema.virtual('jumlahPenghuni', {
  ref: 'Penghuni',
  localField: '_id',
  foreignField: 'kamarId',
  count: true
});

// Middleware: Update timestamp before save
roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') {
    next();
  }
});

// Index untuk performa query
roomSchema.index({ ownerId: 1, status: 1 });
roomSchema.index({ kosId: 1 });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

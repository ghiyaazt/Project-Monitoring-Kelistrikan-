const mongoose = require('mongoose');

// Sub-schema untuk Alamat
const alamatSchema = new mongoose.Schema({
  jalan: {
    type: String,
    required: [true, 'Jalan harus diisi'],
    trim: true
  },
  kelurahan: {
    type: String,
    trim: true,
    default: null
  },
  kecamatan: {
    type: String,
    trim: true,
    default: null
  },
  kota: {
    type: String,
    required: [true, 'Kota harus diisi'],
    trim: true
  },
  provinsi: {
    type: String,
    required: [true, 'Provinsi harus diisi'],
    trim: true
  },
  kodePos: {
    type: String,
    trim: true,
    match: [/^\d{5}$/, 'Kode pos harus 5 digit'],
    default: null
  }
}, { _id: false });

// Sub-schema untuk Kontak Pemilik
const kontakSchema = new mongoose.Schema({
  telepon: {
    type: String,
    trim: true,
    match: [/^(\+62|62|0)[0-9]{9,12}$/, 'Format nomor telepon tidak valid'],
    default: null
  },
  whatsapp: {
    type: String,
    trim: true,
    match: [/^(\+62|62|0)[0-9]{9,12}$/, 'Format nomor WhatsApp tidak valid'],
    default: null
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Format email tidak valid'],
    default: null
  }
}, { _id: false });

// Main schema untuk Kos
const kosSchema = new mongoose.Schema({
  namaKos: {
    type: String,
    required: [true, 'Nama kos harus diisi'],
    trim: true,
    maxlength: [100, 'Nama kos maksimal 100 karakter']
  },
  
  alamat: {
    type: alamatSchema,
    required: [true, 'Alamat harus diisi']
  },
  
  deskripsi: {
    type: String,
    trim: true,
    maxlength: [1000, 'Deskripsi maksimal 1000 karakter'],
    default: null
  },
  
  fasilitasUmum: {
    type: [String],
    default: []
  },
  
  peraturan: {
    type: [String],
    default: []
  },
  
  kontakPemilik: {
    type: kontakSchema,
    default: {}
  },
  
  gambar: {
    type: [String], // Array of image URLs
    default: []
  },
  
  gambarProfil: {
    type: Number, // Index gambar yang jadi profile (default 0)
    default: 0,
    min: 0
  },
  
  // Reference ke User (owner)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID harus diisi']
  },
  
  // Statistik (auto-calculated)
  totalKamar: {
    type: Number,
    default: 0,
    min: 0
  },
  
  kamarTerisi: {
    type: Number,
    default: 0,
    min: 0
  },
  
  kamarKosong: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status kos
  status: {
    type: String,
    enum: {
      values: ['aktif', 'nonaktif'],
      message: 'Status harus aktif atau nonaktif'
    },
    default: 'aktif'
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

// Virtual untuk tingkat hunian (%)
kosSchema.virtual('tingkatHunian').get(function() {
  if (this.totalKamar === 0) return 0;
  return ((this.kamarTerisi / this.totalKamar) * 100).toFixed(1);
});

// Virtual untuk alamat lengkap (string)
kosSchema.virtual('alamatLengkap').get(function() {
  const parts = [
    this.alamat.jalan,
    this.alamat.kelurahan,
    this.alamat.kecamatan,
    this.alamat.kota,
    this.alamat.provinsi,
    this.alamat.kodePos
  ].filter(Boolean);
  
  return parts.join(', ');
});

// Middleware: Update timestamp before save
kosSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') {
    next();
  }
});

// Middleware: Update statistik kamar sebelum save
kosSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Skip untuk kos baru (belum ada kamar)
    if (typeof next === 'function') {
      return next();
    }
    return;
  }
  
  try {
    const Room = mongoose.model('Room');
    
    // Hitung total kamar
    this.totalKamar = await Room.countDocuments({ kosId: this._id });
    
    // Hitung kamar terisi
    this.kamarTerisi = await Room.countDocuments({ 
      kosId: this._id, 
      status: 'terisi' 
    });
    
    // Hitung kamar kosong
    this.kamarKosong = await Room.countDocuments({ 
      kosId: this._id, 
      status: 'kosong' 
    });
    
    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    console.error('Error updating kos stats:', error);
    if (typeof next === 'function') {
      next(error);
    }
  }
});

// Index untuk performa query
kosSchema.index({ ownerId: 1, status: 1 });
kosSchema.index({ 'alamat.kota': 1, status: 1 });
kosSchema.index({ namaKos: 'text', deskripsi: 'text' }); // Text search

const Kos = mongoose.model('Kos', kosSchema);

module.exports = Kos;

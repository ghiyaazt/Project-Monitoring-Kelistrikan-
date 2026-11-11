const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  kamarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Kamar ID harus diisi']
  },
  
  penghuniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Penghuni',
    default: null
  },
  
  bulan: {
    type: String,
    required: [true, 'Bulan harus diisi'],
    enum: [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
  },
  
  tahun: {
    type: Number,
    required: [true, 'Tahun harus diisi'],
    min: [2020, 'Tahun tidak valid']
  },
  
  jumlah: {
    type: Number,
    required: [true, 'Jumlah pembayaran harus diisi'],
    min: [0, 'Jumlah tidak boleh negatif']
  },
  
  status: {
    type: String,
    enum: {
      values: ['lunas', 'sudah_bayar', 'belum_bayar', 'terlambat'],
      message: 'Status harus salah satu dari: lunas, sudah_bayar, belum_bayar, terlambat'
    },
    default: 'belum_bayar'
  },
  
  tanggalBayar: {
    type: Date,
    default: null
  },
  
  metodePembayaran: {
    type: String,
    enum: ['Transfer Bank', 'Cash', 'E-wallet', 'Lainnya'],
    default: null
  },
  
  tanggalJatuhTempo: {
    type: Date,
    default: null
  },
  
  buktiPembayaran: {
    type: String, // URL or file path
    default: null
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

// Virtual untuk status keterlambatan
paymentSchema.virtual('isLate').get(function() {
  if (this.status === 'lunas' || this.status === 'sudah_bayar') {
    return false;
  }
  if (this.tanggalJatuhTempo && new Date() > this.tanggalJatuhTempo) {
    return true;
  }
  return false;
});

// Middleware: Update timestamp before save
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-update status to 'terlambat' if past due date
  if (this.status === 'belum_bayar' && this.tanggalJatuhTempo) {
    const now = new Date();
    if (now > this.tanggalJatuhTempo) {
      this.status = 'terlambat';
    }
  }
  
  if (typeof next === 'function') {
    next();
  }
});

// Index untuk performa query
paymentSchema.index({ kamarId: 1, tahun: -1, bulan: 1 });
paymentSchema.index({ penghuniId: 1, status: 1 });
paymentSchema.index({ status: 1, tanggalJatuhTempo: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

const mongoose = require('mongoose');

// Sub-schema untuk Payment
const paymentSchema = new mongoose.Schema({
  bulan: {
    type: String,
    required: [true, 'Bulan harus diisi'],
    trim: true
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
      message: 'Status pembayaran tidak valid'
    },
    default: 'belum_bayar'
  },
  
  tanggalBayar: {
    type: Date,
    default: null
  },
  
  tanggalJatuhTempo: {
    type: Date,
    required: [true, 'Tanggal jatuh tempo harus diisi']
  },
  
  metodePembayaran: {
    type: String,
    trim: true,
    default: null
  },
  
  buktiPembayaran: {
    type: String, // URL gambar/file bukti transfer
    default: null
  },
  
  keterangan: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Main schema untuk Penghuni
const penghuniSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama penghuni harus diisi'],
    trim: true,
    maxlength: [100, 'Nama maksimal 100 karakter']
  },
  
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Format email tidak valid'
    ]
  },
  
  telepon: {
    type: String,
    required: [true, 'Nomor telepon harus diisi'],
    trim: true,
    match: [
      /^(\+62|62|0)[0-9]{9,12}$/,
      'Format nomor telepon tidak valid'
    ]
  },
  
  tanggalMasuk: {
    type: Date,
    required: [true, 'Tanggal masuk harus diisi'],
    default: Date.now
  },
  
  tanggalKeluar: {
    type: Date,
    default: null
  },
  
  // Reference ke User (akun penghuni itu sendiri)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID harus diisi']
  },
  
  // Reference ke Room
  kamarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Kamar ID harus diisi']
  },
  
  // Reference ke User (owner kos yang punya kamar ini)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID harus diisi']
  },
  
  // Status penghuni
  status: {
    type: String,
    enum: {
      values: ['aktif', 'keluar', 'non_aktif'],
      message: 'Status penghuni tidak valid'
    },
    default: 'aktif'
  },
  
  // Payment history (embedded documents)
  payments: {
    type: [paymentSchema],
    default: []
  },
  
  // Informasi tambahan
  identitas: {
    nomorKTP: {
      type: String,
      trim: true,
      default: null
    },
    fotoKTP: {
      type: String, // URL gambar KTP
      default: null
    }
  },
  
  kontakDarurat: {
    nama: {
      type: String,
      trim: true,
      default: null
    },
    hubungan: {
      type: String,
      trim: true,
      default: null
    },
    telepon: {
      type: String,
      trim: true,
      default: null
    }
  },
  
  catatan: {
    type: String,
    trim: true,
    maxlength: [500, 'Catatan maksimal 500 karakter'],
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

// Virtual untuk hitung total pembayaran
penghuniSchema.virtual('totalPembayaran').get(function() {
  return this.payments.reduce((total, payment) => {
    return payment.status === 'lunas' || payment.status === 'sudah_bayar' 
      ? total + payment.jumlah 
      : total;
  }, 0);
});

// Virtual untuk hitung tunggakan
penghuniSchema.virtual('totalTunggakan').get(function() {
  return this.payments.reduce((total, payment) => {
    return payment.status === 'belum_bayar' || payment.status === 'terlambat'
      ? total + payment.jumlah 
      : total;
  }, 0);
});

// Virtual untuk durasi tinggal (dalam bulan)
penghuniSchema.virtual('durasiTinggal').get(function() {
  const endDate = this.tanggalKeluar || new Date();
  const months = Math.floor(
    (endDate - this.tanggalMasuk) / (1000 * 60 * 60 * 24 * 30)
  );
  return months;
});

// Middleware: Update timestamp before save
penghuniSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (typeof next === 'function') {
    next();
  }
});

// Middleware: Update status room ketika penghuni keluar
penghuniSchema.post('save', async function(doc) {
  if (doc.status === 'keluar' && doc.kamarId) {
    const Room = mongoose.model('Room');
    const room = await Room.findById(doc.kamarId);
    
    if (room) {
      // Cek apakah masih ada penghuni aktif di kamar ini
      const activePenghuni = await mongoose.model('Penghuni').countDocuments({
        kamarId: doc.kamarId,
        status: 'aktif'
      });
      
      // Update status room jadi kosong jika tidak ada penghuni aktif
      if (activePenghuni === 0) {
        room.status = 'kosong';
        await room.save();
      }
    }
  }
});

// Index untuk performa query
penghuniSchema.index({ kamarId: 1, status: 1 });
penghuniSchema.index({ ownerId: 1, status: 1 });
penghuniSchema.index({ email: 1 });
penghuniSchema.index({ 'payments.status': 1 });

const Penghuni = mongoose.model('Penghuni', penghuniSchema);

module.exports = Penghuni;

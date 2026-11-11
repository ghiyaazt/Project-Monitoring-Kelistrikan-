const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID harus diisi']
  },
  
  name: {
    type: String,
    required: [true, 'Nama group harus diisi'],
    trim: true,
    maxlength: [100, 'Nama group maksimal 100 karakter']
  },
  
  devices: {
    type: [String], // Array of deviceIds
    default: []
  },
  
  totalDaya: {
    type: Number,
    default: 0,
    min: [0, 'Total daya tidak boleh negatif']
  },
  
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

// Virtual untuk hitung jumlah device
groupSchema.virtual('deviceCount').get(function() {
  return this.devices.length;
});

// Method untuk calculate total daya
groupSchema.methods.calculateTotalDaya = async function() {
  const Perangkat = mongoose.model('Perangkat');
  
  try {
    const perangkatList = await Perangkat.find({
      deviceId: { $in: this.devices }
    });
    
    this.totalDaya = perangkatList.reduce((sum, p) => sum + p.dayaWatt, 0);
    return this.totalDaya;
  } catch (error) {
    console.error('Error calculating total daya:', error);
    return 0;
  }
};

// Middleware: Update timestamp and calculate totalDaya before save
groupSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Calculate totalDaya if devices changed
  if (this.isModified('devices')) {
    await this.calculateTotalDaya();
  }
  
  if (typeof next === 'function') {
    next();
  }
});

// Index untuk performa query
groupSchema.index({ ownerId: 1 });
groupSchema.index({ name: 1, ownerId: 1 });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

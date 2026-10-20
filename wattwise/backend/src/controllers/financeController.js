const Penghuni = require('../models/Penghuni');
const Room = require('../models/Room');
const Kos = require('../models/Kos');

/**
 * @desc    Get financial statistics (owner/admin only)
 * @route   GET /api/finance/stats
 * @access  Private (Owner/Admin)
 */
exports.getFinanceStats = async (req, res) => {
  try {
    // Only owner and admin can see stats
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    
    // Build filter berdasarkan role
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id } : {};
    
    // Get all active penghuni
    const activePenghuni = await Penghuni.find({ ...filter, status: 'aktif' });
    
    // Calculate total pendapatan (from active penghuni's room rent)
    let totalPendapatan = 0;
    let totalTunggakan = 0;
    let totalLunas = 0;
    let totalBelumBayar = 0;
    
    for (const penghuni of activePenghuni) {
      // Get room price
      const room = await Room.findById(penghuni.kamarId);
      if (room) {
        // Calculate from payments
        penghuni.payments.forEach(payment => {
          if (payment.status === 'lunas' || payment.status === 'sudah_bayar') {
            totalLunas += payment.jumlah;
          } else if (payment.status === 'belum_bayar' || payment.status === 'terlambat') {
            totalTunggakan += payment.jumlah;
          }
        });
        
        // Add current month rent to pendapatan
        totalPendapatan += room.hargaSewa;
      }
    }
    
    // Calculate total belum bayar
    totalBelumBayar = totalTunggakan;
    
    // Get total penghuni
    const totalPenghuni = activePenghuni.length;
    
    // Get total rooms terisi
    const totalRoomsTerisi = await Room.countDocuments({ ...filter, status: 'terisi' });

    res.status(200).json({
      success: true,
      data: {
        totalPendapatan,
        totalLunas,
        totalTunggakan,
        totalBelumBayar,
        totalPenghuni,
        totalRoomsTerisi,
        averagePembayaran: totalPenghuni > 0 ? (totalLunas / totalPenghuni).toFixed(0) : 0
      }
    });

  } catch (error) {
    console.error('Error getting finance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik keuangan',
      error: error.message
    });
  }
};

/**
 * @desc    Get monthly financial report
 * @route   GET /api/finance/report?bulan=Januari&tahun=2024
 * @access  Private (Owner/Admin)
 */
exports.getMonthlyReport = async (req, res) => {
  try {
    // Only owner and admin can see report
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    
    const { bulan, tahun } = req.query;
    
    if (!bulan || !tahun) {
      return res.status(400).json({
        success: false,
        message: 'Bulan dan tahun harus diisi'
      });
    }
    
    // Build filter berdasarkan role
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id } : {};
    
    // Get all penghuni
    const penghuniList = await Penghuni.find(filter);
    
    let totalPemasukan = 0;
    let totalLunas = 0;
    let totalBelumBayar = 0;
    const detailPembayaran = [];
    
    for (const penghuni of penghuniList) {
      // Find payment for this month
      const payment = penghuni.payments.find(
        p => p.bulan === bulan && p.tahun === parseInt(tahun)
      );
      
      if (payment) {
        const room = await Room.findById(penghuni.kamarId);
        
        const detail = {
          penghuniId: penghuni._id,
          namaPenghuni: penghuni.nama,
          emailPenghuni: penghuni.email,
          namaKamar: room ? room.nama : '-',
          jumlah: payment.jumlah,
          status: payment.status,
          tanggalBayar: payment.tanggalBayar || null,
          tanggalJatuhTempo: payment.tanggalJatuhTempo,
          metodePembayaran: payment.metodePembayaran || '-'
        };
        
        detailPembayaran.push(detail);
        
        if (payment.status === 'lunas' || payment.status === 'sudah_bayar') {
          totalLunas += payment.jumlah;
          totalPemasukan += payment.jumlah;
        } else {
          totalBelumBayar += payment.jumlah;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        bulan,
        tahun: parseInt(tahun),
        summary: {
          totalPemasukan,
          totalLunas,
          totalBelumBayar,
          totalPembayaran: detailPembayaran.length
        },
        details: detailPembayaran
      }
    });

  } catch (error) {
    console.error('Error getting monthly report:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil laporan bulanan',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment history for a penghuni
 * @route   GET /api/finance/penghuni/:id/history
 * @access  Private
 */
exports.getPenghuniPaymentHistory = async (req, res) => {
  try {
    // Build filter berdasarkan role
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'owner') {
      filter.ownerId = req.user._id;
    } else if (req.user.role === 'penghuni') {
      filter.userId = req.user._id;
    }

    const penghuni = await Penghuni.findOne(filter)
      .populate('kamarId', 'nama hargaSewa');

    if (!penghuni) {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    // Calculate statistics
    const totalPembayaran = penghuni.payments.reduce((sum, p) => {
      return (p.status === 'lunas' || p.status === 'sudah_bayar') 
        ? sum + p.jumlah 
        : sum;
    }, 0);
    
    const totalTunggakan = penghuni.payments.reduce((sum, p) => {
      return (p.status === 'belum_bayar' || p.status === 'terlambat')
        ? sum + p.jumlah 
        : sum;
    }, 0);
    
    const totalPayments = penghuni.payments.length;
    const lunasCount = penghuni.payments.filter(p => 
      p.status === 'lunas' || p.status === 'sudah_bayar'
    ).length;
    const tunggakanCount = penghuni.payments.filter(p => 
      p.status === 'belum_bayar' || p.status === 'terlambat'
    ).length;

    res.status(200).json({
      success: true,
      data: {
        penghuni: {
          id: penghuni._id,
          nama: penghuni.nama,
          email: penghuni.email,
          kamar: penghuni.kamarId ? penghuni.kamarId.nama : null,
          hargaSewa: penghuni.kamarId ? penghuni.kamarId.hargaSewa : null
        },
        summary: {
          totalPembayaran,
          totalTunggakan,
          totalPayments,
          lunasCount,
          tunggakanCount
        },
        payments: penghuni.payments.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
      }
    });

  } catch (error) {
    console.error('Error getting payment history:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Penghuni tidak ditemukan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat pembayaran',
      error: error.message
    });
  }
};

/**
 * @desc    Get all overdue payments
 * @route   GET /api/finance/overdue
 * @access  Private (Owner/Admin)
 */
exports.getOverduePayments = async (req, res) => {
  try {
    // Only owner and admin can see overdue
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    
    // Build filter berdasarkan role
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id, status: 'aktif' } : { status: 'aktif' };
    
    // Get all active penghuni
    const penghuniList = await Penghuni.find(filter)
      .populate('kamarId', 'nama hargaSewa');
    
    const overdueList = [];
    const today = new Date();
    
    for (const penghuni of penghuniList) {
      // Find overdue payments
      const overduePayments = penghuni.payments.filter(payment => {
        const isOverdue = payment.tanggalJatuhTempo && 
                         new Date(payment.tanggalJatuhTempo) < today &&
                         (payment.status === 'belum_bayar' || payment.status === 'terlambat');
        return isOverdue;
      });
      
      if (overduePayments.length > 0) {
        overduePayments.forEach(payment => {
          const daysOverdue = Math.floor(
            (today - new Date(payment.tanggalJatuhTempo)) / (1000 * 60 * 60 * 24)
          );
          
          overdueList.push({
            penghuniId: penghuni._id,
            namaPenghuni: penghuni.nama,
            emailPenghuni: penghuni.email,
            teleponPenghuni: penghuni.telepon,
            namaKamar: penghuni.kamarId ? penghuni.kamarId.nama : '-',
            paymentId: payment._id,
            bulan: payment.bulan,
            tahun: payment.tahun,
            jumlah: payment.jumlah,
            tanggalJatuhTempo: payment.tanggalJatuhTempo,
            daysOverdue,
            status: payment.status
          });
        });
      }
    }
    
    // Sort by days overdue (descending)
    overdueList.sort((a, b) => b.daysOverdue - a.daysOverdue);

    res.status(200).json({
      success: true,
      count: overdueList.length,
      totalOverdueAmount: overdueList.reduce((sum, item) => sum + item.jumlah, 0),
      data: overdueList
    });

  } catch (error) {
    console.error('Error getting overdue payments:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar tunggakan',
      error: error.message
    });
  }
};

/**
 * @desc    Get yearly financial summary
 * @route   GET /api/finance/yearly?tahun=2024
 * @access  Private (Owner/Admin)
 */
exports.getYearlySummary = async (req, res) => {
  try {
    // Only owner and admin can see summary
    if (req.user.role === 'penghuni') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }
    
    const { tahun = new Date().getFullYear() } = req.query;
    
    // Build filter berdasarkan role
    const filter = req.user.role === 'owner' ? { ownerId: req.user._id } : {};
    
    // Get all penghuni
    const penghuniList = await Penghuni.find(filter);
    
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const monthlySummary = months.map(bulan => {
      let totalLunas = 0;
      let totalBelumBayar = 0;
      let countLunas = 0;
      let countBelumBayar = 0;
      
      penghuniList.forEach(penghuni => {
        const payment = penghuni.payments.find(
          p => p.bulan === bulan && p.tahun === parseInt(tahun)
        );
        
        if (payment) {
          if (payment.status === 'lunas' || payment.status === 'sudah_bayar') {
            totalLunas += payment.jumlah;
            countLunas++;
          } else {
            totalBelumBayar += payment.jumlah;
            countBelumBayar++;
          }
        }
      });
      
      return {
        bulan,
        totalLunas,
        totalBelumBayar,
        countLunas,
        countBelumBayar,
        totalPemasukan: totalLunas
      };
    });
    
    const yearTotal = {
      totalPemasukan: monthlySummary.reduce((sum, m) => sum + m.totalPemasukan, 0),
      totalTunggakan: monthlySummary.reduce((sum, m) => sum + m.totalBelumBayar, 0),
      averagePerMonth: monthlySummary.reduce((sum, m) => sum + m.totalPemasukan, 0) / 12
    };

    res.status(200).json({
      success: true,
      tahun: parseInt(tahun),
      yearTotal,
      monthlySummary
    });

  } catch (error) {
    console.error('Error getting yearly summary:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil ringkasan tahunan',
      error: error.message
    });
  }
};

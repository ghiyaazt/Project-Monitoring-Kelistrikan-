import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { kosService } from '../../../services';
import { getStatusBadgeClass, getStatusText, PaymentStatus } from '../../../utils/dashboard/kamar/penghuni';
import '../../../styles/kamar/index.css';
import '../../../styles/kamar/penghuni.css';

interface PenghuniData {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  kosNama: string;
  kamarNama: string;
  tanggalMasuk: string;
  status: 'aktif' | 'tidak_aktif';
  pembayaranTerakhir?: string;
  statusPembayaran: PaymentStatus;
}

const Penghuni: React.FC = () => {
  const { effectiveTheme, kosList: localKosList } = useApp();
  const isDark = effectiveTheme === 'dark';

  // State for API data
  const [kosList, setKosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if API mode is enabled
  const USE_API = process.env.REACT_APP_USE_API === 'true';

  // Fetch kos list on component mount
  useEffect(() => {
    fetchKosListData();
  }, []);

  async function fetchKosListData() {
    if (!USE_API) {
      // Use localStorage data
      setKosList(localKosList);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await kosService.getKosList();
      setKosList(data);
    } catch (err: any) {
      console.error('Error fetching kos list:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }

  // Generate penghuni list from kosList data
  const penghuniList = useMemo(() => {
    const result: PenghuniData[] = [];
    
    kosList.forEach((kos: any) => {
      kos.kamarList?.forEach((kamar: any) => {
        // Iterate through penghuniList instead of single penghuni
        if (kamar.penghuniList && kamar.penghuniList.length > 0) {
          kamar.penghuniList.forEach((penghuni: any) => {
            // Find latest payment
            const payments = kamar.payments || [];
            const latestPayment = payments.find((p: any) => p.status === 'lunas');
            const hasBelumBayar = payments.some((p: any) => p.status === 'belum_bayar');
            const hasTerlambat = payments.some((p: any) => p.status === 'terlambat');
            const hasSudahBayar = payments.some((p: any) => p.status === 'sudah_bayar');
            
            let statusPembayaran: PaymentStatus = 'lunas';
            if (hasTerlambat) {
              statusPembayaran = 'terlambat';
            } else if (hasSudahBayar) {
              statusPembayaran = 'sudah_bayar';
            } else if (hasBelumBayar) {
              statusPembayaran = 'belum_bayar';
            }
            
            result.push({
              id: penghuni.id || penghuni._id,
              nama: penghuni.nama,
              email: penghuni.email,
              telepon: penghuni.telepon || penghuni.no_telp || '-',
              kosNama: kos.nama,
              kamarNama: kamar.nama,
              tanggalMasuk: penghuni.tanggalMasuk,
              status: 'aktif',
              pembayaranTerakhir: latestPayment?.tanggalBayar,
              statusPembayaran: statusPembayaran
            });
          });
        }
      });
    });
    
    return result;
  }, [kosList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredPenghuni = penghuniList.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.kosNama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || p.statusPembayaran === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="kamar-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto text-watt-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Memuat data penghuni...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="kamar-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchKosListData}
              className="mt-4 px-4 py-2 bg-watt-blue text-white rounded-lg hover:bg-watt-blue-dark transition">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kamar-container">
      <div className="kamar-main">
        {/* Header */}
        <div className="kamar-header">
          <div>
            <h1 className="kamar-title">Daftar Penghuni</h1>
            <p className="kamar-subtitle">
              Kelola data penghuni kos Anda
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="kamar-search-bar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="kamar-form-group">
              <label className="kamar-form-label">
                Cari Penghuni
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama, email, atau kos..."
                className="kamar-form-input"
              />
            </div>

            {/* Filter Status Pembayaran */}
            <div className="kamar-form-group">
              <label className="kamar-form-label">
                Status Pembayaran
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="kamar-form-select"
              >
                <option value="">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="belum_bayar">Belum Bayar</option>
                <option value="terlambat">Terlambat</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 kamar-divider">
            <div className="kamar-flex-between">
              <p className="kamar-subtitle">
                Total: <span className="font-semibold">{filteredPenghuni.length}</span> penghuni
              </p>
              {(searchQuery || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('');
                  }}
                  className="kamar-btn-secondary penghuni-reset-btn"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="kamar-table-container">
          <table className="kamar-table">
            <thead>
              <tr>
                <th>Penghuni</th>
                <th>Kontak</th>
                <th>Kos & Kamar</th>
                <th>Tanggal Masuk</th>
                <th>Status Pembayaran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPenghuni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="penghuni-empty-cell">
                    <div className="kamar-empty-icon">👥</div>
                    <p className="kamar-subtitle">
                      Tidak ada penghuni ditemukan
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPenghuni.map(penghuni => (
                  <tr key={penghuni.id}>
                    <td>
                      <div className="penghuni-cell-flex">
                        <div className={`penghuni-avatar ${isDark ? 'penghuni-avatar-dark' : 'penghuni-avatar-light'}`}>
                          {penghuni.nama.charAt(0)}
                        </div>
                        <div className="penghuni-info">
                          <p className="penghuni-name">
                            {penghuni.nama}
                          </p>
                          <p className="kamar-subtitle penghuni-email">
                            {penghuni.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {penghuni.telepon}
                    </td>
                    <td>
                      <p className="penghuni-kos-name">
                        {penghuni.kosNama}
                      </p>
                      <p className="kamar-subtitle penghuni-kamar-name">
                        {penghuni.kamarNama}
                      </p>
                    </td>
                    <td>
                      {new Date(penghuni.tanggalMasuk).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td>
                      <span className={`kamar-badge ${getStatusBadgeClass(penghuni.statusPembayaran)}`}>
                        {getStatusText(penghuni.statusPembayaran)}
                      </span>
                      {penghuni.pembayaranTerakhir && (
                        <p className="kamar-subtitle penghuni-payment-date">
                          {new Date(penghuni.pembayaranTerakhir).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {}}
                        className="kamar-btn-secondary penghuni-action-btn"
                        disabled
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Penghuni;

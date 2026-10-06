import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

interface LaporanItem {
  id: string;
  tanggal: string;
  kategori: 'pemasukan' | 'pengeluaran';
  jenis: string;
  kosNama: string;
  kamarNama?: string;
  penghuniNama?: string;
  deskripsi: string;
  jumlah: number;
}

const LaporanKeuangan: React.FC = () => {
  const { effectiveTheme, kosList } = useApp();
  const isDark = effectiveTheme === 'dark';

  // Generate laporan list from kosList payments
  const laporanList = useMemo(() => {
    const result: LaporanItem[] = [];
    
    kosList.forEach(kos => {
      kos.kamarList.forEach(kamar => {
        if (kamar.payments && kamar.payments.length > 0) {
          kamar.payments.forEach(payment => {
            if (payment.status === 'lunas' && payment.tanggalBayar) {
              // Get first penghuni name if exists
              const penghuniNama = kamar.penghuniList && kamar.penghuniList.length > 0 
                ? kamar.penghuniList[0].nama 
                : undefined;
              
              result.push({
                id: `${kamar.id}-${payment.id}`,
                tanggal: payment.tanggalBayar,
                kategori: 'pemasukan',
                jenis: 'Pembayaran Sewa',
                kosNama: kos.nama,
                kamarNama: kamar.nama,
                penghuniNama: penghuniNama,
                deskripsi: `Pembayaran sewa bulan ${payment.bulan} ${payment.tahun}${penghuniNama ? ' - ' + penghuniNama : ''}`,
                jumlah: payment.jumlah
              });
            }
          });
        }
      });
    });
    
    // Sort by date descending (newest first)
    return result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [kosList]);

  const [filterKategori, setFilterKategori] = useState<string>('');
  const [filterBulan, setFilterBulan] = useState<string>('');

  const filteredLaporan = laporanList.filter(item => {
    const matchesKategori = !filterKategori || item.kategori === filterKategori;
    const matchesBulan = !filterBulan || item.tanggal.startsWith(filterBulan);
    return matchesKategori && matchesBulan;
  });

  const totalPemasukan = filteredLaporan
    .filter(item => item.kategori === 'pemasukan')
    .reduce((sum, item) => sum + item.jumlah, 0);

  const totalPengeluaran = filteredLaporan
    .filter(item => item.kategori === 'pengeluaran')
    .reduce((sum, item) => sum + item.jumlah, 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Laporan Keuangan
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Pantau pemasukan dan pengeluaran kos Anda
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`${isDark ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-500 to-green-600'} rounded-lg shadow-sm p-6 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Total Pemasukan</span>
              <svg className="w-8 h-8 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <p className="text-3xl font-bold">
              Rp {totalPemasukan.toLocaleString('id-ID')}
            </p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-gradient-to-br from-red-500 to-red-600'} rounded-lg shadow-sm p-6 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
              <svg className="w-8 h-8 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <p className="text-3xl font-bold">
              Rp {totalPengeluaran.toLocaleString('id-ID')}
            </p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-lg shadow-sm p-6 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Saldo Akhir</span>
              <svg className="w-8 h-8 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">
              Rp {saldoAkhir.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter Kategori */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Kategori
              </label>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Semua Kategori</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>

            {/* Filter Bulan */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Bulan
              </label>
              <input
                type="month"
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              {(filterKategori || filterBulan) && (
                <button
                  onClick={() => {
                    setFilterKategori('');
                    setFilterBulan('');
                  }}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                    Tanggal
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                    Kategori
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                    Jenis
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                    Keterangan
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredLaporan.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-4xl mb-2">💰</div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tidak ada data laporan
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLaporan.map(item => (
                    <tr key={item.id} className={`${isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.kategori === 'pemasukan'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.kategori === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.jenis}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.deskripsi}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            {item.kosNama} {item.kamarNama && `- ${item.kamarNama}`}
                          </p>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${
                        item.kategori === 'pemasukan'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {item.kategori === 'pemasukan' ? '+' : '-'} Rp {item.jumlah.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanKeuangan;

import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { kosService } from "../../services";
import "../../styles/dashboard/index.css";

interface DashboardStats {
  totalKos: number;
  totalKamar: number;
  kamarTerisi: number;
  kamarKosong: number;
  totalPenghuni: number;
  pembayaranPending: number;
  pembayaranLunas: number;
  pendapatanBulanIni: number;
}

export default function Dashboard() {
  const { effectiveTheme, kosList: localKosList } = useApp();
  const isDark = effectiveTheme === 'dark';
  
  const [stats, setStats] = useState<DashboardStats>({
    totalKos: 0,
    totalKamar: 0,
    kamarTerisi: 0,
    kamarKosong: 0,
    totalPenghuni: 0,
    pembayaranPending: 0,
    pembayaranLunas: 0,
    pendapatanBulanIni: 0,
  });
  const [kosList, setKosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if API mode is enabled
  const USE_API = process.env.REACT_APP_USE_API === 'true';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    if (!USE_API) {
      // Use localStorage data (existing behavior)
      calculateStatsFromLocalData();
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const data = await kosService.getKosList();
      setKosList(data);
      
      // Calculate stats from API data
      calculateStatsFromAPIData(data);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }

  function calculateStatsFromLocalData() {
    const totalKos = localKosList.length;
    const totalKamar = localKosList.reduce((sum, kos) => sum + kos.jumlahKamar, 0);
    const kamarTerisi = localKosList.reduce((sum, kos) => sum + kos.kamarTerisi, 0);
    const kamarKosong = totalKamar - kamarTerisi;
    
    // Count total penghuni
    let totalPenghuni = 0;
    localKosList.forEach(kos => {
      kos.kamarList?.forEach((kamar: any) => {
        if (kamar.penghuni && kamar.penghuni.length > 0) {
          totalPenghuni += kamar.penghuni.length;
        }
      });
    });

    setStats({
      totalKos,
      totalKamar,
      kamarTerisi,
      kamarKosong,
      totalPenghuni,
      pembayaranPending: 0,
      pembayaranLunas: 0,
      pendapatanBulanIni: 0,
    });
    
    setKosList(localKosList.slice(0, 5)); // Show latest 5 kos
  }

  function calculateStatsFromAPIData(data: any[]) {
    const totalKos = data.length;
    const totalKamar = data.reduce((sum, kos) => sum + (kos.kamarList?.length || 0), 0);
    const kamarTerisi = data.reduce((sum, kos) => {
      return sum + (kos.kamarList?.filter((k: any) => k.status === 'terisi').length || 0);
    }, 0);
    const kamarKosong = totalKamar - kamarTerisi;
    
    // Count total penghuni
    let totalPenghuni = 0;
    data.forEach(kos => {
      kos.kamarList?.forEach((kamar: any) => {
        if (kamar.penghuniList && kamar.penghuniList.length > 0) {
          totalPenghuni += kamar.penghuniList.length;
        }
      });
    });

    // Count payments
    let pembayaranPending = 0;
    let pembayaranLunas = 0;
    let pendapatanBulanIni = 0;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    data.forEach(kos => {
      kos.kamarList?.forEach((kamar: any) => {
        kamar.payments?.forEach((payment: any) => {
          if (payment.status === 'belum_bayar') {
            pembayaranPending++;
          } else if (payment.status === 'sudah_bayar') {
            pembayaranLunas++;
            
            // Sum pendapatan for current month
            const paymentDate = new Date(payment.tanggalBayar || payment.createdAt);
            if (paymentDate.getMonth() + 1 === currentMonth && 
                paymentDate.getFullYear() === currentYear) {
              pendapatanBulanIni += payment.jumlah || 0;
            }
          }
        });
      });
    });

    setStats({
      totalKos,
      totalKamar,
      kamarTerisi,
      kamarKosong,
      totalPenghuni,
      pembayaranPending,
      pembayaranLunas,
      pendapatanBulanIni,
    });
  }

  function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 mx-auto text-watt-blue" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Memuat data dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-watt-blue text-white rounded-lg hover:bg-watt-blue-dark transition">
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Ringkasan data kos dan laporan keuangan Anda
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Kos */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Kos</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalKos}
                </p>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
          </div>

          {/* Total Kamar */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Kamar</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalKamar}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  {stats.kamarTerisi} terisi · {stats.kamarKosong} kosong
                </p>
              </div>
              <div className="text-4xl">🚪</div>
            </div>
          </div>

          {/* Total Penghuni */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Penghuni</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalPenghuni}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          {/* Pembayaran */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Pembayaran</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.pembayaranLunas + stats.pembayaranPending}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  <span className="text-green-500">{stats.pembayaranLunas} lunas</span> · 
                  <span className="text-orange-500"> {stats.pembayaranPending} pending</span>
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Pendapatan Bulan Ini */}
        {USE_API && stats.pendapatanBulanIni > 0 && (
          <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'} rounded-lg shadow-sm border p-6 mb-8`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'} mb-1`}>
                  Pendapatan Bulan Ini
                </p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
                  {formatRupiah(stats.pendapatanBulanIni)}
                </p>
              </div>
              <div className="text-5xl">📈</div>
            </div>
          </div>
        )}

        {/* Daftar Kos Terbaru */}
        {kosList.length > 0 && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Properti Kos Anda
            </h2>
            <div className="space-y-4">
              {kosList.slice(0, 5).map((kos) => (
                <div 
                  key={kos.id} 
                  className={`${isDark ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-4 transition-colors cursor-pointer`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                        {kos.nama}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        {kos.alamat}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          🚪 {kos.kamarList?.length || 0} kamar
                        </span>
                        <span className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          ✅ {kos.kamarList?.filter((k: any) => k.status === 'terisi').length || 0} terisi
                        </span>
                        {kos.hargaMin > 0 && (
                          <span className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            💰 {formatRupiah(kos.hargaMin)}/bulan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {kosList.length === 0 && (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-12`}>
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Belum Ada Kos Terdaftar
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto mb-6`}>
                Mulai tambahkan properti kos Anda untuk mengelola kamar, penghuni, dan keuangan.
              </p>
              <button className="px-6 py-3 bg-watt-blue hover:bg-watt-blue-600 text-white rounded-lg font-semibold transition-colors">
                Tambah Kos Pertama
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

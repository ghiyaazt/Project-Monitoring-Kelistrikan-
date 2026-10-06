import { useApp } from "../../context/AppContext";
import "../../styles/dashboard/index.css";

export default function Dashboard() {
  const { effectiveTheme } = useApp();
  const isDark = effectiveTheme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Selamat datang di WattWise - Smart Energy Monitoring
          </p>
        </div>

        {/* Content Placeholder */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-12`}>
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Dashboard Sedang Dikembangkan
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              Halaman dashboard akan menampilkan ringkasan data kos, penghuni, dan laporan keuangan Anda.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg shadow-sm border p-6 cursor-pointer transition-colors`}>
            <div className="text-3xl mb-3">🏠</div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              Daftar Kos
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Kelola properti kos Anda
            </p>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg shadow-sm border p-6 cursor-pointer transition-colors`}>
            <div className="text-3xl mb-3">👥</div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              Penghuni
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Data penghuni kos
            </p>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg shadow-sm border p-6 cursor-pointer transition-colors`}>
            <div className="text-3xl mb-3">💰</div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              Laporan Keuangan
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Ringkasan keuangan
            </p>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg shadow-sm border p-6 cursor-pointer transition-colors`}>
            <div className="text-3xl mb-3">⚡</div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              Wattwise +
            </h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitoring IoT & Smart Control
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

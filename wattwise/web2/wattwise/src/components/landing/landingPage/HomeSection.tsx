interface HomeSectionProps {
  onNavigateToLogin: () => void;
}

export default function HomeSection({ onNavigateToLogin }: HomeSectionProps) {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-1.5 bg-watt-blue-500/10 border border-watt-blue-500/20 rounded-full text-watt-blue-600 dark:text-watt-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                ⚡ Wattwise IoT Monitoring Terintegrasi
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                Kelola Kos Anda dengan Lebih{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-watt-blue-500 to-watt-blue-500">
                  Cerdas dan Efisien
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Platform manajemen kos lengkap — dari daftar kamar, lacak pembayaran, hingga monitor pemakaian listrik setiap unit secara real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={onNavigateToLogin}
                  className="px-8 py-4 bg-watt-blue-500 hover:bg-watt-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Masuk ke Dashboard →
                </button>
              </div>

              <div className="flex items-center gap-8 text-sm">
                <div>
                  <div className="text-2xl font-bold text-watt-blue-500">2.400+</div>
                  <div className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Kos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-watt-blue-500">18.000+</div>
                  <div className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Kamar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-watt-blue-500">Hemat 30%</div>
                  <div className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Penghematan Listrik</div>
                </div>
              </div>
            </div>

            {/* Right Content - Monitoring Card */}
            <div className="relative">
              <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">wattwise</div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                      1.284<span className="text-lg text-slate-500 dark:text-slate-400 ml-2">kWh bulan ini</span>
                    </div>
                    <div className="text-sm text-watt-blue-500 dark:text-watt-blue-400 font-semibold">+12% vs lalu</div>
                  </div>
                  <div className="px-3 py-1.5 bg-watt-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                </div>

                {/* Chart */}
                <div className="flex items-end justify-between gap-2 h-32 mb-6">
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '45%' }}></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '60%' }}></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '55%' }}></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '70%' }}></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '50%' }}></div>
                  <div className="w-full bg-watt-blue-500 rounded-t-lg shadow-lg shadow-watt-blue-500/50" style={{ height: '90%' }}></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '65%' }}></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-t-lg" style={{ height: '75%' }}></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-700/30 rounded-lg p-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Kamar Aktif</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">42</div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700/30 rounded-lg p-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Biaya Bulanan</div>
                    <div className="text-2xl font-bold text-watt-blue-500 dark:text-watt-blue-400">Rp 1,6jt</div>
                  </div>
                </div>

                {/* Notification */}
                <div className="mt-4 bg-watt-blue-50 dark:bg-watt-blue-500/10 border border-watt-blue-200 dark:border-watt-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                  <div className="w-8 h-8 bg-watt-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-watt-blue-700 dark:text-watt-blue-400">Pembayaran lunas</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Kamar A-12 · baru saja</div>
                  </div>
                </div>
              </div>

              {/* Decoration */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-watt-blue-500/20 to-watt-blue-500/20 rounded-2xl -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-watt-blue-50 dark:bg-watt-blue-900/20 text-watt-blue-600 dark:text-watt-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Fitur
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Fitur lengkap untuk memudahkan pengelolaan kos dari mana saja, kapan saja.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-watt-blue-500 dark:hover:border-watt-blue-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-watt-blue-100 dark:bg-watt-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                🏠
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Manajemen Kos Mudah
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kelola semua properti kos Anda dalam satu platform. Tambah, edit, dan pantau setiap unit dengan efisien.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-watt-blue-500 dark:hover:border-watt-blue-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-watt-blue-100 dark:bg-watt-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                💳
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Lacak Pembayaran
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pantau status pembayaran sewa setiap kamar secara real-time. Notifikasi otomatis untuk tagihan yang jatuh tempo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-watt-blue-500 dark:hover:border-watt-blue-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-watt-blue-100 dark:bg-watt-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Monitor Listrik (Wattwise)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pantau pemakaian listrik per kamar secara akurat. Deteksi pemborosan dan hemat biaya operasional kos Anda.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-watt-blue-500 dark:hover:border-watt-blue-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-watt-blue-100 dark:bg-watt-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                ℹ️
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Laporan Lengkap
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Dapatkan laporan komprehensif tentang occupancy, pendapatan, dan konsumsi listrik dalam format yang mudah dipahami.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-watt-blue-50 dark:bg-watt-blue-900/20 text-watt-blue-600 dark:text-watt-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Cara Kerja
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Mulai dalam tiga langkah
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-watt-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                01
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Daftarkan Kos
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Tambahkan properti dan kamar Anda dalam hitungan menit.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-watt-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                02
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Pasang Wattwise
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Hubungkan sensor listrik IoT ke setiap kamar untuk data real-time.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-watt-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                03
              </div>
              <div className="pt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Pantau & Hemat
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Lihat pembayaran, tarikan, dan konsumsi listrik dari satu dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-watt-blue-500 to-watt-blue-500 mb-2">
                2.400+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Kos Terdaftar</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-watt-blue-500 to-watt-blue-500 mb-2">
                18.000+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Kamar Dikelola</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-watt-blue-500 to-watt-blue-500 mb-2">
                1.200+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Pemilik Aktif</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-watt-blue-500 to-watt-blue-500 mb-2">
                30%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Penghematan Listrik</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-watt-blue-500 to-watt-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Siap Mulai Mengelola Kos dengan Lebih Efisien?
          </h2>
          <p className="text-xl text-watt-blue-50 mb-8 max-w-2xl mx-auto">
            Masuk untuk mengakses dashboard dan mulai kelola kos Anda.
          </p>
          <button 
            onClick={onNavigateToLogin}
            className="px-10 py-4 bg-white hover:bg-slate-50 text-watt-blue-600 font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            Masuk Sekarang
          </button>
        </div>
      </div>
    </>
  );
}

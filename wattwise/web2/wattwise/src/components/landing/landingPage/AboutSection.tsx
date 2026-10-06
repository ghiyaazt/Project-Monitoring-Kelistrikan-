export default function AboutSection() {
  return (
    <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-watt-blue-50 to-watt-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-12 mb-16 border border-watt-blue-100 dark:border-slate-700">
          <div className="inline-block px-4 py-1.5 bg-watt-blue/10 border border-emerald-500/20 rounded-full text-watt-blue dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            Cerita Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-watt-blue-500 to-watt-blue-light">WattWise</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Kami hadir untuk menyederhanakan pengelolaan kos di seluruh Indonesia. Didirikan pada 2023, WattWise menggabungkan teknologi IoT dengan platform manajemen properti modern.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-watt-blue mb-2">2023</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Didirikan</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-watt-blue mb-2">2.400+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Kos Terdaftar</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-watt-blue mb-2">18.000+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Kamar</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-3xl md:text-4xl font-bold text-watt-blue mb-2">30%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Hemat Listrik</div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-watt-blue dark:text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            Fondasi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">
            Yang kami yakini
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Misi Kami</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Memberdayakan pemilik kos di Indonesia dengan teknologi yang mudah digunakan, sehingga mereka bisa fokus mengembangkan bisnis tanpa pusing urusan administrasi.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Visi Kami</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Menjadi platform manajemen kos terpercaya nomor satu di Asia Tenggara, dengan ekosistem yang menghubungkan pemilik, kos, penghuni, dan penyedia layanan.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-2xl mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Nilai Kami</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Transparansi, inovasi, dan kepercayaan. Kami membangun produk benar—benar membantu dan memberikan nilai nyata — bukan sekadar menuruti trend pasar.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-watt-blue dark:text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            Tim
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tim Kami
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
            Orang-orang di balik WattWise
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-6xl">
                👨‍💼
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Rina Wulandari</h3>
                <p className="text-sm text-watt-blue dark:text-emerald-400 font-semibold uppercase tracking-wide mb-3">
                  CEO & CO-FOUNDER
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Visioner di balik platform WattWise dengan pengalaman 10+ tahun di industri properti.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center text-6xl">
                👨‍💻
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Hendra Kusuma</h3>
                <p className="text-sm text-watt-blue dark:text-emerald-400 font-semibold uppercase tracking-wide mb-3">
                  CTO & CO-FOUNDER
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Arsitek teknologi IoT dan platform yang membuat WattWise berjalan mulus.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center text-6xl">
                👩‍💼
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Dewi Anggraini</h3>
                <p className="text-sm text-watt-blue dark:text-emerald-400 font-semibold uppercase tracking-wide mb-3">
                  HEAD OF PRODUCT
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Memastikan setiap fitur WattWise dirancang dengan user experience terbaik.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-watt-blue-50 to-watt-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-12 border border-watt-blue-100 dark:border-slate-700">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-watt-blue/10 border border-emerald-500/20 rounded-full text-watt-blue dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
                Kontak
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Hubungi Kami</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Ada pertanyaan? Tim kami siap membantu Anda.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/10">
                <div className="text-watt-blue dark:text-emerald-400 font-semibold text-sm w-24 flex-shrink-0">EMAIL</div>
                <div className="text-slate-900 dark:text-white">hello@wattwise.id</div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/10">
                <div className="text-watt-blue dark:text-emerald-400 font-semibold text-sm w-24 flex-shrink-0">TELEPON</div>
                <div className="text-slate-900 dark:text-white">+62 812-3456-7890</div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/10">
                <div className="text-watt-blue dark:text-emerald-400 font-semibold text-sm w-24 flex-shrink-0">ALAMAT</div>
                <div className="text-slate-900 dark:text-white">Jl. Asia Afrika No. 8, Bandung 40111</div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-white/10">
                <div className="text-watt-blue dark:text-emerald-400 font-semibold text-sm w-24 flex-shrink-0">JAM KERJA</div>
                <div className="text-slate-900 dark:text-white">Senin—Jumat, 08.00—17.00 WIB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

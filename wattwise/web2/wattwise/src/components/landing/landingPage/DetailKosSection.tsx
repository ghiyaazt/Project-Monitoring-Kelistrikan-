import { useApp } from "../../../context/AppContext";

interface DetailKosSectionProps {
  kosId: string;
  onBack: () => void;
  onNavigateToLogin: () => void;
}

export default function DetailKosSection({ kosId, onBack, onNavigateToLogin }: DetailKosSectionProps) {
  const { kosList } = useApp();
  
  const kos = kosList.find(k => k.id === kosId);

  if (!kos) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Kos tidak ditemukan
          </h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-watt-blue-500 hover:bg-watt-blue-600 text-white font-semibold rounded-lg transition-colors">
            Kembali ke Daftar Kos
          </button>
        </div>
      </div>
    );
  }

  const kamarKos = kos.kamarList || [];
  const kamarTersedia = kos.jumlahKamar - kos.kamarTerisi;
  const profileImage = kos.gambar && kos.gambar.length > 0 ? kos.gambar[kos.gambarProfil || 0] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Kos
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Header Image */}
          {profileImage ? (
            <div className="relative h-96 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
              <img 
                src={profileImage} 
                alt={kos.nama}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{kos.nama}</h1>
                <p className="text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {kos.alamat}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-gradient-to-br from-watt-blue to-watt-blue-1000 dark:from-emerald-700 dark:to-teal-700 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-8xl mb-4">🏠</div>
                <h1 className="text-4xl font-bold mb-2">{kos.nama}</h1>
                <p className="text-lg flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {kos.alamat}
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-watt-blue-50 to-watt-blue-100 dark:from-watt-blue/20 dark:to-watt-blue/20 p-6 rounded-xl border border-watt-blue-200 dark:border-watt-blue-700">
                <div className="text-watt-blue dark:text-watt-blue-light mb-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {kos.jumlahKamar}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Kamar</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700/50">
                <div className="text-blue-600 dark:text-blue-400 mb-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {kamarTersedia}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Kamar Tersedia</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700/50">
                <div className="text-purple-600 dark:text-purple-400 mb-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Rp {kos.hargaMin.toLocaleString('id-ID')}
                  {kos.hargaMax > kos.hargaMin && (
                    <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                      {' '}- {kos.hargaMax.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Harga per Bulan</div>
              </div>
            </div>

            {/* Fasilitas */}
            {kos.fasilitas && kos.fasilitas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Fasilitas</h2>
                <div className="flex flex-wrap gap-3">
                  {kos.fasilitas.map((fasilitas, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      {fasilitas}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {kos.gambar && kos.gambar.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Galeri Foto</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {kos.gambar.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img 
                        src={img} 
                        alt={`${kos.nama} - ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {idx === (kos.gambarProfil || 0) && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-watt-blue-500 text-white text-xs font-semibold rounded-full">
                          Foto Profil
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daftar Kamar */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Daftar Kamar</h2>
              
              {kamarKos.length === 0 ? (
                <div className="text-center py-12 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                  <div className="text-4xl mb-3">🚪</div>
                  <p className="text-slate-600 dark:text-slate-400">Belum ada kamar yang terdaftar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kamarKos.map(kamar => (
                    <div
                      key={kamar.id}
                      className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {kamar.nama}
                        </h3>
                        {kamar.status === 'kosong' ? (
                          <span className="px-2 py-1 bg-watt-green-100 dark:bg-watt-green/20 text-watt-blue dark:text-watt-blue-light text-xs font-semibold rounded-full">
                            Tersedia
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                            Terisi
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-watt-blue dark:text-watt-blue-light mb-2">
                        Rp {kamar.hargaSewa.toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-slate-500">/bulan</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Luas: {kamar.luasKamar} m² • Max: {kamar.maxPenghuni} orang
                      </div>
                      {kamar.fasilitas && kamar.fasilitas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {kamar.fasilitas.slice(0, 2).map((fas, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded">
                              {fas}
                            </span>
                          ))}
                          {kamar.fasilitas.length > 2 && (
                            <span className="text-xs px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded">
                              +{kamar.fasilitas.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-watt-blue-50 to-watt-blue-100 dark:from-watt-blue/20 dark:to-watt-blue/20 rounded-2xl p-8 text-center border border-watt-blue-200 dark:border-watt-blue-700">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Tertarik dengan kos ini?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                Login untuk melihat informasi lebih detail, mengelola kos, dan monitoring konsumsi listrik real-time dengan WattWise
              </p>
              <button
                onClick={onNavigateToLogin}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-watt-blue to-watt-blue-1000 hover:from-watt-blue-600 hover:to-watt-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                Masuk Sekarang
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

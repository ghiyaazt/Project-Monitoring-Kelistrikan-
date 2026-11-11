import { useState } from "react";
import { useApp } from "../../../context/AppContext";

interface DaftarKosSectionProps {
  onKosClick?: (kosId: string) => void;
}

export default function DaftarKosSection({ onKosClick }: DaftarKosSectionProps) {
  const { kosList } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Filter kos based on search and availability
  const filteredKosList = kosList.filter(kos => {
    const matchesSearch = !searchQuery || 
      kos.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kos.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    
    const kamarTersedia = kos.jumlahKamar - kos.kamarTerisi;
    const matchesAvailable = !showOnlyAvailable || kamarTersedia > 0;
    
    return matchesSearch && matchesAvailable;
  });

  return (
    <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-watt-blue-50 to-watt-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-12 mb-12 border border-watt-blue-100 dark:border-slate-700">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Daftar Kos Tersedia
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
            Temukan kos pilihan Anda di berbagai lokasi strategis.
          </p>

          {/* Search */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center gap-4 p-4 max-w-3xl border border-slate-200 dark:border-slate-700">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kos atau lokasi..."
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <button 
              onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                showOnlyAvailable
                  ? 'bg-watt-blue-500 text-white hover:bg-watt-blue-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}>
              Hanya yang tersedia
            </button>
            <div className="px-6 py-2 bg-watt-blue-500 text-white font-semibold rounded-lg">
              {filteredKosList.length} KOS
            </div>
          </div>
        </div>

        {/* Kos List */}
        {filteredKosList.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Tidak ada kos ditemukan
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? 'Coba ubah kriteria pencarian Anda' : 'Belum ada kos yang terdaftar'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredKosList.map((kos) => {
              const kamarTersedia = kos.jumlahKamar - kos.kamarTerisi;
              const profileImage = kos.gambar && kos.gambar.length > 0 
                ? kos.gambar[kos.gambarProfil || 0] 
                : null;

              return (
                <div
                  key={kos.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={kos.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-6xl">
                        🏠
                      </div>
                    )}
                    {/* Badge */}
                    {kamarTersedia > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-watt-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        {kamarTersedia} Kamar Kosong
                      </div>
                    )}
                    {kamarTersedia === 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        Penuh
                      </div>
                    )}
                    {kos.gambar && kos.gambar.length > 1 && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {kos.gambar.length}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    {/* Title & Price */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">
                          {kos.nama}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {kos.alamat}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                          Mulai dari
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          Rp {kos.hargaMin.toLocaleString('id-ID')}
                          {kos.hargaMax > kos.hargaMin && (
                            <span className="text-sm text-slate-500 font-normal">
                              {' '}- {kos.hargaMax.toLocaleString('id-ID')}
                            </span>
                          )}
                          <span className="text-sm text-slate-500 font-normal">/bln</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 py-4 border-y border-slate-200 dark:border-slate-700 mb-4">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total {kos.jumlahKamar} kamar</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{kos.kamarTerisi} Terisi</div>
                      </div>
                      {kamarTersedia > 0 ? (
                        <div className="px-3 py-1.5 bg-watt-blue-50 dark:bg-watt-blue-900/20 text-watt-blue-600 dark:text-watt-blue-400 rounded-lg text-xs font-semibold">
                          Tersedia {kamarTersedia}
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold">
                          Penuh
                        </div>
                      )}
                    </div>

                    {/* Facilities */}
                    {kos.fasilitas && kos.fasilitas.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {kos.fasilitas.slice(0, 3).map((fasilitas, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {fasilitas}
                            </span>
                          ))}
                          {kos.fasilitas.length > 3 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-watt-blue-100 dark:bg-watt-blue-900/30 text-watt-blue-600 dark:text-watt-blue-300">
                              +{kos.fasilitas.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <button 
                      onClick={() => onKosClick && onKosClick(kos.id)}
                      className="w-full px-6 py-3 bg-watt-blue-500 hover:bg-watt-blue-600 text-white font-semibold rounded-lg transition-all group-hover:shadow-lg flex items-center justify-center gap-2">
                      Lihat Detail
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Ingin mengelola kos Anda dengan WattWise? Hubungi admin untuk informasi lebih lanjut.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-watt-blue-500 to-watt-blue-500 hover:from-watt-blue-600 hover:to-watt-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
            Hubungi Kami
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

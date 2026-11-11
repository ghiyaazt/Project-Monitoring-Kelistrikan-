interface Kos {
  id: string;
  nama: string;
  alamat: string;
  jumlahKamar: number;
  kamarTerisi: number;
  hargaMin: number;
  hargaMax: number;
  fasilitas: string[];
  gambar?: string[];
  gambarProfil?: number;
}

interface KosCardProps {
  kos: Kos;
  isDark: boolean;
  onClick: (kosId: string) => void;
}

export default function KosCard({ kos, isDark, onClick }: KosCardProps) {
  const getOccupancyPercentage = (kos: Kos) => {
    return Math.round((kos.kamarTerisi / kos.jumlahKamar) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const occupancyPercentage = getOccupancyPercentage(kos);

  return (
    <div
      onClick={() => onClick(kos.id)}
      className={`${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md overflow-hidden`}
    >
      {/* Gambar Kos */}
      {kos.gambar && kos.gambar.length > 0 ? (
        <div className="relative h-48 w-full">
          <img 
            src={kos.gambar[kos.gambarProfil || 0]} 
            alt={kos.nama}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Image counter badge */}
          {kos.gambar.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {kos.gambar.length}
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-1">{kos.nama}</h3>
            <p className="text-sm flex items-start text-white/90">
              <span className="mr-2">📍</span>
              <span>{kos.alamat}</span>
            </p>
          </div>
        </div>
      ) : (
        /* Kos Header - Fallback jika tidak ada gambar */
        <div className={`${isDark ? 'bg-gradient-to-br from-watt-blue-900 to-watt-blue-900' : 'bg-gradient-to-br from-watt-blue to-watt-blue-light'} text-white p-6`}>
          <h3 className="text-xl font-bold mb-2">{kos.nama}</h3>
          <p className={`text-sm flex items-start ${isDark ? 'text-watt-blue-100' : 'text-watt-blue-50'}`}>
            <span className="mr-2">📍</span>
            <span>{kos.alamat}</span>
          </p>
        </div>
      )}

      {/* Kos Content */}
      <div className="p-6">
        {/* Occupancy */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Tingkat Hunian
            </span>
            <span className={`text-sm font-bold ${getOccupancyColor(occupancyPercentage)}`}>
              {occupancyPercentage}%
            </span>
          </div>
          <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div
              className={`h-2 rounded-full transition-all ${
                occupancyPercentage >= 80 
                  ? 'bg-green-500' 
                  : occupancyPercentage >= 50 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mt-1`}>
            {kos.kamarTerisi} dari {kos.jumlahKamar} kamar terisi
          </p>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-1`}>
            Harga Sewa
          </p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Rp {kos.hargaMin.toLocaleString('id-ID')}
            {kos.hargaMax > kos.hargaMin && (
              <span className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {' '}- Rp {kos.hargaMax.toLocaleString('id-ID')}
              </span>
            )}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            per bulan
          </p>
        </div>

        {/* Facilities */}
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
            Fasilitas
          </p>
          <div className="flex flex-wrap gap-2">
            {kos.fasilitas.slice(0, 3).map(fasilitas => (
              <span
                key={fasilitas}
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isDark 
                    ? 'bg-slate-700 text-slate-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {fasilitas}
              </span>
            ))}
            {kos.fasilitas.length > 3 && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isDark 
                    ? 'bg-watt-blue-900 text-watt-blue-light' 
                    : 'bg-watt-blue-100 text-watt-blue'
                }`}
              >
                +{kos.fasilitas.length - 3} lainnya
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border-t px-6 py-3`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Klik untuk detail
          </span>
          <svg
            className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

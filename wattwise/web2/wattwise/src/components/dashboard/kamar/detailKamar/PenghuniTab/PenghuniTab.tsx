import React from 'react';
import { Penghuni } from '../../../../../types/dashboard/kamar/detailKamar';

interface PenghuniTabProps {
  isDark: boolean;
  penghuniList: Penghuni[];
  maxPenghuni: number;
  onAddPenghuni: () => void;
  onRemovePenghuni: (id: string) => void;
}

const PenghuniTab: React.FC<PenghuniTabProps> = ({
  isDark,
  penghuniList,
  maxPenghuni,
  onAddPenghuni,
  onRemovePenghuni
}) => {
  return (
    <div className="space-y-6">
      {/* Info Card - Kapasitas */}
      <div className={`${isDark ? 'bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border-teal-700' : 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200'} rounded-lg border p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-teal-300' : 'text-teal-900'}`}>
              Kapasitas Kamar
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>
              {penghuniList.length} / {maxPenghuni} Penghuni
            </p>
          </div>
          {penghuniList.length < maxPenghuni && (
            <button
              onClick={onAddPenghuni}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Penghuni
            </button>
          )}
        </div>
      </div>

      {/* List Penghuni */}
      {penghuniList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {penghuniList.map((p, index) => (
            <div key={p.id} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {p.nama.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {p.nama}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      Penghuni #{index + 1}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemovePenghuni(p.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Keluarkan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
                    Email
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {p.email}
                  </p>
                </div>

                <div>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
                    Telepon
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {p.telepon}
                  </p>
                </div>

                <div>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
                    Tanggal Masuk
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(p.tanggalMasuk).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-12 text-center`}>
          <div className="text-6xl mb-4">👤</div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Kamar Masih Kosong
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Undang penghuni baru untuk mengisi kamar ini
          </p>
          <button
            onClick={onAddPenghuni}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Undang Penghuni
          </button>
        </div>
      )}
    </div>
  );
};

export default PenghuniTab;

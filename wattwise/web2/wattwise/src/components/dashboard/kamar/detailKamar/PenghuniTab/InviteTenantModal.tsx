import React from 'react';

interface User {
  nama: string;
  email: string;
}

interface InviteTenantModalProps {
  show: boolean;
  isDark: boolean;
  searchEmail: string;
  searchResults: User[];
  selectedUser: User | null;
  isSearching: boolean;
  tanggalMasukPenghuni: string;
  onClose: () => void;
  onSearchEmail: (email: string) => void;
  onSelectUser: (user: User) => void;
  onInvite: () => void;
  onTanggalChange: (tanggal: string) => void;
}

export default function InviteTenantModal({
  show,
  isDark,
  searchEmail,
  searchResults,
  selectedUser,
  isSearching,
  tanggalMasukPenghuni,
  onClose,
  onSearchEmail,
  onSelectUser,
  onInvite,
  onTanggalChange
}: InviteTenantModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full`}>
        <div className={`${isDark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Undang Penghuni
          </h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none`}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Cari Pengguna (Email atau Nama)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => onSearchEmail(e.target.value)}
                placeholder="Ketik minimal 3 karakter untuk mencari..."
                className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
            
            {searchEmail.length > 0 && searchEmail.length < 3 && (
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Ketik {3 - searchEmail.length} karakter lagi...
              </p>
            )}
          </div>

          {isSearching && (
            <div className={`mb-4 p-4 border rounded-lg ${isDark ? 'bg-teal-900/10 border-teal-800' : 'bg-teal-50 border-teal-200'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-teal-200 dark:border-teal-800 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent border-t-teal-600 rounded-full animate-spin"></div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                    🔍 Mencari pengguna terdaftar...
                  </p>
                  <div className="flex gap-1 mt-1">
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isSearching && searchEmail.length >= 3 && searchResults.length === 0 && (
            <div className={`mb-4 p-4 border rounded-lg text-center ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <svg className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tidak ada pengguna ditemukan
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Coba kata kunci lain
              </p>
            </div>
          )}

          {searchResults.length > 0 && !selectedUser && (
            <div className="mb-4">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Hasil Pencarian ({searchResults.length})
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectUser(user)}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-teal-500' 
                        : 'bg-white border-gray-200 hover:bg-teal-50 hover:border-teal-500'
                    }`}
                  >
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.nama}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedUser && (
            <div className={`mb-4 p-4 border-2 rounded-lg ${isDark ? 'bg-teal-900/10 border-teal-600' : 'bg-teal-50 border-teal-500'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Pengguna Dipilih:</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedUser.nama}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedUser.email}</p>
                </div>
                <button
                  onClick={onClose}
                  className={`text-sm ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'} font-medium`}
                >
                  Ganti
                </button>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Tanggal Masuk
                </label>
                <input
                  type="date"
                  value={tanggalMasukPenghuni}
                  onChange={(e) => onTanggalChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`${isDark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t px-6 py-4 flex gap-3`}>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
          >
            Batal
          </button>
          <button
            onClick={onInvite}
            disabled={!selectedUser || !tanggalMasukPenghuni}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedUser && tanggalMasukPenghuni
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Undang
          </button>
        </div>
      </div>
    </div>
  );
}

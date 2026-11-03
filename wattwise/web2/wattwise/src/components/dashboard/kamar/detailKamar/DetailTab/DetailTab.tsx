import React from 'react';
import { Kamar } from '../../../../../types/dashboard/kamar/detailKamar';

interface DetailTabProps {
  isDark: boolean;
  kamar: Kamar;
  isEditMode: boolean;
  editFormKamar: Kamar;
  setEditFormKamar: (kamar: Kamar) => void;
  newFasilitas: string;
  setNewFasilitas: (value: string) => void;
  editKamarImages: string[];
  editKamarProfileIndex: number;
  handleStartEdit: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDeleteKamar: () => void;
  handleAddFasilitas: () => void;
  handleRemoveFasilitas: (fasilitas: string) => void;
  handleEditKamarImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveEditKamarImage: (index: number) => void;
  handleSetEditKamarProfileImage: (index: number) => void;
}

const DetailTab: React.FC<DetailTabProps> = ({
  isDark,
  kamar,
  isEditMode,
  editFormKamar,
  setEditFormKamar,
  newFasilitas,
  setNewFasilitas,
  editKamarImages,
  editKamarProfileIndex,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteKamar,
  handleAddFasilitas,
  handleRemoveFasilitas,
  handleEditKamarImageUpload,
  handleRemoveEditKamarImage,
  handleSetEditKamarProfileImage,
}) => {
  return (
    <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Informasi Kamar
        </h2>
        {!isEditMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleDeleteKamar}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              className={`px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
            >
              Batal
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Simpan
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
            Nama Kamar
          </p>
          {!isEditMode ? (
            <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {kamar.nama}
            </p>
          ) : (
            <input
              type="text"
              value={editFormKamar.nama}
              onChange={(e) => setEditFormKamar({ ...editFormKamar, nama: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
          )}
        </div>

        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
            Status
          </p>
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
            kamar.status === 'terisi'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200'
          }`}>
            {kamar.status === 'terisi' ? 'Terisi' : 'Kosong'}
          </span>
        </div>

        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
            Harga Sewa
          </p>
          {!isEditMode ? (
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Rp {kamar.hargaSewa.toLocaleString('id-ID')}
              <span className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-600'}`}> / bulan</span>
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Rp</span>
              <input
                type="number"
                value={editFormKamar.hargaSewa}
                onChange={(e) => setEditFormKamar({ ...editFormKamar, hargaSewa: parseInt(e.target.value) || 0 })}
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>/ bulan</span>
            </div>
          )}
        </div>

        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
            Luas Kamar
          </p>
          {!isEditMode ? (
            <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {kamar.luasKamar} m²
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editFormKamar.luasKamar}
                onChange={(e) => setEditFormKamar({ ...editFormKamar, luasKamar: parseInt(e.target.value) || 0 })}
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>m²</span>
            </div>
          )}
        </div>

        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>
            Maksimal Penghuni
          </p>
          {!isEditMode ? (
            <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {kamar.maxPenghuni} orang
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editFormKamar.maxPenghuni === 0 ? '' : editFormKamar.maxPenghuni}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                  setEditFormKamar({ ...editFormKamar, maxPenghuni: val >= 0 ? val : 0 });
                }}
                onBlur={(e) => {
                  // Auto set to 1 if empty on blur
                  if (editFormKamar.maxPenghuni === 0 || e.target.value === '') {
                    setEditFormKamar({ ...editFormKamar, maxPenghuni: 1 });
                  }
                }}
                min="1"
                placeholder="1"
                className={`flex-1 px-3 py-2 border rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>orang</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
          Fasilitas
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(isEditMode ? editFormKamar.fasilitas : kamar.fasilitas).map(fasilitas => (
            <span
              key={fasilitas}
              className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2 ${
                isDark 
                  ? 'bg-teal-900 text-teal-200' 
                  : 'bg-teal-100 text-teal-800'
              }`}
            >
              {fasilitas}
              {isEditMode && (
                <button
                  onClick={() => handleRemoveFasilitas(fasilitas)}
                  className={`${isDark ? 'hover:text-red-400' : 'hover:text-red-600'} transition-colors`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newFasilitas}
              onChange={(e) => setNewFasilitas(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFasilitas();
                }
              }}
              placeholder="Tambah fasilitas baru..."
              className={`flex-1 px-3 py-2 border rounded-lg ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
            />
            <button
              onClick={handleAddFasilitas}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Tambah
            </button>
          </div>
        )}
      </div>

      {/* Photo Gallery Section */}
      <div className="mt-6">
        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-3`}>
          Foto Kamar
          {!isEditMode && kamar.gambar && kamar.gambar.length > 0 && (
            <span className={`ml-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              ({kamar.gambar.length} foto)
            </span>
          )}
        </p>
        
        {!isEditMode ? (
          // View mode - display photos
          kamar.gambar && kamar.gambar.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {kamar.gambar.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {index === (kamar.gambarProfil || 0) && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded-full shadow-lg">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Profil
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex items-center justify-center p-8 border-2 border-dashed rounded-lg ${
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Belum ada foto
              </p>
            </div>
          )
        ) : (
          // Edit mode - upload and manage photos
          <div className="space-y-4">
            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-300 bg-gray-50'
            }`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleEditKamarImageUpload}
                className="hidden"
                id="edit-kamar-image-upload"
              />
              <label htmlFor="edit-kamar-image-upload" className="cursor-pointer">
                <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Klik untuk upload foto
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  Pilih beberapa foto sekaligus (Max 5MB per file)
                </p>
              </label>
            </div>

            {/* Preview Grid */}
            {editKamarImages.length > 0 && (
              <div>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Preview ({editKamarImages.length} foto) - Klik bintang untuk pilih foto profil
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {editKamarImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`relative aspect-square group ${
                        index === editKamarProfileIndex ? 'ring-4 ring-teal-500' : ''
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* Profile Badge */}
                      {index === editKamarProfileIndex && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded-full shadow-lg">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Profil
                          </span>
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {/* Set as Profile */}
                        {index !== editKamarProfileIndex && (
                          <button
                            onClick={() => handleSetEditKamarProfileImage(index)}
                            className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                            title="Jadikan foto profil"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        )}
                        {/* Delete */}
                        <button
                          onClick={() => handleRemoveEditKamarImage(index)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          title="Hapus foto"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailTab;

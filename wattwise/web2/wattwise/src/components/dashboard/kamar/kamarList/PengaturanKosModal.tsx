import React from 'react';

interface Kos {
  id: string;
  nama: string;
  alamat: string;
  gambar?: string[];
  gambarProfil?: number;
  kamarList: any[];
}

interface FormKos {
  nama: string;
  alamat: string;
  gambar: string[];
}

interface PengaturanKosModalProps {
  show: boolean;
  isDark: boolean;
  selectedKos: Kos | null;
  editFormKos: FormKos;
  setEditFormKos: React.Dispatch<React.SetStateAction<FormKos>>;
  editPreviewImages: string[];
  editProfileImageIndex: number;
  showDeleteConfirm: boolean;
  deleteConfirmText: string;
  setDeleteConfirmText: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetProfileImage: (index: number) => void;
  onOpenDeleteConfirm: () => void;
  onCancelDelete: () => void;
  onDeleteKos: () => void;
  onSave: () => void;
}

const PengaturanKosModal: React.FC<PengaturanKosModalProps> = ({
  show,
  isDark,
  selectedKos,
  editFormKos,
  setEditFormKos,
  editPreviewImages,
  editProfileImageIndex,
  showDeleteConfirm,
  deleteConfirmText,
  setDeleteConfirmText,
  onClose,
  onImageUpload,
  onRemoveImage,
  onSetProfileImage,
  onOpenDeleteConfirm,
  onCancelDelete,
  onDeleteKos,
  onSave,
}) => {
  if (!show || !selectedKos) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full`}>
        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Pengaturan Kos
          </h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none`}
          >
            ×
          </button>
        </div>

        {showDeleteConfirm ? (
          /* Delete Confirmation View */
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-4">
              <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Hapus Kos?
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tindakan ini akan menghapus <span className="font-semibold">"{selectedKos.nama}"</span> beserta <span className="font-semibold">{selectedKos.kamarList.length} kamar</span> yang ada di dalamnya.
              </p>
            </div>

            <div className={`${isDark ? 'bg-red-900 bg-opacity-20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-red-300' : 'text-red-700'} mb-3`}>
                ⚠️ Peringatan: Tindakan ini tidak dapat dibatalkan!
              </p>
              <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'} mb-3`}>
                Untuk melanjutkan, ketik nama kos <span className="font-bold">"{selectedKos.nama}"</span> di bawah ini:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Ketik nama kos"
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
            </div>
          </div>
        ) : (
          /* Edit Form View */
          <div className="p-6 space-y-4">
            {/* Upload Gambar Kos */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                Foto Kos {editPreviewImages.length > 0 && `(${editPreviewImages.length} foto)`}
              </label>
              
              {/* Preview Images Grid */}
              {editPreviewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {editPreviewImages.map((image, index) => (
                    <div 
                      key={index} 
                      className={`relative group ${
                        editProfileImageIndex === index 
                          ? 'ring-4 ring-teal-500' 
                          : ''
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      
                      {editProfileImageIndex === index && (
                        <div className="absolute top-1 left-1 bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Profil
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                        {editProfileImageIndex !== index && (
                          <button
                            onClick={() => onSetProfileImage(index)}
                            className="p-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg transition"
                            title="Jadikan foto profil"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveImage(index)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                          title="Hapus gambar"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition ${
                isDark 
                  ? 'border-slate-600 bg-slate-700/50 hover:bg-slate-700' 
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <svg className={`w-6 h-6 mb-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <span className="font-semibold">Upload foto</span>
                  </p>
                  <p className={`text-xs ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                    Bisa lebih dari 1
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={onImageUpload}
                />
              </label>
            </div>

            {/* Nama Kos */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                Nama Kos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editFormKos.nama}
                onChange={(e) => setEditFormKos({ ...editFormKos, nama: e.target.value })}
                placeholder="Contoh: Kos Mawar"
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Alamat */}
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editFormKos.alamat}
                onChange={(e) => setEditFormKos({ ...editFormKos, alamat: e.target.value })}
                placeholder="Jl. Contoh No. 123"
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg text-sm ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className={`${isDark ? 'bg-blue-900 bg-opacity-20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
              <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                💡 <strong>Fasilitas Kos</strong> otomatis ditambahkan dari fasilitas yang ada di setiap kamar. Kelola fasilitas melalui Detail Kamar.
              </p>
            </div>

            {/* Delete Button */}
            <button
              onClick={onOpenDeleteConfirm}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Kos
            </button>
          </div>
        )}

        <div className={`${isDark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t px-6 py-4 flex justify-end gap-3`}>
          {showDeleteConfirm ? (
            /* Delete Confirmation Buttons */
            <>
              <button
                onClick={onCancelDelete}
                className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
              >
                Batal
              </button>
              <button
                onClick={onDeleteKos}
                disabled={deleteConfirmText !== selectedKos.nama}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  deleteConfirmText === selectedKos.nama
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Ya, Hapus Kos
              </button>
            </>
          ) : (
            /* Edit Form Buttons */
            <>
              <button
                onClick={onClose}
                className={`px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
              >
                Batal
              </button>
              <button
                onClick={onSave}
                disabled={!editFormKos.nama || !editFormKos.alamat}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  editFormKos.nama && editFormKos.alamat
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Simpan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PengaturanKosModal;

import ImageUploadSection from './ImageUploadSection';

interface TambahKosModalProps {
  show: boolean;
  isDark: boolean;
  formKos: {
    nama: string;
    alamat: string;
    gambar: string[];
  };
  previewImages: string[];
  profileImageIndex: number;
  onClose: () => void;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetProfileImage: (index: number) => void;
  onSubmit: () => void;
}

export default function TambahKosModal({
  show,
  isDark,
  formKos,
  previewImages,
  profileImageIndex,
  onClose,
  onFormChange,
  onImageUpload,
  onRemoveImage,
  onSetProfileImage,
  onSubmit
}: TambahKosModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between sticky top-0`}>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tambah Kos Baru
          </h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'} text-2xl leading-none`}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Upload Gambar Kos */}
          <ImageUploadSection
            previewImages={previewImages}
            profileImageIndex={profileImageIndex}
            isDark={isDark}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
            onSetProfileImage={onSetProfileImage}
          />

          {/* Nama Kos */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
              Nama Kos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formKos.nama}
              onChange={(e) => onFormChange('nama', e.target.value)}
              placeholder="Contoh: Kos Mawar"
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-watt-blue`}
            />
          </div>

          {/* Alamat */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formKos.alamat}
              onChange={(e) => onFormChange('alamat', e.target.value)}
              placeholder="Contoh: Jl. Mawar No. 123, Bandung"
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-watt-blue`}
            />
          </div>

          {/* Info Box */}
          <div className={`${isDark ? 'bg-watt-blue-900 bg-opacity-20 border-watt-blue-800' : 'bg-watt-blue-50 border-watt-blue-200'} border rounded-lg p-3`}>
            <p className={`text-xs ${isDark ? 'text-watt-blue-light' : 'text-watt-blue'}`}>
              💡 Anda bisa menambahkan kamar secara manual nanti melalui halaman "Daftar Kamar". Harga akan diatur per kamar.
            </p>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} border-t px-6 py-4 flex justify-end gap-3`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg text-sm font-medium transition-colors`}
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={!formKos.nama || !formKos.alamat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              formKos.nama && formKos.alamat
                ? 'bg-gradient-to-r from-watt-blue to-watt-blue-light hover:from-watt-blue-600 hover:to-watt-blue text-white cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

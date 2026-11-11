interface ImageUploadSectionProps {
  previewImages: string[];
  profileImageIndex: number;
  isDark: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetProfileImage: (index: number) => void;
}

export default function ImageUploadSection({
  previewImages,
  profileImageIndex,
  isDark,
  onImageUpload,
  onRemoveImage,
  onSetProfileImage
}: ImageUploadSectionProps) {
  return (
    <div>
      <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
        Foto Kos {previewImages.length > 0 && `(${previewImages.length} foto)`}
      </label>
      
      {/* Preview Images Grid */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {previewImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative group ${
                profileImageIndex === index 
                  ? 'ring-4 ring-watt-blue' 
                  : ''
              }`}
            >
              <img 
                src={image} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-24 object-cover rounded-lg"
              />
              
              {/* Profile Badge */}
              {profileImageIndex === index && (
                <div className="absolute top-1 left-1 bg-watt-blue text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Profil
                </div>
              )}
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {profileImageIndex !== index && (
                  <button
                    onClick={() => onSetProfileImage(index)}
                    className="p-2 bg-watt-blue hover:bg-watt-blue text-white rounded-full shadow-lg transition"
                    title="Jadikan foto profil"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => onRemoveImage(index)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                  title="Hapus gambar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Button */}
      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition ${
        isDark 
          ? 'border-slate-600 bg-slate-700/50 hover:bg-slate-700' 
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
      }`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className={`w-8 h-8 mb-2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className={`mb-1 text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
            <span className="font-semibold">Klik untuk upload foto</span>
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            PNG, JPG, JPEG (MAX. 5MB per foto)
          </p>
          <p className={`text-xs ${isDark ? 'text-watt-blue-light' : 'text-watt-blue'} mt-1`}>
            Bisa pilih lebih dari 1 foto
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
      
      {previewImages.length > 0 && (
        <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          💡 Klik ikon bintang untuk menjadikan foto profil kos
        </p>
      )}
    </div>
  );
}

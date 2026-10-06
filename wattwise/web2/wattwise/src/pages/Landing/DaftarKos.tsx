import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchBar, KosCard, TambahKosModal } from '../../components/landing/daftarKos';
import '../../styles/daftarkos/index.css';

interface DaftarKosProps {
  onNavigateToKamarList?: (kosId: string) => void;
}

const DaftarKos: React.FC<DaftarKosProps> = ({ onNavigateToKamarList }) => {
  const { effectiveTheme, kosList, addKos } = useApp();
  const isDark = effectiveTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [showTambahKosModal, setShowTambahKosModal] = useState(false);
  const [formKos, setFormKos] = useState({
    nama: '',
    alamat: '',
    gambar: [] as string[]
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [profileImageIndex, setProfileImageIndex] = useState(0);

  // Filter kos based on search
  const filteredKosList = kosList.filter(kos => {
    if (!searchQuery) return true;
    const matchesSearch = kos.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kos.alamat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleKosClick = (kosId: string) => {
    if (onNavigateToKamarList) {
      onNavigateToKamarList(kosId);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormKos({ ...formKos, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      // Validate file types
      const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        return;
      }
      
      // Validate file sizes
      const largeFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (largeFiles.length > 0) {
        return;
      }

      // Read all files
      const promises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(imageUrls => {
        const newImages = [...previewImages, ...imageUrls];
        setPreviewImages(newImages);
        setFormKos({ ...formKos, gambar: newImages });
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    setFormKos({ ...formKos, gambar: newImages });
    
    // Adjust profile index if needed
    if (profileImageIndex >= newImages.length) {
      setProfileImageIndex(Math.max(0, newImages.length - 1));
    } else if (profileImageIndex === index && newImages.length > 0) {
      setProfileImageIndex(0);
    }
  };

  const handleSetProfileImage = (index: number) => {
    setProfileImageIndex(index);
  };

  const handleTambahKos = () => {
    if (formKos.nama && formKos.alamat) {
      // Create kos without any rooms
      addKos({
        nama: formKos.nama,
        alamat: formKos.alamat,
        hargaMin: 0,
        hargaMax: 0,
        fasilitas: [],
        gambar: formKos.gambar,
        gambarProfil: profileImageIndex
      });
      
      setShowTambahKosModal(false);
      setFormKos({
        nama: '',
        alamat: '',
        gambar: []
      });
      setPreviewImages([]);
      setProfileImageIndex(0);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header dengan Title dan Tombol */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Daftar Kos
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {kosList.length} properti terdaftar
              </p>
            </div>
            <button
              onClick={() => setShowTambahKosModal(true)}
              className="px-4 py-2.5 bg-watt-blue hover:bg-watt-blue-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Kos Baru
            </button>
          </div>

          {/* Search Bar Section */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalResults={filteredKosList.length}
            totalKos={kosList.length}
            isDark={isDark}
          />

          {/* Kos Grid */}
          {filteredKosList.length === 0 ? (
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-12 text-center`}>
              <div className="text-6xl mb-4">🏠</div>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Tidak ada kos ditemukan
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                Coba ubah kriteria pencarian Anda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKosList.map(kos => (
                <KosCard
                  key={kos.id}
                  kos={kos}
                  isDark={isDark}
                  onClick={handleKosClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Tambah Kos */}
      <TambahKosModal
        show={showTambahKosModal}
        isDark={isDark}
        formKos={formKos}
        previewImages={previewImages}
        profileImageIndex={profileImageIndex}
        onClose={() => setShowTambahKosModal(false)}
        onFormChange={handleFormChange}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
        onSetProfileImage={handleSetProfileImage}
        onSubmit={handleTambahKos}
      />
    </div>
  );
};

export default DaftarKos;

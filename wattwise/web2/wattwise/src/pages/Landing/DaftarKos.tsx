import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { kosService } from '../../services';
import { SearchBar, KosCard, TambahKosModal } from '../../components/landing/daftarKos';
import '../../styles/daftarkos/index.css';

interface DaftarKosProps {
  onNavigateToKamarList?: (kosId: string) => void;
}

const DaftarKos: React.FC<DaftarKosProps> = ({ onNavigateToKamarList }) => {
  const { effectiveTheme, kosList: localKosList, addKos: addKosLocal } = useApp();
  const isDark = effectiveTheme === 'dark';

  const [kosList, setKosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTambahKosModal, setShowTambahKosModal] = useState(false);
  const [formKos, setFormKos] = useState({
    nama: '',
    alamat: '',
    gambar: [] as string[]
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [profileImageIndex, setProfileImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Check if API mode is enabled
  const USE_API = process.env.REACT_APP_USE_API === 'true';

  // Fetch kos list on component mount
  useEffect(() => {
    fetchKosList();
  }, []);

  async function fetchKosList() {
    if (!USE_API) {
      // Use localStorage data
      setKosList(localKosList);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await kosService.getKosList();
      setKosList(data);
    } catch (err: any) {
      console.error('Error fetching kos list:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }

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

  const handleTambahKos = async () => {
    if (!formKos.nama || !formKos.alamat) {
      alert('Nama dan alamat kos wajib diisi');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (USE_API) {
        // Use API
        const newKos = await kosService.createKos({
          nama: formKos.nama,
          alamat: formKos.alamat,
          fasilitas: [],
          gambar: formKos.gambar
        });

        // Add to list
        setKosList(prev => [...prev, newKos]);
        
        alert('Kos berhasil ditambahkan!');
      } else {
        // Use localStorage
        addKosLocal({
          nama: formKos.nama,
          alamat: formKos.alamat,
          hargaMin: 0,
          hargaMax: 0,
          fasilitas: [],
          gambar: formKos.gambar,
          gambarProfil: profileImageIndex
        });
        
        // Refresh local list
        setKosList(localKosList);
      }
      
      // Close modal and reset form
      setShowTambahKosModal(false);
      setFormKos({
        nama: '',
        alamat: '',
        gambar: []
      });
      setPreviewImages([]);
      setProfileImageIndex(0);
    } catch (err: any) {
      console.error('Error creating kos:', err);
      setError(err.message || 'Gagal menambahkan kos');
      alert('Gagal menambahkan kos: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setSubmitting(false);
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

          {/* Error Message */}
          {error && (
            <div className={`${isDark ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-6`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                <button 
                  onClick={fetchKosList}
                  className={`ml-auto px-3 py-1 text-xs font-medium rounded ${isDark ? 'bg-red-800 hover:bg-red-700 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 mx-auto text-watt-blue" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Memuat daftar kos...</p>
              </div>
            </div>
          ) : (
            <>
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
                    {searchQuery ? 'Tidak ada kos ditemukan' : 'Belum Ada Kos Terdaftar'}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {searchQuery 
                      ? 'Coba ubah kriteria pencarian Anda'
                      : 'Mulai tambahkan properti kos Anda dengan klik tombol "Tambah Kos Baru"'
                    }
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
            </>
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
        onClose={() => {
          setShowTambahKosModal(false);
          setError('');
        }}
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

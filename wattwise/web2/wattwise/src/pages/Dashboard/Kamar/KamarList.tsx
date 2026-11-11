import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { kosService } from '../../../services';
import { KamarCard, KosHeader, TambahKamarModal, PengaturanKosModal } from '../../../components/dashboard/kamar/kamarList';
import { getTotalKamarTerisi } from '../../../utils/dashboard/kamar/kamarList';
import { useKamarListHandlers } from '../../../hooks/dashboard/kamar/kamarList/useKamarListHandlers';
import '../../../styles/kamar/index.css';
import '../../../styles/kamar/kamar-list.css';

interface KamarListProps {
  kosId?: string;
  onNavigateToDetail?: (kamarId: string) => void;
  onBack?: () => void;
}

const KamarList: React.FC<KamarListProps> = ({ kosId, onNavigateToDetail, onBack }) => {
  const { effectiveTheme, kosList: localKosList, addKamarToKos, updateKos, removeKos } = useApp();
  const isDark = effectiveTheme === 'dark';

  // State for API data
  const [kosList, setKosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Use custom hook for all handlers and states
  const handlers = useKamarListHandlers({
    addKamarToKos,
    updateKos,
    removeKos,
    onBack
  });

  // Override handleTambahKamar to use API
  const handleTambahKamarAPI = async () => {
    if (!handlers.selectedKosForKamar || !handlers.formKamar.nama) {
      alert('Nama kamar wajib diisi');
      return;
    }

    try {
      if (USE_API) {
        // Use API
        const jumlah = handlers.formKamar.jumlahKamar || 1;
        
        if (jumlah === 1) {
          // Add single kamar
          const newKamar = await kosService.addKamar(handlers.selectedKosForKamar.id, {
            nama: handlers.formKamar.nama,
            hargaSewa: handlers.formKamar.hargaSewa,
            luasKamar: handlers.formKamar.luasKamar,
            fasilitas: handlers.formKamar.fasilitas,
            maxPenghuni: 1,
            gambar: handlers.formKamar.gambar
          });

          // Refresh kos list
          await fetchKosList();
          alert('Kamar berhasil ditambahkan!');
        } else {
          // Add multiple kamar
          const promises = [];
          for (let i = 1; i <= jumlah; i++) {
            promises.push(
              kosService.addKamar(handlers.selectedKosForKamar.id, {
                nama: `${handlers.formKamar.nama} ${i}`,
                hargaSewa: handlers.formKamar.hargaSewa,
                luasKamar: handlers.formKamar.luasKamar,
                fasilitas: [...handlers.formKamar.fasilitas],
                maxPenghuni: 1,
                gambar: [...handlers.formKamar.gambar]
              })
            );
          }
          
          await Promise.all(promises);
          await fetchKosList();
          alert(`${jumlah} kamar berhasil ditambahkan!`);
        }
      } else {
        // Use localStorage (fallback)
        handlers.handleTambahKamar();
        setKosList(localKosList);
        return;
      }

      // Close modal and reset form
      handlers.setShowTambahKamarModal(false);
      handlers.setFormKamar({ 
        nama: '', 
        jumlahKamar: 1, 
        hargaSewa: 0, 
        luasKamar: 0, 
        fasilitas: [], 
        gambar: [] 
      });
      handlers.setSelectedKosForKamar(null);
    } catch (err: any) {
      console.error('Error adding kamar:', err);
      alert('Gagal menambahkan kamar: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  // Filter to show only the selected kos if kosId is provided
  const displayedKos = kosId 
    ? kosList.filter(kos => kos.id === kosId)
    : kosList;

  // Get the selected kos data for header
  const selectedKos = displayedKos.length > 0 ? displayedKos[0] : null;

  // Show loading state
  if (loading) {
    return (
      <div className="kamar-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto text-watt-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Memuat data kamar...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="kamar-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchKosList}
              className="mt-4 px-4 py-2 bg-watt-blue text-white rounded-lg hover:bg-watt-blue-dark transition">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kamar-container">
      <div className="flex flex-col min-h-screen">
        <main className="kamar-main">
          {selectedKos ? (
            <>
              {/* Single Kos View */}
              <KosHeader
                kos={selectedKos}
                kamarTerisi={getTotalKamarTerisi(selectedKos)}
                onTambahKamar={() => handlers.handleOpenTambahKamar(selectedKos)}
                onPengaturan={() => handlers.handleOpenPengaturanKos(selectedKos)}
                onBack={onBack}
              />

              <div className="kamar-grid-3">
                {selectedKos.kamarList.map((kamar: any) => (
                  <KamarCard
                    key={kamar.id}
                    kamar={kamar}
                    onClick={() => onNavigateToDetail && onNavigateToDetail(kamar.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Multiple Kos View */
            <div className="kamar-list-multi-kos-container">
              {displayedKos.map((kos: any) => (
                <div 
                  key={kos.id}
                  className="kamar-card kamar-list-kos-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="kamar-card-header">
                    <div>
                      <h2 className="kamar-card-title kamar-list-kos-title">{kos.nama}</h2>
                      <p className="kamar-subtitle">{kos.alamat}</p>
                    </div>
                    <div className="kamar-list-header-actions">
                      <div className="kamar-list-terisi-info">
                        <p className="kamar-list-terisi-text">
                          {getTotalKamarTerisi(kos)} / {kos.kamarList.length} Kamar Terisi
                        </p>
                      </div>
                      <button
                        onClick={() => handlers.handleOpenTambahKamar(kos)}
                        className="kamar-btn-primary"
                      >
                        <svg className="kamar-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kamar
                      </button>
                    </div>
                  </div>

                  <div className="kamar-card-body">
                    <div className="kamar-grid-3">
                      {kos.kamarList.map((kamar: any) => (
                        <KamarCard
                          key={kamar.id}
                          kamar={kamar}
                          onClick={() => onNavigateToDetail && onNavigateToDetail(kamar.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Tambah Kamar Modal */}
      <TambahKamarModal
        show={handlers.showTambahKamarModal && handlers.selectedKosForKamar !== null}
        isDark={isDark}
        selectedKos={handlers.selectedKosForKamar}
        formKamar={handlers.formKamar}
        setFormKamar={handlers.setFormKamar}
        kamarPreviewImages={handlers.kamarPreviewImages}
        kamarProfileImageIndex={handlers.kamarProfileImageIndex}
        onClose={() => {
          handlers.setShowTambahKamarModal(false);
          handlers.setFormKamar({ nama: '', jumlahKamar: 1, hargaSewa: 0, luasKamar: 0, fasilitas: [], gambar: [] });
          handlers.setSelectedKosForKamar(null);
        }}
        onImageUpload={handlers.handleKamarImageUpload}
        onRemoveImage={handlers.handleRemoveKamarImage}
        onSetProfileImage={handlers.handleSetKamarProfileImage}
        onAddFasilitas={handlers.handleAddFasilitas}
        onRemoveFasilitas={handlers.handleRemoveFasilitas}
        onSave={handleTambahKamarAPI}
      />

      {/* Pengaturan Kos Modal */}
      <PengaturanKosModal
        show={handlers.showPengaturanKosModal && handlers.selectedKosForKamar !== null}
        isDark={isDark}
        selectedKos={handlers.selectedKosForKamar}
        editFormKos={handlers.editFormKos}
        setEditFormKos={handlers.setEditFormKos}
        editPreviewImages={handlers.editPreviewImages}
        editProfileImageIndex={handlers.editProfileImageIndex}
        showDeleteConfirm={handlers.showDeleteConfirm}
        deleteConfirmText={handlers.deleteConfirmText}
        setDeleteConfirmText={handlers.setDeleteConfirmText}
        onClose={() => {
          handlers.setShowPengaturanKosModal(false);
          handlers.setEditFormKos({ nama: '', alamat: '', gambar: [] });
          handlers.setSelectedKosForKamar(null);
        }}
        onImageUpload={handlers.handleEditImageUpload}
        onRemoveImage={handlers.handleRemoveEditImage}
        onSetProfileImage={handlers.handleSetEditProfileImage}
        onOpenDeleteConfirm={handlers.handleOpenDeleteConfirm}
        onCancelDelete={() => handlers.setShowDeleteConfirm(false)}
        onDeleteKos={handlers.handleDeleteKos}
        onSave={handlers.handleSavePengaturanKos}
      />
    </div>
  );
};

export default KamarList;

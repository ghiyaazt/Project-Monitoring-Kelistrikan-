import React from 'react';
import { useApp } from '../../../context/AppContext';
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
  const { effectiveTheme, kosList, addKamarToKos, updateKos, removeKos } = useApp();
  const isDark = effectiveTheme === 'dark';

  // Use custom hook for all handlers and states
  const handlers = useKamarListHandlers({
    addKamarToKos,
    updateKos,
    removeKos,
    onBack
  });

  // Filter to show only the selected kos if kosId is provided
  const displayedKos = kosId 
    ? kosList.filter(kos => kos.id === kosId)
    : kosList;

  // Get the selected kos data for header
  const selectedKos = displayedKos.length > 0 ? displayedKos[0] : null;

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
                {selectedKos.kamarList.map(kamar => (
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
              {displayedKos.map(kos => (
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
                      {kos.kamarList.map(kamar => (
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
        onSave={handlers.handleTambahKamar}
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

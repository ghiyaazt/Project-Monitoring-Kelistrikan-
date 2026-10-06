import React from 'react';

interface Kos {
  id: string;
  nama: string;
}

interface FormKamar {
  nama: string;
  jumlahKamar: number;
  hargaSewa: number;
  luasKamar: number;
  fasilitas: string[];
  gambar: string[];
}

interface TambahKamarModalProps {
  show: boolean;
  isDark: boolean;
  selectedKos: Kos | null;
  formKamar: FormKamar;
  setFormKamar: React.Dispatch<React.SetStateAction<FormKamar>>;
  kamarPreviewImages: string[];
  kamarProfileImageIndex: number;
  onClose: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetProfileImage: (index: number) => void;
  onAddFasilitas: () => void;
  onRemoveFasilitas: (fasilitas: string) => void;
  onSave: () => void;
}

const TambahKamarModal: React.FC<TambahKamarModalProps> = ({
  show,
  isDark,
  selectedKos,
  formKamar,
  setFormKamar,
  kamarPreviewImages,
  kamarProfileImageIndex,
  onClose,
  onImageUpload,
  onRemoveImage,
  onSetProfileImage,
  onAddFasilitas,
  onRemoveFasilitas,
  onSave,
}) => {
  const [newFasilitas, setNewFasilitas] = React.useState('');

  if (!show || !selectedKos) return null;

  return (
    <div className="kamar-modal-overlay">
      <div className="kamar-modal" style={{ maxWidth: '28rem' }}>
        <div className="kamar-modal-header">
          <h3 className="kamar-modal-title">
            Tambah Kamar - {selectedKos.nama}
          </h3>
          <button
            onClick={onClose}
            className="kamar-modal-close"
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="kamar-modal-body">
          {/* Upload Gambar */}
          <div className="kamar-form-group">
            <label className="kamar-form-label">
              Foto Kamar {kamarPreviewImages.length > 0 && `(${kamarPreviewImages.length} foto)`}
            </label>
            
            {kamarPreviewImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {kamarPreviewImages.map((image, index) => (
                  <div 
                    key={index} 
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      border: kamarProfileImageIndex === index ? '3px solid #10b981' : 'none',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`Preview ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {kamarProfileImageIndex === index && (
                      <div style={{
                        position: 'absolute',
                        top: '0.25rem',
                        left: '0.25rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: '0.625rem',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '9999px',
                        fontWeight: 600
                      }}>
                        Profil
                      </div>
                    )}
                    
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      transition: 'opacity 0.2s'
                    }}
                    className="hover-visible"
                    >
                      {kamarProfileImageIndex !== index && (
                        <button
                          onClick={() => onSetProfileImage(index)}
                          className="kamar-btn-icon-only"
                          style={{ backgroundColor: '#10b981', color: 'white' }}
                          title="Jadikan foto profil"
                        >
                          <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveImage(index)}
                        className="kamar-btn-icon-only"
                        style={{ backgroundColor: '#ef4444', color: 'white' }}
                        title="Hapus gambar"
                      >
                        <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <label className="kamar-form-input" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '6rem',
              border: '2px dashed',
              cursor: 'pointer'
            }}>
              <svg style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>Upload foto kamar</p>
              <p style={{ fontSize: '0.75rem', color: '#10b981' }}>Bisa lebih dari 1</p>
              <input 
                type="file" 
                accept="image/*"
                multiple
                onChange={onImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Nama Kamar */}
          <div className="kamar-form-group">
            <label className="kamar-form-label">
              Nama Kamar <span className="kamar-form-required">*</span>
            </label>
            <input
              type="text"
              value={formKamar.nama}
              onChange={(e) => setFormKamar({ ...formKamar, nama: e.target.value })}
              placeholder="Contoh: Kamar A1"
              className="kamar-form-input"
            />
          </div>

          {/* Harga Sewa */}
          <div className="kamar-form-group">
            <label className="kamar-form-label">
              Harga Sewa <span className="kamar-form-required">*</span>
            </label>
            <input
              type="number"
              value={formKamar.hargaSewa || ''}
              onChange={(e) => setFormKamar({ ...formKamar, hargaSewa: parseInt(e.target.value) || 0 })}
              placeholder="Contoh: 1500000"
              className="kamar-form-input"
            />
          </div>

          {/* Luas & Max Penghuni */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="kamar-form-group">
              <label className="kamar-form-label">Luas (m²)</label>
              <input
                type="number"
                value={formKamar.luasKamar || ''}
                onChange={(e) => setFormKamar({ ...formKamar, luasKamar: parseInt(e.target.value) || 0 })}
                placeholder="12"
                className="kamar-form-input"
              />
            </div>
            <div className="kamar-form-group">
              <label className="kamar-form-label">Max Penghuni</label>
              <input
                type="number"
                value={formKamar.jumlahKamar}
                onChange={(e) => setFormKamar({ ...formKamar, jumlahKamar: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className="kamar-form-input"
                min="1"
              />
            </div>
          </div>

          {/* Fasilitas */}
          <div className="kamar-form-group">
            <label className="kamar-form-label">Fasilitas</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={newFasilitas}
                onChange={(e) => setNewFasilitas(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddFasilitas())}
                placeholder="Tambah fasilitas..."
                className="kamar-form-input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={onAddFasilitas}
                className="kamar-btn-primary"
              >
                <svg className="kamar-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            {formKamar.fasilitas.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formKamar.fasilitas.map((f, idx) => (
                  <span key={idx} className="kamar-badge kamar-status-info" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {f}
                    <button
                      onClick={() => onRemoveFasilitas(f)}
                      style={{ marginLeft: '0.25rem' }}
                    >
                      <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="kamar-modal-footer">
          <button
            onClick={onClose}
            className="kamar-btn-secondary"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="kamar-btn-primary"
            disabled={!formKamar.nama || formKamar.hargaSewa === 0}
          >
            Simpan Kamar
          </button>
        </div>
      </div>

      <style>{`
        .hover-visible {
          transition: opacity 0.2s;
        }
        .hover-visible:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default TambahKamarModal;

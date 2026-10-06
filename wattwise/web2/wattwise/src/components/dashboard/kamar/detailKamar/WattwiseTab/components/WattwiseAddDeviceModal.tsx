import React from 'react';

interface WattwiseAddDeviceModalProps {
  isDark: boolean;
  show: boolean;
  form: { nama: string; deviceId: string };
  setForm: React.Dispatch<React.SetStateAction<{ nama: string; deviceId: string }>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const WattwiseAddDeviceModal: React.FC<WattwiseAddDeviceModalProps> = ({
  isDark,
  show,
  form,
  setForm,
  onClose,
  onSubmit
}) => {
  if (!show) return null;

  return (
    <div 
      className="wattwise-modal-overlay"
      onClick={onClose}
    >
      <div 
        className={`wattwise-modal-container ${isDark ? 'wattwise-modal-container-dark' : 'wattwise-modal-container-light'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header dengan gradient */}
        <div className="wattwise-modal-header">
          {/* Pattern decoration */}
          <div className="wattwise-modal-header-pattern" />
          
          <div className="wattwise-modal-header-content">
            <div className="wattwise-modal-header-top">
              <h3 className="wattwise-modal-title">
                Tambah Perangkat
              </h3>
              <button
                onClick={onClose}
                className="wattwise-modal-close-btn"
              >
                ×
              </button>
            </div>
            <p className="wattwise-modal-description">
              Masukkan informasi perangkat yang akan ditambahkan
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="wattwise-modal-form">
          <div className="wattwise-form-group">
            <label className={`wattwise-form-label ${isDark ? 'wattwise-form-label-dark' : 'wattwise-form-label-light'}`}>
              Nama Perangkat <span className="wattwise-form-required">*</span>
            </label>
            <input
              className={`wattwise-form-input ${isDark ? 'wattwise-form-input-dark' : 'wattwise-form-input-light'}`}
              type="text"
              placeholder="Contoh: AC Samsung 1 PK"
              value={form.nama}
              onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              required
            />
          </div>

          <div className="wattwise-form-group">
            <label className={`wattwise-form-label ${isDark ? 'wattwise-form-label-dark' : 'wattwise-form-label-light'}`}>
              ID Perangkat (Wattwise) <span className="wattwise-form-required">*</span>
            </label>
            <input
              className={`wattwise-form-input wattwise-form-input-mono ${isDark ? 'wattwise-form-input-dark' : 'wattwise-form-input-light'}`}
              type="text"
              placeholder="WW-001-XXX"
              value={form.deviceId}
              onChange={e => setForm(f => ({ ...f, deviceId: e.target.value }))}
              required
            />
          </div>

          {/* Info box */}
          <div className={`wattwise-info-box ${isDark ? 'wattwise-info-box-dark' : 'wattwise-info-box-light'}`}>
            <div className="wattwise-info-icon">💡</div>
            <p className={`wattwise-info-text ${isDark ? 'wattwise-info-text-dark' : 'wattwise-info-text-light'}`}>
              Daya perangkat akan terdeteksi otomatis setelah perangkat terhubung ke sistem.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="wattwise-form-footer">
            <button
              type="button"
              onClick={onClose}
              className={`wattwise-btn-cancel ${isDark ? 'wattwise-btn-cancel-dark' : 'wattwise-btn-cancel-light'}`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="wattwise-btn-submit"
            >
              <div className="wattwise-btn-submit-content">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Perangkat
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

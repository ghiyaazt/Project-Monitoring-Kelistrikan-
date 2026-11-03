interface ProfilData {
  nama: string;
  email: string;
  phone: string;
}

interface PersonalInfoSectionProps {
  profil: ProfilData;
  isEditing: boolean;
  saved: boolean;
  onProfilChange: (profil: ProfilData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PersonalInfoSection({
  profil,
  isEditing,
  saved,
  onProfilChange,
  onSave,
  onCancel
}: PersonalInfoSectionProps) {
  return (
    <div className="settings-section settings-section-space-y-4">
      <div className="settings-section-header settings-section-header-mb-2">
        <div className="settings-section-icon bg-purple-50">
          <svg className="sidebar-logo-icon-svg text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="settings-section-title">Informasi Pribadi</h2>
      </div>

      <div className="settings-grid-1-sm-2">
        <div>
          <label className="input-label">Nama Lengkap</label>
          <input 
            type="text" 
            value={profil.nama} 
            onChange={e => onProfilChange({ ...profil, nama: e.target.value })} 
            className="input"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="input-label">Email</label>
          <input 
            type="email" 
            value={profil.email} 
            onChange={e => onProfilChange({ ...profil, email: e.target.value })} 
            className="input"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="input-label">No. Telepon</label>
          <input 
            type="tel" 
            value={profil.phone} 
            onChange={e => onProfilChange({ ...profil, phone: e.target.value })} 
            className="input"
            disabled={!isEditing}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 pt-4">
          <button 
            onClick={onSave} 
            className="profile-btn-save">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Simpan Perubahan
          </button>
          <button 
            onClick={onCancel} 
            className="profile-btn-cancel">
            Batal
          </button>
        </div>
      )}

      {saved && (
        <div className="alert-success">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Profil berhasil diperbarui!</span>
        </div>
      )}
    </div>
  );
}

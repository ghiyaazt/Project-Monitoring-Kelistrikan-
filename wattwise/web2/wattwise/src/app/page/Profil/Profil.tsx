import { useState } from "react";
import { pengaturanData } from "../../../data/mockData";

interface ProfilData {
  nama: string;
  email: string;
  phone: string;
}

export default function Profil() {
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profil, setProfil] = useState<ProfilData>(pengaturanData.profil);

  function save() { 
    setSaved(true); 
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000); 
  }

  function cancel() {
    setProfil(pengaturanData.profil);
    setIsEditing(false);
  }

  return (
    <div className="settings-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Profil Pengguna</h1>
          <p className="settings-header-text">Kelola informasi profil dan akun Anda</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="profile-edit-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profil
          </button>
        )}
      </div>

      {/* Profil Card dengan Avatar */}
      <div className="settings-section">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              AD
            </div>
            {isEditing && (
              <button className="profile-avatar-edit-btn">
                <svg className="profile-avatar-edit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{profil.nama}</h2>
            <p className="profile-location">{profil.email}</p>
            <div className="profile-badges">
              <span className="profile-badge-active">User Aktif</span>
              <span className="profile-badge-admin">WattWise Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Pribadi */}
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
              onChange={e => setProfil((p: ProfilData) => ({ ...p, nama: e.target.value }))} 
              className="input"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input 
              type="email" 
              value={profil.email} 
              onChange={e => setProfil((p: ProfilData) => ({ ...p, email: e.target.value }))} 
              className="input"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="input-label">No. Telepon</label>
            <input 
              type="tel" 
              value={profil.phone} 
              onChange={e => setProfil((p: ProfilData) => ({ ...p, phone: e.target.value }))} 
              className="input"
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button 
              onClick={save} 
              className="profile-btn-save">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Simpan Perubahan
            </button>
            <button 
              onClick={cancel} 
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

      {/* Keamanan Akun */}
      <div className="settings-section settings-section-space-y-4">
        <div className="settings-section-header settings-section-header-mb-2">
          <div className="settings-section-icon bg-red-50">
            <svg className="sidebar-logo-icon-svg text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="settings-section-title">Keamanan Akun</h2>
        </div>

        <div className="space-y-3">
          <button className="security-menu-item" style={{ backgroundColor: '#f8fafc', border: 'none' }}>
            <div className="security-menu-item-content">
              <div className="security-menu-icon-box" style={{ backgroundColor: '#ffffff' }}>
                <svg className="security-menu-icon" style={{ color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="security-menu-title" style={{ color: '#0f172a' }}>Ubah Password</p>
                <p className="security-menu-desc" style={{ color: '#64748b' }}>Terakhir diubah 30 hari yang lalu</p>
              </div>
            </div>
            <svg className="security-menu-arrow" style={{ color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="security-menu-item" style={{ backgroundColor: '#f8fafc', border: 'none' }}>
            <div className="security-menu-item-content">
              <div className="security-menu-icon-box" style={{ backgroundColor: '#ffffff' }}>
                <svg className="security-menu-icon" style={{ color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="security-menu-title" style={{ color: '#0f172a' }}>Perangkat Terhubung</p>
                <p className="security-menu-desc" style={{ color: '#64748b' }}>Kelola perangkat yang dapat mengakses akun</p>
              </div>
            </div>
            <svg className="security-menu-arrow" style={{ color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

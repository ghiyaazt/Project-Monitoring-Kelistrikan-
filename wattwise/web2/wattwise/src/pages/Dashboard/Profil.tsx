import { useState } from "react";
import { pengaturanData } from "../../data/mockData";
import {
  PasswordVerificationModal,
  ProfileCard,
  PersonalInfoSection,
  SecuritySection,
  ChangePasswordModal,
  ForgotPasswordModal
} from "../../components/dashboard/profile";
import "../../styles/profil/profil.css";

interface ProfilData {
  nama: string;
  email: string;
  phone: string;
}

export default function Profil() {
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profil, setProfil] = useState<ProfilData>(pengaturanData.profil);
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  function handleEditClick() {
    setShowPasswordVerification(true);
  }

  function verifyPassword(password: string): boolean {
    // Simulasi verifikasi password (ganti dengan API call yang sebenarnya)
    if (password === "admin123") {
      setShowPasswordVerification(false);
      setIsEditing(true);
      return true;
    }
    return false;
  }

  function save() { 
    setSaved(true); 
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000); 
  }

  function cancel() {
    setProfil(pengaturanData.profil);
    setIsEditing(false);
  }

  function handleForgotPassword() {
    setShowChangePassword(false);
    setShowForgotPassword(true);
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
            onClick={handleEditClick}
            className="profile-edit-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profil
          </button>
        )}
      </div>

      {/* Profile Card */}
      <ProfileCard profil={profil} isEditing={isEditing} />

      {/* Modal Verifikasi Password */}
      <PasswordVerificationModal
        show={showPasswordVerification}
        onClose={() => setShowPasswordVerification(false)}
        onVerify={verifyPassword}
      />

      {/* Informasi Pribadi */}
      <PersonalInfoSection
        profil={profil}
        isEditing={isEditing}
        saved={saved}
        onProfilChange={setProfil}
        onSave={save}
        onCancel={cancel}
      />

      {/* Keamanan Akun */}
      <SecuritySection onChangePassword={() => setShowChangePassword(true)} />

      {/* Modal Change Password */}
      <ChangePasswordModal
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onForgotPassword={handleForgotPassword}
      />

      {/* Modal Forgot Password Flow */}
      <ForgotPasswordModal
        show={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}

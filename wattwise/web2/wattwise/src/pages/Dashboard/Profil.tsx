import { useState, useEffect } from "react";
import { authService } from "../../services";
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
  const [profil, setProfil] = useState<ProfilData>({
    nama: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Check if API mode is enabled
  const USE_API = process.env.REACT_APP_USE_API === 'true';

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    if (!USE_API) {
      // Mock data (existing behavior)
      setProfil({
        nama: "John Doe",
        email: "john@example.com",
        phone: "08123456789"
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setProfil({
          nama: response.data.nama,
          email: response.data.email,
          phone: response.data.no_telp
        });
      } else {
        setError("Gagal memuat data profil");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Terjadi kesalahan saat memuat profil");
    } finally {
      setLoading(false);
    }
  }

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
    // Reload data dari backend
    fetchProfile();
    setIsEditing(false);
  }

  function handleForgotPassword() {
    setShowChangePassword(false);
    setShowForgotPassword(true);
  }

  // Show loading state
  if (loading) {
    return (
      <div className="settings-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 mx-auto text-watt-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Memuat profil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="settings-container">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-watt-blue text-white rounded-lg hover:bg-watt-blue-dark transition">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
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

import { useState, useRef } from "react";
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
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk Change Password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  
  // State untuk Forgot Password Flow
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPasswordData, setNewPasswordData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleEditClick() {
    setShowPasswordVerification(true);
    setPasswordError("");
    setVerificationPassword("");
  }

  function verifyPassword() {
    // Simulasi verifikasi password (ganti dengan API call yang sebenarnya)
    if (verificationPassword === "admin123") {
      setShowPasswordVerification(false);
      setIsEditing(true);
      setPasswordError("");
      setVerificationPassword("");
    } else {
      setPasswordError("Password salah! Coba lagi.");
    }
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

  function handleChangePassword() {
    setChangePasswordError("");
    setChangePasswordSuccess(false);

    // Validasi
    if (!changePasswordData.oldPassword || !changePasswordData.newPassword || !changePasswordData.confirmPassword) {
      setChangePasswordError("Semua field harus diisi!");
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setChangePasswordError("Password baru dan konfirmasi tidak sama!");
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      setChangePasswordError("Password minimal 6 karakter!");
      return;
    }

    // Simulasi verifikasi password lama
    if (changePasswordData.oldPassword !== "admin123") {
      setChangePasswordError("Password lama salah!");
      return;
    }

    // Jika berhasil
    setChangePasswordSuccess(true);
    setTimeout(() => {
      setShowChangePassword(false);
      setChangePasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordSuccess(false);
    }, 2000);
  }

  // Fungsi untuk Forgot Password Flow
  function handleSendOTP() {
    setForgotPasswordError("");
    
    if (!forgotEmail) {
      setForgotPasswordError("Email wajib diisi!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotPasswordError("Format email tidak valid!");
      return;
    }

    // Simulasi kirim OTP
    setTimeout(() => {
      setForgotPasswordStep('otp');
      setForgotPasswordError("");
    }, 1000);
  }

  function handleOTPChange(index: number, value: string) {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setForgotPasswordError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOTPKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!otpCode[index] && index > 0) {
        const newOtp = [...otpCode];
        newOtp[index - 1] = "";
        setOtpCode(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else if (otpCode[index]) {
        const newOtp = [...otpCode];
        newOtp[index] = "";
        setOtpCode(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOTPPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newOtp = [...otpCode];
      pastedData.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtpCode(newOtp);
      
      const lastIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[lastIndex]?.focus();
    }
  }

  function handleVerifyOTP() {
    setForgotPasswordError("");

    const otpString = otpCode.join("");
    
    if (otpString.length !== 6) {
      setForgotPasswordError("Masukkan 6 digit kode OTP!");
      return;
    }

    // Simulasi verifikasi OTP (kode yang benar: 123456)
    if (otpString !== "123456") {
      setForgotPasswordError("Kode OTP salah!");
      setOtpCode(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
      return;
    }

    // Jika berhasil
    setTimeout(() => {
      setForgotPasswordStep('reset');
      setForgotPasswordError("");
    }, 500);
  }

  function handleResetPassword() {
    setForgotPasswordError("");

    if (!newPasswordData.password || !newPasswordData.confirmPassword) {
      setForgotPasswordError("Semua field harus diisi!");
      return;
    }

    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      setForgotPasswordError("Password dan konfirmasi tidak sama!");
      return;
    }

    if (newPasswordData.password.length < 6) {
      setForgotPasswordError("Password minimal 6 karakter!");
      return;
    }

    // Jika berhasil
    setForgotPasswordSuccess(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotPasswordStep('email');
      setForgotEmail("");
      setOtpCode(["", "", "", "", "", ""]);
      setNewPasswordData({ password: "", confirmPassword: "" });
      setForgotPasswordSuccess(false);
      setForgotPasswordError("");
    }, 2000);
  }

  function resetForgotPasswordFlow() {
    setShowForgotPassword(false);
    setForgotPasswordStep('email');
    setForgotEmail("");
    setOtpCode(["", "", "", "", "", ""]);
    setNewPasswordData({ password: "", confirmPassword: "" });
    setForgotPasswordError("");
    setForgotPasswordSuccess(false);
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

      {/* Modal Verifikasi Password */}
      {showPasswordVerification && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Verifikasi Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordVerification(false);
                  setPasswordError("");
                  setVerificationPassword("");
                }}
                className="modal-close-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Masukkan password Anda untuk melanjutkan edit profil
              </p>
              
              {passwordError && (
                <div className="error-message">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {passwordError}
                </div>
              )}
              
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={verificationPassword}
                    onChange={(e) => setVerificationPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && verifyPassword()}
                    className="input auth-input-pr-11"
                    placeholder="Masukkan password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-password-toggle">
                    {showPassword ? (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => {
                  setShowPasswordVerification(false);
                  setPasswordError("");
                  setVerificationPassword("");
                }}
                className="modal-btn-cancel">
                Batal
              </button>
              <button 
                onClick={verifyPassword}
                className="modal-btn-primary">
                Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

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
          <button 
            onClick={() => setShowChangePassword(true)}
            className="security-menu-item">
            <div className="security-menu-item-content">
              <div className="security-menu-icon-box">
                <svg className="security-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="security-menu-title">Ubah Password</p>
                <p className="security-menu-desc">Terakhir diubah 30 hari yang lalu</p>
              </div>
            </div>
            <svg className="security-menu-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="security-menu-item">
            <div className="security-menu-item-content">
              <div className="security-menu-icon-box">
                <svg className="security-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="security-menu-title">Perangkat Terhubung</p>
                <p className="security-menu-desc">Kelola perangkat yang dapat mengakses akun</p>
              </div>
            </div>
            <svg className="security-menu-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Change Password */}
      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-lg">
            <div className="modal-header">
              <h3 className="modal-title">Ubah Password</h3>
              <button 
                onClick={() => {
                  setShowChangePassword(false);
                  setChangePasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  setChangePasswordError("");
                }}
                className="modal-close-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Masukkan password lama dan password baru Anda
              </p>
              
              {changePasswordSuccess && (
                <div className="success-message">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Password berhasil diubah!
                </div>
              )}

              {changePasswordError && (
                <div className="error-message">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {changePasswordError}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <label className="input-label">Password Lama</label>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={changePasswordData.oldPassword}
                    onChange={(e) => setChangePasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    className="input auth-input-pr-11"
                    placeholder="Masukkan password lama"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="auth-password-toggle">
                    {showOldPassword ? (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setShowForgotPassword(true);
                      setChangePasswordError("");
                    }}
                    className="forgot-password-link">
                    Lupa Password?
                  </button>
                </div>

                <div className="relative">
                  <label className="input-label">Password Baru</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={changePasswordData.newPassword}
                    onChange={(e) => setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="input auth-input-pr-11"
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="auth-password-toggle">
                    {showNewPassword ? (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label className="input-label">Konfirmasi Password Baru</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={changePasswordData.confirmPassword}
                    onChange={(e) => setChangePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input auth-input-pr-11"
                    placeholder="Konfirmasi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-password-toggle">
                    {showConfirmPassword ? (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <p className="modal-hint">
                Password minimal 6 karakter
              </p>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => {
                  setShowChangePassword(false);
                  setChangePasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  setChangePasswordError("");
                }}
                className="modal-btn-cancel">
                Batal
              </button>
              <button 
                onClick={handleChangePassword}
                className="modal-btn-primary">
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Forgot Password Flow */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-lg">
            <div className="modal-header">
              <h3 className="modal-title">
                {forgotPasswordStep === 'email' && 'Lupa Password'}
                {forgotPasswordStep === 'otp' && 'Verifikasi OTP'}
                {forgotPasswordStep === 'reset' && 'Buat Password Baru'}
              </h3>
              <button 
                onClick={resetForgotPasswordFlow}
                className="modal-close-btn">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              {/* Step 1: Email */}
              {forgotPasswordStep === 'email' && (
                <>
                  <p className="modal-description">
                    Masukkan email Anda untuk menerima kode verifikasi OTP
                  </p>
                  
                  {forgotPasswordError && (
                    <div className="error-message">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {forgotPasswordError}
                    </div>
                  )}
                  
                  <div>
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="input"
                      placeholder="nama@example.com"
                      autoFocus
                    />
                  </div>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {forgotPasswordStep === 'otp' && (
                <>
                  <p className="modal-description">
                    Masukkan kode OTP 6 digit yang telah dikirim ke<br />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{forgotEmail}</span>
                  </p>
                  
                  {forgotPasswordError && (
                    <div className="error-message">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {forgotPasswordError}
                    </div>
                  )}
                  
                  <div className="otp-input-container">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpInputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        onPaste={index === 0 ? handleOTPPaste : undefined}
                        className="otp-input-box"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  
                  <p className="modal-hint">
                    Untuk testing, gunakan kode: <span className="font-mono font-semibold">123456</span>
                  </p>
                </>
              )}

              {/* Step 3: Reset Password */}
              {forgotPasswordStep === 'reset' && (
                <>
                  <p className="modal-description">
                    Buat password baru untuk akun Anda
                  </p>
                  
                  {forgotPasswordSuccess && (
                    <div className="success-message">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Password berhasil direset!
                    </div>
                  )}

                  {forgotPasswordError && (
                    <div className="error-message">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {forgotPasswordError}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="input-label">Password Baru</label>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          value={newPasswordData.password}
                          onChange={(e) => setNewPasswordData(prev => ({ ...prev, password: e.target.value }))}
                          className="input auth-input-pr-11"
                          placeholder="Masukkan password baru"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="auth-password-toggle">
                          {showNewPass ? (
                            <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <input
                          type={showConfirmNewPass ? "text" : "password"}
                          value={newPasswordData.confirmPassword}
                          onChange={(e) => setNewPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="input auth-input-pr-11"
                          placeholder="Ulangi password baru"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                          className="auth-password-toggle">
                          {showConfirmNewPass ? (
                            <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="modal-hint">
                    Password minimal 6 karakter
                  </p>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              {forgotPasswordStep === 'email' && (
                <>
                  <button 
                    onClick={resetForgotPasswordFlow}
                    className="modal-btn-cancel">
                    Batal
                  </button>
                  <button 
                    onClick={handleSendOTP}
                    className="modal-btn-primary">
                    Kirim OTP
                  </button>
                </>
              )}
              
              {forgotPasswordStep === 'otp' && (
                <>
                  <button 
                    onClick={() => setForgotPasswordStep('email')}
                    className="modal-btn-cancel">
                    Kembali
                  </button>
                  <button 
                    onClick={handleVerifyOTP}
                    className="modal-btn-primary">
                    Verifikasi OTP
                  </button>
                </>
              )}
              
              {forgotPasswordStep === 'reset' && (
                <>
                  <button 
                    onClick={() => setForgotPasswordStep('otp')}
                    className="modal-btn-cancel">
                    Kembali
                  </button>
                  <button 
                    onClick={handleResetPassword}
                    className="modal-btn-primary">
                    Reset Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

interface ChangePasswordModalProps {
  show: boolean;
  onClose: () => void;
  onForgotPassword: () => void;
}

export default function ChangePasswordModal({
  show,
  onClose,
  onForgotPassword
}: ChangePasswordModalProps) {
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

  function handleChangePassword() {
    setChangePasswordError("");
    setChangePasswordSuccess(false);

    const { oldPassword, newPassword, confirmPassword } = changePasswordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setChangePasswordError("Semua field harus diisi!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError("Password baru dan konfirmasi tidak sama!");
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError("Password minimal 6 karakter!");
      return;
    }

    // Simulasi verifikasi password lama
    if (oldPassword !== "admin123") {
      setChangePasswordError("Password lama salah!");
      return;
    }

    // Success
    setChangePasswordSuccess(true);
    setTimeout(() => {
      onClose();
      setChangePasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangePasswordError("");
      setChangePasswordSuccess(false);
    }, 2000);
  }

  function handleClose() {
    onClose();
    setChangePasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setChangePasswordError("");
  }

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-lg">
        <div className="modal-header">
          <h3 className="modal-title">Ubah Password</h3>
          <button onClick={handleClose} className="modal-close-btn">
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
                onClick={onForgotPassword}
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
          <button onClick={handleClose} className="modal-btn-cancel">
            Batal
          </button>
          <button onClick={handleChangePassword} className="modal-btn-primary">
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
}

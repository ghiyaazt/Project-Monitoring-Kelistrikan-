import React, { useState } from 'react';

interface PasswordVerificationModalProps {
  show: boolean;
  onClose: () => void;
  onVerify: (password: string) => boolean;
}

const PasswordVerificationModal: React.FC<PasswordVerificationModalProps> = ({
  show,
  onClose,
  onVerify
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!show) return null;

  const handleVerify = () => {
    const isValid = onVerify(password);
    if (!isValid) {
      setError("Password salah! Coba lagi.");
    } else {
      setError("");
      setPassword("");
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Verifikasi Password</h3>
          <button onClick={handleClose} className="modal-close-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Masukkan password Anda untuk melanjutkan edit profil
          </p>

          {error && (
            <div className="alert-error">
              <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Masukkan password"
                className="input input-with-icon"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-btn"
              >
                {showPassword ? (
                  <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleClose} className="modal-btn-cancel">
            Batal
          </button>
          <button onClick={handleVerify} className="modal-btn-primary">
            Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordVerificationModal;

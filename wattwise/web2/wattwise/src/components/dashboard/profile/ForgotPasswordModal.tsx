import { useState, useRef } from "react";

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ show, onClose }: ForgotPasswordModalProps) {
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
      resetForgotPasswordFlow();
    }, 2000);
  }

  function resetForgotPasswordFlow() {
    onClose();
    setForgotPasswordStep('email');
    setForgotEmail("");
    setOtpCode(["", "", "", "", "", ""]);
    setNewPasswordData({ password: "", confirmPassword: "" });
    setForgotPasswordError("");
    setForgotPasswordSuccess(false);
  }

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-lg">
        <div className="modal-header">
          <h3 className="modal-title">
            {forgotPasswordStep === 'email' && 'Lupa Password'}
            {forgotPasswordStep === 'otp' && 'Verifikasi OTP'}
            {forgotPasswordStep === 'reset' && 'Buat Password Baru'}
          </h3>
          <button onClick={resetForgotPasswordFlow} className="modal-close-btn">
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
              <button onClick={resetForgotPasswordFlow} className="modal-btn-cancel">
                Batal
              </button>
              <button onClick={handleSendOTP} className="modal-btn-primary">
                Kirim OTP
              </button>
            </>
          )}
          
          {forgotPasswordStep === 'otp' && (
            <>
              <button onClick={() => setForgotPasswordStep('email')} className="modal-btn-cancel">
                Kembali
              </button>
              <button onClick={handleVerifyOTP} className="modal-btn-primary">
                Verifikasi OTP
              </button>
            </>
          )}
          
          {forgotPasswordStep === 'reset' && (
            <>
              <button onClick={() => setForgotPasswordStep('otp')} className="modal-btn-cancel">
                Kembali
              </button>
              <button onClick={handleResetPassword} className="modal-btn-primary">
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

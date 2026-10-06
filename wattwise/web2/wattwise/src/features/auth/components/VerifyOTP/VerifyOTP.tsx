import { useState, useEffect } from "react";
import { wattwiseIcon, wattwiseText } from "../../../../assets/logos";
import { useApp } from "../../../../context/AppContext";
import OTPInput from "../shared/OTPInput";
import { maskEmail } from "../../../../utils/auth/emailUtils";

interface VerifyOTPProps {
  email: string;
  onVerified: () => void;
  onBackToRegister: () => void;
}

export default function VerifyOTP({ email, onVerified, onBackToRegister }: VerifyOTPProps) {
  const { themeMode, setThemeMode } = useApp();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const maskedEmail = maskEmail(email);

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  function handleOTPChange(newOtp: string[]) {
    setOtp(newOtp);
    setError("");
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Masukkan 6 digit kode OTP");
      return;
    }

    setLoading(true);
    
    // Simulate OTP verification (dalam production, ini akan memanggil API)
    setTimeout(() => {
      // For demo: accept "123456" as valid OTP
      if (otpCode === "123456") {
        setSuccess("Verifikasi berhasil! Mengalihkan...");
        setTimeout(() => {
          setLoading(false);
          onVerified();
        }, 1500);
      } else {
        setLoading(false);
        setError("Kode OTP tidak valid. Coba lagi atau minta kode baru.");
        setOtp(["", "", "", "", "", ""]);
        // OTPInput component auto-focuses first input
      }
    }, 1500);
  }

  function handleResendOTP() {
    setError("");
    setSuccess("");
    setOtp(["", "", "", "", "", ""]);
    setResendCooldown(60); // 60 seconds cooldown
    
    // Simulate sending OTP email
    setTimeout(() => {
      setSuccess("Kode OTP baru telah dikirim ke email Anda!");
      setTimeout(() => setSuccess(""), 3000);
    }, 500);
  }

  return (
    <div className="auth-container">
      {/* Theme Switcher - Top Right */}
      <div className="auth-theme-switcher">
        <div className="auth-theme-toggle-container">
          <div className="auth-theme-toggle-label">
            <svg className="auth-theme-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="auth-theme-toggle-text">Tema Tampilan</span>
          </div>
          <div className="auth-theme-toggle-buttons">
            <button
              onClick={() => setThemeMode('light')}
              className={`auth-theme-toggle-btn ${
                themeMode === 'light'
                  ? 'auth-theme-toggle-btn-active'
                  : 'auth-theme-toggle-btn-inactive'
              }`}
              title="Mode Terang">
              <svg className="auth-theme-toggle-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="auth-theme-toggle-btn-label">Terang</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`auth-theme-toggle-btn ${
                themeMode === 'dark'
                  ? 'auth-theme-toggle-btn-active'
                  : 'auth-theme-toggle-btn-inactive'
              }`}
              title="Mode Gelap">
              <svg className="auth-theme-toggle-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="auth-theme-toggle-btn-label">Gelap</span>
            </button>
            <button
              onClick={() => setThemeMode('system')}
              className={`auth-theme-toggle-btn ${
                themeMode === 'system'
                  ? 'auth-theme-toggle-btn-active'
                  : 'auth-theme-toggle-btn-inactive'
              }`}
              title="Ikuti Sistem">
              <svg className="auth-theme-toggle-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="auth-theme-toggle-btn-label">Sistem</span>
            </button>
          </div>
        </div>
      </div>

      {/* Left brand panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo-row">
          <div className="auth-brand-logo">
            <img 
              src={wattwiseIcon} 
              alt="WattWise" 
              className="auth-brand-logo-icon"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <img 
              src={wattwiseText} 
              alt="WattWise"
              style={{ height: '28px', width: 'auto' }}
            />
            <p className="auth-brand-subtitle">Smart Energy Monitoring</p>
          </div>
        </div>

        <div className="auth-brand-content">
          <div>
            <h2 className="auth-brand-heading">
              Verifikasi <br />Email Anda
            </h2>
            <p className="auth-brand-text">
              Kami telah mengirim kode 6 digit ke email Anda untuk memverifikasi akun.
            </p>
          </div>
          <div className="auth-feature-list">
            {[
              { icon: "📧", label: "Cek Email Anda", sub: "Kode OTP telah dikirim ke inbox atau folder spam" },
              { icon: "⏱️", label: "Kode Valid 10 Menit", sub: "Masukkan kode sebelum waktu habis" },
              { icon: "🔒", label: "Keamanan Terjamin", sub: "Verifikasi 2 langkah untuk melindungi akun" },
            ].map(item => (
              <div key={item.label} className="auth-feature-item">
                <span className="auth-feature-icon">{item.icon}</span>
                <div>
                  <p className="auth-feature-label">{item.label}</p>
                  <p className="auth-feature-desc">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="auth-brand-footer">
            <p className="auth-brand-copyright">© 2026 WattWise. Sistem monitoring listrik berbasis IoT.</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-icon">
              <img 
                src={wattwiseIcon} 
                alt="WattWise" 
                className="auth-brand-logo-icon"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <img 
                src={wattwiseText} 
                alt="WattWise"
                style={{ height: '20px', width: 'auto' }}
              />
              <p className="auth-mobile-logo-subtitle">Smart Monitoring</p>
            </div>
          </div>

          <div className="auth-margin-top-6">
            <button onClick={onBackToRegister} className="auth-back-link">
              <svg className="auth-back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <h1 className="auth-title">Verifikasi Email</h1>
            <p className="auth-subtitle">
              Masukkan kode 6 digit yang dikirim ke<br />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{maskedEmail}</span>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <svg className="auth-password-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <svg className="auth-password-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="my-8">
              <OTPInput
                length={6}
                value={otp}
                onChange={handleOTPChange}
                isDark={themeMode === 'dark'}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || otp.join("").length !== 6}
              className="auth-submit-btn">
              {loading
                ? <><svg className="auth-spinner" fill="none" viewBox="0 0 24 24"><circle className="auth-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="auth-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Memverifikasi...</>
                : "Verifikasi"
              }
            </button>
          </form>

          <div className="auth-margin-top-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Tidak menerima kode?
            </p>
            {resendCooldown > 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Kirim ulang dalam {resendCooldown} detik
              </p>
            ) : (
              <button 
                onClick={handleResendOTP}
                className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                Kirim Ulang Kode
              </button>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
              <strong>Demo Mode:</strong> Gunakan kode <span className="font-mono font-bold">123456</span> untuk verifikasi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

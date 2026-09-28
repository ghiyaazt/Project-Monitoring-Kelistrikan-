import { useState, useEffect } from "react";
import { useApp } from "../../../context/AppContext";

interface ForgotPasswordProps {
  onSendOTP: (email: string) => void;
  onBackToLogin: () => void;
}

// Function to mask email address
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;
  
  // Show first character and last character before @, mask the middle
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  
  const visibleChars = 2; // Show first 2 chars
  const maskedPart = localPart.substring(0, visibleChars) + '***';
  return `${maskedPart}@${domain}`;
}

export default function ForgotPassword({ onSendOTP, onBackToLogin }: ForgotPasswordProps) {
  const { themeMode, setThemeMode, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const userEmail = currentUser?.email || "";
  const maskedEmail = maskEmail(userEmail);

  // Auto send OTP when component mounts if user is logged in
  useEffect(() => {
    if (userEmail && !otpSent) {
      handleSendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSendOTP() {
    if (!userEmail) {
      setError("Email tidak ditemukan");
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      onSendOTP(userEmail);
    }, 1200);
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
              src="/assets/logos/wattwise-icon.png" 
              alt="WattWise" 
              className="auth-brand-logo-icon"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <img 
              src="/assets/logos/wattwise-text.png" 
              alt="WattWise"
              style={{ height: '28px', width: 'auto' }}
            />
            <p className="auth-brand-subtitle">Smart Energy Monitoring</p>
          </div>
        </div>

        <div className="auth-brand-content">
          <div>
            <h2 className="auth-brand-heading">
              Ubah Password Anda
            </h2>
            <p className="auth-brand-text">
              Kode verifikasi telah dikirim ke email Anda. Silakan masukkan kode tersebut untuk melanjutkan proses ubah password.
            </p>
          </div>
          <div className="auth-feature-list">
            {[
              { icon: "🔐", label: "Aman & Terenkripsi", sub: "Proses ubah password yang aman dan terenkripsi" },
              { icon: "📧", label: "Verifikasi Email", sub: "Kode OTP dikirim ke email akun Anda" },
              { icon: "⚡", label: "Proses Cepat", sub: "Ubah password hanya dalam beberapa langkah" },
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
            <p className="auth-brand-copyright">© 2026 WattWise. Sistem monitoring listrik IoT.</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-icon">
              <img 
                src="/assets/logos/wattwise-icon.png" 
                alt="WattWise" 
                className="auth-brand-logo-icon"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <img 
                src="/assets/logos/wattwise-text.png" 
                alt="WattWise"
                style={{ height: '20px', width: 'auto' }}
              />
              <p className="auth-mobile-logo-subtitle">Monitoring</p>
            </div>
          </div>

          <div className="auth-margin-top-6">
            <button onClick={onBackToLogin} className="auth-back-link">
              <svg className="auth-back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <h1 className="auth-title">Ubah Password</h1>
            <p className="auth-subtitle">
              {loading 
                ? "Mengirim kode verifikasi..." 
                : otpSent 
                  ? "Kode OTP telah dikirim ke email Anda" 
                  : "Mengirim kode verifikasi..."}
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

          {otpSent && (
            <div className="auth-input-group">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Kode OTP telah dikirim ke:
                    </p>
                    <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-1">
                      {maskedEmail}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Silakan cek inbox atau folder spam email Anda
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSendOTP} 
                disabled={loading}
                className="w-full px-4 py-3 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? <><svg className="auth-spinner" fill="none" viewBox="0 0 24 24"><circle className="auth-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="auth-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Mengirim Ulang...</>
                  : "Kirim Ulang Kode OTP"
                }
              </button>

              <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                Tidak menerima kode? Cek folder spam atau kirim ulang
              </p>
            </div>
          )}

          {!otpSent && !error && (
            <div className="auth-input-group">
              <div className="flex items-center justify-center py-8">
                <svg className="auth-spinner" fill="none" viewBox="0 0 24 24">
                  <circle className="auth-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="auth-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span className="ml-3 text-slate-600 dark:text-slate-400">Mengirim kode verifikasi...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../../../context/AppContext";

interface RegisterProps {
  onRegister: (data: { nama: string; email: string; nomorTelepon: string; password: string }) => void;
  onBackToLogin: () => void;
}

export default function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const { themeMode, setThemeMode } = useApp();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    nomorTelepon: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Password validation function
  function validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6 || password.length > 10) {
      errors.push("Password harus 6-10 karakter");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Minimal 1 huruf besar");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Minimal 1 huruf kecil");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Minimal 1 angka");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/.test(password)) {
      errors.push("Minimal 1 tanda baca");
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Check password requirements
  const passwordCheck = {
    length: formData.password.length >= 6 && formData.password.length <= 10,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/.test(formData.password),
  };

  const passwordStrength = Object.values(passwordCheck).filter(Boolean).length;

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validasi
    if (!formData.nama || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    // Validate password strength
    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Pass registration data to parent (will trigger OTP verification)
      onRegister({
        nama: formData.nama,
        email: formData.email,
        nomorTelepon: formData.nomorTelepon,
        password: formData.password
      });
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
              Bergabung dengan <br />WattWise
            </h2>
            <p className="auth-brand-text">
              Mulai monitor konsumsi listrik Anda dengan teknologi IoT.
            </p>
          </div>
          <div className="auth-feature-list">
            {[
              { icon: "⚡", label: "Monitoring Real-time", sub: "Pantau daya, tegangan, dan arus secara langsung" },
              { icon: "🔔", label: "Notifikasi Anomali", sub: "Terima alert otomatis saat ada lonjakan tidak wajar" },
              { icon: "📈", label: "Laporan Lengkap", sub: "Analitik konsumsi harian, mingguan, dan bulanan" },
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
              <p className="auth-mobile-logo-subtitle">Smart Monitoring</p>
            </div>
          </div>

          <div className="auth-margin-top-6">
            <button onClick={onBackToLogin} className="auth-back-link">
              <svg className="auth-back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Login
            </button>
            <h1 className="auth-title">Daftar Akun</h1>
            <p className="auth-subtitle">Buat akun untuk mulai monitoring listrik</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg className="auth-password-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-input-group">
            <div>
              <label className="input-label">Nama Lengkap</label>
              <input type="text" value={formData.nama} onChange={e => handleChange("nama", e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="input" />
            </div>

            <div>
              <label className="input-label">Email</label>
              <input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)}
                placeholder="nama@email.com"
                className="input" />
            </div>

            <div>
              <label className="input-label">Nomor Telepon</label>
              <input type="tel" value={formData.nomorTelepon} onChange={e => handleChange("nomorTelepon", e.target.value)}
                placeholder="08xxxxxxxxx"
                className="input" />
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={formData.password} onChange={e => handleChange("password", e.target.value)}
                  placeholder="Buat password kuat"
                  className="input auth-input-pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="auth-password-toggle">
                  {showPass
                    ? <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= level 
                          ? passwordStrength === 5 ? 'bg-green-500' : passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium mb-2 ${
                    passwordStrength === 5 ? 'text-green-600 dark:text-green-400' : 
                    passwordStrength >= 3 ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {passwordStrength === 5 ? 'Password Sangat Kuat' : 
                     passwordStrength >= 3 ? 'Password Cukup Kuat' : 
                     'Password Lemah'}
                  </p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordCheck.length ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {passwordCheck.length ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="10" />}
                      </svg>
                      <span>6-10 karakter</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordCheck.uppercase ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {passwordCheck.uppercase ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="10" />}
                      </svg>
                      <span>Minimal 1 huruf besar (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordCheck.lowercase ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {passwordCheck.lowercase ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="10" />}
                      </svg>
                      <span>Minimal 1 huruf kecil (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordCheck.number ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {passwordCheck.number ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="10" />}
                      </svg>
                      <span>Minimal 1 angka (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordCheck.special ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {passwordCheck.special ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="10" />}
                      </svg>
                      <span>Minimal 1 tanda baca (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="input-label">Konfirmasi Password</label>
              <div className="relative">
                <input type={showConfirmPass ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)}
                  placeholder="Ulangi password"
                  className="input auth-input-pr-11" />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="auth-password-toggle">
                  {showConfirmPass
                    ? <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="auth-submit-btn auth-margin-top-6">
              {loading
                ? <><svg className="auth-spinner" fill="none" viewBox="0 0 24 24"><circle className="auth-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="auth-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Mendaftar...</>
                : "Daftar Sekarang"
              }
            </button>
          </form>

          <p className="auth-margin-top-6 auth-link-text">
            Sudah punya akun? <button onClick={onBackToLogin} className="auth-link-button">Masuk</button>
          </p>
        </div>
      </div>
    </div>
  );
}

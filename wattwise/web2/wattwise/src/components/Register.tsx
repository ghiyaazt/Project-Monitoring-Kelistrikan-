import { useState } from "react";

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export default function Register({ onRegister, onBackToLogin }: RegisterProps) {
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

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister(); 
    }, 1200);
  }

  return (
    <div className="auth-container">
      {/* Left brand panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo-row">
          <div className="auth-brand-logo">
            <svg className="auth-brand-logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="auth-brand-title">WattWise</span>
            <p className="auth-brand-subtitle">Kos Monitoring</p>
          </div>
        </div>

        <div className="auth-brand-content">
          <div>
            <h2 className="auth-brand-heading">
              Bergabung dengan <br />WattWise
            </h2>
            <p className="auth-brand-text">
              Mulai monitor konsumsi listrik kamar kos Anda dengan teknologi IoT & Machine Learning.
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
            <p className="auth-brand-copyright">© 2026 WattWise. Sistem monitoring listrik IoT untuk kos.</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-icon">
              <svg className="auth-brand-logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="auth-mobile-logo-text">WattWise</p>
              <p className="auth-mobile-logo-subtitle">Kos Monitoring</p>
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
                  placeholder="Minimal 6 karakter"
                  className="input auth-input-pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="auth-password-toggle">
                  {showPass
                    ? <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
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

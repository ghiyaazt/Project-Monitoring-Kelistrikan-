import { useState } from "react";
import { useApp } from "../context/AppContext";

interface LoginProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

export default function Login({ onLogin, onGoToRegister }: LoginProps) {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      const name = email.split('@')[0];
      const kamarMatch = email.match(/kamar(\d+)/i);
      const kamar = kamarMatch ? `Kamar ${kamarMatch[1].padStart(2, '0')} - Lantai 2` : "Kamar 03 - Lantai 2";
      
      setUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        kamar: kamar,
        email: email,
        deviceId: "FC24-0041"
      });
      
      onLogin();
    }, 900);
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
            <p className="auth-brand-subtitle">Monitoring</p>
          </div>
        </div>

        <div className="auth-brand-content">
          <div>
            <h2 className="auth-brand-heading">
              Monitoring listrik <br />berbasis IoT & ML
            </h2>
            <p className="auth-brand-text">
              Pantau konsumsi daya real-time, deteksi anomali otomatis, dan kelola efisiensi energi Anda.
            </p>
          </div>
          <div className="auth-feature-list">
            {[
              { icon: "⚡", label: "Real-time via ESP32", sub: "Data daya, tegangan, dan arus langsung dari sensor" },
              { icon: "🔍", label: "Deteksi Anomali ML", sub: "Lonjakan listrik tidak wajar terdeteksi otomatis" },
              { icon: "📊", label: "Riwayat & Analitik", sub: "Tren konsumsi per hari, minggu, dan bulan" },
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
              <svg className="auth-brand-logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="auth-mobile-logo-text">WattWise</p>
              <p className="auth-mobile-logo-subtitle">Monitoring</p>
            </div>
          </div>

          <h1 className="auth-title">Selamat datang</h1>
          <p className="auth-subtitle">Masuk untuk memantau listrik kamar Anda</p>

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
              <label className="input-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="input" />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input auth-input-pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="auth-password-toggle">
                  {showPass
                    ? <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="auth-password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              <div className="auth-forgot-link">
                <button type="button" className="auth-forgot-btn">Lupa password?</button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="auth-submit-btn">
              {loading
                ? <><svg className="auth-spinner" fill="none" viewBox="0 0 24 24"><circle className="auth-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="auth-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Memverifikasi...</>
                : "Masuk"
              }
            </button>
          </form>

          <p className="auth-margin-top-6 auth-link-text">
            Belum punya akun? <button onClick={onGoToRegister} className="auth-link-button">Daftar</button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useApp } from "../../../../context/AppContext";
import { wattwiseIcon, wattwiseText } from "../../../../assets/logos";

interface ContactForRegistrationProps {
  onBackToLogin: () => void;
  onBackToLanding?: () => void;
}

export default function ContactForRegistration({ onBackToLogin, onBackToLanding }: ContactForRegistrationProps) {
  const { themeMode, setThemeMode } = useApp();

  return (
    <div className="auth-container">
      {/* Theme Switcher */}
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
                themeMode === 'light' ? 'auth-theme-toggle-btn-active' : 'auth-theme-toggle-btn-inactive'
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
                themeMode === 'dark' ? 'auth-theme-toggle-btn-active' : 'auth-theme-toggle-btn-inactive'
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
                themeMode === 'system' ? 'auth-theme-toggle-btn-active' : 'auth-theme-toggle-btn-inactive'
              }`}
              title="Sistem">
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
              Daftar akun WattWise
            </h2>
            <p className="auth-brand-text">
              Untuk keamanan dan kualitas layanan, registrasi akun dilakukan melalui verifikasi admin kami.
            </p>
          </div>
          <div className="auth-feature-list">
            {[
              { icon: "📱", label: "Hubungi via WhatsApp", sub: "Chat langsung dengan admin untuk proses pendaftaran" },
              { icon: "📧", label: "Kirim Email", sub: "Kirimkan permintaan akun melalui email resmi" },
              { icon: "📞", label: "Telepon Langsung", sub: "Hubungi tim kami untuk konsultasi dan registrasi" },
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
          {/* Back to Landing Button */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="mb-4 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-watt-blue dark:hover:text-watt-blue-light transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </button>
          )}

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
              <p className="auth-mobile-logo-subtitle">Monitoring</p>
            </div>
          </div>

          <h1 className="auth-title">Daftar Akun Baru</h1>
          <p className="auth-subtitle">Untuk mendaftarkan akun WattWise, silakan hubungi admin kami</p>

          {/* Info Box */}
          <div className="auth-input-group">
            <div className="flex items-start gap-3 p-4 bg-watt-blue-50 dark:bg-watt-blue/20 border border-watt-blue-200 dark:border-watt-blue-700 rounded-lg">
              <div className="w-10 h-10 bg-watt-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="auth-label mb-1">
                  Registrasi Melalui Admin
                </h3>
                <p className="auth-helper-text">
                  Untuk menjaga keamanan dan kualitas layanan, pendaftaran akun baru dilakukan melalui verifikasi admin.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div className="auth-input-group">
            <label className="auth-label mb-3 block">HUBUNGI KAMI MELALUI:</label>
            
            {/* WhatsApp */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-input flex items-center gap-3 mb-3 cursor-pointer hover:border-watt-blue dark:hover:border-watt-blue transition-all">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="auth-label mb-0.5">WhatsApp</div>
                <div className="auth-helper-text">+62 812-3456-7890</div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@wattwise.id"
              className="auth-input flex items-center gap-3 mb-3 cursor-pointer hover:border-watt-blue dark:hover:border-watt-blue transition-all">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="auth-label mb-0.5">Email</div>
                <div className="auth-helper-text">hello@wattwise.id</div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Phone */}
            <a
              href="tel:+6281234567890"
              className="auth-input flex items-center gap-3 cursor-pointer hover:border-watt-blue dark:hover:border-watt-blue transition-all">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="auth-label mb-0.5">Telepon</div>
                <div className="auth-helper-text">+62 812-3456-7890</div>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Back to Login */}
          <p className="auth-margin-top-6 auth-link-text">
            Sudah punya akun? <button onClick={onBackToLogin} className="auth-link-button">Masuk di sini</button>
          </p>
        </div>
      </div>
    </div>
  );
}

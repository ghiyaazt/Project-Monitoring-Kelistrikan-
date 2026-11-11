import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { wattwiseLogoHorizontal } from "../../assets/logos";
import HomeSection from "../../components/landing/landingPage/HomeSection";
import AboutSection from "../../components/landing/landingPage/AboutSection";
import DaftarKosSection from "../../components/landing/landingPage/DaftarKosSection";
import DetailKosSection from "../../components/landing/landingPage/DetailKosSection";
import "../../styles/landing/landing-page.css";

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

export default function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  const { themeMode, setThemeMode, effectiveTheme } = useApp();
  const [activeSection, setActiveSection] = useState<'beranda' | 'daftar-kos' | 'tentang' | 'detail-kos'>('beranda');
  const [selectedKosId, setSelectedKosId] = useState<string | null>(null);

  const handleKosClick = (kosId: string) => {
    setSelectedKosId(kosId);
    setActiveSection('detail-kos');
  };

  const handleBackToDaftarKos = () => {
    setSelectedKosId(null);
    setActiveSection('daftar-kos');
  };

  return (
    <div className={`landing-page ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className={`landing-nav ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
        <div className="landing-nav-container">
          <div className="landing-nav-inner">
            {/* Logo - Horizontal with text - Larger */}
            <div className="landing-logo-container">
              <img 
                src={wattwiseLogoHorizontal} 
                alt="WattWise" 
                className="landing-logo"
              />
            </div>
            
            {/* Navigation Menu */}
            <div className="landing-nav-menu">
              <button
                onClick={() => setActiveSection('beranda')}
                className={`landing-nav-button ${activeSection === 'beranda' ? 'active' : 'inactive'} ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
                Beranda
              </button>
              <button
                onClick={() => setActiveSection('daftar-kos')}
                className={`landing-nav-button ${activeSection === 'daftar-kos' ? 'active' : 'inactive'} ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
                Daftar Kos
              </button>
              <button
                onClick={() => setActiveSection('tentang')}
                className={`landing-nav-button ${activeSection === 'tentang' ? 'active' : 'inactive'} ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
                Tentang Kami
              </button>
            </div>

            {/* Theme Toggle & Auth Buttons */}
            <div className="landing-nav-actions">
              {/* Theme Toggle - 3 Buttons like Auth Pages */}
              <div className={`landing-theme-toggle ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
                <button
                  onClick={() => setThemeMode('light')}
                  className={`landing-theme-button ${themeMode === 'light' ? 'active' : 'inactive'} ${effectiveTheme === 'dark' ? 'dark' : ''}`}
                  title="Mode Terang">
                  <svg className="landing-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`landing-theme-button ${themeMode === 'dark' ? 'active' : 'inactive'} ${effectiveTheme === 'dark' ? 'dark' : ''}`}
                  title="Mode Gelap">
                  <svg className="landing-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
                <button
                  onClick={() => setThemeMode('system')}
                  className={`landing-theme-button ${themeMode === 'system' ? 'active' : 'inactive'} ${effectiveTheme === 'dark' ? 'dark' : ''}`}
                  title="Sistem">
                  <svg className="landing-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <button 
                onClick={onNavigateToLogin}
                className={`landing-login-button ${effectiveTheme === 'dark' ? 'dark' : ''}`}
              >
                Masuk
              </button>
              
              <button className={`landing-menu-button ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
                <svg className="landing-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="landing-content">
        {activeSection === 'beranda' && <HomeSection onNavigateToLogin={onNavigateToLogin} />}
        {activeSection === 'daftar-kos' && <DaftarKosSection onKosClick={handleKosClick} />}
        {activeSection === 'detail-kos' && selectedKosId && (
          <DetailKosSection 
            kosId={selectedKosId} 
            onBack={handleBackToDaftarKos}
            onNavigateToLogin={onNavigateToLogin}
          />
        )}
        {activeSection === 'tentang' && <AboutSection />}
      </div>

      {/* Footer */}
      <footer className={`landing-footer ${effectiveTheme === 'dark' ? 'dark' : ''}`}>
        <div className="landing-footer-container">
          <div className="landing-footer-grid">
            {/* Brand */}
            <div className="landing-footer-brand">
              <div className="landing-footer-logo-container">
                <img 
                  src={wattwiseLogoHorizontal} 
                  alt="WattWise" 
                  className="landing-footer-logo"
                />
              </div>
              <p className="landing-footer-description">
                Solusi cerdas manajemen kos Anda, lengkap dengan monitoring listrik Wattwise secara real-time.
              </p>
            </div>
            
            {/* Jelajahi */}
            <div>
              <h3 className="landing-footer-section-title">Jelajahi</h3>
              <ul className="landing-footer-list">
                <li className="landing-footer-list-item">
                  <button onClick={() => setActiveSection('beranda')} className="landing-footer-link">Beranda</button>
                </li>
                <li className="landing-footer-list-item">
                  <button onClick={() => setActiveSection('daftar-kos')} className="landing-footer-link">Daftar Kos</button>
                </li>
                <li className="landing-footer-list-item">
                  <button onClick={() => setActiveSection('tentang')} className="landing-footer-link">Tentang Kami</button>
                </li>
              </ul>
            </div>

            {/* Akun */}
            <div>
              <h3 className="landing-footer-section-title">Akun</h3>
              <ul className="landing-footer-list">
                <li className="landing-footer-list-item">
                  <button onClick={onNavigateToLogin} className="landing-footer-link">Masuk</button>
                </li>
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="landing-footer-section-title">Kontak</h3>
              <ul className="landing-footer-list">
                <li className="landing-footer-contact-item">
                  <span className="landing-footer-contact-label">EMAIL</span>
                  <span>hello@wattwise.id</span>
                </li>
                <li className="landing-footer-contact-item">
                  <span className="landing-footer-contact-label">TELEPON</span>
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="landing-footer-contact-item">
                  <span className="landing-footer-contact-label">ALAMAT</span>
                  <span>Jl. Asia Afrika No. 8, Bandung 40111</span>
                </li>
                <li className="landing-footer-contact-item">
                  <span className="landing-footer-contact-label">JAM KERJA</span>
                  <span>Senin—Jumat, 08.00—17.00 WIB</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="landing-footer-bottom">
            <p className="landing-footer-copyright">
              © 2024 WattWise. Solusi cerdas manajemen kos Anda.
            </p>
            <p className="landing-footer-powered">
              <span className="landing-footer-powered-brand">WATTWISE</span> POWERED
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

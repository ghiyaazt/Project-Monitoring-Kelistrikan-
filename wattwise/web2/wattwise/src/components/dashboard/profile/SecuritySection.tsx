interface SecuritySectionProps {
  onChangePassword: () => void;
}

export default function SecuritySection({ onChangePassword }: SecuritySectionProps) {
  return (
    <div className="settings-section settings-section-space-y-4">
      <div className="settings-section-header settings-section-header-mb-2">
        <div className="settings-section-icon bg-red-50">
          <svg className="sidebar-logo-icon-svg text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="settings-section-title">Keamanan Akun</h2>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onChangePassword}
          className="security-menu-item">
          <div className="security-menu-item-content">
            <div className="security-menu-icon-box">
              <svg className="security-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <p className="security-menu-title">Ubah Password</p>
              <p className="security-menu-desc">Terakhir diubah 30 hari yang lalu</p>
            </div>
          </div>
          <svg className="security-menu-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button className="security-menu-item">
          <div className="security-menu-item-content">
            <div className="security-menu-icon-box">
              <svg className="security-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="security-menu-title">Perangkat Terhubung</p>
              <p className="security-menu-desc">Kelola perangkat yang dapat mengakses akun</p>
            </div>
          </div>
          <svg className="security-menu-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

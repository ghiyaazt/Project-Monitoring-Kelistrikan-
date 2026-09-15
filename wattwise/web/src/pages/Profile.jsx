function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>Profil</h1>
          <p>Kelola informasi akun dan profil Anda</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* KARTU PROFIL */}
        <section className="profile-card profile-main-card">
          <div className="profile-cover"></div>

          <div className="profile-content">
            <div className="profile-avatar">AD</div>

            <div className="profile-info">
              <h2>Admin KosManager</h2>
              <p>Administrator</p>
            </div>

            <button className="edit-profile-button">✎ Edit Profil</button>
          </div>

          <div className="profile-divider"></div>

          <div className="profile-details">
            <div className="profile-detail">
              <span className="profile-detail-icon">✉</span>
              <div>
                <small>Email</small>
                <p>admin@kosmanager.com</p>
              </div>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-icon">☎</span>
              <div>
                <small>Nomor Telepon</small>
                <p>081234567890</p>
              </div>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-icon">⌂</span>
              <div>
                <small>Nama Kos</small>
                <p>KosManager</p>
              </div>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-icon">▣</span>
              <div>
                <small>Alamat</small>
                <p>Jember, Jawa Timur</p>
              </div>
            </div>
          </div>
        </section>

        {/* INFORMASI AKUN */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Informasi Akun</h2>
              <p>Informasi dasar akun Anda</p>
            </div>
          </div>

          <div className="account-info">
            <div className="account-row">
              <span>Username</span>
              <strong>admin_kos</strong>
            </div>

            <div className="account-row">
              <span>Email</span>
              <strong>admin@kosmanager.com</strong>
            </div>

            <div className="account-row">
              <span>Role</span>
              <span className="role-badge">Administrator</span>
            </div>

            <div className="account-row">
              <span>Status</span>
              <span className="status-badge">
                <i></i> Aktif
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;

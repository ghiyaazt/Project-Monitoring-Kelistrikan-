import { useState } from "react";

function Settings() {
  const [notification, setNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Pengaturan</h1>
          <p>Kelola pengaturan sistem dan preferensi akun</p>
        </div>
      </div>

      <div className="settings-container">
        {/* NOTIFIKASI */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon green-settings">🔔</div>

            <div>
              <h2>Notifikasi</h2>
              <p>Atur bagaimana Anda menerima pemberitahuan</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>Notifikasi Sistem</strong>
              <span>Terima pemberitahuan mengenai aktivitas KosManager</span>
            </div>

            <button
              className={`toggle ${notification ? "on" : ""}`}
              onClick={() => setNotification(!notification)}
            >
              <span></span>
            </button>
          </div>

          <div className="settings-option">
            <div>
              <strong>Notifikasi Email</strong>
              <span>Terima informasi penting melalui email</span>
            </div>

            <button
              className={`toggle ${emailNotification ? "on" : ""}`}
              onClick={() => setEmailNotification(!emailNotification)}
            >
              <span></span>
            </button>
          </div>
        </section>

        {/* TAMPILAN */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon blue-settings">🎨</div>

            <div>
              <h2>Tampilan</h2>
              <p>Atur tampilan aplikasi</p>
            </div>
          </div>

          <div className="settings-option">
            <div>
              <strong>Mode Gelap</strong>
              <span>Gunakan tema gelap pada aplikasi</span>
            </div>

            <button
              className={`toggle ${darkMode ? "on" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <span></span>
            </button>
          </div>
        </section>

        {/* SISTEM */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon orange-settings">⚙</div>

            <div>
              <h2>Sistem</h2>
              <p>Informasi dan konfigurasi sistem</p>
            </div>
          </div>

          <div className="system-info">
            <div>
              <span>Versi Aplikasi</span>
              <strong>v1.0.0</strong>
            </div>

            <div>
              <span>Database</span>
              <strong className="system-active">Terhubung</strong>
            </div>

            <div>
              <span>Status IoT</span>
              <strong className="system-active">● Online</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;

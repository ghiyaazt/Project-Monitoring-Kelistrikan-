import { useState } from "react";
import { pengaturanData } from "../data/mockData";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`settings-toggle ${on ? "settings-toggle-active" : "settings-toggle-inactive"}`}>
      <span className={`settings-toggle-button ${on ? "settings-toggle-button-active" : "settings-toggle-button-inactive"}`} />
    </button>
  );
}

export default function Pengaturan() {
  const [saved, setSaved] = useState(false);
  const [notifAktif, setNotifAktif] = useState(true);
  const [anomaliAlert, setAnomalitAlert] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [profil, setProfil] = useState(pengaturanData.profil);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="settings-container">
      <div>
        <h1 className="heading-xl">Pengaturan</h1>
        <p className="settings-header-text">Pengaturan akun, kamar, notifikasi, dan perangkat IoT</p>
      </div>

      {/* Info Sistem */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon bg-blue-50">
            <svg className="sidebar-logo-icon-svg text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="settings-section-title">Informasi Sistem</h2>
        </div>
        <div className="settings-info-card">
          <p className="settings-info-title">{pengaturanData.namaAplikasi}</p>
          <p className="settings-info-desc">{pengaturanData.deskripsi}</p>
        </div>
        <div className="settings-grid-2 mt-4">
          {[
            { label: "Versi", value: "v2.1.4" },
            { label: "Platform", value: "IoT + ML" },
            { label: "Bahasa", value: "Bahasa Indonesia" },
            { label: "Zona Waktu", value: "WIB (UTC+7)" },
          ].map(item => (
            <div key={item.label} className="settings-grid-item">
              <p className="settings-grid-label">{item.label}</p>
              <p className="settings-grid-value">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifikasi */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon bg-green-50">
            <svg className="sidebar-logo-icon-svg text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="settings-section-title">Notifikasi</h2>
          <span className={`settings-section-badge-right badge ${notifAktif ? "badge-success" : "bg-slate-100 text-slate-500"}`}>
            {notifAktif ? "Aktif" : "Nonaktif"}
          </span>
        </div>
        {[
          { label: "Notifikasi Push", desc: "Aktifkan semua notifikasi push", val: notifAktif, set: setNotifAktif },
          { label: "Alert Anomali Listrik", desc: "Notifikasi saat terdeteksi anomali daya", val: anomaliAlert, set: setAnomalitAlert },
          { label: "Laporan Mingguan", desc: "Ringkasan konsumsi dikirim tiap Senin", val: weeklyReport, set: setWeeklyReport },
        ].map(item => (
          <div key={item.label} className="settings-item">
            <div>
              <p className="settings-item-label">{item.label}</p>
              <p className="settings-item-desc">{item.desc}</p>
            </div>
            <Toggle on={item.val} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Profil Pengguna */}
      <div className="settings-section settings-section-space-y-4">
        <div className="settings-section-header settings-section-header-mb-2">
          <div className="settings-section-icon bg-purple-50">
            <svg className="sidebar-logo-icon-svg text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="settings-section-title">Profil Pengguna</h2>
        </div>

        <div className="settings-profile-card">
          <div className="settings-profile-avatar">
            SB
          </div>
          <div>
            <p className="settings-profile-name">{profil.nama}</p>
            <p className="settings-profile-info">{profil.kamar} · {profil.lantai}</p>
          </div>
        </div>

        <div className="settings-grid-1-sm-2">
          <div>
            <label className="input-label">Nama Lengkap</label>
            <input type="text" value={profil.nama} onChange={e => setProfil(p => ({ ...p, nama: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="input-label">Kamar</label>
            <input type="text" value={profil.kamar} onChange={e => setProfil(p => ({ ...p, kamar: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input type="email" value={profil.email} onChange={e => setProfil(p => ({ ...p, email: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="input-label">No. Telepon</label>
            <input type="tel" value={profil.phone} onChange={e => setProfil(p => ({ ...p, phone: e.target.value }))} className="input" />
          </div>
        </div>

        <div className="settings-grid-2">
          <div className="settings-info-box">
            <p className="settings-info-box-label">Kamar Terdaftar</p>
            <p className="settings-info-box-value">{profil.kamar}</p>
          </div>
          <div className="settings-info-box">
            <p className="settings-info-box-label">Lokasi</p>
            <p className="settings-info-box-value">{profil.lantai}</p>
          </div>
        </div>
      </div>

      <div className="settings-flex-end">
        <button onClick={save}
          className={`settings-save-btn ${saved ? "settings-save-btn-saved" : "settings-save-btn-default"}`}>
          {saved
            ? <><svg className="sidebar-logo-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Tersimpan</>
            : "Simpan Pengaturan"
          }
        </button>
      </div>
    </div>
  );
}

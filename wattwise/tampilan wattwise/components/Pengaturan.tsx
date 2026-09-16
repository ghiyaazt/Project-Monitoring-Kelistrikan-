import { useState } from "react";
import { pengaturanData } from "../data/mockData";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-10 h-6 rounded-full transition ${on ? "bg-green-500" : "bg-slate-200"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-5" : "left-1"}`} />
    </button>
  );
}

export default function Pengaturan() {
  const [saved, setSaved] = useState(false);
  const [notifAktif, setNotifAktif] = useState(true);
  const [anomaliAlert, setAnomalitAlert] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [threshold, setThreshold] = useState("30");
  const [profil, setProfil] = useState(pengaturanData.profil);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 transition";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pengaturan akun, kamar, notifikasi, dan perangkat IoT</p>
      </div>

      {/* Info Sistem */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Informasi Sistem</h2>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-0.5">{pengaturanData.namaAplikasi}</p>
          <p className="text-xs text-blue-600">{pengaturanData.deskripsi}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { label: "Versi", value: "v2.1.4" },
            { label: "Platform", value: "IoT + ML" },
            { label: "Bahasa", value: "Bahasa Indonesia" },
            { label: "Zona Waktu", value: "WIB (UTC+7)" },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifikasi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</h2>
          <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${notifAktif ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
            {notifAktif ? "Aktif" : "Nonaktif"}
          </span>
        </div>
        {[
          { label: "Notifikasi Push", desc: "Aktifkan semua notifikasi push", val: notifAktif, set: setNotifAktif },
          { label: "Alert Anomali Listrik", desc: "Notifikasi saat terdeteksi anomali daya", val: anomaliAlert, set: setAnomalitAlert },
          { label: "Laporan Mingguan", desc: "Ringkasan konsumsi dikirim tiap Senin", val: weeklyReport, set: setWeeklyReport },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
            <Toggle on={item.val} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Perangkat IoT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Perangkat IoT</h2>
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Terhubung</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Device ID", value: pengaturanData.deviceId },
            { label: "Protokol", value: "MQTT / HTTP" },
            { label: "Frekuensi", value: "Setiap 5 detik" },
            { label: "Signal", value: "–62 dBm (Baik)" },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5" style={{ fontFamily: item.label === "Device ID" || item.label === "Signal" ? "'JetBrains Mono', monospace" : undefined }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Batas Anomali (%)</label>
          <div className="flex items-center gap-3">
            <input type="range" min="10" max="100" step="5" value={threshold}
              onChange={e => setThreshold(e.target.value)}
              className="flex-1 accent-green-500" />
            <span className="w-12 text-center text-sm font-bold text-green-600 bg-green-50 rounded-lg py-1 border border-green-200"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>{threshold}%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Anomali terdeteksi saat daya melebihi batas normal sebesar {threshold}%</p>
        </div>
      </div>

      {/* Profil Pengguna */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profil Pengguna</h2>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-slate-200 rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
            SB
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profil.nama}</p>
            <p className="text-sm text-slate-500">{profil.kamar} · {profil.lantai}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
            <input type="text" value={profil.nama} onChange={e => setProfil(p => ({ ...p, nama: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kamar</label>
            <input type="text" value={profil.kamar} onChange={e => setProfil(p => ({ ...p, kamar: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" value={profil.email} onChange={e => setProfil(p => ({ ...p, email: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Telepon</label>
            <input type="tel" value={profil.phone} onChange={e => setProfil(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">Kamar Terdaftar</p>
            <p className="text-sm font-bold text-slate-700">{profil.kamar}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">Lokasi</p>
            <p className="text-sm font-bold text-slate-700">{profil.lantai}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${saved ? "bg-green-100 text-green-700" : "bg-green-600 hover:bg-green-700 text-white"}`}>
          {saved
            ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Tersimpan</>
            : "Simpan Pengaturan"
          }
        </button>
      </div>
    </div>
  );
}

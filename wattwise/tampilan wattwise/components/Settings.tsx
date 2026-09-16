import { useState } from "react";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-10 h-6 rounded-full transition ${on ? "bg-green-500" : "bg-slate-200"}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-5" : "left-1"}`} />
    </button>
  );
}

export default function Settings() {
  const [notif, setNotif] = useState({
    paymentReminder: true,
    overdueAlert: true,
    electricAnomaly: true,
    newTenant: false,
    monthlyReport: true,
  });

  const [iot, setIot] = useState({
    autoDisconnect: false,
    anomalyThreshold: "30",
    reportInterval: "harian",
  });

  const [appearance, setAppearance] = useState({
    language: "id",
    currency: "IDR",
    dateFormat: "DD/MM/YYYY",
  });

  const [saved, setSaved] = useState(false);
  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-0.5">Konfigurasi sistem manajemen kos Anda</p>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</h2>
        </div>

        {[
          { key: "paymentReminder", label: "Pengingat Pembayaran", desc: "Ingatkan penghuni H-3 sebelum jatuh tempo" },
          { key: "overdueAlert", label: "Peringatan Keterlambatan", desc: "Notifikasi saat penghuni melewati jatuh tempo" },
          { key: "electricAnomaly", label: "Anomali Listrik IoT", desc: "Alert saat terdeteksi lonjakan penggunaan listrik tidak wajar" },
          { key: "newTenant", label: "Penghuni Baru", desc: "Notifikasi saat ada penghuni baru ditambahkan" },
          { key: "monthlyReport", label: "Laporan Bulanan", desc: "Kirim ringkasan pendapatan setiap awal bulan" },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
            <Toggle on={(notif as any)[item.key]} onChange={v => setNotif(n => ({ ...n, [item.key]: v }))} />
          </div>
        ))}
      </div>

      {/* IoT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konfigurasi IoT Listrik</h2>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-50">
          <div>
            <p className="text-sm font-medium text-slate-700">Auto-disconnect saat anomali</p>
            <p className="text-xs text-slate-400 mt-0.5">Putus sensor otomatis saat nilai tidak wajar terdeteksi</p>
          </div>
          <Toggle on={iot.autoDisconnect} onChange={v => setIot(i => ({ ...i, autoDisconnect: v }))} />
        </div>

        <div className="py-3 border-b border-slate-50">
          <p className="text-sm font-medium text-slate-700 mb-1.5">Batas Anomali (%)</p>
          <p className="text-xs text-slate-400 mb-3">Penggunaan listrik dianggap anomali jika melebihi batas normal sebesar:</p>
          <div className="flex items-center gap-3">
            <input
              type="range" min="10" max="100" step="5"
              value={iot.anomalyThreshold}
              onChange={e => setIot(i => ({ ...i, anomalyThreshold: e.target.value }))}
              className="flex-1 accent-green-500"
            />
            <span className="w-12 text-center text-sm font-semibold text-green-600 bg-green-50 rounded-lg py-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {iot.anomalyThreshold}%
            </span>
          </div>
        </div>

        <div className="py-3">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Interval Laporan IoT</label>
          <select value={iot.reportInterval} onChange={e => setIot(i => ({ ...i, reportInterval: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
            {["harian", "mingguan", "bulanan"].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tampilan & Regional</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bahasa</label>
            <select value={appearance.language} onChange={e => setAppearance(a => ({ ...a, language: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mata Uang</label>
            <select value={appearance.currency} onChange={e => setAppearance(a => ({ ...a, currency: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
              <option value="IDR">IDR (Rupiah)</option>
              <option value="USD">USD (Dollar)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Format Tanggal</label>
            <select value={appearance.dateFormat} onChange={e => setAppearance(a => ({ ...a, dateFormat: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
              {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Data management */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Manajemen Data</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ekspor Data CSV
          </button>
          <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ekspor Laporan PDF
          </button>
          <button className="px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Reset Data
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${saved ? "bg-green-100 text-green-700" : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Tersimpan
            </>
          ) : "Simpan Semua Pengaturan"}
        </button>
      </div>
    </div>
  );
}

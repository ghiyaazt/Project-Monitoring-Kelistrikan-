import { useState } from "react";

type Tab = "profile" | "settings";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition ${on ? "bg-green-500" : "bg-slate-200"}`}>
      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function MobileProfile() {
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "Hendra Wijaya",
    email: "admin@kos.id",
    phone: "0812-3456-7890",
    kosName: "Kos Bahagia",
    address: "Jl. Merdeka No. 12, Bandung",
    bankName: "BCA",
    bankAccount: "1234567890",
  });
  const [notif, setNotif] = useState({
    paymentReminder: true,
    electricAnomaly: true,
    overdueAlert: true,
    monthlyReport: true,
  });
  const [anomalyThreshold, setAnomalyThreshold] = useState("30");
  const [reportInterval, setReportInterval] = useState("harian");

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500 transition";

  return (
    <div className="pb-4">
      {/* Avatar section */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-green-600 to-blue-700 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            HW
          </div>
          <div>
            <p className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{profileForm.name}</p>
            <p className="text-sm text-white/70">Pemilik Kos</p>
            <p className="text-xs text-white/50 mt-0.5">{profileForm.email}</p>
          </div>
        </div>
      </div>

      {/* Tab switch */}
      <div className="px-4 mb-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {(["profile", "settings"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              {t === "profile" ? "Profil & Kos" : "Pengaturan"}
            </button>
          ))}
        </div>
      </div>

      {tab === "profile" && (
        <div className="px-4 space-y-4">
          {/* Personal */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Data Pribadi</p>
            {[
              { key: "name", label: "Nama Lengkap", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone", label: "No. Telepon", type: "tel" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
                <input type={f.type} value={(profileForm as any)[f.key]}
                  onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className={inputCls} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password Baru</label>
              <input type="password" placeholder="Kosongkan jika tidak diubah" className={inputCls} />
            </div>
          </div>

          {/* Kos info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Info Kos</p>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nama Kos</label>
              <input type="text" value={profileForm.kosName}
                onChange={e => setProfileForm(p => ({ ...p, kosName: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Alamat</label>
              <textarea value={profileForm.address}
                onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Bank */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rekening Bank</p>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Bank</label>
              <select value={profileForm.bankName} onChange={e => setProfileForm(p => ({ ...p, bankName: e.target.value }))}
                className={inputCls}>
                {["BCA", "BNI", "BRI", "Mandiri", "CIMB Niaga"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">No. Rekening</label>
              <input type="text" value={profileForm.bankAccount}
                onChange={e => setProfileForm(p => ({ ...p, bankAccount: e.target.value }))}
                className={inputCls} style={{ fontFamily: "'JetBrains Mono', monospace" }} />
            </div>
          </div>

          <button onClick={save}
            className={`w-full py-4 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 ${saved ? "bg-green-100 text-green-700" : "bg-green-600 text-white"}`}>
            {saved ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Tersimpan</> : "Simpan Perubahan"}
          </button>
        </div>
      )}

      {tab === "settings" && (
        <div className="px-4 space-y-4">
          {/* Notifications */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1">
            <p className="text-sm font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</p>
            {[
              { key: "paymentReminder", label: "Pengingat Pembayaran", desc: "H-3 sebelum jatuh tempo" },
              { key: "overdueAlert", label: "Peringatan Terlambat", desc: "Lewat tanggal jatuh tempo" },
              { key: "electricAnomaly", label: "Anomali Listrik IoT", desc: "Lonjakan tidak wajar" },
              { key: "monthlyReport", label: "Laporan Bulanan", desc: "Ringkasan di awal bulan" },
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

          {/* IoT config */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konfigurasi IoT</p>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-slate-700">Batas Anomali</p>
                <span className="text-sm font-bold text-green-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{anomalyThreshold}%</span>
              </div>
              <input type="range" min="10" max="100" step="5" value={anomalyThreshold}
                onChange={e => setAnomalyThreshold(e.target.value)}
                className="w-full accent-green-500" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10%</span><span>100%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interval Laporan</label>
              <div className="grid grid-cols-3 gap-2">
                {["harian", "mingguan", "bulanan"].map(v => (
                  <button key={v} onClick={() => setReportInterval(v)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition ${reportInterval === v ? "bg-green-600 text-white border-green-600" : "border-slate-200 text-slate-600"}`}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5">
            <p className="text-sm font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Manajemen Data</p>
            <div className="space-y-2">
              {[
                { label: "📄 Ekspor Data CSV", cls: "border-slate-200 text-slate-700" },
                { label: "📊 Ekspor Laporan PDF", cls: "border-slate-200 text-slate-700" },
                { label: "🗑 Reset Semua Data", cls: "border-red-200 text-red-600" },
              ].map(item => (
                <button key={item.label} className={`w-full py-3 rounded-2xl border text-sm font-medium ${item.cls}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={save}
            className={`w-full py-4 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 ${saved ? "bg-green-100 text-green-700" : "bg-green-600 text-white"}`}>
            {saved ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Tersimpan</> : "Simpan Pengaturan"}
          </button>
        </div>
      )}
    </div>
  );
}

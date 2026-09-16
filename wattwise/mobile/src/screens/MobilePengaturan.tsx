import { useState } from "react";
import { pengaturanData } from "../data/mockData";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative w-12 h-7 rounded-full transition ${on ? "bg-green-500" : "bg-slate-200"}`}>
      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

interface Props { onLogout: () => void; }

export default function MobilePengaturan({ onLogout }: Props) {
  const [notifOn, setNotifOn] = useState(true);
  const [anomaliOn, setAnomalitOn] = useState(true);
  const [threshold, setThreshold] = useState("30");

  return (
    <div className="pb-4 space-y-4">
      {/* Profile card */}
      <div className="mx-4 bg-gradient-to-br from-green-600 to-blue-700 rounded-3xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white shrink-0">SB</div>
        <div>
          <p className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pengaturanData.profil.nama}</p>
          <p className="text-sm text-white/70">{pengaturanData.profil.kamar} · {pengaturanData.profil.lantai}</p>
          <p className="text-xs text-white/50 mt-0.5">{pengaturanData.profil.email}</p>
        </div>
      </div>

      {/* Sistem */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-5">
        <p className="text-sm font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Informasi Sistem</p>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-3">
          <p className="text-xs font-semibold text-blue-800">{pengaturanData.namaAplikasi}</p>
          <p className="text-xs text-blue-600 mt-0.5">{pengaturanData.deskripsi}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Versi", value: "v2.1.4" },
            { label: "Platform", value: "IoT + ML" },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifikasi */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-5">
        <p className="text-sm font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</p>
        {[
          { label: "Push Notification", desc: "Semua pemberitahuan", val: notifOn, set: setNotifOn },
          { label: "Alert Anomali Listrik", desc: "Deteksi lonjakan daya", val: anomaliOn, set: setAnomalitOn },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <Toggle on={item.val} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* IoT */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Perangkat IoT</p>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Terhubung</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <p className="text-[10px] text-slate-400 mb-0.5">Device ID</p>
          <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pengaturanData.deviceId}</p>
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <p className="text-sm font-medium text-slate-700">Batas Anomali</p>
            <span className="text-sm font-bold text-green-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{threshold}%</span>
          </div>
          <input type="range" min="10" max="100" step="5" value={threshold}
            onChange={e => setThreshold(e.target.value)} className="w-full accent-green-500" />
        </div>
      </div>

      {/* Logout */}
      <div className="px-4">
        <button onClick={onLogout}
          className="w-full py-4 rounded-2xl border border-red-200 text-red-600 text-sm font-bold flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar dari WattWise
        </button>
      </div>
    </div>
  );
}

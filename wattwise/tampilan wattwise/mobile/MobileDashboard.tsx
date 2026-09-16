import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { realtimeData, realtimeChart, dashboardDevices, anomaliList } from "../data/mockData";

type Page = "dashboard" | "monitoring" | "titiklistrik" | "riwayat" | "anomali" | "notifikasi" | "pengaturan";

interface Props { onNavigate: (p: Page) => void; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-slate-500 mb-0.5">{label}</p>
        <p className="font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{payload[0].value} W</p>
      </div>
    );
  }
  return null;
};

const newAnomalies = anomaliList.filter(a => a.status === "baru");

export default function MobileDashboard({ onNavigate }: Props) {
  return (
    <div className="pb-4 space-y-4">
      {/* Hero */}
      <div className="mx-4 bg-gradient-to-br from-green-600 via-green-700 to-blue-700 rounded-3xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/60">15 September 2026</p>
            <p className="text-sm font-semibold">WattWise — Kamar 03</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] bg-white/20 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            FC24-0041
          </span>
        </div>
        <p className="text-xs text-white/60 mb-0.5">Daya Saat Ini</p>
        <p className="text-4xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{realtimeData.daya} <span className="text-2xl font-medium text-white/70">W</span></p>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-[10px] text-white/60">Tegangan</p>
            <p className="text-base font-bold mt-0.5">{realtimeData.tegangan} V</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-[10px] text-white/60">Arus</p>
            <p className="text-base font-bold mt-0.5">{realtimeData.arus} A</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-[10px] text-white/60">Total</p>
            <p className="text-base font-bold mt-0.5">{realtimeData.totalEnergi} kWh</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konsumsi Daya</p>
          <button onClick={() => onNavigate("monitoring")} className="text-xs text-blue-600 font-medium">Lihat detail →</button>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeChart} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <defs>
                <linearGradient id="mDashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="daya" stroke="#2563eb" strokeWidth={2} fill="url(#mDashGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Perangkat Aktif</p>
          <button onClick={() => onNavigate("titiklistrik")} className="text-xs text-blue-600 font-medium">Lihat semua →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dashboardDevices.map(d => (
            <div key={d.name} className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-1">{d.name}</p>
              <p className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', monospace" }}>{d.watt} <span className="text-sm font-normal text-slate-400">W</span></p>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(d.watt / 260) * 100}%`, backgroundColor: d.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomali alerts */}
      {newAnomalies.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Anomali Terbaru</p>
            <button onClick={() => onNavigate("anomali")} className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
              {newAnomalies.length} Baru
            </button>
          </div>
          {newAnomalies.map(a => (
            <button key={a.id} onClick={() => onNavigate("anomali")}
              className="w-full text-left bg-red-50 border border-red-200 rounded-2xl p-4 mb-2 flex items-start gap-3">
              <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">{a.device}</p>
                <p className="text-xs text-red-600 mt-0.5">{a.watt} W terdeteksi · {a.time}</p>
                <p className="text-[11px] text-red-500 mt-0.5 font-mono">{a.selisihArus}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { anomaliList, detailAnomali } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-slate-500 mb-0.5">{label}</p>
        <p className="font-bold text-red-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{payload[0].value} W</p>
      </div>
    );
  }
  return null;
};

export default function Anomali() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"semua" | "baru" | "ditangani">("semua");

  const filtered = anomaliList.filter(a => filter === "semua" || a.status === filter);
  const totalBaru = anomaliList.filter(a => a.status === "baru").length;
  const selectedItem = anomaliList.find(a => a.id === selected);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Deteksi Anomali</h1>
          <p className="text-sm text-slate-500 mt-0.5">Daftar anomali/kejadian listrik yang terdeteksi dari portal monitor</p>
        </div>
        {totalBaru > 0 && (
          <span className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {totalBaru} Baru
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Anomali", value: anomaliList.length, sub: "7 hari", color: "text-slate-700" },
          { label: "Daya", value: `${detailAnomali.daya} W`, sub: "Saat ini", color: "text-blue-600" },
          { label: "Selisih Arus", value: detailAnomali.selisihArus, sub: "Ampere terkini", color: "text-amber-600" },
          { label: "Status", value: `${totalBaru} Baru`, sub: "Belum ditangani", color: "text-red-600" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1.5">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Anomaly list */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daftar Anomali</h2>
          </div>
          <div className="flex gap-1 mb-4">
            {(["semua", "baru", "ditangani"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${filter === f ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(selected === a.id ? null : a.id)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition ${selected === a.id ? "border-blue-300 bg-blue-50" : a.status === "baru" ? "border-red-200 bg-red-50 hover:border-red-300" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{a.device}</span>
                  <span className="text-[10px] font-mono text-slate-400">{a.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{a.watt} W terdeteksi</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500">{a.selisihArus}</span>
                    {a.status === "baru" && (
                      <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">Baru</span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{a.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail anomali */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
          <h2 className="font-semibold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {selectedItem ? `Detail — ${selectedItem.device}` : "Detail Anomali"}
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {selectedItem ? `Kejadian pada ${selectedItem.time} · ${selectedItem.date}` : "Informasi lengkap kejadian yang baru terdeteksi terkini"}
          </p>

          {/* Status badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-xl text-xs font-bold text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {detailAnomali.status}
            </span>
            <span className="text-xs text-slate-400">{selectedItem?.device ?? detailAnomali.device}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Daya", value: `${selectedItem?.watt ?? detailAnomali.daya} W`, sub: "Saat anomali" },
              { label: "Arus", value: `${detailAnomali.arus} A`, sub: "Saat anomali" },
              { label: "Selisih", value: selectedItem?.selisihArus ?? detailAnomali.selisihArus, sub: "Selisih normal" },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 mb-1">{s.label}</p>
                <p className="text-lg font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-[160px]">
            <p className="text-xs font-semibold text-slate-500 mb-2">Perubahan Konsumsi</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={detailAnomali.chart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="daya" stroke="#ef4444" strokeWidth={2.5} fill="url(#anomGrad)"
                  dot={false} activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Rekomendasi */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 mb-1">Rekomendasi</p>
            <p className="text-xs text-amber-600">{detailAnomali.rekomendasi}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

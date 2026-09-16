import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { anomaliList, detailAnomali } from "../data/mockData";

export default function MobileAnomali() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = anomaliList.find(a => a.id === selected);
  const totalBaru = anomaliList.filter(a => a.status === "baru").length;

  return (
    <div className="pb-4 space-y-4">
      <div className="px-4 text-xs text-slate-400 -mt-1">Daftar anomali kejadian listrik dari portal monitor</div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Anomali</p>
          <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{anomaliList.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-red-500 mb-1">Status Baru</p>
          <p className="text-2xl font-bold text-red-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{totalBaru}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Daya Maks</p>
          <p className="text-xl font-bold text-blue-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{detailAnomali.daya} W</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Selisih Arus</p>
          <p className="text-xl font-bold text-amber-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{detailAnomali.selisihArus}</p>
        </div>
      </div>

      {/* Detail sheet */}
      {selectedItem && (
        <div className="mx-4 bg-white border border-red-200 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ANOMALI
              </span>
              <p className="text-sm font-bold text-slate-800 mt-2">{selectedItem.device}</p>
              <p className="text-xs text-slate-400">{selectedItem.time} · {selectedItem.date}</p>
            </div>
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Daya", value: `${selectedItem.watt} W` },
              { label: "Arus", value: `${detailAnomali.arus} A` },
              { label: "Selisih", value: `${selectedItem.selisihArus}` },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 mb-0.5">{s.label}</p>
                <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={detailAnomali.chart} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                <defs>
                  <linearGradient id="mAnomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="daya" stroke="#ef4444" strokeWidth={2} fill="url(#mAnomGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-xs font-semibold text-amber-700">Rekomendasi</p>
            <p className="text-xs text-amber-600 mt-0.5">{detailAnomali.rekomendasi}</p>
          </div>
        </div>
      )}

      {/* List */}
      <div className="px-4 space-y-2">
        {anomaliList.map(a => (
          <button key={a.id} onClick={() => setSelected(selected === a.id ? null : a.id)}
            className={`w-full text-left rounded-2xl border px-4 py-3.5 transition active:scale-[0.99] ${
              selected === a.id ? "border-blue-300 bg-blue-50" :
              a.status === "baru" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
            }`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{a.device}</span>
                {a.status === "baru" && <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">Baru</span>}
              </div>
              <span className="text-xs font-mono text-slate-400">{a.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{a.watt} W terdeteksi · {a.date}</span>
              <span className="text-xs font-bold text-red-500 font-mono">{a.selisihArus}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

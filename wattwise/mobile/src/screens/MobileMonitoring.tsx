import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { realtimeData, realtimeChart } from "../data/mockData";

export default function MobileMonitoring() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);
  const liveDaya = realtimeData.daya + Math.floor(Math.sin(tick * 0.7) * 18);

  return (
    <div className="pb-4 space-y-4">
      <div className="px-4 text-xs text-slate-400 -mt-1">
        Data dari {realtimeData.deviceName} · {realtimeData.deviceId}
      </div>

      {/* Stat cards */}
      <div className="px-4 grid grid-cols-1 gap-3">
        {[
          { label: "Daya Saat Ini", value: liveDaya, unit: "W", sub: "46 menit lalu", color: "text-blue-600 bg-blue-50 border-blue-200", live: true },
          { label: "Tegangan", value: realtimeData.tegangan, unit: "V", sub: "Stabil", color: "text-green-600 bg-green-50 border-green-200", live: false },
          { label: "Arus", value: realtimeData.arus, unit: "A", sub: "42 menit lalu", color: "text-purple-600 bg-purple-50 border-purple-200", live: false },
        ].map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-5 flex items-center justify-between ${c.color}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-xs font-semibold ${c.color.split(" ")[0]}`}>{c.label}</p>
                {c.live && <span className="flex items-center gap-1 text-[9px] text-green-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live</span>}
              </div>
              <p className="text-xs text-slate-400">{c.sub}</p>
            </div>
            <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {c.value} <span className="text-lg text-slate-400">{c.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-5">
        <p className="text-sm font-bold text-slate-800 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grafik Real-time</p>
        <p className="text-xs text-slate-400 mb-4">Pembaruan otomatis setiap detik</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeChart} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <defs>
                <linearGradient id="mMonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <ReferenceLine y={500} stroke="#f59e0b" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="daya" stroke="#2563eb" strokeWidth={2.5} fill="url(#mMonGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-white border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Status Sensor</p>
          <p className="text-sm font-bold text-green-600">{realtimeData.sensorStatus}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{realtimeData.deviceName}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">Last Update</p>
          <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{realtimeData.lastUpdate}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">WIB</p>
        </div>
      </div>
    </div>
  );
}

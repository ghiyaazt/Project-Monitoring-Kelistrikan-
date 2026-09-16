import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { realtimeData, realtimeChart } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-slate-500 mb-0.5">{label}</p>
        <p className="font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{payload[0].value} W</p>
      </div>
    );
  }
  return null;
};

export default function Monitoring() {
  const [tick, setTick] = useState(0);

  // Simulate live update every 3s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const liveDaya = realtimeData.daya + Math.floor(Math.sin(tick * 0.7) * 18);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Monitoring Real-time</h1>
          <p className="text-sm text-slate-500 mt-0.5">Data listrik yang diterima dari {realtimeData.deviceName} atau {realtimeData.deviceId}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Daya Saat Ini",
            value: liveDaya,
            unit: "W",
            sub: "46 menit lalu",
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-200",
            live: true,
          },
          {
            label: "Tegangan",
            value: realtimeData.tegangan,
            unit: "V",
            sub: "Stabil",
            color: "text-green-600",
            bg: "bg-green-50 border-green-200",
            live: false,
          },
          {
            label: "Arus",
            value: realtimeData.arus,
            unit: "A",
            sub: "42 menit lalu",
            color: "text-purple-600",
            bg: "bg-purple-50 border-purple-200",
            live: false,
          },
        ].map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-6 ${c.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-semibold ${c.color}`}>{c.label}</p>
              {c.live && <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live</span>}
            </div>
            <p className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {c.value}
              <span className="text-xl font-medium text-slate-400 ml-1">{c.unit}</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Real-time chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Grafik Real-time</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pembaruan otomatis setiap detik</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />Daya (W)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 rounded-full inline-block border-t border-dashed" />Batas Normal</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeChart} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="monGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 600]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={500} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: "Batas 500W", position: "insideTopRight", fontSize: 10, fill: "#f59e0b" }} />
              <Area type="monotone" dataKey="daya" stroke="#2563eb" strokeWidth={2.5} fill="url(#monGrad)"
                dot={false} activeDot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Status Sensor</p>
            <p className="text-lg font-bold text-green-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{realtimeData.sensorStatus}</p>
            <p className="text-xs text-slate-400">{realtimeData.deviceName} · {realtimeData.deviceId}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Last Update</p>
            <p className="text-lg font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{realtimeData.lastUpdate}</p>
            <p className="text-xs text-slate-400">Senin, 15 September 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

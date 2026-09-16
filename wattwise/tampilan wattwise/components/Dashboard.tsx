import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { realtimeData, realtimeChart, dashboardDevices, anomaliList } from "../data/mockData";

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

const statCards = [
  {
    label: "Daya Saat Ini",
    value: `${realtimeData.daya} W`,
    sub: "46 menit lalu",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    dot: "bg-blue-500",
  },
  {
    label: "Tegangan",
    value: `${realtimeData.tegangan} V`,
    sub: "Stabil",
    color: "text-green-600 bg-green-50 border-green-100",
    dot: "bg-green-500",
  },
  {
    label: "Arus",
    value: `${realtimeData.arus} A`,
    sub: "42 menit lalu",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    dot: "bg-purple-500",
  },
  {
    label: "Total Energi",
    value: `${realtimeData.totalEnergi} kWh`,
    sub: "Hari ini",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    dot: "bg-amber-500",
  },
];

const newAnomalies = anomaliList.filter(a => a.status === "baru");

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Analisis data listrik yang diterima dari {realtimeData.deviceId}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {realtimeData.sensorStatus}
          </span>
          <span className="text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {realtimeData.lastUpdate}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-5 flex flex-col gap-2 border-slate-200`}>
            <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full w-fit border ${c.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {c.label}
            </div>
            <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
            <p className="text-xs text-slate-400">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Konsumsi Daya chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konsumsi Daya</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time dari ESP32 — 15 September 2026</p>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Hari Ini</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="daya" stroke="#2563eb" strokeWidth={2} fill="url(#dashGrad)"
                  dot={false} activeDot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Per-device mini row */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-4 gap-3">
            {dashboardDevices.map(d => (
              <div key={d.name} className="text-center">
                <p className="text-xs text-slate-400 truncate">{d.name}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.watt} W</p>
                <div className="h-1 rounded-full mt-1.5" style={{ backgroundColor: d.color + "33" }}>
                  <div className="h-full rounded-full" style={{ backgroundColor: d.color, width: `${(d.watt / 240) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomali Terbaru */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Anomali Terbaru</h2>
            {newAnomalies.length > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                {newAnomalies.length} Baru
              </span>
            )}
          </div>

          <div className="space-y-3 flex-1">
            {anomaliList.slice(0, 4).map(a => (
              <div key={a.id} className={`p-3 rounded-xl border flex items-start gap-3 ${a.status === "baru" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.status === "baru" ? "bg-red-500" : "bg-slate-400"}`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{a.device}</p>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{a.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{a.watt} W terdeteksi</p>
                  <p className={`text-[11px] font-bold mt-0.5 ${a.selisihArus < 0 ? "text-red-500" : "text-green-500"}`}>{a.selisihArus}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total anomali hari ini</span>
              <span className="font-bold text-red-600">7 kejadian</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-500">Daya maks. anomali</span>
              <span className="font-bold text-slate-700 font-mono">612 W</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

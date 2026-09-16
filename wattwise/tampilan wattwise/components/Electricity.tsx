import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { rooms, electricHistory, weekLabels } from "../data/mockData";

const statusColor: Record<string, string> = {
  occupied: "bg-green-400",
  vacant: "bg-slate-300",
  maintenance: "bg-amber-400",
};

function UsageBar({ usage, budget, anomaly }: { usage: number; budget: number; anomaly: boolean }) {
  const pct = Math.min((usage / budget) * 100, 100);
  const over = usage > budget;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{usage} kWh</span>
        <span className="text-slate-400">/ {budget} kWh</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${over || anomaly ? "bg-red-500" : pct > 80 ? "bg-amber-400" : "bg-green-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-slate-500 mb-1">{label}</p>
        <p className="font-semibold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {payload[0].value} kWh
        </p>
      </div>
    );
  }
  return null;
};

export default function Electricity() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "anomaly" | "occupied">("all");

  const selectedRoom = rooms.find(r => r.id === selected);
  const chartData = selected
    ? weekLabels.map((d, i) => ({ day: d, usage: electricHistory[selected]?.[i] ?? 0 }))
    : [];

  const filtered = rooms.filter(r => {
    if (filter === "anomaly") return r.anomaly;
    if (filter === "occupied") return r.status === "occupied";
    return true;
  });

  const totalUsage = rooms.reduce((a, r) => a + r.electricUsage, 0);
  const anomalyCount = rooms.filter(r => r.anomaly).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Monitor Listrik IoT</h1>
          <p className="text-sm text-slate-500 mt-0.5">Penggunaan listrik real-time per kamar — September 2026</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
          {anomalyCount > 0 && (
            <span className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {anomalyCount} Anomali
            </span>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Konsumsi", value: `${totalUsage} kWh`, sub: "bulan ini", color: "text-blue-600 bg-blue-50" },
          { label: "Rata-rata/Kamar", value: `${Math.round(totalUsage / rooms.filter(r => r.status === "occupied").length)} kWh`, sub: "kamar terisi", color: "text-green-600 bg-green-50" },
          { label: "Kamar Anomali", value: anomalyCount, sub: "perlu ditindak", color: "text-red-600 bg-red-50" },
          { label: "Estimasi Tagihan", value: "Rp 2.847.000", sub: "berdasarkan konsumsi", color: "text-amber-600 bg-amber-50" },
        ].map(c => (
          <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className={`text-xs font-semibold mb-2 px-2 py-0.5 rounded-full w-fit ${c.color}`}>{c.label}</div>
            <p className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Room list */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konsumsi Per Kamar</h2>
            <div className="flex gap-1">
              {(["all", "occupied", "anomaly"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${filter === f ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {f === "all" ? "Semua" : f === "occupied" ? "Terisi" : "Anomali"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map(room => (
              <button
                key={room.id}
                onClick={() => setSelected(selected === room.id ? null : room.id)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition ${selected === room.id ? "border-blue-300 bg-blue-50" : room.anomaly ? "border-red-200 bg-red-50 hover:border-red-300" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusColor[room.status]}`} />
                  <span className="text-sm font-semibold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Kamar {room.number}
                  </span>
                  <span className="text-xs text-slate-500">{room.type}</span>
                  {room.anomaly && (
                    <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Anomali
                    </span>
                  )}
                  {!room.anomaly && room.status === "occupied" && <span className="ml-auto" />}
                </div>
                <UsageBar usage={room.electricUsage} budget={room.electricBudget} anomaly={room.anomaly} />
                {room.anomaly && room.anomalyNote && (
                  <p className="text-[11px] text-red-500 mt-1.5">{room.anomalyNote}</p>
                )}
                {room.tenant && (
                  <p className="text-[11px] text-slate-400 mt-1">{room.tenant.name}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chart panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
          <h2 className="font-semibold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {selectedRoom ? `Tren Kamar ${selectedRoom.number}` : "Pilih Kamar"}
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            {selectedRoom ? "Konsumsi 7 hari terakhir (kWh)" : "Klik kamar untuk melihat tren penggunaan"}
          </p>

          {selectedRoom ? (
            <>
              <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <defs>
                      <linearGradient id="elGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedRoom.anomaly ? "#ef4444" : "#16a34a"} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={selectedRoom.anomaly ? "#ef4444" : "#16a34a"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={selectedRoom.electricBudget} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Batas", position: "insideTopRight", fontSize: 10, fill: "#f59e0b" }} />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke={selectedRoom.anomaly ? "#ef4444" : "#16a34a"}
                      strokeWidth={2}
                      fill="url(#elGrad)"
                      dot={{ r: 3, fill: selectedRoom.anomaly ? "#ef4444" : "#16a34a", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Penghuni</span>
                  <span className="font-medium text-slate-700">{selectedRoom.tenant?.name ?? "—"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Tipe Kamar</span>
                  <span className="font-medium text-slate-700">{selectedRoom.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Konsumsi Bulan Ini</span>
                  <span className="font-medium text-slate-700 font-mono">{selectedRoom.electricUsage} kWh</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Batas Normal</span>
                  <span className="font-medium text-slate-700 font-mono">{selectedRoom.electricBudget} kWh</span>
                </div>
                {selectedRoom.anomaly && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs font-semibold text-red-600 mb-1">⚠ Anomali Terdeteksi</p>
                    <p className="text-[11px] text-red-500">{selectedRoom.anomalyNote}</p>
                    <button className="mt-2 text-[11px] font-semibold text-red-600 underline">Kirim Notifikasi ke Penghuni</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-slate-300">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm text-center">Pilih kamar di sebelah kiri untuk melihat grafik konsumsi listrik</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { rooms, electricHistory, weekLabels } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-slate-500 mb-0.5">{label}</p>
        <p className="font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{payload[0].value} kWh</p>
      </div>
    );
  }
  return null;
};

export default function MobileElectricity() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "anomaly">("all");

  const selectedRoom = rooms.find(r => r.id === selected);
  const chartData = selected ? weekLabels.map((d, i) => ({ day: d, usage: electricHistory[selected]?.[i] ?? 0 })) : [];
  const filtered = filter === "anomaly" ? rooms.filter(r => r.anomaly) : rooms.filter(r => r.status === "occupied");

  const totalUsage = rooms.reduce((a, r) => a + r.electricUsage, 0);

  return (
    <div className="pb-4 space-y-4">
      {/* Header stats */}
      <div className="mx-4 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs text-blue-500 font-medium">Total Konsumsi</p>
          <p className="text-xl font-bold text-blue-700 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{totalUsage} kWh</p>
          <p className="text-[10px] text-blue-400 mt-0.5">bulan ini</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs text-red-500 font-medium">Anomali</p>
          <p className="text-xl font-bold text-red-700 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{rooms.filter(r => r.anomaly).length} kamar</p>
          <p className="text-[10px] text-red-400 mt-0.5">perlu ditindak</p>
        </div>
      </div>

      {/* Chart for selected room */}
      {selectedRoom && (
        <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kamar {selectedRoom.number}</p>
              <p className="text-xs text-slate-400">{selectedRoom.tenant?.name ?? "—"}</p>
            </div>
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-36 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                <defs>
                  <linearGradient id="mElGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedRoom.anomaly ? "#ef4444" : "#16a34a"} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={selectedRoom.anomaly ? "#ef4444" : "#16a34a"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={selectedRoom.electricBudget} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} />
                <Area
                  type="monotone" dataKey="usage"
                  stroke={selectedRoom.anomaly ? "#ef4444" : "#16a34a"}
                  strokeWidth={2.5} fill="url(#mElGrad)"
                  dot={{ r: 3.5, fill: selectedRoom.anomaly ? "#ef4444" : "#16a34a", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <div className="text-center">
              <p className="text-slate-400">Penggunaan</p>
              <p className="font-bold text-slate-700 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selectedRoom.electricUsage} kWh</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Batas</p>
              <p className="font-bold text-amber-600 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selectedRoom.electricBudget} kWh</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Status</p>
              <p className={`font-bold mt-0.5 ${selectedRoom.anomaly ? "text-red-600" : "text-green-600"}`}>{selectedRoom.anomaly ? "Anomali" : "Normal"}</p>
            </div>
          </div>
          {selectedRoom.anomaly && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-xs font-semibold text-red-600 mb-1">⚠ {selectedRoom.anomalyNote}</p>
              <button className="text-xs font-bold text-red-600 underline">Kirim peringatan ke penghuni</button>
            </div>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="px-4 flex gap-2">
        {(["all", "anomaly"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition ${filter === f ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
            {f === "all" ? "Semua Terisi" : "Anomali Saja"}
          </button>
        ))}
      </div>

      {/* Room list */}
      <div className="px-4 space-y-2">
        {filtered.map(room => {
          const pct = Math.min((room.electricUsage / room.electricBudget) * 100, 100);
          const over = room.electricUsage > room.electricBudget;
          return (
            <button
              key={room.id}
              onClick={() => setSelected(selected === room.id ? null : room.id)}
              className={`w-full text-left rounded-2xl border px-4 py-4 transition active:scale-[0.99] ${
                selected === room.id ? "border-blue-300 bg-blue-50" :
                room.anomaly ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  room.anomaly ? "bg-red-500 text-white" : "bg-green-100 text-green-700"
                }`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {room.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{room.tenant?.name ?? "Kosong"}</p>
                  <p className="text-xs text-slate-400">{room.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: over ? "#ef4444" : "#0f172a" }}>
                    {room.electricUsage} kWh
                  </p>
                  <p className="text-[10px] text-slate-400">/ {room.electricBudget} kWh</p>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${over || room.anomaly ? "bg-red-500" : pct > 80 ? "bg-amber-400" : "bg-green-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {room.anomaly && room.anomalyNote && (
                <p className="text-[11px] text-red-500 mt-2">{room.anomalyNote}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { devices } from "../data/mockData";

const statusMap: Record<string, { label: string; cls: string; dot: string }> = {
  aktif: { label: "Aktif", cls: "bg-green-100 text-green-700", dot: "bg-green-500" },
  normal: { label: "Normal", cls: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  anomali: { label: "Anomali", cls: "bg-red-100 text-red-700", dot: "bg-red-500" },
  mati: { label: "Mati", cls: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

const barColors: Record<string, string> = {
  aktif: "#16a34a",
  normal: "#2563eb",
  anomali: "#ef4444",
  mati: "#94a3b8",
};

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

const totalDaya = devices.reduce((a, d) => a + d.watt, 0);

export default function TitikListrik() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Titik Listrik</h1>
        <p className="text-sm text-slate-500 mt-0.5">Monitoring perangkat elektronik penggunaan listrik</p>
      </div>

      {/* Device cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map(d => {
          const s = statusMap[d.status];
          return (
            <div key={d.id} className={`bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 ${d.status === "anomali" ? "ring-2 ring-red-300 ring-offset-1" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{d.icon}</span>
                <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500">{d.name}</p>
                <p className="text-3xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {d.watt}
                  <span className="text-base font-medium text-slate-400 ml-1">W</span>
                </p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(d.watt / 300) * 100}%`, backgroundColor: barColors[d.status] }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Perbandingan Daya Perangkat</h2>
            <p className="text-xs text-slate-400 mt-0.5">Total daya aktif: {totalDaya} W</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">15 Sep 2026</span>
        </div>

        {/* Horizontal bars */}
        <div className="space-y-4 mb-6">
          {devices.map(d => {
            const pct = Math.round((d.watt / 300) * 100);
            return (
              <div key={d.id} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-28 shrink-0">
                  <span className="text-base">{d.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{d.name}</span>
                </div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: barColors[d.status] }}
                  />
                </div>
                <span className="w-14 text-right text-sm font-bold text-slate-700 shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {d.watt} W
                </span>
              </div>
            );
          })}
        </div>

        {/* Bar chart */}
        <div className="h-48 border-t border-slate-100 pt-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={devices.map(d => ({ name: d.name, watt: d.watt, status: d.status }))} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="watt" radius={[6, 6, 0, 0]}>
                {devices.map(d => <Cell key={d.id} fill={barColors[d.status]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Detail Perangkat</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {["Perangkat", "Daya", "% dari Total", "Status"].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {devices.map(d => {
              const s = statusMap[d.status];
              const pct = ((d.watt / totalDaya) * 100).toFixed(1);
              return (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{d.icon}</span>
                      <span className="font-medium text-slate-800">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.watt} W</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColors[d.status] }} />
                      </div>
                      <span className="text-xs text-slate-500">{pct}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 w-fit text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

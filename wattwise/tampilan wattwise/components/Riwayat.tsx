import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { riwayatHarian, riwayatStats } from "../data/mockData";

type Periode = "7 Hari" | "30 Hari" | "3 Bulan";

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

export default function Riwayat() {
  const [periode, setPeriode] = useState<Periode>("7 Hari");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Riwayat Konsumsi</h1>
          <p className="text-sm text-slate-500 mt-0.5">Melihat data penggunaan listrik berdasarkan periode</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(["7 Hari", "30 Hari", "3 Bulan"] as Periode[]).map(p => (
            <button key={p} onClick={() => setPeriode(p)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${periode === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Periode", value: riwayatStats.periode, sub: "Per siklus", color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Total Energi", value: `${riwayatStats.totalEnergi} kWh`, sub: "Periode", color: "text-green-600 bg-green-50 border-green-200" },
          { label: "Rata-rata", value: `${riwayatStats.rataRata} kWh`, sub: "Per hari", color: "text-purple-600 bg-purple-50 border-purple-200" },
          { label: "Anomali", value: `${riwayatStats.anomali} kejadian`, sub: "Per hari", color: "text-red-600 bg-red-50 border-red-200" },
        ].map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-5 ${c.color}`}>
            <p className={`text-xs font-semibold mb-1.5 ${c.color.split(" ")[0]}`}>{c.label}</p>
            <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Riwayat chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Riwayat Konsumsi</h2>
            <p className="text-xs text-slate-400 mt-0.5">kWh per hari — {periode} terakhir</p>
          </div>
          <span className="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            Avg {riwayatStats.rataRata} kWh/hari
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riwayatHarian} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="riwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 7]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="kwh" stroke="#16a34a" strokeWidth={2.5} fill="url(#riwGrad)"
                dot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#16a34a", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-day breakdown table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rincian Per Hari</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {["Hari", "Tanggal", "Konsumsi (kWh)", "Vs Rata-rata", "Estimasi Biaya"].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {riwayatHarian.map((d, i) => {
              const diff = d.kwh - riwayatStats.rataRata;
              const isHighest = d.kwh === Math.max(...riwayatHarian.map(x => x.kwh));
              return (
                <tr key={i} className={`hover:bg-slate-50 transition ${isHighest ? "bg-amber-50/50" : ""}`}>
                  <td className="py-3 font-semibold text-slate-800">{d.hari}</td>
                  <td className="py-3 text-slate-500 text-xs">{d.tanggal}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.kwh}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(d.kwh / 6) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold ${diff > 0 ? "text-amber-600" : "text-green-600"}`}>
                      {diff > 0 ? "+" : ""}{diff.toFixed(2)} kWh
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Rp {Math.round(d.kwh * 1444.7).toLocaleString("id-ID")}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-slate-200">
            <tr>
              <td colSpan={2} className="pt-3 text-xs font-semibold text-slate-500">TOTAL</td>
              <td className="pt-3 font-bold text-slate-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{riwayatStats.totalEnergi} kWh</td>
              <td className="pt-3" />
              <td className="pt-3 text-xs font-bold text-slate-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Rp {Math.round(riwayatStats.totalEnergi * 1444.7).toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

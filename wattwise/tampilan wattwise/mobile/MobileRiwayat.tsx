import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { riwayatHarian, riwayatStats } from "../data/mockData";

export default function MobileRiwayat() {
  return (
    <div className="pb-4 space-y-4">
      <div className="px-4 text-xs text-slate-400 -mt-1">Melihat data penggunaan listrik berdasarkan periode</div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {[
          { label: "Periode", value: riwayatStats.periode, color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Total Energi", value: `${riwayatStats.totalEnergi} kWh`, color: "text-green-600 bg-green-50 border-green-200" },
          { label: "Rata-rata/Hari", value: `${riwayatStats.rataRata} kWh`, color: "text-purple-600 bg-purple-50 border-purple-200" },
          { label: "Anomali", value: `${riwayatStats.anomali} kejadian`, color: "text-red-600 bg-red-50 border-red-200" },
        ].map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-4 ${c.color}`}>
            <p className={`text-xs font-semibold mb-1 ${c.color.split(" ")[0]}`}>{c.label}</p>
            <p className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-5">
        <p className="text-sm font-bold text-slate-800 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Riwayat Konsumsi</p>
        <p className="text-xs text-slate-400 mb-4">7 Hari Terakhir (kWh)</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riwayatHarian} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <defs>
                <linearGradient id="mRiwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="kwh" stroke="#16a34a" strokeWidth={2.5} fill="url(#mRiwGrad)"
                dot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day list */}
      <div className="px-4 space-y-2">
        {riwayatHarian.map((d, i) => {
          const diff = d.kwh - riwayatStats.rataRata;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600">{d.hari}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{d.tanggal}</p>
                  <p className={`text-xs font-medium ${diff > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(2)} vs rata-rata
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.kwh} kWh</p>
                <p className="text-[10px] text-slate-400">Rp {Math.round(d.kwh * 1444.7).toLocaleString("id-ID")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { devices } from "../data/mockData";

const statusMap: Record<string, { cls: string; dot: string; label: string }> = {
  aktif: { cls: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Aktif" },
  normal: { cls: "bg-blue-100 text-blue-700", dot: "bg-blue-500", label: "Normal" },
  anomali: { cls: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Anomali" },
  mati: { cls: "bg-slate-100 text-slate-500", dot: "bg-slate-400", label: "Mati" },
};

const barColors: Record<string, string> = { aktif: "#16a34a", normal: "#2563eb", anomali: "#ef4444", mati: "#94a3b8" };
const totalDaya = devices.reduce((a, d) => a + d.watt, 0);

export default function MobileTitikListrik() {
  return (
    <div className="pb-4 space-y-4">
      <div className="px-4 text-xs text-slate-400 -mt-1">Monitoring perangkat elektronik penggunaan listrik</div>

      {/* Device cards */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {devices.map(d => {
          const s = statusMap[d.status];
          return (
            <div key={d.id} className={`bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 ${d.status === "anomali" ? "ring-2 ring-red-300 ring-offset-1" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{d.icon}</span>
                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400">{d.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {d.watt} <span className="text-sm font-normal text-slate-400">W</span>
                </p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(d.watt / 300) * 100}%`, backgroundColor: barColors[d.status] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison bars */}
      <div className="mx-4 bg-white border border-slate-200 rounded-3xl p-5">
        <p className="text-sm font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Perbandingan Daya Perangkat</p>
        <p className="text-xs text-slate-400 mb-4">Total: {totalDaya} W</p>
        <div className="space-y-4">
          {devices.map(d => (
            <div key={d.id} className="flex items-center gap-3">
              <span className="text-lg w-7 shrink-0">{d.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{d.name}</span>
                  <span className="font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.watt} W</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.watt / 300) * 100}%`, backgroundColor: barColors[d.status] }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

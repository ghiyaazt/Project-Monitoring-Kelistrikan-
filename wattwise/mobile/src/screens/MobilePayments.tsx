import { useState } from "react";
import { payments, rooms } from "../data/mockData";

function fmt(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return "Rp " + n.toLocaleString("id-ID");
}

const months = ["September 2026", "Agustus 2026"];

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  paid: { label: "Lunas", bg: "bg-green-100", text: "text-green-700" },
  pending: { label: "Belum Bayar", bg: "bg-amber-100", text: "text-amber-700" },
  overdue: { label: "Terlambat", bg: "bg-red-100", text: "text-red-700" },
};

export default function MobilePayments() {
  const [month, setMonth] = useState("September 2026");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ room: "", method: "Transfer Bank" });

  const monthPay = payments.filter(p => p.month === month);
  const filtered = monthPay.filter(p => filter === "all" || p.status === filter);

  const paidTotal = monthPay.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const pendingTotal = monthPay.filter(p => p.status !== "paid").reduce((a, p) => a + p.amount, 0);

  return (
    <div className="pb-4 space-y-4">
      {/* Summary card */}
      <div className="mx-4 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-5 text-white">
        <p className="text-xs text-white/70 mb-0.5">Terbayar {month}</p>
        <p className="text-3xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{fmt(paidTotal)}</p>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-[10px] text-white/60">Belum Lunas</p>
            <p className="text-sm font-bold">{fmt(pendingTotal)}</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-[10px] text-white/60">Terlambat</p>
            <p className="text-sm font-bold">{monthPay.filter(p => p.status === "overdue").length} kamar</p>
          </div>
        </div>
      </div>

      {/* Month selector */}
      <div className="px-4 flex gap-2">
        {months.map(m => (
          <button key={m} onClick={() => setMonth(m)}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-semibold transition ${month === m ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
            {m.replace(" 2026", "")}
          </button>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-1">
        {(["all", "paid", "pending", "overdue"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
              filter === f ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-500"
            }`}>
            {f === "all" ? "Semua" : f === "paid" ? "Lunas" : f === "pending" ? "Belum Bayar" : "Terlambat"}
          </button>
        ))}
      </div>

      {/* Payment list */}
      <div className="px-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">Tidak ada data</div>
        ) : filtered.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-2xl px-4 py-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${statusMap[p.status].bg} ${statusMap[p.status].text}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {p.roomNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{p.tenantName}</p>
                <p className="text-xs text-slate-400">{p.method ?? (p.status === "paid" ? "—" : "Menunggu pembayaran")}</p>
                {p.paidAt && <p className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.paidAt}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-slate-800">{fmt(p.amount)}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMap[p.status].bg} ${statusMap[p.status].text}`}>
                  {statusMap[p.status].label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div className="px-4">
        <button onClick={() => setShowAdd(true)}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Catat Pembayaran
        </button>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full p-6 space-y-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Catat Pembayaran</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Kamar</label>
              <select value={addForm.room} onChange={e => setAddForm(f => ({ ...f, room: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Pilih kamar...</option>
                {rooms.filter(r => r.status === "occupied").map(r => (
                  <option key={r.id} value={r.number}>Kamar {r.number} — {r.tenant?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Metode</label>
              <div className="grid grid-cols-3 gap-2">
                {["Transfer Bank", "QRIS", "Cash"].map(m => (
                  <button key={m} onClick={() => setAddForm(f => ({ ...f, method: m }))}
                    className={`py-3 rounded-2xl text-xs font-semibold border transition ${addForm.method === m ? "bg-green-600 text-white border-green-600" : "border-slate-200 text-slate-600"}`}>
                    {m === "Transfer Bank" ? "🏦 Transfer" : m === "QRIS" ? "📱 QRIS" : "💵 Cash"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAdd(false)} className="py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600">Batal</button>
              <button onClick={() => setShowAdd(false)} className="py-3.5 rounded-2xl bg-green-600 text-white text-sm font-bold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

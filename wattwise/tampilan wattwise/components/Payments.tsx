import { useState } from "react";
import { payments, rooms } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function fmt(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const months = ["September 2026", "Agustus 2026"];

const statusMap: Record<string, { label: string; cls: string }> = {
  paid: { label: "Lunas", cls: "bg-green-100 text-green-700" },
  pending: { label: "Belum Bayar", cls: "bg-amber-100 text-amber-700" },
  overdue: { label: "Terlambat", cls: "bg-red-100 text-red-700" },
};

const methodIcons: Record<string, string> = {
  "Transfer Bank": "🏦",
  "QRIS": "📱",
  "Cash": "💵",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="text-slate-500 mb-1">{label}</p>
        <p className="font-semibold text-slate-800">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Payments() {
  const [month, setMonth] = useState("September 2026");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ room: "", amount: "", method: "Transfer Bank", note: "" });

  const filtered = payments
    .filter(p => p.month === month)
    .filter(p => statusFilter === "all" || p.status === statusFilter);

  const monthPayments = payments.filter(p => p.month === month);
  const paidTotal = monthPayments.filter(p => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const pendingTotal = monthPayments.filter(p => p.status === "pending").reduce((a, p) => a + p.amount, 0);
  const overdueTotal = monthPayments.filter(p => p.status === "overdue").reduce((a, p) => a + p.amount, 0);

  const barData = [
    { name: "Lunas", value: paidTotal, fill: "#16a34a" },
    { name: "Belum Bayar", value: pendingTotal, fill: "#f59e0b" },
    { name: "Terlambat", value: overdueTotal, fill: "#ef4444" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Manajemen Pembayaran</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau status pembayaran sewa seluruh kamar</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Catat Pembayaran
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Terbayar", value: paidTotal, count: monthPayments.filter(p => p.status === "paid").length, color: "border-l-green-500 bg-green-50", text: "text-green-700" },
          { label: "Belum Bayar", value: pendingTotal, count: monthPayments.filter(p => p.status === "pending").length, color: "border-l-amber-500 bg-amber-50", text: "text-amber-700" },
          { label: "Terlambat", value: overdueTotal, count: monthPayments.filter(p => p.status === "overdue").length, color: "border-l-red-500 bg-red-50", text: "text-red-700" },
        ].map(c => (
          <div key={c.label} className={`bg-white border border-slate-200 border-l-4 rounded-2xl p-5 ${c.color}`}>
            <p className={`text-xs font-semibold mb-1 ${c.text}`}>{c.label}</p>
            <p className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{fmt(c.value)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.count} transaksi</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="font-semibold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ringkasan {month}</h2>
          <p className="text-xs text-slate-400 mb-4">Distribusi status pembayaran (Rupiah)</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v / 1000000)}jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map(b => <Cell key={b.name} fill={b.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-1">
              {months.map(m => (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${month === m ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {(["all", "paid", "pending", "overdue"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${statusFilter === f ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {f === "all" ? "Semua" : f === "paid" ? "Lunas" : f === "pending" ? "Belum" : "Terlambat"}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  {["Kamar", "Penghuni", "Jumlah", "Status", "Metode", "Tgl Bayar"].map(h => (
                    <th key={h} className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-400">Tidak ada data</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition group">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-600 font-semibold">{p.roomNumber}</td>
                    <td className="py-3 pr-4 text-slate-700 font-medium">{p.tenantName}</td>
                    <td className="py-3 pr-4 text-slate-700 font-medium">{fmt(p.amount)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${statusMap[p.status].cls}`}>
                        {statusMap[p.status].label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">
                      {p.method ? <span>{methodIcons[p.method] ?? ""} {p.method}</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 text-slate-500 text-xs font-mono">
                      {p.paidAt ? p.paidAt : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add payment modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Catat Pembayaran</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kamar</label>
                <select value={addForm.room} onChange={e => setAddForm(f => ({ ...f, room: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Pilih kamar...</option>
                  {rooms.filter(r => r.status === "occupied").map(r => (
                    <option key={r.id} value={r.number}>Kamar {r.number} — {r.tenant?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Jumlah (Rp)</label>
                <input type="number" value={addForm.amount} onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="800000" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Metode Pembayaran</label>
                <select value={addForm.method} onChange={e => setAddForm(f => ({ ...f, method: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  {["Transfer Bank", "QRIS", "Cash"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan</label>
                <input type="text" value={addForm.note} onChange={e => setAddForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="Opsional..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

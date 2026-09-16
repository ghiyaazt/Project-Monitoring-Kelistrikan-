import { useState } from "react";
import { notifications } from "../data/mockData";
import type { Notification } from "../data/mockData";

const typeStyle: Record<Notification["type"], { bg: string; border: string; icon: string; iconBg: string; title: string }> = {
  anomali: {
    bg: "bg-red-50", border: "border-red-200",
    icon: "⚠", iconBg: "bg-red-100 text-red-600",
    title: "text-red-700",
  },
  peringatan: {
    bg: "bg-amber-50", border: "border-amber-200",
    icon: "⚠", iconBg: "bg-amber-100 text-amber-600",
    title: "text-amber-700",
  },
  info: {
    bg: "bg-green-50", border: "border-green-200",
    icon: "✓", iconBg: "bg-green-100 text-green-700",
    title: "text-green-700",
  },
};

export default function Notifikasi() {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<"semua" | "belum" | "anomali">("semua");

  const unread = items.filter(n => !n.read).length;

  const filtered = items.filter(n => {
    if (filter === "belum") return !n.read;
    if (filter === "anomali") return n.type === "anomali";
    return true;
  });

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</h1>
          <p className="text-sm text-slate-500 mt-0.5">Riwayat pemberitahuan anomali listrik dan peringatan</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl transition">
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Belum Dibaca", value: unread, color: "text-red-600 bg-red-50 border-red-200" },
          { label: "Total", value: items.length, color: "text-slate-700 bg-slate-50 border-slate-200" },
          { label: "Anomali", value: items.filter(n => n.type === "anomali").length, color: "text-amber-600 bg-amber-50 border-amber-200" },
        ].map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-4 text-center ${c.color}`}>
            <p className={`text-2xl font-bold ${c.color.split(" ")[0]}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["semua", "belum", "anomali"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${filter === f ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
            {f === "semua" ? "Semua" : f === "belum" ? "Belum Dibaca" : "Anomali"}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">Tidak ada notifikasi.</div>
        ) : filtered.map(n => {
          const s = typeStyle[n.type];
          return (
            <div key={n.id}
              className={`border rounded-2xl p-4 flex items-start gap-4 transition ${n.read ? "bg-white border-slate-200 opacity-75" : `${s.bg} ${s.border}`}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${s.iconBg}`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className={`text-sm font-bold ${n.read ? "text-slate-700" : s.title}`}>{n.title}</p>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="mt-2 text-xs text-blue-600 font-medium hover:underline">
                    Tandai dibaca
                  </button>
                )}
              </div>
              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { notifications } from "../data/mockData";
import type { Notification } from "../data/mockData";

const typeStyle: Record<Notification["type"], { bg: string; border: string; iconBg: string; icon: string }> = {
  anomali: { bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100 text-red-600", icon: "⚠" },
  peringatan: { bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100 text-amber-600", icon: "⚠" },
  info: { bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-100 text-green-700", icon: "✓" },
};

export default function MobileNotifikasi() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;

  return (
    <div className="pb-4 space-y-4">
      <div className="px-4 -mt-1 flex items-center justify-between">
        <p className="text-xs text-slate-400">Riwayat pemberitahuan anomali dan peringatan</p>
        {unread > 0 && (
          <button onClick={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
            className="text-xs text-blue-600 font-medium">Baca semua</button>
        )}
      </div>

      {/* Unread badge */}
      {unread > 0 && (
        <div className="mx-4 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <p className="text-xs font-semibold text-blue-700">{unread} notifikasi belum dibaca</p>
        </div>
      )}

      {/* List */}
      <div className="px-4 space-y-2.5">
        {items.map(n => {
          const s = typeStyle[n.type];
          return (
            <div key={n.id} className={`border rounded-2xl p-4 flex items-start gap-3 ${n.read ? "bg-white border-slate-200 opacity-80" : `${s.bg} ${s.border}`}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${s.iconBg}`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-slate-800">{n.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 mt-0.5">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                {!n.read && (
                  <button onClick={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className="mt-1.5 text-xs text-blue-600 font-medium">Tandai dibaca</button>
                )}
              </div>
              {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

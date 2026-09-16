type Page = "dashboard" | "monitoring" | "titiklistrik" | "riwayat" | "anomali" | "notifikasi" | "pengaturan";

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
  unreadCount?: number;
  anomalyCount?: number;
}

const nav: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    id: "titiklistrik",
    label: "Titik Listrik",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    id: "riwayat",
    label: "Riwayat",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    id: "anomali",
    label: "Anomali",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
  {
    id: "notifikasi",
    label: "Notifikasi",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

export default function Sidebar({ current, onNavigate, onLogout, collapsed, onToggle, unreadCount = 2, anomalyCount = 3 }: SidebarProps) {
  const badges: Partial<Record<Page, number>> = {
    notifikasi: unreadCount,
    anomali: anomalyCount,
  };

  return (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[230px]"}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-slate-100 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>WattWise</p>
              <p className="text-[10px] text-slate-400">Kos Monitoring</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
        <button onClick={onToggle} className={`text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100 ${collapsed ? "absolute left-[58px] top-5" : ""}`}>
          {collapsed
            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          }
        </button>
      </div>

      {/* IoT status pill */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-green-700 truncate">FC24-0041 · Terhubung</p>
              <p className="text-[9px] text-green-500">Update: 10:42:31</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {!collapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-1">Menu</p>}
        {nav.map((item) => {
          const active = current === item.id;
          const badge = badges[item.id];
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition relative ${collapsed ? "justify-center" : ""} ${active ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <span className={active ? "text-green-600" : "text-slate-400"}>{item.icon}</span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && badge && badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.id === "anomali" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>{badge}</span>
              )}
              {!collapsed && active && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
              {collapsed && badge && badge > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-3">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">SB</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">Salsabila</p>
              <p className="text-[10px] text-slate-400">Kamar 03 · Lantai 2</p>
            </div>
          </div>
        )}
        <button onClick={onLogout} title={collapsed ? "Keluar" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition ${collapsed ? "justify-center" : ""}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}

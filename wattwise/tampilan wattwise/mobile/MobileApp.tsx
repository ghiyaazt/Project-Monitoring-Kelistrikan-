import { useState } from "react";
import MobileLogin from "./MobileLogin";
import MobileDashboard from "./MobileDashboard";
import MobileMonitoring from "./MobileMonitoring";
import MobileTitikListrik from "./MobileTitikListrik";
import MobileRiwayat from "./MobileRiwayat";
import MobileAnomali from "./MobileAnomali";
import MobileNotifikasi from "./MobileNotifikasi";
import MobilePengaturan from "./MobilePengaturan";
import { notifications, anomaliList } from "../data/mockData";

type Page = "dashboard" | "monitoring" | "titiklistrik" | "riwayat" | "anomali" | "notifikasi" | "pengaturan";

const bottomTabs: { id: Page; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Beranda",
    icon: (a) => <svg className={`w-6 h-6 ${a ? "text-green-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 2.5 : 1.75}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>,
  },
  {
    id: "monitoring",
    label: "Monitor",
    icon: (a) => <svg className={`w-6 h-6 ${a ? "text-green-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 2.5 : 1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    id: "anomali",
    label: "Anomali",
    icon: (a) => <svg className={`w-6 h-6 ${a ? "text-green-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 2.5 : 1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
  {
    id: "notifikasi",
    label: "Notif",
    icon: (a) => <svg className={`w-6 h-6 ${a ? "text-green-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 2.5 : 1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: (a) => <svg className={`w-6 h-6 ${a ? "text-green-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={a ? 2.5 : 1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  monitoring: "Monitoring Real-time",
  titiklistrik: "Titik Listrik",
  riwayat: "Riwayat",
  anomali: "Deteksi Anomali",
  notifikasi: "Notifikasi",
  pengaturan: "Pengaturan",
};

// Extra pages accessible via other navigation (from cards)
const extraPages: { id: Page; label: string }[] = [
  { id: "titiklistrik", label: "Titik Listrik" },
  { id: "riwayat", label: "Riwayat" },
];

interface Props {
  loggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function MobileApp({ loggedIn, onLogin, onLogout }: Props) {
  const [page, setPage] = useState<Page>("dashboard");

  const unreadCount = notifications.filter(n => !n.read).length;
  const anomalyCount = anomaliList.filter(a => a.status === "baru").length;

  if (!loggedIn) return <MobileLogin onLogin={onLogin} />;

  function renderPage() {
    switch (page) {
      case "dashboard": return <MobileDashboard onNavigate={setPage} />;
      case "monitoring": return <MobileMonitoring />;
      case "titiklistrik": return <MobileTitikListrik />;
      case "riwayat": return <MobileRiwayat />;
      case "anomali": return <MobileAnomali />;
      case "notifikasi": return <MobileNotifikasi />;
      case "pengaturan": return <MobilePengaturan onLogout={onLogout} />;
    }
  }

  const isBottomTab = bottomTabs.some(t => t.id === page);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shrink-0">
        <div className="px-5 pt-3 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isBottomTab && (
              <button onClick={() => setPage("dashboard")} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mr-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {pageTitles[page]}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
            <button onClick={() => setPage("notifikasi")} className="relative w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pt-4">
        {renderPage()}
      </main>

      {/* Bottom nav */}
      <nav className="bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-stretch">
          {bottomTabs.map(tab => {
            const active = page === tab.id;
            const badge = tab.id === "anomali" ? anomalyCount : tab.id === "notifikasi" ? unreadCount : 0;
            return (
              <button key={tab.id} onClick={() => setPage(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition relative ${active ? "text-green-600" : "text-slate-400"}`}>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-500 rounded-full" />}
                <div className="relative">
                  {tab.icon(active)}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">{badge}</span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-green-600" : "text-slate-400"}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

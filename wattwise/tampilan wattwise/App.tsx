import { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Monitoring from "./components/Monitoring";
import TitikListrik from "./components/TitikListrik";
import Riwayat from "./components/Riwayat";
import Anomali from "./components/Anomali";
import Notifikasi from "./components/Notifikasi";
import Pengaturan from "./components/Pengaturan";
import MobileApp from "./mobile/MobileApp";
import { useIsMobile } from "./hooks/useIsMobile";
import { notifications, anomaliList } from "./data/mockData";

type Page = "dashboard" | "monitoring" | "titiklistrik" | "riwayat" | "anomali" | "notifikasi" | "pengaturan";

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  monitoring: "Monitoring Real-time",
  titiklistrik: "Titik Listrik",
  riwayat: "Riwayat Konsumsi",
  anomali: "Deteksi Anomali",
  notifikasi: "Notifikasi",
  pengaturan: "Pengaturan",
};

function DesktopApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [mobileLoggedIn, setMobileLoggedIn] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const anomalyCount = anomaliList.filter(a => a.status === "baru").length;

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  function renderPage() {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "monitoring": return <Monitoring />;
      case "titiklistrik": return <TitikListrik />;
      case "riwayat": return <Riwayat />;
      case "anomali": return <Anomali />;
      case "notifikasi": return <Notifikasi />;
      case "pengaturan": return <Pengaturan />;
    }
  }

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar
          current={page} onNavigate={setPage}
          onLogout={() => setLoggedIn(false)}
          collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}
          unreadCount={unreadCount} anomalyCount={anomalyCount}
        />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-50">
            <Sidebar current={page}
              onNavigate={p => { setPage(p); setMobileMenuOpen(false); }}
              onLogout={() => { setLoggedIn(false); setMobileMenuOpen(false); }}
              collapsed={false} onToggle={() => setMobileMenuOpen(false)}
              unreadCount={unreadCount} anomalyCount={anomalyCount}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-700 transition" onClick={() => setMobileMenuOpen(true)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h2 className="text-sm font-semibold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pageTitles[page]}</h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">WattWise — Kos Monitoring IoT · Salsabila · Kamar 03</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Mobile preview */}
            <button onClick={() => setShowMobilePreview(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile Preview
            </button>

            {/* Notification */}
            <button onClick={() => setPage("notifikasi")}
              className="relative text-slate-400 hover:text-slate-600 transition p-2 rounded-xl hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Avatar */}
            <button onClick={() => setPage("pengaturan")}
              className="flex items-center gap-2.5 hover:bg-slate-100 rounded-xl px-2.5 py-1.5 transition">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">SB</div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-700 leading-tight">Salsabila</p>
                <p className="text-[10px] text-slate-400">Kamar 03 · Lantai 2</p>
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>

      {/* Mobile preview modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-between w-full max-w-[400px]">
              <div>
                <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Mobile Preview</h3>
                <p className="text-white/50 text-xs mt-0.5">WattWise · Tampilan mobile app</p>
              </div>
              <button onClick={() => setShowMobilePreview(false)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Phone frame */}
            <div className="relative">
              <div className="w-[375px] h-[780px] bg-slate-900 rounded-[52px] p-3 shadow-2xl ring-1 ring-white/10">
                <div className="w-full h-full bg-slate-50 rounded-[42px] overflow-hidden flex flex-col relative">
                  {/* Dynamic island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-slate-900 rounded-full z-10" />
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-8 pt-14 pb-1 bg-white text-[10px] shrink-0">
                    <span className="font-semibold text-slate-900">9:41</span>
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M1.42 9a15.91 15.91 0 014.7-2.88M10.71 5.05A16 16 0 0122.56 9M5 12.55a10.94 10.94 0 015.17-2.39M16.72 11.06A10.94 10.94 0 0119 12.55M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="18" height="11" rx="2"/><path d="M22 11v3" strokeWidth="2" strokeLinecap="round" stroke="currentColor" fill="none"/></svg>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <MobileApp loggedIn={mobileLoggedIn} onLogin={() => setMobileLoggedIn(true)} onLogout={() => setMobileLoggedIn(false)} />
                  </div>
                  <div className="h-6 bg-white flex items-center justify-center shrink-0">
                    <div className="w-28 h-1 bg-slate-900/20 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="absolute left-[-4px] top-[130px] w-1 h-10 bg-slate-700 rounded-l-full" />
              <div className="absolute left-[-4px] top-[160px] w-1 h-14 bg-slate-700 rounded-l-full" />
              <div className="absolute left-[-4px] top-[185px] w-1 h-14 bg-slate-700 rounded-l-full" />
              <div className="absolute right-[-4px] top-[155px] w-1 h-20 bg-slate-700 rounded-r-full" />
            </div>
            <p className="text-white/30 text-xs">Login: salsabila@wattwise.id / kamar03</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const [loggedIn, setLoggedIn] = useState(false);

  if (isMobile) {
    return <MobileApp loggedIn={loggedIn} onLogin={() => setLoggedIn(true)} onLogout={() => setLoggedIn(false)} />;
  }
  return <DesktopApp />;
}

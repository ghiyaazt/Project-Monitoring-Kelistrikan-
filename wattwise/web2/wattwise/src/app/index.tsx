import { useState } from "react";
import Login from "../app/page/Login/Login";
import Register from "../app/page/Register/Register";
import Sidebar from "../app/components/Sidebar";
import Dashboard from "../app/page/Dashboard/Dashboard";
import Monitoring from "../app/page/Monitoring/Monitoring";
import SmartWattwise from "../app/page/SmartWattwise/SmartWattwise";
import Pengaturan from "../app/page/Pengaturan/Pengaturan";
import Profil from "../app/page/Profil/Profil";
import { notifications, anomaliList } from "../data/mockData";

type Page = "dashboard" | "monitoring" | "smartwattwise" | "pengaturan" | "profil";
type AuthView = "login" | "register";

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  monitoring: "Monitoring Real-time",
  smartwattwise: "Smart Wattwise",
  pengaturan: "Pengaturan",
  profil: "Profil Pengguna",
};

function DesktopApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [page, setPage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const anomalyCount = anomaliList.filter(a => a.status === "baru").length;

  if (!loggedIn) {
    if (authView === "register") {
      return <Register 
        onRegister={() => setLoggedIn(true)} 
        onBackToLogin={() => setAuthView("login")} 
      />;
    }
    return <Login onLogin={() => setLoggedIn(true)} onGoToRegister={() => setAuthView("register")} />;
  }

  function renderPage() {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "monitoring": return <Monitoring />;
      case "smartwattwise": return <SmartWattwise />;
      case "pengaturan": return <Pengaturan />;
      case "profil": return <Profil />;
    }
  }

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar
          current={page === "pengaturan" || page === "profil" ? "dashboard" : page} 
          onNavigate={setPage}
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
            <Sidebar current={page === "pengaturan" || page === "profil" ? "dashboard" : page}
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
            <p className="text-[11px] text-slate-400 hidden sm:block">WattWise — Smart Energy Monitoring · Admin</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notification */}
            <div className="relative">
              <button onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {showNotifPopup && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifPopup(false)} />
                  <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{unreadCount} baru</span>
                        )}
                      </div>
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <p className="text-sm text-slate-500">Tidak ada notifikasi</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} 
                            className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${!notif.read ? "bg-blue-50/30" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                notif.type === "anomali" ? "bg-red-100 text-red-600" : 
                                notif.type === "peringatan" ? "bg-amber-100 text-amber-600" : 
                                "bg-blue-100 text-blue-600"
                              }`}>
                                {notif.type === "anomali" ? (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                ) : notif.type === "peringatan" ? (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-sm font-semibold text-slate-800 leading-tight">{notif.title}</p>
                                  {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-slate-200 bg-slate-50">
                        <button className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition">
                          Lihat Semua Notifikasi
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Avatar & Profile Popup */}
            <div className="relative">
              <button onClick={() => setShowProfilePopup(!showProfilePopup)}
                className="flex items-center gap-2.5 hover:bg-slate-100 rounded-xl px-2.5 py-1.5 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">AD</div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-700 leading-tight">Admin</p>
                  <p className="text-[10px] text-slate-400">WattWise Monitor</p>
                </div>
                <svg className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${showProfilePopup ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Popup */}
              {showProfilePopup && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                  <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Profile Header */}
                    <div className="p-4 bg-gradient-to-br from-green-400 to-blue-600">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-base font-bold text-white border-2 border-white/30">
                          AD
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">Admin</p>
                          <p className="text-xs text-white/80">admin@wattwise.id</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setPage("pengaturan");
                          setShowProfilePopup(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition text-left group">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Pengaturan</p>
                          <p className="text-xs text-slate-500">Kelola akun & preferensi</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setPage("profil");
                          setShowProfilePopup(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition text-left group">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Profil</p>
                          <p className="text-xs text-slate-500">Lihat & edit profil</p>
                        </div>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-200 my-1"></div>

                    {/* Logout */}
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setLoggedIn(false);
                          setShowProfilePopup(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-600 transition text-left group">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-600 group-hover:text-red-600 transition">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Keluar</p>
                          <p className="text-xs text-slate-500">Logout dari akun</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return <DesktopApp />;
}

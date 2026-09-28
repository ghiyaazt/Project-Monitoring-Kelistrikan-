import { useState } from "react";
import { useApp } from "../context/AppContext";
import Login from "../app/page/Login/Login";
import Register from "../app/page/Register/Register";
import VerifyOTP from "../app/page/VerifyOTP/VerifyOTP";
import ForgotPassword from "../app/page/ForgotPassword/ForgotPassword";
import ResetPassword from "../app/page/ResetPassword/ResetPassword";
import Sidebar from "../app/components/Sidebar";
import Dashboard from "../app/page/Dashboard/Dashboard";
import Monitoring from "../app/page/Monitoring/Monitoring";
import SmartWattwise from "../app/page/SmartWattwise/SmartWattwise";
import Pengaturan from "../app/page/Pengaturan/Pengaturan";
import Profil from "../app/page/Profil/Profil";
import { notifications, anomaliList } from "../data/mockData";

type Page = "dashboard" | "monitoring" | "smartwattwise" | "pengaturan" | "profil";
type AuthView = "login" | "register" | "verify-otp" | "forgot-password" | "verify-otp-forgot" | "reset-password";

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  monitoring: "Monitoring Real-time",
  smartwattwise: "Smart Wattwise",
  pengaturan: "Pengaturan",
  profil: "Profil Pengguna",
};

function DesktopApp() {
  const { themeMode, setThemeMode, effectiveTheme, currentUser, logout, setUser } = useApp();
  const [authView, setAuthView] = useState<AuthView>("login");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const anomalyCount = anomaliList.filter(a => a.status === "baru").length;
  
  // Check if user is logged in based on currentUser from context
  const loggedIn = currentUser !== null;

  if (!loggedIn) {
    // Forgot Password Flow
    if (authView === "forgot-password") {
      return <ForgotPassword 
        onSendOTP={(email) => {
          setRegistrationEmail(email);
          setAuthView("verify-otp-forgot");
        }}
        onBackToLogin={() => setAuthView("login")} 
      />;
    }
    
    if (authView === "verify-otp-forgot") {
      return <VerifyOTP 
        email={registrationEmail}
        onVerified={() => {
          setAuthView("reset-password");
        }}
        onBackToRegister={() => setAuthView("forgot-password")} 
      />;
    }
    
    if (authView === "reset-password") {
      return <ResetPassword 
        email={registrationEmail}
        onResetSuccess={() => {
          // After password reset, go back to login
          setAuthView("login");
        }}
        onBackToLogin={() => setAuthView("login")} 
      />;
    }
    
    // Register Flow
    if (authView === "verify-otp") {
      return <VerifyOTP 
        email={registrationEmail}
        onVerified={() => {
          // After OTP verified, save user data and login
          if (registrationData) {
            setUser({
              name: registrationData.nama,
              email: registrationData.email,
              deviceId: "ESP32_NEW_USER"
            });
          }
        }}
        onBackToRegister={() => setAuthView("register")} 
      />;
    }
    
    if (authView === "register") {
      return <Register 
        onRegister={(data) => {
          // Save registration data temporarily and go to OTP verification
          setRegistrationData(data);
          setRegistrationEmail(data.email);
          setAuthView("verify-otp");
        }} 
        onBackToLogin={() => setAuthView("login")} 
      />;
    }
    
    return <Login 
      onLogin={() => {}} 
      onGoToRegister={() => setAuthView("register")}
      onForgotPassword={() => setAuthView("forgot-password")}
    />;
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
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar
          current={page === "pengaturan" || page === "profil" ? "dashboard" : page} 
          onNavigate={setPage}
          onLogout={logout}
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
              onLogout={() => { logout(); setMobileMenuOpen(false); }}
              collapsed={false} onToggle={() => setMobileMenuOpen(false)}
              unreadCount={unreadCount} anomalyCount={anomalyCount}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 lg:px-6 gap-4 shrink-0 transition-colors duration-200">
          <button className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition" onClick={() => setMobileMenuOpen(true)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pageTitles[page]}</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">WattWise — Smart Energy Monitoring · Admin</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notification */}
            <div className="relative">
              <button onClick={() => setShowNotifPopup(!showNotifPopup)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
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
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifikasi</h3>
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
                            className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer ${!notif.read ? "bg-blue-50/30 dark:bg-blue-900/20" : ""}`}>
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
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{notif.title}</p>
                                  {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <button className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
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
                className="flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl px-2.5 py-1.5 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">AD</div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">Admin</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">WattWise Monitor</p>
                </div>
                <svg className={`hidden sm:block w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${showProfilePopup ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Popup */}
              {showProfilePopup && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                  <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-200">
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
                    <div className="p-2 bg-slate-50 dark:bg-slate-900">
                      {/* Theme Mode Toggle */}
                      <div className="px-3 py-2 mb-1">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tema Tampilan</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                          <button
                            onClick={() => setThemeMode('light')}
                            className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                              themeMode === 'light'
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="hidden sm:inline">Terang</span>
                          </button>
                          <button
                            onClick={() => setThemeMode('dark')}
                            className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                              themeMode === 'dark'
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <span className="hidden sm:inline">Gelap</span>
                          </button>
                          <button
                            onClick={() => setThemeMode('system')}
                            className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                              themeMode === 'system'
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">Sistem</span>
                          </button>
                        </div>
                        {themeMode === 'system' && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                            Menggunakan: <span className="font-semibold">{effectiveTheme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</span>
                          </p>
                        )}
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                      <button 
                        onClick={() => {
                          setPage("pengaturan");
                          setShowProfilePopup(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition text-left group">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 transition">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Pengaturan</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Kelola akun & preferensi</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setPage("profil");
                          setShowProfilePopup(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition text-left group">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 transition">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Profil</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Lihat & edit profil</p>
                        </div>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

                    {/* Logout */}
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          logout();
                          setShowProfilePopup(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition text-left group">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Keluar</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Logout dari akun</p>
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

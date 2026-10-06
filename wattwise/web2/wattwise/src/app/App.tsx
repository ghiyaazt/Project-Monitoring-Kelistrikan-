import { useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/common/app.css";
import { type Page } from "../constants/navigation";
// Auth Pages
import Login from "../features/auth/components/Login/Login";
// import Register from "../features/auth/components/Register/Register"; // Unused
import ContactForRegistration from "../features/auth/components/ContactForRegistration/ContactForRegistration";
import VerifyOTP from "../features/auth/components/VerifyOTP/VerifyOTP";
import ForgotPassword from "../features/auth/components/ForgotPassword/ForgotPassword";
import ResetPassword from "../features/auth/components/ResetPassword/ResetPassword";

// Dashboard Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import LaporanKeuangan from "../pages/Dashboard/LaporanKeuangan";
import Pengaturan from "../pages/Dashboard/Pengaturan";
import Profil from "../pages/Dashboard/Profil";
import KamarList from "../pages/Dashboard/Kamar/KamarList";
import DetailKamar from "../pages/Dashboard/Kamar/DetailKamar";
import Penghuni from "../pages/Dashboard/Kamar/Penghuni";

// Landing Pages
import LandingPage from "../pages/Landing/LandingPage";
import DaftarKos from "../pages/Landing/DaftarKos";

// Components & Data
import Sidebar from "../components/layout/Sidebar/Sidebar";
import { notifications, anomaliList } from "../data/mockData";

type AuthView = "login" | "register" | "verify-otp" | "forgot-password" | "verify-otp-forgot" | "reset-password";
type AppView = "landing" | "auth" | "dashboard";

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  "daftar-kos": "Kosku",
  penghuni: "Daftar Penghuni",
  "laporan-keuangan": "Laporan Keuangan",
  pengaturan: "Pengaturan",
  profil: "Profil Pengguna",
  "kamar-list": "Daftar Kamar",
  "detail-kamar": "Detail Kamar",
};

function DesktopApp() {
  const { themeMode, setThemeMode, effectiveTheme, currentUser, logout, setUser } = useApp();
  const [appView, setAppView] = useState<AppView>("landing");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [registrationEmail, setRegistrationEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedKosId, setSelectedKosId] = useState<string | null>(null);
  const [selectedKamarId, setSelectedKamarId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const anomalyCount = anomaliList.filter(a => a.status === "baru").length;
  
  // Check if user is logged in based on currentUser from context
  const loggedIn = currentUser !== null;

  // Show landing page if not logged in and not in auth view
  if (!loggedIn && appView === "landing") {
    return <LandingPage 
      onNavigateToLogin={() => {
        setAuthView("login"); // Reset to login view
        setAppView("auth");
      }}
    />;
  }

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
      return <ContactForRegistration 
        onBackToLogin={() => setAuthView("login")}
        onBackToLanding={() => {
          setAuthView("login"); // Reset to login
          setAppView("landing");
        }}
      />;
    }
    
    return <Login 
      onLogin={() => {}} 
      onGoToRegister={() => setAuthView("register")}
      onForgotPassword={() => setAuthView("forgot-password")}
      onBackToLanding={() => {
        setAuthView("login"); // Reset to login
        setAppView("landing");
      }}
    />;
  }

  function renderPage() {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "daftar-kos": 
        return <DaftarKos onNavigateToKamarList={(kosId) => {
          setSelectedKosId(kosId);
          setPage("kamar-list");
        }} />;
      case "penghuni": return <Penghuni />;
      case "laporan-keuangan": return <LaporanKeuangan />;
      case "pengaturan": return <Pengaturan />;
      case "profil": return <Profil />;
      case "kamar-list": 
        return <KamarList 
          kosId={selectedKosId || undefined}
          onNavigateToDetail={(kamarId) => {
            setSelectedKamarId(kamarId);
            setPage("detail-kamar");
          }}
          onBack={() => {
            setSelectedKosId(null);
            setPage("daftar-kos");
          }}
        />;
      case "detail-kamar": 
        return <DetailKamar 
          kamarId={selectedKamarId || undefined}
          onBack={() => setPage("kamar-list")}
        />;
    }
  }

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar
          current={
            page === "pengaturan" || page === "profil"
              ? "dashboard"
              : page === "kamar-list" || page === "detail-kamar"
              ? "daftar-kos"
              : page
          } 
          onNavigate={setPage}
          onLogout={logout}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          unreadCount={unreadCount}
          anomalyCount={anomalyCount}
          onNavigateToSettings={() => setPage("pengaturan")}
          onNavigateToProfile={() => setPage("profil")}
          notifications={notifications}
          currentUser={currentUser}
          themeMode={themeMode}
          effectiveTheme={effectiveTheme}
          onSetThemeMode={setThemeMode}
        />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-50">
            <Sidebar 
              current={
                page === "pengaturan" || page === "profil"
                  ? "dashboard"
                  : page === "kamar-list" || page === "detail-kamar"
                  ? "daftar-kos"
                  : page
              }
              onNavigate={p => { setPage(p); setMobileMenuOpen(false); }}
              onLogout={() => { logout(); setMobileMenuOpen(false); }}
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
              unreadCount={unreadCount}
              anomalyCount={anomalyCount}
              onNavigateToSettings={() => { setPage("pengaturan"); setMobileMenuOpen(false); }}
              onNavigateToProfile={() => { setPage("profil"); setMobileMenuOpen(false); }}
              notifications={notifications}
              currentUser={currentUser}
              themeMode={themeMode}
              effectiveTheme={effectiveTheme}
              onSetThemeMode={setThemeMode}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar - Simplified */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 lg:px-6 gap-4 shrink-0 transition-colors duration-200">
          <button className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition" onClick={() => setMobileMenuOpen(true)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 app-page-title">{pageTitles[page]}</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">WattWise — Smart Energy Monitoring · Admin</p>
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

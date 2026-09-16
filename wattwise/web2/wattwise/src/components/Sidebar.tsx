import { useApp } from "../context/AppContext";

type Page = "dashboard" | "monitoring" | "smartwattwise" | "pengaturan";

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
    id: "smartwattwise",
    label: "Smart Wattwise",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

export default function Sidebar({ current, onNavigate, onLogout, collapsed, onToggle, unreadCount = 2, anomalyCount = 3 }: SidebarProps) {
  const { currentUser } = useApp();
  
  // Get initials from user name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const badges: Partial<Record<Page, number>> = {};

  return (
    <aside className={`sidebar-nav ${collapsed ? "w-[70px]" : "w-[230px]"}`}>
      {/* Logo */}
      <div className={`sidebar-header ${collapsed ? "sidebar-header-centered" : "sidebar-header-spread"}`}>
        {!collapsed && (
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg className="sidebar-logo-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="sidebar-logo-text">WattWise</p>
              <p className="sidebar-logo-subtitle">Kos Monitoring</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="sidebar-logo-icon">
            <svg className="sidebar-logo-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
        <button onClick={onToggle} className={`sidebar-toggle-btn ${collapsed ? "sidebar-toggle-btn-collapsed" : ""}`}>
          {collapsed
            ? <svg className="sidebar-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            : <svg className="sidebar-toggle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          }
        </button>
      </div>

      {/* IoT status pill */}
      {!collapsed && currentUser && (
        <div className="sidebar-iot-status">
          <div className="sidebar-iot-pill">
            <span className="sidebar-iot-dot" />
            <div className="sidebar-iot-text">
              <p className="sidebar-iot-label">{currentUser.deviceId} · Terhubung</p>
              <p className="sidebar-iot-update">Update: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-menu">
        {!collapsed && <p className="sidebar-menu-label">Menu</p>}
        {nav.map((item) => {
          const active = current === item.id;
          const badge = badges[item.id];
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`sidebar-menu-item ${collapsed ? "sidebar-menu-item-centered" : ""} ${active ? "sidebar-menu-item-active" : "sidebar-menu-item-inactive"}`}>
              <span className={active ? "sidebar-menu-icon-active" : "sidebar-menu-icon-inactive"}>{item.icon}</span>
              {!collapsed && <span className="sidebar-menu-label-flex">{item.label}</span>}
              {!collapsed && badge && badge > 0 && (
                <span className="sidebar-menu-badge">{badge}</span>
              )}
              {!collapsed && active && <span className="sidebar-menu-dot" />}
              {collapsed && badge && badge > 0 && (
                <span className="sidebar-menu-badge-collapsed" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="sidebar-footer">
        {!collapsed && currentUser && (
          <div className="sidebar-profile">
            <div className="sidebar-profile-avatar">{getInitials(currentUser.name)}</div>
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-name">{currentUser.name}</p>
              <p className="sidebar-profile-detail">{currentUser.kamar}</p>
            </div>
          </div>
        )}
        {!collapsed && !currentUser && (
          <div className="sidebar-profile">
            <div className="sidebar-profile-avatar">??</div>
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-name">Guest</p>
              <p className="sidebar-profile-detail">No login data</p>
            </div>
          </div>
        )}
        <button onClick={onLogout} title={collapsed ? "Keluar" : undefined}
          className={`sidebar-logout-btn ${collapsed ? "sidebar-logout-btn-centered" : ""}`}>
          <svg className="sidebar-logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}

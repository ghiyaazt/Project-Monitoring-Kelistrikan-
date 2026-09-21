import { useApp } from "../../context/AppContext";

type Page = "dashboard" | "monitoring" | "smartwattwise";

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
];

export default function Sidebar({ current, onNavigate, onLogout, collapsed, onToggle, unreadCount = 2, anomalyCount = 3 }: SidebarProps) {
  const { currentUser } = useApp();
  
  const badges: Partial<Record<Page, number>> = {};

  return (
    <aside className={`sidebar-nav ${collapsed ? "w-[70px]" : "w-[230px]"}`}>
      {/* Logo */}
      <div className={`sidebar-header ${collapsed ? "sidebar-header-centered" : "sidebar-header-spread"}`}>
        {!collapsed && (
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <img 
                src="/assets/logos/wattwise-icon.png" 
                alt="WattWise" 
                className="sidebar-logo-icon-svg"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <img 
                src="/assets/logos/wattwise-text.png" 
                alt="WattWise"
                style={{ height: '24px', width: 'auto' }}
              />
              <p className="sidebar-logo-subtitle">Smart Monitoring</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="sidebar-logo-icon">
            <img 
              src="/assets/logos/wattwise-icon.png" 
              alt="WattWise" 
              className="sidebar-logo-icon-svg"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
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


    </aside>
  );
}

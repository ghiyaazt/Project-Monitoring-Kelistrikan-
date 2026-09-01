const nav = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "⌂",
  },
  {
    id: "electricity",
    label: "Listrik",
    icon: "⚡",
  },
  {
    id: "payments",
    label: "Pembayaran",
    icon: "▣",
  },
  {
    id: "tenants",
    label: "Penghuni",
    icon: "♙",
  },
];

const bottom = [
  {
    id: "profile",
    label: "Profil",
    icon: "●",
  },
  {
    id: "settings",
    label: "Pengaturan",
    icon: "⚙",
  },
];

function Sidebar({ current, onNavigate, onLogout, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-box">🏠</div>

        {!collapsed && <span>KosManager</span>}

        <button className="collapse-button" onClick={onToggle}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* MENU */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="menu-title">MENU UTAMA</div>}

        {nav.map((item) => {
          const active = current === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item ${active ? "active" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="sidebar-icon">{item.icon}</span>

              {!collapsed && <span>{item.label}</span>}

              {!collapsed && active && <span className="active-dot"></span>}
            </button>
          );
        })}
      </nav>

      {/* BOTTOM MENU */}
      <div className="sidebar-bottom">
        {bottom.map((item) => {
          const active = current === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item ${active ? "active-blue" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="sidebar-icon">{item.icon}</span>

              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        <button onClick={onLogout} className="sidebar-item logout">
          <span className="sidebar-icon">⇥</span>

          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

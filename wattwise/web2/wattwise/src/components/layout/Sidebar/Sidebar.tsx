import { useApp } from "../../../context/AppContext";
import React from "react";
import { type Page } from "../../../constants/navigation";
import SidebarLogo from "./SidebarLogo";
import IoTStatus from "./IoTStatus";
import NavigationMenu from "./NavigationMenu";
import NotificationButton from "./NotificationButton";
import ThemeSelector from "./ThemeSelector";
import UserProfile from "./UserProfile";

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
  unreadCount?: number;
  anomalyCount?: number;
  onNavigateToSettings?: () => void;
  onNavigateToProfile?: () => void;
  notifications?: any[];
  currentUser?: { name: string; email: string } | null;
  themeMode?: 'light' | 'dark' | 'system';
  effectiveTheme?: 'light' | 'dark';
  onSetThemeMode?: (mode: 'light' | 'dark' | 'system') => void;
}

export default function Sidebar({ 
  current, 
  onNavigate, 
  onLogout, 
  collapsed, 
  onToggle, 
  unreadCount = 0, 
  anomalyCount = 0,
  onNavigateToSettings,
  onNavigateToProfile,
  notifications = [],
  currentUser,
  themeMode = 'system',
  effectiveTheme = 'light',
  onSetThemeMode
}: SidebarProps) {
  const { iotDevices } = useApp();
  const [showNotifPopup, setShowNotifPopup] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Calculate summary
  const totalDevices = iotDevices.length;
  const connectedDevices = iotDevices.filter(d => d.status === "connected").length;
  
  // Determine if dark mode
  const isDark = effectiveTheme === 'dark';
  
  // Warna background sidebar - responsive dark/light mode
  const sidebarBg = isDark ? 'bg-slate-900' : 'bg-white';
  const sidebarBorder = isDark ? 'border-slate-800' : 'border-gray-200';

  return (
    <aside className={`${sidebarBg} ${sidebarBorder} ${collapsed ? "w-[70px]" : "w-[230px]"} border-r flex flex-col h-screen transition-all duration-300`}>
      {/* Logo */}
      <SidebarLogo collapsed={collapsed} isDark={isDark} onToggle={onToggle} />

      {/* IoT Status */}
      <IoTStatus 
        collapsed={collapsed} 
        isDark={isDark} 
        totalDevices={totalDevices} 
        connectedDevices={connectedDevices} 
      />

      {/* Navigation Menu */}
      <NavigationMenu 
        collapsed={collapsed} 
        current={current} 
        isDark={isDark} 
        onNavigate={onNavigate} 
      />

      {/* Bottom Section */}
      <div className={`border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} px-3 py-4 space-y-3 relative`} ref={notifRef}>
        {!collapsed ? (
          <div className="space-y-2">
            {/* Notification Button */}
            <NotificationButton
              collapsed={collapsed}
              isDark={isDark}
              unreadCount={unreadCount}
              notifications={notifications}
              show={showNotifPopup}
              onToggle={() => setShowNotifPopup(!showNotifPopup)}
            />

            {/* Divider */}
            <div className={`border-t my-3 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}></div>

            {/* Theme Selector */}
            <ThemeSelector
              collapsed={collapsed}
              isDark={isDark}
              themeMode={themeMode}
              effectiveTheme={effectiveTheme}
              onSetThemeMode={onSetThemeMode}
            />

            {/* Divider */}
            <div className={`border-t my-3 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}></div>

            {/* User Profile & Actions */}
            <UserProfile
              collapsed={collapsed}
              isDark={isDark}
              currentUser={currentUser}
              onNavigateToSettings={onNavigateToSettings}
              onNavigateToProfile={onNavigateToProfile}
              onLogout={onLogout}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {/* Notification Button (Collapsed) */}
            <NotificationButton
              collapsed={collapsed}
              isDark={isDark}
              unreadCount={unreadCount}
              notifications={notifications}
              show={showNotifPopup}
              onToggle={() => setShowNotifPopup(!showNotifPopup)}
            />

            <div className={`border-t my-2 ${isDark ? 'border-slate-800' : 'border-gray-200'}`}></div>

            {/* User Profile & Actions (Collapsed) */}
            <UserProfile
              collapsed={collapsed}
              isDark={isDark}
              currentUser={currentUser}
              onNavigateToSettings={onNavigateToSettings}
              onNavigateToProfile={onNavigateToProfile}
              onLogout={onLogout}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

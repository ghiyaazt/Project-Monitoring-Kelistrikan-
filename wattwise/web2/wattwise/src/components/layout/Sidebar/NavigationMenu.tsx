import React from "react";
import { NAVIGATION_ITEMS, type Page } from "../../../constants/navigation";

interface NavigationMenuProps {
  collapsed: boolean;
  current: Page;
  isDark: boolean;
  onNavigate: (page: Page) => void;
}

export default function NavigationMenu({ collapsed, current, isDark, onNavigate }: NavigationMenuProps) {
  const textTertiary = isDark ? 'text-slate-500' : 'text-gray-500';
  const badges: Partial<Record<Page, number>> = {};

  return (
    <nav className="flex-1 px-3 overflow-y-auto">
      {!collapsed && <p className={`text-[10px] uppercase tracking-wider font-semibold mb-3 px-3 ${textTertiary}`}>Menu</p>}
      <div className="space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const active = current === item.id;
          const badge = badges[item.id];
          return (
            <button 
              key={item.id} 
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                collapsed ? "justify-center" : ""
              } ${
                active 
                  ? isDark ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600"
                  : isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className={active ? (isDark ? "text-teal-400" : "text-blue-600") : ""}>{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
              {!collapsed && badge && badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">{badge}</span>
              )}
              {!collapsed && active && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
              {collapsed && badge && badge > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

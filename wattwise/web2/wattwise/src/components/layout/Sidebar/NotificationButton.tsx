import React from "react";

interface NotificationButtonProps {
  collapsed: boolean;
  isDark: boolean;
  unreadCount: number;
  notifications: any[];
  show: boolean;
  onToggle: () => void;
}

export default function NotificationButton({
  collapsed,
  isDark,
  unreadCount,
  notifications,
  show,
  onToggle
}: NotificationButtonProps) {
  if (collapsed) {
    return (
      <>
        <button
          onClick={onToggle}
          className={`relative w-full h-10 flex items-center justify-center rounded-xl transition ${
            isDark 
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Notifikasi"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {show && (
          <NotificationPopup
            isDark={isDark}
            unreadCount={unreadCount}
            notifications={notifications}
            collapsed={collapsed}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
          isDark 
            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <div className="relative shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-sm font-medium flex-1">Notifikasi</span>
        {unreadCount > 0 && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDark ? 'text-red-400 bg-red-500/20' : 'text-red-600 bg-red-100'
          }`}>
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <NotificationPopup
          isDark={isDark}
          unreadCount={unreadCount}
          notifications={notifications}
          collapsed={collapsed}
        />
      )}
    </>
  );
}

function NotificationPopup({ 
  isDark, 
  unreadCount, 
  notifications, 
  collapsed 
}: { 
  isDark: boolean; 
  unreadCount: number; 
  notifications: any[]; 
  collapsed: boolean; 
}) {
  return (
    <div className={`fixed ${collapsed ? 'left-[calc(70px+0.5rem)]' : 'left-8'} bottom-20 w-80 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl z-[9999] overflow-hidden`}>
      <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifikasi</h3>
          {unreadCount > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isDark ? 'text-red-400 bg-red-500/20' : 'text-red-600 bg-red-100'
            }`}>
              {unreadCount} baru
            </span>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tidak ada notifikasi</p>
          </div>
        ) : (
          notifications.map((notif: any) => (
            <div
              key={notif.id}
              className={`p-4 border-b transition cursor-pointer ${
                isDark 
                  ? `border-slate-700 hover:bg-slate-700/50 ${!notif.read ? 'bg-teal-500/10' : ''}`
                  : `border-gray-200 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === "anomali" 
                    ? isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"
                    : notif.type === "peringatan" 
                    ? isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-600"
                    : isDark ? "bg-teal-900/30 text-teal-400" : "bg-blue-100 text-blue-600"
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{notif.title}</p>
                    {!notif.read && <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${isDark ? 'bg-teal-400' : 'bg-blue-500'}`} />}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{notif.message}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{notif.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className={`p-3 border-t ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <button className={`w-full text-center text-xs font-semibold py-2 rounded-lg transition ${
            isDark 
              ? 'text-teal-400 hover:text-teal-300 hover:bg-teal-500/10' 
              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
          }`}>
            Lihat Semua Notifikasi
          </button>
        </div>
      )}
    </div>
  );
}

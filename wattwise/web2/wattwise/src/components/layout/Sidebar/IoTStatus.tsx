interface IoTStatusProps {
  collapsed: boolean;
  isDark: boolean;
  totalDevices: number;
  connectedDevices: number;
}

export default function IoTStatus({ collapsed, isDark, totalDevices, connectedDevices }: IoTStatusProps) {
  if (collapsed) return null;

  const hasDevices = totalDevices > 0;

  if (hasDevices) {
    return (
      <div className="px-3 mb-4">
        <div className={`${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'} border rounded-xl p-3 backdrop-blur-sm`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connectedDevices > 0 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium leading-tight truncate ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                {connectedDevices} dari {totalDevices} perangkat
              </p>
              <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 mb-4">
      <div className={`${isDark ? 'bg-red-950/30 border-red-900/50' : 'bg-red-50 border-red-200'} border rounded-xl p-3`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium leading-tight ${isDark ? 'text-red-400' : 'text-red-600'}`}>Belum ada perangkat</p>
            <p className={`text-[10px] leading-tight ${isDark ? 'text-red-500/70' : 'text-red-500'}`}>Tambahkan di Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}

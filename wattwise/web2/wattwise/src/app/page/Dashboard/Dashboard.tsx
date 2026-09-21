import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { realtimeData, realtimeChart, anomaliList, AnomalyEvent } from "../../../data/mockData";
import { useApp } from "../../../context/AppContext";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="monitoring-tooltip">
        <p className="dashboard-anomaly-footer-label dashboard-anomaly-footer-row">{label}</p>
        <p className="dashboard-anomaly-footer-value-mono">{payload[0].value} W</p>
      </div>
    );
  }
  return null;
};

const statCards = [
  {
    label: "Daya Saat Ini",
    value: `${realtimeData.daya} W`,
    sub: "46 menit lalu",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    dot: "bg-blue-500",
  },
  {
    label: "Tegangan",
    value: `${realtimeData.tegangan} V`,
    sub: "Stabil",
    color: "text-green-600 bg-green-50 border-green-100",
    dot: "bg-green-500",
  },
  {
    label: "Arus",
    value: `${realtimeData.arus} A`,
    sub: "42 menit lalu",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    dot: "bg-purple-500",
  },
  {
    label: "Total Energi",
    value: `${realtimeData.totalEnergi} kWh`,
    sub: "Hari ini",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    dot: "bg-amber-500",
  },
];

export default function Dashboard() {
  const { iotDevices } = useApp();
  const newAnomalies = anomaliList.filter(a => a.status === "baru");
  const connectedDevices = iotDevices.filter(d => d.status === "connected");
  const totalDeviceDaya = iotDevices.reduce((sum, d) => sum + (d.daya || 0), 0);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="heading-xl">Dashboard</h1>
          <p className="dashboard-header-text">Analisis data listrik yang diterima </p>
        </div>
        <div className="dashboard-header-actions">
          <span className="dashboard-status-badge">
            <span className="dashboard-status-dot" />
            {realtimeData.sensorStatus}
          </span>
          <span className="dashboard-timestamp dashboard-timestamp-mono">
            {realtimeData.lastUpdate}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dashboard-stats-grid">
        {statCards.map(c => (
          <div key={c.label} className="stat-card">
            <div className={`dashboard-stat-badge ${c.color}`}>
              <span className={`dashboard-stat-dot ${c.dot}`} />
              {c.label}
            </div>
            <p className="stat-value">{c.value}</p>
            <p className="dashboard-stat-subtext">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid-1-lg-3">
        {/* Analisa Data Listrik Keseluruhan */}
        <div className="dashboard-chart-container">
          <div className="dashboard-chart-header">
            <div>
              <h2 className="heading-md">Grafik Data Listrik Keseluruhan</h2>
              <p className="dashboard-chart-title-text">Monitoring real-time konsumsi daya</p>
            </div>
            <span className="dashboard-chart-badge">Live</span>
          </div>
          <div className="dashboard-chart-height">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="daya" stroke="#2563eb" strokeWidth={2} fill="url(#dashGrad)"
                  dot={false} activeDot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Per-device mini row - IoT Devices */}
          <div className="dashboard-device-row">
            {connectedDevices.slice(0, 4).map((device: any, idx: number) => {
              const colors = ["#16a34a", "#2563eb", "#7c3aed", "#f59e0b"];
              const color = colors[idx % colors.length];
              const maxDaya = Math.max(...connectedDevices.map((d: any) => d.daya || 0));
              return (
                <div key={device.id} className="dashboard-device-item">
                  <p className="dashboard-device-label">{device.name}</p>
                  <p className="dashboard-device-value">{device.daya || 0} W</p>
                  <div className="dashboard-device-bar-bg" style={{ backgroundColor: color + "33" }}>
                    <div className="dashboard-device-bar-fill" 
                         style={{ backgroundColor: color, width: `${((device.daya || 0) / maxDaya) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Anomali Terbaru */}
        <div className="dashboard-anomaly-card">
          <div className="dashboard-anomaly-header">
            <h2 className="heading-md">Anomali Terbaru</h2>
            {newAnomalies.length > 0 && (
              <span className="badge badge-danger">{newAnomalies.length} Baru</span>
            )}
          </div>

          <div className="dashboard-anomaly-list">
            {anomaliList.slice(0, 4).map((a: AnomalyEvent) => (
              <div key={a.id} className={`dashboard-anomaly-item ${a.status === "baru" ? "dashboard-anomaly-item-new" : "dashboard-anomaly-item-handled"}`}>
                <div className={`dashboard-anomaly-icon ${a.status === "baru" ? "dashboard-anomaly-icon-new" : "dashboard-anomaly-icon-handled"}`}>
                  <svg className="dashboard-anomaly-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {a.changeType === "spike" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    )}
                  </svg>
                </div>
                <div className="dashboard-anomaly-content">
                  <div className="dashboard-anomaly-title-row">
                    <p className="dashboard-anomaly-title">
                      {a.changeType === "spike" ? "Lonjakan" : "Penurunan"} Daya
                    </p>
                    <span className="dashboard-anomaly-time">{a.time}</span>
                  </div>
                  <p className="dashboard-anomaly-value">
                    {a.watBefore}W Ã¢â€ â€™ <span className={`dashboard-anomaly-value-bold ${a.changeType === "spike" ? "dashboard-anomaly-value-red" : "dashboard-anomaly-value-orange"}`}>{a.watt}W</span>
                  </p>
                  <p className={`dashboard-anomaly-change ${a.change > 0 ? "dashboard-anomaly-change-red" : "dashboard-anomaly-change-orange"}`}>
                    {a.change > 0 ? "+" : ""}{a.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-anomaly-footer">
            <div className="dashboard-anomaly-footer-row">
              <span className="dashboard-anomaly-footer-label">Total anomali hari ini</span>
              <span className="dashboard-anomaly-footer-value-red">7 kejadian</span>
            </div>
            <div className="dashboard-anomaly-footer-row">
              <span className="dashboard-anomaly-footer-label">Daya maks. anomali</span>
              <span className="dashboard-anomaly-footer-value-mono">870 W</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring & Smart Wattwise Summary */}
      <div className="dashboard-grid-1-lg-2">
        {/* Perangkat IoT (from Monitoring) */}
        <div className="dashboard-iot-card">
          <div className="dashboard-iot-header">
            <div>
              <h2 className="dashboard-iot-title">Perangkat IoT</h2>
              <p className="dashboard-iot-subtitle">Device monitoring terhubung</p>
            </div>
            <span className="dashboard-iot-badge">
              {connectedDevices.length} Online
            </span>
          </div>

          {iotDevices.length === 0 ? (
            <div className="dashboard-empty-state">
              <svg className="dashboard-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <p className="dashboard-empty-text">Belum ada perangkat terhubung</p>
              <p className="dashboard-empty-subtext">Tambahkan di halaman Monitoring</p>
            </div>
          ) : (
            <>
              <div className="dashboard-device-list">
                {iotDevices.slice(0, 3).map((device: any) => (
                  <div key={device.id} className="dashboard-device-item-card">
                    <div className="dashboard-device-left">
                      <div className={`dashboard-device-icon-box ${device.status === "connected" ? "dashboard-device-icon-box-online" : "dashboard-device-icon-box-offline"}`}>
                        <svg className={device.status === "connected" ? "dashboard-device-icon-online" : "dashboard-device-icon-offline"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="dashboard-device-name">{device.name}</p>
                        <p className="dashboard-device-id">{device.deviceId}</p>
                      </div>
                    </div>
                    <div className="dashboard-device-right">
                      <p className="dashboard-device-power">{device.daya}W</p>
                      <span className={device.status === "connected" ? "dashboard-device-status-online" : "dashboard-device-status-offline"}>
                        {device.status === "connected" ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-summary-footer">
                <div>
                  <p className="dashboard-summary-item-label">Total Device</p>
                  <p className="dashboard-summary-item-value">{iotDevices.length}</p>
                </div>
                <div>
                  <p className="dashboard-summary-item-label">Terhubung</p>
                  <p className="dashboard-summary-item-value-green">{connectedDevices.length}</p>
                </div>
                <div>
                  <p className="dashboard-summary-item-label">Total Daya</p>
                  <p className="dashboard-summary-item-value-blue">{totalDeviceDaya}W</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Smart Wattwise Groups */}
        <div className="dashboard-iot-card">
          <div className="dashboard-iot-header">
            <div>
              <h2 className="dashboard-iot-title">Smart Wattwise</h2>
              <p className="dashboard-iot-subtitle">Grup perangkat terhubung</p>
            </div>
            <span className="dashboard-iot-badge-blue">
              0 Grup
            </span>
          </div>

          <div className="dashboard-empty-state">
            <svg className="dashboard-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="dashboard-empty-text">Belum ada grup device</p>
            <p className="dashboard-empty-subtext">Buat grup di Smart Wattwise</p>
          </div>

          <div className="dashboard-anomaly-footer">
            <p className="dashboard-empty-desc">Grup device untuk monitoring gabungan</p>
            <div className="dashboard-summary-grid-3">
              <div>
                <p className="dashboard-summary-item-label">Total Grup</p>
                <p className="dashboard-summary-item-value">0</p>
              </div>
              <div>
                <p className="dashboard-summary-item-label">Device</p>
                <p className="dashboard-summary-item-value-slate">0</p>
              </div>
              <div>
                <p className="dashboard-summary-item-label">Daya</p>
                <p className="dashboard-summary-item-value-mono">0W</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

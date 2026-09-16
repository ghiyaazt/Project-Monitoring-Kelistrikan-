import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { IoTDevice, realtimeData, realtimeChart, anomaliList, detailAnomali, riwayatHarian, riwayatStats } from "../data/mockData";

type View = "deviceList" | "deviceDetail";
type DetailTab = "anomali" | "riwayat";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="monitoring-tooltip">
        <p className="monitoring-tooltip-label">{label}</p>
        <p className="monitoring-tooltip-value">{payload[0].value} W</p>
      </div>
    );
  }
  return null;
};

export default function Monitoring() {
  const { iotDevices: devices, addDevice } = useApp();
  const [view, setView] = useState<View>("deviceList");
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", deviceId: "" });
  const [detailTab, setDetailTab] = useState<DetailTab>("anomali");
  const [tick, setTick] = useState(0);
  const [selectedAnomali, setSelectedAnomali] = useState<string | null>(null);
  const [anomaliFilter, setAnomaliFilter] = useState<"semua" | "baru" | "ditangani">("semua");

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const liveDaya = realtimeData.daya + Math.floor(Math.sin(tick * 0.7) * 18);
  const filteredAnomali = anomaliList.filter(a => anomaliFilter === "semua" || a.status === anomaliFilter);
  const totalBaru = anomaliList.filter(a => a.status === "baru").length;

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.deviceId) {
      const randomDaya = Math.floor(Math.random() * 300) + 150;
      const randomTegangan = 220;
      const randomArus = parseFloat((randomDaya / randomTegangan).toFixed(2));
      
      const device: IoTDevice = {
        id: `dev${Date.now()}`,
        name: `ESP32 + ${newDevice.deviceId}`,
        deviceId: newDevice.deviceId,
        status: "connected",
        lastUpdate: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        location: "Baru ditambahkan",
        daya: randomDaya,
        tegangan: randomTegangan,
        arus: randomArus,
      };
      addDevice(device);
      setNewDevice({ name: "", deviceId: "" });
      setShowAddModal(false);
    }
  };

  const handleSelectDevice = (device: IoTDevice) => {
    setSelectedDevice(device);
    setView("deviceDetail");
    setDetailTab("anomali");
  };

  const handleBackToList = () => {
    setView("deviceList");
    setSelectedDevice(null);
  };

  if (view === "deviceDetail" && selectedDevice) {
    return (
      <div className="monitoring-container">
        {/* Header with back button */}
        <div className="monitoring-detail-header">
          <div className="monitoring-detail-header-left">
            <button onClick={handleBackToList}
              className="monitoring-back-button">
              <svg className="monitoring-back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="heading-xl">{selectedDevice.name}</h1>
              <p className="monitoring-device-title-text">{selectedDevice.deviceId} Ãƒâ€šÃ‚Â· {selectedDevice.location}</p>
            </div>
          </div>
          <div className="monitoring-detail-actions">
            <span className="monitoring-live-badge">
              <span className="monitoring-live-dot" />
              Live
            </span>
          </div>
        </div>

        {/* Real-time monitoring - Always visible at top */}
        <div className="monitoring-space-y-4">
          {/* Stat cards */}
          <div className="monitoring-grid-1-sm-3">
            {[
              {
                label: "Daya Saat Ini",
                value: liveDaya,
                unit: "W",
                sub: "Real-time",
                color: "text-blue-600",
                bg: "bg-blue-50 border-blue-200",
              },
              {
                label: "Tegangan",
                value: realtimeData.tegangan,
                unit: "V",
                sub: "Stabil",
                color: "text-green-600",
                bg: "bg-green-50 border-green-200",
              },
              {
                label: "Arus",
                value: realtimeData.arus,
                unit: "A",
                sub: "Real-time",
                color: "text-purple-600",
                bg: "bg-purple-50 border-purple-200",
              },
            ].map(c => (
              <div key={c.label} className={`monitoring-stats-card ${c.bg}`}>
                <p className={`monitoring-stats-card-label ${c.color}`}>{c.label}</p>
                <p className="monitoring-stat-value">
                  {c.value}
                  <span className="monitoring-stat-unit">{c.unit}</span>
                </p>
                <p className="monitoring-stat-sub">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Real-time chart */}
          <div className="monitoring-chart-card">
            <div className="monitoring-chart-header">
              <div>
                <h2 className="monitoring-chart-title">Grafik Real-time</h2>
                <p className="monitoring-chart-subtitle">Pembaruan otomatis setiap detik</p>
              </div>
              <div className="monitoring-chart-legend">
                <span className="monitoring-chart-legend-item">
                  <span className="monitoring-legend-line monitoring-legend-line-blue" />Daya (W)
                </span>
                <span className="monitoring-chart-legend-item">
                  <span className="monitoring-legend-line monitoring-legend-line-amber" />Batas Normal
                </span>
              </div>
            </div>
            <div className="monitoring-chart-height">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realtimeChart} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="monGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 600]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={500} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5}
                    label={{ value: "Batas 500W", position: "insideTopRight", fontSize: 10, fill: "#f59e0b" }} />
                  <Area type="monotone" dataKey="daya" stroke="#2563eb" strokeWidth={2.5} fill="url(#monGrad)"
                    dot={false} activeDot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabs for Anomali & Riwayat */}
        <div className="monitoring-tabs">
          <button onClick={() => setDetailTab("anomali")}
            className={`monitoring-tab ${detailTab === "anomali" ? "monitoring-tab-active" : "monitoring-tab-inactive"}`}>
            <svg className="monitoring-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Anomali
            {totalBaru > 0 && (
              <span className={`monitoring-tab-badge ${detailTab === "anomali" ? "monitoring-tab-badge-active" : "monitoring-tab-badge-inactive"}`}>{totalBaru}</span>
            )}
          </button>
          <button onClick={() => setDetailTab("riwayat")}
            className={`monitoring-tab ${detailTab === "riwayat" ? "monitoring-tab-active-green" : "monitoring-tab-inactive"}`}>
            <svg className="monitoring-tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Riwayat
          </button>
        </div>

        {/* Anomali Tab Content */}
        {detailTab === "anomali" && (
          <>
            {/* Stats */}
            <div className="monitoring-anomali-stats-grid">
              {[
                { label: "Total Anomali", value: anomaliList.length, sub: "7 hari", color: "monitoring-anomali-stat-value-slate" },
                { label: "Daya Anomali", value: `${detailAnomali.daya} W`, sub: "Tertinggi", color: "monitoring-anomali-stat-value-blue" },
                { label: "Perubahan", value: `+${detailAnomali.perubahan}%`, sub: "Lonjakan", color: "monitoring-anomali-stat-value-amber" },
                { label: "Status", value: `${totalBaru} Baru`, sub: "Belum ditangani", color: "monitoring-anomali-stat-value-red" },
              ].map(c => (
                <div key={c.label} className="monitoring-anomali-stat-card">
                  <p className="monitoring-anomali-stat-label">{c.label}</p>
                  <p className={`monitoring-anomali-stat-value ${c.color}`}>{c.value}</p>
                  <p className="monitoring-anomali-stat-sub">{c.sub}</p>
                </div>
              ))}
            </div>

            <div className="monitoring-anomali-layout">
              {/* Anomaly list */}
              <div className="monitoring-anomali-list-col">
                <div className="monitoring-anomali-list-header">
                  <h2 className="monitoring-anomali-list-title">Daftar Anomali</h2>
                </div>
                <div className="monitoring-anomali-filter-group">
                  {(["semua", "baru", "ditangani"] as const).map(f => (
                    <button key={f} onClick={() => setAnomaliFilter(f)}
                      className={`monitoring-anomali-filter-btn ${anomaliFilter === f ? "monitoring-anomali-filter-btn-active" : "monitoring-anomali-filter-btn-inactive"}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="monitoring-anomali-list">
                  {filteredAnomali.map(a => (
                    <button key={a.id} onClick={() => setSelectedAnomali(selectedAnomali === a.id ? null : a.id)}
                      className={`monitoring-anomali-list-item ${selectedAnomali === a.id ? "monitoring-anomali-list-item-selected" : a.status === "baru" ? "monitoring-anomali-list-item-baru" : "monitoring-anomali-list-item-default"}`}>
                      <div className="monitoring-anomali-item-header">
                        <span className="monitoring-anomali-item-type">
                          {a.changeType === "spike" ? "Lonjakan" : "Penurunan"} Daya
                        </span>
                        <span className="monitoring-anomali-item-time">{a.time}</span>
                      </div>
                      <div className="monitoring-anomali-item-values">
                        <span className="monitoring-anomali-item-before">{a.watBefore}W ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢</span>
                        <span className={`monitoring-anomali-item-after ${a.changeType === "spike" ? "monitoring-anomali-item-after-spike" : "monitoring-anomali-item-after-drop"}`}>{a.watt}W</span>
                        <span className="monitoring-anomali-item-separator">ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span>
                        <span className={`monitoring-anomali-item-change ${a.change > 0 ? "monitoring-anomali-item-change-positive" : "monitoring-anomali-item-change-negative"}`}>
                          {a.change > 0 ? "+" : ""}{a.change}%
                        </span>
                      </div>
                      <div className="monitoring-anomali-item-footer">
                        <span className={`monitoring-anomali-item-status-badge ${a.status === "baru" ? "monitoring-anomali-item-status-baru" : "monitoring-anomali-item-status-ditangani"}`}>
                          {a.status === "baru" ? "Baru" : "Ditangani"}
                        </span>
                        <span className="monitoring-anomali-item-date">{a.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail */}
              <div className="monitoring-anomali-detail-col">
                <h2 className="monitoring-anomali-detail-title">Detail Anomali</h2>
                {selectedAnomali ? (
                  <>
                    <div className="monitoring-anomali-detail-fields">
                      {(() => {
                        const selected = anomaliList.find(a => a.id === selectedAnomali);
                        return [
                          { label: "Waktu", value: selected?.time },
                          { label: "Daya Sebelum", value: `${selected?.watBefore} W` },
                          { label: "Daya Setelah", value: `${selected?.watt} W` },
                          { label: "Perubahan", value: `${selected && selected.change > 0 ? "+" : ""}${selected?.change}%` },
                        ].map(f => (
                        <div key={f.label}>
                          <p className="monitoring-anomali-detail-field-label">{f.label}</p>
                          <p className="monitoring-anomali-detail-field-value">{f.value}</p>
                        </div>
                      ))})()}
                    </div>
                    <div className="monitoring-anomali-detail-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={detailAnomali.chart} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                          <defs>
                            <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                          <Tooltip content={(props: any) => {
                            if (props.active && props.payload?.length) {
                              return (
                                <div className="monitoring-tooltip-custom">
                                  <p className="monitoring-tooltip-custom-label">{props.label}</p>
                                  <p className="monitoring-tooltip-custom-value monitoring-tooltip-custom-value-red">{props.payload[0].value} W</p>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Area type="monotone" dataKey="daya" stroke="#ef4444" strokeWidth={2.5} fill="url(#anomGrad)"
                            dot={false} activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="monitoring-anomali-recommendation">
                      <p className="monitoring-anomali-recommendation-label">Rekomendasi</p>
                      <p className="monitoring-anomali-recommendation-text">{detailAnomali.rekomendasi}</p>
                    </div>
                  </>
                ) : (
                  <div className="monitoring-anomali-empty">
                    <svg className="monitoring-anomali-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="monitoring-anomali-empty-text">Pilih anomali untuk melihat detail</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Riwayat Tab Content */}
        {detailTab === "riwayat" && (
          <>
            {/* Stats */}
            <div className="monitoring-riwayat-stats-grid">
              {[
                { label: "Periode", value: riwayatStats.periode, sub: "Per siklus", colorClass: "monitoring-riwayat-stat-card-blue" },
                { label: "Total Energi", value: `${riwayatStats.totalEnergi} kWh`, sub: "Periode", colorClass: "monitoring-riwayat-stat-card-green" },
                { label: "Rata-rata", value: `${riwayatStats.rataRata} kWh`, sub: "Per hari", colorClass: "monitoring-riwayat-stat-card-purple" },
                { label: "Anomali", value: `${riwayatStats.anomali} kejadian`, sub: "Terdeteksi", colorClass: "monitoring-riwayat-stat-card-red" },
              ].map(c => (
                <div key={c.label} className={`monitoring-riwayat-stat-card ${c.colorClass}`}>
                  <p className="monitoring-riwayat-stat-label">{c.label}</p>
                  <p className="monitoring-riwayat-stat-value">{c.value}</p>
                  <p className="monitoring-riwayat-stat-sub">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="monitoring-riwayat-chart-card">
              <div className="monitoring-riwayat-chart-header">
                <div>
                  <h2 className="monitoring-riwayat-chart-title">Konsumsi Harian</h2>
                  <p className="monitoring-riwayat-chart-subtitle">Energi yang digunakan (kWh) per hari</p>
                </div>
              </div>
              <div className="monitoring-riwayat-chart-height">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riwayatHarian} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="riwGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={(props: any) => {
                      if (props.active && props.payload?.length) {
                        return (
                          <div className="monitoring-tooltip-custom">
                            <p className="monitoring-tooltip-custom-label">{props.label}</p>
                            <p className="monitoring-tooltip-custom-value monitoring-tooltip-custom-value-slate">{props.payload[0].value} kWh</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Area type="monotone" dataKey="kwh" stroke="#16a34a" strokeWidth={2.5} fill="url(#riwGrad)"
                      dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#16a34a", strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detail table */}
            <div className="monitoring-riwayat-table-card">
              <h2 className="monitoring-riwayat-table-title">Detail Harian</h2>
              <div className="monitoring-riwayat-table-wrapper">
                <table className="monitoring-riwayat-table">
                  <thead>
                    <tr>
                      <th>Hari</th>
                      <th>Tanggal</th>
                      <th>Konsumsi (kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatHarian.map((r, i) => (
                      <tr key={i}>
                        <td className="monitoring-riwayat-table-cell-day">{r.hari}</td>
                        <td className="monitoring-riwayat-table-cell-date">{r.tanggal}</td>
                        <td className="monitoring-riwayat-table-cell-kwh">{r.kwh} kWh</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Device List View
  return (
    <div className="monitoring-list-view-container">
      <div className="monitoring-list-view-space-y">
      {/* Header */}
      <div className="monitoring-list-view-header">
        <div>
          <h1 className="monitoring-list-view-title">Monitoring</h1>
          <p className="monitoring-list-view-subtitle">Kelola dan monitor perangkat IoT yang terhubung</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="monitoring-add-device-btn">
          <svg className="monitoring-add-device-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Perangkat
        </button>
      </div>

      {/* Stats */}
      <div className="monitoring-list-stats-grid">
        <div className="monitoring-list-stat-card">
          <p className="monitoring-list-stat-label">Total Perangkat</p>
          <p className="monitoring-list-stat-value monitoring-list-stat-value-slate">{devices.length}</p>
          <p className="monitoring-list-stat-sub">Terdaftar</p>
        </div>
        <div className="monitoring-list-stat-card monitoring-list-stat-card-connected">
          <p className="monitoring-list-stat-label-connected">Terhubung</p>
          <p className="monitoring-list-stat-value monitoring-list-stat-value-green">{devices.filter(d => d.status === "connected").length}</p>
          <p className="monitoring-list-stat-sub">Online</p>
        </div>
        <div className="monitoring-list-stat-card">
          <p className="monitoring-list-stat-label">Terputus</p>
          <p className="monitoring-list-stat-value monitoring-list-stat-value-amber">{devices.filter(d => d.status === "disconnected").length}</p>
          <p className="monitoring-list-stat-sub">Offline</p>
        </div>
        <div className="monitoring-list-stat-card">
          <p className="monitoring-list-stat-label">Error</p>
          <p className="monitoring-list-stat-value monitoring-list-stat-value-red">{devices.filter(d => d.status === "error").length}</p>
          <p className="monitoring-list-stat-sub">Bermasalah</p>
        </div>
      </div>

      {/* Device List */}
      <div className="monitoring-list-devices-grid">
        {devices.map(device => (
          <button key={device.id} onClick={() => handleSelectDevice(device)}
            className="monitoring-list-device-card">
            <div className="monitoring-list-device-header">
              <div className="monitoring-list-device-info">
                <div className={`monitoring-list-device-icon-box ${device.status === "connected" ? "monitoring-list-device-icon-box-connected" : "monitoring-list-device-icon-box-disconnected"}`}>
                  <svg className={`monitoring-list-device-icon ${device.status === "connected" ? "monitoring-list-device-icon-connected" : "monitoring-list-device-icon-disconnected"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="monitoring-list-device-name">{device.name}</h3>
                  <p className="monitoring-list-device-id">{device.deviceId}</p>
                </div>
              </div>
              <span className={`monitoring-list-device-status ${device.status === "connected" ? "monitoring-list-device-status-connected" : device.status === "error" ? "monitoring-list-device-status-error" : "monitoring-list-device-status-disconnected"}`}>
                <span className={`monitoring-list-device-status-dot ${device.status === "connected" ? "monitoring-list-device-status-dot-connected" : device.status === "error" ? "monitoring-list-device-status-dot-error" : "monitoring-list-device-status-dot-disconnected"}`} />
                {device.status === "connected" ? "Terhubung" : device.status === "error" ? "Error" : "Terputus"}
              </span>
            </div>
            
            <div className="monitoring-list-device-stats">
              <div className="monitoring-list-device-stat-row">
                <span className="monitoring-list-device-stat-label">Daya</span>
                <span className="monitoring-list-device-stat-value">{device.daya || 0} W</span>
              </div>
              <div className="monitoring-list-device-stat-row">
                <span className="monitoring-list-device-stat-label">Tegangan</span>
                <span className="monitoring-list-device-stat-value">{device.tegangan || 0} V</span>
              </div>
              <div className="monitoring-list-device-stat-row">
                <span className="monitoring-list-device-stat-label">Arus</span>
                <span className="monitoring-list-device-stat-value">{device.arus || 0} A</span>
              </div>
            </div>

            <div className="monitoring-list-device-footer">
              <span className="monitoring-list-device-location">{device.location}</span>
              <span className="monitoring-list-device-time">{device.lastUpdate}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="monitoring-modal-overlay">
          <div className="monitoring-modal-card">
            <div className="monitoring-modal-header">
              <h2 className="monitoring-modal-title">Tambah Perangkat Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="monitoring-modal-close-btn">
                <svg className="monitoring-modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="monitoring-modal-form">
              <div>
                <label className="monitoring-modal-field-label">Nama Perangkat</label>
                <input type="text" value={newDevice.name} onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Contoh: ESP32 Kamar 07"
                  className="monitoring-modal-input" />
              </div>
              <div>
                <label className="monitoring-modal-field-label">ID Perangkat</label>
                <input type="text" value={newDevice.deviceId} onChange={(e) => setNewDevice({ ...newDevice, deviceId: e.target.value })}
                  placeholder="Contoh: ESP32 + FC24-1007"
                  className="monitoring-modal-input" />
              </div>
            </div>
            <div className="monitoring-modal-actions">
              <button onClick={() => setShowAddModal(false)}
                className="monitoring-modal-btn-cancel">
                Batal
              </button>
              <button onClick={handleAddDevice}
                className="monitoring-modal-btn-submit">
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}






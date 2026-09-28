import { useState, useEffect } from "react";
import { IoTDevice, realtimeChart } from "../../../data/mockData";
import { useApp } from "../../../context/AppContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface DeviceGroup {
  id: string;
  name: string;
  devices: IoTDevice[];
  createdAt: string;
}

type View = "groupList" | "groupDetail";

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

export default function SmartWattwise() {
  const { iotDevices, groups: contextGroups, addGroup, removeGroup, updateGroup } = useApp();
  const [view, setView] = useState<View>("groupList");
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [availableDevices, setAvailableDevices] = useState<IoTDevice[]>([]);
  const [tick, setTick] = useState(0);

  // Convert context groups to display groups with full device objects
  const [groups, setGroups] = useState<DeviceGroup[]>([]);

  // Animate real-time data
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  // Load available devices from monitoring (now from context)
  useEffect(() => {
    setAvailableDevices(iotDevices);
  }, [iotDevices]);

  // Convert context groups to display format whenever they change
  useEffect(() => {
    const displayGroups: DeviceGroup[] = contextGroups.map(g => ({
      id: g.id,
      name: g.name,
      devices: g.devices.map(deviceId => 
        iotDevices.find(d => d.id === deviceId)
      ).filter(Boolean) as IoTDevice[],
      createdAt: new Date().toLocaleString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    setGroups(displayGroups);
    
    // Update selected group if it exists
    if (selectedGroup) {
      const updatedGroup = displayGroups.find(g => g.id === selectedGroup.id);
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
      }
    }
  }, [contextGroups, iotDevices]);

  const handleSelectGroup = (group: DeviceGroup) => {
    setSelectedGroup(group);
    setView("groupDetail");
  };

  const handleBackToList = () => {
    setView("groupList");
    setSelectedGroup(null);
  };

  const handleOpenSettings = () => {
    if (selectedGroup) {
      setEditGroupName(selectedGroup.name);
      setShowSettingsModal(true);
    }
  };

  const handleUpdateGroup = () => {
    if (selectedGroup && editGroupName) {
      updateGroup(selectedGroup.id, { name: editGroupName });
      setShowSettingsModal(false);
    }
  };

  const handleDeleteGroupDetail = () => {
    if (selectedGroup && window.confirm(`Hapus grup "${selectedGroup.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      removeGroup(selectedGroup.id);
      setShowSettingsModal(false);
      handleBackToList();
    }
  };

  const handleAddGroup = () => {
    if (!newGroupName || selectedDevices.length === 0) {
      return;
    }

    // Add to context (which will persist to localStorage)
    addGroup({
      name: newGroupName,
      devices: selectedDevices
    });

    setNewGroupName("");
    setSelectedDevices([]);
    setShowAddModal(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    removeGroup(groupId);
  };

  const toggleDeviceSelection = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };

  const getTotalDaya = (devices: IoTDevice[]) => {
    return devices.reduce((sum, d) => sum + (d.daya || 0), 0);
  };

  const getTotalTegangan = (devices: IoTDevice[]) => {
    const avg = devices.reduce((sum, d) => sum + (d.tegangan || 0), 0) / devices.length;
    return Math.round(avg);
  };

  const getTotalArus = (devices: IoTDevice[]) => {
    const total = devices.reduce((sum, d) => sum + (d.arus || 0), 0);
    return parseFloat(total.toFixed(2));
  };

  // Group Detail View
  if (view === "groupDetail" && selectedGroup) {
    const liveDaya = getTotalDaya(selectedGroup.devices) + Math.floor(Math.sin(tick * 0.7) * 18);
    const avgTegangan = getTotalTegangan(selectedGroup.devices);
    const totalArus = getTotalArus(selectedGroup.devices);

    return (
      <>
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
                <h1 className="heading-xl">{selectedGroup.name}</h1>
                <p className="monitoring-device-title-text">{selectedGroup.devices.length} perangkat tergabung</p>
              </div>
            </div>
            <div className="monitoring-detail-actions">
              <button onClick={handleOpenSettings}
                className="monitoring-settings-button">
                <svg className="monitoring-settings-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="monitoring-settings-text">Pengaturan</span>
              </button>
              <span className="monitoring-live-badge">
                <span className="monitoring-live-dot" />
                Live
              </span>
            </div>
          </div>

          {/* Real-time monitoring */}
          <div className="monitoring-space-y-4">
            {/* Stat cards */}
            <div className="monitoring-grid-1-sm-3">
              {[
                {
                  label: "Total Daya",
                  value: liveDaya,
                  unit: "W",
                  sub: "Real-time",
                  color: "text-blue-600",
                  bg: "bg-blue-50 border-blue-200",
                },
                {
                  label: "Tegangan Rata-rata",
                  value: avgTegangan,
                  unit: "V",
                  sub: "Stabil",
                  color: "text-green-600",
                  bg: "bg-green-50 border-green-200",
                },
                {
                  label: "Total Arus",
                  value: totalArus,
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
                  <h2 className="monitoring-chart-title">Grafik Real-time Grup</h2>
                  <p className="monitoring-chart-subtitle">Total daya gabungan dari {selectedGroup.devices.length} perangkat</p>
                </div>
                <div className="monitoring-chart-legend">
                  <span className="monitoring-chart-legend-item">
                    <span className="monitoring-legend-line monitoring-legend-line-blue" />Total Daya (W)
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
                      <linearGradient id="groupGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 1000]} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={800} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5}
                      label={{ value: "Batas 800W", position: "insideTopRight", fontSize: 10, fill: "#f59e0b" }} />
                    <Area type="monotone" dataKey="daya" stroke="#16a34a" strokeWidth={2.5} fill="url(#groupGrad)"
                      dot={false} activeDot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device List in Group */}
            <div className="monitoring-chart-card">
              <div className="monitoring-chart-header">
                <div>
                  <h2 className="monitoring-chart-title">Perangkat dalam Grup</h2>
                  <p className="monitoring-chart-subtitle">Daftar semua perangkat yang tergabung</p>
                </div>
              </div>
              <div style={{ padding: '1rem' }}>
                <div className="titik-grid">
                  {selectedGroup.devices.map((device) => (
                    <div key={device.id} className="titik-group-card">
                      <div className="titik-group-header">
                        <div className="titik-group-info">
                          <div className={`monitoring-list-device-icon-box ${
                            device.status === "connected" 
                              ? "monitoring-list-device-icon-box-connected" 
                              : "monitoring-list-device-icon-box-disconnected"
                          }`}>
                            <svg className={`monitoring-list-device-icon ${
                              device.status === "connected"
                                ? "monitoring-list-device-icon-connected"
                                : "monitoring-list-device-icon-disconnected"
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="titik-group-name">{device.name}</h3>
                            <p className="titik-group-count">{device.deviceId}</p>
                          </div>
                        </div>
                        <span className={`monitoring-list-device-status ${
                          device.status === "connected" 
                            ? "monitoring-list-device-status-connected"
                            : device.status === "error"
                            ? "monitoring-list-device-status-error"
                            : "monitoring-list-device-status-disconnected"
                        }`}>
                          <span className={`monitoring-list-device-status-dot ${
                            device.status === "connected"
                              ? "monitoring-list-device-status-dot-connected"
                              : device.status === "error"
                              ? "monitoring-list-device-status-dot-error"
                              : "monitoring-list-device-status-dot-disconnected"
                          }`} />
                          {device.status === "connected" ? "Terhubung" : device.status === "error" ? "Error" : "Terputus"}
                        </span>
                      </div>

                      {/* Device Stats */}
                      <div className="titik-group-stats">
                        <div className="titik-group-stat-row">
                          <span className="titik-group-stat-label">Daya</span>
                          <span className="titik-group-stat-value">{device.daya} W</span>
                        </div>
                        <div className="titik-group-stat-row">
                          <span className="titik-group-stat-label">Tegangan</span>
                          <span className="titik-group-stat-value">{device.tegangan} V</span>
                        </div>
                        <div className="titik-group-stat-row">
                          <span className="titik-group-stat-label">Arus</span>
                          <span className="titik-group-stat-value">{device.arus} A</span>
                        </div>
                      </div>

                      <div className="titik-group-footer">
                        <span className="titik-group-date">{device.location}</span>
                        <span className="titik-group-date">{device.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Group Modal */}
        {showSettingsModal && selectedGroup && (
          <div className="titik-modal-overlay">
            <div className="titik-modal-content">
              <div className="titik-modal-header">
                <h2 className="titik-modal-title">Pengaturan Grup</h2>
                <button onClick={() => setShowSettingsModal(false)} 
                  className="titik-modal-close">
                  <svg className="titik-modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="titik-modal-body">
                <div>
                  <label className="titik-modal-label">Nama Grup</label>
                  <input type="text" value={editGroupName} 
                    onChange={(e) => setEditGroupName(e.target.value)}
                    placeholder="Contoh: Ruang A + Ruang B"
                    className="titik-modal-input" />
                </div>
                <div>
                  <label className="titik-modal-label">Jumlah Perangkat</label>
                  <p className="titik-group-stat-value" style={{ fontSize: '0.875rem' }}>
                    {selectedGroup.devices.length} perangkat tergabung
                  </p>
                </div>
              </div>

              <div className="titik-modal-footer">
                <button onClick={handleDeleteGroupDetail}
                  className="monitoring-modal-btn-delete"
                  style={{ flex: 'none', padding: '0.625rem 1rem' }}>
                  <svg className="monitoring-modal-delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
                <div style={{ flex: 1, display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setShowSettingsModal(false)}
                    className="titik-modal-btn-cancel">
                    Batal
                  </button>
                  <button onClick={handleUpdateGroup}
                    className="titik-modal-btn-submit">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Group List View
  return (
    <div className="titik-container">
      {/* Header */}
      <div className="titik-header">
        <div>
          <h1 className="titik-header-title">Smart Wattwise</h1>
          <p className="titik-header-subtitle">Kelompokkan beberapa perangkat IoT menjadi satu grup monitoring</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="titik-add-btn">
          <svg className="titik-add-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Buat Grup Baru
        </button>
      </div>

      {/* Stats */}
      <div className="titik-stats-grid">
        <div className="titik-stat-card">
          <p className="titik-stat-label">Total Grup</p>
          <p className="titik-stat-value">{groups.length}</p>
          <p className="titik-stat-sub">Terdaftar</p>
        </div>
        <div className="titik-stat-card titik-stat-card-blue">
          <p className="titik-stat-label-blue">Device Tersedia</p>
          <p className="titik-stat-value-blue">{availableDevices.length}</p>
          <p className="titik-stat-sub">Dari Monitoring</p>
        </div>
        <div className="titik-stat-card">
          <p className="titik-stat-label">Total Device</p>
          <p className="titik-stat-value">
            {groups.reduce((sum, g) => sum + g.devices.length, 0)}
          </p>
          <p className="titik-stat-sub">Tergabung</p>
        </div>
        <div className="titik-stat-card">
          <p className="titik-stat-label">Total Daya</p>
          <p className="titik-stat-value-green">
            {groups.reduce((sum, g) => sum + getTotalDaya(g.devices), 0)} W
          </p>
          <p className="titik-stat-sub">Keseluruhan</p>
        </div>
      </div>

      {/* Empty state */}
      {groups.length === 0 && (
        <div className="titik-empty-state">
          <div className="titik-empty-icon-box">
            <svg className="titik-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="titik-empty-title">Belum ada grup device</h3>
          <p className="titik-empty-text">
            Buat grup baru untuk mengelompokkan beberapa perangkat IoT yang sudah terdaftar di Monitoring
          </p>
          <button onClick={() => setShowAddModal(true)} className="titik-empty-btn">
            <svg className="titik-add-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Buat Grup Pertama
          </button>
        </div>
      )}

      {/* Group List */}
      <div className="titik-grid">
        {groups.map(group => (
          <button 
            key={group.id} 
            onClick={() => handleSelectGroup(group)}
            className="titik-group-card"
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <div className="titik-group-header">
              <div className="titik-group-info">
                <div className="titik-group-icon-box">
                  <svg className="titik-group-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="titik-group-name">{group.name}</h3>
                  <p className="titik-group-count">{group.devices.length} device</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group.id);
                }} 
                className="titik-delete-btn">
                <svg className="titik-delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Group Stats */}
            <div className="titik-group-stats">
              <div className="titik-group-stat-row">
                <span className="titik-group-stat-label">Total Daya</span>
                <span className="titik-group-stat-value">{getTotalDaya(group.devices)} W</span>
              </div>
              <div className="titik-group-stat-row">
                <span className="titik-group-stat-label">Tegangan Rata-rata</span>
                <span className="titik-group-stat-value">{getTotalTegangan(group.devices)} V</span>
              </div>
              <div className="titik-group-stat-row">
                <span className="titik-group-stat-label">Total Arus</span>
                <span className="titik-group-stat-value">{getTotalArus(group.devices)} A</span>
              </div>
            </div>

            {/* Device list */}
            <div className="titik-device-section">
              <p className="titik-device-label">Perangkat:</p>
              <div className="titik-device-list">
                {group.devices.map((device, idx) => (
                  <div key={idx} className="titik-device-row">
                    <span className="titik-device-name">
                      <span className="titik-device-dot" />
                      {device.name}
                    </span>
                    <span className="titik-device-power">{device.daya}W</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="titik-group-footer">
              <span className="titik-group-date">{group.createdAt}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="titik-modal-overlay">
          <div className="titik-modal-content">
            <div className="titik-modal-header">
              <h2 className="titik-modal-title">Buat Grup Baru</h2>
              <button onClick={() => { setShowAddModal(false); setSelectedDevices([]); setNewGroupName(""); }} 
                className="titik-modal-close">
                <svg className="titik-modal-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="titik-modal-body">
              {/* Group Name */}
              <div>
                <label className="titik-modal-label">Nama Grup</label>
                <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Contoh: Ruang A + Ruang B"
                  className="titik-modal-input" />
              </div>

              {/* Device Selection */}
              <div>
                <label className="titik-modal-label">
                  Pilih Perangkat <span className="titik-modal-label-count">({selectedDevices.length} dipilih)</span>
                </label>
                
                {availableDevices.length === 0 ? (
                  <div className="titik-device-select-empty">
                    <svg className="titik-device-select-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <p className="titik-device-select-empty-title">Belum ada perangkat tersedia</p>
                    <p className="titik-device-select-empty-text">Tambahkan perangkat di halaman Monitoring terlebih dahulu</p>
                  </div>
                ) : (
                  <div className="titik-device-select-list">
                    {availableDevices.map(device => (
                      <button key={device.id} 
                        onClick={() => toggleDeviceSelection(device.id)}
                        className={`titik-device-select-item ${
                          selectedDevices.includes(device.id) 
                            ? "titik-device-select-item-selected" 
                            : "titik-device-select-item-unselected"
                        }`}>
                        <div className="titik-device-select-row">
                          <div className="titik-device-select-left">
                            <div className={`titik-checkbox ${
                              selectedDevices.includes(device.id)
                                ? "titik-checkbox-checked"
                                : "titik-checkbox-unchecked"
                            }`}>
                              {selectedDevices.includes(device.id) && (
                                <svg className="titik-checkbox-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="titik-device-select-name">{device.name}</p>
                              <p className="titik-device-select-id">{device.deviceId}</p>
                            </div>
                          </div>
                          <div className="titik-device-select-right">
                            <p className="titik-device-select-power">Daya: <span className="titik-device-select-power-value">{device.daya}W</span></p>
                            <span className={`titik-device-select-status ${
                              device.status === "connected" 
                                ? "titik-device-select-status-online" 
                                : "titik-device-select-status-offline"
                            }`}>
                              {device.status === "connected" ? "Terhubung" : "Terputus"}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="titik-modal-footer">
              <button onClick={() => { setShowAddModal(false); setSelectedDevices([]); setNewGroupName(""); }}
                className="titik-modal-btn-cancel">
                Batal
              </button>
              <button onClick={handleAddGroup}
                disabled={!newGroupName || selectedDevices.length === 0}
                className="titik-modal-btn-submit">
                Buat Grup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

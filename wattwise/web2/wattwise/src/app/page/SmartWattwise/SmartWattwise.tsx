import { useState, useEffect } from "react";
import { iotDevices, IoTDevice } from "../../../data/mockData";

interface DeviceGroup {
  id: string;
  name: string;
  devices: IoTDevice[];
  createdAt: string;
}

export default function SmartWattwise() {
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [availableDevices, setAvailableDevices] = useState<IoTDevice[]>([]);

  // Load available devices from monitoring
  useEffect(() => {
    setAvailableDevices(iotDevices);
  }, []);

  const handleAddGroup = () => {
    if (!newGroupName || selectedDevices.length === 0) {
      return;
    }

    const devices = availableDevices.filter(d => selectedDevices.includes(d.id));
    const newGroup: DeviceGroup = {
      id: `group${groups.length + 1}`,
      name: newGroupName,
      devices: devices,
      createdAt: new Date().toLocaleString('id-ID', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setSelectedDevices([]);
    setShowAddModal(false);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
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
          <div key={group.id} className="titik-group-card">
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
              <button onClick={() => handleDeleteGroup(group.id)} className="titik-delete-btn">
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
          </div>
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

import React from 'react';
import { DEVICE_COLORS } from '../../../../../../utils/dashboard/kamar/detailKamar/WattwiseTab';

interface Perangkat {
  id: string;
  nama: string;
  deviceId: string;
  dayaWatt: number;
}

interface WattwiseDevicesListProps {
  isDark: boolean;
  perangkat: Perangkat[];
  onAddDevice: () => void;
}

export const WattwiseDevicesList: React.FC<WattwiseDevicesListProps> = ({
  isDark,
  perangkat,
  onAddDevice
}) => {
  return (
    <div className="card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
      <div className="wattwise-devices-header">
        <h3 className="wattwise-devices-title">
          Perangkat dalam Grup
        </h3>
        <p className="wattwise-devices-description">
          Daftar semua perangkat yang tergabung
        </p>
      </div>

      {perangkat.length === 0 ? (
        <div className="wattwise-empty-state">
          <div className="wattwise-empty-icon-container">
            <svg className="wattwise-empty-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <p className="wattwise-empty-text">
            Belum ada perangkat terdaftar
          </p>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onAddDevice}
            style={{ margin: '0 auto' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Perangkat Pertama
          </button>
        </div>
      ) : (
        <div className="wattwise-devices-grid">
          {perangkat.map((p, idx) => {
            const deviceColor = DEVICE_COLORS[idx % DEVICE_COLORS.length];
            return (
              <div
                key={p.id}
                className={`wattwise-device-card ${isDark ? 'wattwise-device-card-dark' : 'wattwise-device-card-light'}`}
              >
                {/* Badge Terhubung */}
                <div className="wattwise-device-badge">
                  <span className="wattwise-device-badge-dot" />
                  Terhubung
                </div>

                {/* Icon dan Nama */}
                <div className="wattwise-device-header">
                  <div className="wattwise-legend-icon" style={{ background: deviceColor }}>
                    <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div className="wattwise-device-info">
                    <div className={`wattwise-device-name ${isDark ? 'wattwise-device-name-dark' : 'wattwise-device-name-light'}`}>
                      {p.nama}
                    </div>
                    <div className={`wattwise-device-id ${isDark ? 'wattwise-device-id-dark' : 'wattwise-device-id-light'}`}>
                      {p.deviceId}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className={`wattwise-device-stats ${isDark ? 'wattwise-device-stats-dark' : 'wattwise-device-stats-light'}`}>
                  <div>
                    <div className={`wattwise-device-stat-label ${isDark ? 'wattwise-device-stat-label-dark' : 'wattwise-device-stat-label-light'}`}>
                      Daya
                    </div>
                    <div className={`wattwise-device-stat-value ${isDark ? 'wattwise-device-stat-value-dark' : 'wattwise-device-stat-value-light'}`}>
                      {p.dayaWatt}
                      <span className="wattwise-device-stat-unit" style={{ color: deviceColor }}>W</span>
                    </div>
                  </div>
                  <div>
                    <div className={`wattwise-device-stat-label ${isDark ? 'wattwise-device-stat-label-dark' : 'wattwise-device-stat-label-light'}`}>
                      Tegangan
                    </div>
                    <div className={`wattwise-device-stat-value ${isDark ? 'wattwise-device-stat-value-dark' : 'wattwise-device-stat-value-light'}`}>
                      220
                      <span className="wattwise-device-stat-unit" style={{ color: deviceColor }}>V</span>
                    </div>
                  </div>
                  <div>
                    <div className={`wattwise-device-stat-label ${isDark ? 'wattwise-device-stat-label-dark' : 'wattwise-device-stat-label-light'}`}>
                      Arus
                    </div>
                    <div className={`wattwise-device-stat-value ${isDark ? 'wattwise-device-stat-value-dark' : 'wattwise-device-stat-value-light'}`}>
                      {(p.dayaWatt / 220).toFixed(2)}
                      <span className="wattwise-device-stat-unit" style={{ color: deviceColor }}>A</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`wattwise-device-footer ${isDark ? 'wattwise-device-footer-dark' : 'wattwise-device-footer-light'}`}>
                  Baru diperbarui: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            );
          })}
          
          {/* Card Tambah Perangkat */}
          <button
            onClick={onAddDevice}
            className={`wattwise-add-device-card ${isDark ? 'dark' : ''}`}
          >
            <div className="wattwise-add-device-icon-wrapper">
              <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div className="wattwise-add-device-text-container">
              <div className="wattwise-add-device-title">
                Tambah Perangkat
              </div>
              <div className="wattwise-add-device-subtitle">
                Klik untuk menambah perangkat baru
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

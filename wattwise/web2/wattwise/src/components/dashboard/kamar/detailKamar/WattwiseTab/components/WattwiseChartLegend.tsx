import React from 'react';
import { DEVICE_COLORS } from '../../../../../../utils/dashboard/kamar/detailKamar/WattwiseTab';

interface Perangkat {
  id: string;
  nama: string;
  dayaWatt: number;
}

interface WattwiseChartLegendProps {
  isDark: boolean;
  perangkat: Perangkat[];
  totalDaya: number;
}

export const WattwiseChartLegend: React.FC<WattwiseChartLegendProps> = ({
  isDark,
  perangkat,
  totalDaya
}) => {
  return (
    <div className={`wattwise-legend-container ${isDark ? 'wattwise-legend-container-dark' : 'wattwise-legend-container-light'}`}>
      <div className={`wattwise-legend-title ${isDark ? 'wattwise-legend-title-dark' : 'wattwise-legend-title-light'}`}>
        Keterangan Warna
      </div>
      <div className="wattwise-legend-grid">
        {perangkat.map((device, idx) => {
          const deviceColor = DEVICE_COLORS[idx % DEVICE_COLORS.length];
          return (
            <div 
              key={device.id} 
              className={`wattwise-legend-item ${isDark ? 'wattwise-legend-item-dark' : 'wattwise-legend-item-light'}`}
              style={{ borderColor: `${deviceColor}20` }}
            >
              <div className="wattwise-legend-icon" style={{ background: deviceColor }}>
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="wattwise-legend-text-container">
                <div className={`wattwise-legend-device-name ${isDark ? 'wattwise-legend-device-name-dark' : 'wattwise-legend-device-name-light'}`}>
                  {device.nama}
                </div>
                <div className={`wattwise-legend-device-power ${isDark ? 'wattwise-legend-device-power-dark' : 'wattwise-legend-device-power-light'}`}>
                  {device.dayaWatt} W
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Legend untuk Total */}
        <div className={`wattwise-legend-item wattwise-legend-total ${isDark ? 'dark' : ''}`}>
          <div className="wattwise-legend-icon wattwise-legend-total-icon">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="wattwise-legend-text-container">
            <div className={`wattwise-legend-device-name wattwise-legend-total-title ${isDark ? 'wattwise-legend-total-title-dark' : 'wattwise-legend-total-title-light'}`}>
              Total Daya
            </div>
            <div className={`wattwise-legend-device-power ${isDark ? 'wattwise-legend-device-power-dark' : 'wattwise-legend-device-power-light'}`}>
              {totalDaya} W
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

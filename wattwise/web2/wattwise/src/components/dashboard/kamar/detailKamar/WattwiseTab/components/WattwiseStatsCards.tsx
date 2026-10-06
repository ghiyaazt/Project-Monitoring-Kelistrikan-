import React from 'react';

interface WattwiseStatsCardsProps {
  isDark: boolean;
  totalPerangkat: number;
  totalDaya: number;
  teganganRataRata: number;
  totalArus: number;
}

export const WattwiseStatsCards: React.FC<WattwiseStatsCardsProps> = ({
  isDark,
  totalPerangkat,
  totalDaya,
  teganganRataRata,
  totalArus
}) => {
  return (
    <div className="wattwise-cards-grid">
      {/* Card Total Perangkat - Abu */}
      <div className={`wattwise-card wattwise-card-devices ${isDark ? 'dark' : ''}`}>
        <div className={`wattwise-card-label wattwise-card-label-devices ${isDark ? 'dark' : ''}`}>
          Total Perangkat
        </div>
        <div className="wattwise-card-value-container">
          <span className={`wattwise-card-value wattwise-card-value-devices ${isDark ? 'dark' : ''}`}>
            {totalPerangkat}
          </span>
          <span className={`wattwise-card-unit wattwise-card-unit-small wattwise-card-unit-devices ${isDark ? 'dark' : ''}`}>
            perangkat
          </span>
        </div>
        <div className={`wattwise-card-subtitle wattwise-card-subtitle-devices ${isDark ? 'dark' : ''}`}>
          Terhubung
        </div>
      </div>

      {/* Card Total Daya - Biru */}
      <div className="wattwise-card wattwise-card-power">
        <div className="wattwise-card-label wattwise-card-label-power">
          Total Daya
        </div>
        <div className="wattwise-card-value-container">
          <span className="wattwise-card-value wattwise-card-value-power">
            {totalDaya}
          </span>
          <span className="wattwise-card-unit wattwise-card-unit-large wattwise-card-unit-power">W</span>
        </div>
        <div className="wattwise-card-subtitle wattwise-card-subtitle-power">
          Real-time
        </div>
      </div>

      {/* Card Tegangan - Hijau */}
      <div className="wattwise-card wattwise-card-voltage">
        <div className="wattwise-card-label wattwise-card-label-voltage">
          Tegangan Rata-rata
        </div>
        <div className="wattwise-card-value-container">
          <span className="wattwise-card-value wattwise-card-value-voltage">
            {teganganRataRata}
          </span>
          <span className="wattwise-card-unit wattwise-card-unit-large wattwise-card-unit-voltage">V</span>
        </div>
        <div className="wattwise-card-subtitle wattwise-card-subtitle-voltage">
          Stabil
        </div>
      </div>

      {/* Card Total Arus - Ungu */}
      <div className="wattwise-card wattwise-card-current">
        <div className="wattwise-card-label wattwise-card-label-current">
          Total Arus
        </div>
        <div className="wattwise-card-value-container">
          <span className="wattwise-card-value wattwise-card-value-current">
            {totalArus}
          </span>
          <span className="wattwise-card-unit wattwise-card-unit-large wattwise-card-unit-current">A</span>
        </div>
        <div className="wattwise-card-subtitle wattwise-card-subtitle-current">
          Real-time
        </div>
      </div>
    </div>
  );
};

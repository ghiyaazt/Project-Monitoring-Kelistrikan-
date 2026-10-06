import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
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

export default CustomTooltip;

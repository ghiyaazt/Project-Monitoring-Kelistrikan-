import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { DEVICE_COLORS } from '../../../../../../utils/dashboard/kamar/detailKamar/WattwiseTab';

interface Perangkat {
  id: string;
  nama: string;
  deviceId: string;
  dayaWatt: number;
  kamarId: string;
}

interface WattwiseChartProps {
  view: 'harian' | 'mingguan';
  setView: (view: 'harian' | 'mingguan') => void;
  chartData: Record<string, string | number>[];
  xKey: string;
  yLabel: string;
  perangkat: Perangkat[];
  totalPerangkat: number;
}

export const WattwiseChart: React.FC<WattwiseChartProps> = ({
  view,
  setView,
  chartData,
  xKey,
  yLabel,
  perangkat,
  totalPerangkat
}) => {
  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
      <div className="wattwise-graph-header">
        <h3 className="wattwise-graph-title">
          Grafik Real-time Grup
        </h3>
        <p className="wattwise-graph-description">
          Total daya gabungan dari {totalPerangkat} perangkat
        </p>
      </div>

      <div className="wattwise-view-toggle-container">
        <div className="wattwise-view-toggle">
          {(['harian', 'mingguan'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`wattwise-view-toggle-btn ${view === v ? 'active' : ''}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradients untuk setiap device */}
            {perangkat.map((device, idx) => (
              <linearGradient key={`grad-${device.id}`} id={`grad-${device.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={DEVICE_COLORS[idx % DEVICE_COLORS.length]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={DEVICE_COLORS[idx % DEVICE_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
            {/* Gradient untuk total */}
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            {/* Gradient untuk view mingguan */}
            <linearGradient id="wattGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: 'var(--muted-foreground)' } }}
          />
          <Tooltip
            cursor={{ stroke: '#10b981', strokeDasharray: '4 4', strokeOpacity: 0.5 }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              fontSize: 12,
              boxShadow: 'var(--shadow-md)',
              color: 'var(--foreground)',
            }}
            labelStyle={{ fontWeight: 600, color: 'var(--foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
            formatter={(val: any, name?: string | number) => {
              if (view === 'mingguan') {
                return [`${val} kWh`, 'Konsumsi'];
              }
              if (!name || typeof name !== 'string') return [`${val} W`, 'Daya'];
              // Format untuk view harian
              if (name === 'total') {
                return [`${val} W`, 'Total'];
              }
              // Cari nama device dari dataKey
              const deviceId = name.replace('device_', '');
              const device = perangkat.find(d => d.id === deviceId);
              return [`${val} W`, device ? device.nama : name];
            }}
          />
          
          {/* Render lines untuk view harian (multi-line) */}
          {view === 'harian' && perangkat.length > 0 ? (
            <>
              {/* Line untuk setiap device */}
              {perangkat.map((device, idx) => (
                <Area
                  key={device.id}
                  type="monotone"
                  dataKey={`device_${device.id}`}
                  stroke={DEVICE_COLORS[idx % DEVICE_COLORS.length]}
                  strokeWidth={2}
                  fill={`url(#grad-${device.id})`}
                  dot={false}
                  activeDot={{ r: 4, fill: DEVICE_COLORS[idx % DEVICE_COLORS.length], stroke: 'var(--card)', strokeWidth: 2 }}
                />
              ))}
              {/* Line untuk total (lebih tebal dan warna berbeda) */}
              <Area
                type="monotone"
                dataKey="total"
                stroke="#ef4444"
                strokeWidth={3}
                fill="url(#gradTotal)"
                dot={false}
                activeDot={{ r: 5, fill: '#ef4444', stroke: 'var(--card)', strokeWidth: 2 }}
              />
            </>
          ) : (
            /* Render single line untuk view mingguan */
            <Area
              type="monotone"
              dataKey="kwh"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#wattGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#10b981', stroke: 'var(--card)', strokeWidth: 2 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

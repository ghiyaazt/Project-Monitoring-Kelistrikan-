import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

export interface LivePower {
  series: number[];
  power: number;
  voltage: number;
  current: number;
  updatedAt: string;
}

const formatTime = (d: Date) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// Simulasi data sensor realtime (nanti ganti dengan data dari backend / ESP32).
export default function useLivePower(initial: number[]): LivePower {
  const [series, setSeries] = useState<number[]>(initial);
  const [updatedAt, setUpdatedAt] = useState(formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setSeries(prev => {
        const last = prev[prev.length - 1];
        const next = Math.round(
          Math.min(560, Math.max(380, last + (Math.random() - 0.5) * 24)),
        );
        return [...prev.slice(-19), next];
      });
      setUpdatedAt(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const power = series[series.length - 1];
  return {
    series,
    power,
    voltage: 220,
    current: Number((power / 220).toFixed(2)),
    updatedAt,
  };
}

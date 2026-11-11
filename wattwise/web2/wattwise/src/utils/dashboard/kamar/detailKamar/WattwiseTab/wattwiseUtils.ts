/**
 * WattwiseTab Utility Functions
 * Business logic for data generation and processing
 */

interface SensorData {
  power: number;
  voltage: number;
  current: number;
}

interface Device {
  id: string;
  nama: string;
  sensorData?: SensorData | null;
}

interface HourlyDataPoint {
  jam: string;
  total: number;
  [key: string]: string | number; // Dynamic device_${id} properties
}

/**
 * Generate hourly power consumption data for multiple devices
 * Creates realistic power usage patterns based on time of day
 * Uses real-time sensor data as baseline, or 0 if no data available
 * 
 * @param devices - Array of devices with sensor data
 * @returns Array of 24 hourly data points with power consumption per device
 */
export function generateHourlyDataForDevices(devices: Device[]): HourlyDataPoint[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const isDay = hour >= 6 && hour <= 22;
    const isPeak = (hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 22);
    
    const dataPoint: HourlyDataPoint = {
      jam: `${String(hour).padStart(2, '0')}:00`,
      total: 0,
    };
    
    let totalDaya = 0;
    
    // Generate data untuk setiap perangkat
    devices.forEach((device) => {
      // Use real-time power from sensor data, or 0 if no data
      const base = device.sensorData?.power || 0;
      
      if (base > 0) {
        const variance = isPeak ? base * 0.2 : isDay ? base * 0.1 : base * 0.05;
        const daya = Math.round(base + (Math.random() - 0.5) * variance);
        dataPoint[`device_${device.id}`] = daya;
        totalDaya += daya;
      } else {
        // No sensor data - show 0
        dataPoint[`device_${device.id}`] = 0;
      }
    });
    
    dataPoint.total = totalDaya;
    
    return dataPoint;
  });
}

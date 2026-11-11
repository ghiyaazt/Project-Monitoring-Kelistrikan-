import { useState, useEffect } from 'react';
import { deviceService, sensorService, SensorData } from '../../../../../services';
import { generateHourlyDataForDevices, WEEKLY_MOCK_DATA } from '../../../../../utils/dashboard/kamar/detailKamar/WattwiseTab';
import { 
  WattwiseStatsCards, 
  WattwiseChart, 
  WattwiseChartLegend, 
  WattwiseDevicesList, 
  WattwiseAddDeviceModal 
} from './components';
import '../../../../../styles/kamar/wattwise-tab.css';

interface WattwiseTabProps {
  isDark: boolean;
  kamarId: string;
}

interface Device {
  id: string;
  _id: string;
  nama: string;
  deviceId: string;
  kamarId: string;
  tipe: string;
  status: string;
}

interface DeviceWithSensor extends Device {
  sensorData?: SensorData | null;
}

const WattwiseTab: React.FC<WattwiseTabProps> = ({ isDark, kamarId }) => {
  const [view, setView] = useState<'harian' | 'mingguan'>('harian');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: '', deviceId: '' });
  const [perangkat, setPerangkat] = useState<DeviceWithSensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch devices on mount and when kamarId changes
  useEffect(() => {
    fetchDevices();
    
    // Auto-refresh sensor data every 5 seconds
    const interval = setInterval(() => {
      fetchSensorData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [kamarId]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await deviceService.getDevicesByRoom(kamarId);
      if (response.success) {
        // Transform _id to id for component compatibility
        const transformedDevices = response.data.map((device: any) => ({
          ...device,
          id: device._id
        }));
        setPerangkat(transformedDevices);
        
        // Fetch sensor data for these devices
        if (transformedDevices.length > 0) {
          await fetchSensorData(transformedDevices);
        }
      }
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setError(err.response?.data?.message || 'Gagal memuat data perangkat');
    } finally {
      setLoading(false);
    }
  };

  const fetchSensorData = async (devices?: DeviceWithSensor[]) => {
    try {
      const currentDevices = devices || perangkat;
      if (currentDevices.length === 0) return;

      // Get device IDs
      const deviceIds = currentDevices.map(d => d.deviceId);
      
      // Fetch latest sensor data for all devices
      const response = await sensorService.getLatestByRoom(deviceIds);
      
      if (response.success) {
        // Merge sensor data with devices
        const devicesWithSensor = currentDevices.map(device => {
          const sensorDataItem = response.data.find(
            (item: any) => item.deviceId === device.deviceId
          );
          return {
            ...device,
            sensorData: sensorDataItem?.data || null
          };
        });
        
        setPerangkat(devicesWithSensor);
      }
    } catch (err: any) {
      console.error('Error fetching sensor data:', err);
      // Don't show error for sensor data fetch - just log it
    }
  };
  
  // Calculate electrical stats from REAL sensor data
  const calculateStats = () => {
    let totalDaya = 0;
    let totalTegangan = 0;
    let totalArus = 0;
    let deviceCount = 0;

    perangkat.forEach(device => {
      if (device.sensorData) {
        // Use REAL data from sensor
        totalDaya += device.sensorData.power || 0;
        totalTegangan += device.sensorData.voltage || 0;
        totalArus += device.sensorData.current || 0;
        deviceCount++;
      }
      // No fallback - if no sensor data, don't count it
    });

    const teganganRataRata = deviceCount > 0 
      ? +(totalTegangan / deviceCount).toFixed(2)
      : 0;
    
    const totalArusCalculated = deviceCount > 0
      ? +totalArus.toFixed(2)
      : 0;

    return {
      totalDaya: +totalDaya.toFixed(2),
      teganganRataRata,
      totalArus: totalArusCalculated
    };
  };

  const stats = calculateStats();

  // Handle add device
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.deviceId) {
      alert('Nama dan Device ID harus diisi!');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await deviceService.addDevice({
        nama: form.nama,
        deviceId: form.deviceId,
        kamarId: kamarId,
        tipe: 'esp32',
        deskripsi: `Perangkat ${form.nama} untuk monitoring listrik`
      });

      if (response.success) {
        alert('Perangkat berhasil ditambahkan!');
        setForm({ nama: '', deviceId: '' });
        setShowModal(false);
        
        // Refresh device list
        await fetchDevices();
      }
    } catch (err: any) {
      console.error('Error adding device:', err);
      const errorMsg = err.response?.data?.message || 'Gagal menambahkan perangkat';
      alert(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data
  const chartData: Record<string, string | number>[] = view === 'harian' 
    ? generateHourlyDataForDevices(perangkat) 
    : WEEKLY_MOCK_DATA;
  const xKey = view === 'harian' ? 'jam' : 'hari';
  const yLabel = view === 'harian' ? 'Daya (W)' : 'Konsumsi (kWh)';

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Memuat data perangkat...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <WattwiseStatsCards
        isDark={isDark}
        totalPerangkat={perangkat.length}
        totalDaya={stats.totalDaya}
        teganganRataRata={stats.teganganRataRata}
        totalArus={stats.totalArus}
      />

      {/* Chart */}
      <WattwiseChart
        view={view}
        setView={setView}
        chartData={chartData}
        xKey={xKey}
        yLabel={yLabel}
        perangkat={perangkat}
        totalPerangkat={perangkat.length}
      />

      {/* Chart Legend (only for harian view) */}
      {view === 'harian' && perangkat.length > 0 && (
        <WattwiseChartLegend
          isDark={isDark}
          perangkat={perangkat}
          totalDaya={stats.totalDaya}
        />
      )}

      {/* Devices List */}
      <WattwiseDevicesList
        isDark={isDark}
        perangkat={perangkat}
        onAddDevice={() => setShowModal(true)}
      />

      {/* Add Device Modal */}
      <WattwiseAddDeviceModal
        isDark={isDark}
        show={showModal}
        form={form}
        setForm={setForm}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default WattwiseTab;

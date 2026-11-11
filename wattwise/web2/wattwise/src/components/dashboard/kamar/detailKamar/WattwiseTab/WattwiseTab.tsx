import { useState } from 'react';
import { useApp } from '../../../../../context/AppContext';
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

const WattwiseTab: React.FC<WattwiseTabProps> = ({ isDark, kamarId }) => {
  const { perangkatList, addPerangkat } = useApp();
  const [view, setView] = useState<'harian' | 'mingguan'>('harian');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: '', deviceId: '' });

  // Filtered devices for this room
  const perangkat = perangkatList.filter(p => p.kamarId === kamarId);
  
  // Calculate electrical stats
  const totalDaya = perangkat.reduce((s, p) => s + p.dayaWatt, 0);
  const teganganRataRata = 220; // Volt - standar Indonesia
  const totalArus = totalDaya > 0 ? +(totalDaya / teganganRataRata).toFixed(2) : 0; // I = P / V

  // Handle add device
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.deviceId) return;
    
    // Generate random daya antara 50-500 Watt
    const randomDaya = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
    
    addPerangkat({ 
      kamarId, 
      nama: form.nama, 
      deviceId: form.deviceId, 
      dayaWatt: randomDaya 
    });
    setForm({ nama: '', deviceId: '' });
    setShowModal(false);
  };

  // Generate chart data
  const chartData: Record<string, string | number>[] = view === 'harian' 
    ? generateHourlyDataForDevices(perangkat) 
    : WEEKLY_MOCK_DATA;
  const xKey = view === 'harian' ? 'jam' : 'hari';
  const yLabel = view === 'harian' ? 'Daya (W)' : 'Konsumsi (kWh)';

  return (
    <div>
      {/* Stats Cards */}
      <WattwiseStatsCards
        isDark={isDark}
        totalPerangkat={perangkat.length}
        totalDaya={totalDaya}
        teganganRataRata={teganganRataRata}
        totalArus={totalArus}
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
          totalDaya={totalDaya}
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

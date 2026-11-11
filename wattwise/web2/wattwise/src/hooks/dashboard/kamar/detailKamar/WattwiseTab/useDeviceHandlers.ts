import { IoTDevice } from '../../../../../data/mockData';
import { Kamar } from '../../../../../types/dashboard/kamar/detailKamar';

interface UseDeviceHandlersProps {
  kamar: Kamar;
  formPerangkat: {
    name: string;
    deviceId: string;
    daya: number;
  };
  setFormPerangkat: React.Dispatch<React.SetStateAction<{
    name: string;
    deviceId: string;
    daya: number;
  }>>;
  setShowTambahPerangkatModal: React.Dispatch<React.SetStateAction<boolean>>;
  addDevice: (device: IoTDevice) => void;
  setWattwiseView: React.Dispatch<React.SetStateAction<'deviceList' | 'deviceDetail'>>;
  setSelectedDevice: React.Dispatch<React.SetStateAction<IoTDevice | null>>;
  setDetailTab: React.Dispatch<React.SetStateAction<'anomali' | 'riwayat'>>;
}

export const useDeviceHandlers = (props: UseDeviceHandlersProps) => {
  const {
    kamar,
    formPerangkat,
    setFormPerangkat,
    setShowTambahPerangkatModal,
    addDevice,
    setWattwiseView,
    setSelectedDevice,
    setDetailTab
  } = props;

  const handleTambahPerangkat = () => {
    if (formPerangkat.name && formPerangkat.deviceId) {
      const randomDaya = Math.floor(Math.random() * 300) + 150;
      const randomTegangan = 220;
      const randomArus = parseFloat((randomDaya / randomTegangan).toFixed(2));
      
      const device = {
        id: `dev${Date.now()}`,
        name: formPerangkat.name,
        deviceId: formPerangkat.deviceId,
        status: "connected" as const,
        lastUpdate: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        location: kamar.nama,
        daya: formPerangkat.daya || randomDaya,
        tegangan: randomTegangan,
        arus: randomArus,
      };
      
      addDevice(device);
      setShowTambahPerangkatModal(false);
      setFormPerangkat({ name: '', deviceId: '', daya: 0 });
    }
  };

  const handleSelectDevice = (device: IoTDevice) => {
    setSelectedDevice(device);
    setWattwiseView('deviceDetail');
    setDetailTab('anomali');
  };

  const handleBackToDeviceList = () => {
    setWattwiseView('deviceList');
    setSelectedDevice(null);
  };

  return {
    handleTambahPerangkat,
    handleSelectDevice,
    handleBackToDeviceList
  };
};

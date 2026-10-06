import { useState, useEffect } from 'react';
import { useApp, Penghuni, Payment } from '../../../../../context/AppContext';
import { Kamar } from '../../../../../types/dashboard/kamar/detailKamar';

export function useKamarLogic(kamarId?: string) {
  const { kosList, updateKamarInKos, deleteKamarFromKos } = useApp();

  // Get real kamar data from kosList and find its kos
  const getKamarAndKos = (): { kamar: Kamar; kosId: string } | null => {
    for (const kos of kosList) {
      const foundKamar = kos.kamarList.find(k => k.id === kamarId);
      if (foundKamar) {
        return { kamar: foundKamar, kosId: kos.id };
      }
    }
    return null;
  };

  const kamarData = getKamarAndKos();
  const realKamar = kamarData?.kamar || null;
  const kosId = kamarData?.kosId || '';

  // Use real data if available, otherwise use mock data
  const [kamar, setKamar] = useState<Kamar>(
    realKamar || {
      id: kamarId || 'k1',
      nama: 'Kamar 1',
      status: 'kosong',
      hargaSewa: 0,
      luasKamar: 0,
      fasilitas: [],
      maxPenghuni: 1
    }
  );

  // Only sync with context data on initial mount
  useEffect(() => {
    if (realKamar) {
      setKamar(realKamar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    kamar,
    setKamar,
    kosId,
    updateKamarInKos,
    deleteKamarFromKos
  };
}

import { Kamar } from '../../../../types/dashboard/kamar/detailKamar';

export interface Kos {
  id: string;
  nama: string;
  alamat: string;
  jumlahKamar: number;
  kamarTerisi: number;
  hargaMin: number;
  hargaMax: number;
  fasilitas: string[];
  kamarList: Kamar[];
  gambar?: string[];
  gambarProfil?: number;
}

/**
 * Find kamar and its parent kos from kosList
 * @param kosList - List of all kos
 * @param kamarId - ID of the kamar to find
 * @returns Object containing kamar and kosId, or null if not found
 */
export const getKamarAndKos = (
  kosList: Kos[],
  kamarId?: string
): { kamar: Kamar; kosId: string } | null => {
  if (!kamarId) return null;
  
  for (const kos of kosList) {
    const foundKamar = kos.kamarList.find(k => k.id === kamarId);
    if (foundKamar) {
      return { kamar: foundKamar, kosId: kos.id };
    }
  }
  return null;
};

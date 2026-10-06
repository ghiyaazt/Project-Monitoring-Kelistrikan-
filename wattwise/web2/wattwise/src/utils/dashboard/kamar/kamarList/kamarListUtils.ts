/**
 * Count the number of occupied rooms (terisi) in a kos
 * @param kos - The kos object containing kamarList
 * @returns Number of occupied rooms
 */
export const getTotalKamarTerisi = <T extends { kamarList: Array<{ status: 'terisi' | 'kosong' }> }>(
  kos: T
): number => {
  return kos.kamarList.filter(k => k.status === 'terisi').length;
};

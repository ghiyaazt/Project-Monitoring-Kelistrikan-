/**
 * Utility functions to transform database models to frontend-expected formats
 * Frontend web2 expects specific data structures (see wattwise/web2/wattwise/src/context/types.ts)
 */

/**
 * Transform Kos model to frontend format
 * @param {Object} kos - Mongoose Kos document
 * @param {Array} kamarList - Optional array of Room documents
 * @returns {Object} - Frontend-compatible Kos object
 */
const transformKosToFrontend = (kos, kamarList = []) => {
  if (!kos) return null;
  
  // Calculate hargaMin and hargaMax from kamarList
  let hargaMin = 0;
  let hargaMax = 0;
  
  if (kamarList && kamarList.length > 0) {
    const prices = kamarList.map(k => k.hargaSewa || 0);
    hargaMin = Math.min(...prices);
    hargaMax = Math.max(...prices);
  }
  
  // Construct alamat string from alamat object
  let alamatString = '';
  if (kos.alamat) {
    const parts = [
      kos.alamat.jalan,
      kos.alamat.kelurahan,
      kos.alamat.kecamatan,
      kos.alamat.kota,
      kos.alamat.provinsi,
      kos.alamat.kodePos
    ].filter(Boolean);
    alamatString = parts.join(', ');
  }
  
  return {
    id: kos._id.toString(),
    nama: kos.namaKos || '',
    alamat: alamatString,
    jumlahKamar: kos.totalKamar || 0,
    kamarTerisi: kos.kamarTerisi || 0,
    hargaMin: hargaMin,
    hargaMax: hargaMax,
    fasilitas: kos.fasilitasUmum || [],
    kamarList: kamarList.map(k => transformKamarToFrontend(k)),
    gambar: kos.gambar || [],
    gambarProfil: kos.gambarProfil || 0
  };
};

/**
 * Transform Room (Kamar) model to frontend format
 * @param {Object} kamar - Mongoose Room document
 * @param {Array} penghuniList - Optional array of Penghuni documents
 * @param {Array} payments - Optional array of Payment documents
 * @returns {Object} - Frontend-compatible Kamar object
 */
const transformKamarToFrontend = (kamar, penghuniList = [], payments = []) => {
  if (!kamar) return null;
  
  return {
    id: kamar._id.toString(),
    nama: kamar.nama || '',
    status: kamar.status || 'kosong',
    penghuniList: penghuniList.map(p => transformPenghuniToFrontend(p)),
    hargaSewa: kamar.hargaSewa || 0,
    luasKamar: kamar.luasKamar || 0,
    fasilitas: kamar.fasilitas || [],
    maxPenghuni: kamar.maxPenghuni || 1,
    gambar: kamar.gambar || [],
    gambarProfil: kamar.gambarProfil || 0,
    payments: payments.map(p => transformPaymentToFrontend(p))
  };
};

/**
 * Transform Penghuni model to frontend format
 * @param {Object} penghuni - Mongoose Penghuni document
 * @returns {Object} - Frontend-compatible Penghuni object
 */
const transformPenghuniToFrontend = (penghuni) => {
  if (!penghuni) return null;
  
  return {
    id: penghuni._id.toString(),
    nama: penghuni.nama || '',
    email: penghuni.email || '',
    telepon: penghuni.no_telp || '',
    tanggalMasuk: penghuni.tanggalMasuk ? penghuni.tanggalMasuk.toISOString() : new Date().toISOString()
  };
};

/**
 * Transform Payment model to frontend format
 * @param {Object} payment - Mongoose Payment document
 * @returns {Object} - Frontend-compatible Payment object
 */
const transformPaymentToFrontend = (payment) => {
  if (!payment) return null;
  
  return {
    id: payment._id.toString(),
    bulan: payment.bulan || '',
    tahun: payment.tahun || new Date().getFullYear(),
    jumlah: payment.jumlah || 0,
    status: payment.status || 'belum_bayar',
    tanggalBayar: payment.tanggalBayar ? payment.tanggalBayar.toISOString().split('T')[0] : undefined,
    metodePembayaran: payment.metodePembayaran || undefined,
    tanggalJatuhTempo: payment.tanggalJatuhTempo ? payment.tanggalJatuhTempo.toISOString().split('T')[0] : undefined,
    buktiPembayaran: payment.buktiPembayaran || undefined
  };
};

/**
 * Transform Device model to frontend IoTDevice format
 * @param {Object} device - Mongoose Device document
 * @param {Object} sensorData - Latest sensor data (optional)
 * @returns {Object} - Frontend-compatible IoTDevice object
 */
const transformDeviceToFrontend = (device, sensorData = null) => {
  if (!device) return null;
  
  return {
    id: device._id.toString(),
    name: device.device_name || device.device_id || 'Unknown Device',
    deviceId: device.device_id || '',
    status: device.status || 'disconnected',
    lastUpdate: device.lastDataReceived ? device.lastDataReceived.toISOString() : new Date().toISOString(),
    location: device.location || undefined,
    daya: sensorData?.power || undefined,
    tegangan: sensorData?.voltage || undefined,
    arus: sensorData?.current || undefined
  };
};

/**
 * Transform Perangkat model to frontend format
 * @param {Object} perangkat - Mongoose Perangkat document
 * @returns {Object} - Frontend-compatible Perangkat object
 */
const transformPerangkatToFrontend = (perangkat) => {
  if (!perangkat) return null;
  
  return {
    id: perangkat._id.toString(),
    kamarId: perangkat.kamarId.toString(),
    nama: perangkat.nama || '',
    deviceId: perangkat.deviceId || '',
    dayaWatt: perangkat.dayaWatt || 0
  };
};

/**
 * Transform Group model to frontend format
 * @param {Object} group - Mongoose Group document
 * @returns {Object} - Frontend-compatible Group object
 */
const transformGroupToFrontend = (group) => {
  if (!group) return null;
  
  return {
    id: group._id.toString(),
    name: group.name || '',
    devices: group.devices || [],
    totalDaya: group.totalDaya || 0
  };
};

/**
 * Transform User model to frontend format
 * @param {Object} user - Mongoose User document
 * @returns {Object} - Frontend-compatible User object
 */
const transformUserToFrontend = (user) => {
  if (!user) return null;
  
  return {
    id: user._id.toString(),
    name: user.nama || '',
    email: user.email || '',
    deviceId: user.device_id || undefined
  };
};

module.exports = {
  transformKosToFrontend,
  transformKamarToFrontend,
  transformPenghuniToFrontend,
  transformPaymentToFrontend,
  transformDeviceToFrontend,
  transformPerangkatToFrontend,
  transformGroupToFrontend,
  transformUserToFrontend
};

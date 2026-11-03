import apiClient from './apiClient';

export interface PenghuniData {
  nama: string;
  email: string;
  telepon: string;
  kamarId: string;
  tanggalMasuk?: string;
  identitas?: {
    nomorKTP?: string;
    fotoKTP?: string;
  };
  kontakDarurat?: {
    nama?: string;
    hubungan?: string;
    telepon?: string;
  };
  catatan?: string;
  userId?: string; // Optional: for owner input
}

export interface PaymentData {
  bulan: string;
  tahun: number;
  jumlah: number;
  status?: 'lunas' | 'sudah_bayar' | 'belum_bayar' | 'terlambat';
  tanggalBayar?: string;
  tanggalJatuhTempo: string;
  metodePembayaran?: string;
  buktiPembayaran?: string;
  keterangan?: string;
}

class PenghuniService {
  /**
   * Create new penghuni (self-register or owner input)
   */
  async createPenghuni(data: PenghuniData): Promise<any> {
    const response = await apiClient.post('/penghuni', data);
    return response.data;
  }

  /**
   * Get all penghuni (filtered by role)
   */
  async getAllPenghuni(params?: { status?: string; kamarId?: string }): Promise<any> {
    const response = await apiClient.get('/penghuni', { params });
    return response.data;
  }

  /**
   * Get penghuni by ID
   */
  async getPenghuniById(id: string): Promise<any> {
    const response = await apiClient.get(`/penghuni/${id}`);
    return response.data;
  }

  /**
   * Update penghuni
   */
  async updatePenghuni(id: string, data: Partial<PenghuniData>): Promise<any> {
    const response = await apiClient.put(`/penghuni/${id}`, data);
    return response.data;
  }

  /**
   * Delete/Checkout penghuni
   */
  async deletePenghuni(id: string): Promise<any> {
    const response = await apiClient.delete(`/penghuni/${id}`);
    return response.data;
  }

  /**
   * Add payment to penghuni
   */
  async addPayment(penghuniId: string, data: PaymentData): Promise<any> {
    const response = await apiClient.post(`/penghuni/${penghuniId}/payment`, data);
    return response.data;
  }

  /**
   * Update payment status
   */
  async updatePayment(
    penghuniId: string, 
    paymentId: string, 
    data: Partial<PaymentData>
  ): Promise<any> {
    const response = await apiClient.put(
      `/penghuni/${penghuniId}/payment/${paymentId}`, 
      data
    );
    return response.data;
  }

  /**
   * Get penghuni by room
   */
  async getPenghuniByRoom(kamarId: string): Promise<any> {
    const response = await apiClient.get(`/penghuni/room/${kamarId}`);
    return response.data;
  }
}

export default new PenghuniService();

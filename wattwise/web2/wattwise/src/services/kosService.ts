import apiClient from './apiClient';

export interface KosData {
  namaKos: string;
  alamat: {
    jalan: string;
    kelurahan?: string;
    kecamatan?: string;
    kota: string;
    provinsi: string;
    kodePos?: string;
  };
  deskripsi?: string;
  fasilitasUmum?: string[];
  peraturan?: string[];
  kontakPemilik?: {
    telepon?: string;
    whatsapp?: string;
    email?: string;
  };
  gambar?: string[];
  gambarProfil?: number;
}

class KosService {
  /**
   * Create new kos
   */
  async createKos(data: KosData): Promise<any> {
    const response = await apiClient.post('/kos', data);
    return response.data;
  }

  /**
   * Get all kos (filtered by role)
   */
  async getAllKos(params?: { status?: string; kota?: string; search?: string }): Promise<any> {
    const response = await apiClient.get('/kos', { params });
    return response.data;
  }

  /**
   * Get kos by ID (with kamar list)
   */
  async getKosById(id: string): Promise<any> {
    const response = await apiClient.get(`/kos/${id}`);
    return response.data;
  }

  /**
   * Update kos
   */
  async updateKos(id: string, data: Partial<KosData>): Promise<any> {
    const response = await apiClient.put(`/kos/${id}`, data);
    return response.data;
  }

  /**
   * Delete kos
   */
  async deleteKos(id: string): Promise<any> {
    const response = await apiClient.delete(`/kos/${id}`);
    return response.data;
  }

  /**
   * Get kos statistics
   */
  async getKosStats(): Promise<any> {
    const response = await apiClient.get('/kos/stats/overview');
    return response.data;
  }

  /**
   * Update kos statistics manually
   */
  async updateKosStats(id: string): Promise<any> {
    const response = await apiClient.put(`/kos/${id}/stats`);
    return response.data;
  }
}

export default new KosService();

import apiClient from './apiClient';

export interface DeviceData {
  nama: string;
  deviceId: string;
  kamarId: string;
  dayaWatt: number;
  tipe?: 'esp32' | 'sensor' | 'relay' | 'smart_plug' | 'lainnya';
  mqttTopic?: string;
  deskripsi?: string;
}

class DeviceService {
  /**
   * Create new device
   */
  async createDevice(data: DeviceData): Promise<any> {
    const response = await apiClient.post('/devices', data);
    return response.data;
  }

  /**
   * Get all devices (filtered by role)
   */
  async getAllDevices(params?: { kamarId?: string; status?: string }): Promise<any> {
    const response = await apiClient.get('/devices', { params });
    return response.data;
  }

  /**
   * Get device by ID
   */
  async getDeviceById(id: string): Promise<any> {
    const response = await apiClient.get(`/devices/${id}`);
    return response.data;
  }

  /**
   * Update device
   */
  async updateDevice(id: string, data: Partial<DeviceData>): Promise<any> {
    const response = await apiClient.put(`/devices/${id}`, data);
    return response.data;
  }

  /**
   * Delete device
   */
  async deleteDevice(id: string): Promise<any> {
    const response = await apiClient.delete(`/devices/${id}`);
    return response.data;
  }

  /**
   * Get device statistics
   */
  async getDeviceStats(): Promise<any> {
    const response = await apiClient.get('/devices/stats/overview');
    return response.data;
  }

  /**
   * Update device real-time data (from MQTT)
   */
  async updateDeviceData(deviceId: string, data: {
    voltage?: number;
    current?: number;
    power?: number;
    energy?: number;
    frequency?: number;
    powerFactor?: number;
  }): Promise<any> {
    const response = await apiClient.put(`/devices/${deviceId}/data`, data);
    return response.data;
  }

  /**
   * Get device history
   */
  async getDeviceHistory(id: string, limit: number = 100): Promise<any> {
    const response = await apiClient.get(`/devices/${id}/history`, {
      params: { limit }
    });
    return response.data;
  }
}

export default new DeviceService();

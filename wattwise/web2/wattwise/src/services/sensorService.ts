import apiClient from './apiClient';

export interface SensorData {
  _id: string;
  device_id: string;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerfactor: number;
  timestamp: string;
  date?: string;
}

export interface DeviceSensorData {
  deviceId: string;
  data: SensorData | null;
}

class SensorService {
  /**
   * Get latest sensor data by device ID
   */
  async getLatestByDevice(deviceId: string): Promise<any> {
    const response = await apiClient.get(`/sensor/device/${deviceId}`);
    return response.data;
  }

  /**
   * Get latest sensor data for multiple devices in a room
   */
  async getLatestByRoom(deviceIds: string[]): Promise<any> {
    const response = await apiClient.post('/sensor/room/latest', { deviceIds });
    return response.data;
  }

  /**
   * Get all sensor data with pagination
   */
  async getAll(page: number = 1, limit: number = 50): Promise<any> {
    const response = await apiClient.get(`/sensor/all?page=${page}&limit=${limit}`);
    return response.data;
  }

  /**
   * Get sensor data by date range
   */
  async getByDateRange(start: string, end: string): Promise<any> {
    const response = await apiClient.get(`/sensor/range?start=${start}&end=${end}`);
    return response.data;
  }

  /**
   * Get sensor statistics
   */
  async getStatistics(): Promise<any> {
    const response = await apiClient.get('/sensor/stats');
    return response.data;
  }

  /**
   * Create sensor data manually (for testing)
   */
  async createSensorData(data: Partial<SensorData>): Promise<any> {
    const response = await apiClient.post('/sensor', data);
    return response.data;
  }
}

export default new SensorService();

import apiClient from './apiClient';

class FinanceService {
  /**
   * Get financial statistics
   */
  async getFinanceStats(): Promise<any> {
    const response = await apiClient.get('/finance/stats');
    return response.data;
  }

  /**
   * Get monthly financial report
   */
  async getMonthlyReport(bulan: string, tahun: number): Promise<any> {
    const response = await apiClient.get('/finance/report', {
      params: { bulan, tahun }
    });
    return response.data;
  }

  /**
   * Get overdue payments
   */
  async getOverduePayments(): Promise<any> {
    const response = await apiClient.get('/finance/overdue');
    return response.data;
  }

  /**
   * Get yearly financial summary
   */
  async getYearlySummary(tahun?: number): Promise<any> {
    const response = await apiClient.get('/finance/yearly', {
      params: { tahun }
    });
    return response.data;
  }

  /**
   * Get payment history for a penghuni
   */
  async getPenghuniPaymentHistory(penghuniId: string): Promise<any> {
    const response = await apiClient.get(`/finance/penghuni/${penghuniId}/history`);
    return response.data;
  }
}

export default new FinanceService();

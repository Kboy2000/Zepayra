import api from './api';

const analyticsService = {
  getSpendingAnalytics: async () => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/analytics/spending');
      // return response.data;

      // Mock data for demonstration
      return {
        success: true,
        data: {
          spendingThisMonth: 125400,
          spendingChange: 15.2,
          transactionsCount: 42,
          transactionsChange: 5,
          topCategory: {
            name: 'Utilities',
            amount: 45000
          },
          categoryBreakdown: [
            { name: 'Airtime', amount: 15000 },
            { name: 'Data', amount: 25000 },
            { name: 'Utilities', amount: 45000 },
            { name: 'Cable TV', amount: 20000 },
            { name: 'Transfers', amount: 20400 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching spending analytics:', error);
      return { success: false, error: 'Failed to fetch analytics' };
    }
  }
};

export default analyticsService;
 Broadway

import api from './api';

const transactionService = {
  // Get all transactions
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data || response;
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data || response;
  },

  // Requery transaction
  requeryTransaction: async (id) => {
    const response = await api.post(`/transactions/${id}/requery`);
    return response.data || response;
  },

  // Get transaction statistics
  getStats: async () => {
    const response = await api.get('/transactions/stats');
    return response.data || response;
  },

  // Get recent transactions (for Recent Recipients feature)
  getRecent: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { 
        params: {
          ...params,
          page: 1,
          limit: params.limit || 5,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });
      return response.data?.data?.transactions || [];
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      // Return empty array if backend not available
      return [];
    }
  },
};

export default transactionService;

import api from './api';

const walletService = {
  // Get wallet balance
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data || response;
  },

  // Credit wallet (manual)
  creditWallet: async (amount, description) => {
    const response = await api.post('/wallet/credit', { amount, description });
    return response.data || response;
  },

  // Get transaction history
  getHistory: async (params = {}) => {
    const response = await api.get('/wallet/history', { params });
    return response.data || response;
  },
};

export default walletService;

import api from './api';

const serviceService = {
  // Get all services
  getServices: async () => {
    const response = await api.get('/services');
    return response.data || response;
  },

  // Get service variations
  getServiceVariations: async (serviceId) => {
    const response = await api.get(`/services/${serviceId}/variations`);
    return response.data || response;
  },

  // Purchase airtime
  purchaseAirtime: async (data) => {
    const response = await api.post('/services/airtime', data);
    return response;
  },

  // Purchase data
  purchaseData: async (data) => {
    const response = await api.post('/services/data', data);
    return response;
  },

  // Pay electricity
  payElectricity: async (data) => {
    const response = await api.post('/services/electricity', data);
    return response;
  },

  // Subscribe to cable TV
  subscribeCableTV: async (data) => {
    const response = await api.post('/services/tv', data);
    return response;
  },
};

export default serviceService;

import api from './api';

const beneficiaryService = {
  // Get all beneficiaries for a user
  getBeneficiaries: async (params = {}) => {
    try {
      const response = await api.get('/beneficiaries', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      // Return mock data for now
      return [];
    }
  },

  // Get single beneficiary
  getBeneficiary: async (id) => {
    try {
      const response = await api.get(`/beneficiaries/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching beneficiary:', error);
      throw error;
    }
  },

  // Create new beneficiary
  createBeneficiary: async (data) => {
    try {
      const response = await api.post('/beneficiaries', data);
      return response.data.data;
    } catch (error) {
      // Silently fail if beneficiary already exists
      if (error.response?.status === 400) {
        return null;
      }
      console.error('Error creating beneficiary:', error);
      throw error;
    }
  },

  // Update beneficiary
  updateBeneficiary: async (id, data) => {
    try {
      const response = await api.put(`/beneficiaries/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      throw error;
    }
  },

  // Delete beneficiary
  deleteBeneficiary: async (id) => {
    try {
      const response = await api.delete(`/beneficiaries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      throw error;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (id) => {
    try {
      const response = await api.put(`/beneficiaries/${id}/favorite`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Increment usage count
  incrementUsage: async (id) => {
    try {
      const response = await api.put(`/beneficiaries/${id}/usage`);
      return response.data.data;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      // Don't throw error, just log it
      return null;
    }
  },
};

export default beneficiaryService;

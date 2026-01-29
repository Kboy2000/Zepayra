const vtpassConfig = require('../config/vtpass');
const logger = require('../utils/logger');
const { generateRequestId, sleep } = require('../utils/helpers');

class VTpassService {
  constructor() {
    this.client = vtpassConfig.getClient();
  }

  /**
   * Fetch all available services from VTpass
   */
  async getServices() {
    try {
      const response = await this.client.get('/services');
      logger.success('Fetched VTpass services successfully');
      return response.data;
    } catch (error) {
      logger.error(`VTpass getServices error: ${error.message}`);
      throw new Error('Failed to fetch services from VTpass');
    }
  }

  /**
   * Get service variations (e.g., data plans)
   */
  async getServiceVariations(serviceID) {
    try {
      const response = await this.client.get('/service-variations', {
        params: { serviceID },
      });
      logger.success(`Fetched variations for ${serviceID}`);
      return response.data;
    } catch (error) {
      logger.error(`VTpass getServiceVariations error: ${error.message}`);
      throw new Error('Failed to fetch service variations');
    }
  }

  /**
   * Verify customer details (for electricity, cable TV)
   */
  async verifyCustomer(serviceID, billersCode, type = null) {
    try {
      const params = {
        billersCode,
        serviceID,
      };

      if (type) {
        params.type = type;
      }

      const response = await this.client.post('/merchant-verify', params);
      logger.success(`Verified customer for ${serviceID}`);
      return response.data;
    } catch (error) {
      logger.error(`VTpass verifyCustomer error: ${error.message}`);
      throw new Error('Failed to verify customer details');
    }
  }

  /**
   * Purchase airtime
   */
  async purchaseAirtime(phone, amount, serviceID) {
    try {
      const requestId = generateRequestId();
      
      const payload = {
        request_id: requestId,
        serviceID: serviceID,
        amount: amount,
        phone: phone,
      };

      logger.info(`Purchasing airtime: ${JSON.stringify(payload)}`);
      
      const response = await this.client.post('/pay', payload);
      
      logger.success(`Airtime purchase successful: ${requestId}`);
      return {
        ...response.data,
        requestId,
      };
    } catch (error) {
      logger.error(`VTpass purchaseAirtime error: ${error.response?.data || error.message}`);
      throw new Error(error.response?.data?.message || 'Airtime purchase failed');
    }
  }

  /**
   * Purchase data bundle
   */
  async purchaseData(phone, serviceID, variationCode) {
    try {
      const requestId = generateRequestId();
      
      const payload = {
        request_id: requestId,
        serviceID: serviceID,
        billersCode: phone,
        variation_code: variationCode,
        phone: phone,
      };

      logger.info(`Purchasing data: ${JSON.stringify(payload)}`);
      
      const response = await this.client.post('/pay', payload);
      
      logger.success(`Data purchase successful: ${requestId}`);
      return {
        ...response.data,
        requestId,
      };
    } catch (error) {
      logger.error(`VTpass purchaseData error: ${error.response?.data || error.message}`);
      throw new Error(error.response?.data?.message || 'Data purchase failed');
    }
  }

  /**
   * Pay electricity bill
   */
  async payElectricity(meterNumber, amount, serviceID, variationCode, phone) {
    try {
      const requestId = generateRequestId();
      
      const payload = {
        request_id: requestId,
        serviceID: serviceID,
        billersCode: meterNumber,
        variation_code: variationCode,
        amount: amount,
        phone: phone,
      };

      logger.info(`Paying electricity: ${JSON.stringify(payload)}`);
      
      const response = await this.client.post('/pay', payload);
      
      logger.success(`Electricity payment successful: ${requestId}`);
      return {
        ...response.data,
        requestId,
      };
    } catch (error) {
      logger.error(`VTpass payElectricity error: ${error.response?.data || error.message}`);
      throw new Error(error.response?.data?.message || 'Electricity payment failed');
    }
  }

  /**
   * Subscribe to cable TV
   */
  async subscribeCableTV(smartCardNumber, serviceID, variationCode, phone) {
    try {
      const requestId = generateRequestId();
      
      const payload = {
        request_id: requestId,
        serviceID: serviceID,
        billersCode: smartCardNumber,
        variation_code: variationCode,
        phone: phone,
      };

      logger.info(`Subscribing cable TV: ${JSON.stringify(payload)}`);
      
      const response = await this.client.post('/pay', payload);
      
      logger.success(`Cable TV subscription successful: ${requestId}`);
      return {
        ...response.data,
        requestId,
      };
    } catch (error) {
      logger.error(`VTpass subscribeCableTV error: ${error.response?.data || error.message}`);
      throw new Error(error.response?.data?.message || 'Cable TV subscription failed');
    }
  }

  /**
   * Requery transaction status
   */
  async requeryTransaction(requestId) {
    try {
      const response = await this.client.post('/requery', {
        request_id: requestId,
      });
      
      logger.success(`Requeried transaction: ${requestId}`);
      return response.data;
    } catch (error) {
      logger.error(`VTpass requeryTransaction error: ${error.message}`);
      throw new Error('Failed to requery transaction');
    }
  }

  /**
   * Get wallet balance (VTpass sandbox balance)
   */
  async getBalance() {
    try {
      const response = await this.client.get('/balance');
      logger.success('Fetched VTpass balance');
      return response.data;
    } catch (error) {
      logger.error(`VTpass getBalance error: ${error.message}`);
      throw new Error('Failed to fetch VTpass balance');
    }
  }
}

module.exports = new VTpassService();

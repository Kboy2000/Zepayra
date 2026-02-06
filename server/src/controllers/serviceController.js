const vtpassService = require('../services/vtpassService');
const walletService = require('../services/walletService');
const Service = require('../models/Service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { formatPhoneNumber, getNetworkProvider } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Private
 */
const getServices = async (req, res, next) => {
  try {
    // Try to get from database first (cached)
    let services = await Service.find({ isActive: true });

    // If no services in DB, fetch from VTpass
    if (services.length === 0) {
      const vtpassServices = await vtpassService.getServices();
      
      // Cache services in database
      // Note: This is a simplified version, you might want to map and filter
      logger.info('Services fetched from VTpass, caching...');
    }

    return successResponse(res, 200, 'Services retrieved successfully', { services });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get service variations
 * @route   GET /api/services/:serviceId/variations
 * @access  Private
 */
const getServiceVariations = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const variations = await vtpassService.getServiceVariations(serviceId);

    return successResponse(res, 200, 'Service variations retrieved', { variations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Purchase airtime
 * @route   POST /api/services/airtime
 * @access  Private
 */
const purchaseAirtime = async (req, res, next) => {
  try {
    const { phone, amount, network: providedNetwork } = req.body;

    const formattedPhone = formatPhoneNumber(phone);
    
    // Use provided network or auto-detect
    let network = providedNetwork ? providedNetwork.toUpperCase() : getNetworkProvider(formattedPhone);

    if (!network) {
      return errorResponse(res, 400, 'Could not detect network provider. Please specify the network.');
    }

    // Map network to VTpass service ID
    const serviceIdMap = {
      MTN: 'mtn',
      AIRTEL: 'airtel',
      GLO: 'glo',
      '9MOBILE': 'etisalat',
    };

    const serviceID = serviceIdMap[network];

    if (!serviceID) {
      return errorResponse(res, 400, `Unsupported network: ${network}`);
    }

    // Debit wallet first
    const debitResult = await walletService.debitWallet(
      req.user._id,
      amount,
      'airtime',
      `${network} Airtime - ${formattedPhone}`,
      {
        serviceProvider: network,
        recipientDetails: { phone: formattedPhone },
      }
    );

    try {
      // Purchase airtime via VTpass
      const vtpassResponse = await vtpassService.purchaseAirtime(
        formattedPhone,
        amount,
        serviceID
      );

      // Update transaction with VTpass response
      const transaction = await walletService.updateTransactionStatus(
        debitResult.transaction._id,
        'success',
        vtpassResponse
      );

      transaction.requestId = vtpassResponse.requestId;
      await transaction.save();

      logger.success(`Airtime purchase successful: ${formattedPhone}`);

      return successResponse(res, 200, 'Airtime purchase successful', {
        transaction,
        balance: debitResult.wallet.balance,
      });
    } catch (vtpassError) {
      // Refund wallet if VTpass fails
      await walletService.refundWallet(debitResult.transaction._id);
      
      logger.error(`Airtime purchase failed, wallet refunded: ${vtpassError.message}`);
      
      return errorResponse(res, 400, vtpassError.message || 'Airtime purchase failed');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Purchase data
 * @route   POST /api/services/data
 * @access  Private
 */
const purchaseData = async (req, res, next) => {
  try {
    const { phone, serviceID, variationCode, amount } = req.body;

    const formattedPhone = formatPhoneNumber(phone);

    // Debit wallet first
    const debitResult = await walletService.debitWallet(
      req.user._id,
      amount,
      'data',
      `Data Bundle - ${formattedPhone}`,
      {
        serviceProvider: serviceID.toUpperCase(),
        recipientDetails: { phone: formattedPhone },
      }
    );

    try {
      // Purchase data via VTpass
      const vtpassResponse = await vtpassService.purchaseData(
        formattedPhone,
        serviceID,
        variationCode
      );

      // Update transaction
      const transaction = await walletService.updateTransactionStatus(
        debitResult.transaction._id,
        'success',
        vtpassResponse
      );

      transaction.requestId = vtpassResponse.requestId;
      await transaction.save();

      logger.success(`Data purchase successful: ${formattedPhone}`);

      return successResponse(res, 200, 'Data purchase successful', {
        transaction,
        balance: debitResult.wallet.balance,
      });
    } catch (vtpassError) {
      await walletService.refundWallet(debitResult.transaction._id);
      logger.error(`Data purchase failed, wallet refunded: ${vtpassError.message}`);
      return errorResponse(res, 400, vtpassError.message || 'Data purchase failed');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Pay electricity bill
 * @route   POST /api/services/electricity
 * @access  Private
 */
const payElectricity = async (req, res, next) => {
  try {
    const { meterNumber, amount, serviceID, meterType, phone } = req.body;

    const formattedPhone = formatPhoneNumber(phone);
    
    // Map meter type to variation code
    const variationCode = meterType === 'prepaid' ? 'prepaid' : 'postpaid';

    // Verify customer first
    const verification = await vtpassService.verifyCustomer(
      serviceID,
      meterNumber,
      variationCode
    );

    if (!verification || verification.code !== '000') {
      return errorResponse(res, 400, 'Invalid meter number or customer details');
    }

    // Debit wallet
    const debitResult = await walletService.debitWallet(
      req.user._id,
      amount,
      'electricity',
      `Electricity - ${meterNumber}`,
      {
        serviceProvider: serviceID.toUpperCase(),
        recipientDetails: {
          meterNumber,
          customerName: verification.content?.Customer_Name,
          address: verification.content?.Address,
        },
      }
    );

    try {
      // Pay electricity via VTpass
      const vtpassResponse = await vtpassService.payElectricity(
        meterNumber,
        amount,
        serviceID,
        variationCode,
        formattedPhone
      );

      // Update transaction
      const transaction = await walletService.updateTransactionStatus(
        debitResult.transaction._id,
        'success',
        vtpassResponse
      );

      transaction.requestId = vtpassResponse.requestId;
      await transaction.save();

      logger.success(`Electricity payment successful: ${meterNumber}`);

      return successResponse(res, 200, 'Electricity payment successful', {
        transaction,
        balance: debitResult.wallet.balance,
        token: vtpassResponse.purchased_code, // Electricity token
      });
    } catch (vtpassError) {
      await walletService.refundWallet(debitResult.transaction._id);
      logger.error(`Electricity payment failed, wallet refunded: ${vtpassError.message}`);
      return errorResponse(res, 400, vtpassError.message || 'Electricity payment failed');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Subscribe to cable TV
 * @route   POST /api/services/tv
 * @access  Private
 */
const subscribeCableTV = async (req, res, next) => {
  try {
    const { smartCardNumber, serviceID, variationCode, phone, amount } = req.body;

    const formattedPhone = formatPhoneNumber(phone);

    // Verify customer
    const verification = await vtpassService.verifyCustomer(serviceID, smartCardNumber);

    if (!verification || verification.code !== '000') {
      return errorResponse(res, 400, 'Invalid smart card number');
    }

    // Debit wallet
    const debitResult = await walletService.debitWallet(
      req.user._id,
      amount,
      'tv',
      `Cable TV - ${smartCardNumber}`,
      {
        serviceProvider: serviceID.toUpperCase(),
        recipientDetails: {
          smartCardNumber,
          customerName: verification.content?.Customer_Name,
        },
      }
    );

    try {
      // Subscribe via VTpass
      const vtpassResponse = await vtpassService.subscribeCableTV(
        smartCardNumber,
        serviceID,
        variationCode,
        formattedPhone
      );

      // Update transaction
      const transaction = await walletService.updateTransactionStatus(
        debitResult.transaction._id,
        'success',
        vtpassResponse
      );

      transaction.requestId = vtpassResponse.requestId;
      await transaction.save();

      logger.success(`Cable TV subscription successful: ${smartCardNumber}`);

      return successResponse(res, 200, 'Cable TV subscription successful', {
        transaction,
        balance: debitResult.wallet.balance,
      });
    } catch (vtpassError) {
      await walletService.refundWallet(debitResult.transaction._id);
      logger.error(`Cable TV subscription failed, wallet refunded: ${vtpassError.message}`);
      return errorResponse(res, 400, vtpassError.message || 'Cable TV subscription failed');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceVariations,
  purchaseAirtime,
  purchaseData,
  payElectricity,
  subscribeCableTV,
};

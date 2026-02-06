const walletService = require('../services/walletService');
const Transaction = require('../models/Transaction');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * @desc    Get wallet balance
 * @route   GET /api/wallet/balance
 * @access  Private
 */
const getBalance = async (req, res, next) => {
  try {
    const wallet = await walletService.getWallet(req.user._id);

    return successResponse(res, 200, 'Wallet balance retrieved', {
      balance: wallet.balance,
      currency: wallet.currency,
      lastTransaction: wallet.lastTransaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Credit wallet (Admin/Manual)
 * @route   POST /api/wallet/credit
 * @access  Private
 */
const creditWallet = async (req, res, next) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return errorResponse(res, 400, 'Invalid amount');
    }

    const result = await walletService.creditWallet(
      req.user._id,
      amount,
      description || 'Manual wallet funding'
    );

    logger.success(`Wallet credited: ${req.user.email} - ₦${amount}`);

    return successResponse(res, 200, 'Wallet credited successfully', {
      balance: result.wallet.balance,
      transaction: result.transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get wallet transaction history
 * @route   GET /api/wallet/history
 * @access  Private
 */
const getTransactionHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status } = req.query;

    const query = { userId: req.user._id };

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments(query);

    return successResponse(res, 200, 'Transaction history retrieved', {
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  creditWallet,
  getTransactionHistory,
};

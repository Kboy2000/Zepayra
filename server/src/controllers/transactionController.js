const Transaction = require('../models/Transaction');
const vtpassService = require('../services/vtpassService');
const walletService = require('../services/walletService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * @desc    Get all transactions for user
 * @route   GET /api/transactions
 * @access  Private
 */
const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status, type } = req.query;

    const query = { userId: req.user._id };

    if (category) query.category = category;
    if (status) query.status = status;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments(query);

    return successResponse(res, 200, 'Transactions retrieved successfully', {
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single transaction details
 * @route   GET /api/transactions/:id
 * @access  Private
 */
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return errorResponse(res, 404, 'Transaction not found');
    }

    return successResponse(res, 200, 'Transaction retrieved successfully', {
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Requery pending transaction
 * @route   POST /api/transactions/:id/requery
 * @access  Private
 */
const requeryTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return errorResponse(res, 404, 'Transaction not found');
    }

    if (transaction.status !== 'pending') {
      return errorResponse(res, 400, 'Only pending transactions can be requeried');
    }

    if (!transaction.requestId) {
      return errorResponse(res, 400, 'Transaction does not have a VTpass request ID');
    }

    // Requery from VTpass
    const vtpassResponse = await vtpassService.requeryTransaction(transaction.requestId);

    // Update transaction based on requery response
    let newStatus = 'pending';
    
    if (vtpassResponse.content?.transactions?.status === 'delivered') {
      newStatus = 'success';
    } else if (vtpassResponse.content?.transactions?.status === 'failed') {
      newStatus = 'failed';
      // Refund wallet
      await walletService.refundWallet(transaction._id);
    }

    const updatedTransaction = await walletService.updateTransactionStatus(
      transaction._id,
      newStatus,
      vtpassResponse
    );

    logger.success(`Transaction requeried: ${transaction._id} - ${newStatus}`);

    return successResponse(res, 200, 'Transaction requeried successfully', {
      transaction: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get transaction statistics
 * @route   GET /api/transactions/stats
 * @access  Private
 */
const getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total spent (successful debits)
    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'debit',
          status: 'success',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'debit',
          status: 'success',
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent transactions count
    const recentCount = await Transaction.countDocuments({
      userId: userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    });

    return successResponse(res, 200, 'Transaction statistics retrieved', {
      totalSpent: totalSpent[0]?.total || 0,
      categoryBreakdown,
      recentTransactions: recentCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  requeryTransaction,
  getTransactionStats,
};

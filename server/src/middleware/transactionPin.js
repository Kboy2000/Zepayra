const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Middleware to verify transaction PIN for sensitive operations
 */
const verifyTransactionPin = async (req, res, next) => {
  try {
    const { transactionPin } = req.body;

    // Get user with transaction PIN
    const user = await User.findById(req.user._id).select('+transactionPin');

    // Check if user has set a PIN
    if (!user.hasPinSet) {
      return errorResponse(
        res,
        400,
        'Please set a transaction PIN before making purchases'
      );
    }

    // Check if PIN was provided
    if (!transactionPin) {
      return errorResponse(res, 400, 'Transaction PIN is required');
    }

    // Verify PIN
    const isPinValid = await user.compareTransactionPin(transactionPin);

    if (!isPinValid) {
      return errorResponse(res, 401, 'Invalid transaction PIN');
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, 'Server error during PIN verification');
  }
};

/**
 * Middleware to check if PIN is optional (user hasn't set one yet)
 * Allows transactions without PIN if user hasn't set one
 */
const optionalTransactionPin = async (req, res, next) => {
  try {
    const { transactionPin } = req.body;

    // Get user with transaction PIN
    const user = await User.findById(req.user._id).select('+transactionPin');

    // If user has PIN set, verify it
    if (user.hasPinSet) {
      if (!transactionPin) {
        return errorResponse(res, 400, 'Transaction PIN is required');
      }

      const isPinValid = await user.compareTransactionPin(transactionPin);

      if (!isPinValid) {
        return errorResponse(res, 401, 'Invalid transaction PIN');
      }
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, 'Server error during PIN verification');
  }
};

module.exports = {
  verifyTransactionPin,
  optionalTransactionPin,
};

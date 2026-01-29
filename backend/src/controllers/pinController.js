const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * @desc    Set transaction PIN
 * @route   POST /api/pin/set
 * @access  Private
 */
const setTransactionPin = async (req, res, next) => {
  try {
    const { pin, confirmPin } = req.body;

    // Validate PIN format
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return errorResponse(res, 400, 'PIN must be exactly 4 digits');
    }

    // Check if PINs match
    if (pin !== confirmPin) {
      return errorResponse(res, 400, 'PINs do not match');
    }

    // Get user
    const user = await User.findById(req.user._id);

    // Check if PIN already set
    if (user.hasPinSet) {
      return errorResponse(
        res,
        400,
        'Transaction PIN already set. Use change PIN endpoint to update.'
      );
    }

    // Set PIN
    user.transactionPin = pin;
    await user.save();

    logger.success(`Transaction PIN set for user: ${user.email}`);

    return successResponse(res, 200, 'Transaction PIN set successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change transaction PIN
 * @route   POST /api/pin/change
 * @access  Private
 */
const changeTransactionPin = async (req, res, next) => {
  try {
    const { currentPin, newPin, confirmNewPin } = req.body;

    // Validate new PIN format
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return errorResponse(res, 400, 'New PIN must be exactly 4 digits');
    }

    // Check if new PINs match
    if (newPin !== confirmNewPin) {
      return errorResponse(res, 400, 'New PINs do not match');
    }

    // Get user with PIN
    const user = await User.findById(req.user._id).select('+transactionPin');

    // Check if PIN is set
    if (!user.hasPinSet) {
      return errorResponse(res, 400, 'No transaction PIN set. Use set PIN endpoint.');
    }

    // Verify current PIN
    const isPinValid = await user.compareTransactionPin(currentPin);

    if (!isPinValid) {
      return errorResponse(res, 401, 'Current PIN is incorrect');
    }

    // Update PIN
    user.transactionPin = newPin;
    await user.save();

    logger.success(`Transaction PIN changed for user: ${user.email}`);

    return successResponse(res, 200, 'Transaction PIN changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if user has PIN set
 * @route   GET /api/pin/status
 * @access  Private
 */
const getPinStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return successResponse(res, 200, 'PIN status retrieved', {
      hasPinSet: user.hasPinSet,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setTransactionPin,
  changeTransactionPin,
  getPinStatus,
};

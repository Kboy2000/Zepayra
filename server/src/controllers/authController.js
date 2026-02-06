const User = require('../models/User');
const walletService = require('../services/walletService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { cookieOptions } = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    // Create wallet for user
    await walletService.createWallet(user._id);

    // Generate token
    const token = user.generateToken();

    // Remove password from response
    user.password = undefined;

    logger.success(`User registered: ${email}`);

    return successResponse(res, 201, 'Registration successful', {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 401, 'Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = user.generateToken();

    // Remove password from response
    user.password = undefined;

    logger.success(`User logged in: ${email}`);

    return successResponse(res, 200, 'Login successful', {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return successResponse(res, 200, 'User retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);

    return successResponse(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};

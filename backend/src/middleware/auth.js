const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');
const { JWT_SECRET } = require('../config/jwt');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return errorResponse(res, 401, 'Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return errorResponse(res, 401, 'User not found');
      }

      if (!req.user.isActive) {
        return errorResponse(res, 401, 'Account has been deactivated');
      }

      next();
    } catch (error) {
      return errorResponse(res, 401, 'Invalid or expired token');
    }
  } catch (error) {
    return errorResponse(res, 500, 'Server error during authentication');
  }
};

module.exports = { protect };

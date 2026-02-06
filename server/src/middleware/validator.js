const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return errorResponse(res, 400, 'Validation failed', errorMessages);
  }
  next();
};

// Registration validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(0|\+234)[7-9][0-1]\d{8}$/)
    .withMessage('Please provide a valid Nigerian phone number'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Airtime purchase validation
const airtimePurchaseValidation = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(0|\+234)[7-9][0-1]\d{8}$/)
    .withMessage('Please provide a valid Nigerian phone number'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value >= 50)
    .withMessage('Minimum amount is ₦50')
    .custom((value) => value <= 1000000)
    .withMessage('Maximum amount is ₦1,000,000'),
];

// Data purchase validation
const dataPurchaseValidation = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(0|\+234)[7-9][0-1]\d{8}$/)
    .withMessage('Please provide a valid Nigerian phone number'),
  
  body('serviceID')
    .trim()
    .notEmpty()
    .withMessage('Service ID is required'),
  
  body('variationCode')
    .trim()
    .notEmpty()
    .withMessage('Data plan is required'),
];

// Electricity purchase validation
const electricityPurchaseValidation = [
  body('meterNumber')
    .trim()
    .notEmpty()
    .withMessage('Meter number is required')
    .isLength({ min: 10, max: 13 })
    .withMessage('Invalid meter number'),
  
  body('serviceID')
    .trim()
    .notEmpty()
    .withMessage('Service provider is required'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value >= 1000)
    .withMessage('Minimum amount is ₦1,000')
    .custom((value) => value <= 1000000)
    .withMessage('Maximum amount is ₦1,000,000'),
  
  body('meterType')
    .trim()
    .notEmpty()
    .withMessage('Meter type is required')
    .isIn(['prepaid', 'postpaid'])
    .withMessage('Invalid meter type'),
];

// Cable TV purchase validation
const cableTVPurchaseValidation = [
  body('smartCardNumber')
    .trim()
    .notEmpty()
    .withMessage('Smart card number is required')
    .isLength({ min: 10 })
    .withMessage('Invalid smart card number'),
  
  body('serviceID')
    .trim()
    .notEmpty()
    .withMessage('Service provider is required'),
  
  body('variationCode')
    .trim()
    .notEmpty()
    .withMessage('Subscription plan is required'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  airtimePurchaseValidation,
  dataPurchaseValidation,
  electricityPurchaseValidation,
  cableTVPurchaseValidation,
};

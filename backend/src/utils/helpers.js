const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique transaction reference
 */
const generateReference = (prefix = 'ZPY') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate unique VTpass request ID
 */
const generateRequestId = () => {
  return uuidv4();
};

/**
 * Format Nigerian phone number
 * Converts various formats to 080XXXXXXXX
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Handle +234 format
  if (cleaned.startsWith('234')) {
    cleaned = '0' + cleaned.substring(3);
  }

  // Ensure it starts with 0
  if (!cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }

  return cleaned;
};

/**
 * Format amount to Naira
 */
const formatNaira = (amount) => {
  return `₦${parseFloat(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Validate Nigerian phone number
 */
const isValidNigerianPhone = (phone) => {
  const phoneRegex = /^(0|\+234)[7-9][0-1]\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Get network provider from phone number
 */
const getNetworkProvider = (phone) => {
  const formatted = formatPhoneNumber(phone);
  const prefix = formatted.substring(0, 4);

  const networks = {
    MTN: ['0803', '0806', '0810', '0813', '0814', '0816', '0903', '0906', '0913', '0916'],
    AIRTEL: ['0802', '0808', '0812', '0901', '0902', '0904', '0907', '0912'],
    GLO: ['0805', '0807', '0811', '0815', '0905', '0915'],
    '9MOBILE': ['0809', '0817', '0818', '0908', '0909'],
  };

  for (const [network, prefixes] of Object.entries(networks)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }

  return null;
};

/**
 * Sleep/delay function
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  generateReference,
  generateRequestId,
  formatPhoneNumber,
  formatNaira,
  isValidNigerianPhone,
  getNetworkProvider,
  sleep,
};

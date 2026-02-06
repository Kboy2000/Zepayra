/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate Nigerian phone number
 */
export const isValidNigerianPhone = (phone) => {
  const phoneRegex = /^(0|\+234)[7-9][0-1]\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate amount
 */
export const isValidAmount = (amount, min = 0, max = Infinity) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= min && num <= max;
};

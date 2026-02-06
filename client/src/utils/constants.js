// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Network Providers
export const NETWORK_PROVIDERS = {
  MTN: 'mtn',
  AIRTEL: 'airtel',
  GLO: 'glo',
  '9MOBILE': 'etisalat',
};

// Transaction Categories
export const TRANSACTION_CATEGORIES = {
  AIRTIME: 'airtime',
  DATA: 'data',
  ELECTRICITY: 'electricity',
  TV: 'tv',
  EDUCATION: 'education',
  FUNDING: 'funding',
  REFUND: 'refund',
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
};

// Service Categories
export const SERVICE_CATEGORIES = {
  AIRTIME: 'airtime',
  DATA: 'data',
  ELECTRICITY: 'electricity',
  TV: 'tv',
  EDUCATION: 'education',
};

// Meter Types
export const METER_TYPES = {
  PREPAID: 'prepaid',
  POSTPAID: 'postpaid',
};

// Amount Limits
export const AMOUNT_LIMITS = {
  AIRTIME: {
    MIN: 50,
    MAX: 1000000,
  },
  DATA: {
    MIN: 50,
    MAX: 1000000,
  },
  ELECTRICITY: {
    MIN: 1000,
    MAX: 1000000,
  },
  TV: {
    MIN: 500,
    MAX: 1000000,
  },
};

// Status Colors
export const STATUS_COLORS = {
  pending: 'var(--color-warning)',
  success: 'var(--color-success)',
  failed: 'var(--color-error)',
};

// Category Icons (using emoji for now, can be replaced with actual icons)
export const CATEGORY_ICONS = {
  airtime: '📞',
  data: '📡',
  electricity: '⚡',
  tv: '📺',
  education: '📚',
  funding: '💰',
  refund: '↩️',
};

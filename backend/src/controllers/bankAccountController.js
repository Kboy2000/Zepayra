const BankAccount = require('../models/BankAccount');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Nigerian banks list
const NIGERIAN_BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank', code: '023' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank for Africa', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' }
];

// Get list of banks
exports.getBanks = async (req, res) => {
  try {
    return successResponse(res, NIGERIAN_BANKS, 'Banks retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Add bank account
exports.addBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accountNumber, bankCode } = req.body;
    
    if (!accountNumber || !bankCode) {
      return errorResponse(res, 'Account number and bank code are required', 400);
    }
    
    // Find bank name
    const bank = NIGERIAN_BANKS.find(b => b.code === bankCode);
    if (!bank) {
      return errorResponse(res, 'Invalid bank code', 400);
    }
    
    // Check if account already exists
    const existing = await BankAccount.findOne({ userId, accountNumber, bankCode });
    if (existing) {
      return errorResponse(res, 'Bank account already added', 400);
    }
    
    // TODO: Verify account with Paystack/Flutterwave
    // For now, we'll use a placeholder account name
    const accountName = req.body.accountName || 'Account Holder';
    
    const bankAccount = await BankAccount.create({
      userId,
      accountNumber,
      accountName,
      bankName: bank.name,
      bankCode,
      isVerified: true // Set to false when implementing actual verification
    });
    
    return successResponse(res, bankAccount, 'Bank account added successfully', 201);
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get all bank accounts
exports.getBankAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await BankAccount.getAllAccounts(userId);
    
    return successResponse(res, accounts, 'Bank accounts retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get single bank account
exports.getBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const account = await BankAccount.findOne({ _id: id, userId });
    
    if (!account) {
      return errorResponse(res, 'Bank account not found', 404);
    }
    
    return successResponse(res, account, 'Bank account retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Set as default
exports.setAsDefault = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const account = await BankAccount.findOne({ _id: id, userId });
    
    if (!account) {
      return errorResponse(res, 'Bank account not found', 404);
    }
    
    await account.setAsDefault();
    
    return successResponse(res, account, 'Default account updated successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete bank account
exports.deleteBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const account = await BankAccount.findOne({ _id: id, userId });
    
    if (!account) {
      return errorResponse(res, 'Bank account not found', 404);
    }
    
    // If deleting default account, set another as default
    if (account.isDefault) {
      const otherAccount = await BankAccount.findOne({ 
        userId, 
        _id: { $ne: id } 
      });
      
      if (otherAccount) {
        await otherAccount.setAsDefault();
      }
    }
    
    await account.deleteOne();
    
    return successResponse(res, null, 'Bank account deleted successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = exports;

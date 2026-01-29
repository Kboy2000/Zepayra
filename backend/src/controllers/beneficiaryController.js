const Beneficiary = require('../models/Beneficiary');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create beneficiary
exports.createBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, serviceType, group, phone, meterNumber, smartCardNumber } = req.body;
    
    // Check for duplicate
    const query = { userId, serviceType };
    if (phone) query.phone = phone;
    if (meterNumber) query.meterNumber = meterNumber;
    if (smartCardNumber) query.smartCardNumber = smartCardNumber;
    
    const existing = await Beneficiary.findOne(query);
    if (existing) {
      return errorResponse(res, 'Beneficiary already exists', 400);
    }
    
    const beneficiary = await Beneficiary.create({
      userId,
      name,
      serviceType,
      group,
      phone,
      meterNumber,
      smartCardNumber
    });
    
    return successResponse(res, beneficiary, 'Beneficiary created successfully', 201);
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get all beneficiaries
exports.getBeneficiaries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceType, group, isFavorite, search } = req.query;
    
    const query = { userId };
    if (serviceType) query.serviceType = serviceType;
    if (group) query.group = group;
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { meterNumber: { $regex: search, $options: 'i' } },
        { smartCardNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const beneficiaries = await Beneficiary.find(query).sort({ lastUsed: -1, createdAt: -1 });
    
    return successResponse(res, beneficiaries, 'Beneficiaries retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get single beneficiary
exports.getBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const beneficiary = await Beneficiary.findOne({ _id: id, userId });
    
    if (!beneficiary) {
      return errorResponse(res, 'Beneficiary not found', 404);
    }
    
    return successResponse(res, beneficiary, 'Beneficiary retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Update beneficiary
exports.updateBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, group } = req.body;
    
    const beneficiary = await Beneficiary.findOne({ _id: id, userId });
    
    if (!beneficiary) {
      return errorResponse(res, 'Beneficiary not found', 404);
    }
    
    if (name) beneficiary.name = name;
    if (group) beneficiary.group = group;
    
    await beneficiary.save();
    
    return successResponse(res, beneficiary, 'Beneficiary updated successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Delete beneficiary
exports.deleteBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const beneficiary = await Beneficiary.findOneAndDelete({ _id: id, userId });
    
    if (!beneficiary) {
      return errorResponse(res, 'Beneficiary not found', 404);
    }
    
    return successResponse(res, null, 'Beneficiary deleted successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const beneficiary = await Beneficiary.findOne({ _id: id, userId });
    
    if (!beneficiary) {
      return errorResponse(res, 'Beneficiary not found', 404);
    }
    
    await beneficiary.toggleFavorite();
    
    return successResponse(res, beneficiary, 'Favorite status updated successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Increment transaction count (called after successful transaction)
exports.incrementUsage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const beneficiary = await Beneficiary.findOne({ _id: id, userId });
    
    if (!beneficiary) {
      return errorResponse(res, 'Beneficiary not found', 404);
    }
    
    await beneficiary.incrementTransactionCount();
    
    return successResponse(res, beneficiary, 'Usage updated successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = exports;

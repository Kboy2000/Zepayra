const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    enum: ['airtime', 'data', 'electricity', 'tv'],
    required: true,
    index: true
  },
  group: {
    type: String,
    enum: ['family', 'friends', 'work'],
    default: 'friends'
  },
  // Service-specific fields
  phone: {
    type: String,
    trim: true,
    default: null
  },
  meterNumber: {
    type: String,
    trim: true,
    default: null
  },
  smartCardNumber: {
    type: String,
    trim: true,
    default: null
  },
  isFavorite: {
    type: Boolean,
    default: false,
    index: true
  },
  transactionCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes
beneficiarySchema.index({ userId: 1, serviceType: 1 });
beneficiarySchema.index({ userId: 1, isFavorite: 1 });
beneficiarySchema.index({ userId: 1, group: 1 });

// Validation
beneficiarySchema.pre('save', function(next) {
  // Ensure service-specific fields are set
  if (this.serviceType === 'airtime' || this.serviceType === 'data') {
    if (!this.phone) {
      return next(new Error('Phone number is required for airtime/data'));
    }
  } else if (this.serviceType === 'electricity') {
    if (!this.meterNumber) {
      return next(new Error('Meter number is required for electricity'));
    }
  } else if (this.serviceType === 'tv') {
    if (!this.smartCardNumber) {
      return next(new Error('Smart card number is required for TV'));
    }
  }
  next();
});

// Methods
beneficiarySchema.methods.incrementTransactionCount = async function() {
  this.transactionCount += 1;
  this.lastUsed = new Date();
  return await this.save();
};

beneficiarySchema.methods.updateLastUsed = async function() {
  this.lastUsed = new Date();
  return await this.save();
};

beneficiarySchema.methods.toggleFavorite = async function() {
  this.isFavorite = !this.isFavorite;
  return await this.save();
};

// Statics
beneficiarySchema.statics.findByService = function(userId, serviceType) {
  return this.find({ userId, serviceType }).sort({ lastUsed: -1 });
};

beneficiarySchema.statics.findFavorites = function(userId) {
  return this.find({ userId, isFavorite: true }).sort({ lastUsed: -1 });
};

beneficiarySchema.statics.findByGroup = function(userId, group) {
  return this.find({ userId, group }).sort({ name: 1 });
};

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;

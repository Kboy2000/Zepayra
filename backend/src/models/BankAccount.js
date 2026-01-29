const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Nigerian account numbers are 10 digits
      },
      message: 'Account number must be 10 digits'
    }
  },
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  bankCode: {
    type: String,
    required: true,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes
bankAccountSchema.index({ userId: 1, isDefault: 1 });
bankAccountSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

// Methods
bankAccountSchema.methods.setAsDefault = async function() {
  // Unset all other accounts as default
  await this.constructor.updateMany(
    { userId: this.userId, _id: { $ne: this._id } },
    { $set: { isDefault: false } }
  );
  
  this.isDefault = true;
  return await this.save();
};

bankAccountSchema.methods.verify = async function() {
  this.isVerified = true;
  return await this.save();
};

// Statics
bankAccountSchema.statics.getDefault = function(userId) {
  return this.findOne({ userId, isDefault: true });
};

bankAccountSchema.statics.getAllAccounts = function(userId) {
  return this.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
};

// Pre-save hook to ensure only one default account
bankAccountSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  
  // If this is the first account, make it default
  const accountCount = await this.constructor.countDocuments({ userId: this.userId });
  if (accountCount === 0) {
    this.isDefault = true;
  }
  
  next();
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;

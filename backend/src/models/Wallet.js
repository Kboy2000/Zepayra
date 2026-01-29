const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      default: 'NGN',
      enum: ['NGN'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastTransaction: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to credit wallet
walletSchema.methods.credit = async function (amount, session = null) {
  this.balance += amount;
  this.lastTransaction = new Date();
  return await this.save({ session });
};

// Method to debit wallet
walletSchema.methods.debit = async function (amount, session = null) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  this.lastTransaction = new Date();
  return await this.save({ session });
};

// Method to check if wallet has sufficient balance
walletSchema.methods.hasSufficientBalance = function (amount) {
  return this.balance >= amount;
};

// Index for performance
walletSchema.index({ userId: 1 });

module.exports = mongoose.model('Wallet', walletSchema);

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    category: {
      type: String,
      enum: ['airtime', 'data', 'electricity', 'tv', 'education', 'funding', 'refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be positive'],
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    requestId: {
      type: String,
      unique: true,
      sparse: true, // Allow null for non-VTpass transactions
    },
    serviceProvider: {
      type: String,
      trim: true,
    },
    recipientDetails: {
      phone: String,
      meterNumber: String,
      smartCardNumber: String,
      customerName: String,
      address: String,
    },
    vtpassResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    description: {
      type: String,
      trim: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ requestId: 1 });
transactionSchema.index({ status: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function () {
  return `₦${this.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
});

module.exports = mongoose.model('Transaction', transactionSchema);

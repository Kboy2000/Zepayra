const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'expired'],
    default: 'pending',
    index: true
  },
  reward: {
    type: Number,
    default: 500 // Base reward in Naira
  },
  rewardPaid: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ referrerId: 1, createdAt: -1 });

// Methods
referralSchema.methods.calculateReward = function(referralCount) {
  // Base reward
  let reward = 500;
  
  // Bonus tiers
  if (referralCount >= 100) {
    reward += 35000;
  } else if (referralCount >= 50) {
    reward += 15000;
  } else if (referralCount >= 10) {
    reward += 2500;
  } else if (referralCount >= 5) {
    reward += 1000;
  }
  
  return reward;
};

referralSchema.methods.markAsSuccessful = async function() {
  this.status = 'successful';
  this.completedAt = new Date();
  return await this.save();
};

referralSchema.methods.payReward = async function() {
  if (this.rewardPaid) {
    throw new Error('Reward already paid');
  }
  
  if (this.status !== 'successful') {
    throw new Error('Referral must be successful to pay reward');
  }
  
  this.rewardPaid = true;
  return await this.save();
};

// Statics
referralSchema.statics.generateCode = function(userId) {
  // Generate unique 8-character code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'ZEP';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

referralSchema.statics.getStats = async function(userId) {
  const totalReferrals = await this.countDocuments({ referrerId: userId });
  const successfulReferrals = await this.countDocuments({ 
    referrerId: userId, 
    status: 'successful' 
  });
  const pendingReferrals = await this.countDocuments({ 
    referrerId: userId, 
    status: 'pending' 
  });
  
  const earnings = await this.aggregate([
    { $match: { referrerId: mongoose.Types.ObjectId(userId), status: 'successful' } },
    { $group: { _id: null, total: { $sum: '$reward' } } }
  ]);
  
  const totalEarnings = earnings.length > 0 ? earnings[0].total : 0;
  
  const paidEarnings = await this.aggregate([
    { $match: { referrerId: mongoose.Types.ObjectId(userId), rewardPaid: true } },
    { $group: { _id: null, total: { $sum: '$reward' } } }
  ]);
  
  const withdrawnAmount = paidEarnings.length > 0 ? paidEarnings[0].total : 0;
  const availableBalance = totalEarnings - withdrawnAmount;
  
  return {
    totalReferrals,
    successfulReferrals,
    pendingReferrals,
    totalEarnings,
    availableBalance,
    withdrawnAmount
  };
};

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;

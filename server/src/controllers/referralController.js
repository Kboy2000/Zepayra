const Referral = require('../models/Referral');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get or generate referral code
exports.getReferralCode = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user already has a referral code
    let referral = await Referral.findOne({ referrerId: userId });
    
    if (!referral) {
      // Generate new referral code
      let code;
      let isUnique = false;
      
      while (!isUnique) {
        code = Referral.generateCode(userId);
        const existing = await Referral.findOne({ referralCode: code });
        if (!existing) isUnique = true;
      }
      
      referral = await Referral.create({
        referrerId: userId,
        referralCode: code
      });
    }
    
    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${referral.referralCode}`;
    
    return successResponse(res, {
      code: referral.referralCode,
      link: referralLink
    }, 'Referral code retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get referral statistics
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Referral.getStats(userId);
    
    return successResponse(res, stats, 'Referral statistics retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get referral history
exports.getReferrals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { referrerId: userId };
    if (status) query.status = status;
    
    const referrals = await Referral.find(query)
      .populate('referredUserId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Referral.countDocuments(query);
    
    return successResponse(res, {
      referrals,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    }, 'Referrals retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Referral.aggregate([
      { $match: { status: 'successful' } },
      {
        $group: {
          _id: '$referrerId',
          referralCount: { $sum: 1 },
          totalEarnings: { $sum: '$reward' }
        }
      },
      { $sort: { referralCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: {
            $concat: [
              { $substr: ['$user.name', 0, 1] },
              { $toUpper: { $substr: ['$user.name', 1, 1] } },
              '***'
            ]
          },
          referrals: '$referralCount',
          earnings: '$totalEarnings'
        }
      }
    ]);
    
    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      referrals: entry.referrals,
      earnings: entry.earnings
    }));
    
    return successResponse(res, formattedLeaderboard, 'Leaderboard retrieved successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Withdraw referral earnings
exports.withdrawEarnings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get available balance
    const stats = await Referral.getStats(userId);
    
    if (stats.availableBalance <= 0) {
      return errorResponse(res, 'No available balance to withdraw', 400);
    }
    
    // Get unpaid referrals
    const unpaidReferrals = await Referral.find({
      referrerId: userId,
      status: 'successful',
      rewardPaid: false
    });
    
    if (unpaidReferrals.length === 0) {
      return errorResponse(res, 'No unpaid referrals found', 400);
    }
    
    // Credit wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return errorResponse(res, 'Wallet not found', 404);
    }
    
    await wallet.credit(stats.availableBalance, 'Referral earnings withdrawal');
    
    // Mark referrals as paid
    await Promise.all(unpaidReferrals.map(ref => ref.payReward()));
    
    return successResponse(res, {
      amount: stats.availableBalance,
      newBalance: wallet.balance
    }, 'Earnings withdrawn successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Track new referral (called during registration)
exports.trackReferral = async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;
    
    if (!referralCode || !newUserId) {
      return errorResponse(res, 'Referral code and new user ID are required', 400);
    }
    
    // Find referral by code
    const referral = await Referral.findOne({ referralCode, status: 'pending' });
    
    if (!referral) {
      return errorResponse(res, 'Invalid or expired referral code', 400);
    }
    
    // Update referral
    referral.referredUserId = newUserId;
    await referral.markAsSuccessful();
    
    // Credit referrer's wallet immediately
    const wallet = await Wallet.findOne({ userId: referral.referrerId });
    if (wallet) {
      await wallet.credit(referral.reward, `Referral reward for ${referralCode}`);
    }
    
    return successResponse(res, referral, 'Referral tracked successfully');
    
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = exports;

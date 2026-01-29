const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const referralController = require('../controllers/referralController');

// All routes are protected
router.use(protect);

// GET /api/referrals/code - Get or generate referral code
router.get('/code', referralController.getReferralCode);

// GET /api/referrals/stats - Get referral statistics
router.get('/stats', referralController.getStats);

// GET /api/referrals/leaderboard - Get top referrers
router.get('/leaderboard', referralController.getLeaderboard);

// GET /api/referrals - Get referral history
router.get('/', referralController.getReferrals);

// POST /api/referrals/withdraw - Withdraw earnings
router.post('/withdraw', referralController.withdrawEarnings);

// POST /api/referrals/track - Track new referral (internal)
router.post('/track', referralController.trackReferral);

module.exports = router;

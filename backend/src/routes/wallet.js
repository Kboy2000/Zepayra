const express = require('express');
const router = express.Router();
const {
  getBalance,
  creditWallet,
  getTransactionHistory,
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

// All wallet routes are protected
router.use(protect);

router.get('/balance', getBalance);
router.post('/credit', creditWallet);
router.get('/history', getTransactionHistory);

module.exports = router;

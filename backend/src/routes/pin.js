const express = require('express');
const router = express.Router();
const {
  setTransactionPin,
  changeTransactionPin,
  getPinStatus,
} = require('../controllers/pinController');
const { protect } = require('../middleware/auth');

// All PIN routes are protected
router.use(protect);

router.post('/set', setTransactionPin);
router.post('/change', changeTransactionPin);
router.get('/status', getPinStatus);

module.exports = router;

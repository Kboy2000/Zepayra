const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  requeryTransaction,
  getTransactionStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// All transaction routes are protected
router.use(protect);

router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.get('/:id', getTransactionById);
router.post('/:id/requery', requeryTransaction);

module.exports = router;

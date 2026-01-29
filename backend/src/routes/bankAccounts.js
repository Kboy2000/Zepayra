const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const bankAccountController = require('../controllers/bankAccountController');

// All routes are protected
router.use(protect);

// GET /api/bank-accounts/banks - Get list of banks
router.get('/banks', bankAccountController.getBanks);

// POST /api/bank-accounts - Add bank account
router.post('/', bankAccountController.addBankAccount);

// GET /api/bank-accounts - Get all bank accounts
router.get('/', bankAccountController.getBankAccounts);

// GET /api/bank-accounts/:id - Get single account
router.get('/:id', bankAccountController.getBankAccount);

// PUT /api/bank-accounts/:id/default - Set as default
router.put('/:id/default', bankAccountController.setAsDefault);

// DELETE /api/bank-accounts/:id - Delete account
router.delete('/:id', bankAccountController.deleteBankAccount);

module.exports = router;

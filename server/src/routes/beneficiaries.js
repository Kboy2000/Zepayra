const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const beneficiaryController = require('../controllers/beneficiaryController');

// All routes are protected
router.use(protect);

// POST /api/beneficiaries - Create beneficiary
router.post('/', beneficiaryController.createBeneficiary);

// GET /api/beneficiaries - Get all beneficiaries
router.get('/', beneficiaryController.getBeneficiaries);

// GET /api/beneficiaries/:id - Get single beneficiary
router.get('/:id', beneficiaryController.getBeneficiary);

// PUT /api/beneficiaries/:id - Update beneficiary
router.put('/:id', beneficiaryController.updateBeneficiary);

// DELETE /api/beneficiaries/:id - Delete beneficiary
router.delete('/:id', beneficiaryController.deleteBeneficiary);

// PUT /api/beneficiaries/:id/favorite - Toggle favorite
router.put('/:id/favorite', beneficiaryController.toggleFavorite);

// PUT /api/beneficiaries/:id/usage - Increment usage
router.put('/:id/usage', beneficiaryController.incrementUsage);

module.exports = router;

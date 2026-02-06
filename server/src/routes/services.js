const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceVariations,
  purchaseAirtime,
  purchaseData,
  payElectricity,
  subscribeCableTV,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const {
  airtimePurchaseValidation,
  dataPurchaseValidation,
  electricityPurchaseValidation,
  cableTVPurchaseValidation,
  validate,
} = require('../middleware/validator');

// All service routes are protected
router.use(protect);

router.get('/', getServices);
router.get('/:serviceId/variations', getServiceVariations);

// Purchase routes with validation
router.post('/airtime', airtimePurchaseValidation, validate, purchaseAirtime);
router.post('/data', dataPurchaseValidation, validate, purchaseData);
router.post('/electricity', electricityPurchaseValidation, validate, payElectricity);
router.post('/tv', cableTVPurchaseValidation, validate, subscribeCableTV);

module.exports = router;

const express = require('express');
const router = express.Router();
const combinationController = require('../controllers/combinationController');
const { generateCombinationSchema, validate, validateLengthVsItems } = require('../utils/validation');

/**
 * POST /generate
 * Generate valid combinations
 * Body example: { items: [1, 2, 1], length: 2 }
 */
router.post(
    '/generate',
    validate(generateCombinationSchema),
    validateLengthVsItems,
    combinationController.generateCombinations
);

module.exports = router;


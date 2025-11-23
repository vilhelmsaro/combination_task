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

/**
 * POST /v2/generate
 * Generate valid combinations using loop-based algorithm (v2)
 * Body example: { items: [1, 2, 1], length: 2 }
 */
router.post(
    '/v2/generate',
    validate(generateCombinationSchema),
    validateLengthVsItems,
    combinationController.generateCombinationsV2
);

module.exports = router;


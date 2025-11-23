const combinationService = require('../services/combinationService');

/**
 * Generate valid combinations from items and store in the database
 * POST /generate
 */
const generateCombinations = async (req, res, next) => {
    try {
        const { items, length } = req.body;

        const result = await combinationService.generateAndStoreCombinations(items, length);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Generate valid combinations from items and store in the database (v2 - using loop-based algorithm)
 * POST /v2/generate
 */
const generateCombinationsV2 = async (req, res, next) => {
    try {
        const { items, length } = req.body;

        const result = await combinationService.generateAndStoreCombinationsV2(items, length);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateCombinations,
    generateCombinationsV2
};


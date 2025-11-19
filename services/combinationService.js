const { getConnection } = require('../config/database');
const {
    insertItemsBatch,
    insertCombination,
    insertResponse
} = require('../database/queries');
const { buildPrefixArr } = require('../utils/itemHelpers');

/**
 * Generate all valid combinations
 * @param {number[]} arr - Array input
 * @param {number} n - Combination length
 * @returns {{validPairs: string[][], prefixArr: string[]}} - Object containing valid pairs and the prefix array
 */
function generateEveryValidPair(arr, n) {
    const prefixArr = buildPrefixArr(arr);
    const validPairs = [];
    const totalItems = prefixArr.length;

    if (n <= 0 || n > totalItems) {
        return { validPairs, prefixArr };
    }

    function generatePairs(startIndex, currentPair, existingPrefixes) {
        const currentLength = currentPair.length;

        if (currentLength === n) {
            validPairs.push([...currentPair]);
            return;
        }

        const remainingSlots = n - currentLength;
        const remainingItems = totalItems - startIndex;
        if (remainingItems < remainingSlots) return;

        for (let i = startIndex; i < totalItems; i++) {
            const element = prefixArr[i];
            const prefix = element[0];

            if (existingPrefixes[prefix]) {
                continue;
            }

            currentPair.push(element);
            existingPrefixes[prefix] = true;

            generatePairs(i + 1, currentPair, existingPrefixes);

            currentPair.pop();
            delete existingPrefixes[prefix];
        }
    }

    generatePairs(0, [], {});

    return { validPairs, prefixArr };
}

/**
 * Generate combinations and store in the database
 * @param {number[]} items - Array input
 * @param {number} length - Combination length
 * @returns {Promise<{id: number, combination: string[][]}>} - Response with sql ID and combinations
 */
async function generateAndStoreCombinations(items, length) {
    const { validPairs, prefixArr } = generateEveryValidPair(items, length);

    const connection = await getConnection();

    try {
        await connection.beginTransaction();

        await insertItemsBatch(prefixArr, connection);

        const combinationId = await insertCombination(validPairs, connection);

        const responseData = {
            id: combinationId,
            combination: validPairs
        };

        await insertResponse(
            combinationId,
            responseData,
            connection
        );

        await connection.commit();
        return responseData;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    generateAndStoreCombinations
};

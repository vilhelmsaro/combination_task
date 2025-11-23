const { getConnection } = require('../config/database');
const {
    insertItemsBatch,
    insertCombination,
    insertResponse
} = require('../database/queries');
const { buildPrefixArr } = require('../utils/itemHelpers');

/**
 * Find the next combination index
 * @param {number[]} idx - Current index array
 * @param {number} N - Total number of items
 * @param {number} k - Combination length
 * @returns {boolean} - Returns true if next combination exists, false otherwise
 */
function nextCombination(idx, N, k) {
    // logic of finding the next index to increment (to max allowed index !)
    // N - k + pos -> is the max value of the pos that is valid !
    // i.e. N = 5, k =3, pos = 0, pos[0]MAX = 5 - 3 - 0 = 2, so pos[0] can be <0 || 1 || 2>

    let pos;

    for (pos = k - 1; pos >= 0; pos--) {
        const maxForThisPos = N - k + pos;

        if (idx[pos] < maxForThisPos) {
            break;
        }
    }

    if (pos < 0) {
        return false;
    }

    idx[pos]++;

    for (let i = pos + 1; i < k; i++) {
        idx[i] = idx[i - 1] + 1;
    }

    return true;
}

/**
 * Check if all items in a combination have distinct prefixes
 * @param {string[]} comb - Combination array
 * @returns {boolean} - Returns true if all prefixes are distinct
 */
function hasAllDistinctPrefixes(comb) {
    const seen = new Set();

    for (const item of comb) {
        const prefix = item[0];

        if (seen.has(prefix)) {
            return false;
        }
        seen.add(prefix);
    }

    return true;
}

/**
 * Generate all valid combinations using loop-based algorithm
 * @param {number[]} arr - Array input
 * @param {number} k - Combination length
 * @returns {{result: *[], items: string[]}} - Array of valid combinations
 */
function generateCombinationsForLoop(arr, k) {
    const items = buildPrefixArr(arr);
    const N = items.length;

    if (k > N) {
        return {result: [], items};
    }

    const result = [];

    const idx = Array.from({ length: k }, (_, i) => i);

    for (let more = true; more; more = nextCombination(idx, N, k)) {
        const comb = idx.map(i => items[i]);

        if (hasAllDistinctPrefixes(comb)) {
            result.push(comb);
        }
    }

    return {result, items};
}

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


/**
 * Generate combinations and store in the database using loop-based algorithm (v2)
 * @param {number[]} items - Array input
 * @param {number} length - Combination length
 * @returns {Promise<{id: number, combination: string[][]}>} - Response with sql ID and combinations
 */
async function generateAndStoreCombinationsV2(items, length) {
    const {result: validPairs, items: prefixArr} = generateCombinationsForLoop(items, length);

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
    generateAndStoreCombinations,
    generateAndStoreCombinationsV2
};
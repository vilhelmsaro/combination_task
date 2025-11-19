/**
 * Item helper functions and constants
 * Utilities for generating item codes from input arrays
 */

/**
 * Array of uppercase letters A-Z
 * Used to generate item codes like A1, B1, B2, C1, etc.
 */
const LETTERS_UPPER = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

/**
 * Build the prefixed array from the counts
 * Converts an array of counts into item codes
 * 
 * @param {number[]} arr - Array of counts for each letter prefix
 * @returns {string[]} - Array of prefixed items (e.g., ['A1', 'B1', 'B2', 'C1'])
 *
 * @example
 * buildPrefixArr([1, 2, 1])
 * // Returns: ['A1', 'B1', 'B2', 'C1']
 */
function buildPrefixArr(arr) {
    const prefixArr = [];

    arr.forEach((count, index) => {
        for (let j = 0; j < count; j++) {
            prefixArr.push(`${LETTERS_UPPER[index]}${j + 1}`);
        }
    });

    return prefixArr;
}

module.exports = {
    buildPrefixArr
};


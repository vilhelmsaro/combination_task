/**
 * Database query functions
 * All queries use parameterized statements to prevent SQL injection
 */

/**
 * Insert items from prefixArr (e.g., ['A1', 'B1', 'B2', 'C1'])
 * Parses each item code to extract prefix and number
 * Uses batch INSERT IGNORE for efficiency
 * @param {string[]} prefixArr - Array of item codes from generateEveryValidPair()
 * @param {Object} connection - MySQL connection (for transaction)
 * @returns {Promise<void>}
 */
async function insertItemsBatch(prefixArr, connection) {
    if (prefixArr.length === 0) return;

    const values = prefixArr.map(itemCode => {
        const prefix = itemCode[0]; // First character: 'A'
        const number = parseInt(itemCode.slice(1)); // Rest: '1' -> 1
        return [itemCode, prefix, number];
    });

    await connection.query(
        `INSERT IGNORE INTO items (item_code, prefix_letter, item_number) 
         VALUES ?`,
        [values]
    );
}

/**
 * Insert combination with JSON data
 * @param {Array} combinationsJson - Array of combinations: [["A1","B1"], ["A1","B2"], ...]
 * @param {Object} connection - MySQL connection (for transaction)
 * @returns {Promise<number>} - Returns the inserted combination_id
 */
async function insertCombination(combinationsJson, connection) {
    const [result] = await connection.query(
        `INSERT INTO combinations (combinations_json) 
         VALUES (?)`,
        [JSON.stringify(combinationsJson)]
    );

    return result.insertId;
}

/**
 * Insert response data
 * @param {number} combinationId - The combination ID
 * @param {Object} responseData - Full response JSON: {"id": 1, "combination": [...]}
 * @param {Object} connection - MySQL connection (for transaction)
 * @returns {Promise<number>} - Returns the inserted response_id
 */
async function insertResponse(combinationId, responseData, connection) {
    const [result] = await connection.query(
        `INSERT INTO responses (combination_id, response_data) 
         VALUES (?, ?)`,
        [
            combinationId,
            JSON.stringify(responseData)
        ]
    );

    return result.insertId;
}

module.exports = {
    insertItemsBatch,
    insertCombination,
    insertResponse,
};


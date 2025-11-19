const mysql = require('mysql2/promise');

/**
 * MySQL Connection Pool Configuration
 * Uses mysql2/promise
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'combinations_db',
    waitForConnections: true,
    connectionLimit: 10,
});

/**
 * Get a connection from the pool
 * @returns {Promise<mysql.PoolConnection>}
 */
async function getConnection() {
    return await pool.getConnection();
}

/**
 * Test database connection
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    pool,
    getConnection,
    testConnection
};


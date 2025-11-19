/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.isJoi) {
        statusCode = 400;
        message = 'Validation error';
    }

    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        statusCode
    });

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};


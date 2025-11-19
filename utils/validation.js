const Joi = require('joi');

/**
 * Validation schema for POST /generate request
 */
const generateCombinationSchema = Joi.object({
    items: Joi.array()
        .items(Joi.number().integer().min(1).max(100))//note: just to prevent abuse, may be removed !
        .min(1)
        .max(26)
        .required()
        .messages({
            'array.base': 'Items must be an array',
            'array.min': 'Items array must contain at least one element',
            'array.max': 'Items array cannot exceed 26 elements',
            'any.required': 'Items is required'
        }),
    length: Joi.number()
        .integer()
        .min(1)
        .max(26)
        .required()
        .messages({
            'number.base': 'Length must be a number',
            'number.integer': 'Length must be an integer',
            'number.min': 'Length must be at least 1',
            'number.max': 'Length cannot exceed 26',
            'any.required': 'Length is required'
        })
});

/**
 * Validate request body against the given schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        req.body = value;
        next();
    };
};

/**
 * Validate if requested length exceeds total number of items
 * @returns {Function} - Express middleware function
 */
const validateLengthVsItems = (req, res, next) => {
    const { items, length } = req.body;
    const totalItems = items.reduce((sum, count) => sum + count, 0);

    if (length > totalItems) {
        return res.status(400).json({
            success: false,
            message: 'Invalid combination length',
            error: {
                field: 'length',
                message: `Requested combination length (${length}) cannot exceed total number of items (${totalItems}). The items array [${items.join(', ')}] generates ${totalItems} total items.`
            }
        });
    }

    next();
};

module.exports = {
    generateCombinationSchema,
    validate,
    validateLengthVsItems
};


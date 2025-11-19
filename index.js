require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const combinationRoutes = require('./routes/combinationRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/', combinationRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

async function startServer() {
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error('⚠️  Warning: Database connection failed. Server will start but API may not work.');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

startServer();

module.exports = app;

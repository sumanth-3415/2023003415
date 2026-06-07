/**
 * Main Backend Entry Point - Express Server
 * Provides API endpoints for notification management
 */

const express = require('express');
const cors = require('cors');
const Logger = require('../logging_middleware/logger');
const { getTop10UnreadNotifications } = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  Logger.info('HTTP_REQUEST', `${req.method} ${req.path}`);
  next();
});

/**
 * GET /api/notifications
 * Returns top 10 notifications sorted by priority
 */
app.get('/api/notifications', async (req, res) => {
  Logger.info('GET /api/notifications', 'Request received');

  try {
    const startTime = Date.now();
    const top10Notifications = await getTop10UnreadNotifications();
    const duration = Date.now() - startTime;

    Logger.success('GET /api/notifications', 'Retrieved top 10 notifications', {
      count: top10Notifications.length,
      duration,
    });

    res.json({
      success: true,
      data: top10Notifications,
      count: top10Notifications.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    Logger.error('GET /api/notifications', 'Error retrieving notifications', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  Logger.info('GET /health', 'Health check');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  Logger.error('EXPRESS_ERROR', 'Unhandled error', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  Logger.success('SERVER', `Express server started on port ${PORT}`, {
    url: `http://localhost:${PORT}`,
  });
  console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📊 API Endpoint: http://localhost:${PORT}/api/notifications`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
});

module.exports = app;

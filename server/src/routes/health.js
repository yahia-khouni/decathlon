/**
 * Health Routes
 * Routes for health check and status endpoints
 */

const express = require('express');
const { healthController } = require('../controllers');

const router = express.Router();

/**
 * GET /api/health
 * Basic health check
 *
 * Response:
 * {
 *   status: 'ok',
 *   timestamp: '2025-12-05T...',
 *   uptime: 123.456,
 *   exercisesLoaded: 873,
 *   productsLoaded: 285,
 *   dataInitialized: true
 * }
 */
router.get('/', healthController.checkHealth);

/**
 * GET /api/health/detailed
 * Detailed server status including memory usage
 *
 * Response:
 * {
 *   status: 'ok',
 *   server: { uptime, nodeVersion, platform, ... },
 *   memory: { heapUsed, heapTotal, ... },
 *   data: { initialized, exercisesLoaded, productsLoaded }
 * }
 */
router.get('/detailed', healthController.getDetailedStatus);

module.exports = router;

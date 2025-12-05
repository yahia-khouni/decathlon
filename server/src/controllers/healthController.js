/**
 * Health Controller
 * Handles health check and status requests
 */

const { dataService } = require('../services');

/**
 * Check server health and data loading status
 * GET /api/health
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function checkHealth(req, res) {
  try {
    const stats = dataService.getStats();

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      exercisesLoaded: stats.exercisesLoaded,
      productsLoaded: stats.productsLoaded,
      dataInitialized: stats.initialized,
    });
  } catch (error) {
    console.error('Error in checkHealth:', error);

    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message,
    });
  }
}

/**
 * Get detailed server status (for debugging)
 * GET /api/health/detailed
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getDetailedStatus(req, res) {
  try {
    const stats = dataService.getStats();

    // Get memory usage
    const memoryUsage = process.memoryUsage();

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        uptimeFormatted: formatUptime(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        heapUsed: formatBytes(memoryUsage.heapUsed),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        external: formatBytes(memoryUsage.external),
        rss: formatBytes(memoryUsage.rss),
      },
      data: {
        initialized: stats.initialized,
        exercisesLoaded: stats.exercisesLoaded,
        productsLoaded: stats.productsLoaded,
      },
    });
  } catch (error) {
    console.error('Error in getDetailedStatus:', error);

    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Detailed status check failed',
      error: error.message,
    });
  }
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format uptime to human-readable string
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted string
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

module.exports = {
  checkHealth,
  getDetailedStatus,
};

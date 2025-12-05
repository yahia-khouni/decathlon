/**
 * Server Entry Point
 * Initializes data services and starts the Express server
 */

// Load environment variables first
require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config');
const { dataService } = require('./src/services');

// Log which model is configured
console.log(`LLM Model configured: ${config.llm.model}`);

/**
 * Start the server
 */
async function startServer() {
  console.log('');
  console.log('='.repeat(60));
  console.log('  Decathlon Posture Coach API Server');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Initialize data service (load exercises and products)
    console.log('Loading data...');
    dataService.initialize();

    // Get stats for startup message
    const stats = dataService.getStats();

    // Validate API key is set
    if (!config.openRouter.apiKey) {
      console.warn('');
      console.warn('⚠️  WARNING: OPENROUTER_API_KEY is not set!');
      console.warn('   LLM-powered recommendations will not work.');
      console.warn('   Set the API key in your .env file.');
      console.warn('');
    }

    // Start listening
    const PORT = config.server.port;

    app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(60));
      console.log(`  ✓ Server running on port ${PORT}`);
      console.log(`  ✓ ${stats.exercisesLoaded} exercises loaded`);
      console.log(`  ✓ ${stats.productsLoaded} products loaded`);
      console.log('='.repeat(60));
      console.log('');
      console.log('Available endpoints:');
      console.log(`  • API Info:      http://localhost:${PORT}/api`);
      console.log(`  • Health Check:  http://localhost:${PORT}/api/health`);
      console.log(`  • Exercises:     http://localhost:${PORT}/api/exercises`);
      console.log(`  • Products:      http://localhost:${PORT}/api/products`);
      console.log('');
      console.log('LLM-powered endpoints:');
      console.log(`  • POST http://localhost:${PORT}/api/exercises/recommend`);
      console.log(`  • POST http://localhost:${PORT}/api/products/recommend`);
      console.log('');
      console.log('Press Ctrl+C to stop the server');
      console.log('');
    });
  } catch (error) {
    console.error('');
    console.error('Failed to start server:', error.message);
    console.error('');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('');
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('Shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

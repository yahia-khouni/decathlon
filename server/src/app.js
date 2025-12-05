/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

// Create Express application
const app = express();

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Enable CORS for all origins (configure for production)
app.use(cors({
  origin: '*', // In production, specify allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// =============================================================================
// STATIC FILES
// =============================================================================

// Serve exercise images from the data folder
// Access via: /images/exercises/{exercise_id}/0.jpg
app.use(
  '/images/exercises',
  express.static(path.join(__dirname, '..', 'data', 'exercises'))
);

// =============================================================================
// ROUTES
// =============================================================================

// Mount API routes under /api prefix
app.use('/api', routes);

// Root endpoint - redirect to API info
app.get('/', (req, res) => {
  res.redirect('/api');
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    error: true,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      api: '/api',
      health: '/api/health',
      exercises: '/api/exercises',
      products: '/api/products',
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: true,
      code: 'INVALID_JSON',
      message: 'Invalid JSON in request body',
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: true,
    code: err.code || 'INTERNAL_ERROR',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;

/**
 * Routes Index
 * Aggregates all routes under /api prefix
 */

const express = require('express');
const exerciseRoutes = require('./exercises');
const productRoutes = require('./products');
const healthRoutes = require('./health');

const router = express.Router();

/**
 * Mount routes
 *
 * API Structure:
 * /api
 *   /health
 *     GET  /           - Basic health check
 *     GET  /detailed   - Detailed server status
 *   /exercises
 *     POST /recommend  - Get LLM-powered exercise recommendations
 *     GET  /           - List all exercises (with filters)
 *     GET  /:nameOrId  - Get single exercise
 *   /products
 *     POST /recommend  - Get LLM-powered product recommendations
 *     GET  /           - List all products (with search)
 *     GET  /:label     - Get single product
 */

router.use('/health', healthRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/products', productRoutes);

// Root API info
router.get('/', (req, res) => {
  res.json({
    name: 'Decathlon Posture Coach API',
    version: '1.0.0',
    description: 'Backend API for sports posture coaching with LLM-powered recommendations',
    endpoints: {
      health: {
        'GET /api/health': 'Basic health check',
        'GET /api/health/detailed': 'Detailed server status',
      },
      exercises: {
        'POST /api/exercises/recommend': 'Get personalized exercise recommendations',
        'GET /api/exercises': 'List all exercises (with filters)',
        'GET /api/exercises/:nameOrId': 'Get single exercise by name',
      },
      products: {
        'POST /api/products/recommend': 'Get product recommendations for exercises',
        'GET /api/products': 'List all products (with search)',
        'GET /api/products/:label': 'Get single product by label',
      },
    },
    documentation: {
      exercises: {
        totalAvailable: 873,
        recommendationInput: {
          fitnessLevel: 'beginner | intermediate | expert',
          goals: 'Array of fitness goals',
          targetMuscles: 'Array of muscle groups',
          availableEquipment: 'Array of equipment types',
        },
      },
      products: {
        totalAvailable: 285,
        recommendationInput: {
          exerciseIds: 'Array of exercise names to get products for',
        },
      },
    },
  });
});

module.exports = router;

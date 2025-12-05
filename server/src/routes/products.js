/**
 * Product Routes
 * Routes for product-related endpoints
 */

const express = require('express');
const { productController } = require('../controllers');

const router = express.Router();

/**
 * POST /api/products/recommend
 * Recommend Decathlon products based on selected exercises
 *
 * Request Body:
 * {
 *   exerciseIds: ['Bodyweight Squat', 'Push-Ups', 'Plank']
 *   // or exerciseNames / exercises - all accepted
 * }
 *
 * Response:
 * {
 *   success: true,
 *   products: [
 *     { label: '...', url: '...', fullUrl: 'https://www.decathlon.fr/...' }
 *   ],
 *   meta: { ... }
 * }
 */
router.post('/recommend', productController.recommendProducts);

/**
 * GET /api/products
 * List all available products with optional filtering
 *
 * Query Parameters:
 * - search: text to search in product labels
 * - limit: number (default: 50)
 * - offset: number (default: 0)
 */
router.get('/', productController.getAllProducts);

/**
 * GET /api/products/:label
 * Get a single product by label
 */
router.get('/:label', productController.getProductByLabel);

module.exports = router;

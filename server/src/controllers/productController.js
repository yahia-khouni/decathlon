/**
 * Product Controller
 * Handles product recommendation requests
 */

const { dataService, llmService, LLMError } = require('../services');
const {
  validateProductRecommendationInput,
  validateAndResolveProducts,
} = require('../utils');

/**
 * Recommend products based on selected exercises
 * POST /api/products/recommend
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function recommendProducts(req, res) {
  try {
    // 1. Validate input
    const validation = validateProductRecommendationInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        error: true,
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: validation.errors,
      });
    }

    // 2. Resolve exercise names to full Exercise objects
    const exercises = dataService.getExercisesByNames(validation.exerciseIds);

    if (exercises.length === 0) {
      return res.status(400).json({
        error: true,
        code: 'NO_EXERCISES_FOUND',
        message: 'None of the provided exercise names could be found.',
        details: {
          requested: validation.exerciseIds,
        },
      });
    }

    // 3. Get product labels from DataService
    const productLabels = dataService.getProductLabels();

    if (productLabels.length === 0) {
      return res.status(500).json({
        error: true,
        code: 'DATA_NOT_LOADED',
        message: 'Product data not available. Please try again later.',
      });
    }

    // 4. Call LLM to select products
    console.log('Calling LLM to select products for exercises:', exercises.map((e) => e.name));
    const selectedLabels = await llmService.selectProducts(exercises, productLabels);

    console.log('LLM selected products:', selectedLabels);

    // 5. Validate and resolve product labels to full Product objects
    const productsMap = dataService.getProductsMap();
    const resolution = validateAndResolveProducts(selectedLabels, productsMap);

    // Log any issues
    if (resolution.notFound.length > 0) {
      console.warn('Some products could not be resolved:', resolution.notFound);
    }

    // 6. Check if we have any products
    if (resolution.products.length === 0) {
      return res.status(500).json({
        error: true,
        code: 'NO_PRODUCTS_RESOLVED',
        message: 'Could not find matching products. Please try again.',
        details: {
          requested: selectedLabels,
          notFound: resolution.notFound,
        },
      });
    }

    // 7. Build response with full product data
    const products = resolution.products.map((product) => product.toJSON());

    return res.status(200).json({
      success: true,
      products,
      meta: {
        requested: selectedLabels.length,
        resolved: resolution.products.length,
        resolution: resolution.resolved,
        forExercises: exercises.map((e) => e.name),
      },
    });
  } catch (error) {
    console.error('Error in recommendProducts:', error);

    // Handle LLM-specific errors
    if (error instanceof LLMError) {
      return res.status(503).json({
        error: true,
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      error: true,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while recommending products.',
    });
  }
}

/**
 * Get all available products (for debugging/exploration)
 * GET /api/products
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getAllProducts(req, res) {
  try {
    const productsMap = dataService.getProductsMap();
    const products = [];

    const { search, limit = 50, offset = 0 } = req.query;

    let count = 0;
    for (const product of productsMap.values()) {
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (!product.label.toLowerCase().includes(searchLower)) {
          continue;
        }
      }

      count++;

      // Apply pagination
      if (count <= offset) continue;
      if (products.length >= parseInt(limit, 10)) break;

      products.push(product.toJSON());
    }

    return res.status(200).json({
      success: true,
      products,
      meta: {
        total: productsMap.size,
        filtered: count,
        returned: products.length,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);

    return res.status(500).json({
      error: true,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while fetching products.',
    });
  }
}

/**
 * Get a single product by label
 * GET /api/products/:label
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getProductByLabel(req, res) {
  try {
    const { label } = req.params;

    const product = dataService.getProductByLabel(decodeURIComponent(label));

    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: `Product "${label}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      product: product.toJSON(),
    });
  } catch (error) {
    console.error('Error in getProductByLabel:', error);

    return res.status(500).json({
      error: true,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while fetching the product.',
    });
  }
}

module.exports = {
  recommendProducts,
  getAllProducts,
  getProductByLabel,
};

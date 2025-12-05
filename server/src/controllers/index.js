/**
 * Controllers Index
 * Export all controllers from a single entry point
 */

const exerciseController = require('./exerciseController');
const productController = require('./productController');
const healthController = require('./healthController');

module.exports = {
  exerciseController,
  productController,
  healthController,
};

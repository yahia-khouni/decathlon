/**
 * DataService
 * Singleton service for loading and accessing exercise and product data
 * Acts as the in-memory "database" for the application
 */

const path = require('path');
const { Exercise, Product } = require('../models');
const { DATA_PATHS } = require('../config/constants');

class DataService {
  constructor() {
    // In-memory data stores
    this.exercisesMap = null;
    this.productsMap = null;

    // Cached name/label lists for LLM prompts
    this.exerciseNamesList = null;
    this.productLabelsList = null;

    // Initialization state
    this.initialized = false;
  }

  /**
   * Initialize the data service by loading all data from JSON files
   * Should be called once at server startup before handling requests
   */
  initialize() {
    if (this.initialized) {
      console.log('DataService already initialized');
      return;
    }

    console.log('Initializing DataService...');

    try {
      // Load exercises
      const exercisesPath = path.resolve(DATA_PATHS.EXERCISES_JSON);
      this.exercisesMap = Exercise.loadAll(exercisesPath);
      this.exerciseNamesList = Exercise.getNamesList(this.exercisesMap);
      console.log(`  ✓ Loaded ${this.exercisesMap.size} exercises`);

      // Load products
      const productsPath = path.resolve(DATA_PATHS.PRODUCTS_JSON);
      this.productsMap = Product.loadAll(productsPath);
      this.productLabelsList = Product.getLabelsList(this.productsMap);
      console.log(`  ✓ Loaded ${this.productsMap.size} products`);

      this.initialized = true;
      console.log('DataService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DataService:', error.message);
      throw error;
    }
  }

  /**
   * Ensure the service is initialized before accessing data
   * @private
   */
  _ensureInitialized() {
    if (!this.initialized) {
      throw new Error('DataService not initialized. Call initialize() first.');
    }
  }

  /**
   * Get an exercise by name (case-insensitive)
   * @param {string} name - Exercise name
   * @returns {Exercise|null} Exercise instance or null if not found
   */
  getExerciseByName(name) {
    this._ensureInitialized();
    return this.exercisesMap.get(name.toLowerCase()) || null;
  }

  /**
   * Get a product by label (case-insensitive)
   * @param {string} label - Product label
   * @returns {Product|null} Product instance or null if not found
   */
  getProductByLabel(label) {
    this._ensureInitialized();
    return this.productsMap.get(label.toLowerCase()) || null;
  }

  /**
   * Get all exercise names for LLM prompt
   * @returns {string[]} Array of exercise names
   */
  getExerciseNames() {
    this._ensureInitialized();
    return this.exerciseNamesList;
  }

  /**
   * Get all product labels for LLM prompt
   * @returns {string[]} Array of product labels
   */
  getProductLabels() {
    this._ensureInitialized();
    return this.productLabelsList;
  }

  /**
   * Get the exercises map for advanced filtering
   * @returns {Map<string, Exercise>} Map of exercises
   */
  getExercisesMap() {
    this._ensureInitialized();
    return this.exercisesMap;
  }

  /**
   * Get the products map for advanced filtering
   * @returns {Map<string, Product>} Map of products
   */
  getProductsMap() {
    this._ensureInitialized();
    return this.productsMap;
  }

  /**
   * Get multiple exercises by names
   * @param {string[]} names - Array of exercise names
   * @returns {Exercise[]} Array of found exercises (skips not found)
   */
  getExercisesByNames(names) {
    this._ensureInitialized();
    const exercises = [];
    for (const name of names) {
      const exercise = this.getExerciseByName(name);
      if (exercise) {
        exercises.push(exercise);
      }
    }
    return exercises;
  }

  /**
   * Get multiple products by labels
   * @param {string[]} labels - Array of product labels
   * @returns {Product[]} Array of found products (skips not found)
   */
  getProductsByLabels(labels) {
    this._ensureInitialized();
    const products = [];
    for (const label of labels) {
      const product = this.getProductByLabel(label);
      if (product) {
        products.push(product);
      }
    }
    return products;
  }

  /**
   * Get statistics about loaded data
   * @returns {Object} Data statistics
   */
  getStats() {
    this._ensureInitialized();
    return {
      exercisesLoaded: this.exercisesMap.size,
      productsLoaded: this.productsMap.size,
      initialized: this.initialized,
    };
  }
}

// Export singleton instance
const dataService = new DataService();
module.exports = dataService;

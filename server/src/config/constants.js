/**
 * Application constants
 * Defines fixed values used throughout the application
 */

const constants = {
  // LLM Response Limits
  MAX_EXERCISES: 3,
  MAX_PRODUCTS: 3,

  // LLM Parameters
  LLM_TEMPERATURE: 0.3,
  LLM_MAX_TOKENS: 1500,

  // API Retry Configuration
  LLM_MAX_RETRIES: 3,
  LLM_RETRY_DELAY_MS: 1000,

  // Data Paths (relative to server root)
  DATA_PATHS: {
    EXERCISES_JSON: './data/exercises/exercises.json',
    EXERCISE_NAMES_TXT: './data/exercises/exercise_names.txt',
    PRODUCTS_JSON: './data/products/products.json',
    PRODUCTS_NAMES_TXT: './data/products/products_names.txt',
  },

  // Decathlon Base URL for product links
  DECATHLON_BASE_URL: 'https://www.decathlon.fr/',

  // Exercise Image Base URL (GitHub raw content)
  EXERCISE_IMAGE_BASE_URL: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/',
};

module.exports = constants;

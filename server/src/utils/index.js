/**
 * Utils Index
 * Export all utilities from a single entry point
 */

const {
  buildExerciseSelectionPrompt,
  buildProductSelectionPrompt,
  buildExerciseSystemPrompt,
  buildExerciseUserPrompt,
  buildProductSystemPrompt,
  buildProductUserPrompt,
} = require('./prompts');

const {
  levenshteinDistance,
  findClosestMatch,
  validateAndResolveExercises,
  validateAndResolveProducts,
  validateQuestionnaireInput,
  validateProductRecommendationInput,
  ValidationError,
} = require('./validation');

module.exports = {
  // Prompt builders
  buildExerciseSelectionPrompt,
  buildProductSelectionPrompt,
  buildExerciseSystemPrompt,
  buildExerciseUserPrompt,
  buildProductSystemPrompt,
  buildProductUserPrompt,

  // Validation utilities
  levenshteinDistance,
  findClosestMatch,
  validateAndResolveExercises,
  validateAndResolveProducts,
  validateQuestionnaireInput,
  validateProductRecommendationInput,
  ValidationError,
};

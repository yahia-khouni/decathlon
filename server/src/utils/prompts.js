/**
 * Prompt Templates
 * Contains prompt builders for LLM interactions
 */

const constants = require('../config/constants');

/**
 * Build the system prompt for exercise selection
 * @returns {string} System prompt
 */
function buildExerciseSystemPrompt() {
  return `You are a professional fitness coach assistant specializing in exercise recommendations and injury prevention. Your task is to select exactly ${constants.MAX_EXERCISES} exercises from a provided list that best match the user's fitness profile and goals.

CRITICAL RULES:
1. You MUST select exactly ${constants.MAX_EXERCISES} exercises - no more, no less
2. You MUST only select exercises from the provided list - do not invent new exercises
3. Return the EXACT exercise names as they appear in the list - spelling and capitalization must match exactly
4. Consider the user's:
   - Fitness level (beginner/intermediate/expert)
   - Goals (muscle building, weight loss, flexibility, etc.)
   - Target muscles
   - Available equipment
   - Any exercises to avoid
5. Select exercises that:
   - Are appropriate for the user's fitness level
   - Target the requested muscle groups
   - Can be performed with available equipment
   - Complement each other for a balanced workout
   - Help prevent injuries through proper form focus

RESPONSE FORMAT:
You must respond with ONLY a valid JSON object, no additional text or explanation outside the JSON:
{
  "selected_exercises": ["Exact Exercise Name 1", "Exact Exercise Name 2", "Exact Exercise Name 3"],
  "reasoning": "Brief explanation of why these exercises were chosen"
}`;
}

/**
 * Build the user prompt for exercise selection
 * @param {UserProfile} userProfile - User's fitness profile
 * @param {string[]} exerciseNames - Available exercise names
 * @returns {string} User prompt
 */
function buildExerciseUserPrompt(userProfile, exerciseNames) {
  return `USER FITNESS PROFILE:
${userProfile.toPromptContext()}

AVAILABLE EXERCISES (you must select exactly ${constants.MAX_EXERCISES} from this list):
${exerciseNames.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}

Based on the user's profile above, select the ${constants.MAX_EXERCISES} most appropriate exercises from the list. Remember to return EXACT names from the list.`;
}

/**
 * Build complete messages array for exercise selection
 * @param {UserProfile} userProfile - User's fitness profile
 * @param {string[]} exerciseNames - Available exercise names
 * @returns {Array<{role: string, content: string}>} Messages array for LLM
 */
function buildExerciseSelectionPrompt(userProfile, exerciseNames) {
  return [
    { role: 'system', content: buildExerciseSystemPrompt() },
    { role: 'user', content: buildExerciseUserPrompt(userProfile, exerciseNames) },
  ];
}

/**
 * Build the system prompt for product selection
 * @returns {string} System prompt
 */
function buildProductSystemPrompt() {
  return `You are a sports equipment specialist at Decathlon, helping customers find the perfect products for their workout routines. Your task is to recommend exactly ${constants.MAX_PRODUCTS} products from a provided list that would help a user perform their selected exercises better.

CRITICAL RULES:
1. You MUST select exactly ${constants.MAX_PRODUCTS} products - no more, no less
2. You MUST only select products from the provided list - do not suggest products not in the list
3. Return the EXACT product labels as they appear in the list - spelling must match exactly
4. Consider:
   - Equipment needed for the exercises (dumbbells, mats, bands, etc.)
   - Safety equipment (gloves, supports, etc.)
   - Performance enhancement (proper footwear, clothing, etc.)
   - Accessories that improve the workout experience
5. Prioritize products that:
   - Directly support the exercise movements
   - Match the equipment requirements of the exercises
   - Enhance safety and prevent injuries
   - Are appropriate for the exercise category (strength, cardio, stretching)

RESPONSE FORMAT:
You must respond with ONLY a valid JSON object, no additional text or explanation outside the JSON:
{
  "selected_products": ["Exact Product Label 1", "Exact Product Label 2", "Exact Product Label 3"],
  "reasoning": "Brief explanation of why these products were recommended"
}`;
}

/**
 * Build the user prompt for product selection
 * @param {Exercise[]} exercises - Selected exercises
 * @param {string[]} productLabels - Available product labels
 * @returns {string} User prompt
 */
function buildProductUserPrompt(exercises, productLabels) {
  const exerciseSummary = exercises.map((ex) => {
    return `- ${ex.name}
    Equipment: ${ex.equipment}
    Category: ${ex.category}
    Primary Muscles: ${ex.primaryMuscles.join(', ')}
    Level: ${ex.level}`;
  }).join('\n');

  return `SELECTED EXERCISES FOR THE USER:
${exerciseSummary}

AVAILABLE PRODUCTS (you must select exactly ${constants.MAX_PRODUCTS} from this list):
${productLabels.map((label, idx) => `${idx + 1}. ${label}`).join('\n')}

Based on the exercises above, recommend the ${constants.MAX_PRODUCTS} most useful products from the list. Remember to return EXACT labels from the list.`;
}

/**
 * Build complete messages array for product selection
 * @param {Exercise[]} exercises - Selected exercises
 * @param {string[]} productLabels - Available product labels
 * @returns {Array<{role: string, content: string}>} Messages array for LLM
 */
function buildProductSelectionPrompt(exercises, productLabels) {
  return [
    { role: 'system', content: buildProductSystemPrompt() },
    { role: 'user', content: buildProductUserPrompt(exercises, productLabels) },
  ];
}

module.exports = {
  buildExerciseSelectionPrompt,
  buildProductSelectionPrompt,
  buildExerciseSystemPrompt,
  buildExerciseUserPrompt,
  buildProductSystemPrompt,
  buildProductUserPrompt,
};

/**
 * Validation Utilities
 * Contains validation and fuzzy matching functions
 */

const constants = require('../config/constants');

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching exercise/product names
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance between strings
 */
function levenshteinDistance(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      const cost = s1[j - 1] === s2[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[s2.length][s1.length];
}

/**
 * Find the closest matching string from a list
 * @param {string} target - String to match
 * @param {string[]} candidates - List of candidate strings
 * @param {number} maxDistance - Maximum allowed edit distance (default: 5)
 * @returns {{match: string|null, distance: number}} Best match and its distance
 */
function findClosestMatch(target, candidates, maxDistance = 5) {
  let bestMatch = null;
  let bestDistance = Infinity;

  const targetLower = target.toLowerCase();

  for (const candidate of candidates) {
    const distance = levenshteinDistance(targetLower, candidate.toLowerCase());

    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }

    // Perfect match found
    if (distance === 0) {
      break;
    }
  }

  // Only return match if within acceptable distance
  if (bestDistance <= maxDistance) {
    return { match: bestMatch, distance: bestDistance };
  }

  return { match: null, distance: bestDistance };
}

/**
 * Validate and resolve exercise names from LLM response
 * @param {string[]} selectedNames - Exercise names from LLM
 * @param {Map<string, Exercise>} exercisesMap - Map of all exercises
 * @returns {{exercises: Exercise[], resolved: Object[], notFound: string[]}} Resolution results
 */
function validateAndResolveExercises(selectedNames, exercisesMap) {
  const exercises = [];
  const resolved = [];
  const notFound = [];

  // Get all exercise names for fuzzy matching
  const allNames = [];
  for (const exercise of exercisesMap.values()) {
    allNames.push(exercise.name);
  }

  for (const name of selectedNames) {
    // Try exact match first (case-insensitive)
    let exercise = exercisesMap.get(name.toLowerCase());

    if (exercise) {
      exercises.push(exercise);
      resolved.push({
        requested: name,
        resolved: exercise.name,
        method: 'exact',
      });
      continue;
    }

    // Try fuzzy matching
    const { match, distance } = findClosestMatch(name, allNames);

    if (match) {
      exercise = exercisesMap.get(match.toLowerCase());
      if (exercise) {
        exercises.push(exercise);
        resolved.push({
          requested: name,
          resolved: exercise.name,
          method: 'fuzzy',
          distance,
        });
        console.warn(`Fuzzy matched "${name}" → "${exercise.name}" (distance: ${distance})`);
        continue;
      }
    }

    // No match found
    notFound.push(name);
    console.warn(`Exercise not found: "${name}"`);
  }

  return { exercises, resolved, notFound };
}

/**
 * Validate and resolve product labels from LLM response
 * @param {string[]} selectedLabels - Product labels from LLM
 * @param {Map<string, Product>} productsMap - Map of all products
 * @returns {{products: Product[], resolved: Object[], notFound: string[]}} Resolution results
 */
function validateAndResolveProducts(selectedLabels, productsMap) {
  const products = [];
  const resolved = [];
  const notFound = [];

  // Get all product labels for fuzzy matching
  const allLabels = [];
  for (const product of productsMap.values()) {
    allLabels.push(product.label);
  }

  for (const label of selectedLabels) {
    // Try exact match first (case-insensitive)
    let product = productsMap.get(label.toLowerCase());

    if (product) {
      products.push(product);
      resolved.push({
        requested: label,
        resolved: product.label,
        method: 'exact',
      });
      continue;
    }

    // Try fuzzy matching (with higher tolerance for product names)
    const { match, distance } = findClosestMatch(label, allLabels, 10);

    if (match) {
      product = productsMap.get(match.toLowerCase());
      if (product) {
        products.push(product);
        resolved.push({
          requested: label,
          resolved: product.label,
          method: 'fuzzy',
          distance,
        });
        console.warn(`Fuzzy matched "${label}" → "${product.label}" (distance: ${distance})`);
        continue;
      }
    }

    // No match found
    notFound.push(label);
    console.warn(`Product not found: "${label}"`);
  }

  return { products, resolved, notFound };
}

/**
 * Validation error class
 */
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Validate questionnaire input from request body
 * @param {Object} body - Request body
 * @returns {{valid: boolean, errors: string[], profile: Object}} Validation result
 */
function validateQuestionnaireInput(body) {
  const errors = [];
  const profile = {};

  // Check if body exists
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      errors: ['Request body is required and must be an object'],
      profile: null,
    };
  }

  // Validate fitnessLevel (required)
  const validLevels = ['beginner', 'intermediate', 'expert'];
  if (body.fitnessLevel) {
    if (!validLevels.includes(body.fitnessLevel.toLowerCase())) {
      errors.push(`fitnessLevel must be one of: ${validLevels.join(', ')}`);
    } else {
      profile.fitnessLevel = body.fitnessLevel.toLowerCase();
    }
  } else {
    // Default to beginner if not provided
    profile.fitnessLevel = 'beginner';
  }

  // Validate goals (optional, array of strings)
  if (body.goals !== undefined) {
    if (!Array.isArray(body.goals)) {
      errors.push('goals must be an array of strings');
    } else if (!body.goals.every((g) => typeof g === 'string')) {
      errors.push('all goals must be strings');
    } else {
      profile.goals = body.goals;
    }
  } else {
    profile.goals = [];
  }

  // Validate targetMuscles (optional, array of strings)
  if (body.targetMuscles !== undefined) {
    if (!Array.isArray(body.targetMuscles)) {
      errors.push('targetMuscles must be an array of strings');
    } else if (!body.targetMuscles.every((m) => typeof m === 'string')) {
      errors.push('all targetMuscles must be strings');
    } else {
      profile.targetMuscles = body.targetMuscles;
    }
  } else {
    profile.targetMuscles = [];
  }

  // Validate availableEquipment (optional, array of strings)
  if (body.availableEquipment !== undefined) {
    if (!Array.isArray(body.availableEquipment)) {
      errors.push('availableEquipment must be an array of strings');
    } else if (!body.availableEquipment.every((e) => typeof e === 'string')) {
      errors.push('all availableEquipment must be strings');
    } else {
      profile.availableEquipment = body.availableEquipment;
    }
  } else {
    profile.availableEquipment = ['body only'];
  }

  // Validate exercisePreferences (optional, object)
  if (body.exercisePreferences !== undefined) {
    if (typeof body.exercisePreferences !== 'object' || Array.isArray(body.exercisePreferences)) {
      errors.push('exercisePreferences must be an object');
    } else {
      profile.exercisePreferences = {
        categories: body.exercisePreferences.categories || ['strength'],
        forceType: body.exercisePreferences.forceType || null,
        avoid: body.exercisePreferences.avoid || [],
      };
    }
  } else {
    profile.exercisePreferences = {
      categories: ['strength'],
      forceType: null,
      avoid: [],
    };
  }

  // Validate additionalNotes (optional, string)
  if (body.additionalNotes !== undefined) {
    if (typeof body.additionalNotes !== 'string') {
      errors.push('additionalNotes must be a string');
    } else {
      profile.additionalNotes = body.additionalNotes;
    }
  } else {
    profile.additionalNotes = '';
  }

  return {
    valid: errors.length === 0,
    errors,
    profile: errors.length === 0 ? profile : null,
  };
}

/**
 * Validate exercise IDs input for product recommendation
 * @param {Object} body - Request body
 * @returns {{valid: boolean, errors: string[], exerciseIds: string[]}} Validation result
 */
function validateProductRecommendationInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      errors: ['Request body is required and must be an object'],
      exerciseIds: null,
    };
  }

  // Validate exerciseIds or exerciseNames (required, array of strings)
  const exerciseIds = body.exerciseIds || body.exerciseNames || body.exercises;

  if (!exerciseIds) {
    errors.push('exerciseIds (or exerciseNames/exercises) is required');
  } else if (!Array.isArray(exerciseIds)) {
    errors.push('exerciseIds must be an array');
  } else if (exerciseIds.length === 0) {
    errors.push('exerciseIds must contain at least one exercise');
  } else if (!exerciseIds.every((id) => typeof id === 'string')) {
    errors.push('all exerciseIds must be strings');
  }

  return {
    valid: errors.length === 0,
    errors,
    exerciseIds: errors.length === 0 ? exerciseIds : null,
  };
}

module.exports = {
  levenshteinDistance,
  findClosestMatch,
  validateAndResolveExercises,
  validateAndResolveProducts,
  validateQuestionnaireInput,
  validateProductRecommendationInput,
  ValidationError,
};

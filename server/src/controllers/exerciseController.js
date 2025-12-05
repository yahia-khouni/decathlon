/**
 * Exercise Controller
 * Handles exercise recommendation requests
 */

const { UserProfile } = require('../models');
const { dataService, llmService, LLMError } = require('../services');
const {
  validateQuestionnaireInput,
  validateAndResolveExercises,
} = require('../utils');

/**
 * Recommend exercises based on user questionnaire answers
 * POST /api/exercises/recommend
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function recommendExercises(req, res) {
  try {
    // Extract questionnaire data from body
    const questionnaireData = req.body.questionnaire || req.body;

    // DEBUG: Log raw input
    console.log('=== RAW INPUT DEBUG ===');
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    console.log('questionnaireData:', JSON.stringify(questionnaireData, null, 2));
    console.log('=======================');

    // 1. Create UserProfile directly from questionnaire answers (skip strict validation)
    const userProfile = UserProfile.fromQuestionnaire(questionnaireData);

    // DEBUG: Log what we're sending to the LLM
    console.log('=== USER PROFILE DEBUG ===');
    console.log('Parsed profile context:', userProfile.toPromptContext());
    console.log('==========================');

    // 3. Get exercise names from DataService
    const exerciseNames = dataService.getExerciseNames();

    if (exerciseNames.length === 0) {
      return res.status(500).json({
        error: true,
        code: 'DATA_NOT_LOADED',
        message: 'Exercise data not available. Please try again later.',
      });
    }

    // 4. Call LLM to select exercises
    console.log('Calling LLM to select exercises for user profile...');
    const selectedNames = await llmService.selectExercises(userProfile, exerciseNames);

    console.log('LLM selected exercises:', selectedNames);

    // 5. Validate and resolve exercise names to full Exercise objects
    const exercisesMap = dataService.getExercisesMap();
    const resolution = validateAndResolveExercises(selectedNames, exercisesMap);

    // Log any issues
    if (resolution.notFound.length > 0) {
      console.warn('Some exercises could not be resolved:', resolution.notFound);
    }

    // 6. Check if we have enough exercises
    if (resolution.exercises.length === 0) {
      return res.status(500).json({
        error: true,
        code: 'NO_EXERCISES_RESOLVED',
        message: 'Could not find matching exercises. Please try again.',
        details: {
          requested: selectedNames,
          notFound: resolution.notFound,
        },
      });
    }

    // 7. Build response with full exercise data
    const exercises = resolution.exercises.map((exercise) => exercise.toJSON());

    return res.status(200).json({
      success: true,
      exercises,
      meta: {
        requested: selectedNames.length,
        resolved: resolution.exercises.length,
        resolution: resolution.resolved,
        userProfile: userProfile.toJSON(),
      },
    });
  } catch (error) {
    console.error('Error in recommendExercises:', error);

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
      message: 'An unexpected error occurred while recommending exercises.',
    });
  }
}

/**
 * Get all available exercises (for debugging/exploration)
 * GET /api/exercises
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getAllExercises(req, res) {
  try {
    const exercisesMap = dataService.getExercisesMap();
    const exercises = [];

    // Apply optional filters from query params
    const { level, equipment, muscle, category, limit = 50, offset = 0 } = req.query;

    let count = 0;
    for (const exercise of exercisesMap.values()) {
      // Apply filters
      if (level && exercise.level !== level) continue;
      if (equipment && exercise.equipment !== equipment) continue;
      if (category && exercise.category !== category) continue;
      if (muscle) {
        const hasMuscle = [...exercise.primaryMuscles, ...exercise.secondaryMuscles]
          .some((m) => m.toLowerCase().includes(muscle.toLowerCase()));
        if (!hasMuscle) continue;
      }

      count++;

      // Apply pagination
      if (count <= offset) continue;
      if (exercises.length >= parseInt(limit, 10)) break;

      exercises.push(exercise.toJSON());
    }

    return res.status(200).json({
      success: true,
      exercises,
      meta: {
        total: exercisesMap.size,
        filtered: count,
        returned: exercises.length,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  } catch (error) {
    console.error('Error in getAllExercises:', error);

    return res.status(500).json({
      error: true,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while fetching exercises.',
    });
  }
}

/**
 * Get a single exercise by name or ID
 * GET /api/exercises/:nameOrId
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function getExerciseByName(req, res) {
  try {
    const { nameOrId } = req.params;

    const exercise = dataService.getExerciseByName(nameOrId);

    if (!exercise) {
      return res.status(404).json({
        error: true,
        code: 'EXERCISE_NOT_FOUND',
        message: `Exercise "${nameOrId}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      exercise: exercise.toJSON(),
    });
  } catch (error) {
    console.error('Error in getExerciseByName:', error);

    return res.status(500).json({
      error: true,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while fetching the exercise.',
    });
  }
}

module.exports = {
  recommendExercises,
  getAllExercises,
  getExerciseByName,
};

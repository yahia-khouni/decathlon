/**
 * Exercise Routes
 * Routes for exercise-related endpoints
 */

const express = require('express');
const { exerciseController } = require('../controllers');

const router = express.Router();

/**
 * POST /api/exercises/recommend
 * Recommend exercises based on user questionnaire answers
 *
 * Request Body:
 * {
 *   fitnessLevel: 'beginner' | 'intermediate' | 'expert',
 *   goals: ['build muscle', 'lose weight', ...],
 *   targetMuscles: ['chest', 'back', 'legs', ...],
 *   availableEquipment: ['body only', 'dumbbell', ...],
 *   exercisePreferences: {
 *     categories: ['strength', 'stretching', ...],
 *     forceType: 'push' | 'pull' | null,
 *     avoid: []
 *   },
 *   additionalNotes: ''
 * }
 *
 * Response:
 * {
 *   success: true,
 *   exercises: [...],
 *   meta: { ... }
 * }
 */
router.post('/recommend', exerciseController.recommendExercises);

/**
 * GET /api/exercises
 * List all available exercises with optional filtering
 *
 * Query Parameters:
 * - level: 'beginner' | 'intermediate' | 'expert'
 * - equipment: 'body only' | 'dumbbell' | 'barbell' | ...
 * - muscle: target muscle name
 * - category: 'strength' | 'stretching' | 'cardio' | ...
 * - limit: number (default: 50)
 * - offset: number (default: 0)
 */
router.get('/', exerciseController.getAllExercises);

/**
 * GET /api/exercises/:nameOrId
 * Get a single exercise by name or ID
 */
router.get('/:nameOrId', exerciseController.getExerciseByName);

module.exports = router;

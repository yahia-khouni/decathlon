/**
 * Exercise Model
 * Represents a fitness exercise with all its properties and methods
 */

const fs = require('fs');
const path = require('path');
const { EXERCISE_IMAGE_BASE_URL } = require('../config/constants');

class Exercise {
  /**
   * Create an Exercise instance
   * @param {Object} data - Exercise data from JSON
   */
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.force = data.force || null; // 'push' | 'pull' | 'static' | null
    this.level = data.level || 'beginner'; // 'beginner' | 'intermediate' | 'expert'
    this.mechanic = data.mechanic || null; // 'compound' | 'isolation' | null
    this.equipment = data.equipment || 'body only';
    this.primaryMuscles = data.primaryMuscles || [];
    this.secondaryMuscles = data.secondaryMuscles || [];
    this.instructions = data.instructions || [];
    this.category = data.category || 'strength';
    this.images = data.images || [];
  }

  /**
   * Load all exercises from JSON file
   * @param {string} filePath - Path to exercises.json
   * @returns {Map<string, Exercise>} Map of exercises keyed by lowercase name
   */
  static loadAll(filePath) {
    const absolutePath = path.resolve(filePath);
    const rawData = fs.readFileSync(absolutePath, 'utf-8');
    const exercisesData = JSON.parse(rawData);

    const exercisesMap = new Map();

    for (const data of exercisesData) {
      const exercise = new Exercise(data);
      // Key by lowercase name for case-insensitive lookup
      exercisesMap.set(exercise.name.toLowerCase(), exercise);
    }

    return exercisesMap;
  }

  /**
   * Get list of exercise names for LLM prompt
   * @param {Map<string, Exercise>} exercisesMap - Map of exercises
   * @returns {string[]} Array of exercise names
   */
  static getNamesList(exercisesMap) {
    const names = [];
    for (const exercise of exercisesMap.values()) {
      names.push(exercise.name);
    }
    return names;
  }

  /**
   * Get exercises filtered by criteria
   * @param {Map<string, Exercise>} exercisesMap - Map of exercises
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.level] - Exercise level
   * @param {string} [filters.equipment] - Required equipment
   * @param {string[]} [filters.muscles] - Target muscles
   * @returns {Exercise[]} Filtered exercises
   */
  static filterExercises(exercisesMap, filters = {}) {
    const results = [];

    for (const exercise of exercisesMap.values()) {
      let matches = true;

      // Filter by level
      if (filters.level && exercise.level !== filters.level) {
        matches = false;
      }

      // Filter by equipment
      if (filters.equipment && exercise.equipment !== filters.equipment) {
        matches = false;
      }

      // Filter by muscles (check if any target muscle is in primary or secondary)
      if (filters.muscles && filters.muscles.length > 0) {
        const exerciseMuscles = [
          ...exercise.primaryMuscles,
          ...exercise.secondaryMuscles,
        ];
        const hasTargetMuscle = filters.muscles.some((muscle) =>
          exerciseMuscles.some(
            (em) => em.toLowerCase() === muscle.toLowerCase()
          )
        );
        if (!hasTargetMuscle) {
          matches = false;
        }
      }

      if (matches) {
        results.push(exercise);
      }
    }

    return results;
  }

  /**
   * Get full image URLs for this exercise
   * @returns {string[]} Array of full image URLs
   */
  getImageUrls() {
    return this.images.map((imagePath) => `${EXERCISE_IMAGE_BASE_URL}${imagePath}`);
  }

  /**
   * Serialize exercise for API response
   * @returns {Object} JSON-serializable object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      force: this.force,
      level: this.level,
      mechanic: this.mechanic,
      equipment: this.equipment,
      primaryMuscles: this.primaryMuscles,
      secondaryMuscles: this.secondaryMuscles,
      instructions: this.instructions,
      category: this.category,
      images: this.images,
      imageUrls: this.getImageUrls(),
    };
  }
}

module.exports = Exercise;

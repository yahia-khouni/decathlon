/**
 * UserProfile Model
 * Represents a user's fitness profile based on questionnaire answers
 */

class UserProfile {
  /**
   * Create a UserProfile instance
   * @param {Object} data - Questionnaire answers
   */
  constructor(data = {}) {
    // Fitness level: 'beginner' | 'intermediate' | 'expert'
    this.fitnessLevel = data.fitnessLevel || 'beginner';

    // User's fitness goals
    // e.g., ['build muscle', 'lose weight', 'improve flexibility', 'increase strength']
    this.goals = data.goals || [];

    // Target muscle groups
    // e.g., ['chest', 'back', 'legs', 'arms', 'shoulders', 'core']
    this.targetMuscles = data.targetMuscles || [];

    // Available equipment
    // e.g., ['body only', 'dumbbell', 'barbell', 'kettlebell', 'machine', 'cable']
    this.availableEquipment = data.availableEquipment || ['body only'];

    // Exercise preferences
    this.exercisePreferences = {
      // Preferred exercise categories: 'strength' | 'stretching' | 'cardio' | 'plyometrics'
      categories: data.exercisePreferences?.categories || ['strength'],
      // Preferred force type: 'push' | 'pull' | 'static' | null (any)
      forceType: data.exercisePreferences?.forceType || null,
      // Avoid certain exercises (e.g., high impact)
      avoid: data.exercisePreferences?.avoid || [],
    };

    // Additional context from questionnaire
    this.additionalNotes = data.additionalNotes || '';
  }

  /**
   * Create UserProfile from questionnaire answers
   * @param {Object} answers - Raw questionnaire answers
   * @returns {UserProfile} New UserProfile instance
   */
  static fromQuestionnaire(answers) {
    // Map pain areas to target muscles for exercise selection
    const painToMuscleMap = {
      'neck': ['neck', 'traps'],
      'shoulders': ['shoulders', 'traps'],
      'upper_back': ['middle back', 'lats', 'traps'],
      'lower_back': ['lower back', 'glutes'],
      'hips': ['glutes', 'abductors', 'adductors'],
      'knees': ['quadriceps', 'hamstrings', 'calves'],
    };

    // Convert pain areas to target muscles
    let targetMuscles = [];
    const painAreas = Array.isArray(answers.painAreas) ? answers.painAreas : 
                      (answers.painAreas && answers.painAreas !== 'no-pain' && answers.painAreas !== 'has-pain') ? [answers.painAreas] : [];
    
    painAreas.forEach(area => {
      if (painToMuscleMap[area]) {
        targetMuscles = [...targetMuscles, ...painToMuscleMap[area]];
      }
    });
    targetMuscles = [...new Set(targetMuscles)]; // Remove duplicates

    // Map goals to exercise categories
    const goalToCategoryMap = {
      'posture': ['stretching', 'strength'],
      'strength': ['strength', 'powerlifting'],
      'flexibility': ['stretching'],
      'rehabilitation': ['stretching', 'strength'],
    };

    const goals = Array.isArray(answers.goals) ? answers.goals : (answers.goals ? [answers.goals] : []);
    let categories = [];
    goals.forEach(goal => {
      if (goalToCategoryMap[goal]) {
        categories = [...categories, ...goalToCategoryMap[goal]];
      }
    });
    categories = [...new Set(categories)];
    if (categories.length === 0) categories = ['strength'];

    // Map equipment field
    const equipment = Array.isArray(answers.equipment) ? answers.equipment : 
                      (answers.equipment ? [answers.equipment] : ['body only']);

    return new UserProfile({
      fitnessLevel: answers.fitnessLevel || 'beginner',
      goals: goals,
      targetMuscles: targetMuscles,
      availableEquipment: equipment,
      exercisePreferences: {
        categories: categories,
        forceType: null,
        avoid: painAreas.length > 0 ? ['high impact'] : [],
      },
      additionalNotes: `Activity level: ${answers.activityLevel || 'moderate'}. Available time: ${answers.availableTime || '15-20'} minutes. ${painAreas.length > 0 ? `Pain areas: ${painAreas.join(', ')}.` : 'No pain reported.'}`,
    });
  }

  /**
   * Format profile as context string for LLM prompt
   * @returns {string} Formatted profile description
   */
  toPromptContext() {
    const parts = [];

    // Fitness level
    parts.push(`Fitness Level: ${this.fitnessLevel}`);

    // Goals
    if (this.goals.length > 0) {
      parts.push(`Goals: ${this.goals.join(', ')}`);
    }

    // Target muscles
    if (this.targetMuscles.length > 0) {
      parts.push(`Target Muscles: ${this.targetMuscles.join(', ')}`);
    }

    // Available equipment
    if (this.availableEquipment.length > 0) {
      parts.push(`Available Equipment: ${this.availableEquipment.join(', ')}`);
    }

    // Exercise preferences
    if (this.exercisePreferences.categories.length > 0) {
      parts.push(`Preferred Exercise Types: ${this.exercisePreferences.categories.join(', ')}`);
    }

    if (this.exercisePreferences.forceType) {
      parts.push(`Preferred Movement Type: ${this.exercisePreferences.forceType}`);
    }

    if (this.exercisePreferences.avoid.length > 0) {
      parts.push(`Exercises to Avoid: ${this.exercisePreferences.avoid.join(', ')}`);
    }

    // Additional notes
    if (this.additionalNotes) {
      parts.push(`Additional Notes: ${this.additionalNotes}`);
    }

    return parts.join('\n');
  }

  /**
   * Get filter criteria for exercise selection
   * @returns {Object} Filter object for Exercise.filterExercises()
   */
  toExerciseFilters() {
    return {
      level: this.fitnessLevel,
      equipment: this.availableEquipment.length > 0 ? this.availableEquipment : undefined,
      muscles: this.targetMuscles.length > 0 ? this.targetMuscles : undefined,
    };
  }

  /**
   * Serialize profile for API response
   * @returns {Object} JSON-serializable object
   */
  toJSON() {
    return {
      fitnessLevel: this.fitnessLevel,
      goals: this.goals,
      targetMuscles: this.targetMuscles,
      availableEquipment: this.availableEquipment,
      exercisePreferences: this.exercisePreferences,
      additionalNotes: this.additionalNotes,
    };
  }
}

module.exports = UserProfile;

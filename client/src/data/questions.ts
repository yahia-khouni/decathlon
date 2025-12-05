import type { Question } from '@/types';

// Dynamic branching questionnaire
// Each answer can determine the next question
export const questions: Question[] = [
  {
    id: 'welcome',
    text: 'Quel est votre objectif principal ?',
    subtext: 'Choisissez l\'objectif qui vous correspond le mieux',
    type: 'single',
    field: 'goals',
    options: [
      { id: 'posture', label: 'Améliorer ma posture', value: 'posture', icon: '🧘', nextQuestion: 'pain-check' },
      { id: 'strength', label: 'Renforcement musculaire', value: 'strength', icon: '💪', nextQuestion: 'pain-check' },
      { id: 'flexibility', label: 'Gagner en souplesse', value: 'flexibility', icon: '🤸', nextQuestion: 'pain-check' },
      { id: 'rehab', label: 'Récupération / Rééducation', value: 'rehabilitation', icon: '🏥', nextQuestion: 'pain-areas' },
    ],
  },
  {
    id: 'pain-check',
    text: 'Ressentez-vous des douleurs ou inconforts ?',
    subtext: 'Cela nous aidera à adapter les exercices',
    type: 'single',
    field: 'painAreas',
    options: [
      { id: 'yes-pain', label: 'Oui, j\'ai des douleurs', value: 'has-pain', icon: '😣', nextQuestion: 'pain-areas' },
      { id: 'no-pain', label: 'Non, aucune douleur', value: 'no-pain', icon: '😊', nextQuestion: 'fitness-level' },
    ],
  },
  {
    id: 'pain-areas',
    text: 'Quelles zones sont concernées ?',
    subtext: 'Sélectionnez toutes les zones douloureuses',
    type: 'multiple',
    field: 'painAreas',
    maxSelections: 4,
    options: [
      { id: 'neck', label: 'Nuque / Cervicales', value: 'neck', icon: '🦒', nextQuestion: 'fitness-level' },
      { id: 'shoulders', label: 'Épaules', value: 'shoulders', icon: '🤷', nextQuestion: 'fitness-level' },
      { id: 'upper-back', label: 'Haut du dos', value: 'upper_back', icon: '🔙', nextQuestion: 'fitness-level' },
      { id: 'lower-back', label: 'Bas du dos / Lombaires', value: 'lower_back', icon: '⬇️', nextQuestion: 'fitness-level' },
      { id: 'hips', label: 'Hanches', value: 'hips', icon: '🦴', nextQuestion: 'fitness-level' },
      { id: 'knees', label: 'Genoux', value: 'knees', icon: '🦵', nextQuestion: 'fitness-level' },
    ],
  },
  {
    id: 'fitness-level',
    text: 'Quel est votre niveau de forme physique ?',
    subtext: 'Soyez honnête, cela nous aide à personnaliser',
    type: 'single',
    field: 'fitnessLevel',
    options: [
      { id: 'beginner', label: 'Débutant', value: 'beginner', icon: '🌱', nextQuestion: 'activity-level' },
      { id: 'intermediate', label: 'Intermédiaire', value: 'intermediate', icon: '🌿', nextQuestion: 'activity-level' },
      { id: 'advanced', label: 'Avancé', value: 'advanced', icon: '🌳', nextQuestion: 'activity-level' },
    ],
  },
  {
    id: 'activity-level',
    text: 'À quelle fréquence faites-vous du sport ?',
    subtext: 'En moyenne par semaine',
    type: 'single',
    field: 'activityLevel',
    options: [
      { id: 'sedentary', label: 'Rarement / Jamais', value: 'sedentary', icon: '🛋️', nextQuestion: 'available-time' },
      { id: 'light', label: '1-2 fois par semaine', value: 'light', icon: '🚶', nextQuestion: 'available-time' },
      { id: 'moderate', label: '3-4 fois par semaine', value: 'moderate', icon: '🏃', nextQuestion: 'available-time' },
      { id: 'active', label: '5+ fois par semaine', value: 'active', icon: '🏋️', nextQuestion: 'available-time' },
    ],
  },
  {
    id: 'available-time',
    text: 'Combien de temps pouvez-vous consacrer ?',
    subtext: 'Par séance d\'exercices',
    type: 'single',
    field: 'availableTime',
    options: [
      { id: 'short', label: '5-10 minutes', value: '5-10', icon: '⏱️', nextQuestion: 'equipment' },
      { id: 'medium', label: '15-20 minutes', value: '15-20', icon: '⏲️', nextQuestion: 'equipment' },
      { id: 'long', label: '30+ minutes', value: '30+', icon: '🕐', nextQuestion: 'equipment' },
    ],
  },
  {
    id: 'equipment',
    text: 'Quel équipement avez-vous ?',
    subtext: 'Sélectionnez tout ce qui est disponible',
    type: 'multiple',
    field: 'equipment',
    maxSelections: 6,
    options: [
      { id: 'none', label: 'Aucun (poids du corps)', value: 'body_only', icon: '🙆' },
      { id: 'mat', label: 'Tapis de yoga', value: 'mat', icon: '🧘' },
      { id: 'bands', label: 'Bandes élastiques', value: 'bands', icon: '➰' },
      { id: 'dumbbells', label: 'Haltères', value: 'dumbbell', icon: '🏋️' },
      { id: 'ball', label: 'Ballon de gym', value: 'exercise_ball', icon: '⚽' },
      { id: 'foam-roller', label: 'Rouleau de massage', value: 'foam_roll', icon: '🧻' },
    ],
  },
];

// Helper to get next question based on answer
export function getNextQuestion(currentQuestionId: string, selectedOptionId: string): string | null {
  const currentQuestion = questions.find(q => q.id === currentQuestionId);
  if (!currentQuestion) return null;

  const selectedOption = currentQuestion.options.find(o => o.id === selectedOptionId);
  if (!selectedOption) return null;

  // If there's a specific next question defined, use it
  if (selectedOption.nextQuestion) {
    return selectedOption.nextQuestion;
  }

  // Otherwise, get the default next question (by index)
  const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
  if (currentIndex < questions.length - 1) {
    return questions[currentIndex + 1].id;
  }

  return null; // No more questions
}

// Get question by ID
export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

// Get first question
export function getFirstQuestion(): Question {
  return questions[0];
}

// Types for the application

export interface UserProfile {
  age: string;
  fitnessLevel: string;
  goals: string[];
  painAreas: string[];
  availableTime: string;
  equipment: string[];
  activityLevel: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  nextQuestion?: string; // For dynamic branching
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  field: keyof UserProfile;
  maxSelections?: number;
}

export interface Exercise {
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  imageUrls: string[];
}

export interface Product {
  label: string;
  brand: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  url: string;
  image: string;
}

export interface ExerciseRecommendation {
  exercises: Exercise[];
  reasoning?: string;
}

export interface ProductRecommendation {
  products: Product[];
  reasoning?: string;
}

export type Section = 'landing' | 'questionnaire' | 'exercises' | 'products';

export interface AppState {
  currentSection: Section;
  userProfile: Partial<UserProfile>;
  recommendedExercises: Exercise[];
  recommendedProducts: Product[];
  isLoading: boolean;
  error: string | null;
}

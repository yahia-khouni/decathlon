import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LandingSection,
  QuestionnaireSection,
  ExercisesSection,
  ProductsSection,
} from '@/components/sections';
import { getRecommendedExercises, getRecommendedProducts } from '@/services/api';
import type { Section, Exercise, Product, UserProfile } from '@/types';

function App() {
  // App state
  const [currentSection, setCurrentSection] = useState<Section>('landing');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Loading and error states
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Handle starting the questionnaire
  const handleStart = useCallback(() => {
    setCurrentSection('questionnaire');
  }, []);

  // Handle questionnaire completion
  const handleQuestionnaireComplete = useCallback(async (profile: Partial<UserProfile>) => {
    setUserProfile(profile);
    setCurrentSection('exercises');
    setIsLoadingExercises(true);
    setExercisesError(null);

    try {
      const result = await getRecommendedExercises(profile);
      setExercises(result.exercises);
    } catch (error) {
      console.error('Failed to get exercises:', error);
      setExercisesError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoadingExercises(false);
    }
  }, []);

  // Handle continuing to products
  const handleContinueToProducts = useCallback(async () => {
    // Set loading state BEFORE changing section to avoid blank flash
    setIsLoadingProducts(true);
    setProductsError(null);
    setCurrentSection('products');

    try {
      const exerciseNames = exercises.map(e => e.name);
      const result = await getRecommendedProducts(exerciseNames);
      setProducts(result.products);
    } catch (error) {
      console.error('Failed to get products:', error);
      setProductsError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [exercises]);

  // Handle going back to landing
  const handleBackToLanding = useCallback(() => {
    setCurrentSection('landing');
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    setCurrentSection('landing');
    setUserProfile({});
    setExercises([]);
    setProducts([]);
    setExercisesError(null);
    setProductsError(null);
  }, []);

  // Retry fetching exercises
  const handleRetryExercises = useCallback(async () => {
    setIsLoadingExercises(true);
    setExercisesError(null);

    try {
      const result = await getRecommendedExercises(userProfile);
      setExercises(result.exercises);
    } catch (error) {
      console.error('Failed to get exercises:', error);
      setExercisesError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoadingExercises(false);
    }
  }, [userProfile]);

  // Retry fetching products
  const handleRetryProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError(null);

    try {
      const exerciseNames = exercises.map(e => e.name);
      const result = await getRecommendedProducts(exerciseNames);
      setProducts(result.products);
    } catch (error) {
      console.error('Failed to get products:', error);
      setProductsError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [exercises]);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentSection === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingSection onStart={handleStart} />
          </motion.div>
        )}

        {currentSection === 'questionnaire' && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionnaireSection
              onComplete={handleQuestionnaireComplete}
              onBack={handleBackToLanding}
            />
          </motion.div>
        )}

        {currentSection === 'exercises' && (
          <motion.div
            key="exercises"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExercisesSection
              exercises={exercises}
              isLoading={isLoadingExercises}
              error={exercisesError}
              onContinue={handleContinueToProducts}
              onRetry={handleRetryExercises}
            />
          </motion.div>
        )}

        {currentSection === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductsSection
              products={products}
              isLoading={isLoadingProducts}
              error={productsError}
              onRestart={handleRestart}
              onRetry={handleRetryProducts}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;


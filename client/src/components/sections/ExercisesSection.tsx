import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingCard } from '@/components/ui';
import type { Exercise } from '@/types';
import { ChevronLeft, ChevronRight, Dumbbell, Target, Layers, ArrowRight } from 'lucide-react';
import DecathlonLogo from '@/assets/Decathlon.png';

interface ExercisesSectionProps {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  onContinue: () => void;
  onRetry: () => void;
}

export function ExercisesSection({ 
  exercises, 
  isLoading, 
  error, 
  onContinue,
  onRetry 
}: ExercisesSectionProps) {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  if (isLoading) {
    return (
      <LoadingCard 
        message="L'IA analyse votre profil..."
        submessage="Nous sélectionnons les meilleurs exercices adaptés à vos besoins et objectifs."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Top White Bar */}
        <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
          <div className="container mx-auto flex items-center">
            <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
          </div>
        </div>
        
        {/* Main Section */}
        <div 
          className="flex-1 flex items-center justify-center px-4"
          style={{ background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)" }}
        >
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="text-5xl mb-4">😕</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>
              Une erreur est survenue
            </h3>
            <p className="mb-6" style={{ color: '#6b7280' }}>{error}</p>
            <button
              onClick={onRetry}
              style={{
                background: '#ffeb00',
                color: '#1a1a2e',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>

        {/* Bottom White Bar */}
        <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
          <span className="text-sm text-gray-500">
            Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
          </span>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
          <div className="container mx-auto flex items-center">
            <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
          </div>
        </div>
        <div 
          className="flex-1 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)" }}
        >
          <p className="text-white text-xl">Aucun exercice trouvé.</p>
        </div>
        <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
          <span className="text-sm text-gray-500">
            Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
          </span>
        </div>
      </div>
    );
  }

  const activeExercise = exercises[activeExerciseIndex];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Exercise Counter - Fixed Top Right Corner */}
      <div 
        style={{ 
          position: 'fixed',
          top: '25px',
          right: '40px',
          zIndex: 50,
          background: 'linear-gradient(135deg, #0082c3 0%, #004f7c 100%)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ color: '#ffeb00', fontWeight: '700', fontSize: '14px' }}>
          {activeExerciseIndex + 1}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500' }}>
          sur
        </span>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
          {exercises.length}
        </span>
      </div>

      {/* Top White Bar with Decathlon Logo */}
      <div className="bg-white h-20 px-8 shadow-md flex items-center" style={{ flexShrink: 0 }}>
        <div className="container mx-auto flex items-center">
          <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
        </div>
      </div>

      {/* Main Section with Blue Gradient */}
      <section
        id="exercises"
        className="flex-1 relative overflow-auto"
        style={{
          background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
        }}
      >
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '28px' }}
          >
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '50px',
                marginBottom: '14px',
                background: 'rgba(255, 235, 0, 0.2)',
                border: '1px solid rgba(255, 235, 0, 0.3)'
              }}
            >
              <Dumbbell className="w-4 h-4" style={{ color: '#ffeb00' }} />
              <span className="font-medium" style={{ color: '#ffeb00' }}>Exercices recommandés</span>
            </div>
            <h2 
              style={{ 
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '11px',
                color: 'white', 
                textShadow: '0 2px 10px rgba(0,0,0,0.2)' 
              }}
            >
              Vos 3 exercices personnalisés
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>
              Basé sur votre profil, notre IA a sélectionné ces exercices pour améliorer votre posture.
            </p>
          </motion.div>

          {/* Exercise Navigation Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '35px' }}>
            {exercises.map((exercise, index) => (
              <button
                key={exercise.name}
                onClick={() => setActiveExerciseIndex(index)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: index === activeExerciseIndex 
                    ? '#ffeb00' 
                    : 'rgba(255,255,255,0.15)',
                  color: index === activeExerciseIndex 
                    ? '#1a1a2e' 
                    : 'rgba(255,255,255,0.8)',
                  boxShadow: index === activeExerciseIndex 
                    ? '0 4px 15px rgba(255, 235, 0, 0.4)' 
                    : 'none',
                }}
              >
                Exercice {index + 1}
              </button>
            ))}
          </div>

          {/* Exercise Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExercise.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ExerciseCard exercise={activeExercise} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '17px', marginTop: '35px' }}>
            <button
              onClick={() => setActiveExerciseIndex(prev => Math.max(0, prev - 1))}
              disabled={activeExerciseIndex === 0}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                cursor: activeExerciseIndex === 0 ? 'not-allowed' : 'pointer',
                background: activeExerciseIndex === 0 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(255,255,255,0.2)',
                color: activeExerciseIndex === 0 
                  ? 'rgba(255,255,255,0.3)' 
                  : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-2">
              {exercises.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === activeExerciseIndex ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    background: index === activeExerciseIndex ? '#ffeb00' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
            
            <button
              onClick={() => setActiveExerciseIndex(prev => Math.min(exercises.length - 1, prev + 1))}
              disabled={activeExerciseIndex === exercises.length - 1}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                cursor: activeExerciseIndex === exercises.length - 1 ? 'not-allowed' : 'pointer',
                background: activeExerciseIndex === exercises.length - 1 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(255,255,255,0.2)',
                color: activeExerciseIndex === exercises.length - 1 
                  ? 'rgba(255,255,255,0.3)' 
                  : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ textAlign: 'center', marginTop: '35px' }}
          >
            <button
              onClick={onContinue}
              style={{
                background: '#ffeb00',
                color: '#1a1a2e',
                fontWeight: '700',
                fontSize: '16px',
                padding: '16px 40px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(255, 235, 0, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              Voir les équipements recommandés
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bottom White Bar */}
      <div className="bg-white h-16 px-8 flex items-center justify-center" style={{ flexShrink: 0 }}>
        <span className="text-sm text-gray-500">
          Made by <span className="font-semibold" style={{ color: '#0082c3' }}>Cods</span>
        </span>
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
}

function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'row',
        maxHeight: '420px',
      }}
    >
      {/* Image Gallery - Left Side */}
      <div 
        style={{ 
          width: '45%',
          minWidth: '300px',
          background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={exercise.imageUrls[currentImageIndex] || '/placeholder-exercise.png'}
            alt={exercise.name}
            style={{
              maxWidth: '90%',
              maxHeight: '380px',
              objectFit: 'contain',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Exercise';
            }}
          />
        </AnimatePresence>
        
        {/* Image Navigation Dots */}
        {exercise.imageUrls.length > 1 && (
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {exercise.imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: index === currentImageIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: index === currentImageIndex ? '#0082c3' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Exercise Details - Right Side */}
      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {/* Title */}
        <h3 
          style={{ 
            fontSize: '22px',
            fontWeight: '700',
            color: '#1a1a2e',
            marginBottom: '8px',
            textTransform: 'capitalize',
          }}
        >
          {exercise.name.replace(/_/g, ' ')}
        </h3>

        {/* Tags - Inline */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <Tag icon={<Target className="w-3 h-3" />} label={exercise.level} variant="blue" />
          {exercise.equipment && (
            <Tag icon={<Dumbbell className="w-3 h-3" />} label={exercise.equipment} variant="orange" />
          )}
          <Tag icon={<Layers className="w-3 h-3" />} label={exercise.category} variant="green" />
        </div>

        {/* Muscles Section */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Muscles ciblés
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {exercise.primaryMuscles.map(muscle => (
              <span
                key={muscle}
                style={{
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: 'rgba(0, 130, 195, 0.1)',
                  color: '#0082c3',
                }}
              >
                {muscle}
              </span>
            ))}
            {exercise.secondaryMuscles.map(muscle => (
              <span
                key={muscle}
                style={{
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '12px',
                  background: '#f3f4f6',
                  color: '#9ca3af',
                }}
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            Instructions
          </h4>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exercise.instructions.slice(0, 3).map((instruction, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}
              >
                <span 
                  style={{
                    flexShrink: 0,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0082c3 0%, #004f7c 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                >
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </motion.li>
            ))}
            {exercise.instructions.length > 3 && (
              <li style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', paddingLeft: '32px' }}>
                + {exercise.instructions.length - 3} autres étapes...
              </li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

interface TagProps {
  icon: React.ReactNode;
  label: string;
  variant: 'blue' | 'orange' | 'green';
}

function Tag({ icon, label, variant }: TagProps) {
  const variantStyles = {
    blue: { background: 'rgba(0, 130, 195, 0.1)', color: '#0082c3' },
    orange: { background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' },
    green: { background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' },
  };

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize"
      style={variantStyles[variant]}
    >
      {icon}
      {label}
    </span>
  );
}

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions, getQuestionById, getFirstQuestion, getNextQuestion } from '@/data/questions';
import type { UserProfile } from '@/types';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import DecathlonLogo from '@/assets/Decathlon.png';

interface QuestionnaireSectionProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  onBack: () => void;
}

export function QuestionnaireSection({ onComplete, onBack }: QuestionnaireSectionProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState(getFirstQuestion().id);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const currentQuestion = getQuestionById(currentQuestionId);
  const totalQuestions = questions.length;
  const answeredCount = questionHistory.length;
  const progress = ((answeredCount) / totalQuestions) * 100;

  const handleOptionSelect = useCallback((optionId: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      // Multiple selection
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        // Check max selections
        if (currentQuestion.maxSelections && prev.length >= currentQuestion.maxSelections) {
          return prev;
        }
        return [...prev, optionId];
      });
    }
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (!currentQuestion || selectedOptions.length === 0) return;

    // Get selected values
    const selectedValues = selectedOptions.map(id => 
      currentQuestion.options.find(o => o.id === id)?.value
    ).filter(Boolean) as string[];

    // Update answers
    const newAnswers = {
      ...answers,
      [currentQuestion.field]: currentQuestion.type === 'single' ? selectedValues[0] : selectedValues,
    };
    setAnswers(newAnswers);

    // Get next question
    const nextQuestionId = getNextQuestion(currentQuestionId, selectedOptions[0]);

    if (nextQuestionId) {
      setDirection('forward');
      setQuestionHistory(prev => [...prev, currentQuestionId]);
      setCurrentQuestionId(nextQuestionId);
      setSelectedOptions([]);
    } else {
      // Questionnaire complete
      onComplete(newAnswers);
    }
  }, [currentQuestion, currentQuestionId, selectedOptions, answers, onComplete]);

  const handlePrevious = useCallback(() => {
    if (questionHistory.length === 0) {
      onBack();
      return;
    }

    setDirection('backward');
    const previousQuestionId = questionHistory[questionHistory.length - 1];
    setQuestionHistory(prev => prev.slice(0, -1));
    setCurrentQuestionId(previousQuestionId);
    setSelectedOptions([]);
  }, [questionHistory, onBack]);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Question Counter - Fixed Top Right Corner */}
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
        <span style={{ 
          color: '#ffeb00', 
          fontWeight: '700', 
          fontSize: '14px' 
        }}>
          {answeredCount + 1}
        </span>
        <span style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '13px',
          fontWeight: '500'
        }}>
          sur
        </span>
        <span style={{ 
          color: 'white', 
          fontWeight: '600', 
          fontSize: '14px' 
        }}>
          {totalQuestions}
        </span>
      </div>

      {/* Top White Bar with Decathlon Logo */}
      <div className="bg-white h-20 px-8 shadow-md flex items-center">
        <div className="container mx-auto flex items-center">
          <img src={DecathlonLogo} alt="Decathlon" style={{ height: '40px', marginLeft: '40px' }} />
        </div>
      </div>

      {/* Main Section with Blue Gradient */}
      <section
        id="questionnaire"
        className="flex-1 relative"
        style={{
          background: "linear-gradient(135deg, #0082c3 0%, #004f7c 50%, #003a5d 100%)",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
            }}
          />
          <div
            className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
            }}
          />
        </div>

        {/* Back Button - Absolute Top Left */}
        <button
          onClick={handlePrevious}
          className="absolute top-4 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-all duration-200 text-sm font-medium px-3 py-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {/* Progress Dots - Absolute Top Center */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === answeredCount ? '28px' : '10px',
                backgroundColor: i < answeredCount ? '#ffeb00' : i === answeredCount ? '#ffeb00' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>

        {/* CENTERED CONTENT */}
        <div 
          className="relative z-10"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '620px',
            padding: '0 24px',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentQuestionId}
              initial={{ 
                opacity: 0, 
                x: direction === 'forward' ? 100 : -100 
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: direction === 'forward' ? -100 : 100 
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Question Text */}
              <div className="text-center" style={{ marginBottom: '32px' }}>
                <h2 className="font-black text-white" style={{ fontSize: '28px', lineHeight: 1.3, marginBottom: '8px' }}>
                  {currentQuestion.text}
                </h2>
                {currentQuestion.subtext && (
                  <p className="text-white/60" style={{ fontSize: '15px' }}>
                    {currentQuestion.subtext}
                  </p>
                )}
                {currentQuestion.type === 'multiple' && (
                  <p className="text-[#ffeb00] font-medium" style={{ fontSize: '14px', marginTop: '8px' }}>
                    Sélectionnez jusqu'à {currentQuestion.maxSelections || 'plusieurs'} options
                  </p>
                )}
              </div>

              {/* Options Grid */}
              <div 
                className="grid md:grid-cols-2"
                style={{ gap: '12px', marginBottom: '40px' }}
              >
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <OptionCard
                      option={option}
                      isSelected={selectedOptions.includes(option.id)}
                      onClick={() => handleOptionSelect(option.id)}
                      type={currentQuestion.type}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Continue Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={handleNext}
                  disabled={selectedOptions.length === 0}
                  className="group"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    fontSize: '16px',
                    background: 'linear-gradient(135deg, #ffeb00 0%, #ffd700 100%)',
                    color: '#0082c3',
                    padding: '16px 44px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: selectedOptions.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: selectedOptions.length === 0 ? 0.4 : 1,
                    boxShadow: selectedOptions.length > 0 ? '0 8px 30px rgba(255,235,0,0.4)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {questionHistory.length === questions.length - 1 ? 'Voir mes recommandations' : 'Continuer'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Bottom White Bar */}
      <div className="bg-white h-16 px-8 border-t border-gray-200 flex items-center justify-center">
        <p className="text-sm text-gray-600 font-medium">
          Made by <span className="font-bold text-[#0082c3]">Cods</span>
        </p>
      </div>
    </div>
  );
}

interface OptionCardProps {
  option: {
    id: string;
    label: string;
    value: string;
    icon?: string;
  };
  isSelected: boolean;
  onClick: () => void;
  type: 'single' | 'multiple';
}

function OptionCard({ option, isSelected, onClick, type }: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left transition-all duration-200"
      style={{
        background: isSelected 
          ? 'linear-gradient(135deg, rgba(255,235,0,0.95) 0%, rgba(255,215,0,0.95) 100%)'
          : 'rgba(255,255,255,0.9)',
        borderRadius: '16px',
        padding: '20px 24px',
        border: isSelected ? '2px solid #ffeb00' : '2px solid transparent',
        boxShadow: isSelected 
          ? '0 8px 32px rgba(255,235,0,0.3)' 
          : '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        {option.icon && (
          <div 
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{ 
              fontSize: '28px',
              width: '52px',
              height: '52px',
              background: isSelected 
                ? 'rgba(0,130,195,0.15)' 
                : 'linear-gradient(135deg, #0082c3 0%, #004f7c 100%)',
            }}
          >
            <span style={{ filter: isSelected ? 'none' : 'grayscale(0)' }}>
              {option.icon}
            </span>
          </div>
        )}

        {/* Label */}
        <span 
          className="flex-1 font-semibold"
          style={{ 
            fontSize: '16px',
            color: isSelected ? '#0082c3' : '#1a1a2e',
          }}
        >
          {option.label}
        </span>

        {/* Selection Indicator */}
        <div 
          className="flex-shrink-0 flex items-center justify-center transition-all"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: type === 'multiple' ? '8px' : '50%',
            border: isSelected ? 'none' : '2px solid #d1d5db',
            background: isSelected 
              ? 'linear-gradient(135deg, #0082c3 0%, #004f7c 100%)'
              : 'transparent',
          }}
        >
          {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
      </div>
    </motion.button>
  );
}

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Section IDs
export const SECTIONS = {
  LANDING: 'landing',
  QUESTIONNAIRE: 'questionnaire',
  EXERCISES: 'exercises',
  PRODUCTS: 'products',
} as const;

// Animation Durations (in seconds)
export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  EXTRA_SLOW: 0.8,
} as const;

// Decathlon Colors (for JS usage)
export const COLORS = {
  blue: '#0082C3',
  blueDark: '#006699',
  blueLight: '#E5F4FA',
  orange: '#FF6B35',
  green: '#00875A',
  yellow: '#FFB800',
  dark: '#1A1A1A',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  white: '#FFFFFF',
} as const;

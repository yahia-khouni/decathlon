import { API_BASE_URL } from '@/lib/constants';
import type { Exercise, Product, UserProfile } from '@/types';

// Generic fetch wrapper with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Health check
export async function checkHealth(): Promise<{ status: string; exercisesLoaded: number; productsLoaded: number }> {
  return fetchApi('/health');
}

// Get all exercises (with optional limit)
export async function getAllExercises(limit?: number): Promise<Exercise[]> {
  const query = limit ? `?limit=${limit}` : '';
  return fetchApi(`/exercises${query}`);
}

// Get exercise by name
export async function getExerciseByName(name: string): Promise<Exercise> {
  return fetchApi(`/exercises/${encodeURIComponent(name)}`);
}

// Get recommended exercises based on user profile
export async function getRecommendedExercises(userProfile: Partial<UserProfile>): Promise<{
  exercises: Exercise[];
  selectedNames: string[];
  reasoning?: string;
}> {
  return fetchApi('/exercises/recommend', {
    method: 'POST',
    body: JSON.stringify({ questionnaire: userProfile }),
  });
}

// Get all products (with optional limit)
export async function getAllProducts(limit?: number): Promise<Product[]> {
  const query = limit ? `?limit=${limit}` : '';
  return fetchApi(`/products${query}`);
}

// Get product by label
export async function getProductByLabel(label: string): Promise<Product> {
  return fetchApi(`/products/${encodeURIComponent(label)}`);
}

// Get recommended products based on exercises
export async function getRecommendedProducts(exerciseNames: string[]): Promise<{
  products: Product[];
  selectedLabels: string[];
  reasoning?: string;
}> {
  return fetchApi('/products/recommend', {
    method: 'POST',
    body: JSON.stringify({ exerciseNames }),
  });
}

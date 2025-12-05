/**
 * LLMService
 * Service for interacting with OpenRouter API (Deepseek R1)
 * Handles exercise selection and product recommendations via LLM
 */

const config = require('../config');
const constants = require('../config/constants');

/**
 * Custom error classes for LLM operations
 */
class LLMError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'LLMError';
    this.code = code;
    this.details = details;
  }
}

class LLMTimeoutError extends LLMError {
  constructor(message = 'LLM request timed out') {
    super(message, 'LLM_TIMEOUT');
    this.name = 'LLMTimeoutError';
  }
}

class LLMRateLimitError extends LLMError {
  constructor(message = 'LLM rate limit exceeded') {
    super(message, 'LLM_RATE_LIMIT');
    this.name = 'LLMRateLimitError';
  }
}

class LLMInvalidResponseError extends LLMError {
  constructor(message = 'Invalid response from LLM', details = null) {
    super(message, 'LLM_INVALID_RESPONSE', details);
    this.name = 'LLMInvalidResponseError';
  }
}

class LLMService {
  constructor() {
    this.apiKey = config.openRouter.apiKey;
    this.baseUrl = config.openRouter.baseUrl;
    this.model = config.llm.model;
  }

  /**
   * Sleep helper for retry delays
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Call OpenRouter API with retry logic
   * @param {Array} messages - Chat messages array
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Parsed JSON response from LLM
   * @private
   */
  async _callOpenRouter(messages, options = {}) {
    const maxRetries = constants.LLM_MAX_RETRIES;
    const baseDelay = constants.LLM_RETRY_DELAY_MS;

    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://decathlon-posture-coach.local',
            'X-Title': 'Decathlon Posture Coach',
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: options.temperature || constants.LLM_TEMPERATURE,
            max_tokens: options.maxTokens || constants.LLM_MAX_TOKENS,
            response_format: { type: 'json_object' },
            ...options.additionalParams,
          }),
        });

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : baseDelay * Math.pow(2, attempt);

          console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);

          if (attempt === maxRetries - 1) {
            throw new LLMRateLimitError();
          }

          await this._sleep(delay);
          continue;
        }

        // Handle other HTTP errors
        if (!response.ok) {
          const errorBody = await response.text();
          throw new LLMError(
            `HTTP ${response.status}: ${response.statusText}`,
            'LLM_HTTP_ERROR',
            errorBody
          );
        }

        // Parse response
        const data = await response.json();

        // Extract content from response
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new LLMInvalidResponseError('Missing choices in response', data);
        }

        const content = data.choices[0].message.content;

        // Parse JSON content - handle various LLM response formats
        try {
          // First, try direct JSON parse
          let parsed = JSON.parse(content);
          
          // Unwrap if response is nested in arrays
          while (Array.isArray(parsed) && parsed.length > 0) {
            parsed = parsed[0];
          }
          
          return parsed;
        } catch (parseError) {
          // Try to extract JSON from markdown code blocks or extra text
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            try {
              let parsed = JSON.parse(jsonMatch[1].trim());
              while (Array.isArray(parsed) && parsed.length > 0) {
                parsed = parsed[0];
              }
              return parsed;
            } catch (e) {
              // Continue to other extraction methods
            }
          }

          // Try to find JSON object in the content
          const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch) {
            try {
              let parsed = JSON.parse(jsonObjectMatch[0]);
              while (Array.isArray(parsed) && parsed.length > 0) {
                parsed = parsed[0];
              }
              return parsed;
            } catch (e) {
              // Continue to error
            }
          }

          // Try to find JSON after </think> tag (for reasoning models)
          const thinkMatch = content.match(/<\/think>\s*([\s\S]*)/);
          if (thinkMatch) {
            const afterThink = thinkMatch[1].trim();
            const jsonInThink = afterThink.match(/\{[\s\S]*\}/);
            if (jsonInThink) {
              try {
                let parsed = JSON.parse(jsonInThink[0]);
                while (Array.isArray(parsed) && parsed.length > 0) {
                  parsed = parsed[0];
                }
                return parsed;
              } catch (e) {
                // Continue to error
              }
            }
          }

          throw new LLMInvalidResponseError(
            'Failed to parse JSON from LLM response',
            { content, parseError: parseError.message }
          );
        }
      } catch (error) {
        lastError = error;

        // Don't retry on invalid response errors
        if (error instanceof LLMInvalidResponseError) {
          throw error;
        }

        // Check for timeout
        if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
          if (attempt === maxRetries - 1) {
            throw new LLMTimeoutError();
          }
        }

        // Exponential backoff for other errors
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`LLM request failed. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries}):`, error.message);
          await this._sleep(delay);
        }
      }
    }

    // All retries exhausted
    throw lastError || new LLMError('All retry attempts failed', 'LLM_RETRY_EXHAUSTED');
  }

  /**
   * Select exercises based on user profile
   * @param {UserProfile} userProfile - User's fitness profile
   * @param {string[]} exerciseNames - Available exercise names
   * @returns {Promise<string[]>} Array of selected exercise names
   */
  async selectExercises(userProfile, exerciseNames) {
    const systemPrompt = `You are a professional fitness coach specializing in posture correction and rehabilitation. Your task is to select exactly ${constants.MAX_EXERCISES} exercises from a provided list that SPECIFICALLY match the user's fitness profile, goals, and needs.

CRITICAL RULES:
1. You MUST select exactly ${constants.MAX_EXERCISES} exercises
2. You MUST only select exercises from the provided list (copy names EXACTLY)
3. PRIORITIZE exercises based on the user's specific goals and pain areas
4. Match exercises to the user's fitness level (beginner = easy exercises, advanced = challenging)
5. Only suggest exercises that work with the user's available equipment
6. If user has pain areas, select exercises that help strengthen/stretch those areas safely
7. Provide DIFFERENT exercises each time based on the unique user profile
8. Respond ONLY with valid JSON, no markdown, no extra text

Response format (JSON only):
{
  "selected_exercises": ["Exercise Name 1", "Exercise Name 2", "Exercise Name 3"],
  "reasoning": "Brief explanation of why these specific exercises were chosen for THIS user"
}`;

    const userPrompt = `USER PROFILE (use this to personalize your selection):
${userProfile.toPromptContext()}

AVAILABLE EXERCISES (select exactly ${constants.MAX_EXERCISES} that best match the above profile):
${exerciseNames.join('\n')}

Based on THIS SPECIFIC USER'S profile above, select the ${constants.MAX_EXERCISES} most appropriate exercises. Your selection must reflect their goals, fitness level, equipment, and any pain areas mentioned.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this._callOpenRouter(messages);

    // Validate response structure
    if (!response.selected_exercises || !Array.isArray(response.selected_exercises)) {
      throw new LLMInvalidResponseError(
        'Response missing selected_exercises array',
        response
      );
    }

    // Ensure we have the right number of exercises
    const selectedNames = response.selected_exercises.slice(0, constants.MAX_EXERCISES);

    if (selectedNames.length < constants.MAX_EXERCISES) {
      console.warn(`LLM returned only ${selectedNames.length} exercises, expected ${constants.MAX_EXERCISES}`);
    }

    return selectedNames;
  }

  /**
   * Select products based on selected exercises
   * @param {Exercise[]} selectedExercises - Array of selected exercises
   * @param {string[]} productLabels - Available product labels
   * @returns {Promise<string[]>} Array of selected product labels
   */
  async selectProducts(selectedExercises, productLabels) {
    // Build exercise context for the prompt
    const exerciseContext = selectedExercises.map((ex) => ({
      name: ex.name,
      equipment: ex.equipment,
      category: ex.category,
      primaryMuscles: ex.primaryMuscles,
    }));

    const systemPrompt = `You are a sports equipment specialist at Decathlon. Your task is to recommend exactly ${constants.MAX_PRODUCTS} products that would help a user perform their selected exercises better.

IMPORTANT RULES:
1. You MUST select exactly ${constants.MAX_PRODUCTS} products
2. You MUST only select products from the provided list
3. Return the EXACT product labels as they appear in the list
4. Consider the exercise equipment needs, safety, and performance enhancement
5. Recommend products that are relevant to the exercises (e.g., dumbbells for dumbbell exercises, mats for floor exercises)
6. Respond ONLY with valid JSON, no other text

Response format:
{
  "selected_products": ["Product Label 1", "Product Label 2", "Product Label 3"],
  "reasoning": "Brief explanation of why these products were recommended"
}`;

    const userPrompt = `Selected Exercises:
${JSON.stringify(exerciseContext, null, 2)}

Available Products (select exactly ${constants.MAX_PRODUCTS} from this list):
${productLabels.join('\n')}

Recommend the ${constants.MAX_PRODUCTS} best products for these exercises.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this._callOpenRouter(messages);

    // Validate response structure
    if (!response.selected_products || !Array.isArray(response.selected_products)) {
      throw new LLMInvalidResponseError(
        'Response missing selected_products array',
        response
      );
    }

    // Ensure we have the right number of products
    const selectedLabels = response.selected_products.slice(0, constants.MAX_PRODUCTS);

    if (selectedLabels.length < constants.MAX_PRODUCTS) {
      console.warn(`LLM returned only ${selectedLabels.length} products, expected ${constants.MAX_PRODUCTS}`);
    }

    return selectedLabels;
  }
}

// Export singleton instance and error classes
const llmService = new LLMService();

module.exports = {
  llmService,
  LLMError,
  LLMTimeoutError,
  LLMRateLimitError,
  LLMInvalidResponseError,
};

/**
 * Configuration module
 * Loads and exports environment variables for the application
 */

require('dotenv').config();

const config = {
  // OpenRouter API Configuration
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  // LLM Model Configuration
  llm: {
    model: process.env.LLM_MODEL || 'deepseek/deepseek-r1',
  },
};

// Validate required environment variables
const requiredEnvVars = ['OPENROUTER_API_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in environment variables`);
  }
}

module.exports = config;

# 🏃‍♂️ Decathlon Posture Coach

<div align="center">

![Decathlon](https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Decathlon_Logo.png/320px-Decathlon_Logo.png)

**An AI-powered posture coaching application that delivers personalized exercise recommendations and Decathlon product suggestions.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Multichoice Decision Tree](#-multichoice-decision-tree)
- [AI Pipeline](#-ai-pipeline)
- [Datasets](#-datasets)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🎯 Overview

Decathlon Posture Coach is a full-stack web application designed to help users improve their posture and physical fitness. Users complete an intelligent questionnaire about their fitness profile, goals, and pain areas. The application then leverages AI to analyze their responses and recommend:

- **3 personalized exercises** from a database of 873+ exercises
- **3 Decathlon products** tailored to support their fitness journey

---

## ✨ Features

- 🌳 **Dynamic Questionnaire** - Intelligent branching logic adapts questions based on user responses
- 🤖 **AI-Powered Recommendations** - Uses DeepSeek R1 LLM for intelligent exercise and product matching
- 🏋️ **Comprehensive Exercise Database** - 873 exercises with detailed instructions and images
- 🛒 **Decathlon Product Integration** - 284 curated products from the Decathlon catalog
- 🎨 **Modern UI/UX** - Glassmorphic design with smooth Framer Motion animations
- 🇫🇷 **French Localization** - Full French language support for the Decathlon France market

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 7.2.4 | Build Tool & Dev Server |
| Tailwind CSS | 4.1.17 | Styling |
| Framer Motion | 12.23.25 | Animations |
| Lucide React | 0.555.0 | Icon Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | Runtime |
| Express | 5.2.1 | Web Framework |
| OpenRouter API | - | LLM Provider |
| DeepSeek R1 | - | Language Model |

---

## 🌳 Multichoice Decision Tree

The questionnaire implements a **dynamic branching decision tree** with 7 questions that adapt based on user responses.

### Tree Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: Welcome                               │
│            "Quel est votre objectif principal ?"                │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
   [Récupération]              [Other Goals]
        │                           │
        │                           ▼
        │               ┌───────────────────────┐
        │               │     pain-check        │
        │               │ "Ressentez-vous des   │
        │               │     douleurs ?"       │
        │               └─────────┬─────────────┘
        │                         │
        │              ┌──────────┴──────────┐
        │              ▼                     ▼
        │           [Oui]                  [Non]
        │              │                     │
        └──────────────┼─────────────────────┘
                       ▼
           ┌───────────────────────┐
           │     pain-areas        │
           │ "Quelles zones sont   │
           │    concernées ?"      │
           └───────────┬───────────┘
                       ▼
           ┌───────────────────────┐
           │    fitness-level      │
           │ "Niveau de forme      │
           │    physique ?"        │
           └───────────┬───────────┘
                       ▼
           ┌───────────────────────┐
           │   activity-level      │
           │ "Fréquence de sport ?"│
           └───────────┬───────────┘
                       ▼
           ┌───────────────────────┐
           │   available-time      │
           │ "Temps disponible     │
           │    par séance ?"      │
           └───────────┬───────────┘
                       ▼
           ┌───────────────────────┐
           │      equipment        │
           │ "Quel équipement      │
           │     avez-vous ?"      │
           └───────────┬───────────┘
                       ▼
                   [END] → AI Pipeline
```

### Question Types

| Type | Behavior | Example |
|------|----------|---------|
| `single` | User selects one option | Fitness level selection |
| `multiple` | User can select up to N options | Pain areas (max 4), Equipment (max 6) |

### Branching Logic Implementation

Each question option contains a `nextQuestion` property defining the flow:

```typescript
{
  id: "pain-check",
  question: "Ressentez-vous des douleurs ?",
  type: "single",
  options: [
    { id: "yes", label: "Oui", nextQuestion: "pain-areas" },
    { id: "no", label: "Non", nextQuestion: "fitness-level" }
  ]
}
```

---

## 🤖 AI Pipeline

The AI pipeline uses a **two-stage recommendation system** powered by the DeepSeek R1 language model via OpenRouter.

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER PROFILE                                     │
│  (goals, pain areas, fitness level, equipment, available time)          │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STAGE 1: EXERCISE SELECTION                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Profile Mapping                                                  │   │
│  │ • Pain areas → Target muscles (e.g., lower_back → glutes)       │   │
│  │ • Goals → Exercise categories (e.g., posture → stretching)       │   │
│  │ • Fitness level → Exercise difficulty filter                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ LLM Request                                                      │   │
│  │ • System: "You are a professional fitness coach..."              │   │
│  │ • User: Profile context + 873 exercise names                     │   │
│  │ • Output: 3 exercise names with reasoning                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   STAGE 2: PRODUCT RECOMMENDATION                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ LLM Request                                                      │   │
│  │ • System: "You are a Decathlon equipment specialist..."          │   │
│  │ • User: Selected exercises + equipment + 284 product labels      │   │
│  │ • Output: 3 product names with reasoning                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        FINAL RECOMMENDATIONS                            │
│  • 3 Personalized exercises with images & instructions                  │
│  • 3 Decathlon products with links                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### LLM Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Provider** | OpenRouter | API gateway for LLM access |
| **Model** | `deepseek/deepseek-r1` | Configurable via environment |
| **Temperature** | 0.3 | Low value for consistent results |
| **Max Tokens** | 1500 | Response length limit |
| **Response Format** | JSON | Structured output enforcement |
| **Retry Strategy** | 3 attempts | Exponential backoff (1s base) |

### Profile-to-Muscle Mapping

The system intelligently maps user pain areas to relevant muscle groups:

| Pain Area | Target Muscles |
|-----------|---------------|
| Neck | neck, traps |
| Shoulders | shoulders, traps |
| Upper Back | middle back, lats, traps |
| Lower Back | lower back, glutes |
| Hips | glutes, abductors, adductors |
| Knees | quadriceps, hamstrings |

### Error Handling

The pipeline includes robust error handling with custom error classes:

- `LLMServiceError` - Base error class
- `LLMResponseError` - Invalid response format
- `LLMRateLimitError` - Rate limiting with Retry-After support
- `LLMAPIError` - API communication failures

---

## 📊 Datasets

### Exercise Database

| Metric | Value |
|--------|-------|
| **Source** | [free-exercise-db](https://github.com/yuhonas/free-exercise-db) |
| **Total Exercises** | **873** |
| **Categories** | 7 (strength, stretching, cardio, plyometrics, powerlifting, strongman, Olympic weightlifting) |
| **Difficulty Levels** | 3 (beginner, intermediate, expert) |

#### Exercise Schema

```json
{
  "name": "3/4 Sit-Up",
  "force": "pull",
  "level": "beginner",
  "mechanic": "compound",
  "equipment": "body only",
  "primaryMuscles": ["abdominals"],
  "secondaryMuscles": [],
  "instructions": ["Step 1...", "Step 2..."],
  "category": "strength",
  "images": ["3_4_Sit-Up/0.jpg", "3_4_Sit-Up/1.jpg"],
  "id": "3_4_Sit-Up"
}
```

#### Equipment Types
- Body only
- Dumbbell
- Barbell
- Machine
- Cable
- Kettlebell
- Resistance bands
- Exercise ball
- Foam roller
- And more...

### Product Database

| Metric | Value |
|--------|-------|
| **Source** | Decathlon France Catalog |
| **Total Products** | **284** |
| **Base URL** | `https://www.decathlon.fr/` |

#### Product Schema

```json
{
  "label": "Tapis de yoga doux confort 8 mm",
  "url": "p/tapis-de-yoga-doux-confort-8-mm/_/R-p-123456"
}
```

#### Product Categories Include
- Exercise mats & yoga equipment
- Resistance bands & weights
- Foam rollers & massage tools
- Fitness trackers & smartwatches
- Cardio equipment
- Sports accessories

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- OpenRouter API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/decathlon-posture-coach.git
   cd decathlon-posture-coach
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # In /server directory, create .env file
   cp .env.example .env
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev

   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | - | API key for OpenRouter LLM access |
| `LLM_MODEL` | ❌ No | `deepseek/deepseek-r1` | LLM model identifier |
| `PORT` | ❌ No | `3000` | Backend server port |
| `VITE_API_URL` | ❌ No | `http://localhost:3000/api` | Frontend API base URL |

### Application Constants

```typescript
// LLM Settings
LLM_TEMPERATURE = 0.3
LLM_MAX_TOKENS = 1500
LLM_MAX_RETRIES = 3
LLM_RETRY_DELAY = 1000 // ms

// Recommendation Counts
EXERCISES_TO_RECOMMEND = 3
PRODUCTS_TO_RECOMMEND = 3
```

---

## 📡 API Reference

### Health Check
```http
GET /api/health
```
Returns server status and dataset counts.

### Exercises

```http
GET /api/exercises
```
Returns all 873 exercises in the database.

```http
POST /api/exercises/recommend
Content-Type: application/json

{
  "goals": ["posture", "flexibility"],
  "painAreas": ["lower_back", "neck"],
  "fitnessLevel": "beginner",
  "activityLevel": "moderate",
  "availableTime": "15-20",
  "equipment": ["body_only", "yoga_mat"]
}
```
Returns 3 AI-recommended exercises.

### Products

```http
GET /api/products
```
Returns all 284 products in the database.

```http
POST /api/products/recommend
Content-Type: application/json

{
  "exercises": [...], // Selected exercises from previous step
  "profile": {...}    // User profile
}
```
Returns 3 AI-recommended Decathlon products.

---

## 📁 Project Structure

```
decathlon/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── assets/             # Images & static files
│   │   ├── components/
│   │   │   ├── sections/       # Page sections
│   │   │   │   ├── LandingSection.tsx
│   │   │   │   ├── QuestionnaireSection.tsx
│   │   │   │   ├── ExercisesSection.tsx
│   │   │   │   └── ProductsSection.tsx
│   │   │   └── ui/             # Reusable UI components
│   │   ├── data/
│   │   │   └── questions.ts    # Questionnaire tree definition
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities
│   │   └── App.tsx             # Main application
│   ├── package.json
│   └── vite.config.ts
│
├── server/                      # Express Backend
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Data models
│   │   │   ├── Exercise.js
│   │   │   ├── Product.js
│   │   │   └── UserProfile.js
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   │   ├── llmService.js   # OpenRouter integration
│   │   │   └── dataService.js  # Data access
│   │   └── data/
│   │       ├── exercises.json  # 873 exercises
│   │       └── products.json   # 284 products
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 📄 License

This project is for educational and demonstration purposes.

- **Exercise Database**: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) - Open source
- **Decathlon Branding**: Property of Decathlon SA
- **Product Data**: Sourced from public Decathlon France catalog

---

<div align="center">

**Made with ❤️ by Cods**

</div>

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not defined in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Safety settings for fitness-related content
 * Loosened to allow tactical fitness advice without triggering medical content filters
 */
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_ONLY_HIGH", // Allows tactical fitness/exercise advice
  },
];

/**
 * Get a Gemini model instance with fitness-optimized safety settings
 * @param {string} modelName - Model name (e.g., "gemini-2.0-flash")
 * @returns {import("@google/generative-ai").GenerativeModel}
 */
export const getGeminiModel = (modelName = "gemini-2.0-flash") => {
  return genAI.getGenerativeModel({ 
    model: modelName,
    safetySettings,
  });
};

/**
 * Utility to handle AI content generation with error handling
 * @param {import("@google/generative-ai").GenerativeModel} model 
 * @param {Array<string | object>} parts 
 * @returns {Promise<string>}
 */
export const generateAIContent = async (model, parts) => {
  try {
    const result = await model.generateContent(parts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("The AI coach is currently resting. Please try again in a moment.");
  }
};

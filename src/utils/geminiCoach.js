import { getGeminiModel, generateAIContent } from "./geminiConfig";

/**
 * Get context-aware advice from the AI Coach
 * @param {object} userData - Combined user data (profile, history, bests, etc.)
 * @param {string} query - User's question
 * @returns {Promise<string>}
 */
export const getAICoachAdvice = async (userData, query) => {
  const model = getGeminiModel("gemini-2.0-flash");
  
  const context = `
    You are the STRIVE-15 AI Coach, a professional trainer specializing in the Men's Health Big Book of Exercises philosophy.
    User Profile: ${JSON.stringify(userData.profile || {})}
    Current Streak: ${userData.streak || 0} days
    Recent History (Last 5): ${JSON.stringify((userData.history || []).slice(0, 5))}
    Personal Bests: ${JSON.stringify(userData.bests || {})}
    Current Status: ${userData.isDeloadWeek ? "In De-load Week" : "Regular Training"}
    
    Guidelines:
    1. Be tactical, motivational, and technical.
    2. Keep responses concise (under 3 sentences unless asked for detail).
    3. Refer to the 15-minute workout constraint of STRIVE-15.
    4. If asked about injuries, prioritize safety and suggest alternatives, but always add a medical disclaimer.
  `;

  return generateAIContent(model, [context, query]);
};

/**
 * Generate a context-aware AI daily brief
 * @param {object} profile 
 * @param {Array} history 
 * @param {Array} foodLogs 
 * @returns {Promise<string>}
 */
export const generateAIBrief = async (profile, history, foodLogs) => {
  const model = getGeminiModel("gemini-2.0-flash");
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];
  
  const yesterdayWorkout = (history || []).find(h => h.timestamp.startsWith(dateStr));
  const yesterdayProtein = (foodLogs || [])
    .filter(f => f.timestamp.startsWith(dateStr))
    .reduce((sum, f) => sum + (parseFloat(f.protein) || 0), 0);
  
  const prompt = `
    Context:
    - Athlete Streak: ${profile?.streak || 0} days
    - Yesterday's Mood: ${yesterdayWorkout?.mood || "No workout"}
    - Yesterday's Protein: ${yesterdayProtein}g (Goal: ${profile?.dailyProteinGoal || 150}g)
    - Level: ${profile?.level || 1}
    
    Task: Write a 1-sentence morning briefing as a pro-athlete trainer.
    Tone: Motivational if on track, concerned but tactical if missing goals, strategic if in de-load.
    Mention one specific stat from the context.
    Keep it under 30 words.
  `;

  return generateAIContent(model, [prompt]);
};

/**
 * Suggest a biometrically similar exercise alternative
 * @param {string} exerciseName 
 * @param {string} reason (e.g., "injury", "no equipment")
 * @param {object} userData 
 * @returns {Promise<string>}
 */
export const suggestExerciseAlternative = async (exerciseName, reason, userData) => {
  const model = getGeminiModel("gemini-2.0-flash");
  
  const prompt = `
    User wants to modify: ${exerciseName}
    Reason: ${reason}
    User Level: ${userData.profile?.level || 1}
    Available Equipment: User is likely at home or a basic gym.
    
    Task: Suggest a "Biometrically Similar" alternative from the Men's Health Big Book of Exercises philosophy.
    Format: "Since you [reason], perform [alternative]. Insight: [why it works]."
    Keep it under 2 sentences.
  `;

  return generateAIContent(model, [prompt]);
};

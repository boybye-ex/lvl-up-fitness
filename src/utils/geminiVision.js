import { getGeminiModel, generateAIContent } from "./geminiConfig";

/**
 * Analyze a meal photo via Gemini Vision
 * @param {string} base64Image - Image data (without prefix)
 * @returns {Promise<object>}
 */
export const analyzeMealImage = async (base64Image) => {
  const model = getGeminiModel("gemini-2.0-flash");
  
  const prompt = `
    You are the STRIVE-15 Nutrition AI. 
    1. Identify all food items.
    2. Specifically flag any of the '12 Powerfoods' (Almonds, Beans, Spinach, Dairy, Oatmeal, Eggs, Turkey, Peanut Butter, Olive Oil, Whole Grains, Whey, Berries).
    3. Estimate total PROTEIN in grams as a single number.
    4. Provide a 1-sentence tactical coaching tip based on the Men's Health Big Book of Exercises philosophy.
    
    Response MUST be a valid JSON object:
    { "items": ["item1", "item2"], "powerfoods": ["pf1", "pf2"], "protein": number, "tip": "string" }
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
  ]);
  
  const text = result.response.text();
  // Clean potential markdown code blocks from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};

/**
 * Analyze exercise form from a video file
 * @param {File} videoFile 
 * @param {string} exerciseName 
 * @returns {Promise<object>}
 */
export const analyzeExerciseForm = async (videoFile, exerciseName) => {
  const model = getGeminiModel("gemini-2.0-flash"); // Using 1.5-flash for video/multimodal

  // For small videos, we can use base64. 
  const base64Data = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(videoFile);
  });

  const prompt = `
    You are a professional Strength & Conditioning Coach specializing in the Men's Health Big Book of Exercises.
    Task: Analyze the exercise form in this video for the move: ${exerciseName}.
    
    Instructions:
    1. Identify the exercise being performed.
    2. Critique the form based on biomechanical efficiency and safety.
    3. Use TIMESTAMPS (e.g., 0:02) for specific observations.
    4. Provide exactly 3 'Pros' and 2 'Areas for Correction'.
    5. Assign a 'Safety Score' from 1-10.
    
    Response MUST be a valid JSON object:
    { "pros": ["pro1", "pro2", "pro3"], "corrections": ["fix1", "fix2"], "safetyScore": number, "coachInsight": "string" }
  `;

  const result = await model.generateContent([
    { inlineData: { data: base64Data, mimeType: videoFile.type } },
    { text: prompt }
  ]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};

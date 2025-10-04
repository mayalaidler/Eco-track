import { GoogleGenAI, Type } from "@google/genai";
import type { QuizAnswers, CarbonFootprintResult, RecyclingResult, GroundingChunk } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;
console.log("Loaded API Key:", apiKey);

export const isApiKeyConfigured = (): boolean => !!apiKey;

let ai: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }
  if (!apiKey) {
    throw new Error("API Key is not configured. Cannot initialize Gemini AI.");
  }
  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const calculateCarbonFootprint = async (answers: QuizAnswers): Promise<CarbonFootprintResult> => {
  const prompt = `Based on the following lifestyle answers, act as a carbon footprint calculation expert. Calculate the user's estimated annual carbon footprint in tonnes of CO2 equivalent. Provide a brief analysis of their biggest impact areas. Offer 3 actionable tips for reduction based on their specific answers. Format your response as a valid JSON object. Answers: ${JSON.stringify(answers)}`;

  try {
    const aiInstance = getAiInstance();
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Estimated annual CO2 footprint in tonnes." },
            analysis: { type: Type.STRING, description: "Brief analysis of the user's carbon footprint." },
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Personalized tips for reduction." 
            },
          },
          required: ["score", "analysis", "tips"],
        }
      }
    });
    
    const text = response.text.trim();
    // In case the response is wrapped in markdown
    const jsonString = text.replace(/^```json\n?/, '').replace(/```$/, '');
    const result = JSON.parse(jsonString);
    
    return result;

    // FIX: Add type 'any' to the catch clause variable to resolve "Cannot find name 'error'" errors.
  } catch (error: any) {
    console.error("Error calculating carbon footprint:", error);
    if (error instanceof Error && error.message.includes("API Key is not configured")) {
        throw error;
    }
    throw new Error("Failed to get a valid calculation from the AI. Please try again.");
  }
};

export const getRecyclingInfo = async (location: string, item: string): Promise<RecyclingResult> => {
  const prompt = `What are the specific recycling rules for a "${item}" in "${location}"? Provide a clear, concise guide. If it's not recyclable, explain the correct disposal method. Mention any important details, like needing to be clean or separated. Use up-to-date web search results to provide the most accurate information possible.`;

  try {
    const aiInstance = getAiInstance();
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const info = response.text;
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];
    
    if (!info) {
        throw new Error("The AI returned an empty response for recycling information.");
    }
    
    return { info, sources };
    // FIX: Add type 'any' to the catch clause variable to resolve "Cannot find name 'error'" errors.
  } catch (error: any) {
    console.error("Error fetching recycling info:", error);
    if (error instanceof Error && error.message.includes("API Key is not configured")) {
        throw error;
    }
    throw new Error("Failed to get recycling information from the AI. Please check your inputs and try again.");
  }
};
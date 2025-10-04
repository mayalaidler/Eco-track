import { GoogleGenAI, Type } from "@google/genai";
import type { QuizAnswers, CarbonFootprintResult, RecyclingResult, GroundingChunk, EcoActionResult, CO2DataPoint } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const calculateCarbonFootprint = async (answers: QuizAnswers): Promise<CarbonFootprintResult> => {
  const prompt = `Based on the following lifestyle answers, act as a carbon footprint calculation expert. Calculate the user's estimated annual carbon footprint in tonnes of CO2 equivalent. Provide a brief analysis of their biggest impact areas. Offer 3 actionable tips for reduction based on their specific answers. Format your response as a valid JSON object. Answers: ${JSON.stringify(answers)}`;

  try {
    const response = await ai.models.generateContent({
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

  } catch (error) {
    console.error("Error calculating carbon footprint:", error);
    throw new Error("Failed to get a valid calculation from the AI. Please try again.");
  }
};

export const getRecyclingInfo = async (
  location: string, 
  item?: string,
  image?: { mimeType: string, data: string }
): Promise<RecyclingResult> => {

  if (!item && !image) {
    throw new Error("Either an item or an image must be provided.");
  }

  let contents;

  if (image) {
    const prompt = `Based on the attached image and my location in "${location}", what are the specific recycling rules for the item shown? Please identify the item in your response. Provide a clear, concise guide. If it's not recyclable, explain the correct disposal method. Mention any important details, like needing to be clean or separated. Use up-to-date web search results to provide the most accurate information possible.`;
    contents = {
      parts: [
        { inlineData: { mimeType: image.mimeType, data: image.data } },
        { text: prompt }
      ]
    };
  } else {
    contents = `What are the specific recycling rules for a "${item}" in "${location}"? Provide a clear, concise guide. If it's not recyclable, explain the correct disposal method. Mention any important details, like needing to be clean or separated. Use up-to-date web search results to provide the most accurate information possible.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
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
  } catch (error) {
    console.error("Error fetching recycling info:", error);
    throw new Error("Failed to get recycling information from the AI. Please check your inputs and try again.");
  }
};

export const analyzeEcoAction = async (action: string): Promise<EcoActionResult> => {
    const prompt = `A user has performed the following sustainable action: "${action}".
    Act as an eco-impact analyst. Evaluate this action and provide:
    1. A point score between 5 and 50, reflecting its positive environmental impact. Higher impact actions get more points.
    2. A brief, one-sentence, encouraging analysis of why this action is helpful.
    
    Format your response as a valid JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        points: { type: Type.NUMBER, description: "Point score from 5 to 50." },
                        analysis: { type: Type.STRING, description: "Brief, encouraging analysis." },
                    },
                    required: ["points", "analysis"],
                }
            }
        });

        const text = response.text.trim();
        const jsonString = text.replace(/^```json\n?/, '').replace(/```$/, '');
        const result = JSON.parse(jsonString);

        return result;

    } catch (error) {
        console.error("Error analyzing eco action:", error);
        throw new Error("Failed to analyze the action. Please try again.");
    }
};

// --- Real-time Air Quality Service ---
// This is a mock service. In a real application, you would fetch from the Ambee API using your key.
// const AMBEE_API_KEY = process.env.AMBEE_API_KEY;
// const API_ENDPOINT = 'https://api.ambeedata.com/latest/by-lat-lng';

let lastCO2Value = 420; // Starting baseline for CO2 ppm

export const getRealTimeCO2 = async (lat: number, lon: number): Promise<CO2DataPoint> => {
    console.log(`Fetching mock CO2 data for lat: ${lat}, lon: ${lon}`);

    // In a real app, you would make a network request:
    // const response = await fetch(`${API_ENDPOINT}?lat=${lat}&lng=${lon}`, {
    //   headers: { 'x-api-key': AMBEE_API_KEY, 'Content-type': 'application/json' }
    // });
    // if (!response.ok) { throw new Error('Failed to fetch air quality data.'); }
    // const data = await response.json();
    // return { co2: data.stations[0].CO2, timestamp: Date.now() };

    // Mock implementation for demonstration:
    return new Promise(resolve => {
        setTimeout(() => {
            // Fluctuate the CO2 value slightly to simulate real-time changes
            const fluctuation = (Math.random() - 0.5) * 2; // between -1 and 1
            lastCO2Value += fluctuation;
            if (lastCO2Value < 400) lastCO2Value = 400;
            if (lastCO2Value > 440) lastCO2Value = 440;

            resolve({
                co2: parseFloat(lastCO2Value.toFixed(2)),
                timestamp: Date.now(),
            });
        }, 500 + Math.random() * 500); // Simulate network latency
    });
  
  }

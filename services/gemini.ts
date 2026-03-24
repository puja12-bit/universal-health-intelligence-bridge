import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

export async function geminiAnalyze(inputParts: any[], systemInstruction: string) {
  console.log('[Gemini Integration] Sending inference request to Google Gemini API');
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Fallback triggered naturally');
  }
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
    generationConfig: { responseMimeType: "application/json" }
  });
  const result = await model.generateContent(inputParts);
  return result.response.text();
}

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are CrisisBridge AI, an expert medical and disaster response AI assistant.
Your task is to analyze the provided situation description and any associated image/document data.
You must output ONLY a valid JSON object matching the exact structure below. Do not use markdown blocks, just raw JSON.

{
  "severity": "High" | "Medium" | "Low",
  "summary": "A concise 1-2 sentence medical/situational summary.",
  "actionSteps": [
    "Step 1: Immediate action to take.",
    "Step 2: Follow-up action.",
    "..."
  ]
}

Ensure the analysis is highly professional and prioritizes life-saving or situation-stabilizing actions.
`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
       console.log('Using mock response for demo purposes (No API Key found)');
       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
       return NextResponse.json({
         severity: "High",
         summary: "Patient is presenting with symptoms consistent with severe dehydration and heat stroke.",
         actionSteps: [
           "Immediately move the patient to a cooler environment out of direct sunlight.",
           "Have the patient drink cool water or oral rehydration solutions slowly but continuously.",
           "Apply active cooling measures such as ice packs to the neck, groin, and armpits.",
           "Contact emergency medical services (911) indicating a suspected heat stroke."
         ]
       });
    }

    const formData = await req.formData();
    const description = formData.get('description') as string;
    const file = formData.get('file') as File | null;

    if (!description && !file) {
      return NextResponse.json({ error: 'Description or file is required.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const parts: any[] = [];
    
    // Sanitize user input loosely before processing
    const sanitizedDescription = description ? description.trim().substring(0, 5000) : '';
    
    parts.push({ text: `User Description: ${sanitizedDescription || 'No text provided.'}` });

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      parts.push({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: file.type
        }
      });
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    try {
      const parsed = JSON.parse(responseText);
      // Validate schema loosely
      if (!parsed.severity || !parsed.summary || !Array.isArray(parsed.actionSteps)) {
        throw new Error("Invalid output format from AI model");
      }
      return NextResponse.json(parsed);
    } catch (e) {
      console.error("Failed to parse Gemini logic:", responseText);
      return NextResponse.json({ error: 'Failed to generate a structured response from the AI.' }, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error analyzing the data.' }, { status: 500 });
  }
}

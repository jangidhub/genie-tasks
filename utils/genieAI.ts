import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing EXPO_PUBLIC_GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export type ParsedTask = {
  name: string;
  timeInMinutes: number | null;
  place: string | null;
};

export async function parseTaskWithGenie(prompt: string): Promise<ParsedTask | null> {
  if (!apiKey) {
    console.warn("API key missing. Cannot use Genie.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `You are a helpful task assistant. The user will give you a task description which may include a duration/timer and a place.
You must return a raw JSON object with EXACTLY these keys:
{
  "name": "string (the clear task description, without time or place information)",
  "timeInMinutes": number or null (total duration in minutes. e.g. 1 hour = 60, 2 hours = 120),
  "place": "string or null (the location if specified, otherwise null)"
}`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser request: "${prompt}"`);
    const responseText = result.response.text();
    
    // Parse the JSON directly
    const parsedData = JSON.parse(responseText) as ParsedTask;
    return parsedData;
  } catch (error) {
    console.error("Genie AI Error:", error);
    return null;
  }
}

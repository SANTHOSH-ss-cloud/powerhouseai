import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing from environment variables!");
}
const ai = new GoogleGenAI({ apiKey });

export interface SlideContent {
  title: string;
  content: string[];
}

export interface PptStructure {
  title: string;
  slides: SlideContent[];
}

export async function generatePptContent(prompt: string): Promise<PptStructure> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an expert educational content creator. 
    Input: ${prompt}
    
    Task: 
    1. Analyze the input. It could be a YouTube link, a transcript, a topic with subheadings, or raw content.
    2. If it's a YouTube link, use your internal knowledge and search tools to understand the video content.
    3. Generate a structured presentation. 
    4. Ensure the content is educational, accurate, and engaging for students.
    
    Return the result in JSON format with a 'title' and an array of 'slides' (each with 'title' and 'content' array).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["title", "content"]
            }
          }
        },
        required: ["title", "slides"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No content generated");
  return JSON.parse(text) as PptStructure;
}

export async function generateDocumentContent(prompt: string, type: 'pdf' | 'word'): Promise<{ title: string; content: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an expert academic writer.
    Input: ${prompt}
    
    Task:
    1. Analyze the input (YouTube link, transcript, or topic).
    2. Generate a comprehensive ${type === 'pdf' ? 'PDF report' : 'Word document'}.
    3. Use professional markdown formatting (headings, bold text, lists).
    4. If a YouTube link is provided, summarize the key takeaways from that video.
    
    Return the result in JSON format with 'title' and 'content' (markdown) fields.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No content generated");
  return JSON.parse(text) as { title: string; content: string };
}

export async function analyzeVideoOrTranscript(input: string): Promise<string> {
  // If it's a URL, we might need search grounding or just ask the user to provide text if we can't fetch it.
  // But for now, we'll treat the input as a prompt that might contain a link or transcript.
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Analyze the following input (which might be a video link, transcript, or topic): ${input}. 
    Extract the key educational points and summarize them into a structured format suitable for creating a presentation or document.
    If it's a YouTube link, use your search capabilities to find information about it if possible.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return response.text || "No analysis generated";
}

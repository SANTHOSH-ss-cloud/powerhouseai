export interface SlideContent {
  title: string;
  content: string[];
  imagePrompt?: string;
  helpNotes?: string;
}

export interface PptStructure {
  title: string;
  slides: SlideContent[];
}

// Helper to handle API requests to the backend
async function fetchAI(endpoint: string, body: object) {
  const response = await fetch(`/api/\${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let err;
    try {
      err = await response.json();
    } catch {
      throw new Error(`Server encountered an error (HTTP \${response.status}). This often happens if the API key is missing or the input is too large.`);
    }
    const message = err.error || `Failed to fetch from \${endpoint}`;
    if (message.includes('dummy_api_key') || message.includes('API key not valid')) {
      throw new Error("Gemini AI API Key is missing or invalid in the backend. Please check your .env configuration.");
    }
    throw new Error(message);
  }

  return response.json();
}

/**
 * Generates PPT structure by calling the backend /api/generate-ppt endpoint.
 */
export async function generatePptContent(prompt: string, options?: any): Promise<PptStructure> {
  return await fetchAI('generate-ppt', { prompt, options });
}

/**
 * Generates Doc/PDF content by calling the backend /api/generate-doc endpoint.
 */
export async function generateDocumentContent(prompt: string, type: 'pdf' | 'word', options?: any): Promise<{ title: string; content: string }> {
  return await fetchAI('generate-doc', { prompt, type, options });
}

/**
 * Analysis was historically used to pre-process inputs. 
 * For simplicity in ClassCraft, we now fold analysis directly into the generation logic on the backend.
 * Keeping a stub here just in case.
 */
export async function analyzeVideoOrTranscript(input: string): Promise<string> {
  // Folded into generate functions for one-shot speed
  return "Analysis complete. Generating materials...";
}

import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(process.cwd(), 'dist')));

// Initialize Razorpay
const RAZORPAY_KEY = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if (!RAZORPAY_KEY || RAZORPAY_KEY === 'dummy_key') {
  console.warn("WARNING: RAZORPAY_KEY_ID is missing or dummy. Payment features will not work.");
}
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY || 'dummy_key',
  key_secret: RAZORPAY_SECRET || 'dummy_secret',
});

// Initialize Gemini AI
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY || GEMINI_KEY === 'dummy_api_key') {
  console.warn("WARNING: GEMINI_API_KEY is missing or set to 'dummy_api_key'. AI generation will fail.");
}
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY || 'dummy_api_key' });

/* -------------------------------------------------------------------------- */
/*                               AI GENERATION API                            */
/* -------------------------------------------------------------------------- */

app.post('/api/generate-ppt', async (req, res) => {
  try {
    const { prompt, options } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const { pages = 10, font = 'Arial', size = '16px', images = false, helpNotes = false, detailedContent = false } = options || {};

    let extraInstructions = `
    - Number of slides (pages): Exactly ${pages}.
    - Theme/Font suggestion: ${font}, Size suggestion: ${size}. Incorporate these as metadata if possible.
    ${images ? '- Suggest images for each slide.' : ''}
    ${helpNotes ? '- Include speaker/help notes for each slide.' : ''}
    ${detailedContent ? '- Provide detailed paragraph explanations instead of just bullet points.' : ''}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are ClassCraft AI, an expert educational content creator.
      Analyze this input: ${prompt}
      Generate a structured educational presentation.
      Follow these constraints: ${extraInstructions}
      Return in JSON format with 'title' and 'slides' array.
      If options specify images, set an 'imagePrompt' field in each slide.
      If options specify helpNotes, set a 'helpNotes' field in each slide.`,
      config: {
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
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imagePrompt: { type: Type.STRING },
                  helpNotes: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["title", "slides"]
        }
      }
    });

    const response = JSON.parse(result.text);
    res.json(response);
  } catch (error: any) {
    console.error("AI PPT Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-doc', async (req, res) => {
  try {
    const { prompt, type, options } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const { pages = 5, font = 'Arial', size = '12px', images = false } = options || {};

    let extraInstructions = `
    - Target length (pages): Around ${pages} pages worth of content.
    - Theme suggestion: Font ${font}, Size ${size}.
    ${images ? '- Suggest locations for images within the markdown.' : ''}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are ClassCraft AI, an expert academic writer.
      Generate a comprehensive ${type} document based on: ${prompt}.
      Follow constraints: ${extraInstructions}
      Use professional markdown layout.
      Return in JSON format with 'title' and 'content' (markdown).`,
      config: {
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

    const response = JSON.parse(result.text);
    res.json(response);
  } catch (error: any) {
    console.error("AI Doc Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                                RAZORPAY API                                  */
/* -------------------------------------------------------------------------- */

app.post('/api/create-subscription', async (req, res) => {
  try {
    const { planId } = req.body;
    // Without a real planId, fallback to a mocked recurring checkout link
    if (!planId) {
      return res.json({ id: `sub_mock_${Date.now()}`, mock: true });
    }
    const options = {
      plan_id: planId,
      customer_notify: 1 as 1,
      total_count: 12,
      start_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 day trial
    };
    const subscription = await razorpay.subscriptions.create(options);
    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_\${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const SECRET = process.env.RAZORPAY_KEY_SECRET || '';
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", SECRET).update(sign.toString()).digest("hex");
    if (razorpay_signature === expectedSign) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Global Error Handler for JSON parsing and other middleware errors
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global Error Middleware:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ClassCraft Backend Running on Port ${PORT}`));

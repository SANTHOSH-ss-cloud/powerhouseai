import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

/* -------------------------------------------------------------------------- */
/*                               AI GENERATION API                            */
/* -------------------------------------------------------------------------- */

app.post('/api/generate-ppt', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are ClassCraft AI, an expert educational content creator.
      Analyze this input: \${prompt}
      Generate a structured educational presentation.
      Return in JSON format with 'title' and 'slides' array.`,
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
                  content: { type: Type.ARRAY, items: { type: Type.STRING } }
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
    const { prompt, type } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are ClassCraft AI, an expert academic writer.
      Generate a comprehensive \${type} document based on: \${prompt}.
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ClassCraft Backend Running on Port \${PORT}`));

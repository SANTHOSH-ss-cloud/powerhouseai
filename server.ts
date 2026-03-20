import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

const PUBLIC_KEY = 'rzp_live_STSp9rTeNzt88z';
const SECRET_KEY = 'BAHJkoLRIAp8UKpjOSclbVsg';

const razorpay = new Razorpay({
  key_id: PUBLIC_KEY,
  key_secret: SECRET_KEY,
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).json({ error: 'amount is required' });
    }
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
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
    
    console.log("Received verification request:", req.body);
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(sign.toString())
      .digest("hex");
      
    console.log("Expected:", expectedSign);
    console.log("Received:", razorpay_signature);

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

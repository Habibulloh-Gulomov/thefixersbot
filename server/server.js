import express from 'express';
import cors from 'cors';
import { createSmsHandler } from './js/Fun.js';

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://thefixers.uz',
  'http://thefixers.uz',
  'https://thefixersuz.netlify.app',
  'http://localhost:3000', // Added for local development
  'http://localhost:5173', // Common if you are using Vite
  'http://127.0.0.1:3000'   // Alternative local address
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // 2. Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// --------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smsHandler = createSmsHandler({
  botToken: '8349433544:AAHktReVCicPy7Z9rZJWiWFBd1RwZy7Allc',
  chatId: '5006214046'
});

app.post('/sms', smsHandler);

// Health check
app.get('/', (req, res) => {
  res.send('Server is active and CORS is configured for Local & Production.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS → Telegram сервер запущен на порту ${PORT}`);
});


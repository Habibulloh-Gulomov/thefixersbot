import express from 'express';
import cors from 'cors';
import { createSmsHandler } from './js/Fun.js';

const app = express();

// --- CONFIGURATION ---
// IMPORTANT: If sending to a group, ensure the ID starts with -100
const botToken = '8349433544:AAHktReVCicPy7Z9rZJWiWFBd1RwZy7Allc';
const chatId = '-1003676936082'; 

// Helper function to send status messages to Telegram
const sendTelegramStatus = async (message) => {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error("Failed to send status to Telegram:", err);
  }
};

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://thefixers.uz',
  'http://thefixers.uz',
  'https://thefixersuz.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smsHandler = createSmsHandler({
  botToken: botToken,
  chatId: chatId
});

// Wrap the handler to log incoming data (Debugging)
app.post('/sms', (req, res, next) => {
  console.log("Incoming SMS Data:", req.body);
  smsHandler(req, res, next);
});

app.get('/', (req, res) => {
  res.send('Server is active and CORS is configured for Local & Production.');
});

// --- ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  const errorMessage = `⚠️ <b>Server Error</b>\n\n<b>Path:</b> ${req.path}\n<b>Error:</b> ${err.message}`;
  sendTelegramStatus(errorMessage);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  const startMsg = `✅ <b>Server Started</b>\n\nPort: ${PORT}\nStatus: SMS → Telegram ishlamoqda.`;
  console.log(`SMS → Telegram server portda ishlamoqda: ${PORT}`);
  await sendTelegramStatus(startMsg);
});

process.on('uncaughtException', async (error) => {
  await sendTelegramStatus(`🚫 <b>Uncaught Exception</b>\n<code>${error.message}</code>`);
  process.exit(1);
});


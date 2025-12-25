import express from 'express';
import cors from 'cors'; // Import cors
import { createSmsHandler } from './js/Fun.js';

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://thefixers.uz',
  'https://thefixersuz.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
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
// --------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smsHandler = createSmsHandler({
  botToken: '8349433544:AAHktReVCicPy7Z9rZJWiWFBd1RwZy7Allc',
  chatId: '5006214046'
});

// Your endpoint
app.post('/sms', smsHandler);

// Basic health check for Render
app.get('/', (req, res) => {
  res.send('Server is active and CORS is configured.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS → Telegram сервер запущен на порту ${PORT}`);
});

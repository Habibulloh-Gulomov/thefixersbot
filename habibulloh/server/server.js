import express from 'express';
import { createSmsHandler } from './js/Fun.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smsHandler = createSmsHandler({
  botToken: 'TOKEN_ОТ_BOTFATHER',
  chatId: 'CHAT_ID'
});

app.post('/sms', smsHandler);

app.listen(3000, () => {
  console.log('SMS → Telegram сервер запущен на порту 3000');
});
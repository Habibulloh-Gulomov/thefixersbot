import express from 'express';
import { createSmsHandler } from './js/Fun.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smsHandler = createSmsHandler({
  botToken: '8349433544:AAHktReVCicPy7Z9rZJWiWFBd1RwZy7Allc',
  chatId: '5006214046'
});

app.post('/sms', smsHandler);

app.listen(3000, () => {
  console.log('SMS → Telegram сервер запущен на порту 3000');
});
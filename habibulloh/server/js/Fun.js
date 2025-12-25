import axios from 'axios';

export function createSmsHandler({ botToken, chatId }) {
  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text
    });
  }

  return async function smsHandler(req, res) {
    try {
      const from = req.body.from || req.body.phone || 'Неизвестно';
      const message = req.body.text || req.body.message || '';

      const text =
        `📩 Новое SMS\n` +
        `📞 От: ${from}\n` +
        `💬 Текст: ${message}`;

      await sendToTelegram(text);
      res.send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('ERROR');
    }
  };
}

import axios from 'axios';

export function createSmsHandler({ botToken, chatId }) {
  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // IMPORTANT: parse_mode must be set to 'HTML' to use <b> tags
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML', 
    });
  }

  return async function smsHandler(req, res) {
    try {
      // Extract info (handles multiple naming conventions)
      const name = req.body.name || req.body.full_name || 'Not provided';
      const phone = req.body.phone || req.body.from || 'Not provided';
      const company = req.body.company || req.body.company_name || 'Not provided';
      const position = req.body.position || req.body.job_title || 'Not provided';
      const employees = req.body.employees || req.body.employee_count || 'Not provided';

      // Format the message
      const text = 
        `<b>👤 New Lead Received</b>\n\n` +
        `<b>Name:</b> ${name}\n` +
        `<b>Phone:</b> ${phone}\n` +
        `<b>Company:</b> ${company}\n` +
        `<b>Position:</b> ${position}\n` +
        `<b>Employees:</b> ${employees}`;

      await sendToTelegram(text);
      res.status(200).send('OK');
    } catch (err) {
      console.error("Telegram API Error:", err.response?.data || err.message);
      res.status(500).send('ERROR');
    }
  };
}

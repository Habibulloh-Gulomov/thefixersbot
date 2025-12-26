import axios from 'axios';
export function createSmsHandler({ botToken, chatId }) {
  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text, // Added HTML support for bolding
    });
  }

  return async function smsHandler(req, res) {
    try {
      // 1. Extract info from the request body
      const name = req.body.name || req.body.full_name || 'Not provided';
      const phone = req.body.phone || req.body.from || 'Not provided';
      const company = req.body.company || req.body.company_name || 'Not provided';
      const position = req.body.position || req.body.job_title || 'Not provided';
      const employees = req.body.employees || req.body.employee_count || 'Not provided';

      // 2. Format the message with HTML for better readability
      const text = 
        `<b>👤 New Lead Received</b>\n\n` +
        `<b>Name:</b> ${name}\n` +
        `<b>Phone:</b> ${phone}\n` +
        `<b>Company:</b> ${company}\n` +
        `<b>Position:</b> ${position}\n` +
        `<b>Employees:</b> ${employees}`;

      await sendToTelegram(text);
      res.send('OK');
    } catch (err) {
      console.error(err);
      res.status(500).send('ERROR');
    }
  };

}


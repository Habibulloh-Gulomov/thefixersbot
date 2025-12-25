const axios = require('axios'); // Ensure axios is imported

export function createSmsHandler({ botToken, chatId }) {
  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // The fix: explicitly set parse_mode to 'HTML'
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML', 
    });
  }

  return async function smsHandler(req, res) {
    try {
      // Extraction logic (keep as is, it's robust)
      const { name, phone, company, position, employees } = req.body;

      const text = 
        `<b>👤 New Lead Received</b>\n\n` +
        `<b>Name:</b> ${name || 'N/A'}\n` +
        `<b>Phone:</b> ${phone || 'N/A'}\n` +
        `<b>Company:</b> ${company || 'N/A'}\n` +
        `<b>Position:</b> ${position || 'N/A'}\n` +
        `<b>Employees:</b> ${employees || 'N/A'}`;

      await sendToTelegram(text);
      res.status(200).send('OK'); 
    } catch (err) {
      // This helps you see the REAL error in Render logs
      console.error("Telegram Error:", err.response?.data || err.message);
      res.status(500).send('ERROR');
    }
  };
}

import axios from 'axios';

export const sendDiscordAlert = async (message: string) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await axios.post(webhookUrl, {
      content: message,
    });
  } catch (err) {
    console.error('❌ Failed to send Discord alert', err);
  }
};
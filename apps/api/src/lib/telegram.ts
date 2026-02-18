const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type NotifyLevel = 'info' | 'warn' | 'error' | 'signup';

const EMOJI: Record<NotifyLevel, string> = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '🚨',
  signup: '🎉',
};

export async function notify(level: NotifyLevel, title: string, details?: Record<string, string | number>) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  let text = `${EMOJI[level]} <b>${title}</b>`;
  if (details) {
    text += '\n' + Object.entries(details)
      .map(([k, v]) => `• <b>${k}:</b> ${v}`)
      .join('\n');
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_notification: level === 'info',
      }),
    });
  } catch (err) {
    console.error('Telegram notify failed:', err);
  }
}

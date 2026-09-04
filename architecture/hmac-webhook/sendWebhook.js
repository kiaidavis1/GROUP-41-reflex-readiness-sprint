const crypto = require('crypto');

const SECRET = process.env.WEBHOOK_SECRET || 'northstar-secret-key';

async function sendWebhook(url, payload) {
  const body = JSON.stringify(payload);

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(body)
    .digest('hex');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-signature': signature
    },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook failed with status ${response.status}: ${text}`);
  }

  return response.json();
}

module.exports = sendWebhook;
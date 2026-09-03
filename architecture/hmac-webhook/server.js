const express = require('express');
const crypto = require('crypto');

const app = express();
const SECRET = 'northstar-secret-key'; //shared secret, asumming it's from warehouse

// Capture raw body bytes BEFORE Express parses JSON (for correct matching)
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.post('/webhook', (req, res) => {
    const signature = req.get('X-signature');

    if (!signature) {
        return res.status(401).json({ error: 'Missing signature' });
    }

    const expectedSignature = crypto
        .createHmac('sha256', SECRET)
        .update(req.rawBody)
        .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log(' Verified webhook payload:', req.body);
    res.status(200).json({ status: 'received' });
});

app.listen(3000, () => console.log('Webhook receiver listening on http://localhost:3000'));
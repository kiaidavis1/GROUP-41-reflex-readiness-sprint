const crypto = require("crypto");
const SECRET = process.env.WEBHOOK_SECRET || "northstar-secret-key"; // must match sendWebhook.js exactly

function verifyWebhookSignature(req, res, next) {
  const signature = req.get("X-signature");
  if (!signature) return res.status(401).json({ error: "Missing signature" });

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(req.rawBody)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return res.status(401).json({ error: "Invalid signature" });
  }
  next();
}

module.exports = verifyWebhookSignature;
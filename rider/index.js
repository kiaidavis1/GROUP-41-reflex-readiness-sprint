const express = require("express");
const retryWithBackoff = require("../architecture/retry-backoff/retry.js");
const sendWebhook = require("../architecture/hmac-webhook/sendWebhook.js");
const verifyWebhookSignature = require("../architecture/hmac-webhook/verifyMiddleware.js");

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

const RETAILER_URL = "http://localhost:3001";
let deliveries = [];

app.post("/webhook", verifyWebhookSignature, (req, res) => {
  const { id, riderId, customerName, address, item, status } = req.body;
  deliveries.push({ id, riderId, customerName, address, item, status });
  console.log(`New delivery assigned: #${id} to rider ${riderId}`);
  res.status(200).json({ status: "received" });
});

app.get("/deliveries", (req, res) => {
  res.json(deliveries);
});

app.patch("/deliveries/:id/status", async (req, res) => {
  const { status } = req.body;
  const delivery = deliveries.find(d => d.id === parseInt(req.params.id));
  if (!delivery) return res.status(404).json({ error: "Delivery not found" });

  delivery.status = status;
  try {
    await retryWithBackoff(() => sendWebhook(`${RETAILER_URL}/webhook`, { requestId: delivery.id, status }));
    res.json({ ...delivery, notified: true });
  } catch (err) {
    res.json({ ...delivery, notified: false, error: err.message });
  }
});

app.listen(3003, () => console.log("Rider service running on port 3003"));
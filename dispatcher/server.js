const express = require("express");
const retryWithBackoff = require("../architecture/retry-backoff/retry.js");
const sendWebhook = require("../architecture/hmac-webhook/sendWebhook.js");

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

const RETAILER_URL = process.env.RETAILER_URL || "http://localhost:3001";
const RIDER_URL = process.env.RIDER_URL || "http://localhost:3003";

app.get("/requests/open", async (req, res) => {
  try {
    const response = await fetch(`${RETAILER_URL}/requests`);
    const allRequests = await response.json();
    res.json(allRequests.filter(r => r.status === "Open"));
  } catch (err) {
    res.status(502).json({ error: "Could not reach retailer service", details: err.message });
  }
});

app.post("/requests/:id/assign", async (req, res) => {
  const requestId = parseInt(req.params.id);
  const { riderId, customerName, address, item } = req.body;

  try {
    await retryWithBackoff(() =>
      sendWebhook(`${RETAILER_URL}/webhook`, { requestId, status: "Assigned" })
    );
    await retryWithBackoff(() =>
      sendWebhook(`${RIDER_URL}/webhook`, { id: requestId, riderId, customerName, address, item, status: "Assigned" })
    );
    res.json({ requestId, riderId, status: "Assigned", notified: true });
  } catch (err) {
    res.status(502).json({ error: "Assignment could not be delivered to all services", details: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Dispatcher service running on port ${PORT}`));
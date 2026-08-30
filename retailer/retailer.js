const express = require("express");
const verifyWebhookSignature = require("../architecture/hmac-webhook/verifyMiddleware.js");

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

let requests = [];
let nextId = 1;

app.post("/requests", (req, res) => {
  const { customerName, phone, address, item } = req.body;
  const newRequest = { id: nextId++, customerName, phone, address, item, status: "Open" };
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

app.get("/requests", (req, res) => {
  res.json(requests);
});

// Receives signed updates from dispatcher (Assigned) and rider (Picked Up, Delivered)
app.post("/webhook", verifyWebhookSignature, (req, res) => {
  const { requestId, status } = req.body;
  const request = requests.find(r => r.id === requestId);
  if (!request) return res.status(404).json({ error: "Request not found" });

  request.status = status;
  console.log(`Request ${requestId} updated to "${status}"`);
  res.status(200).json({ status: "received" });
});

app.listen(3001, () => console.log("Retailer service running on port 3001"));
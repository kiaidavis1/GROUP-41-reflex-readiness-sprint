
# Demo Script — Reflex

## Setup (before the panel arrives)
- Open 3 terminal tabs.
- Terminal 1: `cd retailer && node index.js` → confirm "Retailer service running on port 3001"
- Terminal 2: `cd dispatcher && node index.js` → confirm "Dispatcher service running on port 3002"
- Terminal 3: `cd rider && node index.js` → confirm "Rider service running on port 3003"
- Keep a 4th terminal free for running the demo commands below.

## Flow to demonstrate

**1. Retailer logs a delivery request**-

curl -X POST http://localhost:3001/requests -H "Content-Type: application/json" -d '{"customerName":"Jane","phone":"0700000000","address":"Nairobi CBD","item":"Phone charger"}'

Say: "The retailer just logged a request — no WhatsApp, no phone call, it's now a tracked record with an ID."

**2. Dispatcher assigns it to a rider**

curl -X POST http://localhost:3002/requests/1/assign -H "Content-Type: application/json" -d '{"riderId":7,"customerName":"Jane","address":"Nairobi CBD","item":"Phone charger"}'

Say: "The dispatcher just assigned this to rider 7. Behind the scenes, that assignment was signed with HMAC and pushed to both the retailer and the rider — watch terminal 1 and 3 log the verified update."

**3. Rider updates status**

curl -X PATCH http://localhost:3003/deliveries/1/status -H "Content-Type: application/json" -d '{"status":"Picked Up"}'

Say: "Rider marks it picked up. That triggers a signed webhook back to the retailer, wrapped in retry-with-backoff — if the network hiccups, it retries automatically instead of losing the update."

**4. Confirm the retailer sees it live**

curl http://localhost:3001/requests

Say: "The retailer's view updates without them ever calling or messaging anyone — status shows 'Picked Up' directly from the rider's action."

**5. Mark delivered**

curl -X PATCH http://localhost:3003/deliveries/1/status -H "Content-Type: application/json" -d '{"status":"Delivered"}'

Then re-run step 4's curl to show the final "Delivered" status.

## Fallback plan if live demo fails
- Have a terminal recording or screenshots of a successful run ready as backup.
- If a service crashes mid-demo, say plainly: "That's a live failure — here's what would happen: [explain retry/backoff or restart]." This is a stronger answer than pretending it didn't happen.
# Trade-off Log — Reflex

## 1. In-memory data storage (no database)
- **What:** Retailer, dispatcher, and rider services store all requests/deliveries
  in plain JavaScript arrays in memory. Restarting any service wipes its data.
- **Acceptable because:** For a 5-day sprint, a real database (setup, schema,
  migrations) would cost time better spent proving the architecture (retry,
  HMAC, webhooks) actually works end to end.
- **With more time:** Replace each in-memory array with a real database
  (e.g. PostgreSQL or MongoDB) so data survives restarts and multiple people
  can run the system without losing state.

## 2. Hardcoded shared secret for HMAC signing
- **What:** The webhook signing secret ("northstar-secret-key") is hardcoded
  directly in the source code of every service, identical across all of them.
- **Acceptable because:** It proves the HMAC verification concept works
  correctly without the added complexity of secret management this week.
- **With more time:** Move the secret into an environment variable (.env,
  already gitignored) and rotate/manage it properly — never commit a real
  secret to source control.

## 3. No duplicate-delivery protection on retries
- **What:** If a webhook push succeeds on the retailer's side but the
  confirmation response is lost in transit, retry/backoff will resend the
  same status update. The retailer currently has no way to detect this is a
  duplicate — it just overwrites the status again (harmless here, but not
  guaranteed in general).
- **Acceptable because:** For this case study, re-applying the same status
  update twice doesn't corrupt anything — the end state is the same.
- **With more time:** Add an idempotency key to each webhook payload so the
  receiving service can recognize and safely ignore duplicate deliveries.

## 4. No authentication on the retailer/dispatcher/rider APIs themselves
- **What:** Anyone who can reach these services (e.g. on the same network)
  can log requests, assign riders, or update delivery status — only the
  webhook-to-webhook calls between services are protected by HMAC.
- **Acceptable because:** Real user authentication (retailer staff, dispatcher,
  rider logins) is a separate, larger problem than proving the delivery
  coordination flow works.
- **With more time:** Add proper login/auth per persona so only authorized
  retailer staff, dispatchers, or riders can act on their respective endpoints.

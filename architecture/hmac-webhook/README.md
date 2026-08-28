# northstar-hmac-webhook

A mini-prototype demonstrating **HMAC-SHA256 webhook signature verification**,
built as part of the Northstar Sprint (Assignment 1 — Solo Recon) for the
fictional client Northstar Retail Co.

## What this proves

Webhook endpoints are public URLs — anyone can send a POST request to them.
This prototype verifies that an incoming webhook payload genuinely came from
a trusted source (holder of a shared secret) and was not tampered with in
transit, before the payload is trusted or processed.

## How it works

1. Sender and receiver share a secret key in advance.
2. The sender computes an HMAC-SHA256 hash of the raw request body using the
   secret, and sends it in an `X-Signature` header.
3. The receiver computes the same hash independently over the raw bytes it
   received, using the same secret.
4. If the two signatures match (compared using a timing-safe comparison),
   the request is accepted. If not, or if the header is missing, the request
   is rejected with a `401`.

## Tech stack

- Node.js
- Express
- Node's built-in `crypto` module (no external crypto dependencies)

## Project structure

```
northstar-hmac-webhook/
├── server.js          # Express server with the /webhook route
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Setup

```bash
git clone https://github.com/kiaidavis1/northstar-hmac-webhook.git
cd northstar-hmac-webhook
npm install
```

## Running the server

```bash
node server.js
```

Server starts on `http://localhost:3000`.

## Testing it

**1. Generate a valid signature for a test payload:**

```bash
node -e "console.log(require('crypto').createHmac('sha256','northstar-secret-key').update('{\"sku\":\"SKU-123\",\"stock\":42}').digest('hex'))"
```

**2. Send a signed request using the generated hash:**

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: PASTE_GENERATED_HASH_HERE" \
  -d '{"sku":"SKU-123","stock":42}'
```

Expected response:
```json
{"status":"received"}
```

**3. Test the rejection path** — send the same request with an invalid or
missing `X-Signature` header. Expected response:
```json
{"error":"Invalid signature"}
```
or
```json
{"error":"Missing signature"}
```

## Key implementation detail

Express's default JSON body parser converts the request body into a JS
object and discards the original raw bytes. Computing the HMAC against a
re-stringified object (instead of the original raw payload) can produce a
mismatched signature even for legitimate requests, due to differences in
whitespace or key ordering.

This is solved by capturing the raw request buffer *before* parsing, using
the `verify` option in `express.json()`:

```javascript
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
```

The signature is then computed against `req.rawBody`, not `req.body`.

## Related documentation

See [`BLOCKER_JOURNAL.md`](./BLOCKER_JOURNAL.md) for the full learning
process, resources consulted, and real blockers encountered while building
this prototype (both in the HMAC logic and in the git/GitHub setup). Shukran.

## Author

Davis Muyaga Kiai — [kiaidavis1](https://github.com/kiaidavis1)

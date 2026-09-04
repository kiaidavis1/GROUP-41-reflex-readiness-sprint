## Blocker: MODULE_NOT_FOUND errors during pre-deploy cleanup (Sep 4)

**What happened:**
While cleaning up the repo before deploying to Render, three files were
accidentally deleted along with the intended cleanup targets:
- `architecture/retry-backoff/retry.js`
- `architecture/hmac-webhook/sendWebhook.js`

The intended deletions were `retry-backoff/index.js`,
`retry-backoff/mockEndpoint.js`, and the empty `retry-backoff/backoff/`
folder — none of which are imported by the real services. `retry.js`
and `sendWebhook.js` are both required by `dispatcher/server.js` and
`rider/index.js`, so removing them broke every service that depends on
retry-with-backoff or signed webhooks.

**Symptom:**
`node server.js` and `node index.js` threw:


**Root cause:**
Deleted the wrong files during manual cleanup — no version control
checkpoint was made before deleting, so there was no `git checkout` to
recover from; both files had to be rewritten from scratch.

**Fix:**
Reconstructed both files manually, matching the original logic exactly:
- `retry.js`: exponential backoff (1s, 2s, 4s) with a configurable
  max retry count, throwing after retries are exhausted.
- `sendWebhook.js`: signs the JSON-stringified payload once with
  HMAC-SHA256, sends that exact same string as the body (critical —
  signing and sending different serializations would break signature
  verification on the receiving end).

Verified the fix by running the full retailer → dispatcher → rider →
retailer loop end to end; confirmed `"status":"Delivered"` on the
final GET, with no `401 Invalid signature` errors anywhere in the chain.

**Lesson for next time:** commit to Git before doing any bulk file
cleanup, so accidental deletions are a `git checkout` away from fixed
instead of a full manual rewrite.
# Learning & Blocker Journal — HMAC Webhook Verification

**Assignment:** Northstar Sprint — Assignment 1 (Solo Recon)
**Tool assigned:** HMAC Webhook Verification
**Author:** Davis Muyaga Kiai (kiaidavis1)
**Repo:** northstar-hmac-webhook

---

## Learning Approach

Before writing any code, I watched a small set of YouTube tutorials to build a
foundation:
- A general "why HMAC exists" conceptual video, to understand the
  authentication problem before touching syntax.
- A GitHub-webhook-specific implementation video, since it uses the exact
  header/verify pattern relevant to my prototype.
- A Supabase/Node-based webhook build, to see a full server example rather
  than just the crypto function in isolation.

This reflects my usual pattern: watch conceptual material first, then build,
rather than copying code without understanding the underlying mechanism.

---

## Resources Consulted
- Node.js `crypto` module documentation (`createHmac`, `timingSafeEqual`)
- Express.js documentation on `express.json({ verify })`
- GitHub Docs: webhook signature validation (`X-Hub-Signature-256`)

---

## Build Log & Blockers

### Blocker 1 — Raw body vs. parsed body
**What happened:** Learned early (before writing broken code) that
`express.json()` parses the request body into a JS object and discards the
original bytes. If the HMAC is computed against a re-stringified object
instead of the original payload, the signature will not match even for a
legitimate request, because whitespace and key ordering can differ from what
was actually signed.

**Fix:** Used the `verify` callback inside `express.json()` to capture the
raw `Buffer` into `req.rawBody` before parsing occurs, and computed the HMAC
against that raw buffer rather than `req.body`.

---

### Blocker 2 — Terminal paste artifact
**What happened:** First `curl` attempt failed immediately with:
```
zsh: bad pattern: ^[[200~node
```
**Diagnosis:** Stray escape characters got included when pasting into the
terminal — not a code or logic issue.

**Fix:** Re-ran the command cleanly. No code changes needed.

---

### Blocker 3 — GitHub push rejected: repository not found
**What happened:**
```
remote: Repository not found.
fatal: repository 'https://github.com/yourusername/northstar-hmac-webhook.git/' not found
```
**Diagnosis:** Used a mistyped username (`kiadavis1`) instead of my
actual GitHub username(' kiaidavis1' ) , and had not yet created the repository on GitHub's
side — git cannot push to a remote that doesn't exist.

**Fix:**
1. Created the repository on GitHub under the correct account (`kiaidavis1`).
2. Removed the incorrect remote and re-added it with the correct URL:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/kiaidavis1/northstar-hmac-webhook.git
   ```

---

### Blocker 4 — Push rejected: remote contains work not present locally
**What happened:**
```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs...
hint: Updates were rejected because the remote contains work that you do not have locally
```
**Diagnosis:** When creating the GitHub repo, an initial commit was
auto-generated containing only `README.md`. This gave the remote `main`
branch a commit history that my local `main` didn't have, and vice versa —
the two branches had diverged with no shared ancestor.

**Fix attempt 1:** `git pull` — fetched the remote branch successfully but
returned:
```
There is no tracking information for the current branch.
```
**Fix:**
```bash
git branch --set-upstream-to=origin/main main
git pull --no-rebase --allow-unrelated-histories
```
The `--allow-unrelated-histories` flag was necessary because the local and
remote branches had genuinely independent starting points (mine started with
`git init`, GitHub's started with its own auto-generated README commit).

This opened a Vim editor for an auto-generated merge commit message. Saved
and exited with `:wq`.

---

### Blocker 5 — Accidentally executed terminal output as a command
**What happened:** After a failed push, copied a chunk of terminal text that
included the line `To https://github.com/...` (which was actually output
from a previous git command, not something to run) and got:
```
zsh: command not found: To
```
**Diagnosis:** Pasted output instead of the actual next command — a
copy-paste sequencing error, not a git or code issue.

**Fix:** Ignored the stray line and proceeded with the correct next command.

---

## Outcome

- Local `server.js` merged cleanly with the remote README (no file overlap,
  no conflicts).
- Final push succeeded: `git push -u origin main`.
- Repository now shows 4 commits and all expected files
  (`.gitignore`, `README.md`, `package.json`, `package-lock.json`,
  `server.js`).
- Verified end-to-end: valid signature → `200 { status: "received" }`;
  invalid signature → `401 { error: "Invalid signature" }`; missing header →
  `401 { error: "Missing signature" }`.

## Time-box vs. Actual
- Planned: ~2 hours (build + test + push)
- Actual: ~2.5 hours, with most of the extra time spent on git remote/merge
  issues rather than the HMAC logic itself, which worked correctly on first
  proper test.

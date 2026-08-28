# Reflex — Readiness Sprint (PLP-Group-41)

Delivery-coordination system for small Kenyan retailers (electronics shops,
pharmacies, hardware stores). Replaces WhatsApp/phone-call coordination with
a system where a retailer logs a delivery request, a dispatcher assigns it
to a rider, and the rider updates its status so the retailer always knows
where the delivery stands.

## Roles

- **Retailer staff** — logs a new delivery request (customer name, phone,
  address, item description)
- **Dispatcher** — sees open requests and assigns each to a rider
- **Rider** — sees assigned deliveries, updates status
  (Assigned → Picked Up → Delivered)

## Folder structure

```
/retailer   → request-logging flow, data model      (owner: Amanda Ireri)
/dispatcher → assignment logic                       (owner: Kiprop Lilian)
/rider      → status-update flow, sync + scanning     (owner: Winnie)
/docs       → trade-off log, demo script, deck        (owner: Abdurehman)
```

Architecture decisions and the retry/backoff + webhook/HMAC pivot work sit
at the repo root — owned by Muyaga, who also leads the live defense.

## Workflow

1. Work on your own branch: `feature/<your-part>` (e.g. `feature/retailer`)
2. Open a PR into `main` when ready — get at least one teammate to look at
   it before merging
3. `main` is protected — no direct pushes
4. Day 1 is a hard freeze/storyboard day, not a coding day — see schedule
   below

## Sprint schedule

| Day | Focus |
|---|---|
| 1 | Freeze build, storyboard deck (one takeaway per slide) |
| 2 | Learn State → Context → Evidence defense framework, first dry run |
| 3 | Mock panel: 10-min pitch + 10-min cross-exam + critique |
| 4 | Revise, rehearse handoffs, prep weak-point answers |
| 5 | Submission |

## Deliverables

- [ ] Frozen build (or documented design, if using the case study as-is)
- [ ] Deck: Problem → Solution → Architecture → Trade-offs → Roadmap
- [ ] One-page trade-off log (3+ weak points, each "acceptable because…")
- [ ] Demo script
- [ ] Timing log from at least two dry runs

# Caars project state

Updated 2026-10-04. Start with ARCHITECTURE.md to distinguish this assistant backend from the Lovable website.

## Verified complete

- Backend GitHub baseline and repository contents inspected read-only.
- Website payment/UI/conversion audits completed by three parallel agency-agents role teams.
- Initial handoff recorded; website implementation dispatched through existing Lovable project using existing credits only.
- No credits purchased; no production payments/refunds initiated.

## P0 — open until verified

- Website webhook must return 5xx on durable persistence failure instead of swallowing errors with 200.
- Exactly one atomic fulfillment task per paid order, including new customers and two orders by the same buyer.
- Gate duplicate delivery side effects; recover missed notifications safely.
- Signed webhook updates paid deposits even when browser is closed; pending/failed UI makes no success promise.
- Identify actual Caars live Stripe account and endpoint, investigate 17 failures, reconcile paginated paid sessions/orders/tasks.
- Verify website commit synchronization to `venturecore/caars-bright-spark` main through Lovable; local BraiGAIP account cannot access that private repository.

### First implementation phase — website SHA 0b134658

Website source commit `0b134658a13a11e9ee40603eebc35ff02f31f7a7` now contains the first payment patch; its diff is preserved in `docs/handoff/2026-10-04-p0-website.diff`. Project-agent trace records live webhook deployment, rolled-back DB checks (new buyer/two orders/repeat/unique session), invalid-signature checks, and 18 paid Caars Checkout Sessions matching 18 stored orders with pagination exhausted. The previous connector-account limitation was resolved through Lovable's project-connected Caars account. Historical 17 delivery failures remain unexplained because old logs are unavailable.

Independent review confirms atomic order/task insertion and restricted RPC grants. Remaining required fixes were dispatched: swallowed Resend errors, unchecked finalization updates, missing claim owner token, concurrent new-contact resolution, deposit handling and neutral pending UI. Do not mark P0 fully complete yet. Historic notification delivery remains UNKNOWN; marking old rows done is a no-resend precaution, not proof of delivery. Historic task dry-run requested; no blanket historical backfill authorized without status evidence.

## P1 — requested implementation running, not yet validated

- Six service cards: Perusselvitys 79 EUR, Etsintä 79 EUR, TuontiApu 250 EUR, Tuontipalvelu SE from1290/DE from1990, contact, financing/trade-in.
- Service-isolated expiring session intake; no customer content in URL parameters or analytics.
- Light public theme with >=4.5:1 normal-text contrast.
- Both chat backends validate service context; financing/trade-in conditionally routes to Autohalli.
- Visible service summaries/FAQ, metadata, canonical/sitemap/prerender records.
- Build/unit and targeted browser checks, reviewed diff and final handoff.

## P2 — continuation

- Ongoing modular commits and refreshed state after every significant phase.
- Payment side-effect outbox/retry observability if not delivered in P0.
- Broader public-page accessibility/contrast checks beyond main service journey.

## Current handoff

### Latest user steering — premium UI/UX

New premium homepage work is authorized and running: one orange purchase theme, secondary search/contact, distinct Autohalli partner card, refined six-card bento layout/inputs, trust badges, restrained motion and semantic calculator/Tesla table. Read `docs/handoff/2026-10-04-ui-ux-update.md` for actual Agency roles, design decisions and pending verification. Preserve the independently reviewed P0 fixes at website SHA 2589a0af.

### Website review checkpoint: SHA 6411c5f, 2026-10-04

- Six cards, service-local session handoff, summaries/FAQ/SEO and new financing route implemented in unpublished preview. Independent local build passed (134 prerender routes, 96 sitemap URLs); 140/140 tests passed across 16 files. Optional audit-PDF regeneration failed because xhtml2pdf is absent; the build continued successfully.
- Main order owner-token fencing, checked finalization, required confirmation errors and per-effect progress verified in source. Additive migrations and webhook are deployed through Lovable. Real delayed-payment end-to-end remains untested.
- Historical classification: 18 paid persisted orders without order-linked tasks; four marked handled, 14 open (12 missing product classification, one Perusselvitys, one Tuonti). No old tasks or customer emails automatically added. Administrative review remains necessary before safe recovery.
- Independent review found remaining deposit busy-claim acknowledgement/ownership/timeout issues, missing service context in fallback chat, absent bot widgets on contact/financing routes, admin-prompt boundary replacement, stale financing CTA route and shared chat session IDs. Corrections dispatched; P0/P1 are not yet declared fully complete.
- User rejected washed-out preview. Restore Caars turquoise/orange, car imagery and section hierarchy while retaining the light accessible base and six functional cards. Design correction is active; preview is not published.
- Diff archive: `docs/handoff/2026-10-04-service-and-payment-website.diff` compares 0b134658 to 6411c5f. This is an intermediate reviewed patch, not the final design.

Baseline website SHA `13b0120d6c81535a9bfa7f3b2aad200a287bffe4`; phase-one request `umsg_01m41trz9jf9da5swrtzbtn7ng` produced website SHA `0b134658a13a11e9ee40603eebc35ff02f31f7a7`. Continuation request `umsg_01m41v2ax8f3ht49rt7m3b4fph` is running, with corrective P0 review request `umsg_01m41v4kz8e2ravzymdbnyk0xx` queued on thread `main`. Phase-one backend deployment and checks are recorded above; frontend publication and final website GitHub SHA synchronization are not yet verified.

Independent local snapshot check: production build passed; unit suite has 118 passed and five obsolete Hero CTA-class tests failed. New card behavior and browser checks remain required. Local npm lock was regenerated for this check because the downloaded lock did not match phase-one package.json; this does not imply the remote lock was repaired.

Lovable UI verified connected/in-sync website repository `venturecore/caars-bright-spark` main. UI showed 602 existing credits; no purchase needed. Initial companion documentation pushed to this backend repository as `1a105819691b7c663b2f6b20ce08ba2967f44d56`, remote SHA verified.

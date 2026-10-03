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
- Identify actual website GitHub remote; verify its commits and push separately from this backend.

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

Lovable request: `umsg_01m41trz9jf9da5swrtzbtn7ng`, thread `main`. Baseline website SHA `13b0120d6c81535a9bfa7f3b2aad200a287bffe4`. No completed implementation, tests, backend deployment, public publication or website GitHub push claimed at this point.

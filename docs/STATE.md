# Caars current state — 2026-10-04

## Repository boundary
This is BraiGAIP/caars-backend, the Python/MongoDB assistant backend. The website is venturecore/caars-bright-spark main, edited through Lovable project 7e00d027-e019-4070-a93a-d6789b55bd24. Website source is also reviewed locally at /Users/he68/Development/caars-bright-spark (snapshot, not Git checkout).

## Complete
- Reviewed and deployed paid-order/deposit persistence, task uniqueness, fenced retry leases and idempotent CRM payment activities. Required confirmation failures remain retryable.
- Six service cards, private service-specific draft handoff, summaries/FAQ, metadata/canonical/prerender records and finance/contact bots.
- Shared mandatory bot boundaries, service-isolated conversation IDs, Autohalli financing/trade-in routing, storage-denied fallback and accessible cookie choices.
- Premium split BMW masthead, trust badges, role-based orange purchase/petrol secondary/neutral partner cards, 16px fields, 48px targets, focus/reduced-motion handling and semantic Tesla table.
- User-confirmed separate 149 EUR Maksupalvelu reflected in public descriptions, example and both bot boundaries. Checkout amounts and historical orders preserved.

## Open
- P0: no remaining critical defect found in the reviewed requested payment paths; real provider delivery is not an exactly-once guarantee.
- P1: inspect 14 historical open orders individually (4 handled; 18 paid sessions match 18 stored orders). Do not resend/backfill without fulfillment evidence.
- P1: real delayed Klarna/provider-failure end-to-end test remains unperformed; historical 17 failure logs unavailable.
- P1: review premium frontend preview before publication. These frontend changes have not been published to caars.fi.
- P2: broader full-site visual regression and prior Cloudflare token/worker follow-ups noted in website state.

## Verification and delivery
Independent final website checkpoint e0ebe189: 153/153 tests, TypeScript and production build passed (134 prerender routes, 96 sitemap URLs). Node26 required --no-experimental-webstorage for jsdom storage tests; optional audit-PDF regeneration warns because xhtml2pdf is absent but build exits0. Browser verified six populated service journeys, clean URLs, reload preservation, 320/390/768/1440 layouts without horizontal overflow, 16px fields/48px CTA and reduced motion. Native 200% browser zoom was not verified.

Lovable Git UI reports venturecore/caars-bright-spark main connected/in sync; private remote SHA cannot be independently read by local BraiGAIP gh. Companion docs/diffs are committed and pushed separately. Final card-spacing and explicit mobile table-role fixes are complete and revalidated; website source e0ebe189. See the UI handoff for diffs and screenshots.

## Continue
Read ARCHITECTURE.md and docs/handoff/2026-10-04-ui-ux-update.md. Make modular source commits in the website repository; keep this companion report distinct. No credits were purchased, no real payment/refund or historical resend was performed.

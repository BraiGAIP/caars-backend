# Caars.fi — Architecture (current 2026-10-04)

## Runtime and source
- React 18 + Vite SPA in `src/`; SEO prerendering in `scripts/prerender.mjs`; Cloudflare Worker in `cloudflare-worker/`.
- Lovable Cloud provides the database, authentication and functions in `supabase/functions/`.
- Website source is platform-connected to `venturecore/caars-bright-spark`, `main` (verified by Codex in Lovable UI). The private remote SHA is not independently readable by the local BraiGAIP gh account; final platform Git UI recheck reports in sync.

## Public service routing and private handoff
- Canonical service routes: `/perusselvitys`, `/auton-etsinta`, `/tuontiapu`, `/tuontipalvelu`, `/yhteystiedot`, `/rahoitus-ja-vaihtoauto`.
- Homepage card data is sanitized and passed first in React Router state, with service-specific `sessionStorage` recovery for 30 minutes. Storage access is obtained inside guarded code, so a denied storage getter cannot prevent router-state navigation.
- User messages, topics and car links are never put in query strings/fragments or analytics. Each service key is isolated; headings navigate without input and no draft is auto-sent.

## Public homepage design architecture
- The six-card DOM order follows the shared `SERVICES` configuration and the existing 1/2/3-column breakpoints. Cards are forms only for their own optional draft field; the card itself is not a click target.
- `CARD_STYLES` assigns one semantic visual role per service: `purchase`, `secondary` or `partner`. Styling is scoped under `.home-premium` and `.home-cost-module`, preventing homepage color/motion rules from changing admin or payment views.
- Purchase services share one accessible orange CTA. Etsintä/contact use a petrol outline. Finance is a non-SKU partner card with an Autohalli text badge and an internal route CTA; no unverified partner logo or external glyph is used.
- The masthead keeps text and the existing BMW photo in separate 55/45 desktop columns and stacks the photo after text on mobile. Trust statements use existing verified claims only.
- The cost example is an HTML table with a caption, `th scope="row"`, tabular right-aligned values and a `tfoot` total. At narrow reflow widths each row stacks without changing source order or amounts.
- Inputs and actions have 48 px minimum targets, 16 px service-field text, persistent labels and visible focus rings. Hover motion is pointer-gated; `prefers-reduced-motion` removes scoped transitions/transforms.

## Chat architecture
- `claude-chat` is the primary endpoint and `chat` is the fallback. Both validate the same six service IDs and append the shared mandatory safety context after any admin-replaceable prompt.
- Limits cover exact service scope/prices, one Swedish-car remote Perusselvitys based on seller information/photos, no physical inspection or condition guarantee, separate payments, no euro car-tax estimate and restricted financing/trade-in claims.
- Browser chat `session_id` is service-scoped for conversation state, admin threads and contact-request suppression. A separate anonymous `visitor_id` remains shared for attribution/aggregate analytics.

## Checkout and payment verification
- Stripe API version: `2025-08-27.basil`.
- `create-checkout` owns the price catalogue; client amounts are not trusted. Products: 79 € Perusselvitys, 79 € Etsintäpalvelu, 99 € Etsintäpalvelu +, 250 € TuontiApu and Sweden full import from 1 290 €. Germany from 1 990 € is quote-only.
- Maksupalvelu is a separate 149 € service and is not included in Tuontipalvelu. Public pricing, the knowledge base and both chats preserve this boundary; the Tesla example excludes it from its displayed total.
- `verify-checkout-session` lets the success page trust only a server-verified paid session. A valid delayed payment can be pending; cancelled/expired/failed/unknown sessions do not receive paid success content or Purchase events.

## Paid-order webhook and schema
1. `stripe-webhook` verifies the raw body and `stripe-signature`; missing/invalid signatures return 400.
2. Non-relevant events return 200. Unpaid completed and async failure create no paid fulfillment. Paid completed or `checkout.session.async_payment_succeeded` proceed idempotently.
3. `orders.stripe_session_id` is unique. The paid-order transaction creates/resolves the CRM contact, case and one `control_center_tasks` row protected by unique `order_id`; normalized-email resolution is serialized.
4. `claim_order_side_effects_v2(order_id, stale_seconds)` returns a unique owner token. `mark_order_side_effect` renews/records one effect and `finish_order_side_effects` finalizes/resets only for that token. The old unfenced claim is deprecated.
5. `cc_record_order_payment_crm(order_id)` atomically links the contact, sets the won stage and inserts one payment activity keyed by Stripe session.
6. Required CRM/customer/admin confirmation failures release the lease and return retryable 5xx. Resend uses stable provider idempotency keys and eight-second bounds. CAPI/admin push are awaited, bounded and best-effort.

Relevant fields: `orders.status` remains payment state; `followup_status` is `open|handled`; `side_effects_status`, `side_effects_claim_token` and `side_effects_completed` track processing. `cc_reconcile_order_tasks(false)` is read-only; apply mode must follow case-by-case evidence.

## Deposit confirmation
- `commitment_deposits` stores `confirmation_claim_token` and `confirmation_last_error`.
- `claim_deposit_confirmation_v2` grants a stale-reclaimable owner-token lease; `finish_deposit_confirmation` permits only the current owner to mark sent or reset.
- Signed webhook and browser verification share the same helper. Already-sent, busy-unsent and newly-sent are distinct; busy or missing expected deposit returns retryable failure. Checkout session attachment errors are checked.

## Delivery guarantees and historical data
- Database uniqueness, fenced leases and provider idempotency make retries safe but do not mathematically guarantee exactly-once external delivery.
- The 18 historical orders were marked `done` only to block automatic resends. Their notification delivery remains UNKNOWN.
- Current aggregate classification is 4 handled and 14 open; review the 14 individually before any apply-mode reconciliation.
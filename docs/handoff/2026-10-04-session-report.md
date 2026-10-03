# Caars.fi — 2026-10-04 session report

## Initial verified state

- This Drive workspace is documentation, not a Git checkout.
- Actual React application is Lovable project `7e00d027-e019-4070-a93a-d6789b55bd24`, baseline commit `13b0120d6c81535a9bfa7f3b2aad200a287bffe4`.
- `BraiGAIP/caars-backend` is a separate Python application, not the website repository. Actual website GitHub remote remains unidentified; user was asked for its URL.
- No new credits purchased. Existing credits only, no Max mode.
- Three parallel audits used the local `msitarzewski/agency-agents` role definitions. Some requested names do not exist: backend/software architect and growth hacker cover the corresponding responsibilities.

## Verified P0 findings

- `supabase/functions/stripe-webhook/index.ts` returns 200 even on database errors or its eight-second timeout, suppressing Stripe retries.
- Session uniqueness prevents duplicate orders but does not prevent repeated email/admin/CAPI effects.
- Paid-order trigger needs an existing CRM contact before webhook creates it; new buyers can miss delivery tasks.
- Task deduplication by contact/case/title merges distinct orders from the same buyer. Require an order foreign key and unique task invariant.
- PaymentSuccess pending screen incorrectly shows success styling and an order-confirmed heading.
- Deposit metadata is not recognized by webhook; deposit status depends on browser verification. Verification can repeat emails and stamp success after email failure.
- Exposed Stripe account BRAI `acct_1TRdiqE0dI2e9F1o` has only webhook endpoints for other projects, not Caars. Reported 17 failed attempts and payment reconciliation NOT verified. Do not alter those unrelated endpoints.

## Verified UI/chat findings

- Homepage has two action cards, no service inputs or service-page navigation.
- Global theme is dark and public components contain hardcoded dark backgrounds/white text.
- Shared chat does not pass service context to either backend.
- Vehicle-link shortcut bypasses backend and always offers Perusselvitys, including German listings.
- `chatCtaActions.ts` exposes vehicle URL through `?auto=`. Replace with guarded, expiring, per-service session state.
- Primary Claude prompt omits TuontiApu 250 EUR and includes obsolete 99 EUR. Shared price JSON already has requested prices.
- Autohalli knowledge text overpromises financing; rewrite conditionally and clarify direct import accepts no trade-ins.

## Work dispatched

Implementation requested in the existing Lovable application, message `umsg_01m41trz9jf9da5swrtzbtn7ng`, thread `main`:

1. Repository architecture/state/handoff documents before edits.
2. Durable paid-order/task persistence, retryable errors, idempotent side effects and recovery verification.
3. Six light service cards with session-only state, service bots and summaries/FAQ/SEO.
4. Build/unit/browser validation, modular commits and verified GitHub sync where accessible.

Status at creation: implementation running; no completed fixes, tests, deployment or GitHub push claimed yet. This file is a local audit copy; the actual application repository must receive and maintain its own documents.

## Required next verification

- Read completion response and actual diff; audit SQL atomicity/security and both chat endpoints.
- Verify preview card navigation, refresh/back and clean URLs; check contrast and metadata.
- Record real test output and commit SHAs, distinguish preview/source/backend deployment/public publication.
- Obtain actual GitHub remote and actual Caars Stripe account before claiming sync or reconciliation.
- Cover concurrent duplicates, two orders/same buyer, first-time buyer, rollback/retry and delayed payments.

## Repository and credit follow-up

- User supplied `BraiGAIP/caars-backend`; inspected source confirms it is the assistant backend. Companion architecture/state/handoff committed and pushed there at `1a105819691b7c663b2f6b20ce08ba2967f44d56`; GitHub remote main SHA verified equal.
- Lovable Settings → Git → GitHub identifies actual website repo `venturecore/caars-bright-spark`, branch main, Connected / In sync. Local BraiGAIP CLI access fails repository-not-found; do not replace its remote or overwrite assistant backend with website source.
- Lovable UI showed 602 credits remaining. No new credits needed/purchased.

## First implementation phase

- Website source SHA `0b134658a13a11e9ee40603eebc35ff02f31f7a7`, patch archived as `2026-10-04-p0-website.diff`.
- Project-agent trace: webhook deployed, missing/invalid signature rejected, rolled-back database checks passed; 18 paid sessions in actual Caars account matched 18 stored orders and Stripe pagination exhausted. Historical failure cause not verifiable.
- Independent reviewer confirms unique order_id task + AFTER INSERT trigger atomicity and service-role-only grants. Found swallowed Resend errors, unchecked done/reset writes, stale claim lacking owner fencing and contact creation race. Follow-up dispatched to repair before claiming completion.
- Deposit metadata/confirmation and pending success-page fixes also dispatched with UI/chat/SEO phase.
- Historical notifications unknown; avoid automatic resend. Historical order task dry-run requested with follow-up status classification.
- Source ZIP downloaded through Lovable UI to local inspection workspace `/Users/he68/Development/caars-bright-spark`; it is a source snapshot, not a Git checkout. `npm ci --ignore-scripts` failed due to existing stale package-lock; local dependency installation/verification underway. No CI pass claimed.

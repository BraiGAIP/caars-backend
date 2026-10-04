# Caars architecture and repository boundaries

Verified 2026-10-04 at backend baseline `cb63af937f365f76acb7c455fd7b80ad9a0c2c99`.

## This repository: personal/business assistant backend

`server.py` implements FastAPI with `/api` routes, Pydantic models, asynchronous MongoDB access through Motor and Anthropic chat. `Procfile` starts Uvicorn; `requirements.txt` contains runtime dependencies. No React frontend, Supabase migrations or Stripe Checkout/webhook implementation is present here.

### Storage model

MongoDB collections include users, user_sessions, emails, tasks, business_profiles, brands, auto_reply_rules, reply_templates, chat_messages, pending_actions, invoices and Google OAuth token collections. Records are scoped with user_id; UUID application IDs are separate from MongoDB _id. Startup creates unique user email/user_id and session_token indexes, an expiry TTL index, and user/date indexes for emails/tasks. Exact field models and route authorization live in `server.py`; MongoDB has no SQL migrations in this repository.

### Routing and integrations

- `/api/auth/*`: exchanges external sessions and verifies bearer tokens against stored sessions.
- `/api/emails/*`, `/api/auto-reply-rules`, `/api/reply-templates`: review/generation workflows and reply settings.
- `/api/assistant/*`: conversation history and explicit action execution/cancellation.
- `/api/tasks`, `/api/calendar/events`, `/api/invoices`: personal organization and invoice records.
- `/api/google/*`, `/api/gmail/messages`: Google OAuth, separate email/calendar tokens, synchronization and Gmail delivery.
- `/api/business-profile/*`: company context and brands.
- `/api/webhook/message`: shared-key intake into the owner's email review queue. This is NOT a Stripe webhook.
- `/api/scrape/caars`: website information ingestion.

Automatic reply during inbox synchronization is disabled in code. Preserve that decision unless explicitly authorized to change it. Do not commit credentials, OAuth tokens, customer messages or production payment records.

## Caars.fi website: separate Lovable application

Editor: https://lovable.dev/projects/7e00d027-e019-4070-a93a-d6789b55bd24

Verified website baseline: `13b0120d6c81535a9bfa7f3b2aad200a287bffe4`. React 18/Vite/TypeScript, Tailwind/shadcn, React Router; Lovable Cloud/Supabase PostgreSQL and Deno functions. Supabase reference `cpmiqrrukdntypgflrdq`. Lovable Git settings identify `https://github.com/venturecore/caars-bright-spark.git`, branch `main`, as connected and in sync at inspection. The local BraiGAIP GitHub account cannot read/clone this private repository (repository not found); Lovable remains the authorized website edit/sync surface. Do not imply this backend repository is automatically synchronized with the website.

### Reviewed website architecture

The website uses server-priced Checkout, signature-verified webhook events, unique Stripe session/order-task keys and atomic paid-order/CRM persistence. Main-order and deposit confirmations use separate owner-token-fenced retry leases. Required confirmation failures return retryable errors; provider idempotency reduces duplicate sends but does not prove exactly-once external delivery.

Six canonical service routes use sanitized router state with isolated 30-minute sessionStorage recovery. Customer drafts never enter URL queries/fragments and are not sent automatically. Both chatbot endpoints validate service context and append mandatory safety rules after custom prompts; chat conversation IDs are service-scoped. Maksupalvelu is a separate 149 EUR service, excluded from Tuontipalvelu and the Tesla illustrative total.

Full reviewed schema/RPC/routing/design description is preserved in `docs/handoff/2026-10-04-website-architecture.md`. The website's own `docs/ARCHITECTURE.md` remains the implementation authority.

Lovable verified the actual Caars live Stripe account and exhausted pagination: 18 paid sessions match 18 stored orders. Historical 17 failed-delivery logs are unavailable; original cause and historic notification delivery remain unknown. Four historical orders are handled, 14 remain open for individual fulfillment review. No blanket backfill or resend was performed.

## Handoff protocol

Read `docs/STATE.md` and latest `docs/handoff/*` before work. Each completed feature records changed files, tests, source commit, deployed/preview/public status and blockers. Commit and push modular changes; verify the remote SHA. Website changes must remain in the website repository; this backend can hold cross-project audit summaries and reviewed patches as explicitly labeled artifacts.

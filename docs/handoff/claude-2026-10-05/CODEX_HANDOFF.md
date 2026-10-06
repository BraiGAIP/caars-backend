# Caars.fi: handoff for Codex (or any AI assistant)

Written by Claude on 2026-10-06 at the end of the 2026-10-05/06 session. Read this first, then
`../2026-10-05-homepage-review.md` (the running log with every phase in detail).

## 1. Where the code lives

| What | Where |
|---|---|
| Website + Supabase backend (React 18, Vite, Tailwind, Supabase Edge Functions) | Lovable project `7e00d027-e019-4070-a93a-d6789b55bd24`, auto-synced to GitHub **`venturecore/caars-bright-spark`**. Connect Codex to that repo to edit code. |
| Lovable editor | https://lovable.dev/projects/7e00d027-e019-4070-a93a-d6789b55bd24 |
| Preview | https://id-preview--7e00d027-e019-4070-a93a-d6789b55bd24.lovable.app |
| Production | https://caars.fi (Hans publishes from Lovable; nothing goes live on the frontend without his "Julkaise" click) |
| This repo (`BraiGAIP/caars-backend`) | Handoff docs, review logs, Claude-authored source copies (`authored/`) and the briefs sent to Lovable (`lovable-briefs/`). |

Edge Functions deploy to production **immediately** when they change in Lovable; there is no staging.
Hans approved "direct after tests" for rule-tightening changes (2026-10-06).

Rules inside the website repo: read its `AGENTS.md`, `roadmap.md`, `CAARS_AGENTS_OFFICE_MASTER_PLAN.md`
and `docs/qa/public-pages-layout-inventory.md` first.

## 2. Hans's binding decisions (do not change without asking him)

**Customer messages**
- Bots never send automatic customer messages (email/WhatsApp) without admin approval in Control Center.
- `send-analyzer-followup` and `recovery-dispatch` now only create drafts in `outbound_message_drafts`. They are approved in Control Center → **Hyväksyntäjono** (`/control-center/hyvaksyntajono`, Edge Function `outbound-draft-decide`).
- Exception: `send-hero-analyzer` (an analysis the customer requests themself) still sends immediately.

**Prices**
- Sweden: Perusselvitys 79 € (one car).
- Germany: never Perusselvitys. Offer Etsintäpalvelu 79 € / Etsintäpalvelu+ 99 €, or Saksan tuontipalvelu alk. 1 990 €.
- Tuontipalvelu from Sweden: alk. 1 290 €.
- TuontiApu: 250 €.
- (The original superprompt's 149 € / 1 290 € figures for Germany were wrong.)

**Car tax**
- Euro amounts come ONLY from the deterministic **Autoverolaskuri** (`supabase/functions/_shared/carTaxCalculator.ts` → `estimateCarTax`). It is used by the `/autoverolaskuri` page and by both chatbots. The model never invents numbers.
- The user gives their own estimate of the car's price in Finland.
- The result is a range: ±8 %, rounded to 100 €.
- The combined CO2 value is used; the NEDC/WLTP table is selected by first-registration date.
- Mandatory disclaimer, appended in code to every bot answer that mentions autovero and always visible on the page:
  "HUOM: Autoverolaskurin antama summa on suuntaa-antava arvio, joka perustuu antamaasi arvioon auton hinnasta Suomessa sekä auton päästö- ja rekisteröintitietoihin. Lopullisen autoveron määrää aina Verohallinto. Caars ei vastaa veroarvion oikeellisuudesta."

**Other bot rules**
- Fixed exchange rate **1 € = 11 SEK** everywhere (bot + site), `SEK_PER_EUR`.
- First analysis free for anonymous visitors: 1 listing per visitor per 30 days (`anonymous_analysis_usage`). After that, the bot asks for contact info or suggests the paid service by country.
- VAT/margin detection for SE + DE listings (`_shared/vatDetect.ts`). Never promise VAT refunds.
- EV 2026 note: the vehicle tax base rises 53,29 → 106,21 €/v (law 814/2024).
- Registry vs test drive: a registry/history check does not replace a test drive or physical inspection; recommend both.

**Process rules**
- Do not remove safety features (safety banners, contact-info warnings, meeting verification).
- Do not let Lovable design visuals (Hans rejected Lovable-designed visuals twice). Claude/Codex writes exact code; Lovable only installs it.

## 3. Brand system (approved by Hans)

Reference image: `assets/brand-reference-social-post.jpg`. The site may be fresher and lighter than the post, but must keep its look.

**Colours**
| Role | Value |
|---|---|
| Graphite background (not pitch black) | `#22272D` |
| Dark card | `#2C333A` |
| Footer | `#1A1E23` |
| Light surfaces | `#F2F3F1` / white |
| Orange on dark | `#F27A13` |
| Small orange text on light | `#B4520A` |
| Turquoise | `#22C3A6`, always with dark text `#16191D` |
| Text on light | `#1B2025`, `#3E474F` |

**Type and components**
- Headings: Exo 2 (`font-display`), font-black, uppercase.
- Eyebrow: `text-xs font-extrabold uppercase tracking-[0.14em]`.
- Orange rule: `h-[3px] w-[120px] bg-[#F27A13]`.
- Chamfer: `[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]`.
- Buttons: square-ish (4 px), uppercase, `min-h-[52px]`. Orange buttons have dark text.

**Never**
- Pale mint/green.
- Wide orange CTAs on white.
- Text that does not contrast with its background.

**CSS layers**
- `src/styles/public-light.css` is a legacy light layer that rewrites white text and dark backgrounds site-wide.
- Opt-outs:
  - `.brand-contrast`: keep white/brand text;
  - `.brand-surface`: do not repaint the background (needed even for `hover:bg-[#22272D]`);
  - `.brand-light-card`: white card inside a dark scope;
  - `[data-hero-video]`: dark media hero;
  - `[data-watermark]`: decorative text, excluded from the audit.
- `src/styles/brand-skin.css` (loaded after public-light) gives legacy pages the brand look.

**Contrast QA**
- Run `node scripts/contrast-audit.mjs` against the dev server.
- It runs axe plus per-element pixel sampling on every sitemap route at 390×844 and 1440×900, and writes `docs/qa/contrast-2026-10-05.json`.
- Acceptance is always `totalViolations: 0`, `pixelFailures: 0`.
- Read the JSON yourself; do not trust a summary.

## 4. What was done in this session (website commits in the Lovable repo)

| Phase | Commit | Content |
|---|---|---|
| Hero v2 | `1c1e61de` | Six service cards inside a graphite video hero, visible without scrolling (`ServiceCardsHero.tsx`) |
| Contrast fix | (2026-10-05 evening) | public-light opt-outs, neutral tokens, HeroPriceExample / WhyCaars / HowCaarsWorks / final CTA |
| Phase 1 | `3e3d1f16` | Homepage lower sections, dark header, footer, JSON-LD fixes, duplicate sections removed |
| Phase 2 | `da8dcf23` | SEOPageLayout + ServiceLandingPage brand style, `brand-skin.css`, layout inventory |
| Phase 3 | `933557e5` | Turquoise CTA contrast, MALLI watermark, audit 0/0 (verified from raw JSON). **Published by Hans 2026-10-06.** |
| Phase B (backend) | `cd814a02` | Country rules in both chatbots, emails and listing guidance; `vatDetect`; `LISTING_RULES_PROMPT`; anonymous 1-free-analysis; approval queue (`outbound_message_drafts`, `outbound-draft-decide`, Hyväksyntäjono page). 184/184 tests. Claude verified that the two cron senders no longer call Resend. |
| Phase C | `cc5f690e` | Autoverolaskuri: tables from vero.fi (1172/2021, 777/2020, 1365/2018 WLTP, 1481/2015 NEDC), `estimateCarTax`, `/autoverolaskuri` page (Claude design), chatbot tool use + code-appended disclaimer, SEK=11 everywhere. 197/197 tests, audit 0/0. |
| Phase D | in progress 2026-10-06 | Homepage FAQ (`HomeFAQ.tsx` + `shared/homeFaq.json`), one Organization + AutomotiveBusiness (LocalBusiness) + FAQPage JSON-LD, old "no euro tax estimate" texts replaced |

Exact source of every Claude-designed component is in `authored/`. The briefs sent to Lovable are in `lovable-briefs/`.

## 5. Open items (next steps)

1. **Publish** (Hans): phases B–D frontend (Autoverolaskuri page, homepage FAQ, Hyväksyntäjono page). Until then, approval drafts wait in the DB and nothing is sent.
2. **Phase D:** verify its report (one Organization in the prerendered `/`, JSON-LD parses, audit 0/0).
3. **Autoverolaskuri gaps** (the calculator sends users to Verohallinto instead of guessing):
   - WLTP cars registered 1.9.–2.12.2018 (the table is a scanned PDF and must be typed in by hand and double-checked);
   - cars registered before 2016;
   - cars without EU type approval.
4. **Small email polish:** the analyzer follow-up CTA is white text on orange (≈2.8:1); it should use dark text `#16191D`. The `send-hero-analyzer` email footer still mentions Perusselvitys for every country.
5. **Superprompt agents:** "integrate 5 agents from the 280-agent repo" is not started. That repo was never identified, so ask Hans which repo and which agents. Constraint: agents may analyse and draft, but every customer message goes through Hyväksyntäjono.
6. **GEO:** robots.txt and llms.txt exist and prerender covers the sitemap. After publishing, recheck llms.txt against the new rules (Autoverolaskuri, SEK 11).
7. **FounderSection** says "Toimisto Turussa" while the address is Raisio (Tuotekatu 13a). Ask Hans which wording he wants.

## 6. Working method that worked

- Read code with Lovable `read_file` (free); `send_message` costs credits.
- Send Lovable **exact code + acceptance criteria**, never "design something".
- After every Lovable phase:
  1. read the audit JSON and the key changed files yourself;
  2. record the phase in `../2026-10-05-homepage-review.md`;
  3. commit/push this repo.
- The session network blocks caars.fi, lovable.app and vero.fi, so verification was done via Lovable's sandbox and the raw audit JSON.

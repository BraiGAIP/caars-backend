# Caars.fi homepage review — 2026-10-05 (read-only)

Source: Lovable project `7e00d027-e019-4070-a93a-d6789b55bd24`, commit `a90ab49954f7e3eff0f7954f08d1cba5ac5570c9`
(last edited 2026-10-05 11:55 UTC). Reviewed by reading source via Lovable MCP. caars.fi and
`*.lovable.app` were blocked by this session's network policy, so no live browser rendering,
mobile measurement or published-vs-preview comparison was performed. No code was changed and
no Lovable credits were used.

## Current homepage order (`src/pages/Index.tsx`)
1. `ServiceCardsHero`: masthead (H1 "Parempi auto samalla rahalla", subtitle, 3 trust badges, BMW photo) + six service cards from `src/config/services.ts`
2. `HeroPriceExample` (Tesla Model 3 cost table, Maksupalvelu excluded)
3. `WhyCaars` → 4. `HowCaarsWorks` → 5. `HeroTrustReviews` + `Testimonials`
6. `HeroPathCards` → 7. `SavingsComparison` → 8. `WhyCheckSection` → 9. `CustomerReviews`
10. `FounderSection` → 11. `CompletedDeals` → 12. `Pricing` → 13. final CTA

## Prices — consistent with confirmed catalogue
Perusselvitys 79 € (Sweden only), Etsintäpalvelu 79 €, Etsintäpalvelu + 99 €, TuontiApu 250 €,
Maksupalvelu 149 € (separate), tuonti Sweden from 1 290 € / Germany from 1 990 €.
Hans confirmed 2026-10-05: German leads → Etsintäpalvelu 79 € / Etsintäpalvelu + 99 € or
import from 1 990 €. The superprompt's "149 € etsintä / Germany 1 290 €" figures were wrong.
Car-tax policy confirmed: no euro car-tax estimate from bots; disclaimer text only.

## Findings
- F1 Duplicate choice sections: `HeroPathCards` (Löysin/Etsi/Automyyjä) and `Pricing` repeat the six cards; `Testimonials` and `CustomerReviews` overlap. Long page, diluted CTA.
- F2 Naming: card says "Tuontipalvelu", pricing.json/llms.txt/cost table say "Avaimet käteen -tuonti".
- F3 JSON-LD: Product named "Auton esitarkistus (79 €)" instead of Perusselvitys; import Service URL `/auton-tuontipalvelu` vs canonical `/tuontipalvelu`; Organization logo `https://caars.fi/logo.png` not in `public/` (likely 404); aggregateRating 127 reviews needs on-page review backing; no LocalBusiness/FAQPage/SoftwareApplication on homepage.
- F4 Floating layers: FloatingWhatsApp, "Pikayhteydenotto" side tab, ChatBot, WelcomeWidget (bottom 140px mobile), LiveNotifications (suppressed only while sticky CTA active), sticky mobile CTA, CookieConsent, ExitIntent. Mobile one-floating-layer rule must be verified in a real browser.
- F5 Claim consistency: "vuodesta 2016" vs LiveNotifications "yli 9 vuoden kokemuksella".
- F6 No AI search field in the masthead yet. `HeroAISearch.tsx`, `HeroLinkCapture.tsx` and `AICarSearch.tsx` already exist and should be reviewed for reuse.
- Already done: robots.txt allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot (+~15 more); `public/llms.txt` exists with country rules, tax notes and correct prices; prerender (134 routes).
- Unverified: llms.txt "EV perusvero +52,91 €/v, laki 814/2024" needs a source check.

## Next (awaiting Hans)
AI search field inside the masthead above the six cards (not replacing them), F1–F5 fixes,
Edge Function rules (disclaimer appended in code, VAT/margin detection, EV 2026 note,
registry-vs-test-drive, anonymous first analysis) in preview only, no publication.

## Hero redesign — 2026-10-05 (preview only, not published)
Hans rejected the pale hero (it had lost its colours, background photos and video, and the boxes were dull) and gave the 2026-10-04 social post (dark, Exo 2 uppercase, orange #F27A13, chamfered orange line, turquoise logo) as the brand reference.
The Lovable plan was approved and implemented: website commit `8b92439c` (agent-reported `a80fb3ec`), 5.4 credits.
- Changes: video hero (Volvo V90) with dark overlay, orange eyebrow, H1 "PAREMPI AUTO SAMALLA RAHALLA" + orange "— RUOTSISTA TAI SAKSASTA", dark trust chips, all six cards inside the hero with photo headers, chamfered orange edge, uppercase titles, role-coloured prices and chat-composer fields.
- Files: `ServiceCardsHero.tsx`, `index.css` (scoped), `ServiceCardsHero.test.tsx`.
- Agent-reported checks: 17/17 card tests, TypeScript and build; 320/390/768/1440 without overflow. The full suite was not independently rerun from this session (network policy blocks preview hosts).
- Open: Hans to review the preview; decide whether card bodies should also go dark/tinted instead of white.

## Hero v2 — Claude-designed, installed exactly (2026-10-05, preview only)
- Hans rejected the Lovable-designed hero ("Lovable should not design visuals"). Claude designed the mockup instead: canvas artifact https://claude.ai/artifact/7Nr5eAD92jsbjsDpX38B7i (private). Hans approved it and asked for a graphite background instead of black (#22272D).
- Requirement: all six boxes are visible without scrolling. Desktop 3×2 compact cards on the video hero, each with a chat field and a JATKA button. Mobile 2×3 tap tiles; tapping a tile expands its field in place (no extra floating layer).
- Code written by Claude and installed by Lovable byte-for-byte (`cmp` EXACT_CODE_MATCH), plus a follow-up: `brand-contrast brand-surface` on the hero section, and `:not(.brand-contrast *)` added to the orange-text and white-border rules in `src/styles/public-light.css`. Without these, that light-theme layer turned the white text dark. Mobile `pb-24` keeps the last expanded tile scrollable above the sticky CTA.
- Agent-reported: 159/159 tests, build OK, computed colours verified (h1 white, orange rgb(242,122,19), turquoise rgb(34,195,166)), six boxes inside 1440×900. Credits 3.5 + 2.1. Latest website commit `1c1e61de` (agent-reported `85efc2d7`). Not published.
- Open: the site header stays light (the mockup header was dark), pending Hans's decision.

## Site-wide colour/contrast fix + brand sections (2026-10-05 evening, preview only)
- Hans reported, testing on mobile: dark-on-dark hero text on /autoliikkeille and /hinnasto, remaining pale mint/green surfaces, peach chips and wide orange CTAs on white. Root cause: `src/styles/public-light.css` rewrote `text-white` and `bg-black/*` site-wide.
- Fix: `data-hero-video` on HeroVideoBackground, dark-scope exemptions (`.brand-contrast`, `section:has([data-hero-video])`), neutral tokens (mint → `90 5% 95%`, petrol CTA → graphite, primary → #F27A13 with dark text, radius 0.375rem), a graphite sticky mobile bar and no emoji in headings.
- Claude-written brand sections installed exactly: HeroPriceExample (light, chamfer card, graphite total row), WhyCaars (graphite numbered cards), HowCaarsWorks (white, graphite rule, orange number tiles) and the final CTA (graphite + photo).
- Objective QA: `scripts/contrast-audit.mjs` (axe color-contrast + per-element pixel sampling), all sitemap routes at 390×844 and 1440×900. Final report `docs/qa/contrast-2026-10-05.json` generated 2026-10-05T19:42Z: 186 page views, 0 axe violations, 170 incomplete items all pixel-checked, 0 pixel failures. Worst case 3.06:1 on large text. Claude read the raw JSON independently.
- Not published.

## "Tee kaikki sivusto kuntoon!" — phases 1–3 (2026-10-05 night, preview only)
- Phase 1 (website commit `3e3d1f16`): homepage lower sections rebuilt in brand style (HomeReviews new, WhyCheckSection graphite, CompletedDeals, SavingsComparison, FounderSection, Pricing graphite band with white price cards; checkout logic unchanged), dark graphite header site-wide, darker footer. Removed duplicate sections from Index (HeroTrustReviews, HeroPathCards, Testimonials, CustomerReviews) — fixes F1. JSON-LD: Product "Perusselvitys (79 €)", aggregateRating removed (no on-page backing), logo `/images/logo-square.png` — fixes F3 partly.
- Phase 2 (website commit `da8dcf23`): SEOPageLayout and ServiceLandingPage rewritten in brand style (graphite video hero, orange eyebrow + rule, chamfer cards). New `src/styles/brand-skin.css` (loaded after public-light.css) gives legacy bespoke pages the brand look: legacy dark gradient sections → graphite with white text, legacy primary buttons → square orange with dark text, pill eyebrows → orange text, orange rule under section h2, orange top accent on legacy cards. Inventory `docs/qa/public-pages-layout-inventory.md` (route → component → layout).
- Phase 2 audit left 14 axe violations (white text on turquoise "Kysy AI:lta" buttons, 2.05:1, on 7 SEOPageLayout pages) and 1 pixel failure (MALLI watermark on /perusselvitys had been turned solid dark orange by the light layer).
- Phase 3 (sent to Lovable): brand-skin rules 6 (turquoise buttons → #22C3A6 with #16191D text, word-match so hover-only outline buttons are untouched) and 7 (`[data-watermark]` at 6 % graphite); MALLI span gets `data-watermark`; audit script excludes only `[data-watermark]` (WCAG 1.4.3 incidental text) and reports `watermarkExcluded` in the summary. Acceptance 0 violations / 0 pixel failures / 0 errors.
- Not published. Remaining superprompt items: Edge Function rules, LocalBusiness/FAQPage schema, agent integration (approval queue only, no auto-sending).
- Phase 3 result (website commit `933557e5`, 2.1 credits): Claude read the raw audit JSON (generated 2026-10-05T21:17Z) independently. 186 page views, 0 axe violations, 156 incomplete items all pixel-checked, 0 pixel failures, 0 errors; 2 exclusions, both the MALLI watermark on /perusselvitys (one per viewport). Worst case 3.06:1 on large orange text (threshold 3:1); orange eyebrows 4.57:1 (threshold 4.5:1). "Kysy AI:lta" computed rgb(22,25,29) on rgb(34,195,166). 164/164 tests, build OK. Not published — awaiting Hans's review of the preview.

## 2026-10-06: publish + backend rules + Autoverolaskuri
- Hans published phase 3 and said "voit edetä".
- Decisions (AskUserQuestion, 2026-10-06):
  - stop automatic emails 2 + 3 (analyzer follow-up, recovery) and route them to an approval queue; `send-hero-analyzer` stays immediate;
  - backend changes go direct after tests;
  - 1 free link analysis per anonymous visitor;
  - build an Autoverolaskuri instead of a "no euros" disclaimer.
- Hans's Autoverolaskuri spec:
  - name "Autoverolaskuri", with its own subpage and support in the chatbot;
  - the user's own Finnish price estimate is the input;
  - combined CO2 with the correct NEDC/WLTP rule;
  - result as a euro range;
  - SEK = 11 site-wide;
  - the disclaimer is always visible;
  - the page includes self-help links to Verohallinto.
- Phase B (website commit `cd814a02`, 17.8 credits):
  - country rules in code (both chatbots, `listingExtract`, `send-hero-analyzer`, `send-analyzer-followup`);
  - `vatDetect` for SE + DE;
  - `LISTING_RULES_PROMPT` (VAT, EV 2026, registry vs test drive);
  - `anonymous_analysis_usage`;
  - `outbound_message_drafts`, `outbound-draft-decide` and the Hyväksyntäjono page;
  - 184/184 tests;
  - Claude read both cron functions and confirmed they no longer send.
- Phase C (`cc5f690e`, 19.1 credits):
  - vero.fi tables encoded;
  - `estimateCarTax`;
  - `/autoverolaskuri` installed from Claude's exact code;
  - claude-chat uses tool use; the chat fallback runs a pre-compute step;
  - disclaimer appended in code;
  - SEK conversion changed from about 11.5 to 11 in two places (the homepage Tesla example is now ~25 400 €);
  - 197/197 tests, audit 0/0 on 94 routes.
  - Claude checked the 128 g/km → 11,1 % → 3 200–3 900 € example against table 1 A.
  - Unsupported (the calculator sends users to Verohallinto): WLTP 1.9.–2.12.2018, before 2016, no EU type approval.
- Phase D (approved by Hans via the Lovable plan pause; in progress): HomeFAQ + FAQPage, a single Organization + AutomotiveBusiness, old "no euro estimate" texts replaced.
- Codex handoff: `claude-2026-10-05/CODEX_HANDOFF.md`.
- Phase D done (website commit `947278e6`, 9.2 credits):
  - HomeFAQ is placed before the final CTA;
  - the prerendered `/` has 1 Organization, 1 AutomotiveBusiness and 1 FAQPage (the old unverified LocalBusiness with opening hours, geo and reviews was removed);
  - the old "no euro tax estimate" texts are replaced on Auton etsintä, Ajoneuvon tuonti, Kuljetus ja rekisteröinti, TuontiApu (FAQ and tax section) and the Polestar 2 blog post, in the Perusselvitys FAQ and llms.txt, and in market-ai-enrich, perusselvitys-ai-draft and sales-coach-analyze;
  - 197/197 tests;
  - audit 188 checks, 0/0 (Claude read the JSON).
- Not published; waiting for Hans.
- Handoff doc copied into the website repo (website commit `3343d452`): `docs/handoff/2026-10-06-claude-codex-handoff.md`, with a pointer line at the top of `AGENTS.md`.

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

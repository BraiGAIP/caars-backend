# Caars.fi website brief — AI First Hero, pricing, SEO, GEO, agents (2026-10-08)

Status: **specification only, not applied.** The website lives in Lovable project
`7e00d027-e019-4070-a93a-d6789b55bd24` (`venturecore/caars-bright-spark`), which this
backend session cannot read or push. Send this brief to Lovable section by section
(each section = one Lovable message) and verify each diff before publishing.

## 1. Pricing and country boundaries (edge functions `chat`, `extract-car-info`, AI Gateway prompts)

Server-side catalogue in `create-checkout` already matches; only prompts/copy need the Sweden-only rule.

| Service | Sweden (Blocket.se, Bytbil) | Germany (Mobile.de, AutoScout24) |
| --- | --- | --- |
| Perusselvitys | 79 € | not offered |
| Etsintäpalvelu / Etsintäpalvelu+ | 79 € / 99 € | not offered |
| Tuontipalvelu (avaimet käteen) | alk. 1 290 € + rahti | alk. 1 990 € + rahti |
| Maksupalvelu (separate) | 149 € | 149 € |

Open question: the current catalogue also sells **TuontiApu 250 €**, which the new brief does not mention. Keep or remove?

Append the same mandatory block that the backend now uses (`CAARS_SALES_RULES` in `server.py`)
after custom prompts in both chat endpoints: inverted pyramid, 4-step import process,
Autohalli.com financing/trade-in sentence, test-drive reframing, and the verbatim tax disclaimer:

> HUOM: Yllä oleva autovero on tekoälyn tekemä suuntaa-antava arvio, joka perustuu ilmoituksen tietoihin. Caars ei ota vastuuta autoveroarvion oikeellisuudesta. Lopullisen ja sitovan autoveropäätöksen tekee ja veron määrää aina Suomen Verohallinto.

Enforce the disclaimer in code (append it server-side when the reply contains `autovero`/`€`), not only in the prompt.

## 2. AI First Hero — Quick Check

- Hero input accepts a listing URL (Blocket, Bytbil, Mobile.de, AutoScout24).
- `extract-car-info` (Firecrawl) → AI "Quick Check": vehicle, price, estimated total cost, country-correct next service.
- No mandatory contact form before the first report; offer contact/WhatsApp CTA after it.
- Rate-limit the endpoint per IP (Firecrawl and AI calls cost money once the contact gate is removed).

## 3. On-page SEO

A. Technical/meta
1. Exactly one `<h1>` per page, then H2/H3 in order (incl. `/blogi`, `/yhteystiedot`, `/rahoitus-ja-vaihtoauto`, `/tietosuoja`, `/kayttoehdot`, model import pages). Add a test that fails if a route renders ≠ 1 `h1`.
2. H1s:
   - `/yhteystiedot` → Ota yhteyttä Caarsin autotuontiasiantuntijoihin
   - `/tietosuoja` → Caars.fi tietosuojaseloste ja asiakastietojen käsittely
   - `/kayttoehdot` → Caars.fi palvelu- ja käyttöehdot
   - `/uutiset` → Autotuonnin uutiset, ilmiöt ja veromuutokset
3. Meta descriptions ≤ 155 characters on `/perusselvitys`, `/auton-etsinta`, `/tuontiapu`, `/hinnasto`.

B. Structure/links
1. Internal links to final URLs: `/autoverolaskuri`→`/kustannuslaskuri`, `/taustaselvitys`→`/perusselvitys`, `/tuonti`→`/tuontipalvelu` (keep the 301s for external links).
2. Model import pages (e.g. `/tuonti/mercedes-glb-tuonti-saksasta`) linked from footer or a "Suositut tuontimallit" hub linked from `/tuontipalvelu` → click depth ≤ 3.
3. Shorten long blog anchor texts; all WhatsApp links `https://wa.me/358400600609`.

C. Content
1. Unique intro/FAQ per model page (57 pages) generated from model data (country, fuel, typical tax, price range), not one shared block.
2. Cannibalisation: Volvo XC60 Sweden page targets "Volvo XC60 Ruotsista", Germany page "Volvo XC60 Saksasta", each canonical to itself and cross-linked; same split for Tesla Model 3 vs Model Y and Audi e-tron vs Q8 e-tron.
3. Title/H1 primary keyword in the first paragraph on the 25 flagged pages (`/`, `/perusselvitys`, `/tuontipalvelu`, `/tuontiapu`, `/maksupalvelu`, `/kustannuslaskuri` first).
4. Expand to ≥ 500 words: `/yhteystiedot`, `/konsultointi`, `/uutiset`, `/tilaa-perusselvitys`, `/autotuonti`.

## 4. GEO

- `public/robots.txt` — add:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://caars.fi/sitemap.xml
```

- `public/llms.txt`:

```markdown
# Caars.fi

> Caars.fi tuo käytettyjä autoja Ruotsista ja Saksasta Suomeen avaimet käteen -periaatteella. Toimipiste Raisiossa. WhatsApp +358 400 600 609.

## Hinnat
- Perusselvitys 79 € — vain Ruotsin autot: historian ja asiakirjojen taustatarkistus ennen ostoa.
- Etsintäpalvelu 79 € / Etsintäpalvelu+ 99 € — vain Ruotsin markkinat.
- Tuontipalvelu Ruotsista alk. 1 290 € + rahti.
- Tuontipalvelu Saksasta alk. 1 990 € + rahti.
- Maksupalvelu 149 € — turvallinen kansainvälinen maksunvälitys, ei sisälly tuontipalveluun.

## Tuontiprosessi
1. Taustatarkastus
2. Hankinta, sopimukset ja turvallinen maksu
3. Rahti, tullaus ja katsastus Suomessa
4. Avaimet käteen -toimitus kotiovelle tai Raisioon

## Rahoitus ja vaihtoauto
Kilpailutettu rahoitus ja vaihtoauto kumppanin Autohalli.com kautta.

## Autovero
Caarsin autoveroarviot ovat suuntaa-antavia. Sitovan päätöksen tekee Verohallinto.

## Sivut
- [Perusselvitys](https://caars.fi/perusselvitys)
- [Tuontipalvelu](https://caars.fi/tuontipalvelu)
- [Maksupalvelu](https://caars.fi/maksupalvelu)
- [Kustannuslaskuri](https://caars.fi/kustannuslaskuri)
- [Hinnasto](https://caars.fi/hinnasto)
```

- Prerender already produces 134 routes; verify new/changed routes are in the prerender list and sitemap.

## 5. Agents (282-role Agency Agents catalogue, see `docs/agency-agents-source-inventory.md`)

The catalogue is prompt definitions only — no ad, WhatsApp or execution runtime. Mapping:

| Caars agent | Upstream role | Needs before it can run |
| --- | --- | --- |
| Paid Media | `paid-media/paid-media-ppc-strategist.md` | Google Ads / Meta Ads API access; human approval before spend |
| WhatsApp Sales | `sales/sales-coach.md` (adapted) + `CAARS_SALES_RULES` | Meta Cloud API number verification, access token, webhook edge function writing to `crm_contacts` |
| Social Content | `marketing/marketing-content-creator.md` | none for drafts; publishing needs account access |
| GEO / AI SEO | `marketing/marketing-seo-specialist.md` | none; output = PRs to `llms.txt`, JSON-LD, Q&A pages |

Wire-up in the website Supabase: each agent run inserts a `control_center_tasks` row (status `draft`), a human approves before anything is published, sent or spent.

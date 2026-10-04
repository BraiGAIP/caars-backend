# Caars premium UI/UX update — 2026-10-04

## Status and repository boundaries

Implementation is running in the actual Lovable website, connected to `venturecore/caars-bright-spark` main. This BraiGAIP/caars-backend file is a companion audit report, not website source. Latest independently reviewed website checkpoint: `2589a0af70ae5e34aebb832947db15e21a2c8576`; subsequent split-photo, chatbot session and documentation refinements are in progress. The frontend is unpublished.

## User direction

The first light redesign removed too much brand identity. The restored version has car photography and stronger sections, but its teal/orange/green buttons still compete. The user requests a modern, trustworthy premium automotive/fintech style based on the latest homepage, preserving all six service forms and their private state transfer.

## Agency team actually used

Role instructions were read from the local clone of `msitarzewski/agency-agents` at `/Users/he68/Development/DELGO/backend/prompts/agency-agents`:

- UI designer + whimsy injector: `design/design-ui-designer.md`, `design/design-whimsy-injector.md`.
- UX architect + frontend developer: `design/design-ux-architect.md`, `engineering/engineering-frontend-developer.md`.
- Brand guardian + conversion review: `design/design-brand-guardian.md`, `marketing/marketing-growth-hacker.md`.

The exact `marketing-conversion-rate-optimizer` role file is absent in this clone; Growth Hacker supplies the closest conversion review. Three parallel role teams produced the consolidated implementation specification. No installation or purchase was needed.

## Consolidated design decisions

- Primary paths Perusselvitys, TuontiApu and Tuontipalvelu share one accessible Caars orange filled action. It matches the existing purchase/header identity. Search/contact use a restrained outlined secondary action. Financing has a distinct neutral partner surface and visible “Kumppanipalvelu · Autohalli” badge.
- Fresh cool light canvas, white surfaces, deep readable text, subtle borders, teal brand accents. Bright colors are decorative where their contrast cannot support small white text.
- Six modular cards with consistent padding, icon capsules, price/description bands, aligned fields and bottom actions. The existing responsive order, optional input and direct heading links remain.
- Input text at least 16 px on mobile, controls at least 48 px, persistent labels, consistent icon/padding and visible focus rings.
- Modest hover elevation and arrow movement; reduced-motion preference removes transitions and transforms. No payment gamification.
- Split hero: clear existing BMW image, readable headline and three icon trust badges using existing approved metrics only.
- Calculator/Tesla example becomes a semantic responsive table with row headers, right-aligned tabular prices and distinct total. Preserve numbers, provenance and illustrative disclaimer.

## Planned source scope and preservation

Main components: `src/components/ServiceCardsHero.tsx`, `src/components/HeroPriceExample.tsx`; narrowly scoped homepage styles/tokens if needed. Preserve repaired payment handlers, existing bot safeguards, service prices/routes, `saveHandoff`, router state/session TTL, and clean URLs. Partner-card continuation remains the service page so topic state is not lost.

## Validation still required

Final build, typecheck and full test suite; existing card/handoff behavior tests; semantic cost-table checks; desktop/mobile screenshots; keyboard and reduced-motion behavior; computed text/button contrast; mobile input size; all six populated and empty-title navigations, refresh/back and checkout draft preservation. Final source commit, diff, platform sync evidence and test results will replace this pending status after implementation.

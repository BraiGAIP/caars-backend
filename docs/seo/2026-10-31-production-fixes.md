# CAARS SEO - tuotannon korjaukset 31.10.2026

## Nykytila (varmennettu)

- SEO-korjaukset julkaistu caars.fi:hin käyttäjän hyväksynnällä, sisältäen aiemmin tehdyn kävijälaskentamuutoksen.
- Lopullinen lähdekoodin commit 9e1b2b607efeea03935967e31f5a54162dc90669, viimeisin deploy 8e2cef9e-3b52-4b60-8996-776efc492e86.
- Julkisesta HTML:stä varmennettu /market/ehdot: oikea otsikko + kaikki 10 ehtokohtaa; etusivu: molemmat palvelukohtaiset CTA-linkit, ei vanhaa yleistä tekstiä; Audi e-tron SUV title; vanhat Vero/Traficom/Volvo-linkit puuttuvat tarkistetuista sivuista. BMW:n metat yhdenmukaistettu viimeistelyssä.
- Lovable raportoi 630 testin, tyyppitarkistuksen, buildin ja staattisen build-output-tarkistuksen läpäisseiksi. Koodimuutosten diff tarkastettu.
- GitHub-synkronointi varmennettu Lovablen UI:sta: venturecore/caars-bright-spark, main, Connected, In sync with GitHub. GitHub-connectorin 404 ei tarkoita repon tai synkronoinnin puuttumista. Käyttöoikeuksia ei laajennettu.
- Tuotannon Worker päivitetty versioon d529eebb-2fc6-49d4-9d59-be74ff822238. Cache API:n avain korjattu caars.fi-domainiin; auth/private/payment/order/query-pyynnöt ohittavat välimuistin. Paikalliset cache-suojauksen ja miss/hit-toiminnan tarkistukset sekä dry-run läpäisty. TTL säilyi 60/120s. Julkiset reitit säilyivät. Wrangler ilmoitti workers.dev/preview-osoitteet pois käytöstä puuttuvien asetusten takia; varsinainen caars.fi toimii.
- Live-TTFB: /market hit 0,123 ja 0,164 s; /perusselvitys miss 0,324 → hit 0,206 s. Nämä ovat yksittäisiä näytteitä, eivät koko sivuston lopputulokset.
- Cache purge API palautti 401: välimuistia ei tyhjennetty tätä kautta. Tavallisen etusivun ja ehtosivun uusi sisältö varmistettiin TTL:n umpeuduttua.
- Uusi Seobility-crawl käynnistetty: 16196963. Lähtötaso #31 / 16196143, 95/100. Lopputulos vielä odottaa tämän tilan kirjoitushetkellä.
- WhatsAppin normaalit 302-ohjaukset säilytetty; mobile.de 403 ei osoita yksin rikkinäistä sivua. Lyhyitä käyttötarkoituksen mukaisia sivuja tai pakollisia vastuulausekkeita ei täytetty/poistettu pisteiden vuoksi.

## Toteutusraportti (Lovablen kierrosten historia; yllä oleva nykytila korvaa vanhat odottaa-julkaisua-merkinnät)

# Seobility-korjaukset 31.10.2026 (crawl #31 / 16196143)

Tila: toteutettu lähdekoodiin Hansin pyynnöstä (korjaukset valtuutettu). Hans julkaisi frontendin (deploy id59bf77c5) ja varmisti live-/market/ehdot-sivun (query-ohitus: 10 otsikkoa, oikea title). Tavallinen välimuisti näyttää vanhaa versiota TTL:n umpeutumiseen asti. Live-HTML:ssä oli yhä "Lue lisää ja tilaa" → korjattu prerenderiin tällä kierroksella, odottaa Hansin uutta deployta.

## Repositorio ja versio (VERIFIED 31.10.2026)
- Työ on tehty Lovable-projektissa 7e00d027-e019-4070-a93a-d6789b55bd24. Projektin git-remotet ovat Lovablen sisäisiä. Työtilasta ei näy GitHub-remotea.
- Lähtötaso `43e4fd29`. Ensimmäinen toteutusvaihe (checkpoint) `b259fdf8`; sen jälkeen ensimmäisen kierroksen viimeinen työkalucommit `4bf4dd34`. Katselmointikierroksen korjaukset tulevat seuraavaan Lovable-committiin; tarkistushetken HEAD oli `8b811189` (ei vielä lopullinen).
- Git sync (VERIFIED Hans, Project settings → Git 31.10.2026): Connected / In sync, venturecore/caars-bright-spark, haara main. Synkronointi toimii, vaikka GitHub-connectorin REST-kutsu palauttaa 404 (connectorin oikeudet ovat erillinen asia).

## Muutokset
| Havainto | Korjaus | Tiedostot |
|---|---|---|
| Vertailuartikkelin 404-lähteet (Vero, Traficom) | Lähteiksi vaihdettu toimivat viralliset sivut (HTTP 200 31.10.): vero.fi …/omaisuus/autovero/ ja …/autovero/ajoneuvon-tuonti-suomeen/ sekä traficom.fi …/autoilijat/ajoneuvon-rekisterointi. Tullin linkki poistettu, koska EU-tuonnin autoverotus kuuluu Verohallinnolle eikä Tullille. | src/pages/blog/BlogRuotsiVaiSaksa.tsx |
| mobile.de- ja Tulli-linkkien 403 | curl palautti 403 myös selaimen käyttäjäagentilla. Todennäköisesti botinesto, mutta VERIFIOIMATTA: toimivuutta oikeassa selaimessa ei tarkistettu. mobile.de-linkki säilytettiin. | – |
| /market/ehdot ohjasi etusivulle | Reitti näyttää olemassa olevan Market-ehtosivun. Title, kuvaus, H1, ingressi ja kaikki 10 ehtokohtaa tulevat yhteisestä lähteestä Reactille ja prerenderille; canonical https://caars.fi/market/ehdot. Crawlerin HTML sisältää koko ehtotekstin, ei yleistä varasisältöä. /market/partner ohjaa yhä etusivulle. | src/App.tsx, scripts/prerender.mjs, src/pages/market/MarketTerms.tsx, shared/marketTermsContent.json |
| /tilastokeskus → /volvo-tuonti-ruotsista | Nykyinen lähde ei käytä vanhaa osoitetta: "Volvo tuonti Ruotsista" -linkki vie suoraan /tuonti/volvo-xc60-tuonti-ruotsista-sivulle, ja V60/V90-taulukkorivi vie omalle V60-sivulleen. Seobility crawlasi todennäköisesti vanhemman julkaistun version (HYPOTHESIS, varmistuu julkaisun jälkeisessä crawlissa). | – |
| Etusivun "Lue lisää ja tilaa" -linkit | Linkkiteksteiksi palvelukohtaiset "Lue lisää: Etsintäpalvelu +" ja "Lue lisää Maksupalvelusta". | src/components/Pricing.tsx |
| Market-korttien linkkiteksti "Ladataan…" | Kuvalinkin DOM-tekstinä on ruudunlukijalle tarkoitettu "{merkki malli vuosi} – katso auto" (sr-only), ei aria-labelia. Merkit (Käsin valikoitu löytö, tila) siirrettiin linkin ulkopuolelle. Kuvan latausvirhe näyttää "Ei kuvaa" (aria-hidden), ja nimi säilyy. | FeaturedMarketCard.tsx, MarketListingCard.tsx |
| Market: title ja sivun sisältö eri | /market-sivun title ja kuvaus ovat nyt samat Reactissa ja prerenderissä. H1 on "Caars Market – käsin valikoidut autot Ruotsista". Autosivulle lisättiin H1:n jälkeen tunnistelause "… Caars Marketissa". | MarketIndex.tsx, MarketCar.tsx |
| Audi e-tron / e-tron GT / Q8 e-tron | Ruotsin sivun malliksi "e-tron SUV" (title, H1 ja linkit). Molemmat mallisivut kertovat, että e-tron GT on eri malli. Uusia teknisiä tietoja ei lisätty. | src/data/vehiclePages.ts, shared/vehicleContent.json |
| /tuontiauton-rahoitus: vähän sisäisiä linkkejä | Kyse oli sivulta lähtevistä linkeistä: Reactissa vain / ja /tietosuoja. Lisättiin kuusi aiheeseen liittyvää linkkiä yhteisestä listasta, ja ne näkyvät myös prerenderissä. | shared/seoRelatedLinks.json, FinancingTradeInLanding.tsx |
| Saman sivun toistot | Etusivu: hinta-esimerkin matkakulukappale muotoiltiin uudelleen; hinnaston teksti säilyy. TuontiApu: palvelurajauskortti kirjoitettiin uudelleen; UKK säilyy. BMW: toistuva "tyypillisesti halvempi" korvattiin mallikohtaisilla tarkistusvinkeillä, ja 320d:n euromääräinen autoveroarvio korvattiin linkillä Autoverolaskuriin (Hansin sääntö). | HeroPriceExample.tsx, TuontiApuPage.tsx, BlogBMW.tsx |
| Sivujen välinen Autohalli-kappale | Rahoitusartikkelin vaihe muotoiltiin eri tavalla; merkitys ja kumppanipolun rajat säilyivät. | BlogAutotuontiRahoituksella.tsx |
| Title- ja H1-sanat puuttuivat sisällöstä | Ingressit täydennettiin luontevasti: yhteystiedot (tuontiin), Blocket (riskit), BMW (vinkit, sudenkuopat), tuontiauto-suomeen (kattava), auto-rahoituksella (onnistuu), autotuonti (hoidamme; viranomaisraja kerrottu), hinta (kustannukset selkeästi), kannattaako (rehellinen). Kaksi lupaavaa H1:tä yksinkertaistettiin: tuontiauto-suomeen-sivulta poistettiin "edullisesti", ja plug-in-sivun H1 on nyt "– akku, lataus ja verotus". Etusivun Hansin hyväksymä H1 säilyi. | shared/seoHeadingContent.json, shared/importGuideContent.json, BlogTuontiautoSuomeen.tsx, PluginHybridPage.tsx |
| Vähätekstiset sivut | Yhteystiedot, käyttöehdot, uutiset ja Market-sivut ovat käyttötarkoitukseltaan lyhyitä. Niitä ei täytetty 500 sanaan. Market-autosivujen autoverolauseke on pakollinen, ja se säilyi samana. | – |
| 70 sivun keskinkertainen vasteaika | Mitattu 31.10.: etusivu edge-HIT 0,12 s; mallisivut, /perusselvitys ja /market DYNAMIC/miss 0,2–0,34 s. Tuotannon Worker poikkeaa reposta (`x-caars-cache` vs `x-caars-edge`), joten syytä ei ole vahvistettu. Välimuistiaikojen pidennys peruttiin. Odottaa deployatun Workerin tarkastusta (OPEN). | – |
| wa.me → api.whatsapp.com | Varmistettu 302-ohjaukseksi, joka säilyttää puhelinnumeron ja viestin. Tämä on WhatsAppin normaali toiminta. wa.me-linkit säilytettiin mobiili- ja työpöytäkäytön vuoksi. | – |

## Tarkistukset (katselmointikierros)
- Vitest: 62 tiedostoa / 630 testiä läpi (tilapäinen canvas-shim /tmp, ei riippuvuusmuutoksia).
- Regressiot: src/test/seobilityFixes20261031.test.ts (7) ja src/test/marketCardLinkText.test.tsx. Jälkimmäinen renderöi kaksi autoa, joista toisen kuva epäonnistuu; linkkitekstit ovat yksilölliset eikä niissä ole aria-labelia tai merkkitekstejä.
- tsgo OK, `npm run build` + prerender OK; dist/market/ehdot sisältää oikean titlen, canonicalin ja kaikki 10 ehtokohtaa.

## Avoinna
- Julkaisu odottaa Hansin katselmoinnin valmistumista; sen jälkeen uusi Seobility-crawl verrattuna lähtötasoon 16196143.
- Vasteaika/Worker: tarkasta tuotannossa ajossa oleva Worker ennen muutoksia; repon Workerin välimuistiajat ovat lähtötason arvoissa (10 min / 1 h / 24 h).
- GitHub-reposyncin tila: tarkista Project settings → Git.
- BMW-artikkelin muut "halvempi"-ilmaisut (ingressi ja UKK) jätettiin ennalleen, koska niitä ei pyydetty muuttamaan. Ne odottavat Hansin päätöstä.

## Kierros 3: prerender vs React (31.10.2026)
- Etusivun hakukoneversio: "Lue lisää ja tilaa Maksupalvelu" → "Lue lisää Maksupalvelusta"; lisätty "Lue lisää: Etsintäpalvelu +" (/auton-etsinta), nimi shared/pricing.jsonista kuten Reactissa.
- BMW (/blogi/bmw-tuonti-saksasta): prerenderin title/description olivat eri kuin Reactissa ("suosituimmat mallit ja hinnat", "edulliset hinnat") → samat kuin Reactissa; yhteinen ingressi mainitsee vinkit ja sudenkuopat.
- Tarkistettu dist-HTML:stä: TuontiApu-rajauslause näkyy kerran (lisäksi JSON-LD), etusivulla yksi matkakululause, Audi e-tron SUV -title, rahoitussivun 6 linkkiä, vertailuartikkelissa ei vanhoja 404-lähteitä (staattinen runko ei sisällä lähdelistaa lainkaan).
- Uusi build-tarkistus: `node scripts/check-seo-build.mjs` (ajetaan `npm run build` jälkeen) → OK.
- Vitest 62/630, tsgo OK, build OK. Ei deployta tällä kierroksella.

## Tuotannon Cloudflare Worker (Hans, erillinen patch)
- Hans latasi tuotannon Workerin ja deployasi version d529eebb-2fc6-49d4-9d59-be74ff822238: välimuistiavain `new Request(url.toString())` ulkoisen origin-osoitteen sijaan; auth/private/payment/order- ja query-pyynnöt ohittavat välimuistin.
- Hansin mittaus: /market hit 0,123 s / 0,164 s; /perusselvitys miss 0,324 s → hit 0,206 s.
- Repon cloudflare-worker/src/worker.js on eri (uudempi) koodi, eikä sitä muutettu. Ennen repon Workerin deployta versioita on verrattava.

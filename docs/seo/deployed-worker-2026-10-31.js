/***
 * Caars.fi crawler reverse-proxy Worker
 *
 * - Normal browsers  -> transparent proxy to Lovable origin, now with edge-cache
 *                       for anonymous GET requests (see originRequest below)
 * - Known crawlers   -> static HTML with route-specific SEO metadata
 * - Static assets/API/admin paths -> always pass-through (never rewritten)
 *
 * CHANGELOG (25.8.2026): Added Cache API caching to originRequest() for
 * anonymous (no-cookie) GET traffic. Previously ONLY the crawler-stub HTML
 * was cached; real visitors and non-allowlisted crawlers (SemrushBot,
 * SeobilityBot, AhrefsBot) always hit the Lovable origin uncached, which
 * was the root cause of the site-wide 2-6s response times found by
 * Semrush/Seobility audits on 24-25.8.2026.
 */

const ORIGIN = "https://caars-bright-spark.lovable.app";
const SITE = "https://caars.fi";
const DEFAULT_OG = `${SITE}/images/og-image.png`;

/* ------------------------------------------------------------------ */
/* 1. Crawler detection                                                */
/* ------------------------------------------------------------------ */
const CRAWLER_UA = /(Googlebot|AdsBot-Google|Mediapartners-Google|Storebot-Google|facebookexternalhit|Facebot|LinkedInBot|WhatsApp|Slackbot|Slack-ImgProxy|Twitterbot|TelegramBot|Discordbot|Pinterest|redditbot|Applebot|SkypeUriPreview|vkShare|W3C_Validator|Embedly|Iframely|Snapchat|TikTok|Bytespider|Yahoo|Bingbot|DuckDuckBot|YandexBot|Google-InspectionTool|Mastodon|Threads|GPTBot|ChatGPT-User|OAI-SearchBot|PerplexityBot|ClaudeBot|Claude-Web|anthropic-ai|CCBot)/i;

function isCrawler(ua) {
  return !!ua && CRAWLER_UA.test(ua);
}

/* ------------------------------------------------------------------ */
/* 2. Pass-through path matchers                                       */
/* ------------------------------------------------------------------ */
const PASSTHROUGH_PREFIXES = [
  "/assets/", "/images/", "/static/", "/icons/", "/fonts/",
  "/api/", "/functions/", "/auth/", "/rest/", "/storage/",
  "/admin", "/market/admin", "/market/partner", "/partner",
  "/sitemap.xml", "/robots.txt", "/llms.txt", "/favicon",
  "/manifest", "/sw.js", "/service-worker",
];
const PASSTHROUGH_EXT = /\.(js|mjs|css|map|png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|json|xml|txt|pdf)$/i;

function isPassthrough(pathname) {
  if (PASSTHROUGH_EXT.test(pathname)) return true;
  return PASSTHROUGH_PREFIXES.some(p => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

/* ------------------------------------------------------------------ */
/* 3. Route metadata map                                               */
/* ------------------------------------------------------------------ */
const META = {
  "/autoliikkeille": {
    title: "Autojen tuonti autoliikkeille | Caars",
    description: "Caars auttaa autoliikettä auton tuonnissa Ruotsista. Hoidamme hankinnan, asiakirjat ja kuljetuksen sujuvasti autoliikkeen pihaan kaikkialle Suomeen.",
  },
  "/": {
    title: "Caars.fi – Auton tuontipalvelu Ruotsista ja Saksasta Suomeen",
    description: "Caars hoitaa autosi tuonnin Ruotsista ja Saksasta avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti. Kiinteät hinnat.",
  },
  "/perusselvitys": {
    title: "Perusselvitys 89 € – Auton tarkistus ennen ostoa | Caars.fi",
    description: "Tarkistamme auton historian, myyjän luottokelpoisuuden ja neuvottelemme hinnan puolestasi. 89 € hyvitetään, jos etenet tuontiin kanssamme.",
  },
  "/etsintapalvelu": {
    title: "Etsintäpalvelu 149 € – Me löydämme auton puolestasi | Caars.fi",
    description: "Kerro toiveesi ja me etsimme sopivan auton Ruotsista tai Saksasta. Säästät aikaa ja saat parhaan hinnan ammattilaisneuvottelulla.",
  },
  "/tuontipalvelu": {
    title: "Tuontipalvelu 1290 € – Avaimet käteen autotuonti | Caars.fi",
    description: "Hoidamme koko autotuonnin alusta loppuun: löydämme auton, kuljetamme, hoidamme paperit ja autoveron. Yli 900 tuotua autoa, yli 10 vuoden kokemus.",
  },
  "/maksupalvelu": {
    title: "Maksupalvelu 149 € – Säästä valuuttakuluissa | Caars.fi",
    description: "Maksamme auton myyjälle pankkisopimuksemme kautta – säästät 3–4 % valuuttamuunnoskuluissa auton ostohinnasta.",
  },
  "/auton-etsinta": {
    title: "Auton etsintäpalvelu – Caars löytää unelmasi auton | Caars.fi",
    description: "Etsimme puolestasi parhaan auton Ruotsista tai Saksasta toiveidesi mukaan. Säästä aikaa ja rahaa – ammattilainen vertailee kymmeniä ilmoituksia.",
  },
  "/auton-tuonti-ruotsista": {
    title: "Auton tuonti Ruotsista Suomeen – kiinteä hinta | Caars.fi",
    description: "Tuomme autosi Ruotsista turvallisesti ja edullisesti. Hoidamme etsinnän, ostot, kuljetuksen, autoveron ja rekisteröinnin avaimet käteen.",
  },
  "/auton-tuonti-saksasta": {
    title: "Auton tuonti Saksasta Suomeen – avaimet käteen | Caars.fi",
    description: "Saksan markkinat tarjoavat parhaat hinnat ja varustelut. Caars hoitaa tuonnin alusta loppuun – etsintä, kuljetus, vero ja rekisteröinti.",
  },
  "/taustaselvitys": {
    title: "Auton taustaselvitys Ruotsista ja Saksasta | Caars.fi",
    description: "Tarkistamme auton historian, omistajat, mittarilukeman ja huoltokirjan ennen ostoa. Vältä kalliit yllätykset ennen kauppoja.",
  },
  "/auton-taustaselvitys": {
    title: "Auton taustaselvitys – ulkomaisen auton historia | Caars.fi",
    description: "Caars selvittää ulkomaisen auton taustat: omistajat, kolaritiedot, mittarilukema ja huoltohistoria. Turvallinen autokauppa alkaa selvityksestä.",
  },
  "/hinnasto": {
    title: "Hinnasto – auton tuontipalvelun hinnat | Caars.fi",
    description: "Selkeät ja kiinteät hinnat tuontipalvelulle. Perusselvitys 89 €, etsintäpalvelu 149 €, koko tuonti 1 290 €+. Ei piilokuluja, ei yllätyksiä.",
  },
  "/market": {
    title: "Caars Market – tulossa pian | Caars.fi",
    description: "Caars Market avautuu pian. Suomalaisille ostajille kuratoidut autot luotettavilta ruotsalaisilta jälleenmyyjiltä. Jätä yhteystietosi.",
  },
  "/caars-market": {
    title: "Caars Market – autoja Ruotsista suomalaisille ostajille | Caars.fi",
    description: "Caars Market tuo Ruotsin parhaat tuontiautot suomalaisille. Kuratoidut ilmoitukset, varmennetut myyjät ja turvallinen kauppa.",
  },
  "/konsultointi": {
    title: "Auton tuonnin konsultointi – asiantuntija-apu | Caars.fi",
    description: "Tarvitsetko apua tuontiprosessin yksittäisiin osiin? Caars tarjoaa konsultointia autoveroon, kuljetukseen, rekisteröintiin ja ostopäätökseen.",
  },
  "/auton-tuontipalvelu": {
    title: "Auton tuontipalvelu – avaimet käteen Ruotsista ja Saksasta | Caars.fi",
    description: "Caars hoitaa koko tuontiprosessin: auton etsintä, osto, kuljetus, autovero ja rekisteröinti. Yksi sopimus, kiinteä hinta.",
  },
  "/ajoneuvon-tuonti": {
    title: "Ajoneuvon tuonti Suomeen – henkilö- ja hyötyajoneuvot | Caars.fi",
    description: "Tuomme henkilöautot, pakettiautot, moottoripyörät ja hyötyajoneuvot Ruotsista ja Saksasta. Kaikki ajoneuvoluokat avaimet käteen.",
  },
  "/pakettiauton-tuonti": {
    title: "Pakettiauton tuonti Ruotsista ja Saksasta | Caars.fi",
    description: "Pakettiauto edullisemmin ulkomailta. Caars hoitaa N1-luokan ajoneuvon tuonnin, autoveron ja rekisteröinnin yrityksille ja yksityisille.",
  },
  "/moottoripyoran-tuonti": {
    title: "Moottoripyörän tuonti Ruotsista ja Saksasta | Caars.fi",
    description: "Tuomme moottoripyörän puolestasi turvallisesti. Selvitämme verot, hoidamme kuljetuksen ja rekisteröinnin Suomeen.",
  },
  "/hyotyajoneuvon-tuonti": {
    title: "Hyötyajoneuvon tuonti – kuorma- ja erikoisajoneuvot | Caars.fi",
    description: "Caars tuo hyötyajoneuvot, kuorma-autot ja erikoiskalustot Ruotsista ja Saksasta. Yrityskäyttöön optimoitu prosessi.",
  },
  "/kuljetus-ja-rekisterointi": {
    title: "Auton kuljetus ja rekisteröinti Suomeen | Caars.fi",
    description: "Hoidamme ostamasi auton kuljetuksen ulkomailta ja rekisteröinnin Traficomilla. Kiinteä hinta, vakuutettu kuljetus.",
  },
  "/yhteystiedot": {
    title: "Yhteystiedot | Caars.fi",
    description: "Ota yhteyttä Caarsiin: WhatsApp, sähköposti ja toimisto Raisiossa. Vastaamme yleensä saman päivän aikana.",
  },
  "/tietosuoja": {
    title: "Tietosuojaseloste | Caars.fi",
    description: "Caars.fi tietosuojaseloste – miten käsittelemme henkilötietojasi GDPR:n mukaisesti.",
  },
  "/ukk": {
    title: "Usein kysytyt kysymykset autotuonnista | Caars.fi",
    description: "Vastaukset yleisimpiin kysymyksiin autotuonnista Ruotsista ja Saksasta – hinta, aika, prosessi ja riskit.",
  },
  "/blogi": {
    title: "Blogi – autotuonnin vinkit ja uutiset | Caars.fi",
    description: "Caars-blogi: autotuonnin oppaat, autoverolaskurit, ostajan vinkit ja ajankohtaiset uutiset Ruotsin ja Saksan automarkkinoilta.",
  },
  "/kustannuslaskuri": {
    title: "Autotuonnin kustannuslaskuri – laske hinta | Caars.fi",
    description: "Laske auton tuonnin kokonaiskustannus: autovero, ALV, kuljetus ja palvelumaksu. Ilmainen laskuri suomalaisille autonostajille.",
  },
  "/tuonti/bmw-530e-tuonti-ruotsista": { title: "BMW 530e tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme BMW 530e-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volvo-xc60-tuonti-ruotsista": { title: "Volvo XC60 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Volvo XC60-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/volvo-v60-tuonti-ruotsista": { title: "Volvo V60 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Volvo V60 Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/volvo-xc90-tuonti-ruotsista": { title: "Volvo XC90 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Volvo XC90-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volvo-v90-tuonti-ruotsista": { title: "Volvo V90 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Volvo V90-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/tesla-model-3-tuonti-ruotsista": { title: "Tesla Model 3 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tesla Model 3 Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/tesla-model-y-tuonti-ruotsista": { title: "Tesla Model Y tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Tesla Model Y-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volkswagen-id4-tuonti-ruotsista": { title: "Volkswagen ID.4 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Volkswagen ID.4-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/toyota-rav4-tuonti-ruotsista": { title: "Toyota RAV4 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Toyota RAV4 Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/kia-ev6-tuonti-ruotsista": { title: "Kia EV6 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Kia EV6-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/skoda-enyaq-tuonti-ruotsista": { title: "Skoda Enyaq tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Skoda Enyaq-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/audi-e-tron-tuonti-ruotsista": { title: "Audi e-tron tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Audi e-tron Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/mercedes-glc-tuonti-ruotsista": { title: "Mercedes-Benz GLC tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Mercedes-Benz GLC-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/bmw-x3-tuonti-ruotsista": { title: "BMW X3 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö BMW X3-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/polestar-2-tuonti-ruotsista": { title: "Polestar 2 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Polestar 2 Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/hyundai-ioniq-5-tuonti-ruotsista": { title: "Hyundai IONIQ 5 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Hyundai IONIQ 5-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/ford-mustang-mach-e-tuonti-ruotsista": { title: "Ford Mustang Mach-E tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Ford Mustang Mach-E-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/bmw-ix3-tuonti-ruotsista": { title: "BMW iX3 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "BMW iX3 Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/cupra-born-tuonti-ruotsista": { title: "Cupra Born tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Cupra Born-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volvo-c40-tuonti-ruotsista": { title: "Volvo C40 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Volvo C40-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/bmw-330e-tuonti-ruotsista": { title: "BMW 330e tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "BMW 330e Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/mercedes-c-300e-tuonti-ruotsista": { title: "Mercedes-Benz C 300e tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Tuomme Mercedes-Benz C 300e-mallisi Ruotsista Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/audi-q5-tuonti-ruotsista": { title: "Audi Q5 tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Etsitkö Audi Q5-mallia? Caars löytää ja tuo sen Ruotsista turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/nissan-leaf-tuonti-ruotsista": { title: "Nissan Leaf tuonti Ruotsista – kiinteä hinta | Caars.fi", description: "Nissan Leaf Ruotsista tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/bmw-530e-tuonti-saksasta": { title: "BMW 530e tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme BMW 530e-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volvo-xc60-tuonti-saksasta": { title: "Volvo XC60 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö Volvo XC60-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/tesla-model-y-tuonti-saksasta": { title: "Tesla Model Y tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tesla Model Y Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/mercedes-c-sarjan-tuonti-saksasta": { title: "Mercedes-Benz C-sarjan tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Mercedes-Benz C-sarjan-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/bmw-x5-tuonti-saksasta": { title: "BMW X5 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö BMW X5-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/audi-a4-tuonti-saksasta": { title: "Audi A4 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Audi A4 Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/audi-a6-tuonti-saksasta": { title: "Audi A6 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Audi A6-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/mercedes-e-sarjan-tuonti-saksasta": { title: "Mercedes-Benz E-sarjan tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö Mercedes-Benz E-sarjan-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/porsche-taycan-tuonti-saksasta": { title: "Porsche Taycan tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Porsche Taycan Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/bmw-i4-tuonti-saksasta": { title: "BMW i4 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme BMW i4-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volkswagen-id3-tuonti-saksasta": { title: "Volkswagen ID.3 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö Volkswagen ID.3-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/volkswagen-id-buzz-tuonti-saksasta": { title: "Volkswagen ID. Buzz tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Volkswagen ID. Buzz Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/mercedes-eqc-tuonti-saksasta": { title: "Mercedes-Benz EQC tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Mercedes-Benz EQC-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/bmw-ix-tuonti-saksasta": { title: "BMW iX tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö BMW iX-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/audi-q8-e-tron-tuonti-saksasta": { title: "Audi Q8 e-tron tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Audi Q8 e-tron Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/seat-cupra-formentor-tuonti-saksasta": { title: "Cupra Formentor tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Cupra Formentor-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/hyundai-tucson-tuonti-saksasta": { title: "Hyundai Tucson tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö Hyundai Tucson-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/skoda-octavia-tuonti-saksasta": { title: "Skoda Octavia tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Skoda Octavia Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/toyota-corolla-tuonti-saksasta": { title: "Toyota Corolla tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Toyota Corolla-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/bmw-320d-tuonti-saksasta": { title: "BMW 320d tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö BMW 320d-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/audi-q3-tuonti-saksasta": { title: "Audi Q3 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Audi Q3 Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/mercedes-glb-tuonti-saksasta": { title: "Mercedes-Benz GLB tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Mercedes-Benz GLB-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/tuonti/volkswagen-tiguan-tuonti-saksasta": { title: "Volkswagen Tiguan tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Etsitkö Volkswagen Tiguan-mallia? Caars löytää ja tuo sen Saksasta turvallisesti. Hoidamme koko prosessin: tarkistuksen, kuljetuksen ja paperit." },
  "/tuonti/bmw-x1-tuonti-saksasta": { title: "BMW X1 tuonti Saksasta – kiinteä hinta | Caars.fi", description: "BMW X1 Saksasta tuotuna kiinteällä hinnalla. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi." },
  "/tuonti/porsche-macan-tuonti-saksasta": { title: "Porsche Macan tuonti Saksasta – kiinteä hinta | Caars.fi", description: "Tuomme Porsche Macan-mallisi Saksasta Suomeen avaimet käteen -palveluna. Etsintä, taustaselvitys, kuljetus ja rekisteröinti kiinteällä hinnalla." },
  "/palvelut": {
    title: "Palvelut — auton tuonti Ruotsista ja Saksasta | Caars",
    description: "Kaikki Caarsin palvelut: Perusselvitys 79 €, Etsintäpalvelu alk. 79 €, Tuontipalvelu alk. 1 290 €, Maksupalvelu ja TuontiApu. Valitse sopiva palvelu.",
  },
  "/autotuonti": {
    title: "Autotuonti Ruotsista ja Saksasta | Caars.fi",
    description: "Caars tekee autotuonnista helppoa: etsintä, taustaselvitys, kuljetus, autovero ja rekisteröinti yhdellä sopimuksella.",
  },
  "/auton-tuonti-ulkomailta": {
    title: "Auton tuonti ulkomailta – opas | Caars.fi",
    description: "Kaikki mitä tarvitset tietää auton tuonnista ulkomailta: prosessi, kustannukset, riskit ja miten Caars auttaa jokaisessa vaiheessa.",
  },
  "/auton-tuonti-hinta": {
    title: "Auton tuonnin hinta – mistä se koostuu | Caars.fi",
    description: "Selvitämme auton tuonnin kokonaiskustannuksen: ostohinta, kuljetus, autovero, ALV ja palvelumaksu. Laske oma arviosi.",
  },
  "/auton-tuonti-verotus": {
    title: "Auton tuonnin verotus Suomessa | Caars.fi",
    description: "Miten autovero lasketaan tuontiautolle? Selkeä opas tuontiauton verotuksesta ja siitä miten Caars hoitaa veroprosessin puolestasi.",
  },
  "/kannattaako-tuoda-auto": {
    title: "Kannattaako auton tuonti ulkomailta? | Caars.fi",
    description: "Punnitaan auton tuonnin hyödyt ja riskit: milloin tuonti kannattaa, mitä se maksaa ja miten Caars tekee siitä turvallista.",
  },
  "/suosituimmat-tuontiautot": {
    title: "Suosituimmat tuontiautot Suomeen | Caars.fi",
    description: "Mitkä automallit suomalaiset tuovat eniten Ruotsista ja Saksasta? Katsaus suosituimpiin tuontiautoihin ja niiden hintoihin.",
  },
  "/bmw-tuonti-saksasta": {
    title: "BMW tuonti Saksasta Suomeen | Caars.fi",
    description: "Tuomme BMW:n Saksasta avaimet käteen -periaatteella. Laaja valikoima malleja, kiinteä hinta ja täysi tuki koko prosessiin.",
  },
  "/volvo-tuonti-ruotsista": {
    title: "Volvo tuonti Ruotsista Suomeen | Caars.fi",
    description: "Volvo on suosituin tuontimerkki Ruotsista. Caars hoitaa etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin puolestasi.",
  },
  "/plug-in-hybrid-tuonti": {
    title: "Plug-in-hybridin tuonti Ruotsista ja Saksasta | Caars.fi",
    description: "Lataushybridit ovat suosittuja tuontiautoja edullisen autoveron ansiosta. Caars auttaa löytämään ja tuomaan oikean mallin.",
  },
  "/bmw-530e-tuonti": {
    title: "BMW 530e tuonti – kiinteä hinta | Caars.fi",
    description: "BMW 530e ladattava hybridi tuotuna Ruotsista tai Saksasta. Caars hoitaa etsinnän, tarkistuksen, kuljetuksen ja rekisteröinnin.",
  },
  "/volvo-v60-tuonti": {
    title: "Volvo V60 tuonti – kiinteä hinta | Caars.fi",
    description: "Volvo V60 tuotuna Ruotsista turvallisesti ja edullisesti. Caars hoitaa koko prosessin etsinnästä rekisteröintiin.",
  },
  "/audi-a6-tuonti": {
    title: "Audi A6 tuonti – kiinteä hinta | Caars.fi",
    description: "Audi A6 tuotuna Saksasta avaimet käteen -palveluna. Tarkistus, kuljetus, autovero ja rekisteröinti kiinteällä hinnalla.",
  },
  "/tesla-model-3-tuonti": {
    title: "Tesla Model 3 tuonti – kiinteä hinta | Caars.fi",
    description: "Tesla Model 3 tuotuna Ruotsista. Caars hoitaa auton etsinnän, taustaselvityksen, kuljetuksen ja rekisteröinnin Suomeen.",
  },
  "/tilastokeskus": {
    title: "Autotuonnin tilastot Suomessa | Caars.fi",
    description: "Katsaus auton tuonnin tilastoihin Suomessa: kuinka paljon autoja tuodaan vuosittain ja mistä maista eniten.",
  },
  "/uutiset": {
    title: "Uutiset – autotuonnin ajankohtaiset aiheet | Caars.fi",
    description: "Caarsin uutiset: markkinakatsaukset, ostajan oppaat ja ajankohtaiset aiheet auton tuonnista Ruotsista ja Saksasta.",
  },
  "/market/ehdot": {
    title: "Caars Marketin ehdot | Caars.fi",
    description: "Caars Marketin käyttöehdot ostajille ja myyjille. Lue ehdot ennen palvelun käyttöä.",
  },
  "/kayttoehdot": {
    title: "Käyttöehdot | Caars.fi",
    description: "Caars.fi-sivuston ja palveluiden käyttöehdot.",
  },
  "/blogi/tuontiauto-suomeen": {
    title: "Tuontiauto Suomeen – mistä aloittaa | Caars.fi",
    description: "Opas tuontiauton hankintaan Suomeen: prosessi, kustannukset ja vinkit ensikertalaiselle.",
  },
  "/blogi/auton-tuonti-ruotsista-opas": {
    title: "Auton tuonti Ruotsista – kattava opas | Caars.fi",
    description: "Kaikki mitä tarvitset tietää auton tuonnista Ruotsista: etsintä, ostaminen, kuljetus ja rekisteröinti.",
  },
  "/blogi/auton-tuonti-hinta": {
    title: "Mitä auton tuonti maksaa? | Caars.fi",
    description: "Erittelemme auton tuonnin kustannukset: ostohinta, kuljetus, autovero ja palvelumaksut.",
  },
  "/blogi/autovero-tuontiautolle": {
    title: "Autovero tuontiautolle – näin se lasketaan | Caars.fi",
    description: "Selkeä opas tuontiauton autoveron laskentaan ja siihen vaikuttaviin tekijöihin.",
  },
  "/blogi/mista-etsia-auto-ulkomailta": {
    title: "Mistä etsiä auto ulkomailta? | Caars.fi",
    description: "Parhaat tavat ja kanavat auton etsimiseen Ruotsista ja Saksasta turvallisesti.",
  },
  "/blogi/mita-tarkistaa-ennen-ostoa": {
    title: "Mitä tarkistaa ennen tuontiauton ostoa | Caars.fi",
    description: "Tärkeimmät tarkistuslistan kohdat ennen ulkomailta ostettavan auton kauppaa.",
  },
  "/blogi/auton-tuonti-aikataulu": {
    title: "Auton tuonnin aikataulu – kuinka kauan kestää | Caars.fi",
    description: "Realistinen aikataulu auton tuonnille etsinnästä rekisteröintiin Suomessa.",
  },
  "/blogi/kannattaako-tuoda-auto-ulkomailta": {
    title: "Kannattaako auto tuoda ulkomailta? | Caars.fi",
    description: "Punnitsemme auton tuonnin hyödyt, riskit ja kustannukset verrattuna kotimaiseen ostoon.",
  },
  "/blogi/suosituimmat-tuontiautot": {
    title: "Suosituimmat tuontiautot – top-listaus | Caars.fi",
    description: "Katsaus suomalaisten suosituimpiin tuontiautomalleihin Ruotsista ja Saksasta.",
  },
  "/blogi/bmw-tuonti-saksasta": {
    title: "BMW:n tuonti Saksasta – opas | Caars.fi",
    description: "Miksi BMW kannattaa tuoda juuri Saksasta? Opas malleihin, hintoihin ja prosessiin.",
  },
  "/blogi/auton-tuonti-saksasta-2026": {
    title: "Auton tuonti Saksasta 2026 | Caars.fi",
    description: "Ajankohtainen katsaus auton tuontiin Saksasta vuonna 2026: hinnat, trendit ja prosessi.",
  },
  "/blogi/polestar-2-tuonti-ruotsista": {
    title: "Polestar 2 tuonti Ruotsista | Caars.fi",
    description: "Polestar 2 -sähköauton tuonti Ruotsista: hinnat, prosessi ja miksi Caars kannattaa valita.",
  },
  "/blogi/auto-ruotsista-vai-saksasta-vertailu": {
    title: "Auto Ruotsista vai Saksasta – vertailu | Caars.fi",
    description: "Kumpi kannattaa: auton tuonti Ruotsista vai Saksasta? Vertailemme hinnat, valikoiman ja prosessin.",
  },
  "/blogi/autotuonti-rahoituksella": {
    title: "Autotuonti rahoituksella | Caars.fi",
    description: "Näin rahoitat tuontiauton hankinnan. Caars auttaa yhdessä rahoituskumppaneiden kanssa.",
  },
  "/tilaa-perusselvitys": {
    title: "Tilaa perusselvitys 89 € | Caars.fi",
    description: "Tilaa auton perusselvitys ennen ostopäätöstä. Tarkistamme historian, kunnon ja hinnan puolestasi.",
  },
}

const PRIVATE_PATHS = [/^\/admin/, /^\/market\/admin/, /^\/market\/partner/, /^\/partner/];

/* ------------------------------------------------------------------ */
/* 4. HTML builder                                                     */
/* ------------------------------------------------------------------ */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderCrawlerHtml({ url, title, description, noindex }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(url);
  const img = DEFAULT_OG;
  const robots = noindex ? "noindex,nofollow" : "index,follow";
  return `<!doctype html>
<html lang="fi">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${u}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Caars.fi">
<meta property="og:locale" content="fi_FI">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${u}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Caars",
    url: SITE,
    logo: `${SITE}/logo.png`,
  })}</script>
</head>
<body>
<h1>${t}</h1>
<p>${d}</p>
<p><a href="${u}">${u}</a></p>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* 5. Worker entry                                                     */
/* ------------------------------------------------------------------ */

/**
 * originRequest — proxies to the Lovable origin.
 *
 * NEW (25.8.2026): edge-caches anonymous GET responses using the Cache API.
 * - Only requests with NO cookie header are cacheable (logged-in / checkout
 *   sessions always bypass the cache and hit origin directly).
 * - Only GET requests are cacheable.
 * - Cache TTL: 60s browser-facing, 120s at Cloudflare's edge (s-maxage).
 * - ctx.waitUntil is used so the cache write never delays the response.
 * - Sets `x-caars-cache: hit|miss|bypass` for easy verification.
 */
function originRequest(request, url, ctx) {
  const isGet = request.method === "GET";
  const hasCookie = !!request.headers.get("cookie");
  const privateRoute = /^\/(?:admin|partner|api|functions|auth|rest|storage|checkout|payment|maksu|tilaa|kiitos)(?:\/|-|$)/i.test(url.pathname)
    || /^\/market\/(?:admin|partner)(?:\/|$)/i.test(url.pathname);
  const cacheable = isGet && !hasCookie && !request.headers.has("authorization")
    && !url.search && !privateRoute;

  const target = new URL(url.pathname + url.search, ORIGIN);
  const cache = caches.default;
  // Cache key must be a GET request; strip cookies from the key itself.
  // Cache API keys belong to this Worker zone, not the external Lovable host.
  const cacheKey = new Request(url.toString(), { method: "GET" });

  async function fetchFresh() {
    // Force Host to match the origin hostname. Lovable's edge issues a 3xx
    // redirect back to caars.fi when it receives "Host: caars.fi" on a
    // connection actually made to caars-bright-spark.lovable.app — this was
    // the root cause of the 3xx subrequests observed 25.8.2026.
    const forwardedHeaders = new Headers(request.headers);
    forwardedHeaders.set("host", new URL(ORIGIN).host);
    const init = {
      method: request.method,
      headers: forwardedHeaders,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow",
    };
    return fetch(target.toString(), init);
  }

  if (!cacheable) {
    return fetchFresh().then(resp => {
      const out = new Response(resp.body, resp);
      out.headers.set("x-caars-cache", "bypass");
      return out;
    });
  }

  return cache.match(cacheKey).then(async cached => {
    if (cached) {
      const out = new Response(cached.body, cached);
      out.headers.set("x-caars-cache", "hit");
      return out;
    }

    const originResp = await fetchFresh();

    // Only cache successful, non-redirect HTML/asset responses.
    if (originResp.status >= 200 && originResp.status < 300) {
      const toCache = new Response(originResp.clone().body, originResp);
      toCache.headers.set("cache-control", "public, max-age=60, s-maxage=120");
      toCache.headers.delete("set-cookie"); // never cache set-cookie
      if (ctx && ctx.waitUntil) {
        ctx.waitUntil(cache.put(cacheKey, toCache));
      } else {
        // Fallback: fire-and-forget without blocking (best effort)
        cache.put(cacheKey, toCache.clone()).catch(() => {});
      }
    }

    const out = new Response(originResp.body, originResp);
    out.headers.set("x-caars-cache", "miss");
    return out;
  });
}

const LEGACY_REDIRECTS = {
  "/yhteydenotto-auton-etsimiseksi-laskuri": "/kustannuslaskuri",
  "/yhteydenotto-auton-etsimiseksi-ohjaus": "/auton-etsinta",
  "/kiitossivu-tuontikulut-laskuri": "/hinnasto",
  "/kiitossivu-etsi-auto": "/auton-etsinta",
  "/kiitossivu-autoliike": "/",
  "/pyyda-tarjous": "/perusselvitys",
  "/tietosuojaseloste": "/tietosuoja",
  "/privacy-policy": "/tietosuoja",
  "/auto-ruotsista": "/auton-tuonti-ruotsista",
  "/auto-ruotsista-rahoituksella": "/blogi/autotuonti-rahoituksella",
  "/autoverolaskuri-test": "/kustannuslaskuri",
  "/caarsin-blogi": "/blogi",
  "/auton-etsinta-yhteydenotto": "/auton-etsinta",
  "/ostajan-opas-tuontiauto": "/kannattaako-tuoda-auto",
  "/autoliikkeet": "/",
  "/admin": "/",
  "/admin-login": "/",
  "/admin/whatsapp": "/",
  "/2025/05/https-caars-fi-auto-ruotsista-caars-tuontipalvelu": "/blogi",
  "/2025/05/kaytetty-auto-ruotsista-kattava-opas": "/blogi/auton-tuonti-ruotsista-opas",
}

const LEGACY_PREFIX_REDIRECTS = [
  { prefix: "/tag/", to: "/blogi" },
  { prefix: "/category/", to: "/blogi" },
  { prefix: "/2025/", to: "/blogi" },
  { prefix: "/2024/", to: "/blogi" },
  { prefix: "/2023/", to: "/blogi" },
  { prefix: "/wp-content/", to: "/" },
  { prefix: "/wp-admin", to: "/" },
  { prefix: "/wp-includes/", to: "/" },
  { prefix: "/admin/", to: "/" },
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // Strip social tracking params
    const trackingParams = ["fbclid", "gclid", "msclkid", "_ga", "trk"];
    let hasTracking = false;
    for (const p of trackingParams) {
      if (url.searchParams.has(p)) {
        url.searchParams.delete(p);
        hasTracking = true;
      }
    }
    if (hasTracking) {
      return Response.redirect(SITE + path + (url.search || ""), 301);
    }

    // 301 legacy paths
    if (LEGACY_REDIRECTS[path]) {
      return Response.redirect(SITE + LEGACY_REDIRECTS[path], 301);
    }
    for (const { prefix, to } of LEGACY_PREFIX_REDIRECTS) {
      if (path === prefix.replace(/\/$/, "") || path.startsWith(prefix)) {
        if (path.startsWith("/wp-") || path.match(/\.php$/i)) {
          return new Response("Gone", { status: 410 });
        }
        return Response.redirect(SITE + to, 301);
      }
    }
    if (/^\/wp-[\w-]+\.php$/i.test(path) || path === "/xmlrpc.php") {
      return new Response("Gone", { status: 410 });
    }

    // Canonicalize trailing slashes on real pages (e.g. /yhteystiedot/ -> /yhteystiedot)
    if (path !== "/" && url.pathname !== path && !isPassthrough(url.pathname)) {
      return Response.redirect(SITE + path + (url.search || ""), 301);
    }

    // Always pass-through assets, APIs, admin, sitemap, robots
    if (isPassthrough(url.pathname)) {
      return originRequest(request, url, ctx);
    }

    // Normal browsers: transparent proxy (now cached for anonymous GETs)
    if (!isCrawler(ua)) {
      return originRequest(request, url, ctx);
    }

    // Crawler + private path -> noindex stub
    if (PRIVATE_PATHS.some(rx => rx.test(path))) {
      const html = renderCrawlerHtml({
        url: SITE + path,
        title: "Caars.fi",
        description: "Sisäinen sivu.",
        noindex: true,
      });
      return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8", "x-caars-crawler": "private" },
      });
    }

    // Crawler + ANY public route (known or unknown) -> proxy to origin.
    // Origin (Lovable) serves the full prerendered HTML with real meta,
    // canonical and JSON-LD tags via scripts/prerender.mjs. Do NOT return
    // the thin META stub for known routes anymore — it starved Google/AI
    // bots of all real page content (title + one paragraph only).
    // Fixed 31.8.2026 per Lovable repo audit (edt-f5b1a819-5941-4772-bac1-20fae954c527).
    const resp = await originRequest(request, url, ctx);

    // Fallback: if origin fails (5xx) and we have a known META entry,
    // return a minimal SEO stub so the bot doesn't see a bare error page.
    const meta = META[path];
    if (meta && resp.status >= 500) {
      const html = renderCrawlerHtml({
        url: SITE + (path === "/" ? "/" : path),
        title: meta.title,
        description: meta.description,
        noindex: false,
      });
      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=60",
          "x-caars-crawler": "fallback",
        },
      });
    }

    return new Response(resp.body, {
      status: resp.status,
      headers: { ...Object.fromEntries(resp.headers), "x-caars-crawler": "passthrough" },
    });
  },
}
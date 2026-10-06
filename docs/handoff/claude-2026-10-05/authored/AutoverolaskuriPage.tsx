import { useMemo, useState } from "react";
import { Calculator, ExternalLink, FileSearch, Bot, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ChatBot, { openChatWithMessage } from "@/components/ChatBot";
import {
  estimateCarTax,
  CAR_TAX_DISCLAIMER,
  VERO_CAR_TAX_CALCULATOR_URL,
  VERO_TAX_DECISIONS_URL,
  type CarTaxMethod,
} from "@/lib/carTax";

/**
 * /autoverolaskuri — Caars Autoverolaskuri (brand design by Claude, 2026-10-06).
 * Graphite hero with the calculator card visible without scrolling, then
 * "how it is calculated", "estimate it yourself" (official links), FAQ and CTA.
 * All tax logic lives in estimateCarTax (single source of truth, shared with the bot).
 */
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";
const fmtEur = (n: number) => new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 }).format(n) + " €";

const FAQ = [
  {
    q: "Miten autovero lasketaan?",
    a: "Autovero = auton yleinen vähittäismyyntiarvo Suomessa × veroprosentti. Veroprosentti määräytyy auton yhdistetyn CO2-päästöarvon ja ensirekisteröintiajankohdan mukaan. Täyssähköautojen autovero on 0 %.",
  },
  {
    q: "Mitä hintaa autoverolaskuri käyttää?",
    a: "Laskuri käyttää sinun antamaasi arviota siitä, mitä vastaava auto maksaisi Suomessa. Verohallinto käyttää omaa arviotaan auton yleisestä vähittäismyyntiarvosta Suomessa – ei ulkomaista ostohintaa.",
  },
  {
    q: "Kumpi päästöarvo: WLTP vai NEDC?",
    a: "Käytä auton yhdistettyä (combined) CO2-arvoa. Ennen 1.9.2018 ensirekisteröidyt autot verotetaan NEDC-arvon mukaan. Myöhemmin rekisteröidyillä autoilla voi olla sekä NEDC- että WLTP-arvo – tarkista sovellettava arvo Verohallinnon ohjeista.",
  },
  {
    q: "Onko laskurin antama summa sitova?",
    a: "Ei ole. Laskurin tulos on suuntaa-antava arvio. Lopullisen autoveron määrää aina Verohallinto, eikä Caars vastaa veroarvion oikeellisuudesta.",
  },
];

const AutoverolaskuriPage = () => {
  const [firstRegistration, setFirstRegistration] = useState("");
  const [method, setMethod] = useState<CarTaxMethod>("WLTP");
  const [co2, setCo2] = useState("");
  const [fullyElectric, setFullyElectric] = useState(false);
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () =>
      submitted
        ? estimateCarTax({
            firstRegistration,
            method,
            co2: fullyElectric ? 0 : co2 === "" ? null : Number(co2.replace(",", ".")),
            fullyElectric,
            finnishPriceEur: price === "" ? null : Number(price.replace(/\s/g, "").replace(",", ".")),
          })
        : null,
    [submitted, firstRegistration, method, co2, fullyElectric, price],
  );

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Caars Autoverolaskuri",
      url: "https://caars.fi/autoverolaskuri",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "fi",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: { "@id": "https://caars.fi/#organization" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const field =
    "mt-1.5 block min-h-[48px] w-full rounded-[4px] border border-[#C9D1D6] bg-white px-3.5 text-base text-[#1B2025] placeholder:text-[#6B747C] focus:border-[#F27A13] focus:outline-none focus:ring-2 focus:ring-[#F27A13]/30";
  const label = "block text-xs font-extrabold uppercase tracking-[0.1em] text-[#3E474F]";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Autoverolaskuri 2026 – laske tuontiauton autovero | Caars.fi"
        description="Caarsin Autoverolaskuri: arvioi tuontiauton autovero CO2-päästöjen, ensirekisteröinnin ja Suomen hinta-arvion perusteella. Ohjeet ja linkit Verohallinnon laskuriin."
        path="/autoverolaskuri"
        jsonLd={schema}
      />
      <Header />
      <main>
        {/* HERO + CALCULATOR */}
        <section className="brand-contrast brand-surface relative overflow-hidden bg-[#22272D] pb-14 pt-24 text-white md:pb-20 md:pt-32">
          <div className="container relative z-10 mx-auto grid max-w-[1240px] items-start gap-8 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-12">
            <div>
              <p className="m-0 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">
                <Calculator aria-hidden className="h-4 w-4" /> Ilmainen työkalu
              </p>
              <h1 className="mt-4 font-display text-[40px] font-black uppercase leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-[60px]">
                Autoverolaskuri
              </h1>
              <span aria-hidden className="mt-6 block h-[3px] w-[140px] bg-[#F27A13]" />
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white">
                Arvioi tuontiauton autovero ennen ostopäätöstä. Laskuri käyttää auton yhdistettyä CO2-arvoa,
                ensirekisteröintiä ja <strong>sinun arviotasi auton hinnasta Suomessa</strong>.
              </p>
              <ul className="m-0 mt-6 list-none space-y-2 p-0 text-[15px] text-white">
                <li>· Tulos haarukkana euroina</li>
                <li>· Sähköautojen autovero 0 %</li>
                <li>· Ruotsin kruunut: 1 € = 11 SEK</li>
              </ul>
              <button
                type="button"
                onClick={() => openChatWithMessage("Haluan laskea autoveron tuontiautolle.")}
                className="mt-8 inline-flex min-h-[52px] items-center gap-2 border-2 border-white/40 px-5 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[#F27A13] hover:text-[#F27A13]"
              >
                <Bot aria-hidden className="h-5 w-5" /> Laske botin kanssa linkistä
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className={`brand-light-card relative border border-[#DADDDA] bg-white p-5 text-[#1B2025] sm:p-7 ${CHAMFER}`}
              aria-labelledby="calc-title"
            >
              <span aria-hidden className="absolute left-0 top-0 h-[5px] w-[40%] bg-[#F27A13]" />
              <h2 id="calc-title" className="m-0 font-display text-xl font-black uppercase tracking-normal text-[#1B2025]">
                Laske autovero
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className={label}>
                  Ensirekisteröinti
                  <input type="date" required value={firstRegistration} onChange={(e) => { setFirstRegistration(e.target.value); setSubmitted(false); }} className={field} />
                </label>
                <fieldset>
                  <legend className={label}>Mittaustapa</legend>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(["WLTP", "NEDC"] as CarTaxMethod[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={method === m}
                        onClick={() => { setMethod(m); setSubmitted(false); }}
                        className={`brand-surface min-h-[48px] rounded-[4px] border-2 font-display text-sm font-bold uppercase ${
                          method === m ? "border-[#22272D] bg-[#22272D] text-white" : "border-[#C9D1D6] bg-white text-[#1B2025]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className={label}>
                  CO2 yhdistetty (g/km)
                  <input
                    inputMode="decimal"
                    placeholder="esim. 128"
                    disabled={fullyElectric}
                    required={!fullyElectric}
                    value={fullyElectric ? "0" : co2}
                    onChange={(e) => { setCo2(e.target.value); setSubmitted(false); }}
                    className={`${field} disabled:bg-[#F2F3F1]`}
                  />
                </label>
                <label className={`${label} flex items-end gap-3 pb-3`}>
                  <input
                    type="checkbox"
                    checked={fullyElectric}
                    onChange={(e) => { setFullyElectric(e.target.checked); setSubmitted(false); }}
                    className="h-5 w-5 accent-[#22272D]"
                  />
                  Täyssähköauto
                </label>
                <label className={`${label} sm:col-span-2`}>
                  Arviosi auton hinnasta Suomessa (€)
                  <input
                    inputMode="numeric"
                    placeholder="esim. 32 000"
                    required
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setSubmitted(false); }}
                    className={field}
                  />
                  <span className="mt-1.5 block text-[13px] font-normal normal-case tracking-normal text-[#3E474F]">
                    Autoverolaskuri käyttää tätä arvoa antaessaan autoveroarvion. Katso vastaavien autojen hintoja suomalaisista myynti-ilmoituksista.
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[4px] bg-[#F27A13] px-6 font-display text-sm font-extrabold uppercase tracking-[0.05em] text-[#16191D] transition-colors hover:bg-[#FF9A45]"
              >
                <Calculator aria-hidden className="h-5 w-5" /> Laske autoveroarvio
              </button>

              <div aria-live="polite">
                {result && (
                  <div className="brand-contrast brand-surface mt-5 bg-[#22272D] p-5 text-white">
                    {result.ok && result.lowEur !== null && result.highEur !== null ? (
                      <>
                        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13]">Autoveroarvio</p>
                        <p className="m-0 mt-1 font-display text-[34px] font-black leading-none text-white sm:text-[40px]">
                          {result.lowEur === result.highEur ? fmtEur(result.lowEur) : `${fmtEur(result.lowEur)}–${fmtEur(result.highEur)}`}
                        </p>
                        <p className="m-0 mt-2 text-sm text-white">
                          Veroprosentti {result.taxPercent?.toFixed(1).replace(".", ",")} % · {result.table}
                        </p>
                      </>
                    ) : (
                      <p className="m-0 flex items-start gap-2 text-[15px] text-white">
                        <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#F27A13]" /> {result.messageFi}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <p className="m-0 mt-4 border-l-[3px] border-[#F27A13] pl-3 text-[13px] leading-relaxed text-[#3E474F]">
                {CAR_TAX_DISCLAIMER}
              </p>
            </form>
          </div>
        </section>

        {/* HOW IT IS CALCULATED */}
        <section className="bg-white py-16 text-[#1B2025] md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">Näin se toimii</p>
            <h2 className="mt-2.5 font-display text-[32px] font-black uppercase leading-none tracking-normal text-[#1B2025] md:text-[44px]">
              Näin autovero lasketaan
            </h2>
            <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ["01", "Hinta Suomessa", "Verohallinto arvioi, mitä vastaava auto maksaa Suomessa (yleinen vähittäismyyntiarvo). Ulkomainen ostohinta ei ratkaise."],
                ["02", "CO2 ja ensirekisteröinti", "Veroprosentti haetaan yhdistetyn CO2-arvon ja ensirekisteröintiajankohdan mukaisesta verotaulukosta (NEDC tai WLTP)."],
                ["03", "Hinta × prosentti", "Autovero = hinta Suomessa × veroprosentti. Täyssähköauton autovero on 0 %."],
              ].map(([n, t, d]) => (
                <div key={n} className={`relative border border-[#DADDDA] bg-[#F2F3F1] p-6 ${CHAMFER}`}>
                  <span className="brand-surface inline-flex h-10 w-10 items-center justify-center bg-[#F27A13] font-display text-base font-black text-[#16191D]">{n}</span>
                  <h3 className="mt-4 font-display text-lg font-black uppercase text-[#1B2025]">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#3E474F]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ESTIMATE IT YOURSELF */}
        <section className="brand-contrast brand-surface bg-[#22272D] py-16 text-white md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">Tee itse</p>
            <h2 className="mt-2.5 font-display text-[32px] font-black uppercase leading-none tracking-normal text-white md:text-[44px]">
              Arvioi autovero itse
            </h2>
            <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: Calculator,
                  title: "Verohallinnon autoverolaskuri",
                  text: "Syötä auton tiedot Verohallinnon omaan laskuriin. Se antaa Verohallinnon arvion verotusarvosta ja autoverosta.",
                  href: VERO_CAR_TAX_CALCULATOR_URL,
                  cta: "Avaa Verohallinnon laskuri",
                },
                {
                  icon: FileSearch,
                  title: "Toteutuneet verotuspäätökset",
                  text: "Katso, millaisia verotusarvoja ja autoveroja samanlaisille autoille on jo määrätty. Vertaa merkkiä, mallia, vuosimallia ja ajokilometrejä.",
                  href: VERO_TAX_DECISIONS_URL,
                  cta: "Katso verotuspäätökset",
                },
              ].map((c) => (
                <div key={c.title} className={`relative border border-white/[0.1] bg-[#2C333A] p-6 sm:p-8 ${CHAMFER}`}>
                  <span aria-hidden className="absolute left-0 top-0 h-[5px] w-[40%] bg-[#F27A13]" />
                  <c.icon aria-hidden className="h-7 w-7 text-[#F27A13]" />
                  <h3 className="mt-4 font-display text-xl font-black uppercase text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white">{c.text}</p>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-[48px] items-center gap-2 border-2 border-white/40 px-4 font-display text-sm font-bold uppercase tracking-wide text-white no-underline transition-colors hover:border-[#F27A13] hover:text-[#F27A13]"
                  >
                    {c.cta} <ExternalLink aria-hidden className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#F2F3F1] py-16 text-[#1B2025] md:py-24">
          <div className="container mx-auto max-w-[900px] px-4 sm:px-6">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">Kysymykset</p>
            <h2 className="mt-2.5 font-display text-[32px] font-black uppercase leading-none tracking-normal text-[#1B2025] md:text-[44px]">
              Usein kysyttyä autoverosta
            </h2>
            <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
            <div className="mt-8 divide-y divide-[#DADDDA] border-y border-[#DADDDA]">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold uppercase text-[#1B2025]">
                    {f.q}
                    <span aria-hidden className="text-2xl text-[#B4520A] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-base leading-relaxed text-[#3E474F]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="brand-contrast brand-surface bg-[#22272D] py-14 text-white md:py-20">
          <div className="container mx-auto max-w-[1240px] px-4 text-center sm:px-6">
            <h2 className="m-0 font-display text-[28px] font-black uppercase leading-tight tracking-normal text-white md:text-[40px]">
              Löysitkö auton Ruotsista?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white">
              Perusselvitys 79 € kertoo auton taustan – omistajat, katsastukset, kilometrit, vauriot ja velat – ennen kuin maksat.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/perusselvitys" className="inline-flex min-h-[52px] items-center rounded-[4px] bg-[#F27A13] px-6 font-display text-sm font-extrabold uppercase tracking-[0.05em] text-[#16191D] no-underline hover:bg-[#FF9A45]">
                Tilaa Perusselvitys 79 €
              </a>
              <a href="/auton-etsinta" className="inline-flex min-h-[52px] items-center border-2 border-white/40 px-6 font-display text-sm font-bold uppercase tracking-wide text-white no-underline hover:border-[#F27A13] hover:text-[#F27A13]">
                Auto Saksasta? Etsintäpalvelu
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default AutoverolaskuriPage;

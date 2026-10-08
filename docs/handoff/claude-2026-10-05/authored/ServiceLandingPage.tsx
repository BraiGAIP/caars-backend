import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ChatBot from "@/components/ChatBot";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import { trackViewContent } from "@/lib/tiktokEvents";
import { openContactForm } from "@/lib/ctaTargets";

export interface ServiceStep { title: string; description: string; }
export interface ServiceFeature { icon: LucideIcon; title: string; description: string; }
export interface ServiceFAQ { q: string; a: string; }
export interface ServiceLink { href: string; label: string; }

export interface ServiceLandingPageProps {
  // SEO
  seoTitle: string;
  seoDescription: string;
  path: string;
  // Hero
  badge: string;
  badgeIcon: LucideIcon;
  h1: string;
  intro: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  heroNote?: string;
  // Sections
  introBody: string[];               // paragraphs under H1 (crawlable content)
  whoFor: { h2: string; items: { h3: string; body: string }[] };
  process: { h2: string; steps: ServiceStep[] };
  includes: { h2: string; features: ServiceFeature[] };
  trust: { h2: string; body: string; bullets: string[] };
  faqs: ServiceFAQ[];
  relatedLinks: ServiceLink[];
  // Schema
  serviceName: string;
  serviceDescription: string;
  offer?: { price: string; currency: string };
}

const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";
const BTN = "inline-flex min-h-[52px] items-center justify-center gap-2.5 px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
const BTN_PRIMARY = `${BTN} bg-[#F27A13] text-[#16191D] hover:bg-[#FF9A45]`;
const BTN_SECONDARY = `${BTN} border-2 border-[#F27A13] text-[#F27A13] hover:bg-[#F27A13] hover:text-[#16191D]`;

const Eyebrow = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`m-0 text-xs font-extrabold uppercase tracking-[0.14em] md:text-[13px] ${dark ? "text-[#F27A13]" : "text-[#B4520A]"}`}>{children}</p>
);

const H2 = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <>
    <h2 className={`mt-2.5 font-display text-[30px] font-black uppercase leading-none tracking-normal md:text-[44px] ${dark ? "text-white" : "text-[#1B2025]"}`}>
      {children}
    </h2>
    <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
  </>
);

const ServiceLandingPage = (p: ServiceLandingPageProps) => {
  const BadgeIcon = p.badgeIcon;
  const primaryOpensContact = /^Pyydä (?:tuonti)?tarjous/i.test(p.primaryCta.label);

  // TikTok Pixel — palvelusivun katselu (consent-gated + dedup helperissä).
  useEffect(() => {
    trackViewContent({
      contentId: p.path,
      contentName: p.serviceName,
      contentType: "product",
      value: p.offer ? Number(p.offer.price) : undefined,
      currency: p.offer?.currency ?? "EUR",
    });
  }, [p.path, p.serviceName, p.offer]);

  const serviceSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.serviceName,
    description: p.serviceDescription,
    provider: { "@type": "Organization", name: "Caars.fi", url: "https://caars.fi" },
    areaServed: { "@type": "Country", name: "Finland" },
    url: `https://caars.fi${p.path}`,
  };
  if (p.offer) {
    serviceSchema.offers = {
      "@type": "Offer",
      price: p.offer.price,
      priceCurrency: p.offer.currency,
      url: `https://caars.fi${p.path}`,
    };
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const PrimaryCta = () =>
    primaryOpensContact ? (
      <button type="button" onClick={openContactForm} className={BTN_PRIMARY}>
        {p.primaryCta.label}
        <ArrowRight aria-hidden className="h-4 w-4" />
      </button>
    ) : (
      <a href={p.primaryCta.href} className={BTN_PRIMARY}>
        {p.primaryCta.label}
        <ArrowRight aria-hidden className="h-4 w-4" />
      </a>
    );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={p.seoTitle} description={p.seoDescription} path={p.path} jsonLd={[serviceSchema, faqSchema]} />
      <Header />
      <main>
        {/* HERO — graphite video hero */}
        <section className="brand-contrast brand-surface relative overflow-hidden bg-[#22272D] pb-16 pt-28 text-white md:pb-20 md:pt-36">
          <HeroVideoBackground overlayClassName="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,39,45,0.7)_0%,rgba(34,39,45,0.88)_60%,#22272D_100%)] md:bg-[linear-gradient(90deg,#22272D_25%,rgba(34,39,45,0.82)_50%,rgba(34,39,45,0.45)_100%)]" />
          <div className="container relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
              <p className="m-0 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">
                <BadgeIcon aria-hidden className="h-4 w-4" />
                {p.badge}
              </p>
              <h1 className="mt-4 font-display text-[34px] font-black uppercase leading-[1.02] tracking-normal text-white sm:text-5xl md:text-[60px]">
                {p.h1}
              </h1>
              <span aria-hidden className="mt-6 block h-[3px] w-[140px] bg-[#F27A13]" />
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white md:text-xl">{p.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryCta />
                {p.secondaryCta && (
                  <a href={p.secondaryCta.href} className={BTN_SECONDARY}>
                    {p.secondaryCta.label}
                  </a>
                )}
              </div>
              {p.heroNote && <p className="mt-5 text-sm text-white">{p.heroNote}</p>}
            </motion.div>
          </div>
        </section>

        {/* INTRO BODY (crawlable text) */}
        <section className="bg-white py-16 text-[#1B2025] md:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            {p.introBody.map((para, i) => (
              <p key={i} className={`mb-5 text-base leading-relaxed md:text-lg ${i === 0 ? "font-semibold text-[#1B2025]" : "text-[#3E474F]"}`}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* INCLUDES */}
        <section className="bg-[#F2F3F1] py-16 text-[#1B2025] md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <Eyebrow>Palvelun sisältö</Eyebrow>
            <H2>{p.includes.h2}</H2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {p.includes.features.map((f, i) => (
                <div key={f.title} className={`flex gap-5 border border-[#DADDDA] bg-white p-6 ${CHAMFER}`}>
                  <span
                    aria-hidden
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[#F27A13] text-[#16191D] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]"
                  >
                    <f.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p aria-hidden className="m-0 text-xs font-extrabold text-[#B4520A]">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="m-0 mt-1 font-display text-lg font-black uppercase leading-snug text-[#1B2025]">{f.title}</h3>
                    <p className="m-0 mt-2 text-sm leading-relaxed text-[#3E474F]">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO FOR */}
        <section className="bg-white py-16 text-[#1B2025] md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <Eyebrow>Kenelle</Eyebrow>
            <H2>{p.whoFor.h2}</H2>
            <div className="mt-10 grid gap-0 border-t-[3px] border-[#22272D] md:grid-cols-3">
              {p.whoFor.items.map((it) => (
                <div key={it.h3} className="py-7 md:pr-8">
                  <h3 className="m-0 font-display text-lg font-black uppercase leading-snug text-[#1B2025]">{it.h3}</h3>
                  <p className="m-0 mt-2 text-base leading-relaxed text-[#3E474F]">{it.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-[#F2F3F1] py-16 text-[#1B2025] md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <Eyebrow>Eteneminen</Eyebrow>
            <H2>{p.process.h2}</H2>
            <ol className="m-0 mt-10 grid list-none gap-4 p-0 md:grid-cols-2">
              {p.process.steps.map((s, i) => (
                <li key={s.title} className={`flex gap-5 border border-[#DADDDA] bg-white p-6 ${CHAMFER}`}>
                  <span
                    aria-hidden
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[#F27A13] font-display text-[22px] font-black text-[#16191D] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="m-0 font-display text-lg font-black uppercase leading-snug text-[#1B2025]">{s.title}</h3>
                    <p className="m-0 mt-2 text-sm leading-relaxed text-[#3E474F]">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* TRUST — graphite */}
        <section className="brand-contrast brand-surface bg-[#22272D] py-16 text-white md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <div className="max-w-3xl">
              <Eyebrow dark>Miksi Caars</Eyebrow>
              <H2 dark>{p.trust.h2}</H2>
              <p className="mt-5 text-base leading-relaxed text-white md:text-lg">{p.trust.body}</p>
            </div>
            <ul className="m-0 mt-10 grid list-none gap-4 p-0 sm:grid-cols-2">
              {p.trust.bullets.map((b) => (
                <li key={b} className={`flex items-start gap-3 border border-white/[0.1] bg-[#2C333A] p-5 text-base text-white ${CHAMFER}`}>
                  <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#F27A13]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16 text-[#1B2025] md:py-24">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <Eyebrow>Kysymykset</Eyebrow>
            <H2>Usein kysyttyä</H2>
            <Accordion type="single" collapsible className="mt-8 w-full border-t-[3px] border-[#22272D]">
              {p.faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#DADDDA]">
                  <AccordionTrigger className="py-5 text-left font-display text-base font-black uppercase tracking-normal text-[#1B2025] hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-[#3E474F]">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA — graphite */}
        <section className="brand-contrast brand-surface bg-[#22272D] py-16 text-white md:py-24">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <Eyebrow dark>Aloita tänään</Eyebrow>
            <H2 dark>Valmis aloittamaan?</H2>
            <p className="mt-5 max-w-xl text-lg text-white">Pyydä tarjous tai varaa ilmainen alkukartoitus – vastaamme nopeasti.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta />
              {p.secondaryCta && (
                <a href={p.secondaryCta.href} className={BTN_SECONDARY}>
                  {p.secondaryCta.label}
                </a>
              )}
            </div>
            <p className="mt-6 text-sm text-white">Caars toimii välittäjänä. Lopullinen ostopäätös ja vastuu on aina ostajalla.</p>
          </div>
        </section>

        {/* RELATED LINKS */}
        <section className="bg-[#F2F3F1] py-12 text-[#1B2025]">
          <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
            <Eyebrow>Liittyvät palvelut</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.relatedLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="brand-surface inline-flex min-h-[44px] items-center border-2 border-[#22272D] px-4 font-display text-sm font-bold uppercase tracking-wide text-[#22272D] no-underline transition-colors hover:bg-[#22272D] hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ServiceLandingPage;

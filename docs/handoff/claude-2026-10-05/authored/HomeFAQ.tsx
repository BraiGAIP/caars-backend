import homeFaq from "../../shared/homeFaq.json";

/**
 * HomeFAQ — homepage "Usein kysyttyä" (brand design by Claude, 2026-10-06).
 * Content lives in shared/homeFaq.json and is reused for the FAQPage JSON-LD
 * in Index.tsx, so the visible answers and the schema can never drift apart.
 */
export type FaqItem = { q: string; a: string };
export const HOME_FAQ: FaqItem[] = homeFaq as FaqItem[];

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const HomeFAQ = () => (
  <section id="usein-kysyttya" className="bg-[#F2F3F1] py-16 text-[#1B2025] md:py-24">
    <div className="container mx-auto max-w-[900px] px-4 sm:px-6">
      <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">Kysymykset</p>
      <h2 className="mt-2.5 font-display text-[32px] font-black uppercase leading-none tracking-normal text-[#1B2025] md:text-[44px]">
        Usein kysyttyä
      </h2>
      <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
      <div className="mt-8 divide-y divide-[#DADDDA] border-y border-[#DADDDA]">
        {HOME_FAQ.map((f) => (
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
);

export default HomeFAQ;

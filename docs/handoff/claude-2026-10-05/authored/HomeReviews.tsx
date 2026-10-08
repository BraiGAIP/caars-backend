import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

/**
 * HomeReviews — single light trust section for the homepage (replaces the
 * former HeroTrustReviews + Testimonials + CustomerReviews trio, which repeated
 * the same proof three times with conflicting counts).
 */
const stats = [
  { value: "900+", label: "tuotua autoa" },
  { value: "150+", label: "kumppaniliikettä" },
  { value: "2016", label: "alkaen" },
  { value: "4,9 / 5", label: "asiakkaiden arvio" },
];

const reviews = [
  {
    name: "Mikko T.",
    meta: "Helsinki · BMW 530e",
    text: "Tilasin auton tarkistuksen Ruotsista. Selvisi, että autolla oli ollut kolari – vältin kalliin virheen.",
  },
  {
    name: "Sanna L.",
    meta: "Tampere · Volvo V60",
    text: "Erittäin ammattitaitoinen palvelu. Sain selkeän raportin ja suosituksen päivässä. Suosittelen lämpimästi.",
  },
  {
    name: "Jari K.",
    meta: "Turku · Audi A6",
    text: "79 € oli paras sijoitus koko autokaupassa. Asiantuntija löysi huoltohistoriasta puutteita, joita en olisi itse huomannut.",
  },
];

const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

const Stars = () => (
  <span className="flex gap-0.5" aria-label="5 / 5 tähteä">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} aria-hidden className="h-4 w-4 fill-[#F27A13] text-[#F27A13]" />
    ))}
  </span>
);

const HomeReviews = () => (
  <section id="asiakaskokemukset" className="bg-[#F2F3F1] py-16 text-[#1B2025] md:py-24">
    <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
      <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">Luottamus & tulokset</p>
      <h2 className="mt-2.5 font-display text-[34px] font-black uppercase leading-none tracking-normal text-[#1B2025] md:text-[48px]">
        Asiakkaat kertovat
      </h2>
      <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />

      <dl className="m-0 mt-10 grid grid-cols-2 border-y-[3px] border-[#22272D] md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-1 py-6 md:px-6 ${i > 0 ? "md:border-l md:border-[#D5D8D4]" : ""}`}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="m-0">
              <span className="block font-display text-[34px] font-black leading-none text-[#1B2025] md:text-[44px]">{s.value}</span>
              <span className="mt-2 block text-sm font-bold uppercase tracking-wide text-[#4A535B]">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`m-0 flex flex-col border border-[#DADDDA] bg-white ${CHAMFER}`}
          >
            <span aria-hidden className={`block h-[5px] w-1/2 ${i % 2 === 0 ? "bg-[#F27A13]" : "bg-[#22C3A6]"}`} />
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <Stars />
                <Quote aria-hidden className="h-6 w-6 text-[#C9CDC8]" />
              </div>
              <blockquote className="m-0 flex-1 text-base leading-relaxed text-[#1B2025]">“{r.text}”</blockquote>
              <figcaption className="border-t border-[#E6E8E5] pt-4">
                <span className="block font-display text-sm font-black uppercase tracking-wide text-[#1B2025]">{r.name}</span>
                <span className="mt-0.5 block text-sm text-[#4A535B]">{r.meta}</span>
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default HomeReviews;

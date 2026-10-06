import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { handleCtaAction } from "@/lib/chatCtaActions";

/**
 * WhyCheckSection — graphite brand section: "Entä jos auto ei ole hyvä?"
 * Problem vs. Caars solution in two chamfered columns + orange CTA.
 */
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

const problems = [
  "Ei puhu ruotsia tai saksaa",
  "Ei tiedä, mitä kysyä myyjältä",
  "Ei tunnista riskejä ajoissa",
];

const solutions = [
  "Kysymme oikeat kysymykset",
  "Selvitämme olennaiset tiedot",
  "Kommunikoimme myyjän kanssa",
  "Saat suosituksen: kannattaako edetä",
];

const WhyCheckSection = () => (
  <section className="brand-contrast brand-surface relative bg-[#22272D] py-16 text-white md:py-24">
    <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
      <div className="max-w-3xl">
        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">Tärkeä tieto</p>
        <h2 className="mt-2.5 font-display text-[34px] font-black uppercase leading-none tracking-normal text-white md:text-[48px]">
          Entä jos auto ei ole hyvä?
        </h2>
        <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
        <p className="mt-5 text-base leading-relaxed text-white md:text-lg">
          Kaikki autot eivät ole sellaisia kuin ilmoituksessa annetaan ymmärtää. Juuri siksi tarkistus kannattaa tehdä ennen ostoa.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className={`border border-white/[0.1] bg-[#2C333A] ${CHAMFER}`}
        >
          <span aria-hidden className="block h-[5px] w-1/2 bg-[#C9D1D6]" />
          <div className="p-6 md:p-8">
            <h3 className="font-display text-xl font-black uppercase leading-snug text-white">Moni ostaja kohtaa nämä haasteet</h3>
            <ul className="m-0 mt-5 list-none space-y-3 p-0">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-base text-white">
                  <X aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#E6EBEE]" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base font-bold text-white">Siksi virheitä tapahtuu – ja ne tulevat kalliiksi.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className={`border border-[#F27A13]/60 bg-[#2C333A] ${CHAMFER}`}
        >
          <span aria-hidden className="block h-[5px] w-1/2 bg-[#F27A13]" />
          <div className="p-6 md:p-8">
            <h3 className="font-display text-xl font-black uppercase leading-snug text-white">Me hoidamme tämän puolestasi</h3>
            <ul className="m-0 mt-5 list-none space-y-3 p-0">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-base text-white">
                  <Check aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#F27A13]" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base font-bold text-white">
              79 € kattaa yhden Ruotsissa myynnissä olevan auton.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
        <button
          type="button"
          onClick={() => handleCtaAction("cta:perusselvitys")}
          className="inline-flex min-h-[52px] items-center justify-center gap-2.5 bg-[#F27A13] px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#16191D] transition-colors hover:bg-[#FF9A45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Tarkista ensimmäinen auto 79 €
          <ArrowRight aria-hidden className="h-4 w-4" />
        </button>
        <p className="m-0 text-sm text-white">Yksi vältetty virhe maksaa itsensä takaisin moninkertaisesti.</p>
      </div>
    </div>
  </section>
);

export default WhyCheckSection;

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackGAEvent } from "@/lib/gaTrack";
import { openContactForm } from "@/lib/ctaTargets";

/**
 * HowCaarsWorks — white brand section: three steps on a thick graphite rule,
 * chamfered orange number tiles (Caars social-post look).
 */
const steps = [
  {
    n: "1",
    title: "Liitä auton linkki tai kerro toiveesi",
    text: "Liitä kiinnostavan auton ilmoituslinkki sivustollemme — tai kerro, millaista autoa etsit.",
  },
  {
    n: "2",
    title: "Hoidamme esteet & neuvottelun",
    text: "Olemme yhteydessä myyjään ruotsiksi, teemme perusselvityksen ja varmistamme maksusäästöt.",
  },
  {
    n: "3",
    title: "Turvallinen toimitus",
    text: "Vakuutettu rahti Suomeen ja toimitus sovittuun luovutuspisteeseen tarvittavien dokumenttien kanssa.",
  },
];

const HowCaarsWorks = () => {
  return (
    <section id="miten-toimii" className="relative bg-white py-16 text-[#1B2025] md:py-24">
      <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">Selkeä eteneminen</p>
        <h2 className="mt-2.5 font-display text-[34px] font-black uppercase leading-none tracking-normal text-[#1B2025] md:text-[48px]">
          Miten palvelu toimii?
        </h2>

        <ol className="m-0 mt-10 grid list-none gap-0 border-t-[3px] border-[#22272D] p-0 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col gap-3 py-7 md:pr-8"
            >
              <span
                aria-hidden
                className="inline-flex h-12 w-12 items-center justify-center bg-[#F27A13] font-display text-[22px] font-black text-[#16191D] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]"
              >
                {s.n}
              </span>
              <h3 className="mt-1 font-display text-xl font-black uppercase leading-snug text-[#1B2025]">{s.title}</h3>
              <p className="m-0 text-base leading-relaxed text-[#3E474F]">{s.text}</p>
            </motion.li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => {
            trackGAEvent("cta_click", { cta_type: "full_import_quote", cta_location: "how_it_works" });
            openContactForm();
          }}
          className="brand-contrast brand-surface mt-6 inline-flex min-h-[52px] items-center gap-2.5 bg-[#22272D] px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#F27A13] hover:text-[#16191D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A13] focus-visible:ring-offset-2"
        >
          Pyydä tuontitarjous
          <ArrowRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default HowCaarsWorks;

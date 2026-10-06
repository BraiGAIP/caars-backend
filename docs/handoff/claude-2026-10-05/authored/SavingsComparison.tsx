import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Gauge, Star, CalendarCheck } from "lucide-react";
import { openChatWithMessage } from "@/components/ChatBot";

/**
 * SavingsComparison — "Sama raha, parempi auto": four brand tiles with
 * orange icon tiles and a graphite CTA. Works on light and dark backgrounds.
 */
const benefits = [
  { icon: TrendingDown, title: "Halvempi", desc: "Sama budjetti riittää parempaan autoon" },
  { icon: Gauge, title: "Vähemmän ajettu", desc: "Tuontiautot usein vähäkilometrisempiä" },
  { icon: Star, title: "Paremmin varusteltu", desc: "Nappa, panorama ja lisävarusteet usein mukana" },
  { icon: CalendarCheck, title: "Uudempi", desc: "Samalla budjetilla tyypillisesti 1–2 vuotta uudempi vuosimalli" },
];

const CHAMFER = "[clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]";

interface SavingsComparisonProps {
  variant?: "light" | "dark";
}

const SavingsComparison = ({ variant = "light" }: SavingsComparisonProps) => {
  const isDark = variant === "dark";

  return (
    <div id="savings-comparison" className={isDark ? "brand-contrast brand-surface" : ""}>
      <p className={`m-0 text-xs font-extrabold uppercase tracking-[0.14em] md:text-[13px] ${isDark ? "text-[#F27A13]" : "text-[#B4520A]"}`}>
        Miksi tuontiauto
      </p>
      <h2 className={`mt-2.5 font-display text-[30px] font-black uppercase leading-none tracking-normal md:text-[40px] ${isDark ? "text-white" : "text-[#1B2025]"}`}>
        Sama raha, parempi auto
      </h2>
      <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className={`flex flex-col gap-3 border p-5 ${CHAMFER} ${isDark ? "border-white/[0.1] bg-[#2C333A]" : "border-[#DADDDA] bg-white"}`}
          >
            <span
              aria-hidden
              className="inline-flex h-11 w-11 items-center justify-center bg-[#F27A13] text-[#16191D] [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]"
            >
              <b.icon className="h-5 w-5" />
            </span>
            <h3 className={`m-0 font-display text-lg font-black uppercase leading-snug ${isDark ? "text-white" : "text-[#1B2025]"}`}>{b.title}</h3>
            <p className={`m-0 text-sm leading-relaxed ${isDark ? "text-white" : "text-[#3E474F]"}`}>{b.desc}</p>
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => openChatWithMessage("Kerro lisää tuontiauton eduista — mitä saan enemmän samalla budjetilla?")}
        className={`mt-8 inline-flex min-h-[52px] items-center gap-2.5 px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A13] focus-visible:ring-offset-2 ${
          isDark
            ? "border-2 border-[#F27A13] text-[#F27A13] hover:bg-[#F27A13] hover:text-[#16191D]"
            : "border-2 border-[#22272D] text-[#22272D] hover:bg-[#22272D] hover:text-white"
        }`}
      >
        Kerro lisää tuontiauton eduista
        <ArrowRight aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SavingsComparison;

import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";

import bmw530e from "@/assets/deals/bmw-530e.jpg";
import volvoXc60 from "@/assets/deals/volvo-xc60.jpg";
import teslaModel3 from "@/assets/deals/tesla-model3.jpg";
import audiA6 from "@/assets/deals/audi-a6.jpg";

/**
 * CompletedDeals — photo cards of delivered cars in the Caars brand style
 * (chamfered card, orange origin tag, graphite caption). Works on light and dark.
 */
interface Deal {
  car: string;
  year: number;
  origin: string;
  city: string;
  customer: string;
  image: string;
}

const deals: Deal[] = [
  { car: "BMW 530e", year: 2022, origin: "Ruotsi", city: "Turku", customer: "J.M.", image: bmw530e },
  { car: "Volvo XC60 T8", year: 2023, origin: "Ruotsi", city: "Kuopio", customer: "A.K.", image: volvoXc60 },
  { car: "Tesla Model 3 LR", year: 2023, origin: "Saksa", city: "Tampere", customer: "M.S.", image: teslaModel3 },
  { car: "Audi A6 Avant 50 TFSIe", year: 2022, origin: "Ruotsi", city: "Oulu", customer: "T.L.", image: audiA6 },
];

const benefits = ["Halvempi", "Vähemmän ajettu", "Paremmin varusteltu", "Uudempi"];

const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

interface CompletedDealsProps {
  variant?: "light" | "dark";
  maxVisible?: number;
}

const CompletedDeals = ({ variant = "light", maxVisible = 4 }: CompletedDealsProps) => {
  const isDark = variant === "dark";
  const visible = deals.slice(0, maxVisible);

  return (
    <div className={isDark ? "brand-contrast brand-surface" : ""}>
      <p className={`m-0 text-xs font-extrabold uppercase tracking-[0.14em] md:text-[13px] ${isDark ? "text-[#F27A13]" : "text-[#B4520A]"}`}>
        Toteutuneet toimitukset
      </p>
      <h2 className={`mt-2.5 font-display text-[30px] font-black uppercase leading-none tracking-normal md:text-[40px] ${isDark ? "text-white" : "text-[#1B2025]"}`}>
        Näin asiakkaamme hyötyivät
      </h2>
      <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
      <p className={`mt-5 max-w-2xl text-base leading-relaxed ${isDark ? "text-white" : "text-[#3E474F]"}`}>
        Esimerkkejä Caarsin kautta tuoduista autoista — halvempia, vähemmän ajettuja, paremmin varusteltuja ja uudempia kuin verrokit Suomessa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((deal, i) => (
          <motion.article
            key={deal.car}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`flex flex-col overflow-hidden border ${CHAMFER} ${isDark ? "border-white/[0.1] bg-[#2C333A]" : "border-[#DADDDA] bg-white"}`}
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={deal.image}
                alt={`${deal.car} – Caarsin Suomeen tuoma tuontiauto`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute left-0 top-3 bg-[#F27A13] px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#16191D]">
                Tuotu {deal.origin}sta
              </span>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-[#F27A13]" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h3 className={`m-0 font-display text-base font-black uppercase leading-snug ${isDark ? "text-white" : "text-[#1B2025]"}`}>
                  {deal.car} <span className="font-bold">({deal.year})</span>
                </h3>
                <p className={`m-0 mt-1 flex items-center gap-1.5 text-sm ${isDark ? "text-white" : "text-[#4A535B]"}`}>
                  <MapPin aria-hidden className="h-3.5 w-3.5" />
                  {deal.customer}, {deal.city}
                </p>
              </div>
              <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-1.5 p-0">
                {benefits.map((b) => (
                  <li key={b} className={`flex items-center gap-1.5 text-sm ${isDark ? "text-white" : "text-[#1B2025]"}`}>
                    <Check aria-hidden className={`h-4 w-4 shrink-0 ${isDark ? "text-[#22C3A6]" : "text-[#0F7F6B]"}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>

      <p className={`mt-5 text-sm ${isDark ? "text-white" : "text-[#4A535B]"}`}>
        Edut perustuvat asiakkaan budjetin sisällä löytyneeseen tarjontaan ostohetkellä ja vaihtelevat mallista ja markkinatilanteesta.
      </p>
    </div>
  );
};

export default CompletedDeals;

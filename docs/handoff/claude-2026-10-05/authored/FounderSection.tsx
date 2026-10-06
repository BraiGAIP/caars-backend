import { motion } from "framer-motion";
import { MapPin, Car, Users } from "lucide-react";
import founderAsset from "@/assets/caars-bmw-x5.jpg.asset.json";

/**
 * FounderSection — "Kuka palvelun takana on?" Light section, large photo with
 * orange chamfer edge, credentials as orange-tile rows.
 */
const founderImg = founderAsset.url;

const credentials = [
  { icon: Car, text: "Yli 900 autoa tarkistettu ja tuotu Suomeen vuodesta 2016" },
  { icon: Users, text: "Kumppaniverkosto Ruotsissa ja Saksassa – yli 150 liikettä" },
  { icon: MapPin, text: "Toimisto Turussa – palvelemme koko Suomea" },
];

const FounderSection = () => (
  <section className="bg-white py-16 text-[#1B2025] md:py-24">
    <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
      <div className="grid items-stretch gap-8 md:grid-cols-[5fr_7fr] md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="relative min-h-[300px] overflow-hidden [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,0_100%)]"
        >
          <img
            src={founderImg}
            alt="Caarsin Ruotsista tuoma BMW X5 kumppaniliikkeen hallissa"
            loading="lazy"
            width={640}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[5px] bg-[#F27A13]" />
        </motion.div>

        <div className="flex flex-col justify-center">
          <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">Caars</p>
          <h2 className="mt-2.5 font-display text-[34px] font-black uppercase leading-none tracking-normal text-[#1B2025] md:text-[48px]">
            Kuka palvelun takana on?
          </h2>
          <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
          <p className="mt-6 text-base leading-relaxed text-[#1B2025] md:text-lg">
            Caars on suomalainen autotuontiliike, joka auttaa yksityis- ja yritysasiakkaita löytämään ja tuomaan autoja Ruotsista ja Saksasta. Jokaisen auton taustalla on ammattilainen, joka tarkistaa, neuvottelee ja hoitaa prosessin puolestasi.
          </p>
          <ul className="m-0 mt-6 list-none space-y-4 p-0">
            {credentials.map((item) => (
              <li key={item.text} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[#22272D] text-[#F27A13] [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]"
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="pt-2 text-base leading-relaxed text-[#1B2025]">{item.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#4A535B]">Turku · Y-tunnus: 3188676-4</p>
        </div>
      </div>
    </div>
  </section>
);

export default FounderSection;

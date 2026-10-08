import { motion } from "framer-motion";

/**
 * WhyCaars — graphite brand section: numbered chamfered cards with orange /
 * turquoise accent bars (Caars social-post look). Presentation only.
 */
const benefits = [
  {
    title: "Avaamme suljetut Ruotsin markkinat",
    text: "Blocket.se ei näytä yksityismyyjien yhteystietoja suomalaisille, eivätkä monet ruotsalaiset liikkeet myy ulkomaille. Me saamme yhteystiedot ja hoidamme kaupan kumppaniverkostomme kautta.",
  },
  {
    title: "3–4 % lisäsäästö maksupalvelusta",
    text: "Caarsin ammattimainen maksupalvelu säästää asiakkaalle 3–4 % auton ostohinnasta valuuttakurssi- ja kauppatapaetujen ansiosta.",
  },
  {
    title: "Kaksikielinen tiimi & kielietu",
    text: "Asioimme ruotsiksi kuin paikalliset. Neuvottelemme parhaan hinnan ja selvitämme auton taustat perusteellisesti.",
  },
  {
    title: "Riskien minimointi (10v kokemus)",
    text: "Eliminoimme huijaukset, kolaritaustat ja mittariruuvaukset. Teemme perusteellisen taustatarkastuksen ennen ostopäätöstä.",
  },
  {
    title: "Luotettava rahti Suomeen",
    text: "Vakuutettu kuljetus ja ammattimainen tuontilogistiikka Suomeen — toimitus sovittuun luovutuspisteeseen.",
  },
];

const ACCENTS = ["#F27A13", "#22C3A6"] as const;
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

const WhyCaars = () => {
  return (
    <section id="miksi-caars" className="brand-contrast brand-surface relative bg-[#22272D] py-16 text-white md:py-24">
      <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10 max-w-2xl md:mb-12">
          <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">Kokemus ratkaisee</p>
          <h2 className="mt-2.5 font-display text-[34px] font-black uppercase leading-none tracking-normal text-white md:text-[48px]">
            Miksi Caars?
          </h2>
          <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
          <p className="mt-5 text-base leading-relaxed text-white md:text-lg">
            Caars ei ole autoliike vaan sinun oma asiantuntijasi Ruotsin markkinoilla. Nämä viisi asiaa erottavat meidät muista.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const accent = ACCENTS[i % 2];
            return (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex flex-col border border-white/[0.1] bg-[#2C333A] pb-6 ${CHAMFER}`}
              >
                <span aria-hidden className="block h-[5px] w-1/2" style={{ backgroundColor: accent }} />
                <div className="px-6 pt-5">
                  <p
                    aria-hidden
                    className={`m-0 font-display text-[34px] font-black leading-none ${i % 2 === 0 ? "text-[#F27A13]" : "text-[#22C3A6]"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-black uppercase leading-snug text-white md:text-xl">{b.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white">{b.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyCaars;

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Loader2, ShieldCheck, ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { requestCheckout } from "@/components/CheckoutDialog";
import TuontiApuCheckoutDialog from "@/components/TuontiApuCheckoutDialog";
import { openContactForm } from "@/lib/ctaTargets";
import HumanTrustCTA from "@/components/HumanTrustCTA";

/**
 * Pricing — graphite brand band with white chamfered price cards.
 * Checkout logic is unchanged (server owns the price catalogue).
 */
const pricingPlans = [
  {
    name: "Perusselvitys",
    price: "79",
    priceCents: 7900,
    description: "Selvitämme auton taustat, myyjän luotettavuuden ja olennaiset tiedot ennen ostopäätöstä",
    features: [
      "Yhteydenotto myyjään ja saatavuuden varmistaminen",
      "Kysymykset vaurioista, huolloista ja renkaista",
      "Katsastus- ja huoltohistorian tarkistus",
      "Myyjäliikkeen taustojen arviointi",
      "Ammattimainen hintaneuvottelu",
      "Suositus: kannattaako viedä eteenpäin",
    ],
    popular: true,
    stripeImage: "stripe-remote.jpg",
  },
  {
    name: "Etsintäpalvelu",
    price: "79",
    priceCents: 7900,
    description: "Etsimme kriteereilläsi kolme sopivaa autoa perusteltuine ehdotuksineen. Etsintäpalvelu + 99 € sisältää lisäksi Perusselvityksen valitusta autosta.",
    clarifier: "3 autoa per tilaus kriteereidesi perusteella",
    features: [
      "3 auton etsintä per tilaus kriteereidesi perusteella",
      "Perustellut ehdotukset ja markkinahinta-arvio",
      "Ei sisällä Perusselvitystä",
      "Etsintäpalvelu + 99 €: Perusselvitys valitusta autosta",
      "Hyvitetään täysimääräisenä tuonnissa",
    ],
    popular: false,
    stripeImage: "stripe-bundle.jpg",
  },
  {
    name: "TuontiApu",
    price: "250",
    priceCents: 25000,
    description: "Henkilökohtainen apu ja kirjalliset ohjeet koko maahantuontiprosessiin.",
    features: [
      "Henkilökohtainen tuki Caarsin asiantuntijalta koko prosessin ajan",
      "Kirjalliset, vaihe vaiheelta -ohjeet tarvittavista dokumenteista",
      "Apua käyttöönotto- ja autoveroilmoituksen tekemiseen OmaVerossa",
      "Rekisteröinnin ja katsastuksen aikataulu ja järjestys",
      "Vastaukset kysymyksiisi koko prosessin ajan",
    ],
    popular: false,
    stripeImage: "stripe-paperwork.jpg",
  },
  {
    name: "Avaimet käteen -tuonti",
    price: "1 290",
    description: "Hoidamme tuonnin käytännön vaiheet puolestasi",
    clarifier: "Neuvottelu, kuljetus, dokumentit ja kirjalliset viranomaisohjeet — vakuutettu rahti Suomeen. Maksupalvelu 149 € on erillinen palvelu.",
    features: [
      "Haku Turkuun",
      "Viranomaisasioissa avustaminen",
      "Max 3 myyjän kanssa asiointi",
      "Paperityöt ja dokumentit",
      "Hinta auton sijainnin mukaan",
    ],
    popular: true,
    pricePrefix: "alk.",
    isContact: true,
  },
  {
    name: "Rahoitus & Vaihtoauto",
    price: "Kysy tarjous",
    description: "Autohalli.com – tarjoukset Caarsin kautta",
    features: [
      "Ei erillistä Caarsin palvelu- tai tuontimaksua",
      "Rahoitus- ja vaihtoautotarjoukset Caarsin kautta",
      "Auto rekisteröitynä ja katsastettuna",
      "Autoveron ja viranomaisasioiden järjestelyt eivät jää sinulle",
      "Rahoitus edellyttää luottopäätöstä",
    ],
    popular: false,
    isCustom: true,
    isContact: true,
  },
];

const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

const Pricing = () => {
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [tuontiApuOpen, setTuontiApuOpen] = useState(false);

  const handleStripeCheckout = async (plan: typeof pricingPlans[0]) => {
    if (!plan.priceCents) return;
    // Perusselvitys opens the in-app checkout dialog directly (1 click).
    if (plan.name === "Perusselvitys") {
      requestCheckout();
      return;
    }
    // TuontiApu kerää ensin nimen + sähköpostin (näkyy Maksut-näkymässä).
    if (plan.name === "TuontiApu") {
      setTuontiApuOpen(true);
      return;
    }

    setCheckingOut(plan.name);
    try {
      const origin = window.location.origin;
      const { buildCheckoutTracking } = await import("@/lib/checkoutTracking");
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{
            name: plan.name,
            price: plan.priceCents,
            image: `${origin}/images/${plan.stripeImage}`,
          }],
          tracking: buildCheckoutTracking(),
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout-linkkiä ei saatu");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Maksun käsittelyssä tapahtui virhe. Yritä uudelleen.");
    } finally {
      setCheckingOut(null);
    }
  };

  const handleContact = () => {
    openContactForm();
  };

  return (
    <section id="pricing" className="brand-contrast brand-surface relative bg-[#22272D] py-16 text-white md:py-24">
      <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">Valitse palvelupaketti</p>
          <h2 className="mt-2.5 font-display text-[34px] font-black uppercase leading-none tracking-normal text-white md:text-[48px]">
            Selkeä hinnoittelu
          </h2>
          <span aria-hidden className="mt-5 block h-[3px] w-[120px] bg-[#F27A13]" />
          <p className="mt-5 text-base leading-relaxed text-white md:text-lg">
            Ei piilokustannuksia. Tiedät aina etukäteen, mitä palvelu maksaa. Caarsin maksullisten palvelujen työ alkaa tilauksen ja maksun jälkeen.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pricingPlans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`brand-light-card relative flex flex-col bg-white text-[#1B2025] ${CHAMFER} ${plan.popular ? "outline outline-2 outline-offset-0 outline-[#F27A13]" : ""}`}
            >
              <span aria-hidden className={`block h-[5px] w-1/2 ${plan.isCustom ? "bg-[#C9D1D6]" : "bg-[#F27A13]"}`} />
              {plan.popular && (
                <span className="absolute right-6 top-4 bg-[#22272D] px-2.5 py-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-white">
                  Suosituin
                </span>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="m-0 pr-20 font-display text-lg font-black uppercase leading-snug text-[#1B2025]">{plan.name}</h3>
                <p className="m-0 mt-4 font-display font-black leading-none text-[#1B2025]">
                  {plan.isCustom ? (
                    <span className="text-2xl">{plan.price}</span>
                  ) : (
                    <>
                      {plan.pricePrefix && <span className="mr-1 text-base font-extrabold">{plan.pricePrefix}</span>}
                      <span className="text-[38px]">{plan.price}</span>
                      <span className="ml-1 text-xl"> €</span>
                    </>
                  )}
                </p>
                <p className="m-0 mt-4 text-sm leading-relaxed text-[#3E474F]">{plan.description}</p>
                {"clarifier" in plan && plan.clarifier && (
                  <p className="m-0 mt-2 text-sm font-bold leading-relaxed text-[#B4520A]">{plan.clarifier}</p>
                )}
                <ul className="m-0 mt-5 flex-1 list-none space-y-2.5 border-t border-[#E6E8E5] p-0 pt-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm leading-snug text-[#1B2025]">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#B4520A]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.priceCents ? (
                  <button
                    type="button"
                    className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-[#F27A13] px-4 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#16191D] transition-colors hover:bg-[#FF9A45] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22272D] focus-visible:ring-offset-2"
                    onClick={() => handleStripeCheckout(plan)}
                    disabled={checkingOut === plan.name}
                  >
                    {checkingOut === plan.name ? (
                      <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard aria-hidden className="h-4 w-4" />
                    )}
                    {checkingOut === plan.name ? "Käsitellään..." : `Osta – ${plan.price} €`}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 border-2 border-[#22272D] px-4 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#22272D] transition-colors hover:bg-[#22272D] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A13] focus-visible:ring-offset-2"
                    onClick={handleContact}
                  >
                    {plan.isCustom ? "Kysy asiantuntijalta" : "Pyydä tarjous"}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 border-t border-white/[0.12] pt-6 text-sm text-white md:grid-cols-3">
          <p className="m-0 flex items-start gap-2.5">
            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#22C3A6]" />
            79 € hyvitetään täysimääräisesti Avaimet käteen -tuonnin hinnasta, jos etenet tuontiin.
          </p>
          <p className="m-0 flex items-start gap-2.5">
            <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#22C3A6]" />
            Turvallinen maksu Stripellä · Visa, Mastercard, Apple Pay
          </p>
          <p className="m-0 flex items-start gap-2.5">
            <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#22C3A6]" />
            Perusselvitys koskee yhtä Ruotsissa myynnissä olevaa autoa.
          </p>
        </div>

        <HumanTrustCTA variant="pricing" />

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white">
          Rahoitus ja vaihtoauto: valitse auto Ruotsista ja osta se suomalaisesta Autohalli.com-autoliikkeestä. Caars hoitaa käytännön työn ja välittää molemmat tarjoukset. Kuluttajana ostettaessa sovelletaan Suomen kuluttajansuojaa. Käsiraha maksetaan Autohalli.comille, kustannukset ovat auton kokonaistarjouksessa ja rahoitus edellyttää luottopäätöstä.
        </p>
      </div>
      <TuontiApuCheckoutDialog open={tuontiApuOpen} onOpenChange={setTuontiApuOpen} />
    </section>
  );
};

export default Pricing;

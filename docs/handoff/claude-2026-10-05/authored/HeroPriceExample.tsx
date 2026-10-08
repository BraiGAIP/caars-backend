import { Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import pricing from "../../shared/pricing.json";

/**
 * HeroPriceExample — light brand section (Caars social-post look on light):
 * orange eyebrow + rule, chamfered white card, graphite total row with orange price.
 * Figures are illustrative examples, not binding offers.
 */
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,0_100%)]";

const HeroPriceExample = () => {
  const tuonti = pricing.services.avaimetKateenTuonti;
  const stockholm = pricing.transportPrices[0];

  const rows: { label: string; value: string; note?: string }[] = [
    {
      label: "Auton hinta Ruotsissa",
      value: "n. 24 300 €",
      note: "Tesla Model 3 Long Range 2022, 279 000 SEK, Tukholman seutu",
    },
    {
      label: `${tuonti.name} (${stockholm.name})`,
      value: stockholm.label,
      note: "Taustojen selvitys, hintaneuvottelu, vakuutettu rahti ja dokumentit sovitun tarjouksen mukaan",
    },
    {
      label: "Autovero",
      value: "0 €",
      note: "Täyssähköauto, ensirekisteröinti 1.10.2021 jälkeen — todennäköisesti autoveroton. Lopullisen päätöksen tekee Verohallinto.",
    },
    {
      label: "Rekisteröinti ja kilvet",
      value: "n. 100 €",
      note: "Käyttöönotto- ja autoveroilmoitus tehdään OmaVerossa",
    },
  ];

  return (
    <section
      aria-label="Tuontikulujen esimerkkilaskelma ja linkki kustannuslaskuriin"
      className="home-cost-module bg-[#F2F3F1] text-[#1B2025]"
    >
      <div className="container mx-auto max-w-[1040px] px-4 py-16 sm:px-6 md:py-20">
        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A] md:text-[13px]">
          Kustannuslaskuri
        </p>
        <h2 className="mt-2.5 font-display text-[28px] font-black uppercase leading-[1.05] tracking-normal text-[#1B2025] md:text-[40px]">
          Selvitä tuontisi kokonaiskustannus hetkessä
        </h2>
        <span aria-hidden className="mt-4 block h-[3px] w-[120px] bg-[#F27A13]" />
        <p className="mt-5 max-w-[680px] text-base leading-relaxed text-[#3E474F] md:text-lg">
          Syötä auton sijainti ja valitse tarvitsemasi palvelut. Saat suuntaa-antavan arvion kuljetuksesta,
          palvelumaksuista ja muista kuluista ilman rekisteröitymistä.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/kustannuslaskuri"
            className="home-cost-action inline-flex min-h-[52px] items-center justify-center gap-2.5 bg-[#F27A13] px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#16191D] no-underline transition-colors hover:bg-[#FF9A45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22272D] focus-visible:ring-offset-2"
          >
            <Calculator aria-hidden className="h-5 w-5" />
            Laske oman autosi tuontihinta
          </Link>
          <Link
            to="/hinnasto"
            className="home-cost-action inline-flex min-h-[52px] items-center justify-center gap-2.5 border-2 border-[#22272D] px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#22272D] no-underline transition-colors hover:bg-[#22272D] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A13] focus-visible:ring-offset-2"
          >
            Katso hinnasto
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        <div className={`mt-10 border border-[#DADDDA] bg-white ${CHAMFER}`}>
          <span aria-hidden className="block h-[5px] w-[40%] bg-[#F27A13] [clip-path:polygon(0_0,100%_0,calc(100%-6px)_100%,0_100%)]" />
          <div className="px-5 pb-2 pt-6 sm:px-8">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4520A]">Esimerkkilaskelma</p>
            <h3 className="mt-1.5 font-display text-lg font-black uppercase leading-tight text-[#1B2025] md:text-[22px]">
              Tesla Model 3 Long Range — Tukholmasta Suomeen
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table role="table" className="w-full border-collapse text-left">
              <caption className="sr-only">
                Havainnollinen arvio Tesla Model 3 Long Range -auton hinnasta ja tuontikuluista Tukholmasta Suomeen
              </caption>
              <tbody role="rowgroup">
                {rows.map((r) => (
                  <tr role="row" key={r.label} className="border-t border-[#E6E8E5] align-top">
                    <th role="rowheader" scope="row" className="px-5 py-4 text-sm font-bold text-[#1B2025] sm:px-8 sm:text-base">
                      {r.label}
                      {r.note && <span className="mt-1 block text-xs font-normal leading-relaxed text-[#4A535B]">{r.note}</span>}
                    </th>
                    <td role="cell" className="whitespace-nowrap px-5 py-4 text-right text-sm font-extrabold tabular-nums text-[#1B2025] sm:px-8 sm:text-base">
                      {r.value}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot role="rowgroup">
                <tr role="row" className="brand-contrast brand-surface bg-[#22272D] text-white">
                  <th role="rowheader" scope="row" className="px-5 py-5 font-display text-sm font-black uppercase tracking-wide text-white sm:px-8 sm:text-[17px]">
                    Kokonaishinta Suomessa, valmiina ajoon
                  </th>
                  <td role="cell" className="whitespace-nowrap px-5 py-5 text-right font-display text-xl font-black tabular-nums text-[#F27A13] sm:px-8 sm:text-[26px]">
                    n. 25 700 €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="m-0 border-t border-[#E6E8E5] px-5 py-4 text-sm leading-relaxed text-[#1B2025] sm:px-8">
            <span className="font-bold">Maksupalvelu 149 € on erillinen valinnainen palvelu.</span>{" "}
            Se ei sisälly tämän esimerkin noin 25 700 € kokonaishintaan.
          </p>
          <p className="m-0 border-t border-[#E6E8E5] px-5 py-5 text-sm leading-relaxed text-[#3E474F] sm:px-8">
            Vastaavan auton esimerkkihinta Suomen käytettyjen markkinoilla on{" "}
            <span className="font-bold text-[#1B2025]">28 000–30 000 €</span>. Hinnat ja kulut vaihtelevat auton,
            sijainnin ja ajankohdan mukaan. Laske omalle autollesi suuntaa-antava arvio.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroPriceExample;

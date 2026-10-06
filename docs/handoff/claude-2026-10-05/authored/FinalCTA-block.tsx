        {/* 9. Final CTA — graphite brand band with photo */}
        <section className="brand-contrast brand-surface relative overflow-hidden bg-[#22272D] py-20 text-white md:py-28">
          <img
            src={finalCtaBg}
            alt=""
            loading="lazy"
            className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-60 md:w-[62%]"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,39,45,0.85)_0%,rgba(34,39,45,0.92)_100%)] md:bg-[linear-gradient(90deg,#22272D_38%,rgba(34,39,45,0.55)_75%,rgba(34,39,45,0.35)_100%)]" />
          <div className="container relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">Aloita tänään</p>
            <h2 className="mt-2.5 font-display text-[36px] font-black uppercase leading-none tracking-normal text-white md:text-[56px]">
              Valmis aloittamaan?
            </h2>
            <span aria-hidden className="mt-5 block h-[3px] w-[160px] bg-[#F27A13]" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openCheckout()}
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 bg-[#F27A13] px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#16191D] transition-colors hover:bg-[#FF9A45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Tilaa Perusselvitys 79 €
                <ArrowRight aria-hidden className="h-4 w-4" />
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 border-2 border-[#F27A13] px-6 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-[#F27A13] no-underline transition-colors hover:bg-[#F27A13] hover:text-[#16191D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle aria-hidden className="h-4 w-4" />
                Kysy WhatsAppissa
              </a>
            </div>
          </div>
        </section>

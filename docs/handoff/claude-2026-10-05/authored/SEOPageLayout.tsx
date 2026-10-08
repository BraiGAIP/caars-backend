import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ChatBot from "@/components/ChatBot";
import HeroVideoBackground from "@/components/HeroVideoBackground";

/**
 * SEOPageLayout + building blocks in the Caars brand style:
 * graphite video hero, orange eyebrow + rule, Exo 2 uppercase headings,
 * chamfered cards with orange accent bars. Public API unchanged.
 */
export const seoFade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5 },
};

const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

interface HeroBadge {
  icon: LucideIcon;
  text: string;
  color?: string;
}

interface SEOPageLayoutProps {
  title: string;
  description: string;
  path: string;
  h1: React.ReactNode;
  subtitle: string;
  badge: HeroBadge;
  schema?: Record<string, unknown>;
  /** Kuvaileva alt-teksti hero-kuvalle (SEO + saavutettavuus) */
  heroImageAlt?: string;
  children: React.ReactNode;
}

export const SEOPageLayout = ({ title, description, path, h1, subtitle, badge, schema, heroImageAlt, children }: SEOPageLayoutProps) => {
  const BadgeIcon = badge.icon;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={path} />
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <Header />
      <main>
        <section className="brand-contrast brand-surface relative overflow-hidden bg-[#22272D] pb-16 pt-28 text-white md:pb-20 md:pt-36">
          <HeroVideoBackground
            posterAlt={heroImageAlt}
            overlayClassName="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,39,45,0.7)_0%,rgba(34,39,45,0.88)_60%,#22272D_100%)] md:bg-[linear-gradient(90deg,#22272D_25%,rgba(34,39,45,0.82)_50%,rgba(34,39,45,0.45)_100%)]"
          />
          <div className="container relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
            <motion.div {...seoFade} className="max-w-3xl">
              <p className="m-0 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F27A13] md:text-[13px]">
                <BadgeIcon aria-hidden className="h-4 w-4" />
                {badge.text}
              </p>
              <h1 className="mt-4 font-display text-[34px] font-black uppercase leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-[60px]">
                {h1}
              </h1>
              <span aria-hidden className="mt-6 block h-[3px] w-[140px] bg-[#F27A13]" />
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white sm:text-xl">{subtitle}</p>
            </motion.div>
          </div>
        </section>
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

/* Reusable section wrapper with alternating surfaces */
type SurfaceType = "soft" | "warm" | "dark";

interface ContentSectionProps {
  surface?: SurfaceType;
  children: React.ReactNode;
  className?: string;
}

export const ContentSection = ({ surface = "soft", children, className }: ContentSectionProps) => {
  const bgMap: Record<SurfaceType, string> = {
    soft: "bg-[#F2F3F1] text-[#1B2025]",
    warm: "bg-white text-[#1B2025]",
    dark: "brand-contrast brand-surface bg-[#22272D] text-white",
  };

  return (
    <section className={`relative py-16 md:py-24 ${bgMap[surface]}`}>
      <div className="container relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6">
        <motion.div {...seoFade} className={className || "mx-auto max-w-3xl"}>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

/* Section heading with icon */
interface SectionHeadingProps {
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  dark?: boolean;
}

export const SectionHeading = ({ icon: Icon, children, dark }: SectionHeadingProps) => (
  <div className="mb-8">
    <div className="flex items-center gap-4">
      <span
        aria-hidden
        className="brand-surface inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[#22272D] text-[#F27A13] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]"
      >
        <Icon className="h-6 w-6" />
      </span>
      <h2 className={`m-0 font-display text-2xl font-black uppercase leading-tight tracking-normal sm:text-[32px] ${dark ? "text-white" : "text-[#1B2025]"}`}>
        {children}
      </h2>
    </div>
    <span aria-hidden className="mt-4 block h-[3px] w-[96px] bg-[#F27A13]" />
  </div>
);

/* Elevated (light) card */
export const ElevatedCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`brand-light-card relative border border-[#DADDDA] bg-white p-6 text-[#1B2025] sm:p-8 ${CHAMFER} ${className}`}>
    <span aria-hidden className="absolute left-0 top-0 h-[5px] w-[40%] bg-[#F27A13]" />
    {children}
  </div>
);

/* Dark card for dark sections */
export const DarkCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`brand-contrast brand-surface relative border border-white/[0.1] bg-[#2C333A] p-6 text-white sm:p-8 ${CHAMFER} ${className}`}>
    <span aria-hidden className="absolute left-0 top-0 h-[5px] w-[40%] bg-[#F27A13]" />
    {children}
  </div>
);

/* Internal links block */
export const InternalLinks = ({ links, dark }: { links: { href: string; label: string }[]; dark?: boolean }) => (
  <div className={`mt-10 border-t-[3px] pt-6 ${dark ? "border-white/[0.15]" : "border-[#22272D]"}`}>
    <p className={`m-0 mb-4 text-xs font-extrabold uppercase tracking-[0.14em] ${dark ? "text-[#F27A13]" : "text-[#B4520A]"}`}>Lue myös</p>
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`inline-flex min-h-[44px] items-center border-2 px-4 font-display text-sm font-bold uppercase tracking-wide no-underline transition-colors ${
            dark
              ? "border-white/[0.25] text-white hover:border-[#F27A13] hover:text-[#F27A13]"
              : "brand-surface border-[#22272D] text-[#22272D] hover:bg-[#22272D] hover:text-white"
          }`}
        >
          {link.label}
        </a>
      ))}
    </div>
  </div>
);

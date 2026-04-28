import Link from "next/link";
import { ArrowRight, Home, CalendarDays, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import GraphicElementComponent from "@/components/_shared/graphic-element.component";
import RevealOnScrollComponent from "@/components/_shared/motion/reveal-on-scroll.component";
import SectionHeadingComponent from "@/components/_shared/section-heading.component";
import StickerPhotoComponent from "@/components/_shared/sticker-photo.component";
import WaveDividerComponent from "@/components/_shared/wave-divider.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

const quickLinks = [
  {
    href: "/",
    label: "Retour à l’accueil",
    description:
      "Retrouvez immédiatement la page d’accueil, l’ambiance du lieu et les accès principaux du site.",
    icon: Home,
  },
  {
    href: "/menus",
    label: "Carte & menus",
    description:
      "Consultez la carte, les suggestions et les menus disponibles de la maison.",
    icon: ArrowRight,
  },
  {
    href: "/reservations",
    label: "Réserver une table",
    description:
      "Préparez votre venue et choisissez directement votre créneau en ligne.",
    icon: CalendarDays,
  },
  {
    href: "/contact",
    label: "Nous contacter",
    description:
      "Une question, un groupe ou une demande particulière ? L’équipe reste joignable.",
    icon: Phone,
  },
];

function QuickLinkCard({ item, index }) {
  const Icon = item.icon;

  return (
    <RevealOnScrollComponent
      as="article"
      delay={index * 80}
      variant="up"
      className="site-card flex h-full flex-col rounded-[30px] p-6 tablet:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--site-line)] bg-white/72 text-[var(--site-orange-deep)]">
          <Icon size={20} strokeWidth={1.7} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]">
          0{index + 1}
        </span>
      </div>

      <h3 className="yeseva-one-regular mt-8 text-[34px] leading-[0.92] text-[var(--site-ink)] tablet:text-[38px]">
        {item.label}
      </h3>

      <p className="mt-5 flex-1 text-[16px] leading-[1.8] text-[var(--site-ink-soft)] tablet:text-[17px]">
        {item.description}
      </p>

      <Link
        href={item.href}
        className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--site-orange-deep)] transition hover:opacity-70"
      >
        Explorer
        <ArrowRight size={16} strokeWidth={1.7} />
      </Link>
    </RevealOnScrollComponent>
  );
}

export default function NotFoundPage() {
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;

    if (!heroEl) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrolledNav(entry.intersectionRatio <= 0.1);
      },
      {
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SeoHeadComponent
        title="Page introuvable - Les Capucins by Lily"
        description="La page demandée est introuvable. Revenez à l’accueil, consultez la carte ou réservez votre table chez Les Capucins by Lily."
        path="/404"
        image="/img/hero/header.jpg"
        noIndex
      />

      <div className="relative bg-[var(--site-cream)]">
        <NavComponent
          isVisible={!showScrolledNav}
          scrolled={false}
          logoSrc="/img/logo.png"
        />

        <NavComponent
          isVisible={showScrolledNav}
          scrolled
          logoSrc="/img/logo.png"
        />

        <main>
          <section
            ref={heroRef}
            className="relative isolate overflow-hidden px-5 pb-28 pt-36 text-[var(--site-cream)] tablet:px-8 tablet:pb-32 tablet:pt-40 desktop:px-[90px] desktop:pb-36 desktop:pt-44"
          >
            <div
              className="absolute inset-0 bg-cover bg-center site-ken-burns"
              style={{ backgroundImage: "url('/img/hero/header.jpg')" }}
            />
            <div className="absolute inset-0 bg-[rgba(55,26,16,0.64)]" />

            <div className="relative mx-auto grid max-w-[1500px] gap-12 desktop:grid-cols-[1.05fr_0.95fr] desktop:items-center desktop:gap-20">
              <div className="relative z-10 max-w-[760px]">
                <RevealOnScrollComponent
                  as="p"
                  variant="up"
                  className="script-font text-[48px] leading-none text-[var(--site-orange)] tablet:text-[62px] desktop:text-[74px]"
                >
                  Oups
                </RevealOnScrollComponent>

                <RevealOnScrollComponent
                  as="h1"
                  delay={90}
                  variant="up"
                  className="yeseva-one-regular mt-4 text-balance text-[54px] leading-[0.92] text-[var(--site-cream)] tablet:text-[74px] desktop:text-[96px]"
                >
                  Cette page n&apos;est plus à la carte.
                </RevealOnScrollComponent>

                <RevealOnScrollComponent
                  as="p"
                  delay={180}
                  variant="soft"
                  className="mt-6 max-w-[640px] text-[17px] leading-[1.9] text-[var(--site-cream-soft)] tablet:text-[19px]"
                >
                  L&apos;adresse que vous cherchez n&apos;est plus disponible
                  ou a changé. Le plus simple est de repartir vers
                  l&apos;accueil, consulter la carte ou réserver votre table en
                  quelques secondes.
                </RevealOnScrollComponent>

                <RevealOnScrollComponent
                  delay={260}
                  variant="soft"
                  className="mt-8 flex flex-col gap-4 tablet:flex-row"
                >
                  <Link href="/" className="site-button">
                    Retour à l’accueil
                  </Link>
                  <Link
                    href="/reservations"
                    className="site-button site-button--secondary"
                  >
                    Réserver une table
                  </Link>
                </RevealOnScrollComponent>

                <RevealOnScrollComponent
                  delay={340}
                  variant="soft"
                  className="mt-10 rounded-[24px] border border-[rgba(246,231,230,0.24)] bg-[rgba(255,255,255,0.08)] px-5 py-5 tablet:max-w-[540px] tablet:px-6"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--site-orange)]">
                    Erreur 404
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.8] text-[rgba(246,231,230,0.82)] tablet:text-[16px]">
                    Les accès essentiels du site restent disponibles juste en
                    dessous pour éviter toute impasse.
                  </p>
                </RevealOnScrollComponent>
              </div>

              <RevealOnScrollComponent
                delay={180}
                variant="zoom"
                className="relative z-10 mx-auto w-full max-w-[560px]"
              >
                <div className="site-soft-card rounded-[34px] border border-[rgba(246,231,230,0.26)] px-6 py-6 tablet:px-8 tablet:py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange)]">
                    Les Capucins by Lily
                  </p>
                  <p className="script-font mt-4 text-[46px] leading-none text-[var(--site-cream)] tablet:text-[58px]">
                    Toujours la bonne adresse
                  </p>
                  <p className="mt-4 text-[16px] leading-[1.85] text-[rgba(246,231,230,0.82)] tablet:text-[17px]">
                    Cuisine italienne généreuse, ambiance chaleureuse et accès
                    directs vers les pages les plus utiles du site.
                  </p>

                  <div className="mt-8 grid gap-4 tablet:grid-cols-2">
                    <div className="rounded-[22px] border border-[rgba(246,231,230,0.22)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--site-orange)]">
                        Carte
                      </p>
                      <p className="mt-2 text-[15px] leading-[1.75] text-[rgba(246,231,230,0.84)]">
                        Pizzas, plats, desserts et suggestions.
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[rgba(246,231,230,0.22)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--site-orange)]">
                        Réservation
                      </p>
                      <p className="mt-2 text-[15px] leading-[1.75] text-[rgba(246,231,230,0.84)]">
                        Une table en quelques clics, selon vos disponibilités.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScrollComponent>
            </div>

            <WaveDividerComponent
              fill="var(--site-cream)"
              detail="rgba(223,160,132,0.9)"
              secondaryDetail="rgba(255,255,255,0.62)"
              height={108}
              position="bottom"
              flipY
              scaleY={0.95}
              overlap={8}
            />
          </section>

          <section className="site-shell relative overflow-visible px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
            <div className="relative mx-auto max-w-[1450px]">
              <GraphicElementComponent
                src="/img/elements/4.png"
                className="left-[-78px] top-[26px] hidden h-[240px] w-[160px] opacity-42 desktop:block"
                sizes="160px"
              />
              <GraphicElementComponent
                src="/img/elements/2.png"
                className="right-[-122px] top-[32%] hidden h-[220px] w-[220px] opacity-38 desktop:block"
                sizes="220px"
              />
            

              <div className="relative z-10">
                <SectionHeadingComponent
                  eyebrow="Navigation rapide"
                  title="Retrouvez le bon chemin"
                  description="Les pages principales du site restent accessibles ici pour vous permettre de reprendre votre visite sans détour."
                />

                <div className="mt-14 grid gap-6 tablet:grid-cols-2">
                  {quickLinks.map((item, index) => (
                    <QuickLinkCard
                      key={item.href}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <FooterComponent />
        </main>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

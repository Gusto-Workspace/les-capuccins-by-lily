import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

const quickLinks = [
  {
    href: "/menus",
    label: "Découvrir la carte",
    description:
      "Retrouvez la carte, les menus et les suggestions de Les Capucins by Lily.",
  },
  {
    href: "/reservations",
    label: "Réserver une table",
    description:
      "Accédez directement à la réservation en ligne pour préparer votre venue.",
  },
  {
    href: "/contact",
    label: "Nous contacter",
    description:
      "Une demande particulière, un groupe ou une question pratique : la page contact reste à portée de main.",
  },
];

export default function NotFoundPage() {
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIntroVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function getRevealClassNames(
    delayClassName,
    hiddenTransformClassName = "translate-y-8",
    visibleTransformClassName = "translate-y-0",
  ) {
    return `${introVisible ? `${visibleTransformClassName} opacity-100` : `${hiddenTransformClassName} opacity-0`} transform-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClassName} motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`;
  }

  return (
    <>
      <SeoHeadComponent
        title="Page introuvable - Les Capucins by Lily"
        description="La page demandée est introuvable. Revenez à l'accueil, consultez la carte ou réservez une table chez Les Capucins by Lily."
        path="/404"
        image="/img/hero/2.jpg"
        noIndex
      />

      <div className="relative bg-[#022401]">
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
            className="relative overflow-hidden bg-[#022401] px-5 pb-20 pt-[128px] text-white tablet:px-8 tablet:pb-24 tablet:pt-[148px] desktop:px-[90px] desktop:pb-[120px] desktop:pt-[172px]"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-y-0 right-0 hidden w-full bg-[#0a2f07]/20 desktop:block desktop:w-[60%]" />
              <div className="absolute inset-0 bg-black/12" />
            </div>

            <div className="relative mx-auto grid max-w-[1600px] gap-14 min-[1180px]:grid-cols-[minmax(0,1fr)_minmax(420px,620px)] min-[1180px]:items-center min-[1180px]:gap-[72px]">
              <div className="relative z-10 max-w-[760px]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-[-58px] hidden yeseva-one-regular text-[170px] leading-none tracking-[-0.08em] text-white/5 desktop:block"
                >
                  404
                </span>

                <p
                  className={`${getRevealClassNames("delay-[80ms]", "-translate-x-8", "translate-x-0")} text-[12px] uppercase tracking-[0.34em] text-[#d4bf96] tablet:text-[14px] tablet:tracking-[0.4em] desktop:text-[15px]`}
                >
                  Erreur 404
                </p>

                <h1
                  className={`${getRevealClassNames("delay-[180ms]", "-translate-x-10", "translate-x-0")} yeseva-one-regular mt-5 max-w-[680px] text-[44px] leading-[0.96] tracking-[-0.05em] text-white tablet:text-[64px] desktop:text-[86px] desktop:leading-[0.92]`}
                >
                  Cette page n&apos;est plus à la carte.
                </h1>

                <p
                  className={`${getRevealClassNames("delay-[280ms]", "-translate-x-12", "translate-x-0")} mt-6 max-w-[640px] text-[17px] font-extralight leading-[1.75] text-white/74 tablet:text-[19px] desktop:mt-8 desktop:text-[22px] desktop:leading-[1.7]`}
                >
                  L&apos;adresse demandée est introuvable, a peut-être été
                  déplacée ou n&apos;est plus disponible. Vous pouvez revenir à
                  l&apos;accueil, consulter la carte ou réserver votre table en
                  quelques secondes.
                </p>

                <div
                  className={`${getRevealClassNames("delay-[380ms]")} mt-10 flex flex-col gap-4 tablet:mt-11 tablet:flex-row`}
                >
                  <Link
                    href="/"
                    className="flex h-[54px] w-full max-w-[260px] items-center justify-center bg-[#bb924b] px-6 text-[12px] font-medium uppercase tracking-[0.24em] text-white transition hover:opacity-90 tablet:text-[13px] tablet:tracking-[0.28em]"
                  >
                    Retour à l&apos;accueil
                  </Link>

                  <Link
                    href="/reservations"
                    className="flex h-[54px] w-full max-w-[260px] items-center justify-center border border-white/18 bg-white/5 px-6 text-[12px] font-medium uppercase tracking-[0.24em] text-white transition hover:border-[#d4bf96] hover:bg-white/10 tablet:text-[13px] tablet:tracking-[0.28em]"
                  >
                    Réserver une table
                  </Link>
                </div>

                <div
                  className={`${getRevealClassNames("delay-[480ms]")} mt-10 border-l border-[#b48a45] pl-5 tablet:mt-12 tablet:pl-6`}
                >
                  <p className="text-[12px] uppercase tracking-[0.24em] text-[#d4bf96] tablet:text-[13px] tablet:tracking-[0.3em]">
                    Besoin d&apos;un autre chemin ?
                  </p>

                  <p className="mt-3 max-w-[540px] text-[15px] font-light leading-[1.75] text-white/66 tablet:text-[16px] desktop:text-[18px]">
                    Les accès essentiels du site restent disponibles juste
                    dessous pour éviter toute impasse.
                  </p>
                </div>
              </div>

              <div
                className={`${getRevealClassNames("delay-[260ms]", "translate-y-12", "translate-y-0")} relative z-10 mx-auto w-full max-w-[620px]`}
              >
                <div className="relative overflow-hidden rounded-t-[180px] border border-[#b48a45]/80 p-3 tablet:rounded-t-[230px] tablet:p-4 desktop:rounded-t-full">
                  <div className="relative h-[420px] overflow-hidden rounded-t-[168px] tablet:h-[540px] tablet:rounded-t-[214px] desktop:h-[660px] desktop:rounded-t-full">
                    <Image
                      src="/img/hero/2.jpg"
                      alt="Vue du restaurant Les Capucins by Lily"
                      fill
                      priority
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/36" />

                    <div className="absolute inset-x-0 bottom-0 p-6 tablet:p-8 desktop:p-10">
                      <div className="max-w-[360px] border border-white/12 bg-[#082d06]/78 p-5 backdrop-blur-md tablet:p-6">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d4bf96] tablet:text-[12px]">
                          Les Capucins by Lily
                        </p>
                        <p className="yeseva-one-regular mt-3 text-[28px] leading-[1.02] text-white tablet:text-[36px] desktop:text-[38px]">
                          Le bon endroit, même après une erreur de parcours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[120px]">
            <div className="mx-auto max-w-[1600px]">
              <div className="mx-auto max-w-[760px] text-center">
                <p className="text-[12px] uppercase tracking-[0.32em] text-[#b48a45] tablet:text-[14px] tablet:tracking-[0.38em]">
                  Navigation rapide
                </p>

                <h2 className="yeseva-one-regular mt-5 text-[34px] uppercase leading-[1.04] tracking-[-0.04em] tablet:text-[44px] desktop:text-[54px]">
                  Peut-être cherchiez-vous plutôt...
                </h2>
              </div>

              <div className="mt-12 grid gap-5 tablet:mt-14 min-[900px]:grid-cols-3">
                {quickLinks.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex h-full flex-col border border-[#cdb78c]/55 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#b48a45] tablet:p-8"
                  >
                    <span className="text-[12px] uppercase tracking-[0.28em] text-[#b48a45]">
                      0{index + 1}
                    </span>

                    <h3 className="yeseva-one-regular mt-10 text-[28px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[32px]">
                      {item.label}
                    </h3>

                    <p className="mt-5 flex-1 text-[16px] font-light leading-[1.75] text-black/62 tablet:text-[17px]">
                      {item.description}
                    </p>

                    <span className="mt-10 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.24em] text-[#111111] transition group-hover:text-[#b48a45] tablet:text-[13px] tablet:tracking-[0.28em]">
                      Explorer
                      <ArrowRight size={16} strokeWidth={1.7} />
                    </span>
                  </Link>
                ))}
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

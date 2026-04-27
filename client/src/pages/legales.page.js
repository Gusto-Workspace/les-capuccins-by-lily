import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

export default function LegalesPage() {
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);
  const title = "Mentions légales - Les Capucins by Lily";
  const description =
    "Consultez les mentions légales du site Les Capucins by Lily.";

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

  return (
    <>
      <SeoHeadComponent
        title={title}
        description={description}
        path="/legales"
        image="/img/reservations/2.jpg"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Mentions légales", path: "/legales" },
        ]}
      />

      <div className="relative">
        <NavComponent
          isVisible={!showScrolledNav}
          scrolled={false}
          logoSrc="/img/logo.png"
        />

        <NavComponent
          isVisible={showScrolledNav}
          scrolled={true}
          logoSrc="/img/logo.png"
        />

        <div ref={heroRef}>
          <BannerComponent
            title="Mentions légales"
            imgUrl="reservations/2.jpg"
            opacity={true}
          />
        </div>

        <section className="w-full bg-[#eeebe6] px-5 py-20 text-[#111111] tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
          <div className="mx-auto max-w-[1600px]">
            <div className="mx-auto max-w-[980px] text-center">
              <p className="mb-4 text-[12px] font-light uppercase tracking-[0.28em] text-[#b48a45] tablet:mb-5 tablet:text-[14px] tablet:tracking-[0.42em] desktop:text-[16px]">
                Informations
              </p>

              <h1 className="yeseva-one-regular text-[28px] uppercase leading-[1.08] tracking-[-0.04em] tablet:text-[40px] desktop:text-[54px]">
                Mentions légales
              </h1>

              <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-light leading-[1.8] text-black/60 tablet:mt-6 tablet:text-[17px] tablet:leading-[1.85] desktop:text-[18px]">
                Ces mentions légales présentent les principales informations
                d’identification de l’établissement et les règles générales
                applicables à l’utilisation du site.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-[980px] border border-[#b48a45]/20 bg-white/60 p-6 tablet:mt-14 tablet:p-8 desktop:mt-16 desktop:p-12">
              <div className="space-y-0">
                <section className="border-b border-[#111111]/10 py-6 first:pt-0 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Éditeur du site
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Le présent site vitrine concerne le restaurant{" "}
                      <strong>Les Capucins by Lily</strong>.
                    </p>
                    <p>
                      Les informations juridiques complètes de l’exploitant
                      (raison sociale, SIRET, RCS, TVA, adresse et téléphone)
                      doivent être confirmées et intégrées par l’établissement
                      avant mise en production définitive.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Direction de la publication
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      La direction de la publication est assurée par{" "}
                      <strong>Sophie SOULIE</strong>, en qualité de
                      représentante de la société exploitante, sauf désignation
                      interne différente en cours de publication.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Hébergement
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Le site est hébergé par <strong>Vercel Inc.</strong>
                    </p>
                    <ul className="ml-5 list-disc space-y-2">
                      <li>Adresse : 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis</li>
                      <li>
                        Site web :{" "}
                        <Link
                          href="https://vercel.com"
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-[#b48a45]/70 underline-offset-4 transition hover:text-[#111111]"
                        >
                          vercel.com
                        </Link>
                      </li>
                    </ul>
                    <p>
                      L’hébergement couvre l’infrastructure de déploiement et
                      de diffusion du site.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Objet du site
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Le site a pour objet de présenter le restaurant À
                      l&apos;Assiette, ses actualités, sa carte, ses
                      informations pratiques, ainsi que ses services de contact
                      et de réservation en ligne.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Propriété intellectuelle
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      L’ensemble des éléments présents sur ce site, notamment
                      les textes, photographies, vidéos, graphismes, logos,
                      éléments de marque, structure, arborescence et code
                      source, est protégé par les dispositions applicables du
                      droit de la propriété intellectuelle.
                    </p>
                    <p>
                      Toute reproduction, représentation, adaptation,
                      traduction, diffusion ou exploitation, totale ou
                      partielle, sans autorisation préalable écrite, est
                      interdite, sauf usage strictement autorisé par la loi.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Responsabilité
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Malgré le soin apporté à la mise à jour des informations,
                      le site peut contenir des imprécisions, omissions ou
                      contenus devenus obsolètes. L’éditeur ne garantit pas
                      l’absence totale d’erreur ni la disponibilité permanente
                      du site.
                    </p>
                    <p>
                      L’utilisateur demeure responsable de l’usage qu’il fait
                      des informations publiées. Les liens renvoyant vers des
                      services ou sites tiers restent soumis à leurs propres
                      conditions d’utilisation et politiques de confidentialité.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Données personnelles
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Les modalités de collecte et de traitement des données
                      personnelles mises en œuvre via le site sont décrites dans
                      la{" "}
                      <Link
                        href="/policy"
                        className="text-[#b48a45] underline underline-offset-4"
                      >
                        politique de confidentialité
                      </Link>
                      .
                    </p>
                  </div>
                </section>

                <section className="py-6 last:pb-0 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Droit applicable
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Les présentes mentions légales sont régies par le droit
                      français. Sous réserve des règles impératives applicables,
                      tout litige relatif au site relève des juridictions
                      territorialement compétentes du ressort du siège social de
                      l’exploitant.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <FooterComponent />
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

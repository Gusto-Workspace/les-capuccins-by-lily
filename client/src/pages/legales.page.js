import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import SectionHeadingComponent from "@/components/_shared/section-heading.component";
import RevealOnScrollComponent from "@/components/_shared/motion/reveal-on-scroll.component";
import GraphicElementComponent from "@/components/_shared/graphic-element.component";
import { buildStaticPageProps } from "@/_assets/utils/page-props.utils";

function LegalSection({ title, children, last = false }) {
  return (
    <section
      className={`py-6 tablet:py-7 desktop:py-8 ${
        last ? "" : "border-b border-[var(--site-line)]"
      }`}
    >
      <h2 className="yeseva-one-regular text-[24px] leading-[1.04] text-[var(--site-ink)] tablet:text-[30px]">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-[1.85] text-[var(--site-ink-soft)] tablet:text-[16px] desktop:text-[17px]">
        {children}
      </div>
    </section>
  );
}

export default function LegalesPage({ seoRestaurantData = null }) {
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
      { threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1] },
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
        image="/img/hero/header.jpg"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Mentions légales", path: "/legales" },
        ]}
        restaurantData={seoRestaurantData}
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
            eyebrow="Informations"
            title="Mentions légales"
            description="Les informations d’identification du site, de son hébergement et du cadre général d’utilisation sont regroupées ici."
            imgUrl="hero/header.jpg"
          />
        </div>

        <section className="relative overflow-hidden bg-[var(--site-cream)] px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
          <GraphicElementComponent
            src="/img/elements/2.webp"
            className="left-[-42px] top-[140px] hidden h-[170px] w-[170px] opacity-30 desktop:block"
            sizes="170px"
            disableMotion
          />
          <GraphicElementComponent
            src="/img/elements/4.webp"
            className="bottom-[120px] right-[-38px] hidden h-[160px] w-[160px] opacity-30 desktop:block"
            sizes="160px"
            disableMotion
          />

          <div className="relative z-10 mx-auto max-w-[1400px]">
            <SectionHeadingComponent
              eyebrow="Cadre légal"
              title="Mentions légales"
              description="Cette page présente les principales informations administratives, techniques et juridiques liées au site."
            />

            <RevealOnScrollComponent
              delay={120}
              variant="soft"
              className="site-card mx-auto mt-14 max-w-[980px] rounded-[34px] p-6 tablet:p-8 desktop:p-12"
            >
              <div className="mt-8">
                <LegalSection title="Éditeur du site">
                  <p>
                    Le présent site internet est édité pour le restaurant{" "}
                    <strong className="text-[var(--site-ink)]">
                      Les Capucins by Lily
                    </strong>
                    .
                  </p>
                  <p>
                    Les éléments d’identification complets de l’exploitant
                    tels que la raison sociale, le SIRET, le RCS, le numéro de
                    TVA, l’adresse juridique et les coordonnées administratives
                    doivent être validés et complétés par l’établissement.
                  </p>
                </LegalSection>

                <LegalSection title="Direction de la publication">
                  <p>
                    La direction de la publication est assurée par la personne
                    ou la société en charge de l’exploitation du restaurant,
                    sous réserve d’une désignation interne différente au moment
                    de la publication définitive.
                  </p>
                </LegalSection>

                <LegalSection title="Hébergement">
                  <p>
                    Le site est hébergé par{" "}
                    <strong className="text-[var(--site-ink)]">
                      Vercel Inc.
                    </strong>
                    .
                  </p>
                  <ul className="ml-5 list-disc space-y-2">
                    <li>
                      Adresse : 440 N Barranca Avenue #4133, Covina, CA 91723,
                      États-Unis
                    </li>
                    <li>
                      Site web :{" "}
                      <Link
                        href="https://vercel.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--site-orange-deep)] underline underline-offset-4 transition hover:text-[var(--site-ink)]"
                      >
                        vercel.com
                      </Link>
                    </li>
                  </ul>
                </LegalSection>

                <LegalSection title="Objet du site">
                  <p>
                    Le site a pour objet de présenter le restaurant Les
                    Capucins by Lily, sa carte, ses menus, ses informations
                    pratiques, ses actualités lorsqu’elles sont publiées, son
                    service de réservation ainsi que sa page de contact.
                  </p>
                </LegalSection>

                <LegalSection title="Propriété intellectuelle">
                  <p>
                    L’ensemble des contenus présents sur le site, notamment les
                    textes, photographies, graphismes, logos, éléments
                    d’identité visuelle, structure des pages et développements,
                    est protégé par les règles applicables en matière de
                    propriété intellectuelle.
                  </p>
                  <p>
                    Toute reproduction, adaptation, diffusion ou exploitation,
                    totale ou partielle, sans autorisation préalable écrite,
                    est interdite sauf disposition légale impérative contraire.
                  </p>
                </LegalSection>

                <LegalSection title="Responsabilité">
                  <p>
                    Malgré le soin apporté à la mise à jour des contenus,
                    certaines informations peuvent évoluer, devenir inexactes
                    ou nécessiter une validation complémentaire. L’utilisateur
                    reste responsable de l’usage qu’il fait des informations
                    consultées sur le site.
                  </p>
                  <p>
                    L’éditeur ne peut être tenu responsable des indisponibilités
                    temporaires du service, d’un dysfonctionnement technique ou
                    du contenu des sites tiers accessibles via des liens
                    externes.
                  </p>
                </LegalSection>

                <LegalSection title="Données personnelles">
                  <p>
                    Les modalités de collecte, d’utilisation et de conservation
                    des données personnelles éventuellement traitées via le site
                    sont décrites dans la{" "}
                    <Link
                      href="/policy"
                      className="text-[var(--site-orange-deep)] underline underline-offset-4 transition hover:text-[var(--site-ink)]"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </p>
                </LegalSection>

                <LegalSection title="Droit applicable" last>
                  <p>
                    Les présentes mentions légales sont soumises au droit
                    français. Sous réserve des règles d’ordre public
                    applicables, tout litige relatif au site relève des
                    juridictions territorialement compétentes du ressort de
                    l’exploitant.
                  </p>
                </LegalSection>
              </div>
            </RevealOnScrollComponent>
          </div>
        </section>

        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return buildStaticPageProps(locale, ["common"]);
}

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

export default function PolicyPage() {
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);
  const title = "Politique de confidentialité - Les Capucins by Lily";
  const description =
    "Consultez la politique de confidentialité du site Les Capucins by Lily.";

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
        path="/policy"
        image="/img/reservations/2.jpg"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Politique de confidentialité", path: "/policy" },
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
            title="Politique de confidentialité"
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
                Politique de confidentialité
              </h1>

              <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-light leading-[1.8] text-black/60 tablet:mt-6 tablet:text-[17px] tablet:leading-[1.85] desktop:text-[18px]">
                Cette politique explique quelles données peuvent être traitées
                via le site, pour quelles finalités, et quels droits vous pouvez
                exercer sur ces informations.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-[980px] border border-[#b48a45]/20 bg-white/60 p-6 tablet:mt-14 tablet:p-8 desktop:mt-16 desktop:p-12">
              <div className="rounded-[18px] border border-[#b48a45]/20 bg-[#f8f5ef] px-5 py-4 text-[14px] font-light leading-[1.75] text-black/65 tablet:text-[15px]">
                Cette page a été rédigée pour correspondre aux fonctionnalités
                actuellement visibles dans le code du site : formulaire de
                contact, réservation en ligne, mesure technique de session de
                visite et parcours d’empreinte bancaire via prestataire sécurisé
                lorsque cette fonctionnalité est activée.
              </div>

              <div className="mt-8 space-y-0">
                <section className="border-b border-[#111111]/10 py-6 first:pt-0 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Responsable du traitement
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Le responsable du traitement des données personnelles
                      collectées via le site correspond à l’exploitant du
                      restaurant <strong>Les Capucins by Lily</strong>.
                    </p>
                    <p>
                      Pour toute demande relative à vos données, vous pouvez
                      utiliser la{" "}
                      <Link
                        href="/contact"
                        className="text-[#b48a45] underline underline-offset-4"
                      >
                        page de contact
                      </Link>{" "}
                      du site. Les coordonnées juridiques précises du
                      responsable de traitement doivent être validées et
                      complétées avant mise en production définitive.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Données susceptibles d’être collectées
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <ul className="ml-5 list-disc space-y-2">
                      <li>
                        Formulaire de contact : nom complet, adresse e-mail,
                        téléphone, sujet, contenu du message.
                      </li>
                      <li>
                        Réservation : date, horaire, nombre de convives, prénom,
                        nom, e-mail, téléphone et commentaire éventuel.
                      </li>
                      <li>
                        Suivi technique de réservation : identifiants
                        temporaires liés à une réservation en attente
                        d’empreinte bancaire ou de finalisation.
                      </li>
                      <li>
                        Navigation technique : informations strictement
                        nécessaires au fonctionnement du site, notamment
                        certains stockages locaux du navigateur.
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Finalités du traitement
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <ul className="ml-5 list-disc space-y-2">
                      <li>
                        Répondre aux demandes envoyées via le formulaire de
                        contact.
                      </li>
                      <li>
                        Gérer, confirmer et suivre les réservations effectuées
                        sur le site.
                      </li>
                      <li>
                        Sécuriser certaines réservations au moyen d’une
                        empreinte ou d’un parcours de paiement via Stripe
                        lorsque cette option est activée.
                      </li>
                      <li>
                        Assurer le bon fonctionnement technique du site et
                        limiter certains doublons de session de visite.
                      </li>
                      <li>
                        Conserver les éléments nécessaires à la gestion des
                        échanges, à la preuve et au traitement d’éventuels
                        litiges.
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Bases juridiques
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Les traitements sont réalisés selon les cas sur la base de
                      l’exécution de mesures précontractuelles ou contractuelles
                      demandées par l’utilisateur, du respect d’obligations
                      légales et de l’intérêt légitime de l’exploitant à
                      administrer son activité, sécuriser les réservations et
                      assurer le fonctionnement du site.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Destinataires des données
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Les données sont destinées aux personnes habilitées au
                      sein du restaurant ainsi qu’aux prestataires techniques
                      strictement nécessaires au service.
                    </p>
                    <ul className="ml-5 list-disc space-y-2">
                      <li>
                        Prestataire d’e-mail transactionnel Brevo pour
                        l’acheminement des messages envoyés via le formulaire de
                        contact.
                      </li>
                      <li>
                        Prestataire de paiement Stripe lorsqu’une réservation
                        nécessite une empreinte bancaire ou une action de
                        sécurisation.
                      </li>
                      <li>
                        Prestataires techniques intervenant pour l’hébergement,
                        la maintenance, l’infrastructure API, la base de données
                        et la sécurité du site.
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Durée de conservation
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Les données sont conservées pendant la durée nécessaire à
                      la finalité pour laquelle elles ont été collectées, puis
                      archivées pendant la durée utile au respect des
                      obligations légales et à la gestion d’éventuels
                      contentieux.
                    </p>
                    <ul className="ml-5 list-disc space-y-2">
                      <li>
                        Les messages de contact sont conservés le temps
                        nécessaire au traitement de la demande et au suivi de la
                        relation.
                      </li>
                      <li>
                        Les données de réservation sont conservées pour la
                        gestion opérationnelle du service puis archivées si
                        nécessaire à des fins administratives, comptables ou
                        probatoires.
                      </li>
                      <li>
                        Le stockage local `lastVisitSession` a une durée de
                        session courte d’environ cinq minutes.
                      </li>
                      <li>
                        Le stockage local lié à une réservation en attente est
                        supprimé lorsqu’elle est annulée, expirée ou finalisée.
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Cookies, localStorage et traceurs techniques
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Le site n’intègre pas, à notre connaissance, de dispositif
                      de suivi publicitaire ou de ciblage marketing tiers dans
                      sa version actuelle.
                    </p>
                    <p>
                      En revanche, des stockages techniques du navigateur
                      peuvent être utilisés pour le bon fonctionnement du
                      service, notamment pour le suivi d’une session de visite
                      et la reprise d’une réservation en attente. Lors d’un
                      parcours sécurisé de réservation, Stripe peut également
                      utiliser ses propres traceurs techniques indispensables à
                      la sécurisation du paiement ou de l’empreinte bancaire.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Transferts hors Union européenne
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Certains prestataires techniques peuvent traiter tout ou
                      partie des données en dehors de l’Union européenne. Dans
                      cette hypothèse, les transferts doivent être encadrés par
                      les garanties juridiques appropriées prévues par la
                      réglementation applicable.
                    </p>
                  </div>
                </section>

                <section className="border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Vos droits
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Conformément à la réglementation applicable, vous pouvez
                      demander l’accès à vos données, leur rectification, leur
                      effacement, la limitation de certains traitements, vous
                      opposer à un traitement lorsque cela est possible et
                      demander la portabilité des données concernées lorsque les
                      conditions légales sont réunies.
                    </p>
                    <p>
                      Vous pouvez exercer vos droits via la{" "}
                      <Link
                        href="/contact"
                        className="text-[#b48a45] underline underline-offset-4"
                      >
                        page contact
                      </Link>{" "}
                      ou par courrier adressé au siège social. Vous disposez
                      également du droit d’introduire une réclamation auprès de
                      la CNIL.
                    </p>
                  </div>
                </section>

                <section className="py-6 last:pb-0 tablet:py-7 desktop:py-8">
                  <h2 className="yeseva-one-regular text-[22px] uppercase leading-[1.08] tracking-[-0.03em] text-[#111111] tablet:text-[26px] desktop:text-[30px]">
                    Mise à jour de la politique
                  </h2>
                  <div className="mt-4 space-y-3 text-[15px] font-light leading-[1.8] text-black/70 tablet:text-[16px] desktop:text-[17px]">
                    <p>
                      Cette politique peut être modifiée afin de refléter une
                      évolution technique, organisationnelle ou réglementaire.
                      La version publiée sur cette page est celle applicable à
                      la date de sa consultation.
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

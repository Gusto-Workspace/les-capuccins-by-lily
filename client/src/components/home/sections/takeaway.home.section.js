import Link from "next/link";
import HomeActionLink from "../home-action-link.component";
import HomeSectionHeading from "../home-section-heading.component";
import GraphicElementComponent from "../../_shared/graphic-element.component";
import RevealOnScrollComponent from "../../_shared/motion/reveal-on-scroll.component";
import StickerPhotoComponent from "../../_shared/sticker-photo.component";

export default function TakeawayHomeSection() {
  return (
    <section
      id="emporter"
      className="relative overflow-visible bg-[var(--site-cream)] px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[120px]"
    >
      <div className="relative mx-auto max-w-[1400px]">
        <GraphicElementComponent
          src="/img/elements/7.webp"
          className="right-[-108px] top-[74px] hidden h-[350px] w-[350px] rotate-[8deg] opacity-42 desktop:block"
          sizes="250px"
          disableMotion
        />
        <StickerPhotoComponent
          src="/img/photos/2.webp"
          alt="Plat de la maison"
          className="bottom-[-92px] left-[80px] h-[190px] w-[245px] rotate-[-5deg]"
          imageSizes="245px"
          revealDelay={120}
          disableMotion
        />
        <div className="relative z-10">
          <HomeSectionHeading
            eyebrow="À emporter"
            title="Vente à emporter"
            titleClassName="uppercase tracking-[-0.02em]"
          />

          <div className="site-card mx-auto mt-12 grid max-w-[1180px] gap-8 rounded-[34px] px-6 py-8 tablet:px-8 tablet:py-10 desktop:grid-cols-[1fr_0.88fr] desktop:items-center desktop:px-12">
            <RevealOnScrollComponent variant="left">
              <p className="text-[18px] leading-[1.95] text-[var(--site-ink-soft)]">
                Retrouvez vos incontournables de la maison en version à
                emporter. Pizzas, recettes italiennes et suggestions du moment:
                l&apos;essentiel de notre cuisine reste disponible même quand
                vous choisissez de déguster chez vous.
              </p>

              <p className="mt-5 text-[17px] leading-[1.9] text-[var(--site-ink-soft)]">
                Passez votre commande, venez la récupérer au restaurant, puis
                profitez d&apos;une cuisine généreuse où vous voulez.
              </p>
            </RevealOnScrollComponent>

            <RevealOnScrollComponent
              delay={120}
              variant="right"
              className="rounded-[30px] border border-[var(--site-line)] bg-[rgba(223,160,132,0.12)] px-6 py-7 text-center"
            >
              <p className="script-font text-[40px] leading-none text-[var(--site-orange-deep)]">
                À emporter
              </p>
              <h3 className="yeseva-one-regular mt-2 text-[42px] leading-[0.92] text-[var(--site-ink)]">
                Commandez facilement
              </h3>
              <p className="mx-auto mt-5 max-w-[360px] text-[16px] leading-[1.85] text-[var(--site-ink-soft)]">
                Nous préparons votre commande avec le même soin que pour le
                service à table.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <HomeActionLink href="/contact">Nous contacter</HomeActionLink>
                <Link href="/menus" className="site-button site-button--outline">
                  Voir la carte
                </Link>
              </div>
            </RevealOnScrollComponent>
          </div>
        </div>
      </div>
    </section>
  );
}

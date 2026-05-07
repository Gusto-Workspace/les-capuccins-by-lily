import Image from "next/image";
import RevealOnScrollComponent from "../../_shared/motion/reveal-on-scroll.component";
import WaveDividerComponent from "../../_shared/wave-divider.component";
import HomeActionLink from "../home-action-link.component";

export default function HeroHomeSection({
  heroRef = null,
  brandMain,
  brandAccent,
}) {
  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-28 pt-32 text-[var(--site-cream)] tablet:px-8 tablet:pb-32 tablet:pt-36 desktop:px-[90px]"
    >
      <div className="absolute inset-[-4%]">
        <Image
          src="/img/hero/header.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="site-ken-burns object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[rgba(55,26,16,0.56)]" />

      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-center">
        <div className="max-w-[860px] text-center">
          <RevealOnScrollComponent
            as="p"
            variant="up"
            className="script-font text-[50px] leading-none text-[var(--site-orange)] tablet:text-[66px] desktop:text-[78px]"
          >
            Bienvenue chez
          </RevealOnScrollComponent>

          <RevealOnScrollComponent
            as="h1"
            delay={90}
            variant="up"
            className="yeseva-one-regular mt-3 text-balance text-[64px] leading-[0.9] text-[var(--site-cream)] tablet:text-[98px] desktop:text-[128px]"
          >
            <span className="mx-auto flex w-fit max-w-full flex-col items-stretch">
              <span>{brandMain}</span>
              <span className="script-font -mt-1 pr-1 text-right text-[36px] font-normal leading-none text-[var(--site-orange)] tablet:-mt-2 tablet:text-[52px] desktop:text-[62px]">
                {brandAccent}
              </span>
            </span>
          </RevealOnScrollComponent>

          <RevealOnScrollComponent
            as="p"
            delay={180}
            variant="soft"
            className="mt-6 max-w-[640px] text-[18px] leading-[1.9] text-[var(--site-cream-soft)] tablet:text-[20px]"
          >
            Restaurant italien et pizzeria à Turenne, nous proposons une
            cuisine maison, des produits frais et une ambiance conviviale au
            coeur du village.
          </RevealOnScrollComponent>

          <RevealOnScrollComponent
            delay={260}
            variant="soft"
            className="mt-8 flex flex-col gap-4 tablet:flex-row tablet:justify-center"
          >
            <HomeActionLink href="/reservations">
              Réserver une table
            </HomeActionLink>
            <HomeActionLink href="#emporter" secondary>
              Commander à emporter
            </HomeActionLink>
          </RevealOnScrollComponent>
        </div>
      </div>

      <WaveDividerComponent
        fill="var(--site-cream)"
        detail="rgba(223,160,132,0.92)"
        secondaryDetail="rgba(255,255,255,0.66)"
        height={104}
        position="bottom"
        flipY
        scaleY={0.96}
        overlap={12}
      />
    </section>
  );
}

import WaveDividerComponent from "../../_shared/wave-divider.component";
import HomeActionLink from "../home-action-link.component";

export default function HeroHomeSection({ heroRef = null, brandMain }) {
  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-28 pt-32 text-[var(--site-cream)] tablet:px-8 tablet:pb-32 tablet:pt-36 desktop:px-[90px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/hero/header.jpg')" }}
      />
      <div className="absolute inset-0 bg-[rgba(55,26,16,0.56)]" />

      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-center">
        <div className="max-w-[860px] text-center">
          <p className="script-font text-[50px] leading-none text-[var(--site-orange)] tablet:text-[66px] desktop:text-[78px]">
            Bienvenue chez
          </p>

          <h1 className="yeseva-one-regular mt-3 text-balance text-[64px] leading-[0.9] text-[var(--site-cream)] tablet:text-[98px] desktop:text-[128px]">
            {brandMain}
          </h1>

          <p className="mt-6 max-w-[640px] text-[18px] leading-[1.9] text-[var(--site-cream-soft)] tablet:text-[20px]">
            Une cuisine authentique, des produits frais et une ambiance
            conviviale au coeur de Turenne.
          </p>

          <div className="mt-8 flex flex-col gap-4 tablet:flex-row tablet:justify-center">
            <HomeActionLink href="/reservations">
              Réserver une table
            </HomeActionLink>
            <HomeActionLink href="#emporter" secondary>
              Commander à emporter
            </HomeActionLink>
          </div>
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

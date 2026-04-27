import WaveDividerComponent from "../wave-divider.component";

export default function BannerComponent({
  title,
  eyebrow = "Découvrez",
  description = "",
  imgUrl = "hero/header.jpg",
}) {
  return (
    <section className="relative isolate flex min-h-[460px] items-center overflow-hidden px-5 pb-24 pt-36 text-[var(--site-cream)] tablet:min-h-[520px] tablet:px-8 tablet:pb-28 tablet:pt-40 desktop:min-h-[620px] desktop:px-[90px] desktop:pt-44">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/img/${imgUrl}')` }}
      />
      <div className="absolute inset-0 bg-[rgba(55,26,16,0.58)]" />

      <div className="relative mx-auto flex w-full max-w-[1600px]">
        <div className="max-w-[760px]">
          <p className="script-font text-[42px] leading-none text-[var(--site-orange)] tablet:text-[54px]">
            {eyebrow}
          </p>

          <h1 className="yeseva-one-regular mt-3 text-balance text-[54px] leading-[0.9] text-[var(--site-cream)] tablet:text-[72px] desktop:text-[96px]">
            {title}
          </h1>

          {description ? (
            <p className="mt-6 max-w-[620px] text-[17px] leading-[1.9] text-[var(--site-cream-soft)] tablet:text-[19px]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <WaveDividerComponent
        fill="var(--site-cream)"
        detail="rgba(223,160,132,0.9)"
        secondaryDetail="rgba(255,255,255,0.62)"
        height={108}
        position="bottom"
        flipY
        scaleY={0.95}
        overlap={6}
      />
    </section>
  );
}

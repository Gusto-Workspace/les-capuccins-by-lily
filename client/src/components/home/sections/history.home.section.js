import Image from "next/image";
import HomeSectionHeading from "../home-section-heading.component";
import RevealOnScrollComponent from "../../_shared/motion/reveal-on-scroll.component";
import StickerPhotoComponent from "../../_shared/sticker-photo.component";

export default function HistoryHomeSection({ restaurantName }) {
  return (
    <section
      id="histoire"
      className="relative overflow-visible bg-[var(--site-cream)] px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]"
    >
      <div className="pointer-events-none absolute -left-48 top-10 hidden desktop:block">
        <div className="relative h-[620px] w-[620px] opacity-20">
          <Image
            src="/img/history/1.webp"
            alt=""
            fill
            sizes="620px"
            className="object-contain"
          />
        </div>
      </div>

      <StickerPhotoComponent
        src="/img/photos/hall.webp"
        alt="Vue de la salle"
        className="bottom-[-240px] left-[42px] h-[320px] w-[225px] rotate-[-8deg]"
        imageSizes="190px"
        revealDelay={60}
      />
      <StickerPhotoComponent
        src="/img/photos/1.webp"
        alt="Salade de la maison"
        className="bottom-[100px] right-[28px] h-[350px] w-[263px] rotate-[8deg]"
        imageSizes="263px"
        rotatePatch="7deg"
        revealDelay={140}
      />
      <div className="relative z-10 mx-auto max-w-[1120px] text-center desktop:px-[220px]">
        <HomeSectionHeading
          eyebrow="Découvrez"
          title="Notre histoire"
          titleClassName="uppercase tracking-[-0.02em]"
        />

        <RevealOnScrollComponent
          as="p"
          delay={220}
          variant="soft"
          className="mx-auto text-balance mt-8 max-w-[620px] text-[17px] leading-[1.95] text-[var(--site-ink-soft)] tablet:text-[18px]"
        >
          Les Capucins by Lily est un restaurant italien à Turenne où le
          fait-maison, la passion et la générosité guident chaque recette.
        </RevealOnScrollComponent>

        <RevealOnScrollComponent
          as="p"
          delay={300}
          variant="soft"
          className="mx-auto text-balance mt-6 max-w-[680px] text-[17px] leading-[1.95] text-[var(--site-ink-soft)] tablet:text-[18px]"
        >
          Sur place ou à emporter, nous proposons des salades, des desserts et
          des pizzas aux généreux rebords, garnies de produits frais italiens,
          pour un plaisir simple et sincère au coeur de Turenne.
        </RevealOnScrollComponent>

        <RevealOnScrollComponent
          as="p"
          delay={380}
          variant="up"
          className="script-font mt-10 text-[44px] leading-none text-[var(--site-ink)] tablet:text-[54px]"
        >
          Lily & l&apos;équipe
        </RevealOnScrollComponent>
      </div>
    </section>
  );
}

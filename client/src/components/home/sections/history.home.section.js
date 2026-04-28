import Image from "next/image";
import HomeSectionHeading from "../home-section-heading.component";
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
            src="/img/history/1.png"
            alt=""
            fill
            sizes="620px"
            className="object-contain"
          />
        </div>
      </div>

      <StickerPhotoComponent
        src="/img/photos/hall.jpeg"
        alt="Vue de la salle"
        className="bottom-[-240px] left-[42px] h-[320px] w-[225px] rotate-[-8deg]"
        imageSizes="190px"
      />
      <StickerPhotoComponent
        src="/img/photos/1.jpeg"
        alt="Salade de la maison"
        className="bottom-[100px] right-[28px] h-[350px] w-[263px] rotate-[8deg]"
        imageSizes="263px"
        rotatePatch="7deg"
      />
      <div className="relative z-10 mx-auto max-w-[1120px] text-center desktop:px-[220px]">
        <HomeSectionHeading
          eyebrow="Découvrez"
          title="Notre histoire"
          titleClassName="uppercase tracking-[-0.02em]"
        />

        <p className="mx-auto mt-8 max-w-[620px] text-[17px] leading-[1.95] text-[var(--site-ink-soft)] tablet:text-[18px]">
          Chez {restaurantName}, nous partageons notre passion pour la pizza et
          la cuisine italienne faite maison.
        </p>

        <p className="mx-auto mt-6 max-w-[680px] text-[17px] leading-[1.95] text-[var(--site-ink-soft)] tablet:text-[18px]">
          Notre équipe sélectionne des ingrédients frais et de qualité pour
          vous offrir une expérience culinaire unique dans une ambiance
          chaleureuse et accueillante.
        </p>

        <p className="script-font mt-10 text-[44px] leading-none text-[var(--site-ink)] tablet:text-[54px]">
          Lily & l&apos;équipe
        </p>
      </div>
    </section>
  );
}

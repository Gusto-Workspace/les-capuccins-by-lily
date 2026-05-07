import Image from "next/image";
import WaveDividerComponent from "../../_shared/wave-divider.component";
import BookingBarComponent from "../../reservations/booking-bar.component";
import GraphicElementComponent from "../../_shared/graphic-element.component";
import RevealOnScrollComponent from "../../_shared/motion/reveal-on-scroll.component";

export default function ReservationHomeSection({ restaurantData }) {
  return (
    <section className="relative overflow-hidden bg-[var(--site-orange)] px-5 py-32 tablet:px-8 tablet:py-36 desktop:px-[90px] desktop:py-48">
      <WaveDividerComponent
        position="top"
        fill="var(--site-cream)"
        detail="rgba(255,255,255,0.88)"
        secondaryDetail="rgba(246,229,218,0.82)"
        height={104}
        flipX
        scaleY={0.9}
        overlap={12}
      />
      <WaveDividerComponent
        position="bottom"
        fill="var(--site-cream)"
        detail="rgba(255,255,255,0.88)"
        secondaryDetail="rgba(246,229,218,0.82)"
        height={102}
        flipY
        scaleY={0.88}
        overlap={12}
      />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 desktop:grid-cols-[0.86fr_1.14fr] desktop:items-center">
        <GraphicElementComponent
          src="/img/elements/10.webp"
          className="bottom-[-220px] right-[-254px] hidden h-[400px] w-[400px] opacity-20 desktop:block"
          sizes="170px"
          disableMotion
        />
        <RevealOnScrollComponent
          variant="left"
          className="relative z-10 flex flex-col items-center text-center text-[var(--site-cream)] desktop:block desktop:text-left"
        >
          <div className="mb-6">
            <div className="relative mx-auto h-[192px] w-[192px] tablet:h-[206px] tablet:w-[206px] desktop:mx-0">
              <Image
                src="/img/reservations/booking.png"
                alt=""
                fill
                sizes="206px"
                className="object-contain"
              />
            </div>
          </div>
          <p className="script-font text-[42px] leading-none tablet:text-[52px]">
            Réservez
          </p>
          <h2 className="yeseva-one-regular mt-2 text-[56px] leading-[0.9] tablet:text-[74px]">
            Votre table
          </h2>
          <p className="mx-auto mt-6 max-w-[420px] text-[17px] leading-[1.9] text-[rgba(246,231,230,0.84)] desktop:mx-0">
            Nous avons hâte de vous accueillir pour un moment gourmand et
            convivial.
          </p>
        </RevealOnScrollComponent>

        <RevealOnScrollComponent
          delay={140}
          variant="right"
          className="relative z-10"
        >
          <BookingBarComponent restaurant={restaurantData} />
        </RevealOnScrollComponent>
      </div>
    </section>
  );
}

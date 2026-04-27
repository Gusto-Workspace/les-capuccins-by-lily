import Image from "next/image";
import WaveDividerComponent from "../../_shared/wave-divider.component";
import HomeSectionHeading from "../home-section-heading.component";

const specialties = [
  {
    title: "Pizzas artisanales",
    icon: "/img/specialities/pizza.png",
    description:
      "Pâte maison fermentée, garnitures généreuses et cuisson soignée pour préserver texture et gourmandise.",
  },
  {
    title: "Produits frais",
    icon: "/img/specialities/cheese.png",
    description:
      "Nous sélectionnons chaque jour des ingrédients de qualité auprès de producteurs et partenaires choisis avec soin.",
  },
  {
    title: "Saveurs italiennes",
    icon: "/img/specialities/olive.png",
    description:
      "Des recettes authentiques inspirées des traditions italiennes, pensées pour le plaisir de la table.",
  },
  {
    title: "Fait maison",
    icon: "/img/specialities/leef.png",
    description:
      "Tout est préparé sur place avec exigence, générosité et l’envie de vous offrir le meilleur.",
  },
];

export default function SpecialtiesHomeSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--site-orange)] px-5 pb-40 pt-44 text-[var(--site-cream)] tablet:px-8 tablet:pb-44 tablet:pt-48 desktop:px-[90px] desktop:pb-52 desktop:pt-56">
      <WaveDividerComponent
        position="top"
        fill="var(--site-cream)"
        detail="rgba(255,255,255,0.88)"
        secondaryDetail="rgba(246,229,218,0.82)"
        height={108}
        flipX
        scaleY={0.9}
        overlap={12}
      />
      <WaveDividerComponent
        position="bottom"
        fill="var(--site-cream)"
        detail="rgba(255,255,255,0.88)"
        secondaryDetail="rgba(246,229,218,0.82)"
        height={106}
        flipX
        flipY
        scaleY={0.92}
        overlap={12}
      />

      <div className="relative mx-auto max-w-[1400px]">
        <HomeSectionHeading title="Nos spécialités" light titleClassName="uppercase" />

        <div className="mt-16 grid gap-8 desktop:grid-cols-4 desktop:gap-0">
          {specialties.map((item, index) => (
            <article
              key={item.title}
              className={`px-2 text-center desktop:px-8 ${
                index < specialties.length - 1
                  ? "desktop:border-r desktop:border-[rgba(246,231,230,0.32)]"
                  : ""
              }`}
            >
              <div className="mb-6 flex justify-center">
                <div className="relative h-[86px] w-[86px] tablet:h-[94px] tablet:w-[94px]">
                  <Image
                    src={item.icon}
                    alt=""
                    fill
                    sizes="94px"
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="yeseva-one-regular text-[31px] uppercase leading-[0.96] text-[var(--site-cream)]">
                {item.title}
              </h3>
              <p className="mx-auto mt-5 max-w-[250px] text-[16px] leading-[1.85] text-[rgba(246,231,230,0.88)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

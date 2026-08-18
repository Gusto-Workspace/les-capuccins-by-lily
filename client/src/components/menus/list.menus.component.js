import Link from "next/link";
import OtherMenusComponent from "./other-menus.menus.component";
import SectionHeadingComponent from "../_shared/section-heading.component";
import GraphicElementComponent from "../_shared/graphic-element.component";
import RevealOnScrollComponent from "../_shared/motion/reveal-on-scroll.component";
import StickerPhotoComponent from "../_shared/sticker-photo.component";
import { getVisibleDishCategories } from "../../_assets/utils/site-display.utils";

function getCategoryHeading(title) {
  const normalizedTitle = String(title || "").trim();

  if (!normalizedTitle) {
    return "Nos suggestions";
  }

  if (/^nos\s/i.test(normalizedTitle)) {
    return normalizedTitle;
  }

  return `Nos ${normalizedTitle.toLowerCase()}`;
}

function MenuEntry({ name, price, description }) {
  return (
    <div className="pb-4 last:pb-0 tablet:pb-5">
      <div className="flex items-start gap-4">
        <h4 className="min-w-0 text-[21px] font-bold leading-[1.08] tracking-[-0.02em] text-black tablet:text-[24px]">
          {name}
        </h4>

        {price ? (
          <>
            <div className="mt-[15px] min-w-0 flex-1 border-b border-dotted border-[rgba(223,160,132,0.78)]" />
            <span className="shrink-0 pt-1 text-[18px] font-bold leading-none text-black tablet:text-[20px]">
              {price}
            </span>
          </>
        ) : null}
      </div>

      {description ? (
        <p className="mt-1.5 max-w-[94%] text-[16px] leading-[1.28] tracking-[0.01em] text-[rgba(122,95,84,0.9)] tablet:text-[18px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function ListMenusComponent({ restaurantData }) {
  const categories = getVisibleDishCategories(restaurantData);

  return (
    <section className="site-shell overflow-x-hidden relative overflow-visible px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
      <div className="relative mx-auto max-w-[1380px]">
        <GraphicElementComponent
          src="/img/elements/4.webp"
          className="left-[-56px] top-[35%] hidden h-[260px] w-[156px] opacity-52 desktop:block"
          sizes="156px"
        />
        <GraphicElementComponent
          src="/img/elements/2.webp"
          className="right-[-88px] top-[20px] hidden h-[230px] w-[230px] opacity-44 desktop:block"
          sizes="230px"
        />
        <StickerPhotoComponent
          src="/img/photos/hall.webp"
          alt="Entrée du restaurant"
          className="left-[-112px] top-[206px] h-[250px] w-[178px] rotate-[-7deg]"
          imageSizes="178px"
        />
        <StickerPhotoComponent
          src="/img/photos/2.webp"
          alt="Plat dressé"
          className="right-[-114px] top-[25%] h-[176px] w-[228px] rotate-[7deg]"
          imageSizes="228px"
          rotatePatch="8deg"
        />

        <div className="relative z-30">
          <SectionHeadingComponent
            eyebrow="La carte"
            title="Nos plats à la carte"
            description="Les plats, pizzas et recettes de la maison sont présentés ici à part. Les formules et menus sont regroupés plus bas dans une section dédiée."
          />

          {categories.length ? (
            <div className="mx-auto mt-14 max-w-[980px]">
              <div className="space-y-12 tablet:space-y-16">
                {categories.map((category, index) => (
                  <RevealOnScrollComponent
                    as="article"
                    key={category.id}
                    variant="up"
                    delay={index * 80}
                    className="pb-2 last:pb-0"
                  >
                    <div className="mx-auto max-w-[860px] text-center">
                      <p className="script-font text-[50px] font-semibold leading-none text-[var(--site-orange)] tablet:text-[62px]">
                        {getCategoryHeading(category.title)}
                      </p>

                      {category.description ? (
                        <p className="mx-auto mt-3 max-w-[720px] text-[16px] leading-[1.65] text-[rgba(122,95,84,0.88)] tablet:text-[17px]">
                          {category.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-7 space-y-5 tablet:space-y-6">
                      {category.items.map((item) => (
                        <MenuEntry
                          key={item.id}
                          name={item.name}
                          price={item.price}
                          description={item.description}
                        />
                      ))}

                      {category.subCategories.map((subCategory) => (
                        <div key={subCategory.id} className="pt-5">
                          <h3 className="script-font mb-5 text-[34px] font-semibold leading-none text-[var(--site-orange)] tablet:text-[40px]">
                            {subCategory.title}
                          </h3>
                          <div className="space-y-5 tablet:space-y-6">
                            {subCategory.items.map((item) => (
                              <MenuEntry
                                key={item.id}
                                name={item.name}
                                price={item.price}
                                description={item.description}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </RevealOnScrollComponent>
                ))}
              </div>
            </div>
          ) : (
            <RevealOnScrollComponent className="mx-auto mt-14 max-w-[760px] px-8 py-12 text-center">
              <p className="script-font text-[40px] leading-none text-[var(--site-orange)]">
                Carte en préparation
              </p>
              <p className="mt-4 text-[17px] leading-[1.85] text-[var(--site-ink-soft)]">
                Les plats visibles sur le site seront ajoutés ici très bientôt.
              </p>
            </RevealOnScrollComponent>
          )}

          <OtherMenusComponent restaurantData={restaurantData} />

          <RevealOnScrollComponent
            delay={220}
            variant="soft"
            className="mt-14 flex justify-center"
          >
            <Link href="/reservations" className="site-button">
              Réserver une table
            </Link>
          </RevealOnScrollComponent>
        </div>
      </div>
    </section>
  );
}

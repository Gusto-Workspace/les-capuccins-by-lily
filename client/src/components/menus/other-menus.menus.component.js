import {
  buildMenuBlocks,
  getMenuPriceLabel,
  getMenuTitle,
  getVisibleMenus,
  isMenuBlankLine,
  isMenuSeparatorLabel,
} from "../../_assets/utils/menu-display.utils";
import { getVisibleMenuCategories } from "../../_assets/utils/site-display.utils";
import SectionHeadingComponent from "../_shared/section-heading.component";
import GraphicElementComponent from "../_shared/graphic-element.component";
import RevealOnScrollComponent from "../_shared/motion/reveal-on-scroll.component";
import StickerPhotoComponent from "../_shared/sticker-photo.component";

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function RestaurantMenuBlock({ block }) {
  const lines = Array.isArray(block?.lines) ? block.lines : [];
  const hasLines = lines.length > 0;

  return (
    <div
      className="mx-auto w-full max-w-[430px] rounded-[24px] border border-[rgba(223,160,132,0.22)] bg-white/82 px-6 py-6 text-center shadow-[0_14px_36px_rgba(127,83,66,0.08)]"
      data-print-dish
    >
      <div className="flex flex-col items-center">
        <h4 className="max-w-[90%] text-[21px] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--site-ink)] tablet:text-[23px]">
          {block.title}
        </h4>

        {block.price ? (
          <span className="mt-3 inline-flex rounded-full border border-[rgba(223,160,132,0.22)] bg-[rgba(246,229,218,0.68)] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--site-orange-deep)] tablet:text-[14px]">
            {block.price}
          </span>
        ) : null}
      </div>

      {hasLines ? (
        <div className="mt-5 space-y-2.5">
          {lines.map((line, index) => {
            if (isMenuBlankLine(line)) {
              return (
                <div
                  key={`${block.id}-blank-${index}`}
                  className="h-2"
                  aria-hidden="true"
                />
              );
            }

            if (isMenuSeparatorLabel(line)) {
              return (
                <p
                  key={`${block.id}-separator-${index}`}
                  className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]"
                >
                  {line}
                </p>
              );
            }

            return (
              <p
                key={`${block.id}-${index}`}
                className="text-center text-[15px] leading-[1.65] text-[rgba(71,42,34,0.74)] tablet:text-[16px]"
              >
                {line}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function RestaurantMenuCard({ menu, index = 0 }) {
  const menuBlocks = buildMenuBlocks(menu);
  const priceLabel = getMenuPriceLabel(menu);

  return (
    <article
      className="rounded-[38px] border border-[rgba(223,160,132,0.24)] bg-[rgba(246,229,218,0.72)] px-6 py-8 shadow-[0_18px_48px_rgba(127,83,66,0.1)] tablet:px-8 tablet:py-9"
      data-print-menu
    >
      <div className="border-b border-[rgba(223,160,132,0.2)] pb-6 text-center">
        <div className="mx-auto max-w-[720px]">
          <div data-print-title-price-row>
            <p
              className="script-font text-[52px] font-semibold leading-none text-[var(--site-orange)] tablet:text-[64px]"
              data-print-title
            >
              {getMenuTitle(menu, index + 1)}
            </p>

            {priceLabel ? (
              <span
                className="mt-5 inline-flex w-fit rounded-full border border-[rgba(223,160,132,0.24)] bg-white/82 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]"
                data-print-price
              >
                {priceLabel}
              </span>
            ) : null}
          </div>

          {menu?.description ? (
            <p className="mx-auto mt-4 max-w-[620px] text-balance text-[16px] leading-[1.75] text-[rgba(71,42,34,0.76)]">
              {menu.description}
            </p>
          ) : null}
        </div>
      </div>

      {menuBlocks.length ? (
        <div className="mt-7 grid gap-4 justify-items-center">
          {menuBlocks.map((block) => (
            <RestaurantMenuBlock key={block.id} block={block} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function CategoryMenuItem({ item }) {
  return (
    <div className="mx-auto w-full max-w-[430px] rounded-[22px] bg-white/82 px-5 py-5 text-center shadow-[0_10px_30px_rgba(127,83,66,0.06)]">
      <div className="flex flex-col items-center">
        <h4 className="max-w-[92%] text-[19px] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--site-ink)] tablet:text-[21px]">
          {item.name}
        </h4>

        {item.price ? (
          <span className="mt-3 inline-flex rounded-full border border-[rgba(223,160,132,0.22)] bg-[rgba(246,229,218,0.68)] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--site-orange-deep)] tablet:text-[14px]">
            {item.price}
          </span>
        ) : null}
      </div>

      {item.description ? (
        <p className="mt-4 text-[15px] leading-[1.65] text-[rgba(71,42,34,0.74)] tablet:text-[16px]">
          {item.description}
        </p>
      ) : null}
    </div>
  );
}

function CategoryMenuCard({ category }) {
  return (
    <article className="rounded-[38px] border border-[rgba(223,160,132,0.24)] bg-[rgba(246,229,218,0.72)] px-6 py-8 shadow-[0_18px_48px_rgba(127,83,66,0.1)] tablet:px-8 tablet:py-9">
      <div className="border-b border-[rgba(223,160,132,0.2)] pb-6 text-center">
        <h3 className="script-font text-[52px] font-semibold leading-none text-[var(--site-orange)] tablet:text-[64px]">
          {category.title}
        </h3>

        {category.description ? (
          <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-[1.75] text-[rgba(71,42,34,0.76)]">
            {category.description}
          </p>
        ) : null}
      </div>

      <div className="mt-7 grid gap-4 justify-items-center">
        {category.items.map((item) => (
          <CategoryMenuItem key={item.id} item={item} />
        ))}

        {category.subCategories.map((subCategory) => (
          <section key={subCategory.id} className="mt-5 w-full text-center">
            <h4 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.16em] text-[var(--site-orange-deep)]">
              {subCategory.title}
            </h4>
            <div className="grid gap-4 justify-items-center">
              {subCategory.items.map((item) => (
                <CategoryMenuItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

export default function OtherMenusComponent({
  restaurantData,
  printMode = false,
}) {
  const menus = getVisibleMenus(restaurantData);
  const menuCategories = getVisibleMenuCategories(restaurantData).filter(
    (category) =>
      !menus.some(
        (menu) =>
          normalizeKey(getMenuTitle(menu)) === normalizeKey(category.title),
      ),
  );
  const totalMenuCards = menuCategories.length + menus.length;

  if (!menus.length && !menuCategories.length) {
    return null;
  }

  return (
    <section
      className="relative mt-24 overflow-visible"
      data-print-menu-section={printMode ? "true" : undefined}
    >
      {!printMode ? (
        <>
          <GraphicElementComponent
            src="/img/elements/1.webp"
            className="left-[-118px] top-[64px] hidden h-[250px] w-[250px] opacity-42 desktop:block"
            sizes="250px"
          />
          <GraphicElementComponent
            src="/img/elements/8.webp"
            className="right-[-112px] bottom-[44px] hidden h-[240px] w-[240px] opacity-40 desktop:block"
            sizes="240px"
          />
          <StickerPhotoComponent
            src="/img/photos/3.webp"
            alt="Pizza colorée"
            className="right-[-10px] top-[164px] h-[208px] w-[208px] rotate-[7deg]"
            imageSizes="208px"
            rotatePatch="8deg"
            layerClassName="z-[1]"
          />
        </>
      ) : null}

      <div className="relative z-30">
        <SectionHeadingComponent
          eyebrow="Les menus"
          title="Nos menus & formules"
          description="Retrouvez ici les formules du midi, menus complets et propositions regroupées à part de la carte, avec une présentation dédiée."
          className="print-menu-heading"
        />

        <div
          className={`mt-12 grid gap-6 ${
            totalMenuCards > 1 ? "desktop:grid-cols-2" : "mx-auto max-w-[760px]"
          }`}
          data-print-menu-list
        >
          {menuCategories.map((category) => (
            <RevealOnScrollComponent key={category.id} variant="up">
              <CategoryMenuCard category={category} />
            </RevealOnScrollComponent>
          ))}

          {menus.map((menu, index) => (
            <RevealOnScrollComponent
              key={menu?._id || `menu-${index}`}
              delay={menuCategories.length * 80 + index * 90}
              variant="up"
            >
              <RestaurantMenuCard menu={menu} index={index} />
            </RevealOnScrollComponent>
          ))}
        </div>
      </div>
    </section>
  );
}

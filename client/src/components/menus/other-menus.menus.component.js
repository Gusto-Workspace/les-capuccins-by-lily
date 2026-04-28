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
import StickerPhotoComponent from "../_shared/sticker-photo.component";

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function RestaurantMenuBlock({ block }) {
  return (
    <div className="rounded-[22px] border border-[rgba(223,160,132,0.22)] bg-white/78 px-5 py-5 shadow-[0_12px_34px_rgba(127,83,66,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <h4 className="max-w-[78%] text-[19px] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--site-ink)] tablet:text-[21px]">
          {block.title}
        </h4>

        {block.price ? (
          <span className="shrink-0 pt-1 text-[16px] font-bold leading-none text-[var(--site-orange-deep)] tablet:text-[18px]">
            {block.price}
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2.5">
        {block.lines?.map((line, index) => {
          if (isMenuBlankLine(line)) {
            return <div key={`${block.id}-blank-${index}`} className="h-2" aria-hidden="true" />;
          }

          if (isMenuSeparatorLabel(line)) {
            return (
              <p
                key={`${block.id}-separator-${index}`}
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--site-orange-deep)]"
              >
                {line}
              </p>
            );
          }

          return (
            <p
              key={`${block.id}-${index}`}
              className="text-[15px] leading-[1.55] text-[rgba(71,42,34,0.74)] tablet:text-[16px]"
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function RestaurantMenuCard({ menu, index = 0 }) {
  const menuBlocks = buildMenuBlocks(menu);
  const priceLabel = getMenuPriceLabel(menu);

  if (!menuBlocks.length) {
    return null;
  }

  return (
    <article className="rounded-[34px] border border-[rgba(223,160,132,0.24)] bg-[rgba(246,229,218,0.72)] px-6 py-7 shadow-[0_18px_48px_rgba(127,83,66,0.1)] tablet:px-8 tablet:py-8">
      <div className="border-b border-[rgba(223,160,132,0.2)] pb-5 text-center">
        <div className="mx-auto max-w-[720px]">
          <p className="script-font text-[50px] font-semibold leading-none text-[var(--site-orange)] tablet:text-[62px]">
            {getMenuTitle(menu, index + 1)}
          </p>

          {menu?.description ? (
            <p className="mx-auto mt-3 max-w-[620px] text-[16px] leading-[1.65] text-[rgba(71,42,34,0.76)]">
              {menu.description}
            </p>
          ) : null}
        </div>

        {priceLabel ? (
          <span className="mt-5 inline-flex w-fit rounded-full border border-[rgba(223,160,132,0.24)] bg-white/76 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--site-orange-deep)]">
            {priceLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4">
        {menuBlocks.map((block) => (
          <RestaurantMenuBlock key={block.id} block={block} />
        ))}
      </div>
    </article>
  );
}

function CategoryMenuItem({ item }) {
  return (
    <div className="rounded-[20px] bg-white/78 px-4 py-4 shadow-[0_10px_30px_rgba(127,83,66,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <h4 className="max-w-[76%] text-[19px] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--site-ink)] tablet:text-[21px]">
          {item.name}
        </h4>

        {item.price ? (
          <span className="shrink-0 pt-1 text-[16px] font-bold leading-none text-[var(--site-orange-deep)] tablet:text-[18px]">
            {item.price}
          </span>
        ) : null}
      </div>

      {item.description ? (
        <p className="mt-2 text-[15px] leading-[1.5] text-[rgba(71,42,34,0.74)] tablet:text-[16px]">
          {item.description}
        </p>
      ) : null}
    </div>
  );
}

function CategoryMenuCard({ category }) {
  return (
    <article className="rounded-[34px] border border-[rgba(223,160,132,0.24)] bg-[rgba(246,229,218,0.72)] px-6 py-7 shadow-[0_18px_48px_rgba(127,83,66,0.1)] tablet:px-8 tablet:py-8">
      <div className="border-b border-[rgba(223,160,132,0.2)] pb-5 text-center">
        <h3 className="script-font text-[50px] font-semibold leading-none text-[var(--site-orange)] tablet:text-[62px]">
          {category.title}
        </h3>

        {category.description ? (
          <p className="mx-auto mt-3 max-w-[620px] text-[16px] leading-[1.65] text-[rgba(71,42,34,0.76)]">
            {category.description}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4">
        {category.items.map((item) => (
          <CategoryMenuItem key={item.id} item={item} />
        ))}
      </div>
    </article>
  );
}

export default function OtherMenusComponent({ restaurantData }) {
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
    <section className="relative mt-24 overflow-visible">
      <GraphicElementComponent
        src="/img/elements/1.png"
        className="left-[-118px] top-[64px] hidden h-[250px] w-[250px] opacity-42 desktop:block"
        sizes="250px"
      />
      <GraphicElementComponent
        src="/img/elements/8.png"
        className="right-[-112px] bottom-[44px] hidden h-[240px] w-[240px] opacity-40 desktop:block"
        sizes="240px"
      />
      <StickerPhotoComponent
        src="/img/photos/3.jpeg"
        alt="Pizza colorée"
        className="right-[-10px] top-[164px] h-[208px] w-[208px] rotate-[7deg]"
        imageSizes="208px"
        rotatePatch="8deg"
      />

      <div className="relative z-10">
        <SectionHeadingComponent
          eyebrow="Les menus"
          title="Nos menus & formules"
          description="Retrouvez ici les formules du midi, menus complets et propositions regroupées à part de la carte, avec une présentation dédiée."
        />

        <div
          className={`mt-12 grid gap-6 ${
            totalMenuCards > 1 ? "desktop:grid-cols-2" : "mx-auto max-w-[760px]"
          }`}
        >
          {menuCategories.map((category) => (
            <CategoryMenuCard key={category.id} category={category} />
          ))}

          {menus.map((menu, index) => (
            <RestaurantMenuCard
              key={menu?._id || `menu-${index}`}
              menu={menu}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

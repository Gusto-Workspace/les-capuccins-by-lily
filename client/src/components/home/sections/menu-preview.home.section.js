import Link from "next/link";
import HomeSectionHeading from "../home-section-heading.component";
import HomeMenuPreviewColumn from "../home-menu-preview-column.component";
import StickerPhotoComponent from "../../_shared/sticker-photo.component";

const fallbackMenuColumns = [
  {
    id: "pizzas",
    title: "Pizzas",
    items: [
      {
        id: "pizza-1",
        name: "La carte des pizzas arrive bientôt",
        description: "Les premières suggestions seront ajoutées ici.",
        price: "",
      },
    ],
  },
  {
    id: "pastas",
    title: "Pastas",
    items: [
      {
        id: "pasta-1",
        name: "Les recettes de pâtes arrivent bientôt",
        description: "Les spécialités de la maison seront ajoutées ici.",
        price: "",
      },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      {
        id: "dessert-1",
        name: "Le coin gourmand arrive bientôt",
        description: "Les douceurs de la maison seront ajoutées ici.",
        price: "",
      },
    ],
  },
];

export default function MenuPreviewHomeSection({ menuColumns = [] }) {
  const homeMenuColumns = menuColumns.length ? menuColumns : fallbackMenuColumns;

  return (
    <section className="relative overflow-visible bg-[var(--site-cream)] px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
      <div className="relative mx-auto max-w-[1400px]">
        <StickerPhotoComponent
          src="/img/photos/3.jpeg"
          alt="Pizza de la maison"
          className="right-[-12px] top-[-220px] h-[210px] w-[210px] rotate-[8deg]"
          imageSizes="210px"
          rotatePatch="9deg"
        />
        <StickerPhotoComponent
          src="/img/photos/4.jpeg"
          alt="Pizza blanche"
          className="bottom-[-214px] left-[28px] h-[220px] w-[220px] rotate-[-6deg]"
          imageSizes="220px"
        />
        <div className="relative z-10">
          <HomeSectionHeading
            eyebrow="Découvrez"
            title="Notre menu"
            titleClassName="uppercase tracking-[-0.02em]"
          />

          <div className="mt-14 grid gap-8 desktop:grid-cols-3 desktop:gap-8">
            {homeMenuColumns.map((category, index) => (
              <HomeMenuPreviewColumn
                key={category.id}
                title={category.title}
                items={category.items}
                bordered={index < homeMenuColumns.length - 1}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/menus" className="site-button">
              Voir la carte complète
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

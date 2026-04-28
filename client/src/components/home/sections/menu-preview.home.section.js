import Link from "next/link";
import HomeSectionHeading from "../home-section-heading.component";
import HomeMenuPreviewColumn from "../home-menu-preview-column.component";
import GraphicElementComponent from "../../_shared/graphic-element.component";

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
    <section className="relative overflow-hidden bg-[var(--site-cream)] px-5 py-20 tablet:px-8 tablet:py-24 desktop:px-[90px] desktop:py-[110px]">
      <div className="relative mx-auto max-w-[1400px]">
        <GraphicElementComponent
          src="/img/elements/3.png"
          className="bottom-[-126px] left-[-186px] hidden h-[350px] w-[350px] opacity-35 desktop:block"
          sizes="350px"
        />
        <GraphicElementComponent
          src="/img/elements/8.png"
          className="right-[-186px] -bottom-[124px] hidden h-[250px] w-[250px] opacity-42 desktop:block scale-x-[-1]"
          sizes="250px"
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

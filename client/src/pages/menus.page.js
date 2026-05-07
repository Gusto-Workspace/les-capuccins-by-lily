import { useContext, useEffect, useRef, useState } from "react";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import ListMenusComponent from "@/components/menus/list.menus.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import { buildStaticPageProps } from "@/_assets/utils/page-props.utils";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

export default function MenusPage({ seoRestaurantData = null }) {
  const { restaurantContext } = useContext(GlobalContext);
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrolledNav(entry.intersectionRatio <= 0.1);
      },
      {
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SeoHeadComponent
        title="Carte du restaurant à Turenne | Pizzas & cuisine italienne | Les Capucins by Lily"
        description="Consultez la carte de notre restaurant à Turenne : pizzas artisanales, cuisine italienne, suggestions maison et plats à emporter."
        path="/menus"
        image="/img/menu-inspired/header_menu.webp"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Carte & menus", path: "/menus" },
        ]}
        restaurantData={seoRestaurantData}
      />

      <div className="relative">
        <NavComponent
          isVisible={!showScrolledNav}
          scrolled={false}
          logoSrc="/img/logo.webp"
        />

        <NavComponent
          isVisible={showScrolledNav}
          scrolled={true}
          logoSrc="/img/logo.webp"
        />

        <div ref={heroRef}>
          <BannerComponent
            title="Carte & Menus"
            eyebrow="La maison"
            description="Une carte de restaurant à Turenne pensée pour le partage, les envies du moment et les classiques italiens qui font revenir."
            imgUrl="menu-inspired/header_menu.webp"
          />
        </div>

        <ListMenusComponent restaurantData={restaurantContext.restaurantData} />

        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return buildStaticPageProps(locale, ["common"]);
}

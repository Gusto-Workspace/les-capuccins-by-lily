import { useContext, useEffect, useRef, useState } from "react";

// I18N
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import ListMenusComponent from "@/components/menus/list.menus.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

export default function MenusPage() {
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
        title="Carte & Menus - Les Capucins by Lily"
        description="Découvrez la carte et les menus des Capucins by Lily : cuisine italienne, recettes maison et suggestions du moment."
        path="/menus"
        image="/img/menu-inspired/header_menu.png"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Carte & menus", path: "/menus" },
        ]}
      />

      <div className="relative">
        <NavComponent
          isVisible={!showScrolledNav}
          scrolled={false}
          logoSrc="/img/logo.png"
        />

        <NavComponent
          isVisible={showScrolledNav}
          scrolled={true}
          logoSrc="/img/logo.png"
        />

        <div ref={heroRef}>
          <BannerComponent
            title="Carte & Menus"
            eyebrow="La maison"
            description="Une carte pensée pour le partage, les envies du moment et les classiques italiens qui font revenir."
            imgUrl="menu-inspired/header_menu.png"
          />
        </div>

        <ListMenusComponent restaurantData={restaurantContext.restaurantData} />

        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "menus"])),
    },
  };
}

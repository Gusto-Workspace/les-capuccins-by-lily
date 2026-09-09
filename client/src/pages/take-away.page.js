import { useEffect, useRef, useState } from "react";
import BannerComponent from "@/components/_shared/banner/banner.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import NavComponent from "@/components/_shared/nav/nav.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import TakeAwayComponent from "@/components/take-away/take-away.component";
import { buildStaticPageProps } from "@/_assets/utils/page-props.utils";

export default function TakeAwayPage({ seoRestaurantData = null }) {
  const heroRef = useRef(null);
  const [showScrolledNav, setShowScrolledNav] = useState(false);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowScrolledNav(entry.intersectionRatio <= 0.1),
      { threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SeoHeadComponent
        title="Vente à emporter à Turenne | Les Capucins by Lily"
        description="Commandez les plats des Capucins by Lily à emporter ou en livraison : carte, créneaux et paiement en ligne sécurisé."
        path="/take-away"
        image="/img/hero/header.webp"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Vente à emporter", path: "/take-away" },
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
          scrolled
          logoSrc="/img/logo.webp"
        />

        <div ref={heroRef}>
          <BannerComponent
            title="Vente à emporter"
            eyebrow="Les Capuccins chez vous"
            description="Composez votre commande, choisissez votre créneau et nous nous occupons du reste."
            imgUrl="hero/header.webp"
          />
        </div>

        <TakeAwayComponent
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
          restaurantId={process.env.NEXT_PUBLIC_RESTAURANT_ID}
        />
        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return buildStaticPageProps(locale, ["common"]);
}

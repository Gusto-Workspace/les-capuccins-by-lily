import { useEffect, useRef, useState } from "react";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import HomePageComponent from "@/components/home/home.page.component";
import { buildStaticPageProps } from "@/_assets/utils/page-props.utils";

export default function HomePage({ seoRestaurantData = null }) {
  const heroRef = useRef(null);

  const [showScrolledNav, setShowScrolledNav] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // quand le hero est visible à moins de 5%
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
        title="Les Capucins by Lily | Restaurant italien à Turenne"
        description="Les Capucins by Lily vous accueille à Turenne dans un cadre chaleureux, avec une cuisine italienne généreuse, une carte soignée et la réservation en ligne."
        path="/"
        image="/img/hero/header.jpg"
        breadcrumbs={[{ name: "Accueil", path: "/" }]}
        restaurantData={seoRestaurantData}
      />

      <div className="relative">
        <NavComponent
          isVisible={!showScrolledNav}
          scrolled={false}
          logoSrc="/img/logo.png"
        />

        <NavComponent
          isVisible={showScrolledNav}
          scrolled
          logoSrc="/img/logo.png"
        />

        <HomePageComponent heroRef={heroRef} />
        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return buildStaticPageProps(locale, ["common"]);
}

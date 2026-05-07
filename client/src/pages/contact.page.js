import { useEffect, useRef, useState } from "react";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import MapContactComponent from "@/components/contact/map.contact.component";
import InfosContactComponent from "@/components/contact/infos.contact.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";
import { buildStaticPageProps } from "@/_assets/utils/page-props.utils";

export default function ContactPage({ seoRestaurantData = null }) {
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
        title="Contact restaurant à Turenne | Les Capucins by Lily"
        description="Adresse, téléphone, horaires et formulaire de contact du restaurant Les Capucins by Lily à Turenne, place de la Halle."
        path="/contact"
        image="/img/contact/header_contact.webp"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
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
            title="Nous contacter"
            eyebrow="Contact"
            description="Une question, une demande particulière ou une réservation de groupe pour notre restaurant à Turenne ? L’équipe vous répond rapidement."
            imgUrl="contact/header_contact.webp"
          />
        </div>

        <MapContactComponent />
        <InfosContactComponent />
        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return buildStaticPageProps(locale, ["common"]);
}

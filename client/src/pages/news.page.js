import { useEffect, useRef, useState, useContext } from "react";

// I18N
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// COMPONENTS
import NavComponent from "@/components/_shared/nav/nav.component";
import FooterComponent from "@/components/_shared/footer/footer.component";
import BannerComponent from "@/components/_shared/banner/banner.component";
import ListNewsComponent from "@/components/news/list.news.component";
import SeoHeadComponent from "@/components/_shared/seo/seo-head.component";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

export default function NewsPage() {
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
        title="Actualités - Les Capucins by Lily"
        description="Retrouvez les actualités, nouveautés et temps forts du restaurant Les Capucins by Lily."
        path="/news"
        image="/img/news/header_news.png"
        breadcrumbs={[
          { name: "Accueil", path: "/" },
          { name: "Actualités", path: "/news" },
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
            title="Actualités"
            eyebrow="À suivre"
            description="Événements, nouveautés, rendez-vous et temps forts du restaurant."
            imgUrl="news/header_news.png"
          />
        </div>

        <ListNewsComponent
          restaurantData={restaurantContext?.restaurantData}
          dataLoading={restaurantContext?.dataLoading}
        />

        <FooterComponent />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/global.context";
import { hasVisibleNews } from "@/_assets/utils/news.utils";
import WaveDividerComponent from "../wave-divider.component";
import GraphicElementComponent from "../graphic-element.component";
import {
  getRestaurantBrandParts,
  getSocialLinks,
} from "@/_assets/utils/site-display.utils";

export default function FooterComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;
  const brand = getRestaurantBrandParts();
  const socialLinks = getSocialLinks(restaurantData);
  const footerLinks = [
    { label: "Carte & menus", href: "/menus" },
    { label: "Réserver", href: "/reservations" },
    { label: "Vente à emporter", href: "/#emporter" },
    ...(hasVisibleNews(restaurantData)
      ? [{ label: "Actualités", href: "/news" }]
      : []),
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[var(--site-orange)] px-5 pb-10 pt-24 text-[var(--site-cream)] tablet:px-8 tablet:pb-12 desktop:px-[90px]">
      <WaveDividerComponent
        position="top"
        fill="var(--site-cream)"
        detail="rgba(255,255,255,0.82)"
        secondaryDetail="rgba(246,229,218,0.92)"
        height={94}
        flipX
        scaleY={0.9}
        overlap={12}
      />

      <div className="mx-auto max-w-[1600px]">
        <GraphicElementComponent
          src="/img/elements/10.webp"
          className="bottom-[-22px] left-[-22px] hidden h-[150px] w-[150px] opacity-30 desktop:block"
          sizes="190px"
        />
        <GraphicElementComponent
          src="/img/elements/9.webp"
          className="bottom-[-18px] right-[-22px] hidden h-[146px] w-[146px] opacity-30 desktop:block"
          sizes="180px"
        />
        <div className="relative z-10 flex flex-col items-center gap-10 border-b border-[rgba(246,231,230,0.36)] pb-10 text-center desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-16 desktop:text-left">
          <Link href="/" className="flex items-center gap-4 desktop:self-start">
            <div className="relative h-[68px] w-[68px] overflow-hidden rounded-full border border-[rgba(246,231,230,0.4)] bg-white/12">
              <Image
                src="/img/logo.png"
                alt={brand.full}
                fill
                className="object-contain p-2"
              />
            </div>

            <div>
              <p className="yeseva-one-regular text-[34px] leading-[0.9]">
                {brand.main}
              </p>
              <p className="script-font -mt-1 text-[34px] leading-none text-[rgba(246,231,230,0.92)]">
                {brand.accent}
              </p>
            </div>
          </Link>

          <div className="flex flex-col items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,231,230,0.85)] desktop:flex-row desktop:flex-wrap desktop:justify-end">
            {footerLinks.map((item, index) => (
              <div key={item.href} className="flex items-center gap-3">
                {index > 0 ? (
                  <span className="hidden text-[rgba(246,231,230,0.7)] desktop:inline">
                    •
                  </span>
                ) : null}
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 py-8 text-center desktop:flex-row desktop:items-center desktop:justify-between desktop:text-left">
          <div className="flex flex-col items-center gap-4 desktop:items-start">
            <p className="text-[14px] leading-[1.7] text-[rgba(246,231,230,0.82)]">
              © {new Date().getFullYear()} {brand.full}. Tous droits réservés.{" "}
              <a
                href="https://gusto-manager.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                Propulsé par Gusto Manager
              </a>
            </p>
            <div className="flex flex-col items-center gap-2 text-[12px] font-medium tracking-[0.16em] text-[rgba(246,231,230,0.82)] desktop:flex-row desktop:items-center desktop:gap-3">
              <Link href="/legales" className="transition hover:text-white">
                Mentions légales
              </Link>
              <span className="hidden desktop:inline">•</span>
              <Link href="/policy" className="transition hover:text-white">
                Politique de confidentialité
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 desktop:justify-end">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(246,231,230,0.42)] bg-white/12 text-[var(--site-cream)] transition hover:-translate-y-[1px] hover:bg-white/18 hover:text-white"
              >
                <i className={item.iconClass} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

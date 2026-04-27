import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/global.context";
import WaveDividerComponent from "../wave-divider.component";
import {
  getRestaurantBrandParts,
  getSocialLinks,
} from "@/_assets/utils/site-display.utils";

export default function FooterComponent() {
  const { restaurantContext } = useContext(GlobalContext);
  const restaurantData = restaurantContext?.restaurantData;
  const brand = getRestaurantBrandParts();
  const socialLinks = getSocialLinks(restaurantData);

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
        <div className="flex flex-col gap-10 border-b border-[rgba(246,231,230,0.36)] pb-10 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-16">
          <Link href="/" className="flex items-center gap-4 self-start">
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

          <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,231,230,0.85)]">
            <Link href="/menus" className="transition hover:text-white">
              Carte & menus
            </Link>
            <span className="text-[rgba(246,231,230,0.7)]">•</span>
            <Link href="/reservations" className="transition hover:text-white">
              Réserver
            </Link>
            <span className="text-[rgba(246,231,230,0.7)]">•</span>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-8 py-8 text-center tablet:text-left desktop:flex-row desktop:items-center desktop:justify-between">
          <p className="text-[14px] leading-[1.7] text-[rgba(246,231,230,0.82)]">
            © {new Date().getFullYear()} {brand.full}. Tous droits réservés.
          </p>

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

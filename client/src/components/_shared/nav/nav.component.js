import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import { hasVisibleNews } from "@/_assets/utils/news.utils";
import { getRestaurantBrandParts } from "@/_assets/utils/site-display.utils";

const baseMenuItems = [
  { label: "Carte & menus", href: "/menus" },
  { label: "Réserver", href: "/reservations" },
  { label: "Vente à emporter", href: "/#emporter" },
  { label: "Actualités", href: "/news", visibilityKey: "news" },
  { label: "Contact", href: "/contact" },
];

function isCurrentPath(routerPath, href) {
  if (href === "/") {
    return routerPath === "/";
  }

  return routerPath.startsWith(href);
}

function Brand({ logoSrc, brand }) {
  return (
    <div className="flex items-center">
      <div className="relative h-[58px] w-[58px] shrink-0 tablet:h-[64px] tablet:w-[64px] desktop:h-[70px] desktop:w-[70px]">
        <Image
          src={logoSrc}
          alt={brand.full}
          fill
          priority
          sizes="(min-width: 1180px) 70px, 64px"
          className="object-contain scale-[0.96]"
        />
      </div>
    </div>
  );
}

export default function NavComponent({
  isVisible = true,
  scrolled = false,
  logoSrc = "/img/logo.png",
}) {
  const router = useRouter();
  const { restaurantContext } = useContext(GlobalContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const restaurantData = restaurantContext?.restaurantData;
  const brand = getRestaurantBrandParts(restaurantData);

  const menuItems = useMemo(
    () =>
      baseMenuItems.filter((item) => {
        if (item.visibilityKey === "news") {
          return hasVisibleNews(restaurantData);
        }

        return true;
      }),
    [restaurantData],
  );

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const navTextClass = scrolled ? "text-[var(--site-ink)]" : "text-white";

  return (
    <>
      <div
        className={`fixed inset-0 z-[59] bg-[rgba(41,22,15,0.34)] transition-all duration-300 min-[1180px]:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-[60] flex h-screen w-[92%] max-w-[420px] flex-col bg-[var(--site-peach)] px-7 pb-10 pt-7 shadow-[0_24px_80px_rgba(71,42,34,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[1180px]:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Brand logoSrc={logoSrc} brand={brand} />
          </Link>

          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(223,160,132,0.35)] text-[var(--site-ink)]"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>

        <nav className="mt-14 flex flex-1 flex-col justify-center gap-8">
          {menuItems.map((item, index) => {
            const active = isCurrentPath(router.pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-center gap-4 transition-opacity duration-300 hover:opacity-70 ${
                  active ? "opacity-100" : "opacity-85"
                }`}
              >
                <span className="text-[11px] uppercase tracking-[0.32em] text-[rgba(71,42,34,0.45)]">
                  0{index + 1}
                </span>
                <span className="nav-font text-[32px] leading-none text-[var(--site-ink)] tablet:text-[36px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav
        className={`fixed left-0 top-0 z-[50] w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } ${
          scrolled
            ? "bg-[rgba(246,231,230,0.92)] shadow-[0_16px_48px_rgba(127,83,66,0.12)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[88px] w-full max-w-[1600px] items-center justify-between px-5 tablet:px-8 desktop:px-10">
          <Link href="/" aria-label="Accueil">
            <Brand logoSrc={logoSrc} brand={brand} />
          </Link>

          <div className="hidden min-[1180px]:flex items-center gap-2 min-[1320px]:gap-4">
            {menuItems.map((item) => {
              const active = isCurrentPath(router.pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-font relative px-1 py-2 text-[18px] leading-none transition-all duration-300 min-[1320px]:text-[20px] ${
                    active ? `${navTextClass}` : `${navTextClass} hover:opacity-70`
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--site-orange)] transition-all duration-300 ${
                      active ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 min-[1180px]:hidden ${
              scrolled
                ? "bg-white/75 text-[var(--site-ink)]"
                : "bg-white/12 text-[var(--site-cream)]"
            }`}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </nav>
    </>
  );
}

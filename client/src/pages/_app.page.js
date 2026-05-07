import "@/styles/style.scss";
import "@/styles/tailwind.css";
import "@/styles/custom/_index.scss";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { Allura, Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { appWithTranslation } from "next-i18next";
import { GlobalProvider } from "@/contexts/global.context";

const allura = Allura({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-allura",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant-garamond",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

function TrackVisits() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  // Durée de session : 5 minutes
  const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (!router.isReady || !RESTAURANT_ID) return;

    const now = Date.now();
    const last = parseInt(localStorage.getItem("lastVisitSession") || "0", 10);

    // Si pas de session ou session expirée, on logge une nouvelle session
    if (!last || now - last > SESSION_TIMEOUT) {
      localStorage.setItem("lastVisitSession", String(now));

      const visitUrl = `${API_URL}/restaurants/${RESTAURANT_ID}/visits`;
      const timeoutId = window.setTimeout(() => {
        fetch(visitUrl, {
          method: "POST",
          keepalive: true,
        }).catch((e) => console.error("log session :", e));
      }, 2500);

      return () => window.clearTimeout(timeoutId);
    }
  }, [router.isReady, router.asPath, API_URL, RESTAURANT_ID]);

  return null;
}

function App({ Component, pageProps }) {
  return (
    <div
      className={`${manrope.variable} ${cormorantGaramond.variable} ${allura.variable} font-root`}
    >
      <GlobalProvider>
        <TrackVisits />
        <Component {...pageProps} />
        <Analytics />
      </GlobalProvider>
    </div>
  );
}

export default appWithTranslation(App);

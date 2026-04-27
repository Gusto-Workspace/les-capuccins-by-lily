import "@/styles/style.scss";
import "@/styles/tailwind.css";
import "@/styles/custom/_index.scss";

import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { appWithTranslation } from "next-i18next";
import { GlobalProvider } from "@/contexts/global.context";

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
      axios
        .post(`${API_URL}/restaurants/${RESTAURANT_ID}/visits`)
        .catch((e) => console.error("log session :", e));
    }
  }, [router.isReady, router.asPath, API_URL, RESTAURANT_ID]);

  return null;
}

function App({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <TrackVisits />
      <Component {...pageProps} />
      <SpeedInsights />
      <Analytics />
    </GlobalProvider>
  );
}

export default appWithTranslation(App);

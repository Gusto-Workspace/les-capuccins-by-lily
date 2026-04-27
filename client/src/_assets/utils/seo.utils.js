import { getRestaurantDisplayName, getSocialLinks } from "./site-display.utils";

export const DEFAULT_SITE_NAME = "Les Capucins by Lily";
export const DEFAULT_SITE_URL = "http://localhost:8003";
export const DEFAULT_SOCIAL_IMAGE = "/img/hero/header.jpg";

const schemaDayByKey = {
  lundi: "Monday",
  monday: "Monday",
  mardi: "Tuesday",
  tuesday: "Tuesday",
  mercredi: "Wednesday",
  wednesday: "Wednesday",
  jeudi: "Thursday",
  thursday: "Thursday",
  vendredi: "Friday",
  friday: "Friday",
  samedi: "Saturday",
  saturday: "Saturday",
  dimanche: "Sunday",
  sunday: "Sunday",
};

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeDayKey(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizeBaseUrl(value) {
  const sanitizedValue = String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");

  if (!sanitizedValue) {
    return DEFAULT_SITE_URL;
  }

  return sanitizedValue.replace(/\/+$/, "");
}

export function buildAbsoluteUrl(baseUrl, path) {
  if (!path) {
    return baseUrl;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function toSchemaPostalAddress(address) {
  if (!address || typeof address !== "object") {
    return null;
  }

  const streetAddress = normalizeText(address.line1);
  const postalCode = normalizeText(address.zipCode);
  const addressLocality = normalizeText(address.city);
  const addressCountry = normalizeText(address.country) || "FR";

  if (!streetAddress && !postalCode && !addressLocality) {
    return null;
  }

  return {
    "@type": "PostalAddress",
    streetAddress: streetAddress || undefined,
    postalCode: postalCode || undefined,
    addressLocality: addressLocality || undefined,
    addressCountry,
  };
}

function toOpeningHoursSpecification(openingHours) {
  if (!Array.isArray(openingHours)) {
    return [];
  }

  return openingHours.flatMap((dayData) => {
    const dayOfWeek = schemaDayByKey[normalizeDayKey(dayData?.day)];

    if (!dayOfWeek) {
      return [];
    }

    if (
      dayData?.isClosed ||
      !Array.isArray(dayData?.hours) ||
      dayData.hours.length === 0
    ) {
      return [];
    }

    return dayData.hours
      .map((range) => {
        const opens = normalizeText(range?.open);
        const closes = normalizeText(range?.close);

        if (!opens || !closes) {
          return null;
        }

        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek,
          opens,
          closes,
        };
      })
      .filter(Boolean);
  });
}

function compactObject(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => compactObject(item))
      .filter((item) => item !== null && item !== undefined && item !== "");
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entryValue]) => [key, compactObject(entryValue)])
      .filter(([, entryValue]) => {
        if (Array.isArray(entryValue)) {
          return entryValue.length > 0;
        }

        return entryValue !== null && entryValue !== undefined && entryValue !== "";
      }),
  );
}

export function getSeoRouteEntries(baseUrl) {
  const routes = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/menus", priority: "0.9", changefreq: "weekly" },
    { path: "/reservations", priority: "0.9", changefreq: "weekly" },
    { path: "/contact", priority: "0.8", changefreq: "monthly" },
    { path: "/news", priority: "0.7", changefreq: "weekly" },
    { path: "/legales", priority: "0.3", changefreq: "yearly" },
    { path: "/policy", priority: "0.3", changefreq: "yearly" },
  ];

  return routes.map((route) => ({
    ...route,
    url: buildAbsoluteUrl(baseUrl, route.path),
  }));
}

export function buildSeoSchemas({
  baseUrl,
  restaurant,
  title,
  description,
  canonicalUrl,
  imageUrl,
  breadcrumbs = [],
}) {
  const siteName = getRestaurantDisplayName();
  const socialLinks = getSocialLinks(restaurant).map((item) => item.href);
  const websiteId = `${baseUrl}/#website`;
  const restaurantId = `${baseUrl}/#restaurant`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: siteName,
      url: baseUrl,
      inLanguage: "fr-FR",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      inLanguage: "fr-FR",
      isPartOf: {
        "@id": websiteId,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": restaurantId,
      name: siteName,
      url: baseUrl,
      image: imageUrl,
      servesCuisine: ["Cuisine italienne", "Pizzas", "Restaurant"],
      acceptsReservations: true,
      menu: buildAbsoluteUrl(baseUrl, "/menus"),
      telephone: normalizeText(restaurant?.phone) || undefined,
      email: normalizeText(restaurant?.email) || undefined,
      address: toSchemaPostalAddress(restaurant?.address),
      openingHoursSpecification: toOpeningHoursSpecification(
        restaurant?.opening_hours,
      ),
      sameAs: socialLinks,
    },
  ];

  if (breadcrumbs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: buildAbsoluteUrl(baseUrl, item.path),
      })),
    });
  }

  return schemas.map((schema) => compactObject(schema));
}

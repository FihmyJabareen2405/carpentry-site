import Script from "next/script";

import {
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_SERVICE_AREA,
  SITE_TAGLINE,
} from "@/lib/site";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

export default function BusinessJsonLd() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: SITE_PHONE_DISPLAY,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    areaServed: {
      "@type": "Country",
      name: "ישראל",
    },
    knowsAbout: [
      "נגרות בהתאמה אישית",
      "מטבחים בהתאמה אישית",
      "ארונות בהתאמה אישית",
      "חדרי שינה",
      "מזנונים",
      "חיפויי קיר",
      "עבודות עץ מיוחדות",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "שירותי נגרות",
      itemListElement: [
        "מטבחים בהתאמה אישית",
        "ארונות בהתאמה אישית",
        "חדרי שינה וריהוט",
        "מזנונים ויחידות קיר",
        "חיפויי קיר",
        "עבודות נגרות מיוחדות",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name,
          areaServed: "ישראל",
        },
      })),
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "he-IL",
    publisher: {
      "@id": `${SITE_URL}/#business`,
    },
  };

  const businessJson = JSON.stringify(businessSchema).replace(/</g, "\\u003c");
  const websiteJson = JSON.stringify(websiteSchema).replace(/</g, "\\u003c");

  return (
    <>
      <Script
        id="business-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: businessJson }}
      />

      <Script
        id="website-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: websiteJson }}
      />

      <span className="sr-only">{SITE_SERVICE_AREA}</span>
    </>
  );
}

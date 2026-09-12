import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import type { Metadata } from "next";

import {
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_TAGLINE,
} from "@/lib/site";
import {
  DEFAULT_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body
        suppressHydrationWarning
        className={`${geistSans.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

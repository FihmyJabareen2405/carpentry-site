
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";
import {
  DEFAULT_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteShell>
  {children}
</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

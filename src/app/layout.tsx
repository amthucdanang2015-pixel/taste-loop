import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WebAnalytics } from "@/components/analytics/WebAnalytics";
import { BRAND, OFFERS } from "@/config/brand";
import { ASSET_BASE_URL } from "@/config/assets";

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0d0b",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: BRAND.siteUrl,
  slogan: BRAND.headline,
  description: BRAND.description,
  founder: {
    "@type": "Person",
    name: BRAND.founder.name,
    jobTitle: BRAND.founder.role,
  },
  makesOffer: OFFERS.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    price: offer.priceAmount,
    priceCurrency: "USD",
    description: offer.promise,
  })),
};

export const metadata: Metadata = {
  applicationName: BRAND.name,
  title: {
    default: `${BRAND.name} — ${BRAND.headline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.socialDescription,
  metadataBase: new URL(BRAND.siteUrl),
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.headline}`,
    description: BRAND.socialDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.headline}`,
    description: BRAND.socialDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const copyrightYear = new Date().getUTCFullYear();

  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="origin" />
        {ASSET_BASE_URL.startsWith("https://") && (
          <link rel="preconnect" href={ASSET_BASE_URL} crossOrigin="anonymous" />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main" className="pt-0">{children}</main>
        <Footer year={copyrightYear} />
        <WebAnalytics />
      </body>
    </html>
  );
}

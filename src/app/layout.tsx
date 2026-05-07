import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import AgeGate from "@/components/AgeGate";
import Analytics from "@/components/Analytics";

// Reduced from 5 fonts to 3 — saves ~280KB of font payload + ~200ms LCP.
// Bodoni / Jost weren't used in the rendered output.
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["400","500","600","700","800"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","600","700"], display: "swap" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://superfunded.ro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "SuperFunded — Pariezi cu banii noștri, păstrezi profitul",
    template: "%s | SuperFunded",
  },
  description: "Platforma de betting prop firm #1 din România. Capital până la €50.000. Profit split până la 80%. Retrageri în 24-48h. Risc zero pentru tine.",
  keywords: ["funded betting", "prop firm pariuri", "bettor funded", "capital pariuri sportive", "betting evaluation", "România"],
  authors: [{ name: "SuperFunded" }],
  alternates: { canonical: SITE },
  openGraph: {
    title: "SuperFunded — Pariezi cu banii noștri",
    description: "Capital până la €50.000. Păstrezi până la 80% din profit. Retrageri în 24-48h.",
    type: "website",
    locale: "ro_RO",
    url: SITE,
    siteName: "SuperFunded",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "SuperFunded — Pariezi cu banii noștri" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperFunded — Pariezi cu banii noștri",
    description: "Capital până la €50.000. 80% profit split. 24-48h retrageri.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SuperFunded",
  url: SITE,
  logo: `${SITE}/logo.svg`,
  sameAs: [
    "https://discord.gg/superfunded",
    "https://twitter.com/superfunded",
  ],
  contactPoint: [
    { "@type": "ContactPoint", contactType: "customer support", email: "support@superfunded.ro", areaServed: "RO", availableLanguage: ["Romanian", "English"] },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${bebas.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="min-h-full font-jakarta" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
        <AgeGate />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}

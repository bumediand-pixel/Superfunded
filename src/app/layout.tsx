import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans, JetBrains_Mono, Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { FRAMES_PATH, FRAME_EXT } from "@/lib/constants";

const bebas   = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["300","400","500","600","700","800"] });
const mono    = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500","600","700"] });
const bodoni  = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", weight: ["400","500","600","700"], style: ["normal","italic"] });
const jost    = Jost({ subsets: ["latin"], variable: "--font-jost", weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "SuperFunded – Pariezi cu banii noștri",
  description: "Platforma de betting prop firm #1 din România. Capital până la €50.000. Evaluare fără limită de timp. Retrageri săptămânale.",
  keywords: "prop betting, bettor finanțat, betting firm, capital pariuri, România",
  openGraph: {
    title: "SuperFunded – Pariezi cu banii noștri",
    description: "Capital până la €50.000. Păstrezi 80% din profit.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${bebas.variable} ${jakarta.variable} ${mono.variable} ${bodoni.variable} ${jost.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href={`${FRAMES_PATH}/frame_0001.${FRAME_EXT}`}
          // @ts-expect-error fetchpriority is valid but typings lag
          fetchpriority="high"
        />
      </head>
      <body className="min-h-full bg-[hsl(222,20%,6%)] text-[hsl(40,18%,87%)] font-jakarta">
        {children}
      </body>
    </html>
  );
}

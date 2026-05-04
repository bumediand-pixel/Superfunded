import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans, JetBrains_Mono, Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["300","400","500","600","700","800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500","600","700"] });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", weight: ["400","500","600","700"], style: ["normal","italic"] });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", weight: ["300","400","500","600","700"] });

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

import CursorFX from '@/components/CursorFX';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${bebas.variable} ${jakarta.variable} ${mono.variable} ${bodoni.variable} ${jost.variable}`}>
      <body className="min-h-full bg-[#060606] text-white font-jakarta">
        <CursorFX />
        {children}
      </body>
    </html>
  );
}

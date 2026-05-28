import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vellum — Le bureau de dépôt des projets techniques",
    template: "%s · Vellum",
  },
  description:
    "Vellum est la plateforme de dépôt, qualification et livraison des projets de plans techniques. DWG, PDF, croquis, schémas — un seul fil, quatre rôles, une traçabilité totale.",
  applicationName: "Vellum",
  keywords: [
    "vellum",
    "plans techniques",
    "DWG",
    "architecture",
    "bureau d'études",
    "dépôt de projet",
    "B2B SaaS",
  ],
  authors: [{ name: "Vellum" }],
  openGraph: {
    title: "Vellum — Le bureau de dépôt des projets techniques",
    description:
      "Déposez un DWG, annotez un PDF, validez un aperçu. Vellum aligne client, chef de projet et dessinateur sur un même fil.",
    url: SITE_URL,
    siteName: "Vellum",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vellum",
    description:
      "Le bureau de dépôt des projets techniques. Calque, plans, livrables — tout au même endroit.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased bg-abyss`}
    >
      <body className="min-h-full flex flex-col bg-abyss text-paper">{children}</body>
    </html>
  );
}

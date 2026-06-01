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
    default: "Vellum — Dépôt et suivi de plans techniques",
    template: "%s · Vellum",
  },
  description:
    "Déposez vos PDF, DWG, croquis ou photos. Un dessinateur analyse votre dossier, prépare les aperçus et livre les fichiers finaux.",
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
    title: "Vellum — Dépôt et suivi de plans techniques",
    description:
      "Déposez vos plans, suivez les questions, les devis, les corrections, les aperçus et les livrables.",
    url: SITE_URL,
    siteName: "Vellum",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vellum",
    description:
      "Déposez vos plans et suivez chaque correction jusqu'au livrable.",
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
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}

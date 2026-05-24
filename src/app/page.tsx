import { LandingPage } from "@/components/marketing/LandingPage";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vellum",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vellum.app",
    description:
      "Plateforme B2B de dépôt, qualification et livraison de projets de plans techniques.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}

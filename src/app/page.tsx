import { LandingPage } from "@/components/marketing/LandingPage";
import { getSiteUrl } from "@/lib/site-url";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vellum",
    url: getSiteUrl(),
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

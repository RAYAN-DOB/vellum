import { LegalDoc } from "@/components/legal/LegalDoc";

export const metadata = {
  title: "Confidentialité",
  description:
    "Comment Vellum protège vos données personnelles et la confidentialité de vos plans et fichiers.",
};

export default function ConfidentialitePage() {
  return (
    <LegalDoc
      eyebrow="Vos données"
      title="Politique de confidentialité"
      updated="juin 2026"
      intro="Vellum accorde une importance particulière à la protection de vos données et à la confidentialité des plans que vous déposez. Cette politique explique quelles informations sont traitées, dans quel but, et quels sont vos droits."
      sections={[
        {
          heading: "Données traitées",
          body: (
            <ul>
              <li>
                Les informations de votre compte : nom, adresse e-mail et, le
                cas échéant, coordonnées professionnelles.
              </li>
              <li>
                Les éléments de vos dossiers : description du besoin, échanges,
                plans, fichiers, croquis, photos et livrables.
              </li>
              <li>
                Des données techniques minimales nécessaires au bon
                fonctionnement et à la sécurité du service.
              </li>
            </ul>
          ),
        },
        {
          heading: "Finalités",
          body: (
            <p>
              Vos données sont utilisées uniquement pour traiter vos demandes,
              échanger avec vous au sujet de vos dossiers, préparer les devis,
              les aperçus et les livrables, et assurer le suivi de la prestation.
              Elles ne sont jamais revendues.
            </p>
          ),
        },
        {
          heading: "Confidentialité de vos fichiers",
          body: (
            <p>
              Les plans, fichiers et documents que vous déposez ne sont pas
              rendus publics. Seules les personnes qui travaillent sur votre
              demande peuvent accéder aux pièces utiles à sa réalisation. La
              confidentialité est intégrée au fonctionnement du service.
            </p>
          ),
        },
        {
          heading: "Conservation",
          body: (
            <p>
              Vos données et vos livrables restent accessibles depuis votre
              espace le temps nécessaire au suivi de vos projets, puis sont
              conservés ou supprimés conformément aux durées légales et à votre
              demande.
            </p>
          ),
        },
        {
          heading: "Vos droits",
          body: (
            <p>
              Conformément à la réglementation applicable (notamment le RGPD),
              vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement et de portabilité de vos données, ainsi que
              d&apos;un droit d&apos;opposition. Pour exercer ces droits,
              contactez l&apos;éditeur à l&apos;adresse indiquée dans les{" "}
              <a href="/mentions-legales">mentions légales</a>.
            </p>
          ),
        },
        {
          heading: "Cookies",
          body: (
            <p>
              La plateforme utilise uniquement les cookies strictement
              nécessaires à l&apos;authentification et à la sécurité de votre
              session. Aucun cookie publicitaire n&apos;est déposé.
            </p>
          ),
        },
      ]}
    />
  );
}

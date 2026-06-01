import { LegalDoc } from "@/components/legal/LegalDoc";

export const metadata = {
  title: "Mentions légales",
  description:
    "Informations légales relatives à l'éditeur et à l'hébergement de la plateforme Vellum.",
};

export default function MentionsLegalesPage() {
  // TODO(legal): remplacer les champs entre crochets [ ... ] ci-dessous par
  // l'identité légale réelle de l'exploitant (raison sociale, forme juridique,
  // SIREN/RCS, siège social, directeur de la publication, e-mail de contact)
  // avant la mise en production. Tant qu'ils ne sont pas remplis, les crochets
  // signalent visuellement l'information manquante.
  return (
    <LegalDoc
      eyebrow="Informations légales"
      title="Mentions légales"
      updated="juin 2026"
      intro="Les présentes mentions légales précisent l'identité de l'éditeur de la plateforme Vellum ainsi que les conditions de son hébergement. Les champs entre crochets sont à compléter avec les informations légales de l'exploitant."
      sections={[
        {
          heading: "Éditeur",
          body: (
            <ul>
              <li>
                <strong>Raison sociale :</strong> [Raison sociale à compléter]
              </li>
              <li>
                <strong>Forme juridique :</strong> [SAS, SARL, EI… à compléter]
              </li>
              <li>
                <strong>Siège social :</strong> [Adresse complète à compléter]
              </li>
              <li>
                <strong>Immatriculation :</strong> [SIREN / RCS à compléter]
              </li>
              <li>
                <strong>Contact :</strong> [adresse e-mail de contact]
              </li>
            </ul>
          ),
        },
        {
          heading: "Directeur de la publication",
          body: (
            <p>
              Le directeur de la publication est le représentant légal de
              l&apos;éditeur : [Nom du responsable à compléter].
            </p>
          ),
        },
        {
          heading: "Hébergement",
          body: (
            <p>
              La plateforme est déployée sur une infrastructure cloud
              professionnelle. L&apos;hébergement applicatif et la base de
              données sont assurés par des prestataires spécialisés disposant de
              centres de données situés au sein de l&apos;Union européenne.
              Les coordonnées précises de l&apos;hébergeur peuvent être obtenues
              sur simple demande auprès de l&apos;éditeur.
            </p>
          ),
        },
        {
          heading: "Propriété intellectuelle",
          body: (
            <p>
              La structure générale de la plateforme, ainsi que les textes,
              visuels et éléments d&apos;interface qui la composent, sont
              protégés par le droit de la propriété intellectuelle. Les plans,
              fichiers et documents déposés par les clients restent leur
              propriété exclusive ; Vellum ne dispose que des droits nécessaires
              à la réalisation de la prestation demandée.
            </p>
          ),
        },
        {
          heading: "Responsabilité",
          body: (
            <p>
              L&apos;éditeur met tout en œuvre pour assurer l&apos;exactitude des
              informations diffusées et la disponibilité du service, sans
              toutefois garantir l&apos;absence totale d&apos;interruption. Pour
              toute question relative à ces mentions, vous pouvez contacter
              l&apos;éditeur à l&apos;adresse indiquée ci-dessus.
            </p>
          ),
        },
      ]}
    />
  );
}

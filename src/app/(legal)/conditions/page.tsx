import { LegalDoc } from "@/components/legal/LegalDoc";

export const metadata = {
  title: "Conditions d'utilisation",
  description:
    "Les règles d'utilisation de la plateforme Vellum : compte, dépôt de projets, fichiers et responsabilités.",
};

export default function ConditionsPage() {
  return (
    <LegalDoc
      eyebrow="Cadre d'utilisation"
      title="Conditions d'utilisation"
      updated="juin 2026"
      intro="Les présentes conditions encadrent l'utilisation de la plateforme Vellum. En créant un espace et en déposant un projet, vous acceptez les règles décrites ci-dessous."
      sections={[
        {
          heading: "Objet du service",
          body: (
            <p>
              Vellum permet de déposer des plans et des fichiers techniques,
              d&apos;échanger avec un dessinateur, de recevoir des devis et des
              aperçus, de demander des corrections et de télécharger les
              livrables finaux, au sein d&apos;un espace dédié à chaque projet.
            </p>
          ),
        },
        {
          heading: "Votre espace",
          body: (
            <p>
              La création d&apos;un espace nécessite une adresse e-mail valide.
              Vous êtes responsable de la confidentialité de vos identifiants et
              des actions réalisées depuis votre espace. Prévenez-nous sans délai
              en cas d&apos;utilisation non autorisée.
            </p>
          ),
        },
        {
          heading: "Fichiers et contenus",
          body: (
            <p>
              Vous conservez l&apos;entière propriété des plans, fichiers et
              documents que vous déposez. Vous vous engagez à ne déposer que des
              contenus pour lesquels vous disposez des droits nécessaires et à ne
              pas transmettre d&apos;éléments illicites.
            </p>
          ),
        },
        {
          heading: "Bon usage",
          body: (
            <p>
              Le service doit être utilisé conformément à sa finalité. Toute
              tentative de contourner la sécurité, de perturber le service ou
              d&apos;accéder à des dossiers qui ne vous appartiennent pas est
              interdite.
            </p>
          ),
        },
        {
          heading: "Disponibilité et responsabilité",
          body: (
            <p>
              Nous nous efforçons d&apos;assurer un service fiable et continu.
              La responsabilité de l&apos;éditeur ne saurait être engagée en cas
              d&apos;interruption indépendante de sa volonté ou de mauvaise
              utilisation du service.
            </p>
          ),
        },
        {
          heading: "Évolution des conditions",
          body: (
            <p>
              Ces conditions peuvent évoluer afin de refléter les améliorations
              du service ou les évolutions réglementaires. La version applicable
              est celle publiée sur cette page. Pour toute question, consultez
              les <a href="/mentions-legales">mentions légales</a>.
            </p>
          ),
        },
      ]}
    />
  );
}

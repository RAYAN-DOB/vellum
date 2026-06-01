import { FileArchive, MessageSquareText, PenTool, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: FileArchive,
    eyebrow: "01",
    title: "Déposez votre demande",
    body:
      "Décrivez votre besoin, ajoutez vos plans, croquis, photos ou schémas. Vellum prépare un dossier clair à transmettre.",
  },
  {
    icon: PenTool,
    eyebrow: "02",
    title: "Un dessinateur analyse vos fichiers",
    body:
      "Un dessinateur prend connaissance de votre demande, vérifie les pièces reçues et vous indique les éléments manquants si nécessaire.",
  },
  {
    icon: MessageSquareText,
    eyebrow: "03",
    title: "Vous échangez et validez les aperçus",
    body:
      "Questions, corrections, maquettes intermédiaires et validations restent au même endroit.",
  },
  {
    icon: Sparkles,
    eyebrow: "04",
    title: "Vous récupérez vos livrables",
    body:
      "Une fois validé, vous téléchargez les fichiers finaux depuis votre espace client.",
  },
] as const;

export function ProductShowcase() {
  return (
    <section id="produit" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <header className="grid gap-8 lg:grid-cols-[0.9fr_1.2fr] lg:items-end">
          <div>
            <h2 className="display text-[clamp(2rem,4.5vw,3.5rem)]">
              Un dossier clair,
              <br />
              <span className="italic">du premier fichier au dernier plan.</span>
            </h2>
          </div>
          <p className="max-w-xl text-[16px] leading-[1.7] text-graphite lg:justify-self-end">
            Vellum remplace les pièces jointes dispersées par un parcours
            simple : dépôt, questions, devis, aperçus, corrections et livraison.
            Le client sait toujours ce qui manque, ce qui avance et ce qui est
            prêt à valider.
          </p>
        </header>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, eyebrow, title, body }) => (
            <article
              key={eyebrow}
              className="group flex min-h-[260px] flex-col justify-between gap-7 bg-paper p-7 transition-colors hover:bg-vellum/50 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="caption">{eyebrow}</span>
                <Icon className="size-5 text-sienna" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl leading-[1.12] text-ink">
                  {title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.65] text-mute">
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

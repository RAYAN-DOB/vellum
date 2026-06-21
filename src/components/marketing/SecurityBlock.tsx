import { Archive, FileLock2, History, UsersRound } from "lucide-react";

import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";

const guarantees = [
  {
    ref: "SEC-01",
    icon: FileLock2,
    title: "Vos fichiers restent privés",
    body: "Les plans, photos, croquis et notes de votre dossier ne sont pas visibles publiquement.",
  },
  {
    ref: "SEC-02",
    icon: UsersRound,
    title: "Accès limité au dossier",
    body: "Seules les personnes qui travaillent sur votre demande peuvent consulter les pièces utiles.",
  },
  {
    ref: "SEC-03",
    icon: History,
    title: "Échanges conservés",
    body: "Questions, réponses, corrections et validations restent dans l'historique du projet.",
  },
  {
    ref: "SEC-04",
    icon: Archive,
    title: "Livrables disponibles",
    body: "Les fichiers finaux restent accessibles depuis votre espace client après livraison.",
  },
] as const;

export function SecurityBlock() {
  return (
    <section id="securite" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <CartoucheHeader
          eyebrow="Confidentialité"
          meta="Vellum · Sécurité"
          title="Vos plans restent dans votre dossier."
          description="La confidentialité est intégrée au service : chaque dossier garde ses fichiers, ses messages et ses livrables au même endroit, sans exposer votre projet à des personnes extérieures."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map(({ ref, icon: Icon, title, body }) => (
            <article key={title} className="flex flex-col gap-4 bg-paper p-6">
              <div className="flex items-center justify-between">
                <Icon
                  className="size-5 text-pine"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <span className="caption text-soft">{ref}</span>
              </div>
              <h3 className="font-display text-xl leading-[1.2] text-ink">
                {title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-mute">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

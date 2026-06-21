import { Archive, FileLock2, History, UsersRound } from "lucide-react";

import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";
import { MovingGradient } from "@/components/marketing/MovingGradient";

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
    <section
      id="securite"
      className="relative overflow-hidden border-t border-white/10 text-paper"
    >
      <MovingGradient variant="dark" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,249,245,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <CartoucheHeader
          dark
          eyebrow="Confidentialité"
          meta="Vellum · Sécurité"
          title="Vos plans restent dans votre dossier."
          description="La confidentialité est intégrée au service : chaque dossier garde ses fichiers, ses messages et ses livrables au même endroit, sans exposer votre projet à des personnes extérieures."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map(({ ref, icon: Icon, title, body }) => (
            <article
              key={title}
              className="flex flex-col gap-4 bg-[#0b1416] p-6 transition-colors hover:bg-[#0e1a1c]"
            >
              <div className="flex items-center justify-between">
                <Icon
                  className="size-5 text-cyan"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                <span className="caption !text-paper/40">{ref}</span>
              </div>
              <h3 className="font-display text-xl leading-[1.2] text-paper">
                {title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-paper/60">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

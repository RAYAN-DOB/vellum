import { Archive, FileLock2, History, UsersRound } from "lucide-react";

const guarantees = [
  {
    icon: FileLock2,
    title: "Vos fichiers restent privés",
    body:
      "Les plans, photos, croquis et notes de votre dossier ne sont pas visibles publiquement.",
  },
  {
    icon: UsersRound,
    title: "Accès limité au dossier",
    body:
      "Seules les personnes qui travaillent sur votre demande peuvent consulter les pièces utiles.",
  },
  {
    icon: History,
    title: "Échanges conservés",
    body:
      "Questions, réponses, corrections et validations restent dans l'historique du projet.",
  },
  {
    icon: Archive,
    title: "Livrables disponibles",
    body:
      "Les fichiers finaux restent accessibles depuis votre espace client après livraison.",
  },
] as const;

export function SecurityBlock() {
  return (
    <section
      id="securite"
      className="relative overflow-hidden border-b border-line bg-ink text-paper"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,249,245,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <header className="grid gap-8 lg:grid-cols-[0.9fr_1.2fr] lg:items-end">
          <div>
            <h2 className="display text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
              Vos plans restent
              <br />
              <span className="italic">dans votre dossier.</span>
            </h2>
          </div>
          <p className="max-w-xl text-[16px] leading-[1.7] text-paper/70 lg:justify-self-end">
            La confidentialité est intégrée au fonctionnement du service :
            chaque dossier garde ses fichiers, ses messages et ses livrables au
            même endroit, sans exposer votre projet à des personnes extérieures.
          </p>
        </header>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[6px] border border-paper/10 bg-paper/10 sm:grid-cols-2">
          {guarantees.map(({ icon: Icon, title, body }) => (
            <article key={title} className="flex flex-col gap-5 bg-ink p-8 sm:p-9">
              <Icon
                className="size-6 text-paper/80"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              <h3 className="font-display text-2xl leading-[1.15] text-paper">
                {title}
              </h3>
              <p className="text-[14px] leading-[1.65] text-paper/65">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

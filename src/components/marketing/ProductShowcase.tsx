import { FileArchive, Inbox, Layers3, ShieldCheck } from "lucide-react";

const pillars = [
  {
    icon: Inbox,
    eyebrow: "01",
    title: "Un dépôt structuré",
    body:
      "Chaque projet commence par un brief clair et des pièces typées. Plus de fil d'email perdu, plus de version sans contexte.",
  },
  {
    icon: Layers3,
    eyebrow: "02",
    title: "Un calque commun",
    body:
      "Client, chef de projet et dessinateur lisent le même état. Statut, révision, prochaine action — tout est explicite.",
  },
  {
    icon: FileArchive,
    eyebrow: "03",
    title: "Des livrables signés",
    body:
      "Aperçus, validation client, version publiée. La traçabilité est native, l'historique conservé sans manipulation.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "04",
    title: "Une sécurité Postgres",
    body:
      "Row-Level Security sur chaque table sensible. Vos plans ne fuient pas — la frontière est dans la base, pas dans l'UI.",
  },
] as const;

export function ProductShowcase() {
  return (
    <section
      id="produit"
      className="border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p className="caption">Le produit</p>
            <h2 className="display mt-5 text-[clamp(2rem,4.5vw,3.5rem)]">
              Plus qu&apos;un drive.
              <br />
              <span className="italic">Un fil de production.</span>
            </h2>
          </div>
          <p className="max-w-xl text-[16px] leading-[1.7] text-graphite lg:justify-self-end">
            Vellum n&apos;est pas un partage de fichiers. C&apos;est l&apos;espace
            où un projet technique vit de son brief à son livrable signé —
            avec quatre rôles cloisonnés et une seule source de vérité.
          </p>
        </header>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, eyebrow, title, body }) => (
            <article
              key={eyebrow}
              className="group flex flex-col gap-6 bg-paper p-8 transition-colors hover:bg-vellum/40"
            >
              <div className="flex items-start justify-between">
                <span className="caption">{eyebrow}</span>
                <Icon className="size-5 text-graphite" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl leading-[1.1] text-ink">
                {title}
              </h3>
              <p className="text-[14px] leading-[1.65] text-mute">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

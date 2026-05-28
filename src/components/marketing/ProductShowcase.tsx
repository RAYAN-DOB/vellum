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
      className="relative border-b border-graphite overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-subtle" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p className="caption text-gold">Le produit</p>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,4rem)]">
              <span className="text-paper">Plus qu&apos;un drive.</span>
              <br />
              <span className="italic text-gradient">Un fil de production.</span>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-silver lg:justify-self-end">
            Vellum n&apos;est pas un partage de fichiers. C&apos;est l&apos;espace
            où un projet technique vit de son brief à son livrable signé —
            avec quatre rôles cloisonnés et une seule source de vérité.
          </p>
        </header>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, eyebrow, title, body }, index) => (
            <article
              key={eyebrow}
              className="group relative overflow-hidden rounded-2xl border border-graphite bg-obsidian/50 p-8 transition-all duration-500 hover:border-gold/30 hover:bg-obsidian shine"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <span className="caption text-gold">{eyebrow}</span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-slate border border-graphite group-hover:border-gold/20 group-hover:bg-gold/10 transition-colors">
                    <Icon className="size-5 text-silver group-hover:text-gold transition-colors" aria-hidden="true" />
                  </div>
                </div>
                
                <h3 className="font-display text-2xl leading-tight text-paper mb-4">
                  {title}
                </h3>
                
                <p className="text-sm leading-relaxed text-silver">
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

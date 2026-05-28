import { FileLock2, Fingerprint, KeyRound, ShieldCheck } from "lucide-react";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Row-Level Security native",
    body:
      "Chaque requête SQL est filtrée par les politiques RLS de Postgres. Le contrôle d'accès ne dépend pas du code applicatif.",
  },
  {
    icon: FileLock2,
    title: "Buckets privés signés",
    body:
      "Aucun fichier n'est public. Les téléchargements passent par des URLs signées éphémères, vérifiées projet par projet.",
  },
  {
    icon: Fingerprint,
    title: "Audit log immuable",
    body:
      "Connexion, désactivation, modification de rôle, export — chaque action sensible laisse une trace horodatée.",
  },
  {
    icon: KeyRound,
    title: "Service role isolé",
    body:
      "La clé d'administration ne quitte jamais le serveur. Aucun composant client ne peut l'utiliser pour bypasser RLS.",
  },
] as const;

export function SecurityBlock() {
  return (
    <section
      id="securite"
      className="relative overflow-hidden border-b border-graphite"
    >
      {/* Dark gradient background with gold accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-void to-abyss" />
      <div className="absolute inset-0 grid-subtle" />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20 blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(245,166,35,0.3) 0%, transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end mb-16">
          <div>
            <p className="caption text-gold">Sécurité</p>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,4rem)]">
              <span className="text-paper">Vos plans</span>
              <br />
              <span className="italic text-gradient">ne sortent pas.</span>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-silver lg:justify-self-end">
            Vellum est construit autour d&apos;une règle : la sécurité
            n&apos;est pas une fonctionnalité, c&apos;est la frontière. Tout ce
            qui peut être contrôlé en base l&apos;est en base — pas dans l&apos;UI.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {guarantees.map(({ icon: Icon, title, body }, index) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-graphite bg-obsidian/20 p-8 transition-all duration-300 hover:border-gold/30 hover:bg-obsidian/40 shine"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Subtle top border glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate/50 border border-graphite group-hover:border-gold/20 group-hover:bg-gold/10 transition-all mb-6">
                  <Icon
                    className="size-5 text-silver group-hover:text-gold transition-colors"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
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

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

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p className="caption text-paper/55">Sécurité</p>
            <h2 className="display mt-5 text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
              Vos plans
              <br />
              <span className="italic">ne sortent pas.</span>
            </h2>
          </div>
          <p className="max-w-xl text-[16px] leading-[1.7] text-paper/70 lg:justify-self-end">
            Vellum est construit autour d&apos;une règle : la sécurité
            n&apos;est pas une fonctionnalité, c&apos;est la frontière. Tout ce
            qui peut être contrôlé en base l&apos;est en base — pas dans l&apos;UI.
          </p>
        </header>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-paper/10 bg-paper/10 sm:grid-cols-2">
          {guarantees.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="flex flex-col gap-5 bg-ink p-8 sm:p-10"
            >
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

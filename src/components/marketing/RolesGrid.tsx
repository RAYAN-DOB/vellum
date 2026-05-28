import { Briefcase, Crown, Pencil, Shield } from "lucide-react";

const roles = [
  {
    name: "Client",
    icon: Briefcase,
    pitch:
      "Dépose un dossier, suit l'avancement, valide les aperçus, télécharge les livrables signés.",
    rights: [
      "Voir ses projets uniquement",
      "Téléverser plans, croquis, références",
      "Valider ou refuser un aperçu",
      "Recevoir les devis et livrables",
    ],
  },
  {
    name: "Chef de projet",
    icon: Crown,
    pitch:
      "Qualifie le brief, assigne le dessinateur, prépare le devis, suit la production.",
    rights: [
      "Voir tous les projets",
      "Qualifier, assigner, mettre à jour le statut",
      "Créer et envoyer des devis",
      "Modérer les échanges projet",
    ],
  },
  {
    name: "Dessinateur",
    icon: Pencil,
    pitch:
      "Travaille sur les fichiers natifs, dépose les aperçus, publie les livrables techniques.",
    rights: [
      "Voir uniquement les projets assignés",
      "Téléverser aperçus, calques, versions",
      "Marquer un livrable prêt à valider",
      "Échanger avec le client cadré",
    ],
  },
  {
    name: "Admin",
    icon: Shield,
    pitch:
      "Gère utilisateurs, rôles, permissions, politiques applicatives et journal d'audit.",
    rights: [
      "CRUD utilisateurs et rôles",
      "Matrice rôles × permissions",
      "Politiques applicatives (GPO)",
      "Audit logs des actions sensibles",
    ],
  },
] as const;

export function RolesGrid() {
  return (
    <section className="relative border-b border-graphite overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-subtle" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end mb-16">
          <div>
            <p className="caption text-gold">Quatre rôles</p>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,4rem)]">
              <span className="text-paper">Une seule plateforme.</span>
              <br />
              <span className="italic text-gradient">Des accès cloisonnés.</span>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-silver lg:justify-self-end">
            Chaque rôle a sa vue, ses droits, ses obligations. La frontière de
            sécurité est dans Postgres (Row-Level Security) — pas un cookie
            forgé ne contourne la règle.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <article
                key={role.name}
                className="group relative overflow-hidden rounded-2xl border border-graphite bg-obsidian/30 p-8 transition-all duration-300 hover:border-gold/30 hover:bg-obsidian/50"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Hover glow */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-graphite pb-5 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-slate border border-graphite group-hover:border-gold/20 group-hover:bg-gold/10 transition-colors">
                        <Icon className="size-5 text-silver group-hover:text-gold transition-colors" />
                      </div>
                      <h3 className="font-display text-2xl text-paper">{role.name}</h3>
                    </div>
                    <span className="caption text-dim">RÔLE</span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-silver mb-6">
                    {role.pitch}
                  </p>
                  
                  {/* Rights list */}
                  <ul className="space-y-3">
                    {role.rights.map((right) => (
                      <li
                        key={right}
                        className="flex items-start gap-3 text-sm leading-relaxed text-dim"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold/60" />
                        {right}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

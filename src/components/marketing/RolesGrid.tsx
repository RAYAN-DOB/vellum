const roles = [
  {
    name: "Client",
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
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <header className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p className="caption">Quatre rôles</p>
            <h2 className="display mt-5 text-[clamp(2rem,4.5vw,3.5rem)]">
              Une seule plateforme.
              <br />
              <span className="italic">Des accès cloisonnés.</span>
            </h2>
          </div>
          <p className="max-w-xl text-[16px] leading-[1.7] text-graphite lg:justify-self-end">
            Chaque rôle a sa vue, ses droits, ses obligations. La frontière de
            sécurité est dans Postgres (Row-Level Security) — pas un cookie
            forgé ne contourne la règle.
          </p>
        </header>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.name}
              className="flex flex-col gap-6 bg-paper p-8 sm:p-10"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-display text-2xl text-ink">{role.name}</h3>
                <span className="caption">RÔLE</span>
              </div>
              <p className="text-[14px] leading-[1.65] text-graphite">
                {role.pitch}
              </p>
              <ul className="space-y-2">
                {role.rights.map((right) => (
                  <li
                    key={right}
                    className="flex items-start gap-3 text-[13px] leading-[1.6] text-mute"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] inline-block size-1 shrink-0 rounded-full bg-ink"
                    />
                    {right}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

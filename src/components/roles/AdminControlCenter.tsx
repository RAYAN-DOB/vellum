import { Database, LockKeyhole, Settings2, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockProjects, mockTeamCapacity, mockUsers } from "@/lib/mock-data";

const adminTiles = [
  {
    label: "Utilisateurs",
    value: "4 roles",
    detail: "Clients, managers, architectes et admins en mock.",
    icon: UsersRound,
  },
  {
    label: "Projets",
    value: "3 demo",
    detail: "Dossiers fictifs pour valider le modele.",
    icon: Database,
  },
  {
    label: "Permissions",
    value: "V2",
    detail: "Controles serveur et audit a construire.",
    icon: LockKeyhole,
  },
  {
    label: "Prix",
    value: "Futur",
    detail: "Modeles devis/paiement non actifs.",
    icon: Settings2,
  },
] as const;

export function AdminControlCenter() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {adminTiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <Card key={tile.label}>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle>{tile.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-950">{tile.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{tile.detail}</p>
            </CardContent>
          </Card>
        );
      })}
      <Card className="md:col-span-2 xl:col-span-4">
        <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
          <p className="text-sm text-slate-600">
            {mockUsers.length} utilisateurs fictifs.
          </p>
          <p className="text-sm text-slate-600">
            {mockProjects.length} projets demo.
          </p>
          <p className="text-sm text-slate-600">
            {mockTeamCapacity.length} membres equipe presentes.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

import { Activity, Database, LockKeyhole, Settings2, ShieldCheck, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  mockPermissionMatrix,
  mockProjects,
  mockTeamCapacity,
  mockUsers,
} from "@/lib/mock-data";

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
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminTiles.map((tile) => {
          const Icon = tile.icon;

          return (
            <Card className="rounded-[30px]" key={tile.label}>
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle>{tile.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-[#171613]">{tile.value}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b665a]">{tile.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Matrice roles cible</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {mockPermissionMatrix.map((row) => (
              <div
                className="rounded-[22px] border border-[#d8d0bf] bg-[#f8f5ed] p-4"
                key={row.role}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#171613]">{row.role}</p>
                  <Badge tone="neutral">mock</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm leading-6 text-[#6b665a] md:grid-cols-2">
                  <p>{row.project}</p>
                  <p>{row.request}</p>
                  <p>{row.deliverable}</p>
                  <p>{row.file}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card tone="dark" className="rounded-[32px]">
            <CardHeader>
              <span className="flex size-11 items-center justify-center rounded-full bg-[#f7f3ea] text-[#171613]">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="text-[#f7f3ea]">Securite V2 a prevoir</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-6 text-[#cfc6b5]">
              <p>Stockage prive, URLs signees, audit log, permissions serveur.</p>
              <p>Aucune restriction front ne remplace les controles backend.</p>
            </CardContent>
          </Card>

          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle>Activite globale</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                `${mockUsers.length} utilisateurs fictifs`,
                `${mockProjects.length} projets demo`,
                `${mockTeamCapacity.length} membres equipe presentes`,
              ].map((item) => (
                <div
                  className="flex items-center gap-3 rounded-full border border-[#d8d0bf] bg-[#fbfaf6] px-4 py-3 text-sm text-[#6b665a]"
                  key={item}
                >
                  <Activity className="size-4 text-[#7b6b4f]" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  );
}

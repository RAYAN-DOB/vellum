import {
  ArrowRight,
  ClipboardList,
  FolderKanban,
  LockKeyhole,
  PackageCheck,
} from "lucide-react";

import { DeliverableList, ProjectList, RequestList } from "@/components/dashboard/WorkspaceLists";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { mockDashboardStats, mockDataNotice } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

const operationQueues = [
  {
    label: "A traiter",
    detail: "Demandes a clarifier avant production ou assignation.",
    value: "2",
    href: routes.workspace.newRequest,
  },
  {
    label: "En cours",
    detail: "Projets actifs avec suivi de statut et livrables attendus.",
    value: "4",
    href: routes.workspace.dashboard,
  },
  {
    label: "A valider",
    detail: "Livrables ou corrections a relire avant retour client.",
    value: "3",
    href: `${routes.workspace.deliverables}/deliverable-demo-001`,
  },
] as const;

export function DashboardOverview() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail="Dossiers demo regroupant demandes, statuts et livrables."
          icon={FolderKanban}
          label="Projets suivis"
          value={mockDashboardStats.activeProjects}
        />
        <StatCard
          detail="Besoins techniques ouverts, sans fichier reel attache."
          icon={ClipboardList}
          label="Demandes a piloter"
          value={mockDashboardStats.openRequests}
        />
        <StatCard
          detail="Elements fictifs en revue, correction ou validation."
          icon={PackageCheck}
          label="Livrables en suivi"
          value={mockDashboardStats.pendingDeliverables}
        />
        <StatCard
          detail="Cas demo ou les futures permissions serveur seront critiques."
          icon={LockKeyhole}
          label="Acces sensibles"
          value={mockDashboardStats.restrictedProjects}
        />
      </section>

      <Card className="border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-amber-950">
            Important pour la demo
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900">{mockDataNotice}</p>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        {operationQueues.map((queue) => (
          <a
            className="group rounded-[4px] border border-[#d8d0bf] bg-[#fbfaf6]/90 p-5 shadow-[0_24px_70px_rgba(22,21,18,0.08)] transition hover:-translate-y-0.5 hover:border-[#b9aa8f]"
            href={queue.href}
            key={queue.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a5f]">
                  Vue operationnelle
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#171613]">
                  {queue.label}
                </h2>
              </div>
              <span className="flex size-10 items-center justify-center rounded-[3px] bg-[#171613] text-sm font-semibold text-[#f7f3ea]">
                {queue.value}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#6b665a]">{queue.detail}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7b6b4f]">
              Ouvrir
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <RequestList />
        <ProjectList />
      </section>

      <DeliverableList />
    </div>
  );
}

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
    detail: "Demandes entrantes et cadrage avant assignation.",
    value: "2",
    href: routes.workspace.newRequest,
  },
  {
    label: "En cours",
    detail: "Projets techniques actifs avec livrables attendus.",
    value: "4",
    href: routes.workspace.dashboard,
  },
  {
    label: "A valider",
    detail: "Retours client, corrections et livrables en revue.",
    value: "3",
    href: `${routes.workspace.deliverables}/deliverable-demo-001`,
  },
] as const;

export function DashboardOverview() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail="Projets fictifs suivis dans le workspace MVP."
          icon={FolderKanban}
          label="Projets actifs"
          value={mockDashboardStats.activeProjects}
        />
        <StatCard
          detail="Demandes non fermees, toutes issues de donnees mockees."
          icon={ClipboardList}
          label="Demandes ouvertes"
          value={mockDashboardStats.openRequests}
        />
        <StatCard
          detail="Livrables en attente de revue ou correction."
          icon={PackageCheck}
          label="Livrables a suivre"
          value={mockDashboardStats.pendingDeliverables}
        />
        <StatCard
          detail="Signal produit pour les futurs controles serveur."
          icon={LockKeyhole}
          label="Projets restreints"
          value={mockDashboardStats.restrictedProjects}
        />
      </section>

      <Card className="border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-amber-950">
            Limite de securite MVP
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900">{mockDataNotice}</p>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        {operationQueues.map((queue) => (
          <a
            className="group rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-blue-200"
            href={queue.href}
            key={queue.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-blue-700">
                  File operationnelle
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950">
                  {queue.label}
                </h2>
              </div>
              <span className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                {queue.value}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{queue.detail}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
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

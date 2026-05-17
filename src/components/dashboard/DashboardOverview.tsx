import { ClipboardList, FolderKanban, LockKeyhole, PackageCheck } from "lucide-react";

import { DeliverableList, ProjectList, RequestList } from "@/components/dashboard/WorkspaceLists";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { mockDashboardStats, mockDataNotice } from "@/lib/mock-data";

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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <RequestList />
        <ProjectList />
      </section>

      <DeliverableList />
    </div>
  );
}

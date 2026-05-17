import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, ShieldCheck, UserCog, UserRound, UsersRound } from "lucide-react";

import { DeliverableList, ProjectList, RequestList } from "@/components/dashboard/WorkspaceLists";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { mockDashboardStats } from "@/lib/mock-data";
import type { Role } from "@/types/roles";

type RoleWorkspaceProps = {
  role: Role;
};

type RoleConfig = {
  title: string;
  description: string;
  icon: LucideIcon;
  focus: string[];
  metrics: Array<{
    label: string;
    value: string | number;
    detail: string;
    icon: LucideIcon;
  }>;
};

const roleConfigs: Record<Role, RoleConfig> = {
  admin: {
    title: "Vue admin simple",
    description:
      "Espace statique pour preparer les futurs controles, sans droits reels ni console sensible.",
    icon: UserCog,
    focus: [
      "Surveiller les roles et organisations fictifs",
      "Identifier les projets a confidentialite restreinte",
      "Preparer la future journalisation des acces",
    ],
    metrics: [
      {
        detail: "Signal mock pour les futurs droits d'acces.",
        icon: ShieldCheck,
        label: "Projets restreints",
        value: mockDashboardStats.restrictedProjects,
      },
      {
        detail: "Vues statiques sans gestion utilisateur reelle.",
        icon: UserCog,
        label: "Roles simules",
        value: 4,
      },
    ],
  },
  client: {
    title: "Espace client",
    description:
      "Vue mockee pour suivre les demandes, projets et livrables associes a un client fictif.",
    icon: UserRound,
    focus: [
      "Creer une demande structuree",
      "Suivre les statuts de projets",
      "Lire les retours sans exposer de fichier sensible",
    ],
    metrics: [
      {
        detail: "Demandes fictives encore ouvertes.",
        icon: ClipboardCheck,
        label: "Demandes suivies",
        value: mockDashboardStats.openRequests,
      },
      {
        detail: "Livrables non definitifs visibles en demo.",
        icon: ShieldCheck,
        label: "A valider",
        value: mockDashboardStats.pendingDeliverables,
      },
    ],
  },
  drafter: {
    title: "Espace dessinateur",
    description:
      "Vue statique pour comprendre les demandes assignees et les livrables attendus.",
    icon: ShieldCheck,
    focus: [
      "Consulter les briefs assignes",
      "Produire des livrables fictifs",
      "Centraliser les retours de correction",
    ],
    metrics: [
      {
        detail: "Projets fictifs avec dessinateur assigne.",
        icon: ClipboardCheck,
        label: "Assignations",
        value: 2,
      },
      {
        detail: "Livrables en revue ou correction.",
        icon: ShieldCheck,
        label: "En revue",
        value: mockDashboardStats.pendingDeliverables,
      },
    ],
  },
  project_manager: {
    title: "Espace chef de projet",
    description:
      "Vue mockee pour coordonner demandes, priorites, assignations et validations.",
    icon: UsersRound,
    focus: [
      "Qualifier les demandes entrantes",
      "Prioriser les corrections",
      "Suivre les livrables avant validation client",
    ],
    metrics: [
      {
        detail: "Demandes fictives a coordonner.",
        icon: ClipboardCheck,
        label: "Demandes actives",
        value: mockDashboardStats.openRequests,
      },
      {
        detail: "Projets avec statut non archive.",
        icon: UsersRound,
        label: "Projets suivis",
        value: mockDashboardStats.activeProjects,
      },
    ],
  },
};

export function RoleWorkspace({ role }: RoleWorkspaceProps) {
  const config = roleConfigs[role];
  const Icon = config.icon;

  return (
    <div className="grid gap-6">
      <Card className="bg-neutral-950 text-white">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="flex size-12 items-center justify-center rounded-md bg-white text-neutral-950">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-normal">
              {config.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              {config.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {config.focus.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-neutral-200"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {config.metrics.map((metric) => (
          <StatCard
            detail={metric.detail}
            icon={metric.icon}
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
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

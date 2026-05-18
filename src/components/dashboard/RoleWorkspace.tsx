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
    title: "Espace admin",
    description:
      "Vue de gouvernance pour anticiper les roles, les projets sensibles et les futures regles d'acces. Aucun privilege reel n'est actif dans cette V1.",
    icon: UserCog,
    focus: [
      "Visualiser les roles et organisations de demo",
      "Identifier les projets qui demanderont un cloisonnement strict",
      "Preparer la future journalisation des acces fichiers",
    ],
    metrics: [
      {
        detail: "Projets de demo ou les droits devront etre stricts.",
        icon: ShieldCheck,
        label: "Projets restreints",
        value: mockDashboardStats.restrictedProjects,
      },
      {
        detail: "Roles presentes pour valider le modele produit.",
        icon: UserCog,
        label: "Roles simules",
        value: 4,
      },
    ],
  },
  client: {
    title: "Espace client",
    description:
      "Vue client pour comprendre ou en sont les demandes, quels livrables restent a relire et quelles informations sont attendues.",
    icon: UserRound,
    focus: [
      "Cadrer une nouvelle demande sans envoyer de fichier reel",
      "Suivre les statuts des projets et corrections",
      "Retrouver les livrables attendus et les retours associes",
    ],
    metrics: [
      {
        detail: "Demandes de demo en cours de traitement.",
        icon: ClipboardCheck,
        label: "Demandes suivies",
        value: mockDashboardStats.openRequests,
      },
      {
        detail: "Livrables fictifs a relire ou corriger.",
        icon: ShieldCheck,
        label: "A valider",
        value: mockDashboardStats.pendingDeliverables,
      },
    ],
  },
  drafter: {
    title: "Espace dessinateur",
    description:
      "Vue de production pour lire le brief, comprendre le contexte projet et suivre les livrables attendus.",
    icon: ShieldCheck,
    focus: [
      "Lire les demandes assignees avec leur priorite",
      "Comprendre les formats et corrections attendus",
      "Suivre les retours sans manipuler de fichier reel",
    ],
    metrics: [
      {
        detail: "Demandes demo attribuees au role dessinateur.",
        icon: ClipboardCheck,
        label: "Assignations",
        value: 2,
      },
      {
        detail: "Livrables fictifs en attente de retour.",
        icon: ShieldCheck,
        label: "En revue",
        value: mockDashboardStats.pendingDeliverables,
      },
    ],
  },
  project_manager: {
    title: "Espace chef de projet",
    description:
      "Vue de coordination pour qualifier les demandes, prioriser les corrections et preparer les validations client.",
    icon: UsersRound,
    focus: [
      "Qualifier les demandes avant production",
      "Arbitrer les priorites et les delais",
      "Controler les livrables avant retour client",
    ],
    metrics: [
      {
        detail: "Demandes demo a cadrer ou suivre.",
        icon: ClipboardCheck,
        label: "Demandes actives",
        value: mockDashboardStats.openRequests,
      },
      {
        detail: "Projets demo encore actifs dans le suivi.",
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
      <Card className="technical-grid-dark overflow-hidden bg-slate-950 text-white">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="flex size-12 items-center justify-center rounded-md bg-white text-slate-950">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-normal">
              {config.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {config.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {config.focus.map((item) => (
              <div
                className="rounded-md border border-white/10 bg-white/[0.07] p-4 text-sm leading-6 text-slate-200 backdrop-blur"
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

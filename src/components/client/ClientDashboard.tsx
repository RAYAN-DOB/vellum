import {
  ArrowUpRight,
  FilePlus2,
  FolderKanban,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
  type ProjectListItem,
} from "@/lib/projects";
import type { SessionUser } from "@/lib/auth";

type Props = {
  user: SessionUser;
  projects: ProjectListItem[];
  unreadMessages: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ClientDashboard({ user, projects, unreadMessages }: Props) {
  const activeProjects = projects.filter(
    (p) => !["delivered", "archived", "cancelled"].includes(p.status),
  );
  const lastProject = projects[0];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[6px] border border-[#d8d0bf] bg-white/85 p-5 shadow-[0_24px_70px_rgba(22,21,18,0.07)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
            Projets actifs
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#171613]">
            {activeProjects.length}
          </p>
          <p className="mt-1 text-xs text-[#6b665a]">
            En qualification, production ou validation
          </p>
        </div>
        <div className="rounded-[6px] border border-[#d8d0bf] bg-white/85 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
            Messages non lus
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#171613]">
            {unreadMessages}
          </p>
          <p className="mt-1 text-xs text-[#6b665a]">
            Notifications projets entrantes
          </p>
        </div>
        <div className="rounded-[6px] border border-[#d8d0bf] bg-white/85 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
            Total projets
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#171613]">
            {projects.length}
          </p>
          <p className="mt-1 text-xs text-[#6b665a]">
            Toutes phases confondues
          </p>
        </div>
      </section>

      <section className="rounded-[6px] border border-[#d8d0bf] bg-white/85 p-6 shadow-[0_24px_70px_rgba(22,21,18,0.07)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7a5f]">
              Action principale
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#171613]">
              Bonjour {user.profile.full_name ?? "client"}, prêt à déposer un
              nouveau projet ?
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[#6b665a]">
              Décrivez votre besoin, joignez vos plans, et notre équipe vous
              qualifie sous 24h ouvrées.
            </p>
          </div>
          <Button asChild size="lg" icon={<FilePlus2 className="size-4" />}>
            <a href="/client/nouveau-projet">Nouveau projet</a>
          </Button>
        </div>
      </section>

      <section>
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#171613]">
            Vos projets récents
          </h2>
          <a
            href="/client/projets"
            className="inline-flex items-center gap-1 text-sm text-[#6b665a] hover:text-[#171613]"
          >
            Voir tout
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </header>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-2">
            {projects.slice(0, 5).map((project) => (
              <li key={project.id}>
                <a
                  href={`/client/projets/${project.id}`}
                  className="flex flex-col gap-3 rounded-[4px] border border-[#d8d0bf] bg-white/95 p-4 transition hover:border-[#171613] hover:shadow-[0_18px_40px_rgba(22,21,18,0.10)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b665a]">
                      <span className="font-mono text-[11px]">
                        {project.reference}
                      </span>
                      <StatusPill tone={projectStatusTone[project.status]}>
                        {projectStatusLabels[project.status]}
                      </StatusPill>
                      <StatusPill
                        tone={
                          project.confidentiality === "restricted"
                            ? "red"
                            : project.confidentiality === "nda_required"
                              ? "amber"
                              : "neutral"
                        }
                      >
                        <ShieldCheck className="size-3" aria-hidden />
                        {confidentialityLabels[project.confidentiality]}
                      </StatusPill>
                    </div>
                    <p className="mt-1.5 truncate font-medium text-[#171613]">
                      {project.title}
                    </p>
                    {project.description ? (
                      <p className="mt-1 line-clamp-1 text-xs text-[#6b665a]">
                        {project.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-xs text-[#6b665a]">
                    <span>Créé le {formatDate(project.created_at)}</span>
                    <ArrowUpRight className="size-4 text-[#8a7a5f]" aria-hidden />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lastProject ? (
        <section className="rounded-[6px] border border-[#d8d0bf] bg-[#f8f5ed] p-5">
          <header className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
            <FolderKanban className="size-4" aria-hidden />
            Continuer
          </header>
          <p className="mt-2 text-sm text-[#171613]">
            Reprendre <strong className="font-semibold">{lastProject.title}</strong>{" "}
            ({projectStatusLabels[lastProject.status]})
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="primary" size="sm">
              <a href={`/client/projets/${lastProject.id}`}>Ouvrir le projet</a>
            </Button>
            <Button asChild variant="outline" size="sm" icon={<MessageSquare className="size-3.5" />}>
              <a href={`/client/projets/${lastProject.id}#messages`}>
                Envoyer un message
              </a>
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[6px] border border-dashed border-[#d8d0bf] bg-white/70 p-8 text-center">
      <FolderKanban
        className="mx-auto size-8 text-[#8a7a5f]"
        aria-hidden
      />
      <p className="mt-3 text-sm font-medium text-[#171613]">
        Aucun projet pour le moment
      </p>
      <p className="mx-auto mt-1 max-w-md text-xs text-[#6b665a]">
        Démarrez votre premier projet en quelques minutes : décrivez votre
        besoin, joignez vos plans, et notre équipe prend le relais.
      </p>
      <div className="mt-4">
        <Button asChild icon={<FilePlus2 className="size-4" />}>
          <a href="/client/nouveau-projet">Déposer un projet</a>
        </Button>
      </div>
    </div>
  );
}

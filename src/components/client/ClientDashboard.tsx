import {
  ArrowRight,
  ArrowUpRight,
  FilePlus2,
  FolderOpen,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  confidentialityLabels,
  projectStatusLabels,
  projectStatusTone,
  type ProjectListItem,
} from "@/lib/project-display";
import { routes } from "@/lib/routes";
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
  const recentProjects = projects.slice(0, 5);
  const lastProject = projects[0];
  const firstName = (user.profile.full_name ?? user.email).split(" ")[0];

  const actionNeeded = projects.filter(
    (p) => p.status === "review" || p.status === "draft",
  );
  const atVellumCount = projects.filter((p) =>
    ["intake", "qualified", "assigned", "in_progress"].includes(p.status),
  ).length;
  const hasTodo = actionNeeded.length > 0 || unreadMessages > 0;

  return (
    <div className="space-y-12">
      {/* Hero band — primary CTA */}
      <section className="relative overflow-hidden rounded-[4px] border border-line bg-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-paper opacity-40"
        />
        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-xl">
            <p className="caption">Nouveau dépôt</p>
            <h2 className="display mt-4 text-3xl text-ink sm:text-[2.5rem]">
              Bonjour {firstName},
              <br />
              <span className="italic">déposons vos plans.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-graphite">
              Décrivez votre besoin, joignez vos plans et suivez ensuite les
              questions, le devis, les aperçus, les corrections et les
              livrables.
            </p>
          </div>
          <a
            href={routes.client.newProject}
            className="cta-premium group inline-flex h-12 cursor-pointer items-center justify-center gap-2 self-start rounded-full px-6 text-[14px] font-medium text-paper lg:self-end"
          >
            <FilePlus2 className="size-4" aria-hidden="true" />
            Nouveau dépôt
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </section>

      {/* À traiter — what needs the client right now (never-blocked cockpit) */}
      <section>
        <header className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="display text-2xl text-ink">À traiter</h2>
          {atVellumCount > 0 ? (
            <span className="caption">
              {atVellumCount}{" "}
              {atVellumCount > 1 ? "projets en cours" : "projet en cours"} chez
              Vellum
            </span>
          ) : null}
        </header>

        {hasTodo ? (
          <Reveal as="ul" stagger className="mt-6 grid gap-3">
            {unreadMessages > 0 ? (
              <Reveal as="li" item>
                <a
                  href={routes.client.messages}
                  className="lift group flex items-center justify-between gap-3 rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <MessageSquare
                      className="size-5 shrink-0 text-pine"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-lg text-ink">
                        {unreadMessages} message{unreadMessages > 1 ? "s" : ""} à
                        lire
                      </span>
                      <span className="block text-[13px] text-mute">
                        Le dessinateur attend peut-être votre réponse.
                      </span>
                    </span>
                  </span>
                  <span className="caption inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--pine)_35%,var(--paper))] bg-pine-tint px-3 py-1 text-pine-active">
                    Répondre
                  </span>
                </a>
              </Reveal>
            ) : null}
            {actionNeeded.map((project) => {
              const isReview = project.status === "review";
              return (
                <Reveal as="li" item key={project.id}>
                  <a
                    href={routes.client.project(project.id)}
                    className="lift group flex flex-col gap-3 rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0">
                      <span className="font-mono text-[11px] text-mute">
                        {project.reference ?? "—"}
                      </span>
                      <span className="mt-1 block truncate font-display text-lg text-ink">
                        {project.title}
                      </span>
                      <span className="block text-[13px] text-mute">
                        {isReview
                          ? "Un aperçu vous attend : à valider ou à corriger."
                          : "Dépôt incomplet : finalisez-le pour démarrer."}
                      </span>
                    </span>
                    <span className="caption inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-[color-mix(in_srgb,var(--pine)_35%,var(--paper))] bg-pine-tint px-3 py-1 text-pine-active sm:self-center">
                      {isReview ? "Valider l'aperçu" : "Compléter le dépôt"}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </Reveal>
        ) : (
          <div className="mt-6 rounded-[3px] border border-dashed border-line-strong bg-vellum/30 p-8 text-center">
            <ShieldCheck
              className="mx-auto size-6 text-pine"
              aria-hidden="true"
            />
            <p className="mt-3 font-display text-xl text-ink">
              Rien à traiter pour l'instant.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-[1.6] text-mute">
              Vous êtes à jour. Nous vous prévenons dès qu'une action vous
              attend de votre côté.
            </p>
          </div>
        )}
      </section>

      {/* Stat row */}
      <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
        <StatCell label="Projets actifs" value={activeProjects.length} hint="Dossiers en analyse, correction ou validation" />
        <StatCell label="Messages du dessinateur" value={unreadMessages} hint="Questions et réponses à traiter" />
        <StatCell label="Dossiers projet" value={projects.length} hint="Demandes déposées dans votre espace" />
      </section>

      {/* Recent projects */}
      <section>
        <header className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="display text-2xl text-ink">Vos projets récents</h2>
          <a
            href={routes.client.projects}
            className="caption inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-ink"
          >
            Voir tout
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </header>

        {recentProjects.length === 0 ? (
          <DashboardEmptyState />
        ) : (
          <Reveal as="ul" stagger className="mt-6 grid gap-3">
            {recentProjects.map((project) => (
              <Reveal as="li" item key={project.id}>
                <a
                  href={routes.client.project(project.id)}
                  className="lift group flex flex-col gap-3 rounded-[3px] border border-line bg-paper p-5 transition-colors hover:border-ink hover:bg-vellum/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-mute">
                        {project.reference ?? "—"}
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
                        <ShieldCheck className="size-3" aria-hidden="true" />
                        {confidentialityLabels[project.confidentiality]}
                      </StatusPill>
                    </div>
                    <p className="mt-2 truncate font-display text-lg text-ink">
                      {project.title}
                    </p>
                    {project.description ? (
                      <p className="mt-1 line-clamp-1 text-[13px] text-mute">
                        {project.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-[12px] text-mute">
                    <span>Créé le {formatDate(project.created_at)}</span>
                    <ArrowUpRight
                      className="size-4 text-mute transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </Reveal>
            ))}
          </Reveal>
        )}
      </section>

      {/* Continue last project */}
      {lastProject ? (
        <Reveal as="section" className="rounded-[4px] border border-line bg-vellum/40 p-6">
          <p className="caption">Reprendre</p>
          <p className="mt-3 text-[15px] text-ink">
            <strong className="font-medium">{lastProject.title}</strong>
            <span className="text-mute">
              {" "}
              · {projectStatusLabels[lastProject.status]}
            </span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={routes.client.project(lastProject.id)}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
            >
              Ouvrir le projet
            </a>
            <a
              href={`${routes.client.project(lastProject.id)}#messages`}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line-strong px-5 text-[13px] font-medium text-graphite transition hover:border-ink hover:text-ink"
            >
              <MessageSquare className="size-3.5" aria-hidden="true" />
              Envoyer un message
            </a>
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}

function StatCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="bg-paper p-6">
      <p className="caption">{label}</p>
      <p className="font-display mt-3 text-4xl leading-none text-ink">
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </p>
      {hint ? <p className="mt-2 text-[12px] text-mute">{hint}</p> : null}
    </div>
  );
}

function DashboardEmptyState() {
  return (
    <div className="mt-6 rounded-[3px] border border-dashed border-line-strong bg-paper p-10 text-center">
      <FolderOpen className="mx-auto size-7 text-mute" aria-hidden="true" />
      <p className="mt-4 font-display text-xl text-ink">
        Aucun projet pour le moment.
      </p>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-[1.6] text-mute">
        Démarrez votre premier projet en quelques minutes : décrivez votre
        besoin, joignez vos plans, nous prenons le relais.
      </p>
      <a
        href={routes.client.newProject}
        className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
      >
        <FilePlus2 className="size-4" aria-hidden="true" />
        Déposer un projet
      </a>
    </div>
  );
}

import {
  FilePlus2,
  Home,
  LayoutDashboard,
  ShieldCheck,
  UserCog,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { roleNavigation, routes, workspaceNavigation } from "@/lib/routes";

type AppShellProps = {
  activeHref: string;
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

const roleIcons = {
  [routes.roles.client]: UserRound,
  [routes.roles.projectManager]: UsersRound,
  [routes.roles.drafter]: ShieldCheck,
  [routes.roles.admin]: UserCog,
} as const;

const workspaceIcons = {
  [routes.workspace.dashboard]: LayoutDashboard,
  [routes.workspace.newRequest]: FilePlus2,
} as const;

export function AppShell({
  activeHref,
  eyebrow = "Workspace MVP",
  title,
  description,
  children,
  actions,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <a className="flex items-center gap-3" href={routes.public.home}>
            <span className="flex size-9 items-center justify-center rounded-md bg-neutral-950 text-sm font-semibold text-white">
              PW
            </span>
            <span>
              <span className="block text-sm font-semibold">PlanWork</span>
              <span className="hidden text-xs text-neutral-500 sm:block">
                Espace MVP statique
              </span>
            </span>
          </a>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-950"
            href={routes.public.home}
          >
            <Home className="size-4" aria-hidden="true" />
            Accueil public
          </a>
        </Container>
      </header>

      <Container className="grid gap-6 py-6 lg:grid-cols-[260px_1fr] lg:py-8">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav
            aria-label="Navigation interne"
            className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
          >
            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-normal text-neutral-500">
              Operations
            </div>
            <div className="grid gap-1">
              {workspaceNavigation.map((item) => {
                const Icon = workspaceIcons[item.href];

                return (
                  <a
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      activeHref === item.href
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-normal text-neutral-500">
              Vues par role
            </div>
            <div className="grid gap-1">
              {roleNavigation.map((item) => {
                const Icon = roleIcons[item.href];

                return (
                  <a
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      activeHref === item.href
                        ? "bg-blue-700 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              MVP sans auth reelle : ces vues simulent les futurs roles et ne
              remplacent pas les controles serveur.
            </div>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-blue-700">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-neutral-950">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                {description}
              </p>
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>

          {children}
        </main>
      </Container>
    </div>
  );
}

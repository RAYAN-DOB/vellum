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
import { BorderBeam } from "@/components/ui/BorderBeam";
import { cn } from "@/lib/utils";
import {
  roleNavigation,
  routes,
  workspaceNavigation,
  workspaceSecondaryNavigation,
} from "@/lib/routes";

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
  eyebrow = "Demo V1",
  title,
  description,
  children,
  actions,
}: AppShellProps) {
  return (
    <div className="technical-grid min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-white/10 bg-slate-950 text-white">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <a className="flex items-center gap-3" href={routes.public.home}>
            <span className="flex size-9 items-center justify-center rounded-md border border-blue-300/30 bg-blue-500 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.35)]">
              PW
            </span>
            <span>
              <span className="block text-sm font-semibold">PlanWork</span>
              <span className="hidden text-xs text-slate-400 sm:block">
                Demo secure project ops
              </span>
            </span>
          </a>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
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
            className="rounded-lg border border-slate-200/80 bg-white/90 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-normal text-slate-500">
              Pilotage
            </div>
            <div className="grid gap-1">
              {workspaceNavigation.map((item) => {
                const Icon = workspaceIcons[item.href];

                return (
                  <a
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                      activeHref === item.href
                        ? "bg-slate-950 text-white shadow-[0_12px_25px_rgba(15,23,42,0.16)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
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

            <div className="mt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-normal text-slate-500">
              Exemples
            </div>
            <div className="grid gap-1">
              {workspaceSecondaryNavigation.map((item) => (
                <a
                  aria-current={activeHref === item.href ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                    activeHref === item.href
                      ? "bg-slate-950 text-white shadow-[0_12px_25px_rgba(15,23,42,0.16)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-5 px-3 pb-2 text-xs font-semibold uppercase tracking-normal text-slate-500">
              Espaces metier
            </div>
            <div className="grid gap-1">
              {roleNavigation.map((item) => {
                const Icon = roleIcons[item.href];

                return (
                  <a
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                      activeHref === item.href
                        ? "bg-blue-700 text-white shadow-[0_12px_25px_rgba(29,78,216,0.22)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
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
              V1 front statique : les vues simulent les futurs roles, sans auth
              ni controle serveur.
            </div>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="relative mb-6 flex flex-col gap-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-5 text-white shadow-[0_25px_70px_rgba(15,23,42,0.22)] sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <BorderBeam className="opacity-45" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-blue-300">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-white">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
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

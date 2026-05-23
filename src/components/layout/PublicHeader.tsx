import { ArrowRight } from "lucide-react";

import { publicNavigation, routes } from "@/lib/routes";

export function PublicHeader() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-3 sm:top-5">
      <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-3 rounded-full border border-[#f8f4ea]/12 bg-[#0b0b09]/86 px-2.5 py-2 text-[#f8f4ea] shadow-[0_18px_70px_rgba(0,0,0,0.34)] ring-1 ring-white/[0.04] backdrop-blur-2xl sm:px-3">
        <a
          className="group flex min-w-0 items-center gap-3 rounded-full py-1 pl-1 pr-2"
          href={routes.public.home}
          aria-label="Retour a l'accueil"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#f8f4ea]/18 bg-[#f8f4ea] text-sm font-semibold text-[#171613] shadow-sm">
            PW
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold tracking-normal">
              PlanWork
            </span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 rounded-full border border-[#f8f4ea]/8 bg-[#f8f4ea]/6 p-1 md:flex"
        >
          {publicNavigation.map((item) => (
            <a
              className="rounded-full px-3 py-1.5 text-sm font-medium text-[#cfc6b5] transition-colors hover:bg-[#f8f4ea]/10 hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f8f4ea] px-4 text-sm font-semibold text-[#171613] shadow-[0_12px_35px_rgba(248,244,234,0.16)] transition hover:bg-white"
          href={routes.roles.clientNewProject}
        >
          <span className="hidden sm:inline">Deposer un projet</span>
          <span className="sm:hidden">Depot</span>
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </header>
  );
}

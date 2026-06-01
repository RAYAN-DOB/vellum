import { ArrowRight } from "lucide-react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { publicNavigation, routes } from "@/lib/routes";

export function PublicHeader() {
  return (
    <header className="fixed inset-x-3 top-4 z-50 sm:top-5">
      <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-2 rounded-full border border-white/8 bg-ink/90 px-3 py-2 text-paper shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:gap-3 sm:px-3.5">
        <a
          className="group flex min-w-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-1 sm:gap-3 sm:pr-2"
          href={routes.public.home}
          aria-label="Vellum — retour à l'accueil"
        >
          <VellumLogo size="sm" tone="paper" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-base leading-none text-paper">
              Vellum
            </span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-0.5 md:flex"
        >
          {publicNavigation.map((item) => (
            <a
              className="cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium text-paper/70 transition-colors hover:bg-white/8 hover:text-paper"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            className="hidden h-10 cursor-pointer items-center justify-center rounded-full px-3.5 text-[13px] font-medium text-paper/70 transition hover:text-paper sm:inline-flex"
            href={routes.public.login}
          >
            Connexion
          </a>
          <a
            className="group inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#9f4f38] px-4 text-[13px] font-semibold text-paper transition hover:bg-[#7b3828]"
            href={routes.public.deposit}
          >
            <span>Déposer un projet</span>
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Le procédé", href: "/#procede" },
  { label: "Prestations", href: "/#prestations" },
  { label: "Tarifs", href: "/#estimer" },
] as const;

/**
 * Public header — a dark floating bar that hovers over the page with a soft
 * shadow ("planant") and stays fixed on scroll across every public page. No
 * pointer-tilt, no light-sweep (removed per feedback). The "Déposer un projet"
 * CTA keeps its premium emerald→cyan gradient, now static (no slide).
 */
export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:top-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border border-white/10 bg-ink/85 px-3.5 py-2.5 text-paper shadow-[0_26px_64px_-26px_rgba(0,0,0,0.7),0_10px_28px_-14px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:gap-3">
        {/* Logo */}
        <Link
          href={routes.public.home}
          aria-label="Vellum — retour à l'accueil"
          className="flex min-w-0 items-center gap-2.5 rounded-full pl-1.5 pr-1"
        >
          <VellumLogo size="sm" tone="paper" />
          <span className="font-display text-[1.05rem] leading-none text-paper">
            Vellum
          </span>
        </Link>

        {/* Nav */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-paper/70 transition-colors hover:bg-white/10 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href={routes.public.login}
            className="hidden px-2.5 text-[13px] font-medium text-paper/70 transition-colors hover:text-paper sm:inline"
          >
            Connexion
          </Link>
          <Link
            href={routes.public.deposit}
            className="cta-premium group hidden h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-paper sm:inline-flex"
          >
            Déposer un projet
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          {/* Mobile */}
          <Link
            href={routes.public.deposit}
            className="cta-premium inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold text-paper sm:hidden"
          >
            Déposer
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex size-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-paper" />
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-paper" />
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-paper" />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-5xl overflow-hidden rounded-[16px] border border-white/10 bg-ink/92 text-paper backdrop-blur-xl transition-all duration-300 md:hidden",
          open
            ? "max-h-72 opacity-100 shadow-[0_24px_60px_-26px_rgba(0,0,0,0.7)]"
            : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-2.5 text-[14px] font-medium text-paper/75 hover:bg-white/10 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={routes.public.login}
            onClick={() => setOpen(false)}
            className="rounded-full px-3 py-2.5 text-[14px] font-medium text-paper/75"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}

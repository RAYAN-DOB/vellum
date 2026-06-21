"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Le procédé", href: "/#procede", id: "procede" },
  { label: "Prestations", href: "/#prestations", id: "prestations" },
  { label: "Tarifs", href: "/#estimer", id: "estimer" },
] as const;

/**
 * Public header — a dark floating bar that hovers over the page ("planant") and
 * stays fixed on scroll across every public page. It reacts to the page:
 *  - airy + faint rail at the top of the (dark) hero, more defined once scrolled;
 *  - a scroll-spy lights the section you're reading with the pine→cyan signature.
 * The "Déposer un projet" CTA keeps its static emerald→cyan gradient.
 */
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Condense the bar once the page leaves the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy — highlight whichever nav section is currently in view (home only;
  // gracefully inert on pages where these sections don't exist).
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:top-4">
      <div
        className={cn(
          "relative mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border px-3.5 py-2.5 text-paper backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:gap-3",
          scrolled
            ? "border-white/15 bg-ink/90 shadow-[0_26px_64px_-26px_rgba(0,0,0,0.75),0_10px_28px_-14px_rgba(0,0,0,0.6)]"
            : "border-white/10 bg-ink/70 shadow-[0_20px_52px_-30px_rgba(0,0,0,0.6)]",
        )}
      >
        {/* pine→cyan light rail along the bottom edge (Neo-Atelier signature) */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-7 bottom-0 h-px bg-[image:var(--gradient-pine-cyan)] transition-opacity duration-500",
            scrolled ? "opacity-55" : "opacity-25",
          )}
        />

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
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-0.5 md:flex"
        >
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.08] text-paper"
                    : "text-paper/70 hover:bg-white/[0.06] hover:text-paper",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3.5 bottom-1 h-px rounded-full bg-[image:var(--gradient-pine-cyan)] transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
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
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="relative flex size-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-[1.5px] w-5 bg-paper transition-transform duration-300",
                open && "translate-y-[6.5px] rotate-45",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "h-[1.5px] w-5 bg-paper transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "h-[1.5px] w-5 bg-paper transition-transform duration-300",
                open && "-translate-y-[6.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-5xl overflow-hidden rounded-[18px] border border-white/10 bg-ink/92 text-paper backdrop-blur-xl transition-all duration-300 md:hidden",
          open
            ? "max-h-72 opacity-100 shadow-[0_24px_60px_-26px_rgba(0,0,0,0.7)]"
            : "pointer-events-none max-h-0 border-transparent opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2.5 text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.08] text-paper"
                    : "text-paper/75 hover:bg-white/10 hover:text-paper",
                )}
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-cyan"
                  />
                ) : null}
                {item.label}
              </Link>
            );
          })}
          <Link
            href={routes.public.login}
            onClick={() => setOpen(false)}
            className="rounded-full px-3 py-2.5 text-[14px] font-medium text-paper/75 transition-colors hover:bg-white/10 hover:text-paper"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { label: "Le procédé", href: "/#procede" },
  { label: "Prestations", href: "/#prestations" },
  { label: "Tarifs", href: "/#estimer" },
  { label: "FAQ", href: "/#faq" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative px-1 py-2 text-[13px] font-medium text-graphite transition-colors hover:text-ink"
    >
      {label}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-200 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}

export function PublicHeader() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 80);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "relative transition-colors duration-300",
          scrolled ? "bg-paper/85 backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Left lockup — logo + atelier micro-caption */}
          <Link
            href={routes.public.home}
            aria-label="Vellum — retour à l'accueil"
            className="flex min-w-0 items-center gap-2.5"
          >
            <VellumLogo size="sm" tone="ink" />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-[1.05rem] text-ink">Vellum</span>
              <span className="caption mt-1 hidden text-[9px] text-soft sm:block">
                Cabinet d&apos;études · Plans techniques
              </span>
            </span>
          </Link>

          {/* Center nav */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-6 md:flex"
          >
            {NAV.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href={routes.public.login}
              className="draft-link hidden text-[13px] font-medium text-graphite hover:text-ink sm:inline"
            >
              Connexion
            </Link>
            <Link
              href={routes.public.deposit}
              className="group relative hidden h-10 cursor-pointer items-center gap-1.5 overflow-hidden rounded-[2px] bg-ink pl-4 pr-3.5 text-[13px] font-semibold text-paper transition hover:bg-graphite sm:inline-flex"
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-pine" />
              Déposer un projet
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            {/* Mobile: squared ink CTA + hamburger */}
            <Link
              href={routes.public.deposit}
              className="relative inline-flex h-10 items-center rounded-[2px] bg-ink px-3.5 text-[13px] font-semibold text-paper sm:hidden"
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-pine" />
              Déposer
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              className="flex size-10 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span aria-hidden="true" className="h-[1.5px] w-5 bg-ink" />
              <span aria-hidden="true" className="h-[1.5px] w-5 bg-ink" />
              <span aria-hidden="true" className="h-[1.5px] w-5 bg-ink" />
            </button>
          </div>
        </div>

        {/* self-drawing titleblock hairline under the bar */}
        <motion.span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left",
            scrolled ? "bg-line-strong" : "bg-line",
          )}
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        />
      </div>

      {/* Mobile sheet menu (always mounted, translated for robustness under React 19) */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/25 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-[80%] max-w-sm flex-col bg-paper shadow-[var(--shadow-e4)] transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-paper opacity-50" />
          <div className="relative flex items-center justify-between border-b border-line px-6 py-5">
            <VellumLogo size="sm" tone="ink" withWordmark />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="text-[24px] leading-none text-mute hover:text-ink"
            >
              ×
            </button>
          </div>
          <nav className="relative flex flex-col px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 font-display text-xl text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={routes.public.login}
              onClick={() => setOpen(false)}
              className="py-3.5 text-[14px] font-medium text-graphite"
            >
              Connexion
            </Link>
          </nav>
          <div className="relative mt-auto p-6">
            <Link
              href={routes.public.deposit}
              onClick={() => setOpen(false)}
              className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-[2px] bg-ink text-[14px] font-semibold text-paper"
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-pine" />
              Déposer un projet
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}

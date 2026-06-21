"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { Pill } from "@/components/atelier/Pill";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Le procédé", href: "/#procede" },
  { label: "Prestations", href: "/#prestations" },
  { label: "Tarifs", href: "/#estimer" },
] as const;

/**
 * Floating Neo-Atelier header — a frosted "calque" bar that hovers over the
 * paper: a fine emerald→cyan light-rail border, a slow light sweep, a few
 * degrees of pointer tilt (depth), and a gentle compression on scroll. Premium,
 * never dark-SaaS. Reduced-motion drops the tilt and freezes the sweep.
 */
export function PublicHeader() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  // Pointer micro-tilt — a couple of degrees, spring-damped.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [2.2, -2.2]), {
    stiffness: 150,
    damping: 20,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-3, 3]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }
  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:top-4" style={{ perspective: 1000 }}>
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }
        }
        className={cn(
          "light-rail light-sweep mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border border-line/60 backdrop-blur-xl transition-[padding,box-shadow,background-color] duration-300 sm:gap-3",
          scrolled
            ? "bg-[color-mix(in_srgb,var(--calque)_88%,transparent)] px-3 py-1.5 shadow-[0_18px_50px_-22px_rgba(15,118,110,0.4),0_8px_24px_-16px_rgba(22,25,26,0.4)]"
            : "bg-[color-mix(in_srgb,var(--calque)_72%,transparent)] px-3.5 py-2.5 shadow-[0_24px_70px_-28px_rgba(15,118,110,0.34),0_10px_30px_-18px_rgba(22,25,26,0.34)]",
        )}
      >
        {/* Left — logo */}
        <Link
          href={routes.public.home}
          aria-label="Vellum — retour à l'accueil"
          className="flex min-w-0 items-center gap-2.5 rounded-full pl-1.5 pr-1"
        >
          <VellumLogo size="sm" tone="ink" />
          <span className="font-display text-[1.05rem] leading-none text-ink">
            Vellum
          </span>
        </Link>

        {/* Center — nav pills */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full">
              <Pill tone="pine" size="sm">
                {item.label}
              </Pill>
            </Link>
          ))}
        </nav>

        {/* Right — connexion + premium CTA */}
        <div className="flex items-center gap-1.5">
          <Link
            href={routes.public.login}
            className="draft-link hidden px-2 text-[13px] font-medium text-graphite hover:text-ink sm:inline"
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

          {/* Mobile: compact CTA + menu toggle */}
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
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-ink" />
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-ink" />
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-ink" />
          </button>
        </div>
      </motion.div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-5xl overflow-hidden rounded-[14px] border border-line/60 bg-[color-mix(in_srgb,var(--calque)_94%,transparent)] backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "max-h-72 opacity-100 shadow-[var(--shadow-e3)]" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-2.5 text-[14px] font-medium text-graphite hover:bg-pine-tint/50 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={routes.public.login}
            onClick={() => setOpen(false)}
            className="rounded-full px-3 py-2.5 text-[14px] font-medium text-graphite"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}

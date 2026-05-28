import type { ReactNode } from "react";

import { VellumLogo } from "@/components/brand/VellumLogo";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-abyss text-paper">
      {/* Background effects */}
      <div className="absolute inset-0 grid-subtle" />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-0 left-1/3 w-[600px] h-[600px] opacity-30 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.3) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] opacity-20 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}
      />
      
      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-abyss to-transparent" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a
          href="/"
          className="inline-flex items-center gap-3 group"
          aria-label="Vellum — retour à l'accueil"
        >
          <VellumLogo size="sm" tone="gold" />
          <span className="font-display text-lg text-paper">Vellum</span>
        </a>
        <a
          href="/"
          className="text-sm text-silver transition-colors hover:text-paper"
        >
          ← Accueil
        </a>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20 lg:px-10 lg:pt-16">
        <section className="max-w-lg">
          <p className="caption text-gold">{eyebrow}</p>
          <h1 className="display mt-5 text-[clamp(2.5rem,5vw,4rem)]">
            <span className="text-paper">{title.split(" ").slice(0, -1).join(" ")}</span>{" "}
            <span className="italic text-gradient">{title.split(" ").slice(-1)[0]}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-silver">
            {subtitle}
          </p>

          <ul className="mt-12 space-y-4 border-t border-graphite pt-8">
            <li className="flex items-start gap-3 text-sm text-silver">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold/60" />
              <span>
                Comptes nominatifs par rôle : client, dessinateur, chef de
                projet, admin.
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-silver">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold/60" />
              <span>
                Cloisonnement strict par projet — Row-Level Security Postgres.
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-silver">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold/60" />
              <span>
                Audit complet des actions sensibles et journal des accès.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <div className="card-elevated rounded-2xl p-8 shine">
            {children}
            {footer ? (
              <div className="mt-8 border-t border-graphite pt-6 text-xs leading-5 text-dim">
                {footer}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

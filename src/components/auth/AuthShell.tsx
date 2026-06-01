import type { ReactNode } from "react";

import { VellumLogo } from "@/components/brand/VellumLogo";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  benefits?: readonly string[];
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  benefits = [
    "Suivre l'avancement de votre demande",
    "Répondre aux questions du dessinateur",
    "Recevoir les aperçus et demander des corrections",
    "Télécharger les livrables finaux",
  ],
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      {/* Drafting paper grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a
          href="/"
          className="inline-flex items-center gap-2.5"
          aria-label="Vellum — retour à l'accueil"
        >
          <VellumLogo size="sm" tone="ink" />
          <span className="font-display text-lg leading-none">Vellum</span>
        </a>
        <a
          href="/"
          className="caption text-mute transition-colors hover:text-ink"
        >
          ← Accueil
        </a>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20 lg:px-10 lg:pt-16">
        <section className="max-w-lg">
          <p className="caption">{eyebrow}</p>
          <h1 className="display mt-5 text-[clamp(2.5rem,5vw,4rem)] text-ink">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-[1.7] text-graphite">
            {subtitle}
          </p>

          <ul className="mt-12 space-y-4 border-t border-line pt-8 text-[14px] text-mute">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[7px] inline-block size-1 shrink-0 rounded-full bg-ink"
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="sheet rounded-[4px] p-6 sm:p-8">
            {children}
            {footer ? (
              <div className="mt-8 border-t border-line pt-6 text-[12px] leading-5 text-mute">
                {footer}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

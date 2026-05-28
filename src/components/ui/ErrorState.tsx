"use client";

import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export function ErrorState({
  title,
  description,
  error,
  unstable_retry,
}: {
  title: string;
  description: string;
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-abyss px-6 text-paper">
      <section className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-graphite bg-obsidian/80 p-8 text-center backdrop-blur-xl">
        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
        
        {/* Background grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-subtle opacity-40"
        />
        
        <div className="relative">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl border border-crimson/30 bg-crimson/10">
            <AlertTriangle className="size-6 text-crimson" aria-hidden="true" />
          </span>
          <p className="caption mt-6 text-crimson">Incident d&apos;affichage</p>
          <h1 className="display mt-3 text-4xl text-paper">{title}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-silver">
            {description}
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-dim">
              Référence: {error.digest}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              className="group relative inline-flex h-11 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-gold via-gold to-gold-deep px-6 text-sm font-semibold text-void transition-all hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]"
              onClick={() => unstable_retry()}
              type="button"
            >
              <RotateCcw className="size-4 relative z-10" aria-hidden="true" />
              <span className="relative z-10">Réessayer</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <a
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-graphite bg-slate/50 px-6 text-sm font-medium text-paper transition-colors hover:border-silver/30 hover:bg-slate"
              href="/"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Retour accueil
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

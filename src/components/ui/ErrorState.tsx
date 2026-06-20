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
    <main className="grid min-h-screen place-items-center bg-paper px-6 text-ink">
      <section className="relative w-full max-w-xl overflow-hidden rounded-[4px] border border-line bg-paper p-8 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-paper opacity-40"
        />
        <div className="relative">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-line-strong bg-vellum/70">
            <AlertTriangle className="size-6 text-crimson" aria-hidden="true" />
          </span>
          <p className="caption mt-6">Incident d'affichage</p>
          <h1 className="display mt-3 text-4xl text-ink">{title}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-graphite">
            {description}
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-[11px] text-mute">
              Référence: {error.digest}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper transition hover:bg-iron-hover"
              onClick={() => unstable_retry()}
              type="button"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Réessayer
            </button>
            <a
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-sm font-medium text-ink transition hover:border-ink"
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

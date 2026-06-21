"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, X } from "lucide-react";
import Link from "next/link";

import { depositPolicy, formatEuro } from "@/lib/business-config";
import { routes } from "@/lib/routes";

/**
 * SampleQuoteModal — lets a hesitant visitor SEE what a Vellum quote looks like
 * before depositing. The figures are a clearly-labelled illustrative example
 * (no real client data), computed through the real depositPolicy so the acompte
 * logic is truthful. Lightweight custom dialog (no dependency): Escape + overlay
 * close, focus moved into the panel on open.
 */

const SAMPLE = {
  ref: "VLM-2418",
  project: "Reprise de plan — appartement 3 pièces",
  items: [
    { label: "Analyse et relevé des corrections", pu: 120 },
    { label: "Mise en plan 2D cotée (DWG + PDF)", pu: 160 },
    { label: "Aperçu 3D axonométrique", pu: 90 },
  ],
  revisions: 2,
  delay: "5 jours ouvrés",
};

export function SampleQuoteModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const total = SAMPLE.items.reduce((sum, it) => sum + it.pu, 0);
  const policy = depositPolicy(total);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-pine transition-colors hover:text-pine-hover"
      >
        <FileText className="size-3.5" aria-hidden="true" />
        Voir un exemple de devis
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-quote-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-[6px] border border-line-strong bg-paper shadow-[var(--shadow-e4)]"
          >
            <header className="flex items-center justify-between gap-4 border-b border-line bg-vellum/40 px-5 py-3">
              <span className="caption">Devis · {SAMPLE.ref} · exemple</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex size-7 cursor-pointer items-center justify-center rounded-full text-mute transition-colors hover:bg-vellum hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div className="p-5 sm:p-6">
              <p className="caption">Projet</p>
              <h2
                id="sample-quote-title"
                className="mt-1 font-display text-xl text-ink"
              >
                {SAMPLE.project}
              </h2>

              <table className="mt-5 w-full text-sm">
                <tbody className="divide-y divide-line">
                  {SAMPLE.items.map((it) => (
                    <tr key={it.label}>
                      <td className="py-2.5 pr-3 text-ink">{it.label}</td>
                      <td className="py-2.5 text-right font-mono text-graphite">
                        {formatEuro(it.pu)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-line-strong">
                    <td className="py-3 text-right text-mute">Total</td>
                    <td className="py-3 text-right font-display text-xl text-ink">
                      {formatEuro(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line text-[13px]">
                <div className="bg-paper p-3">
                  <dt className="caption">Acompte ({Math.round(policy.rate * 100)}%)</dt>
                  <dd className="mt-1 font-mono text-ink">
                    {formatEuro(policy.deposit)}
                  </dd>
                </div>
                <div className="bg-paper p-3">
                  <dt className="caption">Solde à la livraison</dt>
                  <dd className="mt-1 font-mono text-ink">
                    {formatEuro(policy.balance)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-[12px] leading-[1.5] text-mute">
                {SAMPLE.revisions} révisions incluses · {SAMPLE.delay} ·
                Exemple illustratif — votre devis est établi par le dessinateur
                après lecture de vos fichiers.
              </p>

              <Link
                href={routes.public.deposit}
                onClick={() => setOpen(false)}
                className="group mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-pine px-6 text-[14px] font-medium text-paper transition hover:bg-pine-hover"
              >
                Déposer mon projet
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}

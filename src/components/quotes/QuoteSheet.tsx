"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ShieldCheck,
} from "lucide-react";

import {
  QUOTE_VALIDITY_DAYS,
  UPSELLS,
  depositPolicy,
  formatEuro,
  upsellPrice,
  type UpsellGroup,
} from "@/lib/business-config";
import {
  buildBreakdown,
  mockCheckoutUrl,
  STRIPE_READY,
  type PaymentChoice,
} from "@/lib/payments";
import { BlueprintGrid } from "@/components/atelier/BlueprintGrid";
import { StampBadge } from "@/components/atelier/StampBadge";
import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/types/database";

export type QuoteSheetData = {
  id: string;
  reference: string | null;
  projectId: string;
  projectTitle: string;
  status: QuoteStatus;
  createdAt: string;
  notes: string | null;
  items: {
    id: string;
    label: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  total: number;
};

const GROUP_LABELS: Record<UpsellGroup, string> = {
  delai: "Accélérer",
  fichiers: "Fichiers",
  service: "Aller plus loin",
};

const AFTER_PAYMENT = [
  "Le dessinateur démarre la production de votre dossier.",
  "Vous recevez un premier aperçu à valider.",
  "Vous pouvez demander une correction si besoin.",
  "Vous recevez la livraison finale, prête à l'emploi.",
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function QuoteSheet({ quote }: { quote: QuoteSheetData }) {
  const base = quote.total;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [choice, setChoice] = useState<PaymentChoice>("deposit");

  const upsells = UPSELLS.map((u) => ({ ...u, price: upsellPrice(u, base) }));
  const selectedUpsells = upsells
    .filter((u) => selected.has(u.id))
    .map((u) => ({ id: u.id, label: u.label, price: u.price }));

  const breakdown = buildBreakdown(base, selectedUpsells, choice);
  const policy = depositPolicy(breakdown.total);
  const accepted = quote.status === "accepted";
  const expired = quote.status === "expired" || quote.status === "refused";

  const validUntil = new Date(quote.createdAt);
  validUntil.setDate(validUntil.getDate() + QUOTE_VALIDITY_DAYS);

  const checkoutHref = mockCheckoutUrl({
    quoteId: quote.id,
    amountNow: breakdown.amountNow,
    choice: breakdown.choice,
  });

  function toggle(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="relative">
      <BlueprintGrid className="opacity-50" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
      {/* The quote planche */}
      <div className="min-w-0 space-y-6">
        <article className="sheet relative overflow-hidden rounded-[4px] border border-line-strong bg-paper">
          {/* Cartouche */}
          <header className="flex items-center justify-between gap-4 border-b border-line-strong bg-vellum/40 px-6 py-3">
            <span className="caption">
              Devis · {quote.reference ?? "—"}
            </span>
            <span className="caption text-soft">
              Valable jusqu&apos;au {formatDate(validUntil.toISOString())}
            </span>
          </header>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="caption">Projet</p>
                <h1 className="mt-1 font-display text-[clamp(1.6rem,3vw,2.25rem)] text-ink">
                  {quote.projectTitle}
                </h1>
              </div>
              {accepted ? <StampBadge label="Accepté" tone="pine" /> : null}
              {expired ? <StampBadge label="Clôturé" tone="crimson" /> : null}
            </div>

            {/* Line items */}
            <table className="mt-7 w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[10px] uppercase tracking-[0.18em] text-mute">
                  <th className="py-2 font-medium">Prestation</th>
                  <th className="py-2 text-right font-medium">Qté</th>
                  <th className="py-2 text-right font-medium">PU</th>
                  <th className="py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {quote.items.length > 0 ? (
                  quote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-3 text-ink">{item.label}</td>
                      <td className="py-3 text-right text-mute">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-mute">
                        {formatEuro(item.unit_price)}
                      </td>
                      <td className="py-3 text-right font-medium text-ink">
                        {formatEuro(item.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-mute">
                      Prestation forfaitaire.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-line-strong">
                  <td colSpan={3} className="py-3 text-right text-mute">
                    Sous-total prestation
                  </td>
                  <td className="py-3 text-right font-display text-xl text-ink">
                    {formatEuro(base)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {quote.notes ? (
              <p className="mt-6 rounded-[3px] border border-line bg-vellum/30 p-4 text-[13px] leading-6 text-graphite">
                {quote.notes}
              </p>
            ) : null}
          </div>
        </article>

        {/* What happens after payment */}
        <section className="rounded-[4px] border border-line bg-paper p-6">
          <p className="caption">Ce qui se passe après votre paiement</p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {AFTER_PAYMENT.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-pine/40 bg-pine-tint font-mono text-[11px] text-pine-active">
                  {i + 1}
                </span>
                <span className="text-[13px] leading-6 text-graphite">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Reassurance */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-mute">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-pine" aria-hidden="true" />
            Paiement {STRIPE_READY ? "sécurisé" : "simulé"} · sans engagement
            au-delà du devis
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5 text-pine" aria-hidden="true" />
            Fichiers et échanges centralisés dans votre espace
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-pine" aria-hidden="true" />
            Devis valable {QUOTE_VALIDITY_DAYS} jours
          </span>
        </div>
      </div>

      {/* PriceRail — sticky conversion bar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[4px] border border-line-strong bg-paper p-5 shadow-[var(--shadow-e2)]">
          {/* Upsells */}
          <p className="caption">Options</p>
          <div className="mt-3 space-y-2">
            {upsells.map((u) => {
              const on = selected.has(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggle(u.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-[3px] border px-3 py-2 text-left transition-colors",
                    on
                      ? "border-pine bg-pine-tint"
                      : "border-line bg-paper hover:border-line-strong hover:bg-vellum/40",
                  )}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                      {on ? (
                        <CheckCircle2 className="size-3.5 text-pine" aria-hidden="true" />
                      ) : (
                        <Plus className="size-3.5 text-mute" aria-hidden="true" />
                      )}
                      {u.label}
                    </span>
                    <span className="ml-5 mt-0.5 block text-[11px] leading-4 text-mute">
                      {GROUP_LABELS[u.group]}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[12px] text-graphite">
                    +{formatEuro(u.price)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Payment choice */}
          {policy.mode === "acompte" ? (
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-5">
              {(["deposit", "total"] as PaymentChoice[]).map((c) => {
                const on = breakdown.choice === c;
                const amount =
                  c === "deposit" ? policy.deposit : breakdown.total;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChoice(c)}
                    className={cn(
                      "rounded-[3px] border px-3 py-2.5 text-left transition-colors",
                      on
                        ? "border-pine bg-pine-tint"
                        : "border-line bg-paper hover:border-line-strong",
                    )}
                  >
                    <span className="block text-[12px] font-medium text-ink">
                      {c === "deposit"
                        ? `Acompte ${Math.round(policy.rate * 100)}%`
                        : "Tout régler"}
                    </span>
                    <span className="mt-0.5 block font-mono text-[13px] text-graphite">
                      {formatEuro(amount)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Totals */}
          <dl className="mt-5 space-y-1.5 border-t border-line pt-5 text-[13px]">
            <Row label="Prestation" value={formatEuro(base)} />
            {breakdown.upsellTotal > 0 ? (
              <Row label="Options" value={`+ ${formatEuro(breakdown.upsellTotal)}`} />
            ) : null}
            <Row label="Total" value={formatEuro(breakdown.total)} strong />
            {!breakdown.payingInFull ? (
              <Row
                label="Solde à la livraison"
                value={formatEuro(breakdown.balanceLater)}
                muted
              />
            ) : null}
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-line-strong pt-4">
            <span className="caption">À régler maintenant</span>
            <span className="font-display text-2xl text-ink">
              {formatEuro(breakdown.amountNow)}
            </span>
          </div>

          {accepted ? (
            <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-pine/40 bg-pine-tint px-5 py-3 text-[13px] font-medium text-pine-active">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Devis accepté
            </div>
          ) : (
            <Link
              href={checkoutHref}
              className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pine px-6 text-[14px] font-medium text-paper transition hover:bg-pine-hover"
            >
              Accepter et payer {formatEuro(breakdown.amountNow)}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
          <p className="mt-3 text-center text-[11px] leading-4 text-mute">
            {STRIPE_READY
              ? "Paiement sécurisé par carte."
              : "Paiement simulé — Stripe à brancher (clé requise)."}
          </p>
        </div>
      </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className={cn(muted ? "text-mute" : "text-graphite")}>{label}</dt>
      <dd
        className={cn(
          "font-mono",
          strong ? "text-[15px] font-medium text-ink" : "text-graphite",
          muted && "text-mute",
        )}
      >
        {value}
      </dd>
    </div>
  );
}


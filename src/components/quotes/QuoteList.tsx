"use client";

import { Loader2, ReceiptText } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  addQuoteItemAction,
  createQuoteAction,
  updateQuoteStatusAction,
} from "@/lib/actions/quotes";
import type {
  ProjectRow,
  QuoteItemRow,
  QuoteRow,
  QuoteStatus,
} from "@/types/database";

type QuoteWithItems = QuoteRow & {
  items: QuoteItemRow[];
  project: Pick<ProjectRow, "id" | "title" | "reference"> | null;
};

type Props = {
  quotes: QuoteWithItems[];
  projects: Pick<ProjectRow, "id" | "title" | "reference">[];
  canManage: boolean;
};

const initialState = {} as { error?: string; success?: string };

const quoteStatusLabels: Record<QuoteStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  refused: "Refusé",
  expired: "Expiré",
};

const quoteStatusTone: Record<QuoteStatus, "neutral" | "amber" | "green" | "red" | "blue"> = {
  draft: "neutral",
  sent: "blue",
  accepted: "green",
  refused: "red",
  expired: "amber",
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
      {label}
    </Button>
  );
}

function CreateForm({ projects }: { projects: Props["projects"] }) {
  const [state, formAction] = useActionState(createQuoteAction, initialState);
  return (
    <form
      action={formAction}
      className="rounded-[4px] border border-[#d8d0bf] bg-[#f8f5ed] p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
        Nouveau devis
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs text-[#6b665a]">Projet</span>
          <select
            name="project_id"
            required
            className="h-10 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
          >
            <option value="" disabled>
              Sélectionner…
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.reference} — {p.title}
              </option>
            ))}
          </select>
        </label>
        <Submit label="Créer le devis" />
      </div>
      {state.error ? (
        <p className="mt-2 text-xs text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}

function AddItemForm({ quoteId }: { quoteId: string }) {
  const [state, formAction] = useActionState(addQuoteItemAction, initialState);
  return (
    <form action={formAction} className="grid gap-2 border-t border-[#e8e0d0] pt-3 sm:grid-cols-[2fr_60px_100px_auto] sm:items-end">
      <input type="hidden" name="quote_id" value={quoteId} />
      <label className="block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
          Désignation
        </span>
        <input
          name="label"
          required
          className="h-9 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
          Qté
        </span>
        <input
          name="quantity"
          type="number"
          min="0"
          step="0.5"
          defaultValue={1}
          className="h-9 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
          PU (€)
        </span>
        <input
          name="unit_price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={0}
          className="h-9 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
        />
      </label>
      <Submit label="Ajouter" />
      {state.error ? (
        <p className="col-span-full text-xs text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}

function StatusForm({
  quoteId,
  current,
  canManage,
}: {
  quoteId: string;
  current: QuoteStatus;
  canManage: boolean;
}) {
  const [state, formAction] = useActionState(updateQuoteStatusAction, initialState);

  const options: QuoteStatus[] = canManage
    ? ["draft", "sent", "accepted", "refused", "expired"]
    : ["accepted", "refused"];

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="quote_id" value={quoteId} />
      <select
        name="status"
        defaultValue={current}
        className="h-8 rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-xs"
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {quoteStatusLabels[status]}
          </option>
        ))}
      </select>
      <Submit label="OK" />
      {state.error ? (
        <span className="text-xs text-red-700">{state.error}</span>
      ) : null}
    </form>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(value);
}

export function QuoteList({ quotes, projects, canManage }: Props) {
  return (
    <div className="space-y-6">
      {canManage ? <CreateForm projects={projects} /> : null}

      {quotes.length === 0 ? (
        <p className="rounded-[6px] border border-dashed border-[#d8d0bf] bg-white/70 p-10 text-center text-sm text-[#6b665a]">
          <ReceiptText className="mx-auto size-8 text-[#8a7a5f]" aria-hidden />
          <span className="mt-3 block">Aucun devis pour le moment.</span>
        </p>
      ) : (
        <ul className="space-y-4">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4"
            >
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b665a]">
                    <ReceiptText className="size-3.5" aria-hidden />
                    <span className="font-mono">
                      {quote.project?.reference ?? "—"}
                    </span>
                    <StatusPill tone={quoteStatusTone[quote.status]}>
                      {quoteStatusLabels[quote.status]}
                    </StatusPill>
                  </div>
                  <p className="mt-1 font-medium text-[#171613]">
                    {quote.project?.title ?? "Projet"}
                  </p>
                  {quote.notes ? (
                    <p className="mt-1 text-xs text-[#6b665a]">{quote.notes}</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6b665a]">Total</p>
                  <p className="text-lg font-semibold text-[#171613]">
                    {formatCurrency(quote.total_amount, quote.currency)}
                  </p>
                </div>
              </header>

              {quote.items.length > 0 ? (
                <table className="mt-3 min-w-full divide-y divide-[#e8e0d0] text-sm">
                  <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
                    <tr>
                      <th className="py-2">Désignation</th>
                      <th className="py-2 text-right">Qté</th>
                      <th className="py-2 text-right">PU</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee8dc]">
                    {quote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2">{item.label}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">
                          {formatCurrency(item.unit_price, quote.currency)}
                        </td>
                        <td className="py-2 text-right font-medium text-[#171613]">
                          {formatCurrency(item.total, quote.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-3 text-xs text-[#6b665a]">
                  Aucune ligne — ajoutez une première prestation.
                </p>
              )}

              {canManage ? <AddItemForm quoteId={quote.id} /> : null}

              <div className="mt-4 flex items-center justify-end gap-2">
                <StatusForm
                  quoteId={quote.id}
                  current={quote.status}
                  canManage={canManage}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

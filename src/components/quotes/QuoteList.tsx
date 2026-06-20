"use client";

import { ArrowRight, Download, Loader2, ReceiptText } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { routes } from "@/lib/routes";
import {
  addQuoteItemAction,
  applyQuoteTemplateAction,
  createQuoteAction,
  updateQuoteStatusAction,
} from "@/lib/actions/quotes";
import { formatEuro } from "@/lib/business-config";
import { QUOTE_TEMPLATES, templateTotal } from "@/lib/designer-presets";
import type {
  ProjectRow,
  QuoteItemRow,
  QuoteRow,
  QuoteStatus,
} from "@/types/database";

export type QuoteWithItems = QuoteRow & {
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

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  return (
    <form
      action={formAction}
      className="rounded-[4px] border border-line-strong bg-vellum/60 p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
        Nouveau devis
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs text-mute">Projet</span>
          <select
            name="project_id"
            required
            className="h-10 w-full rounded-[3px] border border-line-strong bg-paper px-2 text-sm"
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
    </form>
  );
}

function AddItemForm({ quoteId }: { quoteId: string }) {
  const [state, formAction] = useActionState(addQuoteItemAction, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-2 border-t border-line pt-3 sm:grid-cols-[2fr_60px_100px_auto] sm:items-end">
      <input type="hidden" name="quote_id" value={quoteId} />
      <label className="block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-mute">
          Désignation
        </span>
        <input
          name="label"
          required
          className="h-9 w-full rounded-[3px] border border-line-strong bg-paper px-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-mute">
          Qté
        </span>
        <input
          name="quantity"
          type="number"
          min="0"
          step="0.5"
          defaultValue={1}
          className="h-9 w-full rounded-[3px] border border-line-strong bg-paper px-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-mute">
          PU (€)
        </span>
        <input
          name="unit_price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={0}
          className="h-9 w-full rounded-[3px] border border-line-strong bg-paper px-2 text-sm"
        />
      </label>
      <Submit label="Ajouter" />
    </form>
  );
}

function TemplatesRow({ quoteId }: { quoteId: string }) {
  const [state, formAction] = useActionState(
    applyQuoteTemplateAction,
    initialState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  return (
    <div className="border-t border-line pt-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-mute">
        Modèles de devis
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {QUOTE_TEMPLATES.map((template) => (
          <form action={formAction} key={template.id}>
            <input type="hidden" name="quote_id" value={quoteId} />
            <input type="hidden" name="template_id" value={template.id} />
            <button
              type="submit"
              title={`${template.description} · dès ${formatEuro(templateTotal(template))}`}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-line-strong bg-paper px-3 py-1.5 text-xs font-medium text-graphite transition hover:border-pine hover:text-ink"
            >
              + {template.label}
            </button>
          </form>
        ))}
      </div>
    </div>
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

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  const options: QuoteStatus[] = canManage
    ? ["draft", "sent", "accepted", "refused", "expired"]
    : ["accepted", "refused"];

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="quote_id" value={quoteId} />
      <select
        name="status"
        defaultValue={current}
        className="h-8 rounded-[3px] border border-line-strong bg-paper px-2 text-xs"
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {quoteStatusLabels[status]}
          </option>
        ))}
      </select>
      <Submit label="OK" />
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
        <p className="rounded-[4px] border border-dashed border-line-strong bg-vellum/30 p-10 text-center text-sm text-mute">
          <ReceiptText className="mx-auto size-8 text-mute" aria-hidden />
          <span className="mt-3 block">Aucun devis pour le moment.</span>
        </p>
      ) : (
        <Reveal as="ul" stagger className="space-y-4">
          {quotes.map((quote) => (
            <Reveal
              as="li"
              item
              key={quote.id}
              className="lift rounded-[4px] border border-line-strong bg-paper p-4"
            >
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-mute">
                    <ReceiptText className="size-3.5" aria-hidden />
                    <span className="font-mono">
                      {quote.project?.reference ?? "—"}
                    </span>
                    <StatusPill tone={quoteStatusTone[quote.status]}>
                      {quoteStatusLabels[quote.status]}
                    </StatusPill>
                  </div>
                  <p className="mt-1 font-medium text-ink">
                    {quote.project?.title ?? "Projet"}
                  </p>
                  {quote.notes ? (
                    <p className="mt-1 text-xs text-mute">{quote.notes}</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-xs text-mute">Total</p>
                  <p className="text-lg font-semibold text-ink">
                    {formatCurrency(quote.total_amount, quote.currency)}
                  </p>
                </div>
              </header>

              {quote.items.length > 0 ? (
                <table className="mt-3 min-w-full divide-y divide-line text-sm">
                  <thead className="text-left text-[10px] uppercase tracking-[0.18em] text-mute">
                    <tr>
                      <th className="py-2">Désignation</th>
                      <th className="py-2 text-right">Qté</th>
                      <th className="py-2 text-right">PU</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {quote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2">{item.label}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">
                          {formatCurrency(item.unit_price, quote.currency)}
                        </td>
                        <td className="py-2 text-right font-medium text-ink">
                          {formatCurrency(item.total, quote.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-3 text-xs text-mute">
                  Aucune ligne — ajoutez une première prestation.
                </p>
              )}

              {canManage ? <TemplatesRow quoteId={quote.id} /> : null}
              {canManage ? <AddItemForm quoteId={quote.id} /> : null}

              <div className="mt-4 flex items-center justify-end gap-2">
                {!canManage ? (
                  <a
                    href={routes.client.quote(quote.id)}
                    className="group inline-flex h-8 items-center justify-center gap-1.5 rounded-[3px] bg-pine px-3 text-xs font-medium text-paper transition hover:bg-pine-hover"
                  >
                    Voir le devis
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ) : null}
                <a
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[3px] border border-line-strong bg-paper px-3 text-xs font-medium text-ink transition hover:border-ink"
                  href={`/api/quotes/${quote.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  PDF
                </a>
                <StatusForm
                  quoteId={quote.id}
                  current={quote.status}
                  canManage={canManage}
                />
              </div>
            </Reveal>
          ))}
        </Reveal>
      )}
    </div>
  );
}

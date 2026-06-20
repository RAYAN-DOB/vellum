"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { updateQuoteStatusAction } from "@/lib/actions/quotes";
import { formatEuro } from "@/lib/business-config";
import { STRIPE_READY } from "@/lib/payments";

const initialState = {} as { error?: string; success?: string };

function PayButton({ amount }: { amount: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pine px-6 text-[14px] font-medium text-paper transition hover:bg-pine-hover disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Lock className="size-4" aria-hidden="true" />
      )}
      Payer {formatEuro(amount)}
    </button>
  );
}

/**
 * Mock checkout — accepts the quote (real, RLS-protected) and simulates the
 * payment. Swap the submit for a Stripe Checkout redirect when keys are wired
 * (see lib/payments).
 */
export function CheckoutConfirm({
  quoteId,
  amount,
  choice,
}: {
  quoteId: string;
  amount: number;
  choice: "deposit" | "total";
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    updateQuoteStatusAction,
    initialState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Paiement confirmé.");
      router.push(`/checkout/success?quote=${quoteId}`);
    }
  }, [state, router, quoteId]);

  return (
    <form action={formAction}>
      <input type="hidden" name="quote_id" value={quoteId} />
      <input type="hidden" name="status" value="accepted" />

      <dl className="space-y-2 rounded-[3px] border border-line bg-vellum/30 p-4 text-[13px]">
        <div className="flex items-baseline justify-between">
          <dt className="text-graphite">
            {choice === "deposit" ? "Acompte à régler" : "Montant total"}
          </dt>
          <dd className="font-display text-xl text-ink">{formatEuro(amount)}</dd>
        </div>
        {choice === "deposit" ? (
          <p className="text-[12px] leading-5 text-mute">
            Le solde sera réglé à la livraison de votre projet.
          </p>
        ) : null}
      </dl>

      <div className="mt-5">
        <PayButton amount={amount} />
      </div>
      <p className="mt-3 text-center text-[11px] leading-4 text-mute">
        {STRIPE_READY
          ? "Paiement sécurisé par carte (Stripe)."
          : "Paiement simulé — aucune carte n'est débitée. Stripe à brancher."}
      </p>
    </form>
  );
}

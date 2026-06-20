/**
 * Payments — MOCK, Stripe-ready. No real charge happens here.
 *
 * The whole money model (amounts, deposit policy, upsells, commission) already
 * lives in lib/business-config. This module only assembles a checkout
 * breakdown and exposes a single seam to swap in real Stripe later.
 *
 * TO WIRE STRIPE (later):
 *   1. Set STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
 *   2. Replace `createCheckout` with a server action / route handler that
 *      creates a Stripe Checkout Session for `amountNow` (EUR) and returns its
 *      url; redirect the client there instead of the mock success route.
 *   3. Add a webhook (checkout.session.completed) to mark the quote paid +
 *      persist the chosen upsells. Until then the success route below is a
 *      clean simulation.
 */

import { COMMISSION_RATE, depositPolicy } from "@/lib/business-config";

const round2 = (n: number) => Math.round(n * 100) / 100;

export type PaymentChoice = "deposit" | "total";

export type SelectedUpsell = { id: string; label: string; price: number };

export type CheckoutBreakdown = {
  base: number;
  upsells: SelectedUpsell[];
  upsellTotal: number;
  total: number;
  choice: PaymentChoice;
  /** What the client pays right now. */
  amountNow: number;
  /** Remaining balance due on delivery (0 if paid in full). */
  balanceLater: number;
  /** Vellum's commission on the paid total (internal). */
  commission: number;
  payingInFull: boolean;
};

export function buildBreakdown(
  base: number,
  upsells: SelectedUpsell[],
  choice: PaymentChoice,
): CheckoutBreakdown {
  const upsellTotal = round2(upsells.reduce((sum, u) => sum + u.price, 0));
  const total = round2(base + upsellTotal);
  const policy = depositPolicy(total);

  // "deposit" only applies when policy allows an acompte; otherwise pay in full.
  const payingInFull = choice === "total" || policy.mode === "total";
  const amountNow = payingInFull ? total : policy.deposit;
  const balanceLater = payingInFull ? 0 : policy.balance;

  return {
    base,
    upsells,
    upsellTotal,
    total,
    choice: payingInFull ? "total" : "deposit",
    amountNow,
    balanceLater,
    commission: round2(total * COMMISSION_RATE),
    payingInFull,
  };
}

/** True once real Stripe publishable key is present. */
export const STRIPE_READY = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

/**
 * Mock checkout seam. Returns the URL to send the client to. With Stripe wired,
 * return the Stripe Checkout Session URL instead of the local success route.
 */
export function mockCheckoutUrl(params: {
  quoteId: string;
  amountNow: number;
  choice: PaymentChoice;
}) {
  const q = new URLSearchParams({
    quote: params.quoteId,
    amount: String(params.amountNow),
    choice: params.choice,
  });
  return `/checkout/confirmation?${q.toString()}`;
}

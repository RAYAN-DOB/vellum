/**
 * Vellum — business configuration (single source of truth for money rules).
 *
 * Everything here is intentionally centralised + configurable so prices,
 * deposit policy, commission and upsells can be tuned without touching UI.
 * Pure data + pure functions (Server/Client safe). No payment is processed
 * here — see lib/payments for the (mock, Stripe-ready) flow.
 */

export const CURRENCY = "EUR";

/** Vellum's take on each paid project. */
export const COMMISSION_RATE = 0.15; // 15 %

/** A quote stays valid this many days after being sent. */
export const QUOTE_VALIDITY_DAYS = 14;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}

export type DepositPolicy = {
  /** "total" → pay everything now; "acompte" → pay a deposit, rest on delivery. */
  mode: "total" | "acompte";
  rate: number;
  deposit: number;
  balance: number;
  reason: string;
};

/**
 * How much the client pays up-front, by amount + urgency:
 *   < 150 €            → total
 *   150 € – 500 €      → acompte 30 %
 *   > 500 €            → acompte 40 %
 *   urgent (any price) → acompte 50 %
 */
export function depositPolicy(total: number, urgent = false): DepositPolicy {
  let mode: DepositPolicy["mode"] = "acompte";
  let rate: number;
  let reason: string;

  if (urgent) {
    rate = 0.5;
    reason = "Projet urgent";
  } else if (total < 150) {
    mode = "total";
    rate = 1;
    reason = "Petit montant — réglé en une fois";
  } else if (total <= 500) {
    rate = 0.3;
    reason = "Acompte pour démarrer la production";
  } else {
    rate = 0.4;
    reason = "Acompte pour démarrer la production";
  }

  const deposit = round2(total * rate);
  return { mode, rate, deposit, balance: round2(total - deposit), reason };
}

export type UpsellGroup = "delai" | "fichiers" | "service";

export type Upsell = {
  id: string;
  label: string;
  description: string;
  group: UpsellGroup;
  /** Fixed amount, or a percentage of the base with a floor. */
  kind: "fixed" | "percent";
  amount?: number;
  percent?: number;
  min?: number;
};

export const UPSELLS: Upsell[] = [
  {
    id: "delivery-48h",
    label: "Livraison 48 h",
    description: "Votre projet passe en priorité, livré sous 48 h.",
    group: "delai",
    kind: "percent",
    percent: 0.35,
    min: 49,
  },
  {
    id: "delivery-24h",
    label: "Livraison 24 h",
    description: "Traitement express, livré sous 24 h si réalisable.",
    group: "delai",
    kind: "percent",
    percent: 0.6,
    min: 99,
  },
  {
    id: "source-files",
    label: "Fichiers source",
    description: "Recevez les fichiers natifs (DWG, calques) éditables.",
    group: "fichiers",
    kind: "fixed",
    amount: 39,
  },
  {
    id: "pdf-print",
    label: "PDF prêt à imprimer",
    description: "Export haute définition, cartouche et échelle vérifiées.",
    group: "fichiers",
    kind: "fixed",
    amount: 29,
  },
  {
    id: "extra-revision",
    label: "Révision supplémentaire",
    description: "Une passe de corrections en plus de celles incluses.",
    group: "service",
    kind: "fixed",
    amount: 49,
  },
  {
    id: "clarification-call",
    label: "Appel de clarification",
    description: "15 min avec le dessinateur pour cadrer le besoin.",
    group: "service",
    kind: "fixed",
    amount: 39,
  },
  {
    id: "delivery-pack",
    label: "Pack livraison complète",
    description: "Fichiers source + PDF print + version imprimable.",
    group: "service",
    kind: "fixed",
    amount: 99,
  },
];

/** Price of an upsell given the project base amount. */
export function upsellPrice(upsell: Upsell, base: number): number {
  if (upsell.kind === "fixed") return upsell.amount ?? 0;
  return Math.max(upsell.min ?? 0, round2(base * (upsell.percent ?? 0)));
}

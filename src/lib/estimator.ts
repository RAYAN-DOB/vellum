/**
 * Instant estimate — a transparent, deterministic pricing heuristic used by the
 * public landing estimator. It is NOT a quote: it gives the visitor a calm,
 * honest price range + lead time so they feel safe enough to deposit a project.
 * The real price is always confirmed by a dessinateur after seeing the files.
 *
 * Pure functions only (no I/O) so it is safe in Server or Client Components.
 */

export type ProjectKind =
  | "correction"
  | "plan2d"
  | "mise_au_propre"
  | "schema"
  | "apercu3d";

export type Complexity = "simple" | "standard" | "detaille";
export type Urgency = "flexible" | "semaine" | "urgent";

export const ESTIMATOR_KINDS: {
  value: ProjectKind;
  label: string;
  hint: string;
}[] = [
  { value: "correction", label: "Reprise / correction", hint: "Modifier un plan DWG ou PDF existant" },
  { value: "plan2d", label: "Plan technique 2D", hint: "Mise en plan cotée" },
  { value: "mise_au_propre", label: "Mise au propre", hint: "Croquis → dessin propre" },
  { value: "schema", label: "Schéma technique", hint: "Électrique, réseau, principe" },
  { value: "apercu3d", label: "Aperçu 3D / axonométrie", hint: "Volume, perspective" },
];

export const COMPLEXITY_OPTIONS: { value: Complexity; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "standard", label: "Standard" },
  { value: "detaille", label: "Détaillé" },
];

export const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: "flexible", label: "Flexible" },
  { value: "semaine", label: "Sous une semaine" },
  { value: "urgent", label: "Urgent" },
];

const BASE: Record<ProjectKind, { low: number; high: number; days: number }> = {
  correction: { low: 70, high: 160, days: 2 },
  plan2d: { low: 180, high: 340, days: 5 },
  mise_au_propre: { low: 110, high: 220, days: 3 },
  schema: { low: 130, high: 260, days: 4 },
  apercu3d: { low: 240, high: 480, days: 6 },
};

const COMPLEXITY_MULT: Record<Complexity, { mult: number; label: string }> = {
  simple: { mult: 0.85, label: "Simple" },
  standard: { mult: 1, label: "Standard" },
  detaille: { mult: 1.4, label: "Détaillé" },
};

const URGENCY_MULT: Record<Urgency, { price: number; days: number }> = {
  flexible: { price: 1, days: 1.2 },
  semaine: { price: 1.1, days: 1 },
  urgent: { price: 1.45, days: 0.6 },
};

const round10 = (n: number) => Math.max(10, Math.round(n / 10) * 10);

export type Estimate = {
  low: number;
  high: number;
  days: number;
  complexityLabel: string;
};

export function estimate(
  kind: ProjectKind,
  complexity: Complexity,
  urgency: Urgency,
): Estimate {
  const base = BASE[kind];
  const c = COMPLEXITY_MULT[complexity];
  const u = URGENCY_MULT[urgency];
  return {
    low: round10(base.low * c.mult * u.price),
    high: round10(base.high * c.mult * u.price),
    days: Math.max(1, Math.round(base.days * u.days)),
    complexityLabel: c.label,
  };
}

export function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

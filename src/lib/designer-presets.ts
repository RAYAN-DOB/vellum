/**
 * Designer presets — speed up the dessinateur's two slowest tasks: building a
 * quote and answering recurring questions. Pure data; configurable. Prices are
 * indicative starting points the dessinateur adjusts per project.
 */

export type QuoteLine = { label: string; unitPrice: number };

export type QuoteTemplate = {
  id: string;
  label: string;
  description: string;
  lines: QuoteLine[];
};

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: "plan-simple",
    label: "Plan technique simple",
    description: "Mise en plan cotée d'un espace simple",
    lines: [
      { label: "Relevé et mise en plan", unitPrice: 180 },
      { label: "Cotation et nomenclature", unitPrice: 90 },
    ],
  },
  {
    id: "correction-dwg",
    label: "Correction DWG / PDF",
    description: "Reprise et corrections d'un plan existant",
    lines: [
      { label: "Analyse et corrections", unitPrice: 120 },
      { label: "Export PDF + DWG propre", unitPrice: 40 },
    ],
  },
  {
    id: "apercu-3d",
    label: "Aperçu 3D",
    description: "Volume + axonométrie + rendu",
    lines: [
      { label: "Modélisation 3D", unitPrice: 260 },
      { label: "Rendu et mise en page", unitPrice: 140 },
    ],
  },
  {
    id: "schema",
    label: "Schéma technique",
    description: "Électrique, plomberie ou principe",
    lines: [
      { label: "Schéma de principe", unitPrice: 150 },
      { label: "Légende et nomenclature", unitPrice: 70 },
    ],
  },
  {
    id: "dossier-complet",
    label: "Dossier complet",
    description: "Plans + schémas + aperçu + mise en dossier",
    lines: [
      { label: "Plans techniques", unitPrice: 320 },
      { label: "Schémas associés", unitPrice: 160 },
      { label: "Aperçu 3D", unitPrice: 240 },
      { label: "Mise en dossier PDF", unitPrice: 80 },
    ],
  },
];

export function templateTotal(template: QuoteTemplate): number {
  return template.lines.reduce((sum, line) => sum + line.unitPrice, 0);
}

/** One-tap replies for the dessinateur in the project chat. */
export const QUICK_REPLIES: string[] = [
  "Pouvez-vous préciser les dimensions exactes ?",
  "Avez-vous un exemple ou une référence de style ?",
  "Le fichier source (DWG) est-il disponible ?",
  "Je vous prépare un devis aujourd'hui.",
  "Souhaitez-vous une version imprimable (PDF) ?",
  "C'est noté, je lance la production.",
];

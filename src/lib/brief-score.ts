/**
 * Brief quality score — pure heuristic that nudges the client toward a precise
 * brief, so dessinateurs get fewer vague requests and quotes are more reliable.
 * Returns a 0–100 score + up to 3 actionable tips. No I/O.
 */

export type BriefInput = {
  title: string;
  description: string;
  fileCount: number;
  hasDeadline: boolean;
  hasBudget: boolean;
};

export type BriefScore = {
  score: number;
  label: "À compléter" | "Correct" | "Solide" | "Excellent";
  tips: string[];
};

const DIMENSION_RE = /\d+\s?(mm|cm|m²|m2|m\b|mètre|metre|ml\b)/i;

export function scoreBrief(input: BriefInput): BriefScore {
  let score = 0;
  const tips: string[] = [];

  const title = input.title.trim();
  const desc = input.description.trim();

  if (title.length >= 4) score += 12;
  else tips.push("Donnez un titre clair à votre projet.");

  if (desc.length >= 220) score += 30;
  else if (desc.length >= 90) score += 18;
  else tips.push("Détaillez votre besoin : objectif, format de sortie, contraintes.");

  if (DIMENSION_RE.test(desc)) score += 16;
  else tips.push("Précisez les dimensions ou l'échelle (m, cm, m²…).");

  if (input.fileCount > 0) score += 27;
  else tips.push("Ajoutez un croquis, un plan ou une photo de référence.");

  if (input.hasDeadline) score += 8;
  else tips.push("Indiquez un délai souhaité.");

  if (input.hasBudget) score += 7;

  score = Math.min(100, score);

  const label: BriefScore["label"] =
    score >= 85 ? "Excellent" : score >= 65 ? "Solide" : score >= 40 ? "Correct" : "À compléter";

  return { score, label, tips: tips.slice(0, 3) };
}

import { Badge } from "@/components/ui/Badge";
import type { DeliverableStatus } from "@/types/deliverable";
import type { ProjectStatus } from "@/types/project";
import type { RequestPriority, RequestStatus } from "@/types/request";

type StatusBadgeProps = {
  value: ProjectStatus | RequestStatus | DeliverableStatus | RequestPriority;
};

const labels: Record<StatusBadgeProps["value"], string> = {
  assigned: "Assignee",
  approved: "Valide",
  archived: "Archive",
  changes_requested: "Corrections",
  closed: "Fermee",
  delivered: "Livre",
  draft: "Brouillon",
  high: "Haute",
  in_progress: "En cours",
  intake: "Cadrage",
  low: "Basse",
  normal: "Normale",
  qualified: "Qualifiee",
  review: "Revue",
  submitted: "Soumise",
  under_review: "En revue",
  urgent: "Urgente",
  waiting_review: "Attente revue",
};

const tones: Record<StatusBadgeProps["value"], "neutral" | "blue" | "green" | "amber" | "red"> = {
  assigned: "blue",
  approved: "green",
  archived: "neutral",
  changes_requested: "amber",
  closed: "neutral",
  delivered: "green",
  draft: "neutral",
  high: "amber",
  in_progress: "blue",
  intake: "blue",
  low: "neutral",
  normal: "blue",
  qualified: "green",
  review: "amber",
  submitted: "blue",
  under_review: "amber",
  urgent: "red",
  waiting_review: "amber",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return <Badge tone={tones[value]}>{labels[value]}</Badge>;
}

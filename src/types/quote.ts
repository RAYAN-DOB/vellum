export type QuoteStatus = "not_started" | "draft" | "waiting_validation";

export type QuotePreview = {
  id: string;
  projectId: string;
  status: QuoteStatus;
  label: string;
  amountLabel: string;
  note: string;
  isMockOnly: true;
};

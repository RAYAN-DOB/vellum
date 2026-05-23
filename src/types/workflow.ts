export type ProjectLifecycleState =
  | "deposit"
  | "qualification"
  | "assignment"
  | "production"
  | "preview_validation"
  | "quote"
  | "payment_future"
  | "secure_delivery";

export type WorkflowStep = {
  id: ProjectLifecycleState;
  label: string;
  owner: "client" | "manager" | "architect" | "admin";
  description: string;
  isActive?: boolean;
};

export type TeamCapacity = {
  id: string;
  name: string;
  roleLabel: string;
  skills: string[];
  loadLabel: string;
  availability: "available" | "busy" | "review";
};

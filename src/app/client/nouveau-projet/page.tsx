import { NewProjectFlow } from "@/components/client/NewProjectFlow";
import { requireRole } from "@/lib/auth";

export const metadata = {
  title: "Nouveau projet — PlanWork",
};

export default async function ClientNewProjectPage() {
  await requireRole(["client", "manager", "admin"]);
  return <NewProjectFlow />;
}

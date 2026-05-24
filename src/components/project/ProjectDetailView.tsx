import { ProjectActionsPanel } from "@/components/project/ProjectActionsPanel";
import { ProjectDocumentList } from "@/components/project/ProjectDocumentList";
import { ProjectEventLog } from "@/components/project/ProjectEventLog";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectMessageThread } from "@/components/project/ProjectMessageThread";
import { routes } from "@/lib/routes";
import type {
  ProjectDocumentWithUploader,
  ProjectEventItem,
  ProjectLite,
  ProjectMessageWithSender,
} from "@/components/project/project-detail-types";

type Props = {
  project: ProjectLite;
  documents: ProjectDocumentWithUploader[];
  messages: ProjectMessageWithSender[];
  events: ProjectEventItem[];
  currentUserId: string;
  currentUserRole: string;
  canUpload: boolean;
};

function backHrefForRole(role: string) {
  if (role === "architect") return routes.studio.projects;
  if (role === "manager" || role === "admin") return routes.manager.projects;
  return routes.client.projects;
}

export function ProjectDetailView({
  project,
  documents,
  messages,
  events,
  currentUserId,
  currentUserRole,
  canUpload,
}: Props) {
  return (
    <div className="space-y-6">
      <ProjectHeader project={project} backHref={backHrefForRole(currentUserRole)} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <ProjectDocumentList
            projectId={project.id}
            documents={documents}
            canUpload={canUpload}
            currentUserRole={currentUserRole}
          />
          <ProjectMessageThread
            projectId={project.id}
            messages={messages}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </div>
        <div className="min-w-0 space-y-6">
          <ProjectActionsPanel
            project={project}
            currentUserRole={currentUserRole}
          />
          <ProjectEventLog events={events} />
        </div>
      </div>
    </div>
  );
}

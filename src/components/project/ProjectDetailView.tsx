import { Clock, FileText, LayoutGrid, MessageSquare } from "lucide-react";

import { ProjectActionsPanel } from "@/components/project/ProjectActionsPanel";
import { ProjectDocumentList } from "@/components/project/ProjectDocumentList";
import { ProjectEventLog } from "@/components/project/ProjectEventLog";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectMessageThread } from "@/components/project/ProjectMessageThread";
import { ProjectTracker } from "@/components/project/ProjectTracker";
import { ProjectWorkspaceTabs } from "@/components/project/ProjectWorkspaceTabs";
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

      <ProjectTracker
        status={project.status}
        audience={currentUserRole === "client" ? "client" : "internal"}
      />

      <ProjectWorkspaceTabs
        tabs={[
          {
            id: "apercu",
            label: "Aperçu",
            icon: <LayoutGrid />,
            content: (
              <ProjectActionsPanel
                project={project}
                currentUserRole={currentUserRole}
              />
            ),
          },
          {
            id: "fichiers",
            label: "Fichiers",
            icon: <FileText />,
            badge: documents.length,
            content: (
              <ProjectDocumentList
                projectId={project.id}
                documents={documents}
                canUpload={canUpload}
                currentUserRole={currentUserRole}
              />
            ),
          },
          {
            id: "messages",
            label: "Messages",
            icon: <MessageSquare />,
            content: (
              <ProjectMessageThread
                projectId={project.id}
                messages={messages}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            ),
          },
          {
            id: "activite",
            label: "Activité",
            icon: <Clock />,
            badge: events.length,
            content: <ProjectEventLog events={events} />,
          },
        ]}
      />
    </div>
  );
}

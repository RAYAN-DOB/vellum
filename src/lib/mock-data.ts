import type { Deliverable } from "@/types/deliverable";
import type { Project } from "@/types/project";
import type { ProjectRequest } from "@/types/request";
import type { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "user-client-demo",
    name: "Claire Martin",
    email: "claire.martin@example.com",
    role: "client",
    organizationId: "org-demo-atelier",
    status: "active",
    ndaAccepted: true,
    createdAt: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "user-pm-demo",
    name: "Samir Bernard",
    email: "samir.bernard@example.com",
    role: "project_manager",
    organizationId: "org-demo-platform",
    status: "active",
    ndaAccepted: true,
    createdAt: "2026-05-02T09:00:00.000Z",
  },
  {
    id: "user-drafter-demo",
    name: "Nora Petit",
    email: "nora.petit@example.com",
    role: "drafter",
    organizationId: "org-demo-platform",
    status: "active",
    ndaAccepted: true,
    createdAt: "2026-05-03T09:00:00.000Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "project-demo-001",
    reference: "DEMO-PLAN-001",
    name: "Reprise de plans fictifs pour espace tertiaire",
    description:
      "Projet de demonstration sans donnees client ni document technique reel.",
    organizationId: "org-demo-atelier",
    clientId: "user-client-demo",
    projectManagerId: "user-pm-demo",
    drafterIds: ["user-drafter-demo"],
    status: "in_progress",
    confidentiality: "nda_required",
    createdAt: "2026-05-05T10:00:00.000Z",
    updatedAt: "2026-05-12T14:30:00.000Z",
  },
];

export const mockRequests: ProjectRequest[] = [
  {
    id: "request-demo-001",
    projectId: "project-demo-001",
    createdById: "user-client-demo",
    title: "Corriger un plan PDF fictif",
    type: "pdf_correction",
    priority: "normal",
    status: "assigned",
    summary:
      "Demande fictive utilisee pour tester le parcours MVP sans fichier sensible.",
    expectedFormats: ["PDF", "DWG"],
    hasMockAttachments: true,
    createdAt: "2026-05-06T08:45:00.000Z",
    updatedAt: "2026-05-13T11:20:00.000Z",
  },
];

export const mockDeliverables: Deliverable[] = [
  {
    id: "deliverable-demo-001",
    projectId: "project-demo-001",
    requestId: "request-demo-001",
    title: "Version de demonstration non telechargeable",
    format: "pdf",
    status: "under_review",
    submittedById: "user-drafter-demo",
    reviewedById: "user-pm-demo",
    mockFileName: "demo-livrable-non-sensible.pdf",
    isSensitive: false,
    createdAt: "2026-05-14T16:00:00.000Z",
    updatedAt: "2026-05-15T09:30:00.000Z",
  },
];

export const mockDashboardStats = {
  activeProjects: mockProjects.length,
  openRequests: mockRequests.filter((request) => request.status !== "closed")
    .length,
  pendingDeliverables: mockDeliverables.filter(
    (deliverable) => deliverable.status === "under_review",
  ).length,
};

export const mockDataNotice =
  "Donnees fictives uniquement. Aucun fichier client, DWG, PDF, croquis ou document sensible reel n'est present dans ce MVP.";

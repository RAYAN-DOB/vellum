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
  {
    id: "user-admin-demo",
    name: "Alex Moreau",
    email: "alex.moreau@example.com",
    role: "admin",
    organizationId: "org-demo-platform",
    status: "active",
    ndaAccepted: true,
    createdAt: "2026-05-04T09:00:00.000Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "project-demo-001",
    reference: "DEMO-PLAN-001",
    name: "Reprise de plans fictifs pour espace tertiaire",
    description:
      "Dossier demo pour montrer le suivi d'une reprise de plans sans donnee client ni document reel.",
    organizationId: "org-demo-atelier",
    clientId: "user-client-demo",
    projectManagerId: "user-pm-demo",
    drafterIds: ["user-drafter-demo"],
    status: "in_progress",
    confidentiality: "nda_required",
    createdAt: "2026-05-05T10:00:00.000Z",
    updatedAt: "2026-05-12T14:30:00.000Z",
  },
  {
    id: "project-demo-002",
    reference: "DEMO-CROQUIS-002",
    name: "Formalisation fictive de croquis interieur",
    description:
      "Exemple de projet ou un croquis serait transforme en livrable structure, sans fichier reel en V1.",
    organizationId: "org-demo-atelier",
    clientId: "user-client-demo",
    projectManagerId: "user-pm-demo",
    drafterIds: ["user-drafter-demo"],
    status: "review",
    confidentiality: "standard",
    createdAt: "2026-05-08T10:00:00.000Z",
    updatedAt: "2026-05-15T16:10:00.000Z",
  },
  {
    id: "project-demo-003",
    reference: "DEMO-DWG-003",
    name: "Preparation fictive de reprise DWG",
    description:
      "Cas demo pour illustrer une demande DWG prioritaire avec confidentialite renforcee.",
    organizationId: "org-demo-atelier",
    clientId: "user-client-demo",
    status: "intake",
    confidentiality: "restricted",
    createdAt: "2026-05-16T08:30:00.000Z",
    updatedAt: "2026-05-16T08:30:00.000Z",
    drafterIds: [],
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
    confidentiality: "nda_required",
    requesterRole: "client",
    summary:
      "Correction a cadrer sur un plan PDF de demonstration, sans piece jointe reelle.",
    expectedFormats: ["PDF", "DWG"],
    desiredDueDate: "2026-05-28",
    hasMockAttachments: true,
    createdAt: "2026-05-06T08:45:00.000Z",
    updatedAt: "2026-05-13T11:20:00.000Z",
  },
  {
    id: "request-demo-002",
    projectId: "project-demo-002",
    createdById: "user-pm-demo",
    title: "Clarifier un brief de croquis fictif",
    type: "project_brief",
    priority: "high",
    status: "waiting_review",
    confidentiality: "standard",
    requesterRole: "project_manager",
    summary:
      "Brief a clarifier avant production pour limiter les allers-retours.",
    expectedFormats: ["PDF"],
    desiredDueDate: "2026-06-03",
    hasMockAttachments: false,
    createdAt: "2026-05-11T13:20:00.000Z",
    updatedAt: "2026-05-15T10:00:00.000Z",
  },
  {
    id: "request-demo-003",
    projectId: "project-demo-003",
    createdById: "user-client-demo",
    title: "Preparer une reprise DWG fictive",
    type: "dwg_creation",
    priority: "urgent",
    status: "qualified",
    confidentiality: "restricted",
    requesterRole: "client",
    summary:
      "Demande prioritaire qui montre le futur besoin de droits projet stricts.",
    expectedFormats: ["DWG", "PDF"],
    desiredDueDate: "2026-05-24",
    hasMockAttachments: false,
    createdAt: "2026-05-16T09:15:00.000Z",
    updatedAt: "2026-05-16T12:35:00.000Z",
  },
];

export const mockDeliverables: Deliverable[] = [
  {
    id: "deliverable-demo-001",
    projectId: "project-demo-001",
    requestId: "request-demo-001",
    title: "Livrable PDF de demonstration",
    format: "pdf",
    status: "under_review",
    submittedById: "user-drafter-demo",
    reviewedById: "user-pm-demo",
    mockFileName: "demo-livrable-non-sensible.pdf",
    isSensitive: false,
    createdAt: "2026-05-14T16:00:00.000Z",
    updatedAt: "2026-05-15T09:30:00.000Z",
  },
  {
    id: "deliverable-demo-002",
    projectId: "project-demo-002",
    requestId: "request-demo-002",
    title: "Planche de synthese a corriger",
    format: "image",
    status: "changes_requested",
    submittedById: "user-drafter-demo",
    reviewedById: "user-pm-demo",
    mockFileName: "demo-planche-synthese-non-sensible.png",
    isSensitive: false,
    createdAt: "2026-05-15T12:20:00.000Z",
    updatedAt: "2026-05-16T09:40:00.000Z",
  },
  {
    id: "deliverable-demo-003",
    projectId: "project-demo-001",
    requestId: "request-demo-001",
    title: "Archive de controle interne fictive",
    format: "zip",
    status: "draft",
    submittedById: "user-drafter-demo",
    mockFileName: "demo-controle-interne-non-sensible.zip",
    isSensitive: false,
    createdAt: "2026-05-16T15:00:00.000Z",
    updatedAt: "2026-05-16T15:00:00.000Z",
  },
];

export const mockDashboardStats = {
  activeProjects: mockProjects.length,
  openRequests: mockRequests.filter((request) => request.status !== "closed")
    .length,
  pendingDeliverables: mockDeliverables.filter(
    (deliverable) => deliverable.status === "under_review",
  ).length,
  restrictedProjects: mockProjects.filter(
    (project) => project.confidentiality === "restricted",
  ).length,
};

export const mockDataNotice =
  "V1 front statique uniquement : donnees fictives, aucun vrai DWG/PDF/plan, pas d'upload, pas d'auth, pas de backend et pas de securite serveur active.";

export const mockHistory = {
  requests: [
    {
      date: "2026-05-16 09:15",
      label: "Demande creee",
      detail: "Le besoin est structure avec projet, formats, priorite et confidentialite.",
    },
    {
      date: "2026-05-16 12:35",
      label: "Qualification mockee",
      detail: "Le chef de projet verifierait le contexte avant assignation.",
    },
    {
      date: "2026-05-17 10:10",
      label: "Assignation simulee",
      detail: "Assignation illustrative : aucune permission serveur n'est appliquee en V1.",
    },
  ],
  projects: [
    {
      date: "2026-05-08 10:00",
      label: "Projet ouvert",
      detail: "Le dossier centralise les demandes, statuts et livrables associes.",
    },
    {
      date: "2026-05-12 14:30",
      label: "Confidentialite revue",
      detail: "Le niveau de confidentialite prepare les futures regles d'acces.",
    },
    {
      date: "2026-05-16 16:20",
      label: "Revue de statut",
      detail: "Changement de statut visible en demo, non persiste en base.",
    },
  ],
  deliverables: [
    {
      date: "2026-05-14 16:00",
      label: "Livrable mocke cree",
      detail: "Nom de fichier fictif uniquement, aucun document present dans public/.",
    },
    {
      date: "2026-05-15 09:30",
      label: "Revue fictive",
      detail: "La revue illustre le futur circuit de validation.",
    },
    {
      date: "2026-05-16 15:00",
      label: "Controle interne",
      detail: "Trace illustrative pour preparer le futur journal d'audit.",
    },
  ],
} as const;

export const mockPermissionMatrix = [
  {
    role: "Client",
    project: "Voir ses projets",
    request: "Creer et suivre ses demandes",
    deliverable: "Relire les livrables autorises",
    file: "Aucun acces reel au MVP",
  },
  {
    role: "Chef de projet",
    project: "Coordonner les projets assignes",
    request: "Qualifier, assigner, commenter",
    deliverable: "Revoir et demander corrections",
    file: "Acces prive a construire en V2",
  },
  {
    role: "Dessinateur",
    project: "Voir les projets assignes",
    request: "Mettre a jour les demandes assignees",
    deliverable: "Soumettre des livrables fictifs",
    file: "Aucun upload reel",
  },
  {
    role: "Admin",
    project: "Vue globale mockee",
    request: "Vue globale mockee",
    deliverable: "Vue globale mockee",
    file: "Pas de privilege reel sans backend",
  },
] as const;

import type { Deliverable } from "@/types/deliverable";
import type { ProjectFile } from "@/types/file";
import type { ProjectMessage } from "@/types/message";
import type { Project } from "@/types/project";
import type { QuotePreview } from "@/types/quote";
import type { ProjectRequest } from "@/types/request";
import type { User } from "@/types/user";
import type { TeamCapacity, WorkflowStep } from "@/types/workflow";

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

export const mockProjectFiles: ProjectFile[] = [
  {
    id: "file-demo-dwg",
    projectId: "project-demo-001",
    name: "Plan existant - niveau 1.dwg",
    type: "dwg",
    status: "mock_ready",
    confidentiality: "nda_required",
    sizeLabel: "2.8 Mo",
    description: "Fichier fictif pour illustrer un plan source DWG.",
    isMockOnly: true,
  },
  {
    id: "file-demo-pdf",
    projectId: "project-demo-001",
    name: "Annotations client.pdf",
    type: "pdf",
    status: "needs_context",
    confidentiality: "nda_required",
    sizeLabel: "740 Ko",
    description: "PDF fictif avec corrections attendues.",
    isMockOnly: true,
  },
  {
    id: "file-demo-sketch",
    projectId: "project-demo-002",
    name: "Croquis circulation.jpg",
    type: "sketch",
    status: "review_only",
    confidentiality: "standard",
    sizeLabel: "1.1 Mo",
    description: "Croquis non sensible utilise pour la demo.",
    isMockOnly: true,
  },
  {
    id: "file-demo-elec",
    projectId: "project-demo-003",
    name: "Schema elec a reprendre.pdf",
    type: "electrical_schema",
    status: "not_uploaded",
    confidentiality: "restricted",
    sizeLabel: "Mock",
    description: "Emplacement prevu pour schema electrique futur.",
    isMockOnly: true,
  },
  {
    id: "file-demo-plumbing",
    projectId: "project-demo-003",
    name: "Schema plomberie - principe.png",
    type: "plumbing_schema",
    status: "not_uploaded",
    confidentiality: "restricted",
    sizeLabel: "Mock",
    description: "Emplacement prevu pour schema plomberie futur.",
    isMockOnly: true,
  },
  {
    id: "file-demo-photo",
    projectId: "project-demo-002",
    name: "Photos site - reperage.zip",
    type: "site_photo",
    status: "review_only",
    confidentiality: "standard",
    sizeLabel: "5 photos",
    description: "Lot fictif de photos de site.",
    isMockOnly: true,
  },
  {
    id: "file-demo-note",
    projectId: "project-demo-001",
    name: "Notes projet et contraintes.txt",
    type: "project_note",
    status: "mock_ready",
    confidentiality: "nda_required",
    sizeLabel: "Texte",
    description: "Notes de cadrage fictives.",
    isMockOnly: true,
  },
];

export const mockProjectMessages: ProjectMessage[] = [
  {
    id: "msg-demo-001",
    projectId: "project-demo-001",
    authorName: "Claire Martin",
    authorRole: "client",
    kind: "client_question",
    body: "Je souhaite faire reprendre le plan PDF et obtenir une version propre avec les zones techniques bien separees.",
    timestamp: "2026-05-16 09:20",
    isMockOnly: true,
  },
  {
    id: "msg-demo-002",
    projectId: "project-demo-001",
    authorName: "Samir Bernard",
    authorRole: "project_manager",
    kind: "manager_reply",
    body: "La demande est claire. Il faudra confirmer les formats finaux attendus avant assignation architecte.",
    timestamp: "2026-05-16 11:45",
    isMockOnly: true,
  },
  {
    id: "msg-demo-003",
    projectId: "project-demo-001",
    authorName: "Nora Petit",
    authorRole: "drafter",
    kind: "architect_question",
    body: "Je peux preparer un apercu de principe. Question a poser : les annotations rouges sont-elles toutes prioritaires ?",
    timestamp: "2026-05-17 10:10",
    isMockOnly: true,
  },
  {
    id: "msg-demo-004",
    projectId: "project-demo-001",
    authorName: "Systeme V1",
    authorRole: "system",
    kind: "system_note",
    body: "Conversation mockee : aucun message n'est sauvegarde en base.",
    timestamp: "2026-05-17 10:12",
    isMockOnly: true,
  },
];

export const mockWorkflowSteps: WorkflowStep[] = [
  {
    id: "deposit",
    label: "Depot projet",
    owner: "client",
    description: "Le client decrit son besoin et prepare ses documents en mock.",
    isActive: true,
  },
  {
    id: "qualification",
    label: "Qualification manager",
    owner: "manager",
    description: "Le manager verifie le scope, les documents et la confidentialite.",
  },
  {
    id: "assignment",
    label: "Assignation architecte",
    owner: "manager",
    description: "Affectation selon charge, competence et disponibilite.",
  },
  {
    id: "production",
    label: "Production",
    owner: "architect",
    description: "Preparation d'un apercu ou d'une version de travail.",
  },
  {
    id: "preview_validation",
    label: "Validation apercu",
    owner: "client",
    description: "Le client valide l'orientation avant devis.",
  },
  {
    id: "quote",
    label: "Devis",
    owner: "manager",
    description: "Devis mocke en V1, paiement prevu plus tard.",
  },
  {
    id: "secure_delivery",
    label: "Livraison securisee",
    owner: "admin",
    description: "Transmission finale a construire en V2 avec stockage prive.",
  },
];

export const mockTeamCapacity: TeamCapacity[] = [
  {
    id: "capacity-architect-01",
    name: "Nora Petit",
    roleLabel: "Architecte / dessinatrice",
    skills: ["DWG", "PDF", "Reprise technique"],
    loadLabel: "62% charge",
    availability: "available",
  },
  {
    id: "capacity-architect-02",
    name: "Yanis Morel",
    roleLabel: "Architecte reseaux",
    skills: ["Schema elec", "Schema plomberie", "Synthese"],
    loadLabel: "84% charge",
    availability: "busy",
  },
  {
    id: "capacity-manager-01",
    name: "Samir Bernard",
    roleLabel: "Manager projet",
    skills: ["Qualification", "Devis", "Relation client"],
    loadLabel: "3 demandes a qualifier",
    availability: "review",
  },
];

export const mockQuotePreviews: QuotePreview[] = [
  {
    id: "quote-demo-001",
    projectId: "project-demo-001",
    status: "draft",
    label: "Devis a preparer apres validation de l'apercu",
    amountLabel: "Non chiffre en V1",
    note: "Le paiement et les devis reels seront ajoutes en V2.",
    isMockOnly: true,
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

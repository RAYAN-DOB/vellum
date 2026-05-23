export type WorkflowRole = "client" | "manager" | "architect" | "admin";

export type ProductWorkflowStatus =
  | "draft"
  | "sent"
  | "to_qualify"
  | "manager_review"
  | "assigned"
  | "in_production"
  | "client_question"
  | "preview_sent"
  | "quote_review"
  | "payment_future"
  | "deliverables_ready"
  | "done";

export type WorkflowStatusMeta = {
  id: ProductWorkflowStatus;
  label: string;
  description: string;
  owner: WorkflowRole;
  nextAction: string;
  dateLabel: string;
  tone: "neutral" | "green" | "amber" | "red" | "blue";
};

export const workflowStatuses: WorkflowStatusMeta[] = [
  {
    id: "draft",
    label: "Brouillon",
    description: "Le client rassemble son besoin, ses contraintes et les pieces fictives.",
    owner: "client",
    nextAction: "Completer le brief",
    dateLabel: "Maintenant",
    tone: "neutral",
  },
  {
    id: "sent",
    label: "Envoye",
    description: "La demande est transmise a l'equipe sous forme de dossier structure.",
    owner: "client",
    nextAction: "Attendre qualification",
    dateLabel: "J+0",
    tone: "green",
  },
  {
    id: "to_qualify",
    label: "A qualifier",
    description: "Le manager verifie formats, delai, niveau de confidentialite et priorite.",
    owner: "manager",
    nextAction: "Qualifier ou demander precision",
    dateLabel: "J+1",
    tone: "amber",
  },
  {
    id: "manager_review",
    label: "Analyse manager",
    description: "La demande est transformee en scope metier, charges et risques.",
    owner: "manager",
    nextAction: "Preparer devis ou assigner",
    dateLabel: "J+1",
    tone: "amber",
  },
  {
    id: "assigned",
    label: "Assigne",
    description: "Un architecte ou dessinateur est choisi selon disponibilite et competence.",
    owner: "architect",
    nextAction: "Analyser les documents",
    dateLabel: "J+2",
    tone: "blue",
  },
  {
    id: "in_production",
    label: "En production",
    description: "L'equipe produit un apercu, une version de travail ou un livrable.",
    owner: "architect",
    nextAction: "Transmettre un apercu",
    dateLabel: "J+3",
    tone: "blue",
  },
  {
    id: "client_question",
    label: "Question client",
    description: "Une precision est necessaire avant de continuer proprement.",
    owner: "client",
    nextAction: "Repondre dans le fil projet",
    dateLabel: "J+3",
    tone: "amber",
  },
  {
    id: "preview_sent",
    label: "Apercu transmis",
    description: "Le client peut valider l'orientation avant devis ou production finale.",
    owner: "client",
    nextAction: "Valider ou demander correction",
    dateLabel: "J+4",
    tone: "green",
  },
  {
    id: "quote_review",
    label: "Devis a valider",
    description: "Le devis reste mocke en V1 ; aucun paiement n'est disponible.",
    owner: "client",
    nextAction: "Valider l'orientation mockee",
    dateLabel: "J+4",
    tone: "amber",
  },
  {
    id: "payment_future",
    label: "Paiement futur",
    description: "Etape prevue pour la V2, non active dans cette demo front.",
    owner: "admin",
    nextAction: "A construire cote serveur",
    dateLabel: "V2",
    tone: "neutral",
  },
  {
    id: "deliverables_ready",
    label: "Livrables prets",
    description: "Les fichiers finaux seraient transmis dans un espace prive.",
    owner: "client",
    nextAction: "Telechargement futur securise",
    dateLabel: "V2",
    tone: "green",
  },
  {
    id: "done",
    label: "Termine",
    description: "Projet archive avec historique, audit et versions.",
    owner: "admin",
    nextAction: "Consulter l'historique",
    dateLabel: "V2",
    tone: "neutral",
  },
];

export const roleHandoffSteps = [
  {
    role: "Client",
    label: "Depot du besoin",
    detail: "Brief naturel, documents fictifs et attentes de livrable.",
  },
  {
    role: "Manager",
    label: "Qualification",
    detail: "Scope, delai, confidentialite, devis et assignation.",
  },
  {
    role: "Architecte",
    label: "Production",
    detail: "Analyse des pieces, questions client, apercu et livrables.",
  },
  {
    role: "Client",
    label: "Validation",
    detail: "Apercu, corrections, devis mocke et livrables futurs.",
  },
] as const;

export const quoteLineItems = [
  {
    label: "Analyse documents et cadrage",
    detail: "Lecture PDF/DWG/croquis, synthese et risques.",
    amount: "180 EUR",
  },
  {
    label: "Reprise plan technique",
    detail: "Nettoyage, cotations, calques et version de travail.",
    amount: "540 EUR",
  },
  {
    label: "Apercu client et corrections",
    detail: "Capture annotee, retour client et ajustements mineurs.",
    amount: "220 EUR",
  },
] as const;

export const mockNotifications = [
  {
    id: "notif-001",
    title: "Nouvelle demande recue",
    detail: "DEMO-DWG-003 attend une qualification manager.",
    tone: "amber",
  },
  {
    id: "notif-002",
    title: "Question architecte",
    detail: "Nora demande une precision sur les annotations rouges.",
    tone: "blue",
  },
  {
    id: "notif-003",
    title: "Apercu disponible",
    detail: "Un apercu fictif est pret pour validation client.",
    tone: "green",
  },
] as const;

export const commandActions = [
  { label: "Nouveau projet", href: "/client/nouveau-projet", hint: "Client" },
  { label: "Rechercher un projet", href: "/client/projets", hint: "Global" },
  { label: "Ouvrir projet demo", href: "/client/projets/project-demo-001", hint: "Projet" },
  { label: "Demandes entrantes", href: "/chef-projet", hint: "Manager" },
  { label: "Devis mocke", href: "/chef-projet/devis", hint: "Manager" },
  { label: "Espace architecte", href: "/dessinateur", hint: "Production" },
  { label: "Permissions", href: "/dashboard/permissions", hint: "Admin" },
  { label: "Messages client", href: "/client/messages", hint: "Inbox" },
] as const;

# Vellum — État du site (audit style, thèmes & animation)

Vellum est un SaaS B2B où un dessinateur professionnel transforme un croquis, une photo ou un cahier des charges en plans techniques 2D, schémas et aperçus 3D. Le client obtient un devis clair **avant** tout paiement, les corrections sont suivies jusqu'à validation, et les fichiers sont livrés en PDF + DWG. La plateforme s'organise en 4 espaces : **client**, **manager** (chef de projet), **dessinateur / studio (atelier)** et **admin**.

**Stack technique** : Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4 + framer-motion 12 + Supabase (auth, RLS, storage) + lucide-react. Hébergement sur Vercel.

**Direction artistique actuelle — « Atelier Émeraude »** : matérialité du dessin technique (papier / encre / cartouche / cotations / calques), accent émeraude `#0f766e` rationné, **jamais d'orange**. Esthétique sobre, précise, « drafting » : papier à dessin (vellum / paper) + encre noire (ink) + encre émeraude (pine).

Ce document dresse l'inventaire complet du site existant (architecture, pages publiques, espaces connectés, design system, animations, logique métier). **Il sert à recueillir les recommandations d'un expert design / UI / motion** — en priorité sur les styles, les variations de thèmes, les animations, les fonds animés/mouvants, le mouvement et l'émotion. Le commanditaire trouve le site trop statique, sans émotion, et craint que le client n'accroche pas et ne fasse pas confiance.

---

## 1. Architecture & arborescence

### Structure des répertoires `src/`

```
src/
├── app/              Routes Next.js - structure compartimentée par espaces
├── components/       Composants réutilisables et métier partitionnés par domaine
├── lib/              Logique applicative, actions serveur, authentification, utilitaires
└── types/            Typages métier partagés (roles, permissions, entities)
```

**Rôle de chaque dossier :**

- **`src/app/`** : Routes Next.js 16 (App Router). Pages, layouts, métadonnées, route handlers, et fichiers spéciaux (error, loading, template, opengraph-image).
- **`src/components/`** : Composants React réutilisables organisés par domaine métier et technique (ui primitifs, shells navigables, pages métier).
- **`src/lib/`** : Services, actions serveur, utilitaires métier (auth, permissions, projets, devis, paiements, emails). Inclut le client Supabase, le mocking, les estimateurs.
- **`src/types/`** : Typages TypeScript partagés (User, Project, Quote, Deliverable, Message, Workflow, Roles, Permissions).

### Arborescence détaillée — `src/app/` (routes et layouts)

**Niveau racine :**
- `layout.tsx` — Layout racine avec polices Google (Inter, JetBrains_Mono, Playfair), Toaster globale, Metadata SEO
- `template.tsx` — Template de transition animée (`page-enter`) qui se remonte à chaque navigation
- `page.tsx` — Page d'accueil publique (Landing avec `LandingPage` component)
- `opengraph-image.tsx` — Image OpenGraph dynamique (1200×630) pour partages réseaux

**Public :**
- `deposer-un-projet/page.tsx` — Page de dépôt sans authentification (flux `PublicProjectDepositFlow`)
- `unauthorized/page.tsx` — Page d'accès refusé avec raison et boutons contextuels

**Auth (groupe de route `(auth)`) :**
- `(auth)/login/page.tsx` → `/login` — Connexion avec `SignInForm`, redirect vers `defaultRouteForRole(user)`
- `(auth)/register/page.tsx` → `/register` — Inscription avec `SignUpForm` et brouillon repris
- `(auth)/forgot-password/page.tsx` → `/forgot-password` — Réinitialisation avec sécurité (pas de confirmation d'existence)

**Legal (groupe de route `(legal)`, layout personnalisé) :**
- `(legal)/layout.tsx` — Layout avec `PublicHeader`, `Footer`, grille background, max-width 3xl
- `(legal)/conditions/page.tsx` → `/conditions` — Conditions d'utilisation (6 sections)
- `(legal)/confidentialite/page.tsx` → `/confidentialite` — Politique confidentialité
- `(legal)/mentions-legales/page.tsx` → `/mentions-legales` — Mentions légales

**Client (groupe implicite, authentification requise) :**
- `client/page.tsx` → `/client` — Dashboard client principal (cockpit, projets, unread count)
- `client/error.tsx` / `client/loading.tsx` — Boundary erreur + fallback loading
- `client/projets/page.tsx` → `/client/projets` — Tous les projets du client
- `client/projets/[projectId]/page.tsx` → `/client/projets/:id` — Détail projet (tabs, timeline, conversations)
- `client/projets/[projectId]/documents/[documentId]/page.tsx` — Détail document
- `client/devis/page.tsx` → `/client/devis` — Liste devis acceptés/refusés/en attente
- `client/devis/[quoteId]/page.tsx` → `/client/devis/:id` — Détail devis (PDF, acceptation, refus, précisions)
- `client/documents/page.tsx` → `/client/documents` — Vue documents consolidée (en construction)
- `client/livrables/page.tsx` → `/client/livrables` — Fichiers livrables téléchargeables
- `client/messages/page.tsx` → `/client/messages` — Conversation avec équipe (chat par projet)
- `client/onboarding/page.tsx` → `/client/onboarding` — Flow onboarding premier accès
- `client/nouveau-projet/page.tsx` → `/client/nouveau-projet` — Déposer un nouveau projet
- `client/parametres/page.tsx` → `/client/parametres` — Paramètres profil/compte

**Manager (groupe implicite, authentification + rôle requis) :**
- `manager/page.tsx` → `/manager` — Cockpit principal (qualification, assignation, charge équipe)
- `manager/error.tsx` / `manager/loading.tsx` — Boundary erreur + fallback loading
- `manager/projets/page.tsx` + `manager/projets/[projectId]/page.tsx` — Liste + détail projet (contrôle, statuts, timeline)
- `manager/devis/page.tsx` → `/manager/devis` — Gestion devis (création, envoi, tracking)
- `manager/assignations/page.tsx` → `/manager/assignations` — Assignation équipe architectes
- `manager/equipe/page.tsx` → `/manager/equipe` — Gestion et charge équipe (capacité, congés, skills)
- `manager/messages/page.tsx` → `/manager/messages` — Communication (clients, équipe, broadcast)
- `manager/demandes/page.tsx` → `/manager/demandes` — Inbox des demandes entrantes
- `manager/reporting/page.tsx` → `/manager/reporting` — Reporting métier (KPIs, timing, qualité)

**Studio / Atelier (groupe implicite, rôle architect/manager/admin) :**
- `studio/page.tsx` → `/studio` — Cockpit architecte (projets assignés, priorités, statuts)
- `studio/error.tsx` / `studio/loading.tsx` — Boundary erreur + fallback loading
- `studio/projets/page.tsx` + `studio/projets/[projectId]/page.tsx` — Liste + détail projet (brief, documents reçus, statut prod)
- `studio/documents/page.tsx` → `/studio/documents` — Documents reçus (filtrage, recherche)
- `studio/livrables/page.tsx` → `/studio/livrables` — Livrables à produire / prêts à envoyer
- `studio/taches/page.tsx` → `/studio/taches` — Kanban ou liste tâches (croquis, plans, rendus)
- `studio/messages/page.tsx` → `/studio/messages` — Chat client + équipe interne
- `studio/planning/page.tsx` → `/studio/planning` — Timeline collaboratif / gantt
- `studio/parametres/page.tsx` → `/studio/parametres` — Préférences architecte

**Admin (groupe implicite, rôle admin strict) :**
- `admin/page.tsx` → `/admin` — Cockpit d'administration globale (métriques, revenue, contrôles rapides)
- `admin/error.tsx` / `admin/loading.tsx` — Boundary erreur + fallback loading
- `admin/users/page.tsx` → `/admin/users` — Gestion utilisateurs (liste, activation, rôles, 2FA)
- `admin/roles/page.tsx` → `/admin/roles` — Matrice rôles/permissions (RLS)
- `admin/permissions/page.tsx` → `/admin/permissions` — Catalogue permissions (clés reconnues par l'app)
- `admin/policies/page.tsx` → `/admin/policies` — Politiques globales (workflows, notifications, branding)
- `admin/projects/page.tsx` → `/admin/projects` — Tous les projets (supervision, interventions)
- `admin/audit/page.tsx` → `/admin/audit` — Audit log immuable (connexions, changements rôle, exports)
- `admin/settings/page.tsx` → `/admin/settings` — Configuration instance (domaine, emails, limites)

**Checkout (flux de paiement/souscription) :**
- `checkout/confirmation/page.tsx` → `/checkout/confirmation` — Confirmation avant paiement
- `checkout/success/page.tsx` → `/checkout/success` — Confirmation après paiement réussi

**API Routes (route handlers) :**
- `api/quotes/[quoteId]/pdf/` — Génération PDF devis
- `api/auth/callback/` — Callback OAuth/SAML

### `src/components/` — composants partitionnés

- **Shells (navigations rôle)** : `shells/ClientShell.tsx`, `shells/ManagerShell.tsx`, `shells/StudioShell.tsx`, `shells/AdminShell.tsx`
- **Auth** : `auth/AuthShell.tsx`, `SignInForm.tsx`, `SignUpForm.tsx`, `ForgotPasswordForm.tsx`, `AuthInput.tsx`, `SignOutButton.tsx`
- **Layout** : `layout/PublicHeader.tsx`, `Footer.tsx`, `UserMenu.tsx`, `Container.tsx`
- **Marketing & Landing** : `marketing/LandingPage.tsx`, `ProductShowcase.tsx`, `WorkflowStrip.tsx`, `MotionSection.tsx`, `ProductDemoFilm.tsx`, `VellumPlanShowcase.tsx`
- **Dashboards (cockpits rôles)** : `client/ClientDashboard.tsx`, `manager/ManagerCockpit.tsx`, `architect/ArchitectCockpit.tsx`, `admin/AdminRevenueCockpit.tsx`
- **Project (métier)** : `project/ProjectHeader.tsx`, `ProjectTimeline.tsx`, `ProjectEventLog.tsx`, `ProjectActionsPanel.tsx`
- **Quotes** : `quotes/QuoteList.tsx` (+ autres composants devis)
- **Files** : `files/DocumentDownloadButton.tsx`, `DocumentInlinePreview.tsx`
- **UI Primitives** : `ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `StatusPill.tsx`, `EmptyState.tsx`, `SectionTitle.tsx`, `LayeredPanel.tsx`, `BorderBeam.tsx`, `Skeleton.tsx`, `Toaster.tsx`
- **Motion** : `motion/Reveal.tsx`, `CountUp.tsx`
- **Brand** : `brand/VellumLogo.tsx`
- **Intake (dépôt public)** : `intake/PublicProjectDepositFlow.tsx`
- **Onboarding** : `onboarding/ClientOnboardingFlow.tsx`
- **Command** : `command/CommandPalette.tsx` (Cmd+K)
- **Legal** : `legal/LegalDoc.tsx`
- **Admin** : `admin/PermissionMatrix.tsx`, `PolicyEditor.tsx`, `UserTable.tsx`
- **Settings** : `settings/ProfileSettingsForm.tsx`
- **Autres** : `notifications/NotificationBell.tsx`, `domain/`, `charts/` (recharts), `checkout/`, `three/` (Three.js 3D), `atelier/` (design Atelier Émeraude), `architect/`, `forms/`, `dashboard/`

### `src/lib/` — logique applicative

- **Auth & Permissions** : `auth.ts` (`getCurrentUser()`, `requireRole()`, `defaultRouteForRole()`, `roleLabels`), `permissions.ts` (`can(actor, action, resource)`)
- **Supabase** : `supabase/server.ts`, `supabase/client.ts`
- **Business Logic** : `projects.ts`, `quotes.ts`, `payments.ts`, `emails.ts`, `brief-score.ts`, `estimator.ts`, `project-display.ts`
- **Server Actions** : `actions/auth.ts`, `actions/projects.ts`, `actions/quotes.ts`, `actions/profile.ts`, `actions/admin.ts`
- **Client Utilities** : `client/upload.ts`, `motion.ts`, `intake-draft.ts`, `designer-presets.ts`
- **Configuration & Routing** : `routes.ts`, `site-url.ts`, `business-config.ts`

### `src/types/` — typages partagés

`database.ts`, `user.ts`, `project.ts`, `quote.ts`, `deliverable.ts`, `message.ts`, `roles.ts` (`"client" | "manager" | "architect" | "admin"`), `permissions.ts`, `request.ts`, `file.ts`, `workflow.ts`.

### Patterns et conventions

- **Auth & Permissions** : `requireRole(role | role[])` redirect `/unauthorized` ou `/login` ; `getCurrentUser()` pour pages publiques ; routes protégées par groupe implicite ; `defaultRouteForRole(role)` après login.
- **Data Loading** : Server Components par défaut (`async`), `createSupabaseServerClient()`, `Promise.all()` pour optimiser les waterfalls, upload mocké au MVP.
- **Styling** : Tailwind CSS 4 avec tokens Atelier Émeraude (vellum, iron, graphite, paper, ink, line) ; classes utilitaires `display`, `caption`, `grid-paper` ; motion via Framer Motion + View Transitions API.
- **Navigation** : Shells dédiés par rôle avec nav latérale ; routes définies dans `lib/routes.ts` (pas de hardcode) ; Links Next.js.

### Métadonnées globales (depuis `layout.tsx`)

- Title default : « Vellum — Dépôt et suivi de plans techniques », template « %s · Vellum »
- Description : « Déposez vos PDF, DWG, croquis ou photos. Un dessinateur analyse votre dossier… »
- OpenGraph locale `fr_FR`, type `website` ; Twitter card `summary_large_image` ; Favicon `/favicon.svg`

---

## 2. Pages publiques & marketing

### Vue générale

Le site public présente deux univers visuels distincts : l'**accueil et les sections marketing** sur fond papier clair (Atelier Papier/Encre), et le **tunnel de dépôt public** en mode dark (`#151410`). L'authentification emprunte le ton papier clair, épuré.

### A. Page d'accueil et sections marketing (LandingPage)

Fichier principal : `src/components/marketing/LandingPage.tsx`. Structurée en 10 sections qui défilent verticalement, toutes emballées avec `MotionSection` (fade + rise au scroll).

**1. Navbar / PublicHeader** (`src/components/layout/PublicHeader.tsx`)
- Navbar fixe flottante (4px inset), `bg-ink/90` + backdrop-blur-2xl, ombre douce (0 18px 70px rgba(0,0,0,0.34))
- Logo Vellum (`VellumLogo size="sm"`) + texte « Vellum » ; 6 liens md+ (sections #estimer, #demo, #workflow, #produit, #securite)
- Boutons droite : « Connexion » (text) + « Déposer un projet » (sienna CTA, ArrowRight)
- Animations : badge hover + transition couleur sur liens

**2. Hero section**
- Fond `bg-paper` + grid-paper-dense opacity-45, gradient fade top
- Layout grid lg (1.08fr | 0.92fr), centré vertical
- Texte gauche : badge « Vos plans réalisés par un dessinateur » (pine-tint, point animé), H1 display clamp(2.5rem → 4rem) « Un dessinateur réalise vos plans techniques. À partir d'un simple croquis. » (italic gris sur dernier mot), P descriptive 17px + hint 13px, 5 proof points (puces sienna)
- CTA : primaire gradient pine→canard (shadow, hover brightness), secondaire border (hover bg-vellum)
- Droite : Hero3D
- Animations : statique, Hero3D bouge au pointer

**3. Hero3D** (`src/components/three/Hero3D.tsx`)
- React Three Fiber (client, lazy), modèle 3D technique répondant à la souris (tilt CSS 3D léger), fallback SVG statique

**4. « Comment ça marche »**
- CartoucheHeader (eyebrow « Comment ça marche », meta « Vellum · 3 étapes »), 3 étapes en grid sm:grid-cols-3
- Connecteur animé : ligne horizontale avec point pine qui traverse (animate-flow, shadow glow)

**5. « Estimateur instantané » (InstantEstimate)** — `src/components/marketing/InstantEstimate.tsx`
- Client component, state Framer Motion ; cartouche « Estimation · 30 secondes »
- Gauche : configurateur (3 OptionRows : type de projet 7 choix, niveau détail, délai) ; droite : résultat (planche Atelier) avec border-beam, **CountUp** des chiffres, lien CTA, modal SampleQuoteModal
- Couleurs : active=pine-tint, inactive=paper, result bg=vellum/40

**6. « Prestations » (Deliverables)**
- CartoucheHeader + grid 3 colonnes dynamique depuis estimator ; carte (Spotlight) avec hover lift (shadow/scale)

**7. « Aperçu du dossier » (ProductDemoFilm)** — `src/components/marketing/ProductDemoFilm.tsx`
- Section id="demo", bg-paper + grid-paper opacity-40, planche de dessin (cartouche, extension lines, cadre)
- 5 beats cycliques (3.4s/beat) : Dépôt → Question → Devis (640+280+180=1100€) → Correction (annotation sienna) → Livrable (visa)
- Animations : entrée/sortie par beat (opacity + y8, staggerChildren), PlanThumb stroke drawn (pathLength 0→1), dimension line sienna, parenthetical cascadé
- Contrôles Play/Pause + slider dimension ; static pour reduced-motion (beat 05 figé) ; cartouche VLM-2418

**8. « TrustStrip » (marquee animé)** — bg-vellum/55, marquee infini 9 services dupliqués (animate-marquee)

**9. « Un dossier clair » (ProductShowcase)** — `src/components/marketing/ProductShowcase.tsx`
- Titre display, 4 piliers grid lg:grid-cols-4 (Déposez / Dessinateur analyse / Échangez / Téléchargez), hover bg-vellum/50

**10. « Workflow strip » (WorkflowStrip)** — `src/components/marketing/WorkflowStrip.tsx`
- Section id="workflow", bg-vellum + grid-paper opacity-50, 4 étapes grid lg:grid-cols-4 (number display 5xl)

**11. « Réassurance/Garanties »** — 3 cards (Devis clair avant paiement / Corrections incluses / Sans engagement), icon pine

**12. « Sécurité » (SecurityBlock)** — `src/components/marketing/SecurityBlock.tsx`
- 4 garanties grid lg:grid-cols-4 (fichiers privés / accès limité / échanges conservés / livrables disponibles)

**13. CTA final (FinalCta)** — bg-ink text-paper, grid pattern subtle, H2 display clamp(2.25rem → 4rem), CTA sienna + secondaire border paper

**14. Footer** (`src/components/layout/Footer.tsx`) — 4 colonnes (Brand / Produit / Navigation / Légal), copyright dynamique, bg-paper border-t

### B. Tunnel de dépôt public (PublicProjectDepositFlow)

Fichier : `src/components/intake/PublicProjectDepositFlow.tsx`. Client component massif (state localStorage).
- Fond dark `#151410` text `#fbfaf6`, radial gradient pine 18%/-10% (28% opacity), grid lg 1fr | 390px
- **5 étapes** : Besoin (7 boutons) → Description (textarea, min 20 car) → Fichiers (dropzone multiple) → Détails (livrable, deadline, urgency, toggles 3D/création, remarques) → Envoi (récapitulatif + CTA)
- Progress bar (h-px bg-#3b352e, motion width), step buttons (h-9 rounded-full, active=pine, complétés avec ✓), form pane (rounded 8px border-#3b352e bg-#1c1a16/90 backdrop-blur, grid-paper opacity-35)
- Animations : MotionDiv key={step}, slide ±28px (direction), opacity fade
- Sidebar sticky (lg:top-28) : card fixe bg-ink, image technical-plans SVG, badge sienna « DOSSIER BROUILLON », estimation indicative EUR + ~j, **BriefQualityMeter**
- État persistant `PUBLIC_PROJECT_DRAFT_KEY` (localStorage), fichiers mockés (pas réellement uploadés)
- **BriefQualityMeter** (`src/components/intake/BriefQualityMeter.tsx`) : score 0-100 (title, description length, fileCount, deadline, budget), badge couleur + tips

### C. Pages d'authentification

Layout partagé : `src/components/auth/AuthShell.tsx` (bg-paper + grid-paper opacity-60 + gradient fade top, header logo + « ← Accueil », main grid lg [1fr | 1fr], gauche titre display + benefits, droite `.sheet` card avec form).
- **Login** (`src/app/(auth)/login/page.tsx`) : « Retrouvez vos projets », SignInForm
- **Register** (`src/app/(auth)/register/page.tsx`) : « Créez votre espace de suivi », SignUpForm (brouillon repris)
- **Forgot Password** (`src/app/(auth)/forgot-password/page.tsx`) : « Réinitialisez l'accès », ForgotPasswordForm (sécurité : pas de confirmation d'existence)

### D. Pages légales

Wrapper : `src/components/legal/LegalDoc.tsx` (eyebrow, title, updated, intro, sections[]), fond paper identique à auth shell.
- **Confidentialité** (`src/app/(legal)/confidentialite/page.tsx`) : 6 sections (données, finalités, confidentialité fichiers, conservation, droits RGPD, cookies)
- **Conditions** (`src/app/(legal)/conditions/page.tsx`) : 6 sections (objet, espace, fichiers, bon usage, disponibilité, évolution)
- **Mentions légales** (`src/app/(legal)/mentions-legales/page.tsx`) : champs `[ ... ]` à compléter avant prod (raison sociale, forme juridique, siège, SIREN/RCS, email, directeur publication)

### Synthèse visuelle

**Atelier Papier/Encre (clair)** — Landing, auth, légal : fond `bg-paper` (#faf9f5) text `text-ink` (#0d0d0c), grid-paper opacity 40-60, accents pine / sienna / graphite / mute, borders line (#ebe8e1) et line-strong (#d8d2c7).

**Dépôt (dark)** — fond `#151410` text `#fbfaf6`, accent pine (#0f766e), grid-paper-dense opacity 35-55, borders #3b352e.

**Animations** (Framer Motion) : MotionSection fadeRise, ProductDemoFilm beats + stroke drawn, LivingBlueprintHero tilt 3D + revisions drifting, InstantEstimate CountUp, dépôt slide ±28px.

**Interactions** : hover (brightness, border, bg subtle, shadow lift), focus (ring-2 ring-pine/20), disabled (opacity 35-50), tap targets larges.

---

## 3. Espaces connectés (app authentifiée)

### Espace Client

**ClientShell** (8 sections, accent client Vellum) : Vue d'ensemble, Nouveau dépôt (CTA primaire), Mes projets, Documents, Devis, Livrables, Messages, Paramètres.

**Dashboard client** (`ClientDashboard.tsx` + `/app/client/page.tsx`) :
- Hero band (bienvenue par prénom + CTA, grid-paper subtle + gradient vellum)
- **À traiter** (section critique) : messages non-lus, projets « draft » / « review » avec CTAs contextualisés, animations cascade `<Reveal stagger>`, empty state rassurant (ShieldCheck)
- Stats row (3 cellules, CountUp animé)
- Projets récents (5 derniers, StatusPill, badge confidentialité, hover bordure ink + vellum/40, ArrowUpRight animée)
- Reprendre dernier projet (section vellum/40)

**Page projet détail** (`/app/client/projets/[projectId]/page.tsx` + `ProjectDetailView.tsx`) :
- ProjectHeader (breadcrumb, titre)
- **ProjectTracker** : 5 étapes linéaires (Reçu → Qualifié → En production → À valider → Livré), puce tonale (« À vous de jouer » / « Vellum s'en occupe » / « Livré » / « Annulé »), texte plain-French, audience-aware
- **ProjectWorkspaceTabs** : Aperçu / Fichiers / Messages / Activité ; underline animée pine glissante (spring stiffness 320), fade+rise opacity (duration 0.25, ease [0.16,1,0.3,1]), tous panels montés (subscriptions RT persistent)

Autres : Messages (inbox transversale), Paramètres (ProfileSettingsForm + SignOut), Onboarding (guided flow), Livrables/Documents (listage).

### Espace Manager (Chef de projet)

**ManagerShell** (8 sections, accent ink/neutre) : Cockpit, Demandes entrantes (CTA primaire), Projets, Assignations, Devis, Équipe, Messages, Reporting.

**ManagerCockpit** (`/app/manager/page.tsx`) — pipeline Kanban-like :
- Metric row (4 cellules dot accent : À qualifier amber / Qualifiés-assignés ink / En production-revue ink / Livrés-archivés moss), CountUp animé
- 4 groupes collapsible (Nouvelles demandes à qualifier / Prêts à assigner / Production en cours / Livrés & archivés), inline forms (status, assignee), Reveal stagger, lift hover

**Page projet détail manager** : même `ProjectDetailView` (eyebrow « Détail projet », audience="internal", canUpload=true, contrôle complet).

### Espace Studio/Atelier (Architecte/Dessinateur)

**StudioShell** (8 sections, accent warm/construction) : Atelier, Projets assignés, Documents, Tâches, Livrables, Planning, Messages, Paramètres.

**ArchitectCockpit** (`/app/studio/page.tsx`) — production-first :
- Empty state (Layers3) ; section « Projets actifs » (grid ProjectCard, lift hover, Reveal stagger) ; section « Livrés & archivés » (collapsed, liste compacte)

**Page projet détail architect** : même `ProjectDetailView` (eyebrow « Atelier », audience="internal", defense in depth `architect_id === user.id`, upload documents).

### Espace Admin

**AdminShell** (8 sections, accent control) : Tableau admin, Utilisateurs, Rôles, Permissions, Politiques, Projets (global), Audit, Paramètres.

**Admin Dashboard** (`/app/admin/page.tsx`) :
- Metric grid (4 cellules : Utilisateurs, Projets supervisés, Politiques actives, Audit 7 jours)
- **AdminRevenueCockpit** : metric row (CA réalisé, Devis envoyés, Panier moyen, Projets en retard crimson), grid chart (BarChart « Devis par statut » + Donut « Taux d'acceptation »)
- Quick access (4 cartes : Rôles & permissions / Catalogue permissions / Politiques / Audit log), warning band « Accès total — usage tracé »

### Composants clés transversaux

- **Shells par rôle** : `BaseShell` (chrome partagé, dark ink header, nav latérale, CommandPalette + NotificationBell + UserMenu, cartouche drafting-style) + instances spécialisées
- **ProjectTracker** : surface la plus critique pour la compréhension client (5-stage journey, plain-French next action, turn chip tonal, audience-aware, pure Server Component)
- **ProjectWorkspaceTabs** : « calque vivant », sliding pine underline (layoutId + spring), fade+rise (0.25), panels montés, respecte prefers-reduced-motion
- **ProjectDetailView** : orchestrateur (Header + Tracker + Tabs : Aperçu → ProjectActionsPanel, Fichiers → ProjectDocumentList, Messages → ProjectMessageThread real-time Supabase, Activité → ProjectEventLog)
- **ProjectMessageThread** : real-time (postgres_changes sur `project_messages`), quick replies, optimistic UI (id "temp-*"), toast sonner
- **QuoteSheet** : devis interactif (useMotionValue + useTransform), base + upsells, radio Acompte/Intégral, breakdown calculator, checkout href, StampBadge, BlueprintGrid

### Niveau d'animation et « vie » (côté app)

Motion system (`src/lib/motion.ts` + `Reveal.tsx`) : in-view fadeRise + staggerContainer (once, reduced-motion safe), workspace tabs underline spring + fade, cockpit cards Reveal stagger + lift, CountUp, QuoteSheet motion values.

**Overall feel** : calme, méthodique, technique (grid-paper, mono, blueprint colors) ; pas chaotique (pas d'explosion, pas de transitions full-page) ; feedback contextuel (toast, spinner, erreurs inline) ; real-time Supabase ; role-aware ; accessibility-first.

### Fichiers clés (chemins)

- **Shells & Layout** : `src/components/shells/BaseShell.tsx`, `ClientShell.tsx`, `ManagerShell.tsx`, `StudioShell.tsx`, `AdminShell.tsx`, `src/components/layout/Container.tsx`, `PublicHeader.tsx`, `Footer.tsx`, `UserMenu.tsx`
- **Project Workspace** : `src/components/project/ProjectDetailView.tsx`, `ProjectTracker.tsx`, `ProjectWorkspaceTabs.tsx`, `ProjectHeader.tsx`, `ProjectActionsPanel.tsx`, `ProjectDocumentList.tsx`, `ProjectMessageThread.tsx`, `ProjectEventLog.tsx`
- **Cockpits** : `src/components/client/ClientDashboard.tsx`, `manager/ManagerCockpit.tsx`, `architect/ArchitectCockpit.tsx`, `admin/AdminRevenueCockpit.tsx`
- **Quotes** : `src/components/quotes/QuoteSheet.tsx`
- **Atelier Design** : `src/components/atelier/BlueprintGrid.tsx`, `StampBadge.tsx`, `CartoucheHeader.tsx`, `GlowCard.tsx`, `AtelierCard.tsx`, `InkButton.tsx`
- **Motion** : `src/components/motion/Reveal.tsx`, `CountUp.tsx`, `src/lib/motion.ts`

---

## 4. Design system & styles

### (a) Variables de couleur — Palette Atelier Émeraude

Définies dans `src/app/globals.css`.

**Surface & Structure** : `--paper` #f8f8f4 (fond principal, jamais blanc pur) · `--vellum` #efefe8 (panneau papier) · `--vellum-dim` #e5e5db · `--line` #e0e1d6 (hairlines 1px) · `--line-strong` #d1d2c4 (séparateurs 1px).

**Typographie & Texte** : `--ink` #16191a (noir quasi-pur) · `--graphite` #2b2f2e (secondaire) · `--mute` #5e665f (tertiaire, captions) · `--soft` #99a09a (placeholders).

**Accent ATELIER ÉMERAUDE (dominant)** : `--pine` #0f766e (signature : liens, nav active, focus ring, ticks logo, border-beam, blueprint grids, Spotlight glow, InkButton) · `--pine-hover` #115e59 · `--pine-active` #134e4a · `--pine-tint` #e2efed (wash clair).

**Accents secondaires** : `--sage` #6f8f86 (validé/positif) · `--sage-soft` #dde9e6 · `--canard` #0e7490 (deep teal, liens secondaires).

**Sémantiques** : `--moss` #5f6f55 (done/delivered) · `--crimson` #8f3a3a (destructif désaturé, ni orange ni vif) · `--iron` #16191a (CTA primaire) · `--iron-hover` #2b2f2e.

**Aliases legacy** (pointent désormais vers pine — à migrer en prod) :
```css
--sienna: var(--pine);
--sienna-dark: var(--pine-hover);
--sienna-soft: var(--sage-soft);
--amber: var(--pine);
--clay: var(--pine);
```

**Aliases Tailwind (@theme inline)** : `--color-background: var(--paper)`, `--color-foreground: var(--ink)`, `--color-surface: var(--vellum)`, `--color-blueprint: var(--pine)`.

### (b) Typographie

Polices (`src/app/layout.tsx`) :
1. **Inter** (`--font-inter`) — body par défaut, poids 400-700, feature settings `"cv11","ss01","ss03"`, antialiased.
2. **Playfair Display** (`--font-playfair`) — display, classe `.display` (font-weight 400, letter-spacing 0, line-height 0.95), variant `.display-italic`.
3. **JetBrains Mono** (`--font-jetbrains-mono`) — technique, classe `.caption` (0.6875rem, letter-spacing 0.08em, uppercase, color mute).

### (c) Radius & Ombres

**Radius** : `--r-sm` 2px · `--r-md` 4px (défaut cartes/inputs) · `--r-lg` 8px · `--r-pill` 9999px.

**Ombres elevation** :
```css
--e1: 0 1px 2px rgba(22, 25, 26, 0.06);
--e2: 0 4px 10px -4px rgba(22, 25, 26, 0.1);
--e3: 0 12px 24px -12px rgba(22, 25, 26, 0.14);
--e4: 0 30px 60px -30px rgba(22, 25, 26, 0.18);
```
Opacités sur ink #16191a, jamais noir pur. `.sheet` ajoute un highlight interne `0 1px 0 rgba(255,255,255,0.6) inset`.

### (d) Classes utilitaires custom (`@layer utilities`, `src/app/globals.css`)

**Grilles & surfaces techniques :**
- `.grid-paper` — grille fine 28px (rgba ink 0.04), papier calque
- `.grid-paper-dense` — grille 16px (rgba 0.05)
- `.grid-dots` — points 18px (radial-gradient 0.18), style Linear/Vercel
- `.crosshair` — grille en croix (target marks, rgba 0.12)

**Dividers :** `.rule-top` / `.rule-bottom` (hairline border line-strong).

**Cartes :** `.sheet` (paper + border + e4/e3 + highlight inset), `.sheet-flat` (sans ombre).

**Typographie :** `.caption` (mono), `.display` (Playfair), `.display-italic`.

**Interactions & animations :**
- `.draft-link` — underline qui se dessine au hover (background-size 0 1px → 100% 1px, 250ms)
- `.page-enter` — entrée de page (fade + translateY 10px, 0.42s cubic-bezier(0.16,1,0.3,1)), replay à chaque navigation via `app/template.tsx`
- `.lift` — hover translateY(-2px) (220ms easing draft)
- `.animate-marquee` — scroll infini (translateX 0 → -50%, 36s linear)
- `.animate-flow` — point émeraude qui voyage (flow-x, 4.5s, left 0→100%, opacity fade)
- `.border-beam` — faisceau émeraude conic-gradient qui tourne (`--beam-angle` 0→360deg, 6s linear, `@property` registered, freeze sur reduced-motion)
- `.mask-fade-x` — mask gradient horizontal (fade marquees)

**Animations de plans (showcases) :** `.plan-hero-art` (drift 18s, filter saturate 0.84), `.plan-layer-back/main/trace/revision` (12/14/10/11s), `.plan-mini-card` (float 8s), `.annotation-pin` (pop 7s). Toutes suspendues au hover du parent `.vellum-plan-showcase` (`animation-play-state: paused`).

### (e) Kit Atelier (`src/components/atelier/`)

- **CartoucheHeader** (`CartoucheHeader.tsx`) — en-tête de plan (top hairline + caption eyebrow/meta, datum edge pine/50 à gauche, title `.display` clamp(1.8rem,3.4vw,2.6rem))
- **AtelierCard** (`AtelierCard.tsx`) — carte papier (rounded 4px, border line, bg-paper, shadow e1→e2 hover, `.lift`, corner tick pine optionnel)
- **StampBadge** (`StampBadge.tsx`) — badge tampon (scale 1.35→1, rotate -16°→-6°, spring stiffness 340 damping 15, tones pine/crimson/graphite via color-mix)
- **InkButton** (`InkButton.tsx`) — CTA pill pine (h-12 rounded-full, hover pine-hover, active translate-y-px) + **ripple ink** (motion.span scale 0→7 opacity 0.4→0, 0.65s, auto-cleanup, reduced-motion aware)
- **BlueprintGrid** (`BlueprintGrid.tsx`) — grille émeraude 9% alpha (double linear-gradient + mask radial ellipse, pure CSS)
- **DatumPin** (`DatumPin.tsx`) — marker dimensionnel (dot pine ring + inner, label caption, value mono)
- **GlowCard** (`GlowCard.tsx`) — carte avec `.border-beam` (beam émeraude 6s 360°)
- **Spotlight** (`Spotlight.tsx`) — glow émeraude suivant la souris (onPointerMove → `--mx`/`--my`, radial-gradient 220px pine 14%, opacity 0→100% hover)

### Composants UI primitifs (`src/components/ui/`)

- **Button** (`Button.tsx`) — variants CVA : primary (bg-ink), secondary (bg-vellum ring), outline, ghost, danger (bg-crimson) ; sizes sm/md/lg ; props icon, fullWidth, asChild (Radix Slot) ; focus outline ink
- **Card** (`Card.tsx`) — Card/Header/Title/Description/Content/Footer ; tones default/muted/dark/warning ; interactive hover translate + shadow
- **Badge** (`Badge.tsx`) — tones neutral/blue/green/amber/red (non brand-aware)
- **StatusPill** (`StatusPill.tsx`) — tones désaturés via color-mix (green→moss, amber→clay, red→crimson, blue→graphite, neutral→vellum), jamais candy ; dark variant
- **BorderBeam** (`BorderBeam.tsx`) — alternative bleue legacy (conic-gradient, animate-spin 9s, rarement utilisée)

### Logo — VellumLogo (`src/components/brand/VellumLogo.tsx`)

Symbole **« Datum »** (iconographie de drafting, pas une lettre) : datum rule (ligne de base) → benchmark triangle (convergence, stroke jamais fill) → datum tick (diamond émeraude pine à l'apex = point résolu = livrable). Sizes sm/md/lg, tone-aware (currentColor), wordmark « Vellum » optionnel.

### Esthétique globale — « Atelier Émeraude »

Philosophie : papier à dessin + encre noire + encre émeraude = matérialité drafting palpable. Cartouche = bloc titre pro, datum edge = authentification du projet, cotations (DatumPin) = mesures/précision. Animations sobres (beam, flow, marquee, page-enter) = mouvement organique jamais arcade. Reduced-motion respecté partout.

**Palette réduite à 3 couleurs métier** : papier (surface stable), encre (texte/structure/CTA), accent (pine signature). Aliases désaturés (moss/crimson/canard/graphite) = contextes sémantiques secondaires.

**IMPORTANT — état production** : **uniquement thème clair Atelier Émeraude.** Pas de dark mode global, pas de variations de thème, pas de switcher. Tous les composants supposent un fond light (`--paper`). Les variables CSS permettraient un dark mode futur (repoint `--paper`/`--ink`), mais ce n'est **PAS implémenté** ; un dark mode futur devrait revoir tout le token system (et réduire l'opacité des grilles/beams pour visibilité sombre).

---

## 5. Animations & mouvement — inventaire complet

### Philosophie de motion

Mouvement « drafting » — précis, mécanique, sans rebond. Documenté dans `src/lib/motion.ts` avec un **easing unique** `[0.16, 1, 0.3, 1]` (ligne tracée contre une règle). Toutes les animations respectent `prefers-reduced-motion` via `useReducedMotion()`.

### 1. Système de motion central (`src/lib/motion.ts`)

| Variant | Utilité | Paramètres |
|---------|---------|-----------|
| **fadeRise** | Section headline / block reveal | opacity 0→1, y 16→0, 0.6s, easing draft |
| **fadeRiseItem** | Reveal léger pour list/grid children | opacity 0→1, y 14→0, 0.5s |
| **staggerContainer** | Stagger parent | staggerChildren 0.07, delayChildren 0.05 |
| **drawLine** | SVG hairline left-to-right | pathLength 0→1, opacity 0.3→1, 1s |
| **springSnappy** | Spring snappy | stiffness 220, damping 30 |
| **easeDraft** | Easing tracé sans rebond | [0.16, 1, 0.3, 1] |
| **inViewport** | Viewport config reveals | once: true, margin -80px |

### 2. Transitions de page (`src/app/template.tsx` + `globals.css`)

`.page-enter` — chaque navigation : opacity 0→1, translateY(10px)→0, 0.42s easing draft. Respecte reduced-motion (désactivée).

### 3. Reveals au scroll

- **Reveal** (`src/components/motion/Reveal.tsx`) — fadeRise / staggerContainer (si stagger=true), viewport once + margin -80px, devient `<div>` neutre si reduced-motion
- **MotionSection** (`src/components/marketing/MotionSection.tsx`) — fadeRise + inViewport, landing + ProductDemoFilm

### 4. Composants de motion spécialisés

- **CountUp** (`CountUp.tsx`) — 0→valeur au scroll-in (useInView margin -40px), useMotionValue + useSpring, format personnalisable, valeur finale immédiate si reduced-motion. Utilisé dans InstantEstimate, Donut, dashboards.
- **LivingBlueprintHero** (`marketing/LivingBlueprintHero.tsx`) — « le calque vivant » : plan principal CSS 3D pointer tilt (5-6°, useSpring stiffness 110 damping 18), révisions (RÉV. A/B/C) qui dérivent verticalement en boucle (y [0,-5/-3,0] 6-9s), slide-in cascade 0.18s. Pas de tilt/drift si reduced-motion.
- **InkButton** — ripple ink (scale 0→7, opacity 0.4→0, 0.65s easeOut, cleanup onAnimationComplete)
- **GlowCard** — beam conic-gradient `--beam-angle` 0→360deg, 6s linear, paused si reduced-motion. Utilisé QuoteSheet PriceRail, InstantEstimate result.
- **StampBadge** — scale 1.35→1, rotate -16°→-6°, spring stiffness 340 damping 15. Utilisé QuoteSheet (Accepté, Clôturé).
- **ProjectWorkspaceTabs** — underline `layoutId="ws-tab-underline"` spring (stiffness 320 damping 30) + tab content opacity 0→1 y 6→0 0.25s
- **BriefQualityMeter** — bar width 0→score% 0.5s (rendu immédiat si reduced-motion)
- **MiniCharts** (`charts/MiniCharts.tsx`) — BarChart (width 0→pct%, stagger i*0.07, 0.7s) + Donut (strokeDashoffset arc, 0.9s, CountUp central)
- **ProjectTracker** — `.animate-ping` (Tailwind) sur le dot si étape « À vous de jouer »
- **ProjectMessageThread** — chaque message opacity 0→1 y 8→0 0.25s, temporaires à 0.7 opacity
- **QuoteSheet** — total live via CountUp (euros), upsell toggles CSS transition

### 5. CSS Animations (@keyframes) (`src/app/globals.css`)

| Keyframe | Utilité | Déclencheur |
|----------|---------|------------|
| **plan-depth** | Depth shift couche plan hero | Hover VellumPlanShowcase (paused) |
| **plan-breathe** | Respiration couche | 14s ease-in-out infinite |
| **plan-trace** | Calque trace apparaît/disparaît | 10s |
| **revision-sheet** | Feuille révision déraille | 11s |
| **mini-card-float** | Mini card flotte | 8s |
| **annotation-pop** | Pin annotation pop | 7s |
| **hero-art-drift** | Art hero dérive/zoom | 18s |
| **marquee** | Bande partenaires (-50%) | 36s linear (WorkflowStrip) |
| **flow-x** | Point vert sur connecteur | 4.5s |
| **beam-rotate** | Beam border 360° | 6s linear (GlowCard) |

Hover du parent `.vellum-plan-showcase` met en pause toutes les animations enfants.

### 6. Hover & interactive motion

- `.lift` (translateY -2px, 220ms) · `.draft-link` (underline 0→100%, 250ms) · **Spotlight** (radial-gradient suivant cursor `--mx`/`--my`, pine 14%, opacity 0→1 hover 300ms)

### 7. WebGL/3D

**Hero3D** (`src/components/three/Hero3DScene.tsx`) — scène Three.js client-only (dynamic import ssr:false), objet 3D rotatif central, fallback glow radial (reduced-motion ou SSR).

### 8. Marquee & flow

- **Marquee** — WorkflowStrip, translateX 0→-50% 36s, `.mask-fade-x` ; **Flow-x** — LandingPage connecteurs, point pine glow voyageant, 4.5s, opacity fade extrémités

### 9. ProductDemoFilm (`src/components/marketing/ProductDemoFilm.tsx`)

Planche vivante 5 beats (dépôt, question, devis, correction, livrable). Primitives `t(duration, delay)`, stageVariants (enter/center/exit y8), sheetParent stagger, riseIn/fadeIn. SVG : pathLength 0→1 (DraftLine), stroke animé rects, dimension lines couleur. Tout collapse si reduced-motion.

### 10. Charts animés

Bar fills (width scroll), Donut arcs (strokeDashoffset), CountUp, stagger i*0.07. Utilisé MiniCharts, AdminRevenueCockpit, InstantEstimate.

### 11. Respect universel de prefers-reduced-motion

Global (`globals.css`) :
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Par composant : `useReducedMotion()` conditionnalise variants (Reveal → div, CountUp → valeur finale, LivingBlueprintHero → pas de tilt/drift, StampBadge/InkButton → aucune anim, charts → rendus d'emblée).

### 12. Évaluation : sobre ou vivant ?

**Verdict : sobrement vivant, mais fragmenté.**

**Points positifs** : système de motion cohérent (easing + lexique partagés), hero signature « le calque vivant », accessibility-first, détails premium (ripple, stamp, beam, spotlight), scroll reveals rythmés, feedback interactif (lift, draft-link, tab underline), data motion (CountUp, charts), transitions de page.

**Lacunes significatives :**
1. **Pas de fonds animés structurels** — grilles paper/dots statiques, aucune texture animée, aucun gradient mouvant, glows radiaux figés
2. **Sections majeures sans motion** — ProductShowcase, WorkflowStrip, SecurityBlock statiques une fois visibles
3. **Motion discontinue public/app** — landing riche, app minimale, pas de « souffle » consistant
4. **Couleurs/SVG statiques** — aucune animation de couleur, SVG animés une seule fois, plans du showcase sans mouvement
5. **Microinteractions incohérentes** — loader Tailwind minimal, pas de loading state custom, pas de « submit success »
6. **Vide émotionnel** — animations fonctionnelles, aucune surprise/délice, dépôt/devis/livrable sans célébration
7. **Pas de motion responsive** — durées hard-codées, pas d'ajustement mobile

### 13. Ce qui manque pour une expérience « vivante »

Fonds/textures animées (grille qui respire, gradient qui dérive, bruit variable) ; motion dans les composants statiques (stagger Reveal sur pillars/workflow, total devis en pop) ; micro-interactions délightful (upload progress, brief score celebration, message bounce) ; animations responsives ; SVG récurrents (showcase aussi dynamique que LivingBlueprint) ; célébration des moments clés (dépôt réussi, devis accepté, livrable téléchargé).

**Chemins clés** : `src/lib/motion.ts`, `src/app/globals.css`, `src/app/template.tsx`, `src/components/motion/`, `src/components/marketing/` (LivingBlueprintHero, ProductDemoFilm, MotionSection, InstantEstimate), `src/components/atelier/` (InkButton, GlowCard, StampBadge, Spotlight), `src/components/charts/MiniCharts.tsx`, `src/components/project/` (ProjectWorkspaceTabs, ProjectTracker, ProjectMessageThread).

---

## 6. Logique métier & technique (résumé)

### Configuration métier centralisée (`src/lib/business-config.ts`)

Source unique de vérité monétaire : devise EUR (`formatEuro()` fr-FR) ; commission Vellum 15% (`COMMISSION_RATE`) ; validité devis 14 jours (`QUOTE_VALIDITY_DAYS`) ; **politique d'acompte** (`depositPolicy()`) : < 150€ total 100%, 150–500€ acompte 30%, > 500€ acompte 40%, urgent acompte 50% ; **upsells** : 7 options configurables (délai 48h/24h, fichiers source, PDF print, révisions, appel, pack livraison) en fixed ou percent.

### Estimateur (`src/lib/estimator.ts`)

Heuristique transparente et déterministe (pure functions) : 5 catégories (correction, plan2d, mise_au_propre, schema, apercu3d), 3 niveaux complexité (simple 0.85× / standard 1× / détaillé 1.4×), 3 urgences (flexible / semaine 1.1× / urgent 1.45× prix 0.6× délai). Retourne plage basse/haute + délai (arrondi dizaine sup).

### Paiements (`src/lib/payments.ts`)

**MOCKÉ, prêt Stripe** : `buildBreakdown()` (base + upsells → total → depositPolicy → amountNow + balanceLater), `STRIPE_READY` (présence clé publique), `mockCheckoutUrl()` → `/checkout/confirmation`. Pour brancher Stripe : Checkout Session (server action) + webhook `checkout.session.completed`.

### Emails (`src/lib/emails.ts`)

Templates transactionnels **MOCK, Resend-ready** (HTML style Atelier) : `projectReceivedEmail()`, `quoteSentEmail()`, `paymentConfirmedEmail()`, `deliveryReadyEmail()`, `quoteReminderEmail()`. Rien n'est envoyé (activer : `RESEND_API_KEY` + `resend.emails.send(...)`).

### Auth + Supabase (`src/lib/auth.ts` + `src/lib/supabase/`)

Intégration via @supabase/ssr : `getCurrentUser()` (user + profil, rejet si `is_active = false`), `requireUser()` / `requireRole()`, `hasPermission(key)` (toujours true pour admin), `defaultRouteForRole()`. Clients : `createSupabaseServerClient()` (SSR, cookies), `createSupabaseBrowserClient()` (anon), `createSupabaseServiceRoleClient()` (admin, jamais exposé browser).

### Modèle de rôles & permissions (`src/types/`)

Rôles DB : `client` → /client, `architect` → /studio, `manager` → /manager, `admin` → /admin. Permissions cataloguées (table `permissions` via `role_permissions`) : projets (read.own/assigned/all, create, update, update.status, assign), documents (upload, read.assigned/all), messages (send), devis (read, create, update, approve), livrables (read, upload, publish), admin (users, roles, permissions, policies, audit, full_access). Matrice par défaut dans `supabase/seed.sql`, éditable via `/admin/roles`.

### Permissions applicatives (`src/lib/permissions.ts`)

Modèle déclaratif `can(actor, action, resource)` + `explainCan()` : admin override, filtrage organisation, vérification assignation projet, blocage actions sensibles sur fichiers sensibles (mock), raisons explicitées.

### Row-Level Security (RLS) (`src/lib/supabase/middleware.ts` + migrations)

Contrôle canonique Postgres (`docs/security-rls.md`) : helpers security-definer (`current_role()`, `is_admin()`, `is_manager_or_admin()`, `can_access_project(uuid)`) ; policies par table/action (projects_read, project_documents, project_messages via can_access_project, profiles self sauf manager/admin, quote create/update manager, quote approve client) ; storage buckets chemins privés + URLs signées 60s TTL.

### Types métier partagés (`src/types/`)

`database.ts` (Row/Insert/Update pour 14 tables), domaine applicatif (project, quote, deliverable, request, message, user, workflow). **Statuts projets** : draft → intake → qualified → assigned → in_progress → review → delivered / archived / cancelled. **Statuts devis** : draft → sent → accepted / refused / expired. **Priorités** : low/normal/high/urgent. **Confidentialité** : standard / nda_required / restricted.

### Documentation (`docs/`)

`money-engine.md`, `roles-permissions.md`, `security-rls.md`, `data-model.md`, `product-vision.md`, `mvp.md`, `routes-map.md`.

### Ce qui est MOCKÉ vs réel

| Composant | État | Notes |
|-----------|------|-------|
| **Stripe** | MOCK | `mockCheckoutUrl()` → `/checkout/confirmation`, prêt pour Checkout Session + webhook |
| **Resend / emails** | MOCK | Templates prêts, rien envoyé |
| **Upsells persistés** | MOCK | Calculés dans `buildBreakdown()`, non stockés |
| **Supabase + RLS** | RÉEL | Auth JWT, RLS, storage, migrations, seed |
| **Permissions** | RÉEL | Table `role_permissions`, matrice RBAC, helpers TS |
| **Audit trail** | RÉEL | Logs via server actions, visible `/admin/audit` |

Tout ce qui touche l'argent (estimations, acomptes, commission, upsells) est configuré au même endroit (`business-config.ts`) et pur (safe serveur/client).

---

## 7. Constat & questions pour l'expert (style, thèmes, animation, émotion)

### Constat honnête

**(a) Un seul thème, aucune variation.** Le site vit sur un unique thème clair « Atelier » (papier bone + encre ink + accent pine émeraude). Il n'y a **pas de dark mode global**, **pas de variation d'ambiance** ni par espace (client / manager / studio / admin partagent la même peau, seul l'accent de nav diffère légèrement), **pas de personnalisation** ni de switcher. Les variables CSS rendraient un dark mode techniquement possible, mais rien n'est implémenté. Seul le tunnel de dépôt public est en dark (`#151410`) — c'est une exception isolée, pas un système.

**(b) Les fonds sont statiques.** Toutes les surfaces de fond sont figées : grilles millimétrées (`grid-paper`, `grid-paper-dense`, `grid-dots`, `crosshair`), washes radiaux et glows pine. **Aucun fond animé / vivant** : pas de grille qui respire, pas de gradient qui dérive, pas de texture/bruit en mouvement, pas de pattern génératif. Le décor ne bouge jamais.

**(c) Le mouvement est sobre, sans signature forte.** On a de bonnes **micro-interactions** : hover lift, fondus, count-up, marquee, border-beam, underline qui se dessine, total de devis vivant, charts qui se tracent, messages en fondu, ripple d'encre, stamp badge à ressort. Mais il **manque** : pas de grosse animation « signature » mémorable, pas de parallax, pas de scroll-telling, pas de transitions de page riches (juste un fade+rise discret), pas de curseur custom ni de particules, pas de célébration des moments clés (dépôt, paiement, livraison). Le ressenti reste « plateforme B2B bien faite, sobre » plutôt que « plateforme qui plaît à utiliser et qui inspire confiance immédiatement ».

**(d) Le hero 3D est en cours de refonte** par le commanditaire — ne pas le considérer comme figé dans les recommandations.

### Questions pour l'expert

- **Variations de thèmes** : faut-il introduire des variations ? Si oui lesquelles — par espace (client / manager / studio / admin) ? un **dark mode** global (et lequel : opt-in, auto, par espace) ? une variation **saisonnière** ? une variation **par type de client** (particulier vs cabinet/pro) ? Et surtout : **comment garder la cohérence « Atelier »** (papier / encre / pine / cartouche / cotations) à travers ces variations, sans diluer l'identité ?

- **Animations & fonds animés** : quelles animations et quels fonds vivants ajouter pour rendre le site **émotionnel et vivant**, tout en respectant le sérieux d'un cabinet d'études techniques ? Le brief **interdit** : néon, glassmorphism générique, dark SaaS banal, confettis. Quelles textures/fonds animés sont compatibles (grille qui respire, blueprint génératif, dérive lente, trame de calque) ?

- **Moments signature** : où placer 1 à 3 « moments signature » à fort impact — sur le **hero** (accroche immédiate), le **dépôt** (rassurer pendant la friction), le **devis** (transparence = confiance), la **livraison** (célébration de la valeur livrée) ? Lesquels prioriser pour le budget d'attention ?

- **Accroche + confiance par le mouvement** : comment utiliser le mouvement pour créer à la fois l'**accroche** (capter en 3 secondes sur la landing) et la **confiance** (un cabinet sérieux qui maîtrise son métier) ? Quel équilibre entre démonstration (le plan qui se compose) et sobriété ?

- **Micro-interactions manquantes** : quelles micro-interactions manquent réellement (états de chargement custom, feedback d'upload, success states, transitions inter-onglets, hover sur cartes métier) et lesquelles éviter car superflues ?

- **Scroll-telling / parallax / transitions de page** : faut-il en introduire ? Si oui, où et avec quelle intensité pour ne pas alourdir ni distraire d'un public pro pressé ?

- **Librairies & techniques** : quelles recommandations concrètes, **compatibles avec la stack et sans dépendances lourdes** — CSS pur (animations, `@property`, masks), SVG animé (pathLength, SMIL/CSS), Framer Motion (déjà présent, v12), React Three Fiber / R3F (déjà présent pour le 3D) ? Que privilégier pour rester léger, performant et accessible (`prefers-reduced-motion`) ?

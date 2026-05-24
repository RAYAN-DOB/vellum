-- ============================================================================
-- PlanWork — Seed data
-- Demo users, roles, permissions and a few sample projects.
-- Run AFTER the migrations and AFTER you create the four demo accounts in
-- the Supabase Auth dashboard (or via the SDK). Email addresses must match.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Catalogue rôles
-- ----------------------------------------------------------------------------
insert into public.roles (name, label, description)
values
  ('client',    'Client',          'Dépose des projets, consulte les livrables, échange avec l''équipe.'),
  ('architect', 'Architecte',      'Réalise les plans techniques sur les projets qui lui sont assignés.'),
  ('manager',   'Chef de projet',  'Qualifie les demandes, assigne les architectes, prépare les devis.'),
  ('admin',     'Administrateur',  'Accès total, gestion des utilisateurs, rôles, droits et politiques.')
on conflict (name) do nothing;

-- ----------------------------------------------------------------------------
-- Catalogue permissions
-- ----------------------------------------------------------------------------
insert into public.permissions (key, label, description, category) values
  ('projects.read.own',        'Voir ses propres projets',              'Lecture des projets dont l''utilisateur est client.', 'projects'),
  ('projects.read.assigned',   'Voir les projets assignés',             'Lecture des projets sur lesquels l''utilisateur est assigné.', 'projects'),
  ('projects.read.all',        'Voir tous les projets',                 'Lecture globale des projets.', 'projects'),
  ('projects.create',          'Créer un projet',                       'Créer une nouvelle demande de projet.', 'projects'),
  ('projects.update',          'Modifier un projet',                    'Modifier les champs d''un projet.', 'projects'),
  ('projects.update.status',   'Changer le statut d''un projet',        'Faire évoluer le statut.', 'projects'),
  ('projects.assign',          'Assigner un architecte',                 'Affecter un architecte à un projet.', 'projects'),
  ('documents.upload',         'Téléverser un document',                'Uploader des documents projet.', 'documents'),
  ('documents.read.assigned',  'Lire documents projets assignés',       'Lecture des documents des projets assignés.', 'documents'),
  ('documents.read.all',       'Lire tous les documents',               'Lecture globale des documents.', 'documents'),
  ('messages.send',            'Envoyer un message',                    'Écrire un message dans un projet.', 'messages'),
  ('quotes.read',              'Voir les devis',                        'Consulter les devis.', 'quotes'),
  ('quotes.create',            'Créer un devis',                        'Créer un devis pour un projet.', 'quotes'),
  ('quotes.update',            'Modifier un devis',                     'Mettre à jour un devis.', 'quotes'),
  ('quotes.approve',           'Approuver un devis',                    'Côté client : accepter un devis.', 'quotes'),
  ('deliverables.read',        'Lire les livrables',                    'Consulter les livrables.', 'deliverables'),
  ('deliverables.upload',      'Téléverser un livrable',                'Ajouter un livrable.', 'deliverables'),
  ('deliverables.publish',     'Publier un livrable',                   'Mettre un livrable en publication.', 'deliverables'),
  ('users.read',               'Lire les utilisateurs',                 'Voir la liste des utilisateurs.', 'admin'),
  ('users.manage',             'Gérer les utilisateurs',                'Créer / modifier / désactiver des utilisateurs.', 'admin'),
  ('roles.manage',             'Gérer les rôles',                       'Modifier les rôles et leurs permissions.', 'admin'),
  ('permissions.manage',       'Gérer les permissions',                 'Modifier le catalogue de permissions.', 'admin'),
  ('policies.manage',          'Gérer les politiques applicatives',      'Réglages globaux (GPO).', 'admin'),
  ('audit.read',               'Lire les logs d''audit',                 'Consulter l''historique des actions.', 'admin'),
  ('admin.full_access',        'Accès total',                           'Override complet (admin).', 'admin')
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- Affectation des permissions aux rôles
-- ----------------------------------------------------------------------------
with rp as (
  select r.id as role_id, p.id as permission_id, r.name as role_name, p.key as perm_key
  from public.roles r
  cross join public.permissions p
)
insert into public.role_permissions (role_id, permission_id)
select rp.role_id, rp.permission_id from rp
where (rp.role_name = 'client'    and rp.perm_key in (
        'projects.read.own','projects.create','documents.upload','messages.send',
        'quotes.read','quotes.approve','deliverables.read'))
   or (rp.role_name = 'architect' and rp.perm_key in (
        'projects.read.assigned','projects.update.status','documents.read.assigned',
        'documents.upload','messages.send','deliverables.read','deliverables.upload'))
   or (rp.role_name = 'manager'   and rp.perm_key in (
        'projects.read.all','projects.update','projects.update.status','projects.assign',
        'documents.read.all','documents.upload','messages.send',
        'quotes.read','quotes.create','quotes.update',
        'deliverables.read','deliverables.upload','deliverables.publish','users.read'))
   or (rp.role_name = 'admin'     and true)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Politiques applicatives (admin GPO)
-- ----------------------------------------------------------------------------
insert into public.app_policies (key, label, description, value) values
  ('signup.allowed_roles',    'Rôles autorisés à l''inscription publique', 'Rôles pouvant être choisis lors d''une inscription self-service.', '["client"]'::jsonb),
  ('projects.intake.auto_notify_manager', 'Notifier le manager à la création d''un projet', 'Envoie une notification à tous les managers à la création d''un projet.', 'true'::jsonb),
  ('documents.max_size_mb',   'Taille max d''un document', 'Limite côté UI pour l''upload (MB).', '50'::jsonb),
  ('confidentiality.default', 'Niveau de confidentialité par défaut', 'Niveau appliqué aux nouveaux projets.', '"standard"'::jsonb),
  ('branding.product_name',   'Nom produit affiché',       'Affiché dans le header et les emails.', '"PlanWork"'::jsonb)
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- Demo profiles  (n'agit que si les comptes auth existent déjà)
-- Crée des projets de démonstration entre les comptes seedés.
-- ----------------------------------------------------------------------------
do $$
declare
  v_client    uuid;
  v_manager   uuid;
  v_architect uuid;
  v_admin     uuid;
  v_project_intake     uuid;
  v_project_assigned   uuid;
  v_project_progress   uuid;
begin
  select id into v_client    from public.profiles where email = 'client@planwork.dev';
  select id into v_manager   from public.profiles where email = 'manager@planwork.dev';
  select id into v_architect from public.profiles where email = 'archi@planwork.dev';
  select id into v_admin     from public.profiles where email = 'admin@planwork.dev';

  if v_client is null then
    raise notice 'Demo accounts not found — create them in Supabase Auth, then re-run seed.';
    return;
  end if;

  -- Force the right role on demo accounts.
  update public.profiles set role = 'client',    full_name = coalesce(full_name, 'Claire Martin'),  company = coalesce(company, 'Atelier Démo') where id = v_client;
  update public.profiles set role = 'manager',   full_name = coalesce(full_name, 'Samir Bernard'),  company = coalesce(company, 'PlanWork')     where id = v_manager;
  update public.profiles set role = 'architect', full_name = coalesce(full_name, 'Nora Petit'),     company = coalesce(company, 'PlanWork')     where id = v_architect;
  update public.profiles set role = 'admin',     full_name = coalesce(full_name, 'Alex Moreau'),    company = coalesce(company, 'PlanWork')     where id = v_admin;

  -- Projet à qualifier
  insert into public.projects (id, client_id, title, description, project_type, status, priority, confidentiality)
  values (
    gen_random_uuid(), v_client,
    'Reprise PDF d''un plan de bureau en open-space',
    'PDF à reprendre, ajouter arrivées électriques, corriger cotes, livrer un DWG propre + aperçu PDF.',
    'pdf_to_dwg', 'intake', 'normal', 'standard'
  )
  returning id into v_project_intake;

  insert into public.project_events (project_id, actor_id, event_type, label, description)
  values (v_project_intake, v_client, 'project.created', 'Projet déposé', 'Le client a déposé sa demande.');

  -- Projet assigné en cours d'assignation
  insert into public.projects (id, client_id, manager_id, title, description, project_type, status, priority, confidentiality)
  values (
    gen_random_uuid(), v_client, v_manager,
    'Croquis interieur d''un loft à formaliser',
    'Transformation d''un croquis main en plan structuré, échelle et cotation à recréer.',
    'croquis_to_plan', 'qualified', 'high', 'nda_required'
  )
  returning id into v_project_assigned;

  insert into public.project_events (project_id, actor_id, event_type, label)
  values (v_project_assigned, v_manager, 'project.qualified', 'Projet qualifié par le manager');

  -- Projet en production
  insert into public.projects (id, client_id, manager_id, architect_id, title, description, project_type, status, priority, confidentiality, expected_delivery_date)
  values (
    gen_random_uuid(), v_client, v_manager, v_architect,
    'Préparation DWG de mise à jour de réseau plomberie',
    'Mise à jour d''un DWG existant pour intégrer le nouveau réseau plomberie. Confidentialité renforcée.',
    'dwg_update', 'in_progress', 'urgent', 'restricted',
    (current_date + interval '14 days')::date
  )
  returning id into v_project_progress;

  insert into public.project_messages (project_id, sender_id, body, message_type)
  values
    (v_project_progress, v_client,    'Bonjour, voici les contraintes du nouveau réseau, merci !', 'message'),
    (v_project_progress, v_manager,   'Bien reçu, Nora prend le sujet en charge cette semaine.',    'message'),
    (v_project_progress, v_architect, 'Première itération en fin de journée, je notifie ici.',     'message');

  insert into public.project_events (project_id, actor_id, event_type, label)
  values
    (v_project_progress, v_manager,   'project.assigned',  'Architecte assigné'),
    (v_project_progress, v_architect, 'project.in_progress','Production démarrée');

  -- Devis brouillon sur le projet en production
  insert into public.quotes (project_id, created_by, status, total_amount, currency, notes)
  values (v_project_progress, v_manager, 'draft', 0, 'EUR', 'Devis initial à compléter par le manager.');

  -- Notifications
  insert into public.notifications (user_id, project_id, title, body)
  values
    (v_manager, v_project_intake,    'Nouveau projet à qualifier', 'Une nouvelle demande client est en attente.'),
    (v_client,  v_project_progress,  'Production démarrée',        'Nora a démarré la production de votre DWG.'),
    (v_architect, v_project_assigned,'Projet à prendre en charge', 'Un projet vous a été pré-attribué.');
end $$;

import {
  Activity,
  Folder,
  Gauge,
  KeyRound,
  Settings,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";

import { BaseShell, type NavItem } from "@/components/shells/BaseShell";
import { routes } from "@/lib/routes";

const navigation: ReadonlyArray<NavItem> = [
  { label: "Tableau admin", href: routes.admin.home, icon: Gauge },
  { label: "Utilisateurs", href: routes.admin.users, icon: Users },
  { label: "Rôles", href: routes.admin.roles, icon: ShieldCheck },
  { label: "Permissions", href: routes.admin.permissions, icon: KeyRound },
  { label: "Politiques", href: routes.admin.policies, icon: Workflow },
  { label: "Projets (global)", href: routes.admin.projects, icon: Folder },
  { label: "Audit", href: routes.admin.audit, icon: Activity },
  { label: "Paramètres", href: routes.admin.settings, icon: Settings },
];

type Props = {
  activeHref: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Admin app shell — full control surface.
 * Manages users, roles, permissions, policies, audit, modules.
 */
export function AdminShell(props: Props) {
  return <BaseShell accent="admin" navigation={navigation} {...props} />;
}

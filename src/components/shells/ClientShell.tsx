import {
  FilePlus2,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Settings,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { BaseShell, type NavItem } from "@/components/shells/BaseShell";
import { routes } from "@/lib/routes";

const navigation: ReadonlyArray<NavItem> = [
  { label: "Vue d'ensemble", href: routes.client.home, icon: LayoutDashboard },
  {
    label: "Nouveau dépôt",
    href: routes.client.newProject,
    icon: FilePlus2,
    emphasis: true,
  },
  { label: "Mes projets", href: routes.client.projects, icon: Inbox },
  { label: "Documents", href: routes.client.documents, icon: FileText },
  { label: "Devis", href: routes.client.quotes, icon: Receipt },
  { label: "Livrables", href: routes.client.deliverables, icon: Sparkles },
  { label: "Messages", href: routes.client.messages, icon: MessageSquare },
  { label: "Paramètres", href: routes.client.settings, icon: Settings },
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
 * Client app shell — minimal, guided.
 * The client only sees their own projects, files, messages, quotes.
 */
export function ClientShell(props: Props) {
  return <BaseShell accent="client" navigation={navigation} {...props} />;
}

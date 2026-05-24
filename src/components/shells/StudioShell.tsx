import {
  CalendarRange,
  CheckSquare,
  FileText,
  Hammer,
  Layers3,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { BaseShell, type NavItem } from "@/components/shells/BaseShell";
import { routes } from "@/lib/routes";

const navigation: ReadonlyArray<NavItem> = [
  { label: "Atelier", href: routes.studio.home, icon: Hammer },
  { label: "Projets assignés", href: routes.studio.projects, icon: Layers3 },
  { label: "Documents", href: routes.studio.documents, icon: FileText },
  { label: "Tâches", href: routes.studio.tasks, icon: CheckSquare },
  { label: "Livrables", href: routes.studio.deliverables, icon: Sparkles },
  { label: "Planning", href: routes.studio.planning, icon: CalendarRange },
  { label: "Messages", href: routes.studio.messages, icon: MessageSquare },
  { label: "Paramètres", href: routes.studio.settings, icon: Settings },
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
 * Studio app shell — production focus.
 * The architect/drafter only sees their assigned projects.
 */
export function StudioShell(props: Props) {
  return <BaseShell accent="studio" navigation={navigation} {...props} />;
}

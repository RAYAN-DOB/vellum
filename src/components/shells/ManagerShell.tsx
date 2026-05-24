import {
  Compass,
  Inbox,
  LineChart,
  Mail,
  Receipt,
  ShieldCheck,
  UserSquare2,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { BaseShell, type NavItem } from "@/components/shells/BaseShell";
import { routes } from "@/lib/routes";

const navigation: ReadonlyArray<NavItem> = [
  { label: "Cockpit", href: routes.manager.home, icon: Compass },
  { label: "Demandes entrantes", href: routes.manager.requests, icon: Inbox, emphasis: true },
  { label: "Projets", href: routes.manager.projects, icon: ShieldCheck },
  { label: "Assignations", href: routes.manager.assignments, icon: UserSquare2 },
  { label: "Devis", href: routes.manager.quotes, icon: Receipt },
  { label: "Équipe", href: routes.manager.team, icon: UsersRound },
  { label: "Messages", href: routes.manager.messages, icon: Mail },
  { label: "Reporting", href: routes.manager.reporting, icon: LineChart },
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
 * Manager app shell — pilot cockpit.
 * Manager qualifies requests, assigns drafters, prepares quotes.
 */
export function ManagerShell(props: Props) {
  return <BaseShell accent="manager" navigation={navigation} {...props} />;
}

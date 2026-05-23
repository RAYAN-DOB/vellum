import { Bell, Building2, CreditCard, LockKeyhole, UserRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const settings = [
  {
    title: "Profil client",
    detail: "Claire Martin, Atelier Demo, contact principal fictif.",
    icon: UserRound,
  },
  {
    title: "Entreprise",
    detail: "Informations societe mockees pour preparer la V2.",
    icon: Building2,
  },
  {
    title: "Notifications",
    detail: "Email projet, question architecte, devis pret, livrable disponible.",
    icon: Bell,
  },
  {
    title: "Confidentialite",
    detail: "NDA, cloisonnement projet et audit seront geres cote serveur.",
    icon: LockKeyhole,
  },
  {
    title: "Facturation future",
    detail: "Paiement et factures prevus en V2, non disponibles maintenant.",
    icon: CreditCard,
  },
] as const;

export function ClientSettingsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {settings.map(({ title, detail, icon: Icon }) => (
        <Card className="rounded-[30px]" key={title}>
          <CardHeader>
            <span className="flex size-11 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{detail}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 rounded-full bg-[#eee8dc]">
              <div className="h-2 w-2/3 rounded-full bg-[#171613]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicProjectDepositFlow } from "@/components/intake/PublicProjectDepositFlow";

export const metadata = {
  title: "Déposer un projet — Vellum",
  description:
    "Commencez un dépôt de plans sans compte : décrivez votre besoin, listez vos fichiers et créez votre espace au moment de l'envoi.",
};

export default function PublicDepositPage() {
  return (
    <>
      <PublicHeader />
      <PublicProjectDepositFlow />
    </>
  );
}

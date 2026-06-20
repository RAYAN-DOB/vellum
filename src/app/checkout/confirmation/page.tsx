import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { CheckoutConfirm } from "@/components/checkout/CheckoutConfirm";
import { requireRole } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = { title: "Paiement" };

export default async function CheckoutConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ quote?: string; amount?: string; choice?: string }>;
}) {
  await requireRole(["client", "manager", "admin"]);
  const sp = await searchParams;
  const quoteId = sp.quote ?? "";
  const amount = Number(sp.amount ?? 0);
  const choice = sp.choice === "total" ? "total" : "deposit";

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 py-16 text-ink">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5"
          aria-label="Vellum — accueil"
        >
          <VellumLogo size="sm" tone="ink" withWordmark />
        </Link>

        <div className="mt-8 rounded-[4px] border border-line-strong bg-paper p-6 shadow-[var(--shadow-e2)] sm:p-7">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="caption">Paiement</span>
            <span className="caption text-soft">VLM · CHECKOUT</span>
          </div>
          <h1 className="mt-5 font-display text-2xl text-ink">
            Confirmer et régler
          </h1>
          <p className="mt-2 text-[13px] leading-6 text-graphite">
            En réglant, vous acceptez le devis et le dessinateur peut démarrer la
            production.
          </p>

          <div className="mt-6">
            {quoteId ? (
              <CheckoutConfirm
                quoteId={quoteId}
                amount={amount}
                choice={choice}
              />
            ) : (
              <p className="text-[13px] text-crimson">
                Devis introuvable. Revenez à vos devis pour réessayer.
              </p>
            )}
          </div>
        </div>

        <Link
          href={routes.client.quotes}
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-mute transition hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Retour à mes devis
        </Link>
      </div>
    </main>
  );
}

import { CheckCircle2, ReceiptText, Send, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockQuotePreviews } from "@/lib/mock-data";
import { quoteLineItems } from "@/lib/workflow";

export function QuoteBuilderMock() {
  const total = "940 EUR";
  const quote = mockQuotePreviews[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card tone="dark" className="rounded-[32px]">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#f7f3ea]/10 text-[#d7c6a4] ring-[#f7f3ea]/18">
              {quote.label}
            </Badge>
            <Badge tone="amber">{quote.status}</Badge>
          </div>
          <CardTitle className="text-3xl text-[#f7f3ea]">
            Devis mocke de reprise technique
          </CardTitle>
          <CardDescription className="max-w-2xl text-[#cfc6b5]">
            Construction visuelle du devis futur : lignes, complexite, delai et
            statut client. Aucun paiement ni document reel.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {quoteLineItems.map((line) => (
            <div
              className="rounded-[24px] border border-[#f7f3ea]/10 bg-[#f7f3ea]/6 p-5"
              key={line.label}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#f7f3ea]">{line.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#cfc6b5]">
                    {line.detail}
                  </p>
                </div>
                <span className="font-mono text-sm text-[#ead9b9]">{line.amount}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid content-start gap-4">
        <Card className="rounded-[30px]">
          <CardHeader>
            <span className="flex size-11 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
              <ReceiptText className="size-5" aria-hidden="true" />
            </span>
            <CardTitle>Total fictif</CardTitle>
            <CardDescription>Montant indicatif pour la demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-[#171613]">{total}</p>
            <p className="mt-3 text-sm leading-6 text-[#6b665a]">
              Paiement, TVA, validation legale et facture seront traites en V2.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[30px]">
          <CardHeader>
            <CardTitle>Actions manager</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { label: "Envoyer devis fictif", icon: Send },
              { label: "Valider orientation", icon: CheckCircle2 },
              { label: "Revoir confidentialite", icon: ShieldCheck },
            ].map(({ label, icon: Icon }) => (
              <Button className="rounded-full" key={label} variant="outline">
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

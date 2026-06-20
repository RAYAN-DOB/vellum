import { BarChart, Donut } from "@/components/charts/MiniCharts";
import { formatEuro } from "@/lib/business-config";
import { cn } from "@/lib/utils";

type Props = {
  revenue: number;
  quotesSent: number;
  quotesAccepted: number;
  averageBasket: number;
  lateProjects: number;
  byStatus: { label: string; value: number }[];
};

/**
 * The "where the money is" view for admins: realised revenue, quote
 * conversion, average basket and at-risk projects, with on-brand SVG charts.
 * Pure presentation — metrics are computed server-side and passed in.
 */
export function AdminRevenueCockpit({
  revenue,
  quotesSent,
  quotesAccepted,
  averageBasket,
  lateProjects,
  byStatus,
}: Props) {
  return (
    <section>
      <header className="border-b border-line pb-4">
        <h2 className="display text-2xl text-ink">Pilotage business</h2>
        <p className="mt-2 text-[14px] text-mute">
          Chiffre d&apos;affaires, conversion et panier moyen — où Vellum gagne
          (ou perd) de l&apos;argent.
        </p>
      </header>

      <div className="mt-6 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Cell
          label="CA réalisé"
          value={formatEuro(revenue)}
          hint={`${quotesAccepted} devis acceptés`}
        />
        <Cell label="Devis envoyés" value={quotesSent} hint="Hors brouillons" />
        <Cell
          label="Panier moyen"
          value={formatEuro(Math.round(averageBasket))}
          hint="Par devis accepté"
        />
        <Cell
          label="Projets en retard"
          value={lateProjects}
          hint="Échéance dépassée"
          warn={lateProjects > 0}
        />
      </div>

      <div className="mt-px grid gap-px overflow-hidden rounded-[4px] border border-line bg-line lg:grid-cols-[1fr_0.9fr]">
        <div className="bg-paper p-6">
          <p className="caption">Devis par statut</p>
          <BarChart className="mt-4" data={byStatus} />
        </div>
        <div className="bg-paper p-6">
          <p className="caption">Taux d&apos;acceptation</p>
          <div className="mt-5">
            <Donut
              value={quotesAccepted}
              total={quotesSent}
              label="acceptés"
              sublabel={`${quotesAccepted} / ${quotesSent} devis`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: number | string;
  hint: string;
  warn?: boolean;
}) {
  return (
    <div className="bg-paper p-6">
      <p className="caption">{label}</p>
      <p
        className={cn(
          "font-display mt-3 text-3xl leading-none",
          warn ? "text-crimson" : "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[12px] text-mute">{hint}</p>
    </div>
  );
}

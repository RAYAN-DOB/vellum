import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              {value}
            </p>
          </div>
          <span className="flex size-11 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{detail}</p>
      </CardContent>
    </Card>
  );
}

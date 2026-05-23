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
            <p className="text-sm font-medium text-[#7a7467]">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal text-[#171613]">
              {value}
            </p>
          </div>
          <span className="flex size-11 items-center justify-center rounded-[3px] border border-[#d8d0bf] bg-[#f1eadb] text-[#7b6b4f] transition group-hover:bg-[#171613] group-hover:text-[#f7f3ea]">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-[#6b665a]">{detail}</p>
      </CardContent>
    </Card>
  );
}

import { CheckCircle2, Circle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { WorkflowStep } from "@/types/workflow";

type ProjectTimelineProps = {
  steps: WorkflowStep[];
};

export function ProjectTimeline({ steps }: ProjectTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cycle de vie projet</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {steps.map((step) => {
          const Icon = step.isActive ? CheckCircle2 : Circle;

          return (
            <div className="flex gap-3" key={step.id}>
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[3px] bg-[#171613] text-[#f7f3ea] ring-1 ring-[#34312b]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#171613]">{step.label}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b665a]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
